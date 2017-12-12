// Initialize Firebase
var config = {
  apiKey: "AIzaSyCaOobwsPCsWfVEZGFQtAR6p7QlzCUPwDw",
  authDomain: "ucsd-coding-bootcamp-pro-ffd1c.firebaseapp.com",
  databaseURL: "https://ucsd-coding-bootcamp-pro-ffd1c.firebaseio.com",
  projectId: "ucsd-coding-bootcamp-pro-ffd1c",
  storageBucket: "ucsd-coding-bootcamp-pro-ffd1c.appspot.com",
  messagingSenderId: "670033437504"
};
firebase.initializeApp(config);

var database = firebase.database();

//Pull the info from the form 
$("#add-train-btn").on("click", function (event) {
  //Prevent Default form action
  event.preventDefault();

  //Grab the user's input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var trainFreq = $("#frequency-input").val().trim();

  //Local object for train data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    firstTrain: firstTrain,
    frequency: trainFreq
  };

  //Uploads train data in database
  database.ref().push(newTrain);

  //clear the input fields
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

//Update the Firebase database when a new train child is added
database.ref().on("child_added", function (childSnapshot) {

  //Storing the Database values in variables 
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var firstTrain = childSnapshot.val().firstTrain;
  var trainFreq = childSnapshot.val().frequency;

  //Calculate the next arrival and the minutes away
  //Pushing back the first train time by 1 year (safeguard against current time coming before the firstTrain var)
  var firstTrainConvert = moment(firstTrain, "hh:mm").subtract(1, "years");

  //using moment.js to get currentTime
  var currentTime = moment();

  //Find the amount of minutes between firstTrainConvert and currentTime 
  var timeDifference = moment(currentTime).diff(moment(firstTrainConvert), "minutes");

  //Find the remainder of mins left between the time difference and the frequency of train arrivals
  var remainder = timeDifference % trainFreq;

  //Use the remainder to deduce how many mins are left until the next train's arrival
  var minutesLeft = trainFreq - remainder;

  //Add minutesLeft to currenTime to get the next arrival time
  var nextTrain = moment(currentTime).add(minutesLeft, "minutes").format("hh:mm A");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>"
    + trainFreq + "</td><td>" + nextTrain + "</td><td>" + minutesLeft + "</td></tr>");

});