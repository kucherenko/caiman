import {Caiman} from '../';

const options = {
    driver: {
        type: 'files',
        options:{
            path: '/tmp/'
        }
    }
};

let stat = new Caiman('temperature_1', options);

setInterval(() => {
    const periods = ['month', 'day', 'hour', 'minute', 'second'];
    let currentDate = new Date();
    stat.save(currentDate, periods, Math.random() * 100, 'averages');
}, 500);

setInterval(() => {
    let currentDate = new Date();
    console.log(stat.getCollection(currentDate, 'hour'));
}, 5000);
