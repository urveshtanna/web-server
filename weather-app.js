const axios = require('axios');
const apiKey = 'e8ab314af698f9f0670686ed8434b088';
var fullAddress = undefined;

var getWeather = (location) =>{
  return new Promise((resolve,reject)=>{
    var encodedURIAddress = encodeURIComponent(location);
    var getGeocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedURIAddress}`;
    axios.get(getGeocodeUrl).then((response)=>{
    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('Unable to find that address');
    }else {
        var latitude = response.data.results[0].geometry.location.lat;
        var longtitude = response.data.results[0].geometry.location.lng;
        var getWeatherUrl = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longtitude}`;
        fullAddress = response.data.results[0].formatted_address;
        return axios.get(getWeatherUrl);
    }
    }).then((weatherResponse)=>{
        //Return the weather response
        weatherResponse.data.fullAddress = fullAddress;
        resolve(weatherResponse);
    }).catch((error)=>{
        if(error.code == 'ENOTFOUND'){
          console.log('Unable to connect with server');
        }else{
          console.log(error.message);
        }
        reject(error);
    });
  });
};

// var response = getWeather('Chandra bhuvan Khokhani lane').then((success)=>{
//     console.log(`Sucess :`);
// },(errorMessage)=>{
//   console.log(`Error `);
// });

getTemperatureInCelsius = (temperatureInF) => {
  var celsius = (5/9) * (temperatureInF - 32);
  return Math.round(celsius);
};

module.exports ={
  getWeather
};
