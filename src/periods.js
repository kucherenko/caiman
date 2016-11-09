import moment from 'moment';

import
    {PERIOD_SECOND, PERIOD_MINUTE, PERIOD_HOUR, PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, PERIOD_YEAR}
from './constants';

export function childPeriod(period) {
    let subPeriod = null;
    switch (period) {
        case PERIOD_MINUTE:
            subPeriod = PERIOD_SECOND;
            break;
        case PERIOD_HOUR:
            subPeriod = PERIOD_MINUTE;
            break;
        case PERIOD_DAY:
            subPeriod = PERIOD_HOUR;
            break;
        case PERIOD_WEEK:
        case PERIOD_MONTH:
            subPeriod = PERIOD_DAY;
            break;
        case PERIOD_YEAR:
            subPeriod = PERIOD_MONTH;
            break;
        default:
            throw new Error('not supported child for period type')
    }
    return subPeriod;
}

export function parentPeriod(period) {
    let subPeriod = null;
    switch (period) {
        case PERIOD_SECOND:
            subPeriod = PERIOD_MINUTE;
            break;
        case PERIOD_MINUTE:
            subPeriod = PERIOD_HOUR;
            break;
        case PERIOD_HOUR:
            subPeriod = PERIOD_DAY;
            break;
        case PERIOD_DAY:
            subPeriod = PERIOD_MONTH;
            break;
        case PERIOD_MONTH:
            subPeriod = PERIOD_YEAR;
            break;
        default:
            throw new Error('not supported parrent for period type')
    }
    return subPeriod;
}

export function startOfPeriod(date, period) {
    return moment(date).startOf(period);
}

export function bunchOfKeys(date, period) {
    let keys = [], startDate = startOfPeriod(date);
    switch (period) {
        case PERIOD_MINUTE:
            keys = keys.concat([
                startDate.year().toString(),
                startDate.month().toString(),
                startDate.date().toString(),
                startDate.hour().toString(),
                startDate.minute().toString(),
            ]);
            break;
        case PERIOD_HOUR:
            keys = keys.concat([
                startDate.year().toString(),
                startDate.month().toString(),
                startDate.date().toString(),
                startDate.hour().toString(),
            ]);
            break;
        case PERIOD_DAY:
            keys = keys.concat([
                startDate.year().toString(),
                startDate.month().toString(),
                startDate.date().toString(),
            ]);
            break;
        case PERIOD_MONTH:
            keys = keys.concat([
                startDate.year().toString(),
                startDate.month().toString()
            ]);
            break;
        case PERIOD_YEAR:
            keys = keys.concat([startDate.year().toString()]);
            break;
    }
    return keys;
}