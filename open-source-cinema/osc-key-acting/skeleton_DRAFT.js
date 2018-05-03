// RECORDED DATA VARIABLES
let sentTime = Date.now();
let currentFrame = 0;
let loopTime = 70; //bigger number = slower playback
let skeletonData; //record each skeleton in array?
// let i = 0; //first bin of skeletonData if you want to be able to access it later

function bodyTracked(body) {
  background(0, 20);

  for (var i = 0; i < body.bodies.length; i++ ) {
      if (body.bodies[i].tracked) {

        let trackedBody = body.bodies[i];

        // Get all the joints off the tracked body and do something with them
        for(var jointType in trackedBody.joints) {
          joint = trackedBody.joints[jointType];

    drawJoint(joint);
}

// Draw skeleton
function drawJoint(joint) {
  fill(100);

  // Kinect location data needs to be normalized to canvas size
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 15, 15);

  fill(200);

  // Kinect location data needs to be normalized to canvas size
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 3, 3);
}
