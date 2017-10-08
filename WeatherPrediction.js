let getDataPromise = require("./DataCollection.js").getDataPromise;
let FtoC = require("./DataCollection.js").FtoC;

//current weather, current year
async function GetWeatherData(){
    let currWeather = [];
    let lastYear = [];
    let secondYear = [];
    let thirdYear = [];
    let fourthYear = [];
    let fifthYear = [];
    let test = 1;

    if (test === 1){
        await getDataPromise(currWeather, 0);
        await getDataPromise(lastYear, 1);
        await getDataPromise(secondYear, 2);
        await getDataPromise(thirdYear, 3);
        await getDataPromise(fourthYear, 4);
        await getDataPromise(fifthYear, 5);
    }
    else {

        currWeather = [ { maxTemp: 63.88,
                            minTemp: 40.76,
                            humidity: 0.73,
                            rainfall: 0.18288 },
                        { maxTemp: 68.67,
                            minTemp: 44.68,
                            humidity: 0.72,
                            rainfall: 0.06096 },
                        { maxTemp: 74.14,
                            minTemp: 55.78,
                            humidity: 0.7,
                            rainfall: 0.06096 },
                        { maxTemp: 73.13,
                            minTemp: 50.93,
                            humidity: 0.81,
                            rainfall: 8.2296 },
                        { maxTemp: 65.85,
                            minTemp: 51.53,
                            humidity: 0.78,
                            rainfall: 0.06096 },
                        { maxTemp: 66.22,
                            minTemp: 49.66,
                            humidity: 0.76,
                            rainfall: 0.06096 },
                        { maxTemp: 67.85,
                            minTemp: 63.77,
                            humidity: 0.93,
                            rainfall: 2.19456 } ];

        lastYear = [ { maxTemp: 62.08,
                        minTemp: 37.64,
                        humidity: 0.69,
                        rainfall: 0.06096 },
                    { maxTemp: 62.38,
                        minTemp: 35.9,
                        humidity: 0.69,
                        rainfall: 0.06096 },
                    { maxTemp: 62.42,
                        minTemp: 48.15,
                        humidity: 0.75,
                        rainfall: 0.06096 },
                    { maxTemp: 67.77,
                        minTemp: 48.73,
                        humidity: 0.75,
                        rainfall: 1.28016 },
                    { maxTemp: 66.65, minTemp: 47.31, humidity: 0.82, rainfall: 0 },
                    { maxTemp: 63.96, minTemp: 49.67, humidity: 0.73, rainfall: 0 },
                    { maxTemp: 63.29, minTemp: 51.74, humidity: 0.67, rainfall: 0 },
                    { maxTemp: 63.05, minTemp: 53.91, humidity: 0.69, rainfall: 0 },
                    { maxTemp: 59.47, minTemp: 55, humidity: 0.94, rainfall: 3.59664 },
                    { maxTemp: 67.01,
                        minTemp: 44.89,
                        humidity: 0.84,
                        rainfall: 2.3774399999999996 },
                    { maxTemp: 67.48,
                        minTemp: 45.62,
                        humidity: 0.78,
                        rainfall: 0.06096 },
                    { maxTemp: 69.69, minTemp: 46.36, humidity: 0.84, rainfall: 0 },
                    { maxTemp: 71.36, minTemp: 46.32, humidity: 0.85, rainfall: 0 },
                    { maxTemp: 75.35, minTemp: 56.95, humidity: 0.78, rainfall: 0 } ];
    }
    //console.log(currWeather);console.log();
    //console.log(lastYear);console.log();console.log();console.log();
    slidingWindow(currWeather, lastYear);
    slidingWindow(currWeather, secondYear);
    slidingWindow(currWeather, thirdYear);
    slidingWindow(currWeather, fourthYear);
    slidingWindow(currWeather, fifthYear);
}

GetWeatherData();

