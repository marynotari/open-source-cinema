// Declare kinectron
let kinectron = null;
let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE

// Use two canvases to draw incoming feeds using vanilla JS
let canvas;
let ctx;
// let green_screen_texture;

// // set a fixed 2:1 for the images
// let CANVW = 512;
// let CANVH = 512;

let CANVW = windowWidth;
let CANVH = windowHeight;

function setupKey(){
  // Define and create an instance of kinectron
  kinectron = new Kinectron(kinectronIpAddress);
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");  //for one at itp
  // Connect remote to application
  kinectron.makeConnection();
  kinectron.startKey(gotKey);

  // Setup canvas and context using vanilla JS
  canvas = document.getElementById('canvas1');
  canvas.width = CANVW;
  canvas.height = CANVH;
  ctx = canvas.getContext('2d');

  // let geo = new THREE.PlaneGeometry(100,100);
  // green_screen_texture = new THREE.Texture(canvas);  //make this global because you have to update it
  // //let mat = new THREE.MeshBasicMaterial({ map: green_screen_texture });
  //
  // let mat = new THREE.MeshBasicMaterial({ map: green_screen_texture , transparent: true, opacity: 1, side: THREE.DoubleSide });
  // let plane = new THREE.Mesh(geo, mat);
  // plane.position.y = 0;
  // plane.position.x = -200;
  // plane.position.z = 300;
  // plane.scale.set(4,4,1);
  // return plane;

}

// WHAT THE DIFFERENCE BETWEEN THIS AND goToMovie() IN sketch.js?
function gotKey(data) {
  // Image data needs to be drawn to img element before canvas in vanilla JS
  //  console.log(data);
  let img1 = new Image;
  ctx.clearRect(0,0, CANVW, CANVH); //clears a rectangle within given element
  ctx.drawImage(data,0,0, CANVW, CANVH); //draws the key image onto the cleared rectangle

}

function animateKey(){
  green_screen_texture.needsUpdate = true; //draws the key as a Three.js texture and then updates it continuously to animate
}

function startRecord(){
  kinectron.startRecord();
}

function stopRecord(){
  kinectron.stopRecord();
}
