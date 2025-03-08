var video;
var snapshot;
var captureButton;
var showSnapshot = false;
var camWidth = 160;
var camHeight = 120;
var cameraError = false;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  // Start video capture and attach an error event listener
  video = createCapture(VIDEO);
  video.size(camWidth, camHeight);
  video.hide();
  video.elt.addEventListener('error', function(e) {
    console.error("Camera error:", e);
    cameraError = true;
  });

  // Create the snapshot button
  captureButton = createButton('Take Snapshot');
  captureButton.position(10, camHeight + 10);
  captureButton.mousePressed(takeSnapshot);
}

function draw() {
  background(255);
  
  // If after ~1 second (60 frames) no video data is available, trigger error
  if (!cameraError && frameCount > 60 && video.elt.videoWidth <= 0) {
    console.error("Camera not working: video stream not available.");
    cameraError = true;
  }

	if (cameraError) {
		fill(255, 0, 0);
		textSize(20);
		text("Camera not working", 0, camHeight / 2);
	}
  
  push();
    translate(camWidth, 0);
    scale(-1, 1);
		if (showSnapshot && snapshot) {
			image(snapshot, 0, 0, camWidth, camHeight);
		} else {
			image(video, 0, 0, camWidth, camHeight);
		}
  pop();
}

function takeSnapshot() {
  if (!cameraError) {
    snapshot = video.get();
    showSnapshot = true;
  }
}