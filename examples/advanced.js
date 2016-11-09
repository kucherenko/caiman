import {Caiman} from '../src/stats';

const options = {
    driver: {
        type: 'files',
        options:{
            path: '/tmp/'
        }
    }
};

let stat = new Caiman('temperature', options);

setInterval(() => {
    const periods = ['month', 'day', 'hour', 'minute', 'second'];
    let currentDate = new Date();
    stat.save(currentDate, periods, Math.random() * 100, (data, oldData) => {
      let result = {};
      if (!oldData) {
        result.max = data;
        result.average = data;
        result.min = data;
      } else {
        if (oldData.max < data) { result.max = data; }
        if (oldData.min > data) { result.min = data; }
        result.average = (Number(data) + oldData.average) / 2;
      }
      return result;
    });
}, 500);

setInterval(() => {
    let currentDate = new Date();
    console.log(stat.getCollection(currentDate, 'hour'));
}, 5000);
