import {bunchOfKeys, parentPeriod, startOfPeriod} from './periods';
import {MongoClient} from 'mongodb';

async function _connect(options) {
    let db = await MongoClient.connect(options.url);
    return db;
}

export class MongoDbDriver {

    constructor(options) {
        this.options = options;
        //this.collection = options['collection'] ? options['collection'] : 'caiman';
        this.db = this.options['db'] ? this.options['db'] : _connect(this.options);
    }

    _getDateKey(type, date, period) {
        let keysArray = bunchOfKeys(date, period);
        keysArray.push(type);
        return keysArray.join('/');
    }


    save(type, date, period, data, strategy) {
        let dateKey = this._getDateKey(type, date, parentPeriod(period)),
            startDate = startOfPeriod(date, period).format(),
            collection = period.toString();


        this.db.collection(period).findOne({[dateKey]: {'$exists': true}}, (err, doc) => {
            if (err) {
                console.log(err);
            }

            console.log(doc);

            if (typeof(strategy) === 'function') {
                data = strategy(data, doc ? doc[dateKey][startDate]: {});
            }
            if (!doc) {
                this.db.collection(collection).insertOne({[dateKey]: {[startDate]: data}});
            } else {

                this.db.collection(collection).findOneAndUpdate({[dateKey]: {'$exists': true}},
                    {$set: {[dateKey]: {[startDate]: data}}});
            }


        });
    }

    getCollection(type, date, period) {
        let dateKey = this._getDateKey(type, date, period),
            startDate = startOfPeriod(date, period).toString(),
            collection = period.toString();
        return this.db.collection(collection).find({[dateKey]: {'$exists': true}});
    }

}
