# sky-brightness

A module to try to determine the current brightness of the sky. It uses the time of day,
the season, current weather and current moon brightness to compute a number from 0 to 1.

Please note: Under construction...

## Installation

````bash
npm install sky-brightness --save
````

## Usage

````javascript
var SkyBrightness = require('sky-brightness');

var sky = new SkyBrightness({
    latitude: 55.70,
    longitude: 13.22
});

console.log('Brightness index of the sky is currently', sky.getPerceptualBrightness());
````

## Methods

- **getSolarBrightness()**       - How bright is the sun right now? Returns an index from 0 - 1.
- **getLunarBrightness()**       - Full moon? Half moon? Returns an index from 0 - 1.
- **getWeatherBrightness()**     - How does the current weather affect the light. Returns an index from 0 - 1.
- **getPerceptualBrightness()**  - Returns an index trying to reflect the perceptual light in the sky.
