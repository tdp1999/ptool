import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
} from '@angular/core';
import { PError } from '../directives/p-error';
import { PLabel } from '../directives/p-label';
import { PPrefix } from '../directives/p-prefix';
import { PSuffix } from '../directives/p-suffix';

@Component({
    selector: 'p-form-field',
    standalone: true,
    imports: [CommonModule, PLabel, PError, PPrefix, PSuffix],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements AfterViewInit {
    @ContentChild(PLabel) _label: PLabel | undefined;
    @ContentChild(PError) _error: PError | undefined;
    @ContentChild(PPrefix) _prefix: PPrefix | undefined;
    @ContentChild(PSuffix) _suffix: PSuffix | undefined;

    ngAfterViewInit(): void {
        console.log(this._label, this._error, this._prefix, this._suffix);
    }
}
