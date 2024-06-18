import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    signal,
} from '@angular/core';
import { FormFieldAnimations } from '../core';
import { PError, PInput, PLabel, PPrefix, PSuffix } from '../directives';

@Component({
    selector: 'p-form-field',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [FormFieldAnimations.transitionMessages],
})
export class FormField implements AfterViewInit {
    protected input = contentChild(PInput);
    protected prefix = contentChild(PPrefix);
    protected suffix = contentChild(PSuffix);
    protected label = contentChild(PLabel);
    protected errors = contentChildren(PError, { descendants: true });

    protected hasPrefix = computed(() => !!this.prefix());
    protected hasSuffix = computed(() => !!this.suffix());
    protected hasError = computed(() => {
        return this.errors().length > 0 && this.input()?.errorState();
    });

    protected _subscriptAnimationState = signal<string>('');

    ngAfterViewInit(): void {
        // Enable animations now. This ensures we don't animate on initial render.
        this._subscriptAnimationState.set('enter');
    }
}
