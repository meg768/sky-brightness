var suncalc = require('suncalc');
var Request = require('yow/request');
var sprintf = require('yow/sprintf');
var isArray = require('yow/is').isArray;

function debug(...args) {
    //console.log(...args)
}

module.exports = class SkyBrightness {

    constructor(options) {

        debug('Constructor', options);

        this.latitude = options.latitude;
        this.longitude = options.longitude;

        this.time = new Date();
    }

    // Returns an index of sun brightness 0 - 1, 1 - local zenith, 0 - local nadir
    getSolarBrightness() {

        var now = new Date();
        var latitude = this.latitude;
        var longitude = this.longitude;
        var times = suncalc.getTimes(now, latitude, longitude);

        var zenithPosition = suncalc.getPosition(times.solarNoon,  latitude, longitude);
        var nadirPosition  = suncalc.getPosition(times.nadir,  latitude, longitude);
        var thisPosition   = suncalc.getPosition(now, latitude, longitude);

        var brightness = (thisPosition.altitude - nadirPosition.altitude) / (zenithPosition.altitude - nadirPosition.altitude);

        debug('Solar brightness:', brightness);

        return Promise.resolve(brightness);
    }

    getWeatherBrightness() {

        var self = this;

        var brightnessIndex = {
            'Sunny'             : 1.00,
            'Clear'             : 1.00,
            'Mostly Sunny'      : 0.95,
            'Mostly Clear'      : 0.95,

            'Partly Sunny'      : 0.90,

            'Partly Cloudy'     : 0.85,
            'Mostly Cloudy'     : 0.80,
            'Cloudy'            : 0.70,

            'Light Rain'        : 0.55,
            'Scattered Showers' : 0.55,
            'Rain Showers'      : 0.55,
            'Rain'              : 0.50,

            'Fog'               : 0.50,

            'T-Storms'          : 0.30,

            'Light Snow'        : 0.50,
            'Snow'              : 0.40,

            'XXX'               : 0
        };


        return new Promise(function(resolve, reject) {
            var request = new Request('https://query.yahooapis.com');

            var query = {};
            query.q      = sprintf('select * from weather.forecast where woeid in (select woeid from geo.places where text="(%s,%s)")', self.latitude, self.longitude);
            query.format = 'json';
            query.env    = 'store://datatables.org/alltableswithkeys';

            debug('Query:', query);

            request.get('/v1/public/yql', {query:query}).then(function(reply) {

                try {
                    var results = reply.body.query.results;

                    if (isArray(results))
                        results = results[0];

                    debug('Results:', results);

                    var condition = results.channel.item.condition.text;
                    var brightness = brightnessIndex[condition];

                    if (brightness == undefined) {
                        reject(new Error('Undefined weather condition:' + condition));
                    }
                    else {
                        debug('Weather brightness:', brightness);
                        resolve(brightness);
                    }

                }
                catch(error) {
                    throw error;
                }
            })
            .catch(function(error) {
                reject(error);
            })

        });

    }

    getLunarBrightness() {
        return Promise.resolve(1);

    }

    getPerceptualBrightness() {

        var self = this;

        return new Promise(function(resolve, reject) {

            var solarBrightness   = 1.0;
            var weatherBrightness = 0.75;
            var lunarBrightness   = 1.0;

            self.getSolarBrightness().then(function(brightness) {
                solarBrightness = brightness;
                return self.getWeatherBrightness();
            })
            .then(function(brightness) {
                weatherBrightness = brightness;
                return self.getLunarBrightness();
            })
            .then(function(brightness) {
                lunarBrightness = brightness;
            })
            .then(function() {
                var brightness = solarBrightness * weatherBrightness * lunarBrightness;
                debug('Perceptual brightness:', brightness);
                resolve(brightness);
            })
            .catch(function(error) {
                reject(error);
            })
        });
    }
}
