// see https://developers.google.com/maps/documentation/javascript/streetview for street view docs

//empty array to put the objects that can be grabbed
//like sirena, blackbeard, and whitedoe
var grabbableMeshes = [];
//variable to hold the object that is grabbed
var selectedObject;
//variable to hold the dot that displays the position of the hand
var handProxy;
//variable to hold the state of the Kinectron being connected
var kinectron = null;

// Three.js variables
var width = window.innerWidth;
var height = window.innerHeight;
var camera3D;  //be careful because p5.js might have something named camera
var scene;
var renderer;

// //[OLD]Saving Stuff
// var selectedElement;
// var numberOfElements = 0;
// var dragging = false;
// var allElements = [];
// var name_field;
// var scene_field;
// var sceneNum = 1;
// var people;
// var texture;

//go to  http://docs.mlab.com/ sign up and get get your own api Key and make your own db and collection
var apiKey = "qAuY_iyWIThL7v_E94cZCZMoRxm3bwoN";
var db = "open-source-cinema";
var coll = "osc_setting_street_view";

//[OLD]var cube3D;

//Street View Panorama
var panorama;

//call Three.js functions
init();
animate();

//define Three.js functions
function init() {
  console.log("init three js");
  scene = new THREE.Scene();
  camera3D = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, .1, 1000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  //i'm not sure what this does:
  document.getElementById( 'container' ).appendChild( renderer.domElement );

  camera3D.position.z = 5;

  //create La Sirena
  var geometry = new THREE.PlaneGeometry(10, 20);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('sirena.png')
  } );
  var sirena = new THREE.Mesh( geometry, material );
  sirena.position.x = -70;
  sirena.position.y = -1;
  sirena.position.z = -20;
  sirena.lookAt(new THREE.Vector3( 0, 0, Math.PI / 2)); //object is always facing camera
  scene.add( sirena );

  //create Blackbeard
  var geometry2 = new THREE.PlaneGeometry(50, 55);
  var material2 = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('blackbeard.png')
  } );
  var blackbeard = new THREE.Mesh( geometry2, material2 );
  blackbeard.position.x = 50;
  blackbeard.position.y = 5;
  blackbeard.position.z = -10;
  blackbeard.lookAt(new THREE.Vector3( 0, 0, Math.PI / 2)); //object is always facing camera
  scene.add( blackbeard );

  //create Virginia Dare
  var geometry3 = new THREE.PlaneGeometry(10, 20);
  var material3 = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('whitedoe.png')
  } );
  var whitedoe = new THREE.Mesh( geometry3, material3 );
  whitedoe.position.x = -10;
  whitedoe.position.y = 5;
  whitedoe.position.z = -30;
  // whitedoe.lookAt(new THREE.Vector3( 0, 0, Math.PI / 2)); //object is always facing camera
  scene.add( whitedoe );

  //UI
  htmlInterface();

  //check for clicks <--is this for mouse and kinectron?
  document.addEventListener( 'mousedown', onDocumentMouseDownCheckObject, false);
  activatePanoControl(camera3D); //field mouse dragging to move camera

  //UGLY LITTLE PROXY FOR YOUR handPosition
  var geometryBox = new THREE.BoxGeometry( 2, 2, 2 );
  var materialBox = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  handProxy = new THREE.Mesh( geometryBox, materialBox );
  scene.add(camera3D);//add the camera to the scene
  camera3D.add( handProxy ); // then add the handProxy to the camera so it follow it
  handProxy.position.set(0,0,-10);

    // //CREATE A SPHERE TO PUT PANORAMA VIDEO ON
    // //DON'T NEED IF USING GOOGLE STREET VIEW
    // var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    // geometry.scale( -1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( {
    //   map: new THREE.TextureLoader().load('ruin.jpg')
    // } );
    // var mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

}

function animate() {
  requestAnimationFrame(animate);

  // I wonder what this was for...
    // for(var i = 0; i < grabbableMeshes.length; i++){
    //  grabbableMeshes[i].animate();
    //  }

  renderer.render(scene, camera3D);
}

// //[OLD]used in place of three.js init()
// function setup(){
//   htmlInterface();
//   listOfUsers();
//   setUp3D();
//   getScene();
//
//   activatePanoControl();
//   //setUpStreetView();
// }

