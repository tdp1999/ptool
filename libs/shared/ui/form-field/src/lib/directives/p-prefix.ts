import { Component, Input } from '@angular/core';

@Component({
    selector: 'p-prefix',
    standalone: true,
    template: ` <img
        class="flex-shrink-0 text-red-500 size-4 dark:text-neutral-500"
        [src]="icon"
        alt="_iconName"
    />`,
})
export class PPrefix {
    @Input({ required: true })
    set icon(value: string) {
        this._icon = 'icons/' + value + '.svg';
        this._iconName = value;
    }

    get icon(): string {
        return this._icon;
    }

    private _icon = '';
    protected _iconName = '';
}
