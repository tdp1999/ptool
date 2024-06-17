import {
    Directive,
    DoCheck,
    HostBinding,
    computed,
    inject,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateTracker } from '../core';

@Directive({
    selector: '[pInput]',
    standalone: true,
})
export class PInput implements DoCheck {
    @HostBinding('class') commonClass = 'focus:outline-none w-full';

    public ngControl = inject(NgControl, { optional: true, self: true });

    private _parentForm = inject(NgForm, { optional: true });
    private _parentFormGroup = inject(FormGroupDirective, { optional: true });
    private _errorStateTracker = new ErrorStateTracker(
        this.ngControl,
        this._parentFormGroup,
        this._parentForm
    );
    public errorState = computed(() => this._errorStateTracker?.errorState());

    ngDoCheck(): void {
        if (this.ngControl) {
            this._errorStateTracker.updateErrorState();
        }
    }
}
