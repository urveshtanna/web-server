//framework to render pages
const express = require('express');
//
const hbs = require('hbs');
//To save logs locally in file
const fs = require('fs')
//Post that will be used by app
const port = process.env.PORT || 3000;
//To get Weather
const weather = require('./weather-app');

var app = express();
hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine','hbs');

//Custom Middleware
app.use((req,res,next)=>{
    var now  = new Date().toString();
    var log = `${req.method} => ${req.url} ${now}`;
    console.log(log);
    fs.appendFile('server.log',log+'\n',(error)=>{
      if(error){
        console.log('Unable to append file :'+error);
      }
    });
    next();
});

app.use((req,res,next)=>{
  //Continue rendering
  next();
  //To stop rendering
  //res.render('maintaince.hbs');
});

//static Middleware
app.use(express.static(__dirname+'/public'))

//Function without param
hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('getTemperaturInCelcius',(temperatureInF)=>{
  var celsius = (5/9) * (temperatureInF - 32);
  return Math.round(celsius);
})
//Function with param
hbs.registerHelper('stringToUpperCase',(text)=>{
  return text.toUpperCase();
});

app.get('/',(req,res)=>{
  //To use partials
    res.render('home.hbs',{
      pageTitle:'Home Page',
      welcomeMessage : 'Welcome to my website'
    })
});

app.get('/weather',(req,res)=>{
  weather.getWeather(JSON.stringify(req.query.location)).then((weatherResponse)=>{
    res.render('weather.hbs',{
      pageTitle:'Weather',
      location : req.query.location,
      summary : weatherResponse.data.currently.summary,
      temperature : weatherResponse.data.currently.temperature,
      fullAddress : weatherResponse.data.fullAddress,
      apparentTemperature : weatherResponse.data.currently.apparentTemperature
    });
  },((error)=>{
    console.log(error);
    res.render('weather-error.hbs',{
      pageTitle:'Weather',
      error : error.message
    });
  }));
  //To use partials
  //console.log(res);

});

app.get('/maintaince',(req,res)=>{
  //To use partials
  //console.log(res);
    res.render('maintaince.hbs',{
      pageTitle:'maintaince'
    })
});

app.get('/about',(req,res)=>{
    res.render('about.hbs',{
      pageTitle:'About Page',
    });
});

app.get('/bad',(req,res)=>{
    res.send({
        error_code : 404,
        error_message : 'Not Found!'

    });
});

app.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});
