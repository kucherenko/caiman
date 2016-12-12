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
        this.db.collection(this.collection).createIndex({period: 1, dateKey: 1, startDate: 1 });
    }

    _getDateKey(type, date, period) {
        let keysArray = bunchOfKeys(date, period);
        keysArray.push(type);
        return keysArray.join('/');
    }


    save(type, date, period, data, strategy) {
        let originPeriod = parentPeriod(period),
            dateKey = this._getDateKey(type, date, originPeriod),
            startDate = startOfPeriod(date, period).toDate();

        this.db.collection(this.collection).findOne({period: originPeriod, dateKey: dateKey}, (err, doc) => {
            if (typeof(strategy) === 'function') {
                data = strategy(data, doc ? doc.data : {});
            }
            if (!doc) {
                this.db.collection(this.collection).insertOne({
                    period: originPeriod, startDate: startDate, dateKey: dateKey, data: data
                });

            } else {
                this.db.collection(this.collection).findOneAndUpdate({period: originPeriod, dateKey: dateKey},
                    {$set: {data: data}});
            }
        });
    }

    getOne(type, date, period) {
        let dateKey = this._getDateKey(type, date, period);
        return this.db.collection(this.collection).findOne({period: period, dateKey: dateKey});
    }

    getCollection(type, date, period) {
        return this.db.collection(this.collection).find({
            period: period,
            startDate: {
                $gte: date
            },
            dateKey: new RegExp(type + '\\b')
        }).sort({ startDate: 1 });
    }

}
