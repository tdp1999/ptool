import { NgModule } from '@angular/core';
import { PError, PInput, PLabel, PPrefix, PSuffix } from './directives';
import { FormField } from './form-field/form-field.component';

const components = [FormField, PError, PInput, PLabel, PSuffix, PPrefix];

@NgModule({
    imports: components,
    exports: components,
})
export class FormFieldModule {}
