var suncalc = require('suncalc');
var Request = require('yow/request');

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

        return new Promise(function(resolve, reject) {
            var request = new Request('https://query.yahooapis.com');

            var query = {};
            query.q      = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Lund, Sweden")'
            query.format = 'json';
            query.env    = 'store://datatables.org/alltableswithkeys';

            request.get('/v1/public/yql', {query:query}).then(function(reply) {
                console.log(reply.body.query.results.channel.item.condition);
                resolve();
            })
            .catch(function(error) {
                reject(error);
            })

        });

    }

    getLunarBrightness() {
        return this.getSolarBrightness();

    }

    getPerceptualBrightness() {
        return this.getSolarBrightness();
    }



}

//module.exports = new Class SkyBrightness;
