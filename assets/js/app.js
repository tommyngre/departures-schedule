// Initialize Firebase
var config = {
  apiKey: "AIzaSyC25-WUlZIYukycskRciNzYbNkz0In1yRo",
  authDomain: "testing-c7ec4.firebaseapp.com",
  databaseURL: "https://testing-c7ec4.firebaseio.com",
  projectId: "testing-c7ec4",
  storageBucket: "testing-c7ec4.appspot.com",
  messagingSenderId: "498816457214"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// initial Values
var name = "";
var destination = "";
var firstTrainAt = "";
var frequency = "";

function validateTime(time) {
  time = moment(time, "HH:mm").format("HH:mm");
  return time;
}

function err(id,isStringVal) {
  if (isStringVal){
    $(id).val("invalid input :(");
  }
  $(id).css('border', '1px solid red')
    .css('background-color', 'navajowhite');
}

function validateInputs(name, destination, firstTrainAt, frequency) {
  let string = true;
  if (name == "") {
    err("#nameInput",string);
    return false;
  } else if (destination == "") {
    err("#destinationInput",string);
    return false;
  } else if ( firstTrainAt == "Invalid date" ) {
    string = false;
    err("#firstAtInput",string);
    return false;
  } else if (frequency == "") {
    err("#frequencyInput",string);
    return false;
  } else {
    return true;
  }
}

$("#add-user").on("click", function (event) {
  event.preventDefault();

  // values from inputs
  name = $("#nameInput").val();
  destination = $("#destinationInput").val();
  firstTrainAt = validateTime($("#firstAtInput").val());
  console.log(firstTrainAt, " firstTrainAt");
  frequency = $("#frequencyInput").val();

  let valid = validateInputs(name, destination, firstTrainAt, frequency);

  if (valid) {

    database.ref().push({
      name: name,
      destination: destination,
      firstTrainAt: firstTrainAt,
      frequency: frequency
    });

  }

});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"

//from 02-recent-user-with-push
//database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

function getNextTrain(firstTrainAt, frequency) {
  firstTrainAt = moment(firstTrainAt, "HH:mm");

  let currentTime = moment();

  //just so i don't need to enter it while testing
  frequency = 15;

  let diff = firstTrainAt.diff(currentTime, "minutes");

  do {
    diff = firstTrainAt.diff(currentTime, "minutes");
    console.log(diff);
    firstTrainAt.add(frequency, 'minutes');
  } while (diff < 0)

  console.log(diff, " after do/while");

  return diff
}

database.ref().on("child_added", function (snapshot) {

  // store snapshot
  var s = snapshot.val();

  let nextTrainIn = getNextTrain(s.firstTrainAt, s.frequency); // moment(sv.start).fromNow();
  //console.log(nextTrainIn, "nextTrainIn");


  // Change the HTML to reflect
  let html =
    `
  <td>${s.name}</td>
  <td>${s.destination}</td>
  <td>${s.firstTrainAt}</td>
  <td>${s.frequency}</td>
  <td>${nextTrainIn} minutes</td>

  `

  let newLine = $("<tr>").html(html);
  $("#appendLinesTo").append(newLine);


  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
