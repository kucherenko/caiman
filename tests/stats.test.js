import '.';

import
{
    PERIOD_SECOND,
    PERIOD_MINUTE
}
from '../src/constants';

import Stats from '../src/stats';

describe("Stats", () => {
    let driver, sut, type, date, data, options;

    beforeEach(() => {
        type = "test_type";
        date = "test_date";
        data = "test_period";
        driver = {
            save: env.stub(),
            getOne: env.stub().returns(data),
            getCollection: env.stub().returns([data])
        };

        sut = new Stats(type, {driver: {type: "files"}});
        sut.driver = driver;
    });

    context('Save', () => {

        it('should save data for hole periods to database', () => {
            sut.save(date, [PERIOD_MINUTE], data);
            driver.save.should.have.been.calledWith(type, date, PERIOD_MINUTE, data);
        });


        it('should use saving strategy', () => {
            let strategy = 'strategy';
            sut.save(date, [PERIOD_MINUTE], data, strategy);
            driver.save.should.have.been.calledWith(type, date, PERIOD_MINUTE, data, strategy);
        });
    });


    context('Get Data by Period', () => {
        it('should get one data record by period', () => {
            sut.getOne(date, PERIOD_SECOND).should.equal(data);
            driver.getOne.should.have.been.calledWith(type, date, PERIOD_SECOND);
        });

        it('should get data collection by period', () => {
            sut.getCollection(date, PERIOD_MINUTE).should.deep.equal([data]);
            driver.getCollection.should.have.been.calledWith(type, date, PERIOD_MINUTE);
        });

    });


});