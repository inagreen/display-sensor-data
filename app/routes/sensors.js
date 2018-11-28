import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  // Defining sensorLocations model and importing sensor data from JSON file to be used to compute sensorLocations properties within component
  model() {
    return RSVP.hash({
      sensorLocations: [{
        sensor: 'A',
        lat: 53.426928,
        lng: -2.251458,
        sensorValue: null,
        date: null,
        time: null,
        showInfoWindow: false

      }, {
        sensor: 'B',
        lat: 53.476933,
        lng: -2.254863,
        sensorValue: null,
        date: null,
        time: null,
        showInfoWindow: false
      }, {
        sensor: 'C',
        lat: 53.457387,
        lng: -2.284734,
        sensorValue: null,
        date: null,
        time: null,
        showInfoWindow: false
      }],
      // Importing and fetching sensor data from JSON file
      sensorData: fetch('technicalTaskData.json')
                    .then(function(res) {
                        return res.json()
                    })
    });
  }
});
