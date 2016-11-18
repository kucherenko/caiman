import {MongoClient} from 'mongodb';

import Stats from '../src/stats';

const options = {
    driver: {
        type: 'mongodb',
        options:{}
    }
    // driver: {
    //     type: 'files',
    //     options:{
    //         path: '/tmp/'
    //     }
    // }

};
MongoClient.connect("mongodb://127.0.0.1:27017/stats", (err, db) => {
    options.driver.options.db = db;
    let stat = new Stats('temperature_1', options);
    // setInterval(() => {
    const periods = ['month', 'day', 'hour', 'minute', 'second'];
    let currentDate = new Date();
    stat.save(currentDate, periods, Math.random() * 100, 'averages');
    // }, 500);
});

// setInterval(() => {
//     let currentDate = new Date();
//     console.log(stat.getCollection(currentDate, 'hour'));
// }, 5000);
