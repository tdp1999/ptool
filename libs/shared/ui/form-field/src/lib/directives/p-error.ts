import { Directive, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `PError`. It serves as
 * alternative token to the actual `PError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const P_ERROR = new InjectionToken<PError>('PError');

@Directive({
    selector: 'p-error',
    standalone: true,
    providers: [{ provide: P_ERROR, useExisting: PError }],
})
export class PError {}
