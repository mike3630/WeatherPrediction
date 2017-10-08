let getDataPromise = require("./DataCollection.js").getDataPromise;

//current weather, current year
async function GetWeatherData(){
    let currWeather = [];
    let lastYear = [];
    let test = 0;

    if (test === 1){
        await getDataPromise(currWeather, 0);
        await getDataPromise(lastYear, 1);
    }
    else {

        currWeather = [ { maxTemp: 14,
                            minTemp: 2,
                            humidity: 0.69,
                            rainfall: 0.6705599999999999 },
                        { maxTemp: 17, minTemp: 4, humidity: 0.73, rainfall: 0.18288 },
                        { maxTemp: 20, minTemp: 7, humidity: 0.72, rainfall: 0.06096 },
                        { maxTemp: 23, minTemp: 13, humidity: 0.7, rainfall: 0.06096 },
                        { maxTemp: 22, minTemp: 10, humidity: 0.81, rainfall: 8.2296 },
                        { maxTemp: 18, minTemp: 10, humidity: 0.78, rainfall: 0.06096 },
                        { maxTemp: 19, minTemp: 9, humidity: 0.76, rainfall: 0.06096 } ];

        lastYear = [ { maxTemp: 16, minTemp: 4, humidity: 0.79, rainfall: 3.23088 },
                        { maxTemp: 16, minTemp: 3, humidity: 0.69, rainfall: 0.06096 },
                        { maxTemp: 16, minTemp: 2, humidity: 0.69, rainfall: 0.06096 },
                        { maxTemp: 16, minTemp: 8, humidity: 0.75, rainfall: 0.06096 },
                        { maxTemp: 19, minTemp: 9, humidity: 0.75, rainfall: 1.28016 },
                        { maxTemp: 19, minTemp: 8, humidity: 0.82, rainfall: 0 },
                        { maxTemp: 17, minTemp: 9, humidity: 0.73, rainfall: 0 },
                        { maxTemp: 17, minTemp: 10, humidity: 0.67, rainfall: 0 },
                        { maxTemp: 17, minTemp: 12, humidity: 0.69, rainfall: 0 },
                        { maxTemp: 15, minTemp: 12, humidity: 0.94, rainfall: 3.59664 },
                        { maxTemp: 19,
                            minTemp: 7,
                            humidity: 0.84,
                            rainfall: 2.3774399999999996 },
                        { maxTemp: 19, minTemp: 7, humidity: 0.78, rainfall: 0.06096 },
                        { maxTemp: 20, minTemp: 7, humidity: 0.84, rainfall: 0 },
                        { maxTemp: 21, minTemp: 7, humidity: 0.85, rainfall: 0 } ];
    }
    //console.log(currWeather);console.log();
    //console.log(lastYear);console.log();console.log();console.log();
    slidingWindow(currWeather, lastYear);
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
    for (let i = 0; i < conditions.length; i++){
        let index = minED(distances, conditions[i]);
        //console.log(distances[index][conditions[i]]);
        //console.log(windows[index])

        // Step 6
        let variation = weatherVariation(windows, currWeather, index, conditions[i]);

        console.log("predicted " + conditions[i] + ": " +  (currWeather[6][conditions[i]] + variation));
    }
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
        for (let j = 0; j < windows[i].length; j++){
            maxTemp += Math.pow(windows[i][j]['maxTemp'] - currWeather[j]['maxTemp'], 2);
            minTemp += Math.pow(windows[i][j]['minTemp'] - currWeather[j]['minTemp'], 2);
            humidity += Math.pow(windows[i][j]['humidity'] - currWeather[j]['humidity'], 2);
            rainfall += Math.pow(windows[i][j]['rainfall'] - currWeather[j]['rainfall'], 2);
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