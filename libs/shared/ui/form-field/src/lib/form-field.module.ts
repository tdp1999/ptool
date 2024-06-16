import { NgModule } from '@angular/core';
import { PError } from './directives/p-error';
import { PInput } from './directives/p-input';
import { PLabel } from './directives/p-label';
import { PPrefix } from './directives/p-prefix';
import { PSuffix } from './directives/p-suffix';
import { FormFieldComponent } from './form-field/form-field.component';

const components = [
    FormFieldComponent,
    PError,
    PInput,
    PLabel,
    PSuffix,
    PPrefix,
];

@NgModule({
    imports: components,
    exports: components,
})
export class FormFieldModule {}
