
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
  } = require('actions-on-google');

  const express = require('express');
  const bodyParser = require('body-parser'); 
  const port = process.env.port || 3000;

const app = dialogflow({
    debug: true
  });

app.intent("Todos os Cursos", function(conv) {
    app.ask("How are you?");
});

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
  });

  app.fallback((conv) => {
    conv.ask(`I couldn't understand. Can you say that again?`);
  });

  express().use(bodyParser.json(), app).listen(port, function(){console.log("AQUI VEIO")});


module.exports = app;
