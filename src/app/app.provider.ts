import { Provider } from '@angular/core';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { ERROR_MESSAGES } from '@shared/core';
import { FORM_ERRORS } from '@shared/data-access';

const matFormFieldDefaultOption: MatFormFieldDefaultOptions = {
    appearance: 'outline',
};

export const thirdPartyProviders: Provider[] = [
    {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: matFormFieldDefaultOption,
    },
];

export const localConfigProviders: Provider[] = [
    {
        provide: ERROR_MESSAGES,
        useValue: FORM_ERRORS,
    },
];
