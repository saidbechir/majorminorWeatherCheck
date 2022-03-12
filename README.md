# majorminorWeatherCheck

## Set up 
1. At root folder, open a new terminal and run <code> npm i </code>
2. Fill missing env variable value with api key

## How to run
1. On the terminal run <code>node server.js</code> or <code> npm run start </code>

## How to run tests
1. At the root folder open a new terminal and run <code> npm run test </code>

## How to use
1. Run the server
2. Perform a get query to localhost:3000/

## Usability
Performing a request without parameters the response will check if the temperature on Río Cuarto, Córdoba, Argentina is greater than 15 celcius and return true or false respectively. 
Beyond this default behavior, the endpoint accepts additional query parameters. 
1. value: a particular number to check and replace the 15 default.
2. lat: to check a different latitude
3. lon: to check a different longitude
4. mode: allowing to check for greater or lower values. It accepts 'lower' or 'greater' values, with greater as default. 
