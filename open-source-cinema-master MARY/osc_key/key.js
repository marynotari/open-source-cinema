// Declare kinectron
var kinectron = null;
var kinectronIpAddress = "169.254.204.46"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
// Use two canvases to draw incoming feeds
var canvas;
var ctx;
var green_screen_texture;

// set a fixed 2:1 for the images
var CANVW = 512;
var CANVH = 512;

function setupKey(){
  // Define and create an instance of kinectron
  kinectron = new Kinectron(kinectronIpAddress);//copy and paste address here
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");  //for one at itp
  // Connect remote to application
  kinectron.makeConnection();
  kinectron.startKey(gotKey);//gotKey = callback function
  // Setup canvas and context
  canvas = document.getElementById('canvas1');
  canvas.width = CANVW;
  canvas.height = CANVH;
  ctx = canvas.getContext('2d');

//create a plane to map video onto using texture mapping
  var geo = new THREE.PlaneGeometry(100,100);
  green_screen_texture = new THREE.Texture(canvas);  //make this global because you have to update it
  //var mat = new THREE.MeshBasicMaterial({ map: green_screen_texture });

  var mat = new THREE.MeshBasicMaterial({ map: green_screen_texture , transparent: true, opacity: 1, side: THREE.DoubleSide });
  var plane = new THREE.Mesh(geo, mat);
  plane.position.y = 0;
  plane.position.x = -200;
  plane.position.z = 300;
  plane.scale.set(4,4,1);
  return plane;

}

function gotKey(data) {
  // Image data needs to be draw to img element before canvas
  //  console.log(data);
  var img1 = new Image;
  img1.src = data.src;

//use an anonymous function
  img1.onload = function () {
  ctx.clearRect(0,0, CANVW, CANVH);
  ctx.drawImage(data,0,0, CANVW, CANVH);
}

}

function animateKey(){
  green_screen_texture.needsUpdate = true;
}

function startRecord(){
  kinectron.startRecord();
}

function stopRecord(){
  kinectron.stopRecord();
}