function htmlInterface(){
  //moved most of these out into html file instead of creating them in p5js
  name_field = $("#name");
  name_field.val("Dan");
  scene_field = $("#sceneNum");
  plot_point_field = $("#plot_point");
  $("#previous").click(previous);
  $("#next").click(next);
  $("#previous_plot_point").click(previousPlotPoint);
  $("#next_plot_point").click(nextPlotPoint);
  scene_field.val(sceneNum);
  plot_point_field.val(plotPoints[plotPoint]);
  //if they hit return in ip address text entry field than connect to kinectron
  $("#kinectron_address").on('keyup', function (e) {
    if (e.keyCode == 13) {
      connectToKinectron($("#kinectron_address").val());
    }
  });
}

function connectToKinectron(ipAddress){\

  // //if you already have a connection kill it
  // if(kinectron) kinectron.stopAll();

  // Define and create an instance of kinectron
  kinectron = new Kinectron(ipAddress);
  console.log("Connected to " + ipAddress );

  // Connect remote to application
  kinectron.makeConnection();

  // mode = "keying"
  // //this is using object oriented coding for the a kinectronKey
  // var keyObject = new kinectronKey(-200, 0, 300);
  // scene.add(keyObject.getMesh());
  // selectedObject = keyObject;
  // grabbableMeshes.push(keyObject.getMesh());//put it in the list of things that you check for mouse clicks on
  // kinectron.startKey(gotKey);//listen to the kinectron with this object
  // console.log("Connected to " + ipAddress );
  // // console.log(keyObject);

}

//NOTE: You are using Google Street View's panorama rather than creating a Three.js sphere and wrapping a panorama around it.
//      This will affect the way your other assets look on top of the panorama:
//        ie: the coordinates of your objects will not lay uniformly on top of the scene
//IDEA: Try to put the Google Street View panorama onto a SphereGeometry:
        // var geometryPano = new THREE.SphereGeometry(500, 60, 40); //numbers from Dano's code in osc_control
        // geometryPano.scale(-1, 1, 1);
        // var materialPano = new THREE.MeshBasicMaterial({
        //   map: new THREE.TextureLoader().load(panorama)
        // });
        // var meshPano = new THREE.Mesh(geometryPano, materialPano);
        // scene.add(meshPano);

function setUpStreetView(id,pov){

  //USING LATITUDE AND LONGITUDE TO LOCATE GOOGLE STREET VIEW IMAGE
  var jockeysRidge = {lat: 35.9582107, lng: -75.6382598};

  //USING PANO ID TO LOCATE GOOGLE STREET VIEW IMAGE
  // if(id == null || pov== null){
  //   var panoramaOptions = {
  //     pano: "CAoSLEFGMVFpcE56WmZaMUFsRjVYekl3eU5LQ0ZIVWtvdlBzVXh4Y3lsaHg0UmNh", //panorama ID from: https://www.google.com/maps/@35.9582107,-75.6382598,3a,75y,49.75h,90t/data=!3m8!1e1!3m6!1sAF1QipNzZfZ1AlF5XzIwyNKCFHUkovPsUxxcylhx4Rca!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNzZfZ1AlF5XzIwyNKCFHUkovPsUxxcylhx4Rca%3Dw203-h100-k-no-pi-0-ya192.71808-ro-0-fo100!7i8704!8i4352
  //     pov: {
  //       heading: 34, //defines the rotation angle around the camera locus in degrees relative from true north (90 degrees is true east)
  //       pitch: 10 //defines the angle variance "up" or "down" from the camera's initial default pitch
  //     }
  //   };
  // } else{
  //   var panoramaOptions = {
  //     pano: id,  // Wanted to demonstrate 'setPano' instead.
  //     pov: pov
  //   };
  // }
  // panorama = new google.maps.StreetViewPanorama( document.getElementById("pano"), panoramaOptions );

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), {
      position: jockeysRidge,
      pov: {
        heading: 34,
        pitch: 10
      }
    }
  );
}

