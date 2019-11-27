
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
    BasicCard
  } = require('actions-on-google');

  const express = require('express');
  const bodyParser = require('body-parser'); 

  const expressApp = express();

  const request = require( 'request-promise' );

const app = dialogflow({
    debug: true
  });

app.intent("Todos os Cursos", async function(conv) {
    conv.ask("Lista de Todos os Cursos");
    let options = {
        method: 'get',
        uri: 'https://cvaadministracao.inec.org.br:4000/api/v1/course',
        json: true,
    }
    options.auth = {
        'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiJmNDRjM2JjMzI3YTkwODJmMTY2NmRlMGJiN2YwOGFhYiIsImFkbWluVG9rZW4iOiJmNjA2MDdmNDUyZTU0ZGQ1ZTU5ZmI5ZjNmNTA0YWIzYyIsInVzZXJJZCI6MTksImlhdCI6MTU3MzU5MTkzNH0.B2vr1OxHFdkfIrMzHu3wZq6Ozy5IqJqDkX205kRz_0Q'
    }

    let courses = await request(options).then(function(res){return res}).catch(function(err){console.log('erro in courses', err)});

    let columns = [];
    let rows = [];
    for(var i = 0; i < courses.length; i++){
        let c = courses[i];
        // conv.ask(new BasicCard({
        //     title : c.name,
        //     subtitle: c.hoursPerClass,
        //     text: c.description,
        //     display: 'CROPPED'
        // }));
        rows.push([c.name, c.description, c.hoursPerClass])
    }
    conv.ask(new Table({
        dividers: true,
        columns: ['Nome do Curso', 'Descrição', 'Horas'],
        rows: rows,
      }));
});

app.intent("Pegar um curso", async function(conv, params) {
    conv.ask(`Card do curso com id: ${params.courseId}`); 
    let options = {
        method: 'get',
        uri: `https://cvaadministracao.inec.org.br:4000/api/v1/course/${params.courseId}`,
        json: true,
    }
    options.auth = {
        'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiJmNDRjM2JjMzI3YTkwODJmMTY2NmRlMGJiN2YwOGFhYiIsImFkbWluVG9rZW4iOiJmNjA2MDdmNDUyZTU0ZGQ1ZTU5ZmI5ZjNmNTA0YWIzYyIsInVzZXJJZCI6MTksImlhdCI6MTU3MzU5MTkzNH0.B2vr1OxHFdkfIrMzHu3wZq6Ozy5IqJqDkX205kRz_0Q'
    }
    let course = await request(options).then(function(res){return res}).catch(function(err){console.log('erro in courses', err)});

    console.log(course);
    conv.ask(new BasicCard({
        title: course.name,
        subtitle: course.hoursPerClass,
        text: course.description,
        image: new Image({
            alt: `Imagem do Curso ${course.name}`,
            url: course.image
        })
    }));

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
