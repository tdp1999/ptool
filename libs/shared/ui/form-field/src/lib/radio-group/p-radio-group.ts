import {
    AfterContentInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    HostBinding,
    InjectionToken,
    Input,
    OnDestroy,
    QueryList,
    booleanAttribute,
    forwardRef,
    inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RadioButton } from '../radio-button/radio-button.component';

// Increasing integer for generating unique ids for radio components.
let nextUniqueId = 0;
export const P_RADIO_GROUP = new InjectionToken<PRadioGroup>('PRadioGroup');

@Directive({
    selector: 'p-radio-group',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PRadioGroup),
            multi: true,
        },
        {
            provide: P_RADIO_GROUP,
            useExisting: PRadioGroup,
        },
    ],
})
export class PRadioGroup
    implements AfterContentInit, OnDestroy, ControlValueAccessor
{
    @HostBinding('class') class = 'flex flex-col gap-y-1';

    @Input()
    get value(): any {
        return this._value;
    }
    set value(newValue: any) {
        if (this._value !== newValue) {
            // Set this before proceeding to ensure no circular loop occurs with selection.
            this._value = newValue;

            this._updateSelectedRadioFromValue();
            this._checkSelectedRadioButton();
        }
    }
    private _value: any = null;

    @Input()
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
        this._updateRadioButtonNames();
    }
    private _name = `p-radio-group-${nextUniqueId++}`;

    @Input()
    get selected() {
        return this._selected;
    }
    set selected(selected: RadioButton | null) {
        this._selected = selected;
        this.value = selected ? selected.value : null;
        this._checkSelectedRadioButton();
    }
    private _selected: RadioButton | null = null;

    /** Whether the `value` has been set to its initial value. */
    private _isInitialized = false;

    @Input({ transform: booleanAttribute })
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = value;
        this._markRadiosForCheck();
    }
    private _disabled = false;

    @Input({ transform: booleanAttribute })
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = value;
        this._markRadiosForCheck();
    }
    private _required = false;

    private _buttonChanges!: Subscription;

    private _cdr = inject(ChangeDetectorRef);

    /** The method to be called in order to update ngModel */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _controlValueAccessorChangeFn: (value: any) => void = () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTouched: () => any = () => {};

    @ContentChildren(forwardRef(() => RadioButton), { descendants: true })
    _radios!: QueryList<RadioButton>;

    // private _radios = contentChildren<RadioButton>(
    //     forwardRef(() => RadioButton),
    //     { descendants: true }
    // );

    _checkSelectedRadioButton() {
        if (this._selected && !this._selected.checked) {
            this._selected.checked = true;
        }
    }

    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     */
    ngAfterContentInit() {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MatRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MatRadioGroup.
        this._isInitialized = true;

        // Clear the `selected` button when it's destroyed since the tabindex of the rest of the
        // buttons depends on it. Note that we don't clear the `value`, because the radio button
        // may be swapped out with a similar one and there are some internal apps that depend on
        // that behavior.
        this._buttonChanges = this._radios.changes.subscribe(() => {
            if (
                this.selected &&
                !this._radios.find((radio) => radio === this.selected)
            ) {
                this._selected = null;
            }
        });
    }

    ngOnDestroy() {
        this._buttonChanges?.unsubscribe();
    }

    _touch() {
        if (this.onTouched) {
            this.onTouched();
        }
    }

    private _updateRadioButtonNames(): void {
        if (this._radios) {
            this._radios.forEach((radio) => {
                radio.name = this.name;
                radio._markForCheck();
            });
        }
    }

    private _updateSelectedRadioFromValue(): void {
        // If the value already matches the selected radio, do nothing.
        const isAlreadySelected =
            this._selected !== null && this._selected.value === this._value;

        if (this._radios && !isAlreadySelected) {
            this._selected = null;
            this._radios.forEach((radio) => {
                radio.checked = this.value === radio.value;
                if (radio.checked) {
                    this._selected = radio;
                }
            });
        }
    }

    _markRadiosForCheck() {
        if (this._radios) {
            this._radios.forEach((radio) => radio._markForCheck());
        }
    }

    writeValue(value: any) {
        this.value = value;
        this._cdr.markForCheck();
    }

    registerOnChange(fn: (value: any) => void) {
        this._controlValueAccessorChangeFn = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
        this._cdr.markForCheck();
    }
}
