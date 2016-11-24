import '.';
import moment from 'moment';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import {
    PERIOD_MONTH
} from '../src/constants';

describe("Driver: MongoDb", () => {
    let sut,
        db,
        url,
        date,
        data,
        type,
        MongoClient,
        MongoDbDriver,
        bunchOfKeys,
        startOfPeriod;

    beforeEach(() => {
        db = {caiman: env.stub()};
        url = 'test_url';
        type = 'test';
        MongoClient = {
            connect: env.stub()
        };

        date = moment('2016-01-01T23:35:01');
        startOfPeriod = env.stub().returns(date);
        bunchOfKeys = env.stub().returns(["bunch_of_keys"]);
        MongoDbDriver = proxyquire('../src/mongodb-driver', {
            './periods': {startOfPeriod, bunchOfKeys},
            'mongodb': {MongoClient}
        }).MongoDbDriver;

    });

    context('Database Connection', () => {
        it('should create connection if connection not ezists', () => {
            sut = new MongoDbDriver({url});
            MongoClient.connect.should.have.been.calledWith(url);
        });

        it('should use connection if connection exists', () => {
            sut = new MongoDbDriver({db});

            sut.db.should.equal(db);
            MongoClient.connect.should.not.have.been.called;
        });

        it('should use collection name from options', () => {
            let collection = 'my_collection';
            sut = new MongoDbDriver({db, collection});

            sut.collection.should.equal(collection);
        });

        it('should use caiman name as default collection name', () => {
            sut = new MongoDbDriver({db});
            sut.collection.should.equal('caiman');
        });
    });

    context("Get One Record", () => {
        let dateKey, startDate;
        beforeEach(() => {
            db.caiman = {
                findOne: env.stub()
            };
            sut = new MongoDbDriver({db})
            dateKey = 'bunch_of_keys/test';
            startDate = date.startOf(PERIOD_MONTH).toString();
        });

        it('should get record by dateKey and start of period', () => {
            sut.getOne(type, date, PERIOD_MONTH);
            db.caiman.findOne.should.have.been.calledWith({dateKey, startDate});
        });
    });

    context("Get Collection", () => {
        let dateKey, startDate;
        beforeEach(() => {
            db.caiman = {
                find: env.stub().returns({sort: env.stub()})
            };
            sut = new MongoDbDriver({db})
            dateKey = 'bunch_of_keys/test';
            startDate = date.startOf(PERIOD_MONTH).toString();
        });

        it('should get record by dateKey and start of period', () => {
            sut.getCollection(type, date, PERIOD_MONTH);
            db.caiman.find.should.have.been.calledWith({dateKey, startDate});
        });
    });

});