import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({
  // the below properties (start, hour range, minute range, hour pips, minute pips, steps and tooltips are are init values for using range slider
  hourRange: {
      'min': [0],
      'max': [23]
  },
  hourPips: {
    mode: 'count',
    values: 6,
    stepped: true
  },
  minuteRange: {
    'min': [0],
    'max': [59]
  },
  minutePips: {
    mode: 'count',
    values: 7,
    stepped: true
  },
  step: 1,
  tooltips: true,
  // infoWindow property is set initially to false (hidden) and changed to true (to show) for valid sensor value
  showInfoWindow: false,

  init() {
    this._super(...arguments);
    let model = this.get('model'),
        locations = model.sensorLocations,
        sensorData = model.sensorData;

    // initialised models, and set centre of map based on sensor locations
    this.setMapCentre(locations);
    this.set('locations', locations);
    this.set('sensorData', sensorData);

    // initialising value for hour and minute slider
    if (!this.get('hourVal')) this.set('hourVal', 0);
    if (!this.get('minuteVal')) this.set('minuteVal', 0);
  },

  // method to compute centre of maps based on location input / sensor locations
  setMapCentre(locations){
    let lats = [],
        lngs = [],
        centre = locations.reduce((mapCentre, location, index) => {
          if (location.lat) lats.push(location.lat);
          if (location.lng) lngs.push(location.lng);
          if (index == locations.length-1) {
            lats.sort((a,b) => a-b);
            lngs.sort((a,b) => a-b);
            let latHighest = lats[lats.length-1],
                latLowest = lats[0],
                lngHighest = lngs[lngs.length-1],
                lngLowest = lngs[0];
            mapCentre.lat = latLowest + ((latHighest - latLowest) / 2);
            mapCentre.lng = lngLowest + ((lngHighest - lngLowest) / 2);
          }
          return mapCentre;
        }, {});

        if (Object.keys(centre).length !== 0 && typeof centre == 'object') {
          this.set('centreLat', centre.lat);
          this.set('centreLng', centre.lng);
        }
  },

  // method to convert date / time to milliseconds which is later used to identify sensor values by using datetime as property of sensor
  toMilliseconds: function (value, type) {
    if (value) {
      switch (type) {
        case 'date':
          return value.valueOf();
          break;
        case 'hour':
          return value * 60000 * 60;
          break;
        case 'minute':
         return value * 60000;
      }
    }
  },

  actions: {

    // Setting date on change of DOM input
    setDate: function (value) {
      let date = this.toMilliseconds(value, 'date');
      this.set('date', date);
    },

    // Setting hour on change of DOM input && also update slider value
    setHour: function (value) {
      let hour = this.toMilliseconds(value, 'hour');
      this.set('hourVal', value);
      this.set('hour', hour);
    },

    // Setting minute on change of DOM input && also update slider value
    setMinute: function (value) {
      let minute = this.toMilliseconds(value, 'minute');
      this.set('minuteVal', value);
      this.set('minute', minute);
    },

    // Computing sensor value from date and time input
    getSensorValue: function () {
      let dateTime,
          date = this.get('date') ? this.get('date') : 0,
          hour = this.get('hour') ? this.get('hour') : 0,
          minute = this.get('minute') ? this.get('minute') : 0,
          sensorData = this.get('sensorData'),
          locations = this.get('locations');

      dateTime = date + hour + minute;

      for (let k in sensorData) {
        locations.forEach(location => {
          if (location.sensor == k) {
            let momentDate = moment(dateTime).format('L'),
                momentTime = moment(dateTime).format('LT');
            set(location, 'date', momentDate);
            set(location, 'time', momentTime);
            set(location, 'sensorValue', sensorData[k][dateTime]);
            this.set('showInfoWindow', true);
          } else {
            this.set('showInfoWindow', false);
          }
        });
      }
    },

    // Updating DOM input for hour when slider changes (hour)
    changedHour: function (value) {
      console.log(`changed hour slider`);
      let hour = this.toMilliseconds(value, 'hour');
      this.set('inputHour', value);
      this.set('hour', hour);
    },

    // Updating DOM input for minute when slider changes (minute)
    changedMinute: function (value) {
      let minute = this.toMilliseconds(value, 'minute');
      this.set('inputMinute', value);
      this.set('minute', minute);
    }
  }
});
