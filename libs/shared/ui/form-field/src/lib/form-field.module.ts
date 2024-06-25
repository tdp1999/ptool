import { NgModule } from '@angular/core';
import { PError, PInput, PLabel, PPrefix, PSuffix } from './directives';
import { FormField } from './form-field/form-field.component';
import { RadioButton } from './radio-button/radio-button.component';
import { PRadioGroup } from './radio-group/p-radio-group';
import { Select } from './select/select.component';
import { Option } from './option/option.component';

const components = [
    // Directives
    PError,
    PInput,
    PLabel,
    PSuffix,
    PPrefix,

    // Components
    FormField,
    PRadioGroup,
    RadioButton,
    Select,
    Option,
];

@NgModule({
    imports: components,
    exports: components,
})
export class FormFieldModule {}
