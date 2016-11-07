import '.';
import proxyquire from 'proxyquire';
import moment from 'moment';

import
    {PERIOD_SECOND, PERIOD_MINUTE, PERIOD_HOUR, PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, PERIOD_YEAR}
from '../src/constants';

import {childPeriod, parentPeriod, bunchOfKeys} from '../src/periods';


describe("Periods", () => {
    context('Child Period', () => {

        it('second should be sub period for minute', () => {
            childPeriod(PERIOD_MINUTE).should.equal(PERIOD_SECOND);
        });

        it('minute should be sub period for hour', () => {
            childPeriod(PERIOD_HOUR).should.equal(PERIOD_MINUTE);
        });

        it('hour should be sub period for day', () => {
            childPeriod(PERIOD_DAY).should.equal(PERIOD_HOUR);
        });

        it('day should be sub period for week', () => {
            childPeriod(PERIOD_WEEK).should.equal(PERIOD_DAY);
        });

        it('day should be sub period for month', () => {
            childPeriod(PERIOD_MONTH).should.equal(PERIOD_DAY);
        });

        it('minute should be sub period for hour', () => {
            childPeriod(PERIOD_YEAR).should.equal(PERIOD_MONTH);
        });

        it('should not work with other periods', () => {
            (() => {
                childPeriod('ANY_VALUE');
            }).should.throw(Error, /not supported child for period type/);
        });
    });

    context('Parent Period', () => {

        it('minute should be parent period for second', () => {
            parentPeriod(PERIOD_SECOND).should.equal(PERIOD_MINUTE);
        });

        it('hour should be parent period for minute', () => {
            parentPeriod(PERIOD_MINUTE).should.equal(PERIOD_HOUR);
        });

        it('day should be parent period for hour', () => {
            parentPeriod(PERIOD_HOUR).should.equal(PERIOD_DAY);
        });

        it('month should be parent period for day', () => {
            parentPeriod(PERIOD_DAY).should.equal(PERIOD_MONTH);
        });

        it('year should be parent period for month', () => {
            parentPeriod(PERIOD_MONTH).should.equal(PERIOD_YEAR);
        });

        it('should not work with other periods', () => {
            (() => {
                parentPeriod('ANY_VALUE');
            }).should.throw(Error, /not supported parrent for period type/);
        });
    });

    context('Start of Period', () => {
        let sut, startOf, date, moment;

        beforeEach(() => {
            startOf = env.stub();
            date = 'test';

            moment = env.stub().returns({
                startOf: startOf
            });
            sut = proxyquire('../src/periods', {moment});
        });

        it('should move transform date to start of period', () => {
            sut.startOfPeriod(date, PERIOD_SECOND);
            moment.should.have.been.calledWith(date);
            startOf.should.have.been.calledWith(PERIOD_SECOND);
        });
    });

    context('Bunch of Keys', () => {
        let date;
        beforeEach(() => {
            date = moment('2016-01-01T23:35:01');
        });

        it('should generate bunch of keys by date and period for year', () => {
            bunchOfKeys(date, PERIOD_YEAR).should.deep.equal(
                ['2016']
            );
        });

        it('should generate bunch of keys by date and period for month', () => {
            bunchOfKeys(date, PERIOD_MONTH).should.deep.equal([
                '2016',
                '0'
            ]);
        });

        it('should generate bunch of keys by date and period for day', () => {
            bunchOfKeys(date, PERIOD_DAY).should.deep.equal([
                '2016',
                '0',
                '1'
            ]);
        });

        it('should generate bunch of keys by date and period for hour', () => {
            bunchOfKeys(date, PERIOD_HOUR).should.deep.equal([
                '2016',
                '0',
                '1',
                '23'
            ]);
        });
        it('should generate bunch of keys by date and period for minute', () => {
            bunchOfKeys(date, PERIOD_MINUTE).should.deep.equal([
                '2016',
                '0',
                '1',
                '23',
                '35'
            ]);
        });
    });

});