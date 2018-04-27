//global Three.js variables
let renderer, camera, scene;

//global Saving Stuff variables
var selectedElement;
var numberOfElements = 0;
var dragging = false;
var allElements = [];
var name_field;
var scene_field;
var sceneNum = 1;
var people;

//global Mlab variables
var apiKey = "qAuY_iyWIThL7v_E94cZCZMoRxm3bwoN";
var db = "open-source-cinema";
var coll = "osc_setting_street_view";

//global Street View Panorama variable
var panorama;

window.addEventListener('load', init);

//create Dano's interface at the top of the screen
function htmlInterface(){
  //moved most of these out into index.html instead of creating them in p5js
  name_field = $("#name");
  name_field.val("Mary");
  scene_field = $("#sceneNum");
  $("#previous").click(previous);
  $("#next").click(next);
  scene_field.val(sceneNum);
}

//setup
function init(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

  //initialize Three.js
  renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	document.getElementById('container').appendChild(renderer.domElement);
	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0x222222 );//do I put panorama here?
	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set(0, 0, 0);
	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// controls.update();
	// loader = new THREE.TextureLoader();

  //create La Sirena
  var sirena_geo = new THREE.PlaneGeometry(10, 20);
  var sirena_mat = new THREE.MeshBasicMaterial(
    {map: new THREE.TextureLoader().load('sirena.png')} );
  var sirena = new THREE.Mesh( sirena_geo, sirena_mat );
  sirena.position.set(10, 0, 0);
  scene.add( sirena );

  //create Blackbeard
  var blackbeard_geo = new THREE.PlaneGeometry(50, 50);
  var blackbeard_mat = new THREE.MeshBasicMaterial(
    {map: new THREE.TextureLoader().load('blackbeard.png')} );
  var blackbeard = new THREE.Mesh( blackbeard_geo, blackbeard_mat );
  blackbeard.position.set(0, 0, 0);
  scene.add( blackbeard );

  setUpStreetView();

  window.addEventListener('resize', onWindowResize, true); //see function below

  animate();

}

//just in case window is resized
function onWindowResize(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}

function animate() {
  renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

//connect to Google Street View API and the location you want
//when using panoramaOptions you can pass in new parameters in the console
function setUpStreetView(id,pov){
 // var jockeysRidge = {lat: 35.9582107, lng: -75.6382598};

 //if there are no parameters set via the console,
 //then get the parameters using Google Street View API
if(id == null || pov == null){
  var panoramaOptions = {
      pano: "CAoSLEFGMVFpcE56WmZaMUFsRjVYekl3eU5LQ0ZIVWtvdlBzVXh4Y3lsaHg0UmNh", //panorama ID from: https://www.google.com/maps/@35.9582107,-75.6382598,3a,75y,49.75h,90t/data=!3m8!1e1!3m6!1sAF1QipNzZfZ1AlF5XzIwyNKCFHUkovPsUxxcylhx4Rca!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNzZfZ1AlF5XzIwyNKCFHUkovPsUxxcylhx4Rca%3Dw203-h100-k-no-pi-0-ya192.71808-ro-0-fo100!7i8704!8i4352
      pov: {
        heading: 34, //defines the rotation angle around the camera locus in degrees relative from true north (90 degrees is true east)
        pitch: 10 //defines the angle variance "up" or "down" from the camera's initial default pitch
      }
    };
  }else{
    var panoramaOptions = {
        pano: id,
        pov: pov
      };
  }
  //draw the panorama
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"), panoramaOptions );
  }
