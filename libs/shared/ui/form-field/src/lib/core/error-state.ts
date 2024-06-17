import { signal } from '@angular/core';
import {
    AbstractControl,
    FormGroupDirective,
    NgControl,
    NgForm,
} from '@angular/forms';

export class ErrorStateTracker {
    errorState = signal(false);

    constructor(
        public ngControl: NgControl | null,
        private _parentFormGroup: FormGroupDirective | null,
        private _parentForm: NgForm | null
    ) {}

    updateErrorState() {
        const oldState = this.errorState();
        const parent = this._parentFormGroup || this._parentForm;
        const control = this.ngControl
            ? (this.ngControl.control as AbstractControl)
            : null;
        const newState = this._isErrorState(control, parent) ?? false;

        if (newState !== oldState) {
            this.errorState.set(newState);
        }
    }

    private _isErrorState(
        control: AbstractControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        return !!(
            control &&
            control.invalid &&
            (control.touched || (form && form.submitted))
        );
    }
}
