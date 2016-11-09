import {ShellString, cat, mkdir, test} from 'shelljs';
import {join, dirname} from 'path';
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
        let collection = this.getCollection(type, date, parentPeriod(period)),
            startDate = startOfPeriod(date, period).format(),
            oldData = (collection && collection[startDate]) ? collection[startDate] : null,
            pathToFile = this.getPath(type, date, parentPeriod(period));

        if ( typeof(strategy) === 'function') {
            data = strategy(data, oldData);
        }
        if (!test('-d', dirname(pathToFile))){
            mkdir('-p', dirname(pathToFile));
        }
        collection[startDate] = data;
        ShellString(JSON.stringify(collection)).to(
            pathToFile
        );
    }

    getCollection(type, date, period) {
        let pathToFile = this.getPath(type, date, period);
        if (!test('-f', pathToFile)){
            return {};
        }
        let collection = cat(pathToFile);
        if (collection.length > 0) {
            collection = JSON.parse(collection);
        } else {
            collection = {};
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