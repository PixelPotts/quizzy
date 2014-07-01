/*
 *
 *
 * Quizzy - The automatic, infinite quiz!
 * @author Bryan Potts <pottspotts@gmail.com>
 *
 *
 */


// Configure Underscore.String
_.mixin(_.str.exports());

// define and initiate the view model template
function QuizViewModel(){
  this.init();
}

// Extend the view model prototype with our observable properties and application methods
$.extend(QuizViewModel.prototype,{

  init: function(){
     // Quiz parameters - KO observables are lowercase; config vars are uppercase
    this.FRAMERATE = 1000;
    this.CLOCK_START = 10;
    this.TITLE = 'Quizzy';
    this.timer = ko.observable(this.CLOCK_START);

    this.question = ko.observable('');
    this.correctAnswer = ko.observable('');
    this.possibleAnswers = ko.observableArray([]);

    // Get the initial question
    var cur_question = this.makeQuestion();
  },

  // makeQuestion grabs a single template randomly from the pool provided
  // by the user via the API, but for now its hard-coded in objects.js
  makeQuestion: function(){
    self = this;

    var newQuestion = '';

    // get a random template from the user input
    var template = _.first( _.sample(Templates,1) );

    // Pull out the characters used in the template this is done by looking
    // for the intersect of characters found in the question.limits detail,
    // and the English alphabet
    var lettersUsed = _.intersection( _.keys(template.limits), Alphabet );
    var operatorsUsed = _.intersection( _.chars(template.question), Operators );

    // Now that we've found the letter variables, let's give them random
    // value from the user-provided limits, and push it to a newVals list
    var newVals = [];
    _.each(template.limits, function(limits, letter){
      newVals.push( { letter: letter, value: _.random( limits.min, limits.max) } );
    });

    // Now that we have our list of vars, their values, and the operators (with each
    // still in the original order they were found), let's construct the question to show
    // and run it through eval() to get the answer. (using eval is okay in this instance)
    _.each(newVals, function(val){
      newQuestion = newQuestion + ' ' + val.value;
      if(_.size(operatorsUsed) > 0 ) newQuestion += ' ' + operatorsUsed.shift();
    });

    // Get the correct answer and push it to the possible answers list
    self.correctAnswer( self.evalQuestion(newQuestion) );
    self.possibleAnswers.push( self.correctAnswer() );

    // Get some wrong answers and add them to the possible answers list
    _.each( self.getWrongAnswers( self.correctAnswer() ), function(wrongAnswer){
      self.possibleAnswers.push(wrongAnswer);
    });

    // Append the equal sign and the question mark to the new question
    newQuestion += ' = ?';

    // Update the observable with the new question
    self.question(newQuestion);


  },

  // Evaluate the newly formed question with native eval()
  evalQuestion: function(question){
    return eval(question);
  },

  // Get wrong answers based closely, and some loosely, on the correct answer
  getWrongAnswers: function(correct_answer){
    var wrongs = [];
    wrongs.push( - Math.abs(correct_answer)) // inversion the correct
    wrongs.push( Math.round(correct_answer * 1.1) ); // 110% of correct
    wrongs.push( Math.round(correct_answer / 10) ); // 10% of correct
    wrongs.push(_.random(correct_answer, correct_answer * 2)); // random between correct and correct*2
    return wrongs;
  },

  // countdown updates the game clock every second
  countdown: function() {
    var time = self.timer();
    if(time > 0) self.timer(self.timer()-1); // subtract one second from the clock
  }
});

// Global objects exposed for debugging
window.player = {};
window.qvm = new QuizViewModel();
$(document).ready(function() {

  ko.bindingHandlers.format = {
    symbol: ko.observable(''),
    update: function(element, valueAccessor, allBindingsAccessor){
      return ko.bindingHandlers.text.update(element,function(){
        var value = +(ko.utils.unwrapObservable(valueAccessor()) || 0);
        return value.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      });
    }
  };

  ko.applyBindings(qvm);

  //Master Quiz Interval
  var mainloop = function() {
    qvm.countdown();
  };
  setInterval( mainloop, qvm.FRAMERATE );

});