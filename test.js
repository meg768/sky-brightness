

var SkyBrightness = require('./index.js');

var sky = new SkyBrightness();

sky.getPerceptualBrightness().then(function(index) {
    console.log(index);
})
