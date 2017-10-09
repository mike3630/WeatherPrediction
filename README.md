# Weather Prediction Application
* Algorithms used are:
    - Sliding Window
    - ID3 Heuristic Tree

* Weather API used:
    - https://darksky.net/forecast/45.421,-75.69/ca12/en
    - Location used for the purpose of this application is Ottawa Ontario

## Modules
* npm install fetch

## How to run
* Clone the repository
* cd WeatherPrediction
* node WeatherPrediction.js

This application uses the sliding window algorithm by comparing last weeks weather with historical weeks. Euclidean distance is used to determine which of the windows in this algorithm best fits. 

This application uses the ID3 heuristic tree based on the past weeks weather and historical weeks to determine weather conditions (cloudy, sunny, ...).