var suncalc = require('suncalc');


module.exports = class SkyBrightness {

    constuctor(options) {

        this.latitude = options.latitude;
        this.longitude = options.longitude;
        this.time = new Date();
    }

    // Returns an index of sun brightness 0 - 1, 1 - local zenith, 0 - local nadir
    getSolarBrightness() {


        var now = new Date();

        var latitude = 55.7;
        var longitude = 13.1833333;
        var times = suncalc.getTimes(now, latitude, longitude);

        var zenithPosition = suncalc.getPosition(times.solarNoon,  latitude, longitude);
        var nadirPosition  = suncalc.getPosition(times.nadir,  latitude, longitude);
        var thisPosition   = suncalc.getPosition(now, latitude, longitude);

        return (thisPosition.altitude - nadirPosition.altitude) / (zenithPosition.altitude - nadirPosition.altitude);
    }

    getWeatherBrightness() {
        return this.getSolarBrightness();
    }

    getLunarBrightness() {
        return this.getSolarBrightness();

    }

    getPerceptualBrightness() {
        return this.getSolarBrightness();
    }



}

//module.exports = new Class SkyBrightness;
