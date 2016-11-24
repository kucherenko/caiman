import {FilesDriver} from './files-driver';
import {MongoDbDriver} from './mongodb-driver';

import * as strategies from './strategies';

export default class Stats {
    constructor(type, options) {
        this.type = type;
        this.options = options;
        this.initializeDriver();
    }

    initializeDriver() {
        let driver = this.options.driver;
        switch (driver.type) {
            case "files":
                this.driver = new FilesDriver(driver.options);
                break;
            case "mongodb":
                this.driver = new MongoDbDriver(driver.options);
                break;
            default:
                throw new Error('options should have supported driver')
        }
    }

    save(date, periods, data, strategy) {
        if (strategies.hasOwnProperty(strategy)) {
            strategy = strategies[strategy];
        }
        for (let period of periods) {
            this.driver.save(this.type, date, period, data, strategy);
        }
    }

    getOne(date, period) {
        return this.driver.getOne(this.type, date, period);
    }

    getCollection(date, period) {
        return this.driver.getCollection(this.type, date, period);
    }
}