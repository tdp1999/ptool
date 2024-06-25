import { FocusOrigin } from '@angular/cdk/a11y';
import { hasModifierKey } from '@angular/cdk/keycodes';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';

let _uniqueIdCounter = 0;

/** Event object emitted by Option when selected or deselected. */
export class OptionSelectionChange<T = any> {
    constructor(
        /** Reference to the option that emitted the event. */
        public source: Option<T>,
        /** Whether the change in the option's value was a result of a user action. */
        public isUserInput = false
    ) {}
}

@Component({
    selector: 'p-option',
    standalone: true,
    imports: [],
    host: {
        '[class.option-disabled]': 'disabled()',
    },
    templateUrl: './option.component.html',
    styleUrl: './option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option<T = any> {
    /* Input - Output */
    _id = input(`option-${_uniqueIdCounter++}`);
    value = input<T>();
    disabled = input(false, { transform: booleanAttribute });
    onSelectionChange = output<OptionSelectionChange<T>>();

    /* Injectables */
    _cdr = inject(ChangeDetectorRef);
    _element = inject(ElementRef);

    /* States */
    _text = viewChild<ElementRef<HTMLElement> | null>('text');
    _viewValue = computed(() =>
        (this._text()?.nativeElement?.textContent || '').trim()
    );
    _active = signal(false);
    _selected = signal(false);

    private _mostRecentViewValue = '';

    /* Bindings */
    @HostBinding('id') id = this._id;
    @HostBinding('role') role = 'option';
    @HostBinding('class') class =
        'group relative py-2 pl-3 text-gray-900 cursor-pointer select-none pr-9 hover:bg-indigo-600 hover:text-white';

    @HostListener('click') _selectViaInteraction(): void {
        if (this.disabled()) return;

        this._selected.update((v) => !v);
        this._emitSelectionChangeEvent(true);
    }

    @HostListener('keydown', ['$event']) _keydown(event: KeyboardEvent) {
        this._handleKeydown(event);
    }

    getHostElement(): HTMLElement {
        return this._element.nativeElement;
    }

    select(emitValue = true): void {
        if (this._selected()) return;

        this._selected.set(true);

        emitValue && this._emitSelectionChangeEvent();
    }

    deselect(emitValue = true): void {
        if (!this._selected()) return;

        this._selected.set(false);
        emitValue && this._emitSelectionChangeEvent();
    }

    _emitSelectionChangeEvent(isUserInput = false): void {
        this.onSelectionChange.emit(
            new OptionSelectionChange<T>(this, isUserInput)
        );
    }

    _handleKeydown(event: KeyboardEvent): void {
        if (
            (event.key !== 'Enter' && event.key !== 'Space') ||
            hasModifierKey(event)
        )
            return;

        this._selectViaInteraction();
        event.preventDefault();
    }

    setActiveStyles(): void {
        if (this._active()) return;
        this._active.set(true);
        this._cdr.markForCheck();
    }

    setInactiveStyles(): void {
        if (!this._active()) return;

        this._active.set(false);
        this._cdr.markForCheck();
    }

    focus(_origin?: FocusOrigin, options?: FocusOptions): void {
        // Note that we aren't using `_origin`, but we need to keep it because some internal consumers
        // use `MatOption` in a `FocusKeyManager` and we need it to match `FocusableOption`.
        const element = this.getHostElement();

        if (typeof element.focus === 'function') {
            element.focus(options);
        }
    }
}
