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

function err(id, isStringVal) {
  if (isStringVal) {
    $(id).val("invalid input :(");
  }
  $(id).css('border', '1px solid red')
    .css('background-color', 'navajowhite');
}

function validateInputs(name, destination, firstTrainAt, frequency) {
  let string = true;
  if (name == "") {
    err("#nameInput", string);
    return false;
  } else if (destination == "") {
    err("#destinationInput", string);
    return false;
  } else if (firstTrainAt == "Invalid date") {
    string = false;
    err("#firstAtInput", string);
    return false;
  } else if (frequency == "") {
    err("#frequencyInput", string);
    return false;
  } else {
    return true;
  }
}

// DELETE FUNCTIONALITY
$("#appendLinesTo").on('click', '.fa-minus-circle', function () {
  let row = $(this).parents('tr');
  let confirmDelete = confirm("Delete this line?");
  if ( confirmDelete == true) {
    $(this).parents('tr').remove();
  }
});

// EDIT FUNCTIONALITY
$("#appendLinesTo").on('click', '.fa-edit', function () {
    let row = $(this).parents('tr');

    if ($(row).attr('data-state') == 'set') {
      console.log('set to edit');
      $(this).parents('tr').attr('contenteditable', 'true')
        .attr('data-state', 'edit')
        .css('color', 'red')
        .css('font-weight', '700');
    } else {
      console.log('set to set');
      $(this).parents('tr').attr('contenteditable', 'false')
        .attr('data-state', 'set')
        .css('color', 'black')
        .css('font-weight', '400');
    }
  });

//ADD FUNCTIONALITY
$("#add").on("click", function (event) {
  event.preventDefault();

  // values from inputs
  name = $("#nameInput").val();
  destination = $("#destinationInput").val();
  firstTrainAt = validateTime($("#firstAtInput").val());
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

  return diff;
}

database.ref().on("child_added", function (snapshot) {

  // store snapshot
  var s = snapshot.val();

  let nextTrainIn = getNextTrain(s.firstTrainAt, s.frequency); // moment(sv.start).fromNow();
  //console.log(nextTrainIn, "nextTrainIn");


  // Change the HTML to reflect
  let html =
    `
  <td class='editable'>${s.name}</td>
  <td class='editable'>${s.destination}</td>
  <td class='editable'>${s.firstTrainAt}</td>
  <td class='editable'>${s.frequency}</td>
  <td>${nextTrainIn} minutes</td>
  <td><i class="fa fa-edit"></td>
  <td><i class="fa fa-minus-circle"></td>
  `

  let newLine = $("<tr>").html(html)
    .attr('data-state', 'set');
  $("#appendLinesTo").append(newLine);


  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
