import {bunchOfKeys, parentPeriod, startOfPeriod} from './periods';
import {MongoClient} from 'mongodb';

async function _connect(options) {
    let db = await MongoClient.connect(options.url);
    return db;
}

export class MongoDbDriver {

    constructor(options) {
        this.options = options;
        this.collection = options['collection'] ? options['collection'] : 'caiman';
        this.db = this.options['db'] ? this.options['db'] : _connect(this.options);
    }

    _getDateKey(type, date, period) {
        let keysArray = bunchOfKeys(date, period);
        keysArray.push(type);
        return keysArray.join('/');
    }


    save(type, date, period, data, strategy) {
        let dateKey = this._getDateKey(type, date, parentPeriod(period)),
            startDate = startOfPeriod(date, period).format();


        this.db.collection(this.collection).findOne({period: period, [dateKey]: {'$exists': true}}, (err, doc) => {
            if (typeof(strategy) === 'function') {
                data = strategy(data, doc ? doc[dateKey] : {});
            }
            if (!doc) {
                this.db.collection(this.collection).insertOne({
                    period: period, startDate: startDate, [dateKey]: data
                });

            } else {

                this.db.collection(this.collection).findOneAndUpdate({period: period, [dateKey]: {'$exists': true}},
                    {$set: {period: period, startDate: startDate, [dateKey]: data}});
            }


        });
    }

    getCollection(type, date, period) {
        let dateKey = this._getDateKey(type, date, period),
            collection = period.toString();
        return this.db.collection(this.collection).find({period: period, [dateKey]: {'$exists': true}});
    }

}
