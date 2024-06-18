import { COMPOUND_PERIOD } from '@shared/data-access';

export const INVESTMENT_CALCULATOR_END_AMOUNT_DEFAULT_DATA = {
    startingAmount: 20000,
    duration: 10,
    returnRate: 6,
    compoundPeriod: COMPOUND_PERIOD[2].value,
    contributeAmount: 1000,
};
