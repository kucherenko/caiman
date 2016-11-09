#Caiman - statistic alligator

##Times series data library.

Library helps organize time series data. Caiman can be used for IoT systems,
stock data, different type of statistics, etc. As database caiman can use file-based database.

###Installation

```
npm install caiman --save
```

###Usage
```
import {Caiman} from caiman

const options = {
    driver: {
        type: 'files',
        options:{
            path: '/tmp/'
        }
    }
}, periods = ['month', 'day', 'hour', 'minute', 'second'];
 
let currentDate = new Date();

let temperatureSensor = new Caiman('temperature_sensor', options);

//save average value binded to current date and time, will collect average values
// posible values of last parameter are 'averages', 'aggregate', 'summarize' or you can use your own strategy
temperatureSensor.save(currentDate, periods, Math.random() * 100, 'averages');


//get collection of values by year, will return coolection of average values by monthes
console.log(stat.getCollection(currentDate, 'year'));

//get collection of values by month, will return coolection of average values by days
console.log(stat.getCollection(currentDate, 'month'));

//get collection of values by day, will return coolection of average values by hours 
console.log(stat.getCollection(currentDate, 'day'));

//get collection of values by hour, will return coolection of average values by minutes
console.log(stat.getCollection(currentDate, 'hour'));

//get collection of values by hour, will return coolection of average values by seconds
console.log(stat.getCollection(currentDate, 'minute'));

```

###Run tests
```
npm test
```
###TODO
 - MongoDB support
 - Redis suport
 - Add CI
 - Add badges
 
###Licence 

MIT