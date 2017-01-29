const request = require('request');
const apiKey = 'e8ab314af698f9f0670686ed8434b088';

getWeather = (lat,long,callback) =>{

    request({
      url : `https://api.darksky.net/forecast/${apiKey}/${lat},${long}`,
      json : true
    },(error,response,body)=>{

        if(error){
          callback('Some error occured, try again in sometime!');
        }else if(response.statusCode === 200){
          callback(
            undefined,{
              celsius : getTemperatureInCelsius(body.currently.temperature),
              apparentTemperature : getTemperatureInCelsius(body.currently.apparentTemperature),
              summary : body.currently.summary
            });
        }else{
          callback(`Something went wrong!`);
        }


    })

};

getTemperatureInCelsius = (temperatureInF) => {
  var celsius = (5/9) * (temperatureInF - 32);
  return Math.round(celsius);
};

module.exports ={
  getWeather
};
