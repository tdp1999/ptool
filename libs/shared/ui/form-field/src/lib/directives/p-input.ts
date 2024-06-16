import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[pInput]',
    standalone: true,
})
export class PInput {
    public ngControl = inject(NgControl, { optional: true, self: true });
}