//THIS IS WHERE THE KINECTRON BODIES ARE TRACKED
//BUT YOU DON'T NEED ALL THESE DIFFERENT MODES
function keyPressed(){

  //space key turns on moving
  if (key == ' '){ //space key
    // if (mode == "keying"){
    // //  kinectron.stopAll();
      kinectron.startTrackedBodies(gotBody);
      mode = "moving"
      console.log("moving");
    }else{
      kinectron.stopAll();
      // kinectron.startKey(gotKey);
      // mode = "keying"
      // console.log("change to keying");
    }
  }

}

//called by kinectron when you are in skeleton mode
function gotBody(data){

  //numbers come in normalized 0-1 and you need to scale them to your space
  var scaleBy = 500;
  var leftHand = data.joints[kinectron.HANDLEFT];
  var rightHand = data.joints[kinectron.HANDRIGHT];
  x = map(leftHand.cameraX, 0, 1, 0, scaleBy);
  y = map(leftHand.cameraY, 0, 1, 0, scaleBy);
  z = map(leftHand.cameraZ, 0, 1, scaleBy, 0);
  handProxy.position.set(x, y, -z);

  //go look what the handProxy is intersecting with
  var closestObject = checkIntersections();
  if (closestObject[0] != -1){
    //if they made a fist gesture
    if(data.leftHandState == 3){
      var closestObjectIndex = closestObject[0];
      selectedObject = grabbableMeshes[closestObjectIndex];
      //find the position of the handProxy and pretend it is your hand.
      var handPosition = new THREE.Vector3();
      handPosition.setFromMatrixPosition( handProxy.matrixWorld );
      var handPosInWorld = handPosition; //camera3D.localToWorld( handPosition  );
      //console.log(handPosInWorld);
      selectedObject.position.set(handPosInWorld.x, handPosInWorld.y, handPosInWorld.z);
      //this only works so so, might consider using the rotation of another joint
      //selectedObject.getMesh().rotation.set(rightHand.orientationX, rightHand.orientationY, rightHand.orientationZ);
    }
  }
}

//I DON'T UNDERSTAND THIS AT ALL
//checks against the list of grabbableMeshes for what you have clicked on to make it the "selectedObject"
function onDocumentMouseDownCheckObject( e ) {
  console.log("clicked object", selectedObject);
  var raycaster = new THREE.Raycaster(); // create once
  var mouse = new THREE.Vector2(); // create once
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera3D );
  var intersects = raycaster.intersectObjects( grabbableMeshes, true );
  var tempobj;
  for( var i = 0; i < intersects.length; i++ ) {
    var intersection = intersects[ i ],
    tempobj = intersection.object;
    //break;
  }
  if (tempobj) selectedObject = tempobj
  console.log("clicked object", selectedObject);

}

//I DON'T UNDRSTAND THIS AT ALL
function checkIntersections(){
  var shortestDistance = 31000;  //holds world's record for closest, set high at start
  var winningObject = -1;
  scene.updateMatrixWorld(true);
  for (var i = 0; i < grabbableMeshes.length; i++){
    var handPosition = new THREE.Vector3();
    handPosition.setFromMatrixPosition( handProxy.matrixWorld );
    var objectPosition = new THREE.Vector3();
    objectPosition.setFromMatrixPosition( grabbableMeshes[i].matrixWorld );
    var distance = handPosition.distanceTo(objectPosition);
    if (distance < shortestDistance){
      shortestDistance = distance;
      winningObject = i; //best so far
    }
  }
  var winnings = [winningObject,shortestDistance];
  return winnings;
}

