const request = require('request');

var getAddress = (address,callback) => {
  var encodedURIAddress = encodeURIComponent(address);
  console.log(address);
  request({
    url : `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedURIAddress}`,
    json : true
  },(error,response,body)=>{
    if(error){
      callback('Something went wrong! Check your connection and try again');
    }else if (body.status === 'OK') {
      console.log(`Address : ${JSON.stringify(body.results[0].formatted_address,undefined,2)}`);
      //console.log(`Latitude : ${JSON.stringify(body.results[0].geometry.location.lat,undefined,2)}`);
      //console.log(`Latitude : ${JSON.stringify(body.results[0].geometry.location.lng,undefined,2)}`);
      callback(undefined,{
        address : body.results[0].formatted_address,
        lat : body.results[0].geometry.location.lat,
        lng : body.results[0].geometry.location.lng
      });
    }else if(body.status == "ZERO_RESULTS"){
      callback('No address found! Try entering something different');
    }
  });

};

module.exports = {
  getAddress : getAddress
};
