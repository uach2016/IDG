
/*
 **
 ** User stories:
 ** - Type text into a text area and see below counter words - Done
 ** - Counters word in real time - Done
 ** - Punctuation and numbers are ignored - Done
 ** - Evaluate spaces and full stops - Done
 ** - Count 2 secs without input - Done
 ** - User is able to cut / paste a block of text and be evaluated - Done
 ** - Has a link that allow entity analysis on the text entered - Done
 ** - Call Api, receive an array and display via ajax - Done
 ** - Error returned if text parameter is not used - Done
 **
 */


//All my elements selectors within HTML
"use strict";
var input = document.querySelectorAll('textarea')[0],
  characterCount = document.getElementById('character-count'),
  wordCount = document.getElementById('word-count'),
  spacesCount = document.getElementById('spaces-count'),
  dotsCount = document.getElementById('dots-count'),
  noInput = document.getElementById('2-sec-no-input'),
  button = document.querySelectorAll('button')[0],
  results = document.getElementById('results');


//Sort array
function sortFunction(a, b) {
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] > b[1]) ? -1 : 1;
  }
}

//For the timer
var seconds = 0;

var noInputTwoSecond = 0;
function incrementSeconds() {
    seconds += 1;
    if (seconds === 2){
      noInputTwoSecond += 1;
      noInput.innerHTML = noInputTwoSecond;
      seconds = 0;
    }
}
var cancel = setInterval(incrementSeconds, 1000);

// updating the displayed stats after every keypress
input.addEventListener('keyup', function() {
  seconds = 0
  //keeping the console clean to make only the latest data visible
  console.clear();

  // character count
  // just displaying the input length as everything is a character
  characterCount.innerHTML = input.value.length;

  // [\A-Za-z']+ looks for all letters from A to Z incluided lowercases
  //and give us an array
  var words = input.value.match(/[\A-Za-z']+/gi);

  if (words) {
    wordCount.innerHTML = words.length +"<br>";
  } else {
    wordCount.innerHTML = 0;
  }

  var result = {}; // object Literal to hold  "word":NumberOfOccurrences;

  if (words){

    // Loop Words Array
    for(var i=0; i<words.length; i++) {

      //I analyse all words in lowerCase
      var word = words[i].toLowerCase();

      // Increment if exists OR assign value of 1
      result[word] = ++result[word] || 1;
    }
}

  //Pass the object to an array to sort it
  var arrayWords = [];
  for (var x in result) {
      arrayWords.push([x, result[x]]);
  }

  //Call function to sort array
  var sortWords = arrayWords.sort(sortFunction)

  //Display array sorted
  if (sortWords){
    for(var i=0; i<sortWords.length; i++) {
      wordCount.innerHTML += sortWords[i][0] + "("+sortWords[i][1]+"), "
    }
  }else{
    wordCount.innerHTML = 0;
  }

  // [\s']+ looks for all spaces
  //and give us an array
  var spaces = input.value.match(/[\s']+/gi);

  if(spaces){
    var totalSpaces = 0;
    // Loop Spaces Array and display
    for(var i=0; i<spaces.length; i++) {
      totalSpaces += spaces[i].length;
      spacesCount.innerHTML = totalSpaces;
    }
  } else {
    spacesCount.innerHTML = 0;
  }

  // [.']+ looks for all dots
  // and give us an array
  var dots = input.value.match(/[.']+/gi);

  if(dots){
    var totalDots = 0;
    // Loop Dots Array and display
    for(var i=0; i<dots.length; i++) {
      totalDots += dots[i].length;
      dotsCount.innerHTML = totalDots;
    }
  } else {
    dotsCount.innerHTML = 0;
  }

});


//Call Api
button.addEventListener('click', function() {

  // placeholder until the API returns the score
  button.innerHTML = "searching";

  //data from the texttarea
  var data = input.value;
  var parameters = "https://cors-anywhere.herokuapp.com/https://cms.idg.co.uk/tmp/keyword-extractor.cfm?text="+data+"";
  var request = new XMLHttpRequest();
  request.open('POST', parameters, true);
  request.send();

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      var response = JSON.parse(this.response);

      //display response
      if(response.length > 0){
        for(var i=0; i<response.length; i++) {
          results.innerHTML = "";
          results.innerHTML += response[i]+", ";
        }
      }else{
        results.innerHTML = "No Macthes";
      }

    } else {
      // We reached our target server, but it returned an error
      results.innerHTML = "Error";
    }

    // placeholder after searching the API
    button.innerHTML = "Get Entities";
  };

  request.onerror = function() {
    // There was a connection error of some sort
    results.innerHTML = "Not available.";

    // placeholder after searching the API
    button.innerHTML = "Get Entities";
  };
});

//if refresh clean the app
function init() {
  input.value = "";
}
window.onload = init;
