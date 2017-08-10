'use strict';
var Alexa = require('alexa-sdk');
const databaseManager = require('./databaseManager');

var APP_ID = 'amzn1.ask.skill.eaaeba5e-1d90-4781-b3b9-b7df4a192eb2';

var SKILL_NAME = "My THC guide";
var GET_FACT_MESSAGE = "Here's your cannabis fact: ";
var HELP_MESSAGE = "You can say tell me a cannabis fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

module.exports.intents = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId  = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function findUserFactBase(userId) {
  return databaseManager.findUserFactsId(userId).then(item => {
     console.log(userId);
     console.log(item);
     return item;
  });
}

// function findFactsDBCount() {
//   return databaseManager.findFactsCount().then(item => {
//     console.log(item);
//     return item;
//   });
// }


var handlers = {
    'LaunchRequest': function () {
        this.emit('GetTHCFactIntent');
    },
    'GetTHCFactIntent': function () {
      if(findUserFactsId === null){
        //show one fact and add to the userFacts table
       } 
        //else {
        // 1.Citanje od dynamoDB tabela facts & tabela user-facts
        // 2.Sporeduvanje na tabelata facts & tabela user-facts razlikata od dvete tabeli se dodava vo Temporary array
        // function symmetricDifference(facts_array, facts_idarray) {
        //   var result = [];
        //   for (var i = 0; i < facts_array.length; i++) {
        //     if (facts_idarray.indexOf(facts_array[i]) === -1) {
        //       result.push(facts_array[i]);
        //     }
        //   }
        //   for (i = 0; i < facts_idarray.length; i++) {
        //     if (facts_array.indexOf(facts_idarray[i]) === -1) {
        //       result.push(facts_idarray[i]);
        //     }
        //   }
        //   return result;

          //OR WE USE SET JS http://jsclass.jcoglan.com/set.html
          // var a = new JS.Set(facts_array);
          // var b = new JS.Set(facts_idarray);

          // var array_to_rand = (a.difference(b));
        //}
        // 3.Ja povikuvame funkcijata random number so range od 1 do array_ken(Tmp-array)
        // 4.Go izbirame elementot od tmp-array[RandomNumberResult]
        // 5.Go prikazuvame factot i go zapisuvame vo tabelata user-facts 
      //}



      // tuka ke treba da se stavi logikata so baraj koi id se za toj userid veke iskoristeni i vo nov random da se trgaat tie
      //  console.log(this.event.session.user.userId);

    //  vikaj so .then ova =>  findUserFactBase(this.event.session.user.userId);

//        var factArr = data;
        var factCount = 0;
        console.log('PRED DA VIKNAM');
        databaseManager.findFactsCount()
        .then(item => {
           factCount = item;
           console.log('factCount : ' + factCount );
           var factIndex = Math.floor(Math.random() * factCount-1);
            databaseManager.findFactsId(factIndex)
              .then(item => {
                var randomFact = item.cannabis_fact;
                var speechOutput = GET_FACT_MESSAGE + randomFact;
                var userID = this.event.session.user.userID;
                this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
                databaseManager.saveUserFactToDatabase(userID, randomFact); //dodavanje na randomFact vo db po user
              });
        })
        .catch(error => {
            console.log(error);
        });
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt); 
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};