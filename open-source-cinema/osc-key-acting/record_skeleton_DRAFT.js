// RECORD SKELETON DATA TO JSON FILE IN MLAB

// GLOBAL IMAGE VARIABLES FROM KINECTRON SOURCE
let imageData = null;
let imageDataSize = null;
let imageDataArray = null;

let busy = false; //is kinect open?
let currentCamera = null; //indicates the type of Kinectron camera (color, depth, skeleton, etc.)

let sendAllBodies = false; //indicates if you are tracking one body or all 6 possible bodies in Kinectron

// let multiFrame = false; //allows for recording mulitple types
let currentFrames = null //for use in multiFrame

let sentTime = Date.now(); //keeps track of current time

let trackedBodyIndex = -1; //used in startKey() in Kinectron source

// GLOBAL RECORD VARIABLES FROM KINECTRON SOURCE
// const recordingLocation = os.homedir() + "kinectron-recordings" //make so that recordings will go straight to mLab
const recordingLocation = $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?q=" + query +"&apiKey=" + apiKey
let doRecord = false;
let recordStartTime = 0;
let bodyChunks = [];
let mediaRecorders = [];


// FUNCTIONS FROM KINECTRON SOURCE
// window.addEventListener('load', initpeer);
window.addEventListener('load', init);

function init() {
  setImageData()
}

// Only used for server-side record
function toggleRecord(evt) {
  if (!doRecord) {
    doRecord = true;
  } else {
    doRecord = false;
  }
  record(evt);
}

// Only used for client-iniated record
function startRecord() {
  // if record already running, do nothing
  if (doRecord) return;

  // if not, set do record and run
  if (!doRecord) {
    doRecord = true;
    record();
  }
}

function stopRecord() {
  // if record already stopped, do nothing
  if (!doRecord) return;
  // if running, turn record off
  if (doRecord) {
    doRecord = false;
    record();
  }
}

// Toggle Recording
function record(evt) {
  let recordButton = document.getElementById('record');
  let serverSide = false;

  if (evt) {
    evt.preventDefault();
    serverSide = true;
  }

  console.log(serverSide);

  if (doRecord) {
    // If no frame selected, send alert
    if (multiFrame === false && currentCamera === null) {
      alert("Begin broadcast, then begin recording");
      return;
    }

    var framesToRecord = [];

    if (multiFrame) {
      for (var i = 0; i < currentFrames.length; i++) {
        if (currentFrames[i] == 'body') framesToRecord.push('skeleton');
        else framesToRecord.push(currentFrames[i]);
      }
    } else if (currentCamera == 'body') {
      framesToRecord.push('skeleton');
    } else {
      framesToRecord.push(currentCamera);
    }

    for (var j = 0; j < framesToRecord.length; j++) {
      mediaRecorders.push(createMediaRecorder(framesToRecord[j], serverSide));
    }

    recordStartTime = Date.now();
    //doRecord = true;

    // Toggle record button color and text
    toggleButtonState('record', 'active');
    recordButton.value = "Stop Record";
  }

  else {
    //doRecord = false;
    toggleButtonState('record', 'inactive');
    recordButton.value = "Start Record";

    // Stop media recorders
    for (var k = mediaRecorders.length - 1; k >= 0; k--) {
      mediaRecorders[k].stop();
      mediaRecorders.splice(k, 1);
    }
  }
}



function getTake(){

  //get all the info for this user and this scene
  let myName = name_field.val() ;
  let query = JSON.stringify({owner:myName, take:takeNum});

  $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?q=" + query +"&apiKey=" + apiKey,
  type: "GET",
  success: function (data){  //create the select ui element based on what came back from db
    $.each(data, function(index,obj){
      if(obj.type == "keying"){
        // if(selectedObject){
        //     selectedObject.position.x = obj.x;
        //     selectedObject.position.y = obj.y;
        //     selectedObject.position.z = obj.z;
        //     selectedObject.rotation.x = obj.rx;
        //     selectedObject.rotation.y = obj.ry;
        //     selectedObject.rotation.z = obj.rz;
        // }
      }
    })
  },
  contentType: "application/json" } );
}
