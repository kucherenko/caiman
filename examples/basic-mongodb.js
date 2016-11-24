import {MongoClient} from 'mongodb';

import Stats from '../src/stats';

const options = {
    driver: {
        type: 'mongodb',
        options: {}
    }
};

MongoClient.connect("mongodb://127.0.0.1:27017/stats", (err, db) => {

    options.driver.options.db = db;
    let stat = new Stats('temperature_1', options);
    let stat2 = new Stats('temperature_2', options);

    setInterval(() => {
        const periods = ['month', 'day', 'hour', 'minute', 'second'];
        let currentDate = new Date();
        stat.save(currentDate, periods, Math.random() * 100, 'averages');
        stat2.save(currentDate, periods, Math.random() * 100, 'averages');
    }, 500);

    setInterval(() => {
        let currentDate = new Date();
        let st = stat.getCollection(currentDate, 'hour');
        let st2 = stat2.getCollection(currentDate, 'hour');

        st.toArray((err, doc) => {
          console.log(doc)
        });
    }, 1000);

});
