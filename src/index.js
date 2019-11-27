
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
  } = require('actions-on-google');

  const express = require('express');
  const bodyParser = require('body-parser'); 

  const expressApp = express();

const app = dialogflow({
    debug: true
  });

app.intent("Todos os Cursos", function(conv) {
    conv.ask("How are you?");
});

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
  });

  app.fallback((conv) => {
    conv.ask(`I couldn't understand. Can you say that again?`);
  });

  expressApp.set('port', (process.env.PORT || 5000));
  expressApp.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).use(bodyParser.json(), app).listen(expressApp.get('port'), function() {
    console.log('App is running, server is listening on port ', expressApp.get('port'));
});


module.exports = app;
