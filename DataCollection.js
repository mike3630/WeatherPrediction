const fetch = require('fetch');

/*
const apiKey = "e24c30222fa7204ca5698cfda61ffecc";
const baseUrl = "https://api.darksky.net/forecast/";
const lat = "‎45.425533";
const long = "-75.692482";
*/

//curr unix time
let currTime = Math.floor(Date.now() / 1000);

// a year / day in unix time
let year = 31536000;
let day = 86400;

// base url for accessing the darksky api. Currently string concatenation isn't working FIXME
let url = "https://api.darksky.net/forecast/e24c30222fa7204ca5698cfda61ffecc/45.425533,-75.692482,";
//console.log(url);

//promise to grab the mac
function apiQuery(queryUrl, arr) {
    return new Promise((resolve, reject) => {
        fetch.fetchUrl(queryUrl, function(error, meta, body){

            //grab data and parse
            let data = JSON.parse(body.toString());
            let time = data['daily']['data'][0]['time'];
            let hightemp = data['daily']['data'][0]['temperatureHigh'];
            let lowtemp = data['daily']['data'][0]['temperatureLow'];
            let humidity = data['daily']['data'][0]['humidity'];
            let rainfall = data['daily']['data'][0]['precipIntensity'];

            //add it to the array passed
            arr.push({"maxTemp":FtoC(hightemp),
                            "minTemp":FtoC(lowtemp),
                            "humidity":humidity,
                            "rainfall":INtoMM(rainfall)});

            //verify
            //console.log(time + ": " + hightemp + ", " + lowtemp + ", " + humidity + ", " + INtoMM(rainfall));
            return resolve();
        });
    });
}


// fahrenheit to celsius
function FtoC(fah){
    return Math.floor((fah-32)*(5/9));
}

// inches per hour to mm
function INtoMM(rainInchesPerHour){
    return rainInchesPerHour * 24 * 25.4;
}

// grab darksky data
// arr - the array to store the dataset (current, past, ...)
// yr - how many years prior to grab the data (0 - 2017, 2 - 2016, ...)
// CLEAN ME
 function getDataPromise(arr, yr){
    return new Promise((resolve, reject) => {
        async function buffer(){
            let i;

            // for past year collect a fortnight of data
            if (yr > 0){
                i = 14;
            } // current year only collect last week
            else{
                i = 7;
            }

            // each day of the week
            for (; i > 0; i--){
                let queryUrl = url + (currTime - (day * i) - (yr * year));
                await apiQuery(queryUrl, arr);
            }
            //console.log(arr)
            return resolve();
        }
        buffer();
    });
}
/* TEST CODE
let currWeather = [];
let lastYear = [];

//current weather, current year
async function getAllData(){
    await getDataPromise(currWeather, 0);
    await getDataPromise(lastYear, 1);
}

getAllData();
*/
module.exports.getDataPromise = getDataPromise;