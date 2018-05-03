/* If running locally, run with simplehttpserver for image to load properly.
http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

Adapted from Lisa Jamhoury's Beach Kinectron example:
*/

let myCanvas = null;

// MOVIE CLIP VARIABLES
let singing;
let jurassic;
let sw;
let movies; //will define as array below
let moviesBin = 0; //starting bin for movies
let moviePlaying = false;

// DECLARE IMAGE VARIABLE ON WHICH TO DRAW MOVIE CLIPS
let img;

// let myDiv;
// let processing = false;

// DECLARE KINECTRON
let kinectron = null;

function preload() {
  skeletonData = [];
}

function setup() {

  // CREATE VIDEO DOM ELEMENTS AND HIDE THEM
  singing = createVideo("good-morning.mp4");
  singing.hide();
  jurassic = createVideo("jurassic.mp4");
  jurassic.hide();
  sw = createVideo("star-wars.mp4");
  sw.hide();

  movies = [singing, jurassic, sw];

  myCanvas = createCanvas(windowWidth, windowHeight);
  background(255); //if you put background in setup, your image background must take up the whole screen or you will see the trail of your key

  // DEFINE AND CREATE AN INSTANCE OF KINECTRON
  let kinectronIpAddress = "172.16.230.39"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // CREATE CONNECTION BETWEEN REMOTE AND APPLICATION
  kinectron.makeConnection();

  // Start the greenscreen camera
  kinectron.startKey(goToMovie);

  // // Request all tracked bodies and pass data to your callback
  // kinectron.startTrackedBodies(bodyTracked);

  htmlInterface();

}

function draw() {

  loopRecordedData();

}

// PRESS RIGHT ARROW TO CYCLE THROUGH MOVIE CLIPS
function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    moviesBin ++;
  }
  if (moviesBin == movies.length){
    moviesBin = 0;
  }

  if (keyCode == RETURN) {
    if (moviePlaying == false) {
      movies[moviesBin].play();
      moviePlaying = true;
    } else {
      movies[moviesBin].pause();
      moviePlaying = false;
    }
  }
}
function goToMovie(img) {

  loadImage(img.src, function(loadedImage) {
    imageMode(CENTER);
    image(movies[moviesBin], width/2, height/2);

    push(); //just in case
    imageMode(CENTER);
    tint(255, 170); //adjust the key image's opacity
    image(loadedImage, width/2, height/2);
    pop();
  });
}

// PLACED HERE FROM KEY
// CALLED IN INDEX
function startRecord(){
  kinectron.startRecord();
}

function stopRecord(){
  kinectron.stopRecord();
}
