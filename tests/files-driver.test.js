import '.';
import {join} from 'path';
import moment from 'moment';
import proxyquire from 'proxyquire';

import {
    PERIOD_MONTH
} from '../src/constants';

describe("Driver: Files", () => {
    let sut,
        date,
        data,
        type,
        FilesDriver,
        path,
        bunchOfKeys,
        ShellString,
        to,
        filename,
        cat,
        startOfPeriod;

    beforeEach(() => {
        type = 'test';
        date = moment('2016-01-01T23:35:01');
        to = env.stub();
        cat = env.stub().returns('{"test":1}');
        startOfPeriod = env.stub().returns(date);
        bunchOfKeys = env.stub().returns(["bunch_of_keys"]);
        ShellString = env.stub().returns({to});
        path = '/tmp';

        FilesDriver = proxyquire('../src/files-driver', {
            'shelljs': {ShellString, cat},
            './periods': {startOfPeriod, bunchOfKeys}
        }).FilesDriver;

        sut = new FilesDriver({path});
    });

    context('Database Location', () => {
        it('should generate path to database by bunch of keys', () => {
            sut.getPath(type, date, PERIOD_MONTH).should.equal(
                join(path, "bunch_of_keys", `${type}.json`)
            );
        });
    });

    context('Work With Files', () => {
        let collection;

        beforeEach(() => {
            collection = {};
            filename = '/tmp/test.path.json';
            data = {test: 1};
            sut.getPath = env.stub().returns(filename);
        });

        context('Save', () => {

            it.skip('should save data about sub period to database', () => {
                sut.save(type, date, PERIOD_MONTH, data);
                ShellString.should.have.been.calledWith(JSON.stringify(data));
                to.should.have.been.calledWith(filename);
            });

        });

        context('Get Collection', () => {
            it.skip('should read data from database', () => {
                sut.getCollection(type, date, PERIOD_MONTH);
                cat.should.have.been.calledWith(filename);
            });
        });

        context('Get One Record', () => {
            let oneRecord;

            beforeEach(() => {
                oneRecord = {test: 2};
                let recordsDate = {};
                recordsDate[date.format().toString()] = oneRecord;
                sut.getCollection = env.stub().returns(recordsDate);
            });

            it('should get one record from collection', () => {
               sut.getOne(type, date, PERIOD_MONTH).should.deep.equal(oneRecord);
            });
        });

    });
});