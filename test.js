

var SkyBrightness = require('./index.js');
var sky = new SkyBrightness({
    longitude: 55.70,
    latitude: 13.21
});

Promise.resolve().then(function() {
    return sky.getSolarBrightness();
})
.then(function(index) {
    console.log('Solar brightness', index);
})

.then(function() {
    return sky.getWeatherBrightness();
})
.then(function(index) {
    console.log('Weather brightness', index);
})

.then(function() {
    return sky.getPerceptualBrightness();
})
.then(function(index) {
    console.log('Perceptual brightness', index);
})
.catch(function(error){
    console.log(error);
})
