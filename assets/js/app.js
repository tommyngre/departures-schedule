//implementing google/github auth proved too tricky...
//this just collects info checks against global array of credential objs
var credentials = [
  {
    username: "tommy",
    password: "tommy"
  },
  {
    username: "chris",
    password: "chris"
  }
];

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
  if (confirmDelete == true) {
    $(this).parents('tr').remove();
  }
});

// EDIT FUNCTIONALITY
$("#appendLinesTo").on('click', '.fa-edit', function () {
  let row = $(this).parents('tr');

  if ($(row).attr('data-state') == 'set') {
    //console.log('set to edit');
    $(this).parents('tr').attr('contenteditable', 'true')
      .attr('data-state', 'edit')
      .css('color', 'red')
      .css('font-weight', '700');
  } else {
    //console.log('set to set');
    $(this).parents('tr').attr('contenteditable', 'false')
      .attr('data-state', 'set')
      .css('color', 'black')
      .css('font-weight', '400');

    //actually update firebase (as opposed to just HTML element)

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


function getNextTrain(firstTrainAt, frequency) {
  firstTrainAt = moment(firstTrainAt, "HH:mm");

  let currentTime = moment();

  //just so i don't need to enter it while testing
  frequency = 15;

  let diff = firstTrainAt.diff(currentTime, "minutes");

  do {
    diff = firstTrainAt.diff(currentTime, "minutes");
    firstTrainAt.add(frequency, 'minutes');
  } while (diff < 0)

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
  <td class='lato'>${s.name}</td>
  <td class='lato'>${s.destination}</td>
  <td class='lato'>${s.firstTrainAt}</td>
  <td class='lato'>${s.frequency} mins</td>
  <td class='lato'>${nextTrainIn} mins</td>
  <td><i class="fa fa-edit"></td>
  <td><i class="fa fa-minus-circle"></td>
  `

  let newLine = $("<tr>").html(html)
    .attr('data-state', 'set');
  $("#appendLinesTo").append(newLine);


  let htmlSm =
    `
  <td class='lato'>${s.name}</td>
  <td class='lato'>${s.destination}</td>
  <td class='lato'>${s.firstTrainAt}</td>
  <td class='lato'>${s.frequency} mins</td>
  <td class='lato'>${nextTrainIn} min</td>
  `

  let newLineSm = $("<tr>").html(htmlSm)
  $("#appendLinesTo-sm").append(newLineSm);


  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

//GET CREDENTIALS
//implementing google/github auth proved too tricky...
//this just collects info checks against global array of credential objs
function authenticate() {
  let authenticated = 'false';
  let username = $('#username').val().trim().toLowerCase();
  let password = $('#password').val().trim().toLowerCase();

  credentials.forEach(credential => {
    if ((credential.username == username) && (credential.password == password)) {
      authenticated = 'true';
      $('#modal').css('display', 'none');
      $('#control-panel').removeClass('disabled');
    }
  })

  if (authenticated == 'false') {
    $('#username').val("invalid credentials").css('color', 'red');
    $('#password').val("invalid credentials").css('color', 'red');

    setTimeout(function () {
      $('#username').val("").css('color', 'black');
      $('#password').val("").css('color', 'black');
    }, 2000)
  }
}
function launchAuth() {
  $('#modal').css('display', 'block');

  $('#submit-credentials').on('click', function () {
    authenticate();
  })

  $("#cancel-credentials").on('click', function () {
    $('#modal').css('display', 'none');
  });


};

$('#login').on('click', function () {
  launchAuth();
});