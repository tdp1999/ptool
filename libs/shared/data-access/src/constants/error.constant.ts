export const FORM_ERRORS: Record<
    string,
    string | ((...args: any[]) => string)
> = {
    REQUIRED: 'This field is required',
    MAX_LENGTH: (maxLength: number) =>
        `The maximum length of this field is ${maxLength}`,
    MIN_LENGTH: (minLength: number) =>
        `The minimum length of this field is ${minLength}`,
    MAX_VALUE: (maxValue: number) =>
        `The maximum value of this field is ${maxValue}`,
    MIN_VALUE: (minValue: number) =>
        `The minimum value of this field is ${minValue}`,
    VALUE_BETWEEN: (minValue: number, maxValue: number) =>
        `The value must be between ${minValue} and ${maxValue}`,
    EMAIL: 'Invalid email address',
} as const;
