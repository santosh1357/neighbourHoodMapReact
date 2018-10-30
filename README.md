# Neighborhood-Map-React
A single-page web application, built using the React framework, that displays Arts and Museums centers located in NewDelhi. 
The project uses a 3rd party API (four square) to load the details of locations like their name, address etc.
Then the same data is displayed on Google Map. Map Markers and serach field has been added and locations can be filtered
and searched thriough them.
This application follow this [Udacity Project Rubric](https://review.udacity.com/#!/rubrics/1351/view)

## How to run the project online
Open the online here

## Features

1. Type into the filter/search box to filter the shown locations on the map.
3. Click anywhere on the map to close the information window that opens.
4. Click on any marker to see the location details fetched from the [FourSquare APIs](https://developer.foursquare.com/).

## How to run the project in Development Mode
The project uses [Node.js >= 10.x](https://nodejs.org/en/) and the [Create-React-App starter code](https://github.com/facebookincubator/create-react-app).

After Node is installed in your system, follow the below steps.

1. Navigate to the directory where you want to store the app.
2. Clone the repo `git clone `
3. Now install all modules listed as dependencies in `package.json` by running the command `npm install`
4. Launch the app with this command `npm start`

A new browser window open automatically displaying the app.  If it doesn't, navigate to [http://localhost:3000/](http://localhost:3000/) in your browser

***NOTE:*** *The service workers for this app will only cache the site when it is in production mode.*

## How to run the project in Production Mode

1. Build the production ready optimised code. `npm run build`
2. Deploy it to `gh-pages` branch by `npm run deploy`
3. Check the online demo [here]

##References
1. [Google Maps] (https://developers.google.com/maps/documentation/)
2. [Youtube tutorial] (https://www.youtube.com/watch?v=ywdxLNjhBYw&list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1)
