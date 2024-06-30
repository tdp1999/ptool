import { InjectionToken, Pipe, PipeTransform, inject } from '@angular/core';

export type ErrorList = Record<string, string | ((...args: any[]) => string)>;
export const ERROR_MESSAGES = new InjectionToken<ErrorList>('ERROR_MESSAGES');
export const DEFAULT_MESSAGE = new InjectionToken<string>('DEFAULT_MESSAGE');

@Pipe({
    name: 'errorMessage',
    standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
    private _errorList = inject(ERROR_MESSAGES, { optional: true }) ?? {};
    private _defaultMessage =
        inject(DEFAULT_MESSAGE, { optional: true }) || 'Unknown error';

    transform(key: string, ...args: unknown[]): string {
        const error = this._errorList[key];

        if (!error) {
            return this._defaultMessage;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (typeof error === 'function') {
            return error(...args);
        }

        return this._defaultMessage;
    }
}
