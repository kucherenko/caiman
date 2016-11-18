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
        this.getOne(type, date, parentPeriod(period)).then((err, doc) => {
            if ( typeof(strategy) === 'function') {
                data = strategy(data, doc);
            }
            if (!doc) {
                this.db.collection(this.collection).save()
            }
            this.db.collection(this.collection).findOneAndUpdate({dateKey, startDate}
                , {$set: data});
        });
    }

    getCollection(type, date, period) {
        let dateKey = this._getDateKey(type, date, period),
            startDate = startOfPeriod(date, period).toString();
        return this.db.collection(this.collection).find({dateKey, startDate}).sort({startDate: 1});
    }


    getOne(type, date, period) {
        let dateKey = this._getDateKey(type, date, period),
            startDate = startOfPeriod(date, period).toString();
        // console.log(this.db);
        return this.db.collection(this.collection).findOne({dateKey, startDate});
    }
}
