import { Component, Input } from '@angular/core';

@Component({
    selector: 'p-label',
    standalone: true,
    template: `<label
        [attr.for]="for"
        class="block mb-1 text-sm font-medium dark:text-white"
        ><ng-content></ng-content
    ></label>`,
})
export class PLabel {
    @Input() for!: string;
}
