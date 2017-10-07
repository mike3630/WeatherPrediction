let getDataPromise = require("./DataCollection.js").getDataPromise;

//current weather, current year
async function GetWeatherData(){
    let currWeather = [];
    let lastYear = [];
    await getDataPromise(currWeather, 0);
    await getDataPromise(lastYear, 1);
    console.log(currWeather);console.log();
    console.log(lastYear);console.log();console.log();console.log();
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
    console.log(windows);

    // Step 4
    let distances = [];
    for (let i = 0; i < windows.length; i++){
        let highTemp = 0;
        let lowTemp = 0;
        let humidity = 0;
        let rainfall = 0;
        for (let j = 0; j < windows[i].length; j++){
            highTemp += windows[i][j]['maxTemp'];
            lowTemp += windows[i][j]['minTemp'];
            humidity += windows[i][j]['humidity'];
            rainfall += windows[i][j]['rainfall'];
        }
        /*highTemp = highTemp/windows[0].length;
        lowTemp = lowTemp/windows[0].length;
        humidity = humidity/windows[0].length;
        rainfall = rainfall/windows[0].length;*/
        console.log(highTemp)        
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