/*
Step  1. Take matrix ‘‘CD’’ of last seven days for current year’s data of size .
Step  2. Take matrix ‘‘PD’’ of fourteen days for previous year’s data of size .
Step  3. Make 8 sliding windows of size  each from the matrix ‘‘PD’’ as 
Step  4. Compute the Euclidean distance of each sliding window with the matrix ‘‘CD’’ as 
Step  5. Select matrix  as
    = Correponding_Matrix (Min.)
   
Step  6. For  = 1 to 
           (i) For  compute the variation vector for the matrix ‘‘CD" of size  as ‘‘VC’’.
           (ii) For  compute the variation vector for the matrix ‘‘PD’’ of size  as ‘‘VP’’.
           (iii) Mean1 = Mean (VC)
           (iv) Mean2 = Mean (VP)
           (v) Predicted Variation ‘‘’’ 
           (vi) Add ‘‘’’ to the previous day’s weather condition in consideration to get the predicted condition.
  Step  7.  End
*/
function slidingWindow(currWeather, lastYear){
    let windows = [];

    // Step 3
    buildWindows(windows, lastYear);
    //console.log(windows);

    // Step 4
    let distances = [];
    EuclideanDistances(distances, windows, currWeather);
    //console.log(distances)

    // Step 5
    let conditions = ['maxTemp', 'minTemp', 'humidity', 'rainfall'];
    let results = [];
    for (let i = 0; i < conditions.length; i++){
        let index = minED(distances, conditions[i]);
        //console.log(index)
        //console.log(distances[index][conditions[i]]);
        //console.log(windows[index])
        //console.log(currWeather)

        // Step 6
        let variation = weatherVariation(windows, currWeather, index, conditions[i]);
        //console.log(variation)
        let result = currWeather[6][conditions[i]] + variation;
        let param = conditions[i];
        results.push(result);
    }

    // formatting results
    results[0] = FtoC(results[0]);
    results[1] = FtoC(results[1]);
    results[2] = Math.round(results[2] * 100)/100;
    results[3] = Math.round(results[3] * 100)/100;

    // when adjusting rainfall the variance value can be negative but the result cannot
    if (results[3] < 0){
        results[3] = 0;
    }
    console.log(results);
}

//splits the historical weather into the respective windows
function buildWindows(windows, lastYear){
    for (let j = 0; j < 8; j++){
        let arr = [];
        for (let i = j; i < j+7; i++){
            arr.push(lastYear[i])
        }
        windows.push(arr);
    }
}

// finds the ED of each value, min/max temp humidity and rainfall
function EuclideanDistances(distances, windows, currWeather){
    for (let i = 0; i < windows.length; i++){
        let maxTemp = 0;
        let minTemp = 0;
        let humidity = 0;
        let rainfall = 0;
        for (let j = 0; j < windows[i].length-1; j++){
            maxTemp += Math.pow((windows[i][j+1]['maxTemp'] - windows[i][j]['maxTemp']) - (currWeather[j+1]['maxTemp'] - currWeather[j]['maxTemp']), 2);
            minTemp += Math.pow((windows[i][j+1]['minTemp'] - windows[i][j]['minTemp']) - (currWeather[j+1]['minTemp'] - currWeather[j]['minTemp']), 2);
            humidity += Math.pow((windows[i][j+1]['humidity'] - windows[i][j]['humidity']) - (currWeather[j+1]['humidity'] - currWeather[j]['humidity']), 2);
            rainfall += Math.pow((windows[i][j+1]['rainfall'] - windows[i][j]['rainfall']) - (currWeather[j+1]['rainfall'] - currWeather[j]['rainfall']), 2);
        }
        maxTemp = Math.sqrt(maxTemp);
        minTemp = Math.sqrt(minTemp);
        humidity = Math.sqrt(humidity);
        rainfall = Math.sqrt(rainfall);
        distances.push({"maxTemp":maxTemp,
         "minTemp":minTemp,
         "humidity":humidity,
         "rainfall":rainfall})      
    }

}

// finds min ED from a list of EDs
function minED(distances, param){
    let min = 10000;
    let index = 0;
    for (let i = 0; i < distances.length; i++){
        if (distances[i][param] < min){
            min = distances[i][param];
            index = i;
        }
    }
    return index;
}


// calculate the day by day variation of the selected window and current week
// then takes th mean of each, the mean of the result, and returns that as the new variation
function weatherVariation(windows, currWeather, index, param){
    let meanCurr = 0;
    let meanLast = 0;

    for (let i = 0; i < 6; i++){
        meanCurr += currWeather[i+1][param] - currWeather[i][param];
        meanLast += windows[index][i+1][param] - windows[index][i][param];
    }

    meanCurr = meanCurr/6;
    meanLast = meanLast/6;

    let variation = (meanCurr + meanLast)/2;

    return variation;
}