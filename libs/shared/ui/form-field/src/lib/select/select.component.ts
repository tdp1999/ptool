/* eslint-disable @typescript-eslint/no-empty-function */
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { hasModifierKey } from '@angular/cdk/keycodes';
import {
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    OverlayModule,
    ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
    AfterViewInit,
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    DoCheck,
    ElementRef,
    HostListener,
    Injector,
    Input,
    OnDestroy,
    booleanAttribute,
    computed,
    contentChildren,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    ControlValueAccessor,
    FormGroupDirective,
    NgControl,
    NgForm,
} from '@angular/forms';
import {
    Observable,
    Subject,
    Subscription,
    defer,
    finalize,
    merge,
    startWith,
    switchMap,
    take,
    takeUntil,
    tap,
} from 'rxjs';
import {
    ErrorStateTracker,
    SelectAnimations,
    _getOptionScrollPosition,
    getSelectNonFunctionValueError,
} from '../core';
import { Option, OptionSelectionChange } from '../option/option.component';

let nextUniqueId = 0;

@Component({
    selector: 'p-select',
    standalone: true,
    imports: [OverlayModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [SelectAnimations.transformPanel],
    host: {
        ngSkipHydration: 'true',
        role: 'combobox',
        id: '_uid',
        '[attr.tabindex]': 'disabled ? -1 : _tabIndex',
        '[class.select-disabled]': '_disabled()',
        '[class.select-active]': '_isOpen()',
    },
})
export class Select
    implements ControlValueAccessor, AfterViewInit, DoCheck, OnDestroy
{
    /* States */
    _tabIndex = 0;
    _uid = `select-${nextUniqueId++}`;
    _previousControl: AbstractControl | null | undefined;
    _selectionModel = new SelectionModel<Option>(false);
    _keyManager: ActiveDescendantKeyManager<Option> | undefined;
    _optionChangeSubscription: Subscription | undefined;

    /* Input - Output */
    label = input<string>('');
    placeholder = input<string>('');

    @Input()
    get value() {
        return this._value;
    }
    set value(newValue: any) {
        const hasAssigned = this._assignValue(newValue);

        if (hasAssigned) {
            this._onChange(newValue);
        }
    }
    _value: any = null;

    @Input({ transform: booleanAttribute })
    get disabled() {
        return this._disabled();
    }
    set disabled(value: boolean) {
        this._disabled.set(value);
    }
    _disabled = signal(false);

    @Input()
    get compareWith() {
        return this._compareWith;
    }
    set compareWith(fn: (o1: any, o2: any) => boolean) {
        if (typeof fn !== 'function') {
            throw getSelectNonFunctionValueError();
        }

        this._compareWith = fn;
        this._selectionModel.compareWith = fn;
    }
    _compareWith = (o1: any, o2: any) => o1 === o2;

    /* Template Refs */
    _panel = viewChild<ElementRef>('panel');
    _options = contentChildren(Option, { descendants: true });
    _overlayDir = viewChild(CdkConnectedOverlay);
    _overlayOrigin = viewChild(CdkOverlayOrigin);

    /* Injectables */
    _cdr = inject(ChangeDetectorRef);
    _injector = inject(Injector);
    _platform = inject(Platform);
    _elementRef = inject(ElementRef);
    _destroyRef = inject(DestroyRef);
    _viewportRuler = inject(ViewportRuler);

    _control = inject(NgControl, { optional: true, self: true });
    _parentForm = inject(NgForm, { optional: true });
    _parentFormGroup = inject(FormGroupDirective, { optional: true });

    /* Reactive States */
    _focused = signal(false);
    _viewportChange = toSignal(this._viewportRuler.change());
    _errorStateTracker = new ErrorStateTracker(
        this._control,
        this._parentFormGroup,
        this._parentForm
    );
    errorState = computed(() => this._errorStateTracker?.errorState());
    _isOpen = signal<boolean>(false);
    _canOpen = computed(
        () => !this._isOpen() && !this._disabled() && this._options().length > 0
    );
    _overlayWidth = computed(() => {
        if (!this._platform.isBrowser) return 0;
        if (!this._isOpen()) return 0;
        const event = this._viewportChange();
        const refToMeasure =
            this._overlayOrigin()?.elementRef || this._elementRef;
        return refToMeasure?.nativeElement?.getBoundingClientRect().width || 0;
    });
    _options$ = toObservable(this._options);
    _initialized = new Subject<void>();
    _optionSelectionChanges: Observable<OptionSelectionChange> = defer(() => {
        const options = this._options();

        if (options) {
            return this._options$.pipe(
                switchMap(() =>
                    merge(...options.map((option) => option.onSelectionChange))
                )
            );
        }

        return this._initialized.pipe(
            switchMap(() => this._optionSelectionChanges)
        );
    });

    /* Bindings */
    @HostListener('focus', ['$event']) _onFocus() {
        if (this.disabled) return;
        this._focused.set(true);
    }

    @HostListener('blur', ['$event']) _onBlur() {
        this._focused.set(false);
        this._keyManager?.cancelTypeahead();

        if (this.disabled || this._isOpen()) return;

        this._onTouched();
        this._cdr.markForCheck();
    }

    /* Methods */
    _onTouched = () => {};
    _onChange: (value: any) => void = () => {};

    constructor(@Attribute('tabindex') tabIndex: string) {
        if (this._control) {
            this._control.valueAccessor = this;
        }

        this._tabIndex = parseInt(tabIndex) || 0;
    }

    ngAfterViewInit(): void {
        this._initialized.next();
        this._initialized.complete();

        this._initKeyManager();

        this._selectionModel.changed
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((event) => {
                event.added.forEach((option) => option.select());
                event.removed.forEach((option) => option.deselect());
            });

        this._options$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((val) => {
                console.log('options changed', val);
                this._resetOptions();
                this._initializeSelection();
            });
    }

    ngDoCheck(): void {
        const ngControl = this._control;
        if (!ngControl) return;
        if (this._previousControl !== ngControl.control) {
            if (
                this._previousControl !== undefined &&
                ngControl.disabled !== null &&
                ngControl.disabled !== this.disabled
            ) {
                this.disabled = ngControl.disabled;
            }

            this._previousControl = ngControl.control;
        }

        this._errorStateTracker.updateErrorState();
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy');

        this._keyManager?.destroy();
    }

    writeValue(value: any): void {
        this._assignValue(value);
    }

    registerOnChange(fn: (value: any) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this._cdr.markForCheck();
    }

    /* Public API */
    toggle(): void {
        this._isOpen() ? this.close() : this.open();
    }

    open() {
        if (!this._canOpen()) return;

        this._isOpen.set(true);
        this._keyManager?.withHorizontalOrientation(null);
        this._highlightCorrectOption();
        this._cdr.markForCheck();
    }

    close() {
        if (!this._isOpen()) return;

        this._isOpen.set(false);
        this._onTouched();
        this._cdr.markForCheck();
    }

    focus() {
        this._elementRef.nativeElement.focus();
    }

    /** Whether the select has a value. */
    get empty() {
        return !this._selectionModel || this._selectionModel.isEmpty();
    }

    /** The currently selected option. */
    get selected(): Option {
        return this._selectionModel?.selected[0];
    }

    /** The value displayed in the trigger. */
    get triggerValue(): string {
        return this.empty ? '' : this._selectionModel.selected[0]._viewValue();
    }

    /* Event Handlers */
    _handleKeydown(event: KeyboardEvent) {
        if (this.disabled) return;

        this._isOpen()
            ? this._handleOpenKeydown(event)
            : this._handleClosedKeydown(event);
    }

    _onAttached(): void {
        this._overlayDir()
            ?.positionChange.pipe(take(1))
            .subscribe(() => {
                this._cdr.detectChanges();
                this._positioningSettled();
            });
    }

    /* Helper Functions */

    /** Handles keyboard events while the select is closed. */
    private _handleClosedKeydown(event: KeyboardEvent): void {
        const manager = this._keyManager;
        if (!manager) return;

        const key = event.key;
        const isArrowKey =
            key === 'ArrowDown' ||
            key === 'ArrowUp' ||
            key === 'ArrowLeft' ||
            key === 'ArrowRight';
        const isOpenKey = key === 'Enter' || key === ' ';

        // Open the select on ALT + arrow key to match the native <select>
        if (
            (!manager.isTyping() && isOpenKey && !hasModifierKey(event)) ||
            (event.altKey && isArrowKey)
        ) {
            event.preventDefault(); // prevents the page from scrolling down when pressing space
            this.open();
        } else {
            manager.onKeydown(event);
        }
    }

    /** Handles keyboard events when the selected is open. */
    private _handleOpenKeydown(event: KeyboardEvent): void {
        const manager = this._keyManager;
        if (!manager) return;
        const key = event.key;
        const isArrowKey = key === 'ArrowDown' || key === 'ArrowUp';
        const isTyping = manager.isTyping();

        if (isArrowKey && event.altKey) {
            // Close the select on ALT + arrow key to match the native <select>
            event.preventDefault();
            this.close();
            // Don't do anything in this case if the user is typing,
            // because the typing sequence can include the space key.
        } else if (
            !isTyping &&
            (key === 'Enter' || key === ' ') &&
            manager.activeItem &&
            !hasModifierKey(event)
        ) {
            event.preventDefault();
            manager.activeItem._selectViaInteraction();
        } else if (!isTyping && key === 'a' && event.ctrlKey) {
            event.preventDefault();
            const hasDeselectedOptions = this._options().some(
                (opt) => !opt.disabled && !opt._selected()
            );

            this._options().forEach((option) => {
                if (!option.disabled) {
                    hasDeselectedOptions ? option.select() : option.deselect();
                }
            });
        } else {
            const previouslyFocusedIndex = manager.activeItemIndex;

            manager.onKeydown(event);

            if (
                isArrowKey &&
                event.shiftKey &&
                manager.activeItem &&
                manager.activeItemIndex !== previouslyFocusedIndex
            ) {
                manager.activeItem._selectViaInteraction();
            }
        }
    }

    private _scrollOptionIntoView(index: number): void {
        const option = this._options()[index];

        if (option) {
            const panel: HTMLElement = this._panel()?.nativeElement;
            const element = option.getHostElement();

            panel.scrollTop = _getOptionScrollPosition(
                element.offsetTop,
                element.offsetHeight,
                panel.scrollTop,
                panel.offsetHeight
            );
        }
    }

    /** Called when the panel has been opened and the overlay has settled on its final position. */
    private _positioningSettled() {
        this._scrollOptionIntoView(this._keyManager?.activeItemIndex || 0);
    }

    private _initializeSelection(): void {
        // Defer setting the value in order to avoid the "Expression
        // has changed after it was checked" errors from Angular.
        Promise.resolve().then(() => {
            if (this._control) {
                this.value = this._control.value;
            }

            this._setSelectionByValue(this._value);
        });
    }

    private _selectOptionByValue(value: any): Option | undefined {
        const correspondingOption = this._options().find((option: Option) => {
            // Skip options that are already in the model. This allows us to handle cases
            // where the same primitive value is selected multiple times.
            if (this._selectionModel.isSelected(option)) {
                return false;
            }

            try {
                // Treat null as a special reset value.
                return (
                    option.value != null &&
                    this._compareWith(option.value, value)
                );
            } catch (error) {
                console.warn(error);
                return false;
            }
        });

        if (correspondingOption) {
            this._selectionModel.select(correspondingOption);
        }

        return correspondingOption;
    }

    private _setSelectionByValue(value: any | any[]): void {
        this._options().forEach((option) => option.setInactiveStyles());
        this._selectionModel.clear();

        const correspondingOption = this._selectOptionByValue(value);

        // Shift focus to the active item. Note that we shouldn't do this in multiple
        // mode, because we don't know what option the user interacted with last.
        if (correspondingOption) {
            this._keyManager?.updateActiveItem(correspondingOption);
        } else if (!this._isOpen()) {
            // Otherwise reset the highlighted option. Note that we only want to do this while
            // closed, because doing it while open can shift the user's focus unnecessarily.
            this._keyManager?.updateActiveItem(-1);
        }
        this._cdr.markForCheck();
    }

    private _assignValue(newValue: any | any[]): boolean {
        if (newValue === this._value) return false;

        if (this._options()) {
            this._setSelectionByValue(newValue);
        }

        this._value = newValue;
        return true;
    }

    /**
     * Highlights the selected item. If no option is selected, it will highlight
     * the first *enabled* option.
     */
    private _highlightCorrectOption(): void {
        if (!this._keyManager) return;

        if (!this.empty) {
            this._keyManager.setActiveItem(this._selectionModel.selected[0]);
            return;
        }

        // Find the index of the first *enabled* option. Avoid calling `_keyManager.setActiveItem`
        // because it activates the first option that passes the skip predicate, rather than the
        // first *enabled* option.
        let firstEnabledOptionIndex = -1;
        for (let index = 0; index < this._options().length; index++) {
            const option = this._options()[index];
            if (!option.disabled) {
                firstEnabledOptionIndex = index;
                break;
            }
        }

        this._keyManager.setActiveItem(firstEnabledOptionIndex);
    }

    /** Emits change event to set the model value. */
    private _propagateChanges(fallbackValue?: any): void {
        const valueToEmit = this.selected
            ? (this.selected as Option).value
            : fallbackValue;

        this._value = valueToEmit;
        // this.valueChange.emit(valueToEmit);
        this._onChange(valueToEmit);
        // this.selectionChange.emit(this._getChangeEvent(valueToEmit));
        this._cdr.markForCheck();
    }

    /** Drops current option subscriptions and IDs and resets from scratch. */
    private _resetOptions(): void {
        if (this._optionChangeSubscription) {
            this._optionChangeSubscription.unsubscribe();
        }

        this._optionChangeSubscription = this._optionSelectionChanges
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((event) => {
                this._onSelect(event.source, event.isUserInput);

                if (event.isUserInput && this._isOpen()) {
                    this.close();
                    this.focus();
                }
            });

        // // Listen to changes in the internal state of the options and react accordingly.
        // // Handles cases like the labels of the selected options changing.
        // merge(...this._options().map((option) => option._stateChanges))
        //     .pipe(takeUntil(changedOrDestroyed))
        //     .subscribe(() => {
        //         // `_stateChanges` can fire as a result of a change in the label's DOM value which may
        //         // be the result of an expression changing. We have to use `detectChanges` in order
        //         // to avoid "changed after checked" errors (see #14793).
        //         this._changeDetectorRef.detectChanges();
        //         this.stateChanges.next();
        //     });
    }

    /** Invoked when an option is clicked. */
    private _onSelect(option: Option, isUserInput: boolean): void {
        const value = option.value();
        console.log('Selected: ', value);
        const wasSelected = this._selectionModel.isSelected(option);

        if (value == null) {
            option.deselect();
            this._selectionModel.clear();

            if (this.value != null) {
                this._propagateChanges(value);
            }
        } else {
            if (wasSelected !== option._selected()) {
                option._selected()
                    ? this._selectionModel.select(option)
                    : this._selectionModel.deselect(option);
            }

            if (isUserInput) {
                this._keyManager?.setActiveItem(option);
            }
        }

        if (wasSelected !== this._selectionModel.isSelected(option)) {
            this._propagateChanges();
        }
    }

    // The user can focus disabled options using the keyboard, but the user cannot click disabled
    // options.
    private _skipPredicate = (option: Option) => {
        // Support keyboard focusing disabled options in an ARIA listbox.
        if (this._isOpen()) return false;

        // When the panel is closed, skip over disabled options. Support options via the UP/DOWN arrow
        // keys on a closed select. ARIA listbox interaction pattern is less relevant when the panel is
        // closed.
        return option.disabled;
    };

    private _initKeyManager() {
        this._keyManager = new ActiveDescendantKeyManager<Option>(
            this._options,
            this._injector
        )
            .withVerticalOrientation()
            .withHomeAndEnd()
            .withPageUpDown()
            .withAllowedModifierKeys(['shiftKey'])
            .skipPredicate(this._skipPredicate);

        this._keyManager.tabOut.subscribe(() => {
            if (this._isOpen()) {
                // Select the active item when tabbing away. This is consistent with how the native
                // select behaves. Note that we only want to do this in single selection mode.
                if (this._keyManager?.activeItem) {
                    this._keyManager.activeItem._selectViaInteraction();
                }

                // Restore focus to the trigger before closing. Ensures that the focus
                // position won't be lost if the user got focus into the overlay.
                this.focus();
                this.close();
            }
        });

        this._keyManager.change.subscribe(() => {
            if (this._isOpen() && this._panel()) {
                this._scrollOptionIntoView(
                    this._keyManager?.activeItemIndex || 0
                );
            } else if (!this._isOpen() && this._keyManager?.activeItem) {
                this._keyManager.activeItem._selectViaInteraction();
            }
        });
    }
}
