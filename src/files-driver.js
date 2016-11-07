import {ShellString, cat} from 'shelljs';
import {join} from 'path';
import {bunchOfKeys, parentPeriod, startOfPeriod} from './periods';


export class FilesDriver {
    constructor(options) {
        this.options = options;
    }

    getPath(type, date, period) {
        let pathElements = [this.options.path].concat(bunchOfKeys(date, period));
        pathElements.push(`${type}.json`);
        return join(...pathElements);
    }

    save(type, date, period, data, strategy) {
        ShellString(JSON.stringify(data)).to(
            this.getPath(type, date, period)
        );
    }

    getCollection(type, date, period) {
        let collection = cat(this.getPath(type, date, period));
        if (collection){
            collection = JSON.stringify(collection);
        }
        return collection;
    }

    getOne(type, date, period) {
        let record,
            collection = this.getCollection(type, date, parentPeriod(period)),
            startDate = startOfPeriod(date, period),
            recordsDate = startDate.format().toString();

        if (collection && collection[recordsDate]) {
            record = collection[recordsDate];
        }
        return record;
    }
}