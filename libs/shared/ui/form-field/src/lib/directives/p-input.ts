import { Directive, HostBinding, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[pInput]',
    standalone: true,
})
export class PInput {
    public ngControl = inject(NgControl, { optional: true, self: true });

    @HostBinding('class') commonClass = 'focus:outline-none w-full';
}
