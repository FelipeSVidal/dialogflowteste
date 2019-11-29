
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
    BasicCard,
    Suggestions
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
    let rows = [[194, 'Curso Teste', 'OO']];
    for(var i = 0; i < courses.length; i++){
        let c = courses[i];
        rows.push([c.id, c.name, c.hoursPerClass])
    }
    conv.ask(new Table({
        dividers: true,
        columns: ['Id do Curso', 'Nome do Curso', 'Horas'],
        rows: rows,
      }));

    conv.ask(new Suggestions('Curso com id 198'));
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
        title: `${course.id} - ${course.name}`,
        subtitle: course.hoursPerClass,
        text: `${course.description} \n § Numero X de alunos \n § Inicio: ${course.startDate} \t Fim: ${course.endDate}`,
        image: new Image({
            alt: `Imagem do Curso ${course.name}`,
            url: course.image
        }),
        display: "CROPPED"
    }));

    conv.ask(new Suggestions('Quantos solicitaram prazo'));
    conv.ask(new Suggestions('Quantos usuários'));

});

app.intent("Default Welcome Intent", function(conv){
    conv.ask('Olá eu sou o Assis, O que você gostaria de saber?');
});

app.intent("Solicitaram prazo", function(conv){
    let ctx = conv.contexts.get('pegarumcurso-followup');
    conv.ask(`1106 Alunos solicitaram prazo para o curso ${ctx.parameters.courseId}`);
});

app.intent("Qtd Alunos", async function(conv){
    let ctx = conv.contexts.get('pegarumcurso-followup');

    let options = {
        method: 'get',
        uri: `https://cvaadministracao.inec.org.br/webservice/rest/server.php?wstoken=f60607f452e54dd5e59fb9f3f504ab3c&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=${ctx.parameters.courseId}`,
        json: true,
    }
    options.auth = {
        'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiJmNDRjM2JjMzI3YTkwODJmMTY2NmRlMGJiN2YwOGFhYiIsImFkbWluVG9rZW4iOiJmNjA2MDdmNDUyZTU0ZGQ1ZTU5ZmI5ZjNmNTA0YWIzYyIsInVzZXJJZCI6MTksImlhdCI6MTU3MzU5MTkzNH0.B2vr1OxHFdkfIrMzHu3wZq6Ozy5IqJqDkX205kRz_0Q'
    }
    let qtdAlunos = await request(options).then(function(res){return res}).catch(function(err){console.log('erro in courses', err)});

    conv.ask(`O curso ${ctx.parameters.courseId} tem ${qtdAlunos.length} usuários matriculados`);
});

// FAZER O INTENT CARROSSEL PARA MOSTRAR RELATÓRIO DE CONCORDANTES COM O TERMO

app.intent("Concordantes com o termo", async (conv) => {
    let options = {
        method: 'get',
        uri: `https://cvaadministracao.inec.org.br:4000/api/v1/reports/7`,
        json: true,
    }
    options.auth = {
        'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiJmNDRjM2JjMzI3YTkwODJmMTY2NmRlMGJiN2YwOGFhYiIsImFkbWluVG9rZW4iOiJmNjA2MDdmNDUyZTU0ZGQ1ZTU5ZmI5ZjNmNTA0YWIzYyIsInVzZXJJZCI6MTksImlhdCI6MTU3MzU5MTkzNH0.B2vr1OxHFdkfIrMzHu3wZq6Ozy5IqJqDkX205kRz_0Q'
    }
    let termos = await request(options).then(function(res){return res}).catch(function(err){console.log('erro in courses', err)});
    conv.ask('Carousel Example');
    conv.ask(new Carousel({
        items:{
            ['1']:{
                image: new Image({url: 'http://www2.fab.mil.br/ecemar/images/phocadownload/moodlemobile.png', alt: 'img'}),
                title: `${termos.data[0].name}`,
                description: 'Description of number one',
                synonyms: ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'],
            },
            ['2']:{
                image: new Image({url: 'http://www2.fab.mil.br/ecemar/images/phocadownload/moodlemobile.png', alt: 'img'}),
                title: `${termos.data[1].name}`,
                description: 'Description of number two',
                synonyms: ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'],
            },
            ['3']:{
                image: new Image({url: 'http://www2.fab.mil.br/ecemar/images/phocadownload/moodlemobile.png', alt: 'img'}),
                title: `${termos.data[2].name}`,
                description: 'Description of number TREE',
                synonyms: ['synonym of KEY_TRE 1', 'synonym of KEY_TRE 2'],
            }
        }
    }));
});


app.catch((conv, error) => {
    console.error(error);
    conv.ask('Houve uma falha na sua pergunta. poderia reformula-la?');
  });

  app.fallback((conv) => {
    conv.ask(`Não consegui entender. Poderia falar novamente?`);
  });

  expressApp.set('port', (process.env.PORT || 5000));
  expressApp.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).use(bodyParser.json(), app).listen(expressApp.get('port'), function() {
    console.log('App is running, server is listening on port ', expressApp.get('port'));
});


module.exports = app;
