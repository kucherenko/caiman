import '.';

import {aggregate, summarize, averages} from '../src/strategies';

describe("Strategies", () => {
    let data, oldData;

    context('agrigate', () => {

        it('should add new data to old data', () => {
            oldData = [1, 2, 3];
            data = 4;
            aggregate(data, oldData).should.deep.equal([1, 2, 3, 4]);
        });

    });

    context('summarize', () => {

        it('should add new data to old data', () => {
            oldData = 2;
            data = 2;
            summarize(data, oldData).should.equal(4);
        });

    });

    context('averages', () => {

        it('should add new data to old data', () => {
            averages(3, {n:1, average: 7}).should.deep.equal({
                n: 2,
                average: 5
            });
        });

    });
});