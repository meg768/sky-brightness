# sky-brightness

A module to determine the current brightness of the sky.

## Installation

````bash
npm install sky-brightness --save
````

## Usage

````javascript
var SkyBrightness = require('sky-brightness');
var sky = new SkyBrightness();

console.log('Brightness index of the sky is currently', sky.getPerceptualBrightness());
````

## Methods

getSolarBrightness
getLunarBrightness
getWeatherBrightness
getPerceptualBrightness
