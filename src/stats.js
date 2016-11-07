export default class Stats {
    constructor(type, driver) {
        this.type = type;
        this.driver = driver;
    }

    save(date, periods, data, strategy) {
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