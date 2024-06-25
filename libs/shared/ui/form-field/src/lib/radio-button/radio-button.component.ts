import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    booleanAttribute,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UniqueSelectionDispatcher } from '../core';
import { P_RADIO_GROUP } from '../radio-group/p-radio-group';

let nextUniqueId = 0;

@Component({
    selector: 'p-radio-button',
    standalone: true,
    imports: [],
    templateUrl: './radio-button.component.html',
    styleUrl: './radio-button.component.scss',
})
export class RadioButton implements OnInit, AfterViewInit, OnDestroy {
    private _uniqueId = `mat-radio-${++nextUniqueId}`;

    /** The unique ID for the radio button. */
    @Input() id: string = this._uniqueId;

    /** Analog to HTML 'name' attribute used to group radios for unique selection. */
    @Input() name = '';

    @Input({ transform: booleanAttribute })
    get checked(): boolean {
        return this._checked;
    }
    set checked(value: boolean) {
        if (this._checked !== value) {
            this._checked = value;
            if (
                value &&
                this.radioGroup &&
                this.radioGroup.value !== this.value
            ) {
                this.radioGroup.selected = this;
            } else if (
                !value &&
                this.radioGroup &&
                this.radioGroup.value === this.value
            ) {
                // When unchecking the selected radio button, update the selected radio
                // property on the group.
                this.radioGroup.selected = null;
            }

            if (value) {
                // Notify all radio buttons with the same name to un-check.
                this._dispatcher.notify(this.id, this.name);
            }
            this._cdr.markForCheck();
        }
    }
    private _checked = false;

    @Input()
    get value(): any {
        return this._value;
    }
    set value(value: any) {
        if (this._value !== value) {
            this._value = value;
            if (this.radioGroup !== null) {
                if (!this.checked) {
                    // Update checked when the value changed to match the radio group's value
                    this.checked = this.radioGroup.value === value;
                }
                if (this.checked) {
                    this.radioGroup.selected = this;
                }
            }
        }
    }
    private _value: any = null;

    @Input({ transform: booleanAttribute })
    get disabled(): boolean {
        return (
            this._disabled ||
            (this.radioGroup !== null && this.radioGroup.disabled)
        );
    }
    set disabled(value: boolean) {
        this._setDisabled(value);
    }
    private _disabled = false;

    @Input({ transform: booleanAttribute })
    get required(): boolean {
        return (
            this._required || (!!this.radioGroup && this.radioGroup.required)
        );
    }
    set required(value: boolean) {
        this._required = value;
    }
    private _required = false;

    @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

    public radioGroup = inject(P_RADIO_GROUP, { optional: true });
    protected _elementRef = inject(ElementRef);

    private _cdr = inject(ChangeDetectorRef);
    private _destroyRef = inject(DestroyRef);
    private _dispatcher = inject(UniqueSelectionDispatcher);
    private _focusMonitor = inject(FocusMonitor);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private _removeUniqueSelectionListener: () => void = () => {};

    get inputId(): string {
        return `${this.id || this._uniqueId}-input`;
    }

    focus(options?: FocusOptions, origin?: FocusOrigin): void {
        if (origin) {
            this._focusMonitor.focusVia(this._inputElement, origin, options);
        } else {
            this._inputElement.nativeElement.focus(options);
        }
    }

    ngOnInit() {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;

            if (this.checked) {
                this.radioGroup.selected = this;
            }

            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }

        this._removeUniqueSelectionListener = this._dispatcher.listen(
            (id, name) => {
                if (id !== this.id && name === this.name) {
                    this.checked = false;
                }
            }
        );
    }

    ngAfterViewInit() {
        this._focusMonitor
            .monitor(this._elementRef, true)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((focusOrigin) => {
                if (!focusOrigin && this.radioGroup) {
                    this.radioGroup._touch();
                }
            });
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._removeUniqueSelectionListener();
    }

    _markForCheck() {
        this._cdr.markForCheck();
    }

    _onInputClick(event: Event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }

    _onInputInteraction(event: Event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();

        if (!this.checked && !this.disabled) {
            const groupValueChanged =
                this.radioGroup && this.value !== this.radioGroup.value;
            this.checked = true;
            // this._emitChangeEvent();

            if (this.radioGroup) {
                this.radioGroup._controlValueAccessorChangeFn(this.value);
                // if (groupValueChanged) {
                //     this.radioGroup._emitChangeEvent();
                // }
            }
        }
    }

    _onTouchTargetClick(event: Event) {
        this._onInputInteraction(event);

        if (!this.disabled) {
            // Normally the input should be focused already, but if the click
            // comes from the touch target, then we might have to focus it ourselves.
            this._inputElement.nativeElement.focus();
        }
    }

    protected _setDisabled(value: boolean) {
        if (this._disabled !== value) {
            this._disabled = value;
            this._cdr.markForCheck();
        }
    }
}
