import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { PError } from '../directives/p-error';
import { PInput } from '../directives/p-input';
import { PLabel } from '../directives/p-label';
import { PPrefix } from '../directives/p-prefix';
import { PSuffix } from '../directives/p-suffix';
import { NgControl } from '@angular/forms';

@Component({
    selector: 'p-form-field',
    standalone: true,
    imports: [CommonModule, PLabel, PError, PPrefix, PSuffix],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements AfterContentInit, OnInit {
    @ContentChild(PLabel) _label: PLabel | undefined;
    @ContentChild(PError) _error: PError | undefined;
    @ContentChild(PPrefix) _prefix: PPrefix | undefined;
    @ContentChild(PSuffix) _suffix: PSuffix | undefined;
    @ContentChild(PInput) _input: PInput | undefined;

    private _ngControl = inject(NgControl, { optional: true, self: true });
    private _destroyRef = inject(DestroyRef);

    protected hasPrefix = false;
    protected hasSuffix = false;
    protected hasError = signal(false);

    ngOnInit(): void {
        this.hasError.set(!!this._ngControl?.statusChanges);
    }

    ngAfterContentInit(): void {
        this.hasPrefix = !!this._prefix;
        this.hasSuffix = !!this._suffix;

        console.log(this._ngControl);
        this._ngControl?.statusChanges
            ?.pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((value) => {
                console.log(value);
            });
    }
}
