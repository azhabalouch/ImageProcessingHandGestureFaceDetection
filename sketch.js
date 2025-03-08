let video, snapshot;
const camWidth = 160, camHeight = 120;
let noCamera = false;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  // Check for an available camera | Source: MDN Web Docs – https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
  if (navigator.mediaDevices) {
    navigator.mediaDevices
		.enumerateDevices()
		.then(devices => {
      if (!devices.some(device => device.kind === 'videoinput')) {
        noCamera = true;
        console.error('No camera detected.');
      }
    });
		.catch(err => {
      console.error(`${err.name}: ${err.message}`);
    });
  }

  // Set up video capture
  video = createCapture(VIDEO);
  video.size(camWidth, camHeight);
  video.hide();

  // Create a button for snapshot
  createButton('Take Snapshot')
    .position(10, camHeight + 10)
    .mousePressed(() => snapshot = video.get());
}

function draw() {
  background(255);

  // Show error message if no camera and stop further rendering
  if (noCamera) {
    fill(255, 0, 0);
    textSize(24);
    text("No Camera Detected", 10, 50);
    return;
  }

  // Draw the live mirrored video/snapshot
  push();
    translate(camWidth, 0);
    scale(-1, 1);
    image(snapshot || video, 0, 0, camWidth, camHeight);
  pop();
}