//[OLD] THIS IS NOW DEFINED IN INIT() ABOVE
function setUp3D(){

  // scene = new THREE.Scene();
  // camera3D = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, .1, 1000 );
  // renderer = new THREE.WebGLRenderer( { alpha: true });
  // renderer.setSize( window.innerWidth, window.innerHeight );
  // document.getElementById( 'container' ).appendChild( renderer.domElement );
  // camera3D.position.z = 5;

  // //create La Sirena
  // var geometry = new THREE.PlaneGeometry(10, 20);
  // var material = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load('sirena.png')
  // } );
  // var sirena = new THREE.Mesh( geometry, material );
  // sirena.position.x = -70;
  // sirena.position.y = -1;
  // sirena.position.z = -20;
  // sirena.lookAt(new THREE.Vector3( 0, 0, Math.PI / 2));
  // scene.add( sirena );
  //
  //
  // //create Blackbeard
  // var geometry2 = new THREE.PlaneGeometry(50, 55);
  // var material2 = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load('blackbeard.png')
  // } );
  // var blackbeard = new THREE.Mesh( geometry2, material2 );
  // blackbeard.position.x = 50;
  // blackbeard.position.y = 5;
  // blackbeard.position.z = -10;
  // blackbeard.lookAt(new THREE.Vector3( 0, 0, Math.PI / 2));
  // scene.add( blackbeard );
  //
  //
  // //create Virginia Dare
  // var geometry3 = new THREE.PlaneGeometry(10, 20);
  // var material3 = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load('whitedoe.png')
  // } );
  // var whitedoe = new THREE.Mesh( geometry3, material3 );
  // whitedoe.position.x = -10;
  // whitedoe.position.y = 5;
  // whitedoe.position.z = -30;
  // // whitedoe.lookAt(new THREE.Vector3( 0, 0, Math.PI / 2));
  // scene.add( whitedoe );

}

//[OLD] PREVIOUSLY USING P5.JS
// function draw(){  //there is a more official way to do this in three js
//   renderer.render(scene, camera3D);
//
// }

function previous(){
  saveCamera();
  sceneNum = max(1,sceneNum -1);
  scene_field.val(sceneNum);
  getScene()
}

function next(){
  saveCamera();
  sceneNum++;
  scene_field.val(sceneNum);
  getScene()
}

function saveCamera(){

  var heading = panorama.getPov();
  // console.log(heading);
  var pos = panorama.getPano();
  // console.log(pos);

  var myName =  name_field.val() ;
  var thisElementArray = {}; //make an array for sending
  thisElementArray.owner = myName;
  thisElementArray.type = "camera"
  thisElementArray.scene = sceneNum ;
  thisElementArray.camera = camera3D.matrix.toArray();
  thisElementArray.cameraFOV = camera3D.fov; //camera3D.fov;
  thisElementArray.panoID = panorama.getPano(); //camera3D.fov;
  thisElementArray.panoPOV = panorama.getPov(); //camera3D.fov;
  var data = JSON.stringify(thisElementArray ) ;

  var query =  "q=" + JSON.stringify({type:"camera", scene:sceneNum}) + "&";
  $.ajax( {
    url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?" +  query + "u=true&apiKey=" + apiKey,
    data: data,
    type: "PUT",
    contentType: "application/json",
    success: function(data){console.log("saved camera" );},
    failure: function(data){  console.log("didn't savecamera" );}
  });
}



function getScene(){

  //get all the info for this user and this scene
  var myName = name_field.val() ;
  var query = JSON.stringify({owner:myName, scene:sceneNum});

  $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?q=" + query +"&apiKey=" + apiKey,
  type: "GET",
  success: function (data){  //create the select ui element based on what came back from db
    if (data.length == 0)     setUpStreetView(null,null); //use default portal into world for first time
    for(var i = 0; i<data.length; i++){
      //  $.each(data, function(index,obj){
      var obj = data[i];
      if(obj.type == "camera"){
        camera3D.matrix.fromArray(obj.camera); // set the camera using saved camera settings
        camera3D.matrix.decompose(camera3D.position,camera3D.quaternion,camera3D.scale);
        camera3D.fov = obj.cameraFOV;
        camera3D.updateProjectionMatrix();
        setUpStreetView(obj.panoID,obj.panoPOV);
      }else{
        //we will worry about elements next week
        //newElement(obj._id,obj.src,obj.x,obj.y,obj.width,obj.height);
      }
    }
    //})
  },
  contentType: "application/json" } );
}


function listOfUsers(){
  $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db + "/runCommand?apiKey=" + apiKey,
  data: JSON.stringify( {"distinct": coll,"key": "owner"} ),
  type: "POST",
  contentType: "application/json",
  success: function(msg) {
    var allPeople =  msg.values;
    for(var i = 0; i < allPeople.length; i++){
      $("#other_people").append('<option>'+allPeople[i]+'</option>');
    }
    $("#other_people").change(pickedNewPerson);
  } } )
}


function pickedNewPerson() {
  var newName= $("#other_people").val();
  name_field.val(newName);
  sceneNum = 1;
  getScene();
}
