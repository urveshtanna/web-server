//framework to render pages
const express = require('express');
//
const hbs = require('hbs');
//To save logs locally in file
const fs = require('fs')

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

//Function with param
hbs.registerHelper('stringToUpperCase',(text)=>{
  return text.toUpperCase();
});

app.get('/',(req,res)=>{
  //To use partials
    res.render('home.hbs',{
      pageTitle:'Home Page',
      welcomeMessage : 'Welcome to my website',
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

app.listen(3000,()=>{
  console.log('Server is up');
});
