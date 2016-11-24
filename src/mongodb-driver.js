import {bunchOfKeys, parentPeriod, startOfPeriod} from './periods';
import {MongoClient} from 'mongodb';

export class MongoDbDriver {

    constructor(options) {
        this.options = options;
        this.collection = options['collection'] ? options['collection'] : 'caiman';
        this.db = this.options['db'];
        this._ensureIndex();
    }

    _ensureIndex() {
        this.db.collection(this.collection).createIndex({period: 1, dateKey: 1});
    }

    _getDateKey(type, date, period) {
        let keysArray = bunchOfKeys(date, period);
        keysArray.push(type);
        return keysArray.join('/');
    }


    save(type, date, period, data, strategy) {
        let dateKey = this._getDateKey(type, date, parentPeriod(period)),
            startDate = startOfPeriod(date, period).format();

        this.db.collection(this.collection).findOne({period: period, dateKey: dateKey}, (err, doc) => {
            if (typeof(strategy) === 'function') {
                data = strategy(data, doc ? doc.data : {});
            }
            if (!doc) {
                this.db.collection(this.collection).insertOne({
                    period: parentPeriod(period), startDate, dateKey, data
                });

            } else {
                this.db.collection(this.collection).findOneAndUpdate({period: parentPeriod(period), dateKey},
                    {$set: {data}});
            }
        });
    }

    getOne(type, date, period) {
        let dateKey = this._getDateKey(type, date, period);
        return this.db.collection(this.collection).findOne({period, dateKey});
    }

    getCollection(type, date, period) {
        let dateKey = this._getDateKey(type, date, period);
        return this.db.collection(this.collection).find({period, dateKey});
    }
}
