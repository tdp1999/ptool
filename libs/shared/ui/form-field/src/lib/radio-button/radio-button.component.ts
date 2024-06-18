import { Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'p-radio-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './radio-button.component.html',
    styleUrl: './radio-button.component.scss',
})
export class RadioButton {
    @Input({ transform: booleanAttribute })
    get checked(): boolean {
        return this._checked;
    }
    set checked(value: boolean) {
        if (this._checked !== value) {
            this._checked = value;
            // if (
            //     value &&
            //     this.radioGroup &&
            //     this.radioGroup.value !== this.value
            // ) {
            //     this.radioGroup.selected = this;
            // } else if (
            //     !value &&
            //     this.radioGroup &&
            //     this.radioGroup.value === this.value
            // ) {
            //     // When unchecking the selected radio button, update the selected radio
            //     // property on the group.
            //     this.radioGroup.selected = null;
            // }

            // if (value) {
            //     // Notify all radio buttons with the same name to un-check.
            //     this._radioDispatcher.notify(this.id, this.name);
            // }
            // this._changeDetector.markForCheck();
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
            // if (this.radioGroup !== null) {
            //     if (!this.checked) {
            //         // Update checked when the value changed to match the radio group's value
            //         this.checked = this.radioGroup.value === value;
            //     }
            //     if (this.checked) {
            //         this.radioGroup.selected = this;
            //     }
            // }
        }
    }
    private _value: any = null;

    /** Analog to HTML 'name' attribute used to group radios for unique selection. */
    @Input() name = 'test';
}
