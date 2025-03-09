let video, snapshot;
const CAM_WIDTH = 160;
const CAM_HEIGHT = 120;

let noCamera = false;
let cameraCheckDone = false;
let detectCameraPromise;

/**
 * Source: MDN Web Docs
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * 
 * Checks for a video-input device (camera).
 * Sets 'noCamera' to true if none is found.*/

function detectCamera() {
  return navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      if (!devices.some(d => d.kind === 'videoinput')) {
        noCamera = true;
        console.error('No camera detected.');
      }
    })
    .catch(err => {
      console.error('Error detecting camera:', err);
      noCamera = true;
    })
    .finally(() => {
      cameraCheckDone = true;
    });
}

function preload() {
  // Start camera detection if supported
  if (navigator.mediaDevices) {
    detectCameraPromise = detectCamera();
  } else {
    console.error('MediaDevices not supported');
    noCamera = true;
    cameraCheckDone = true;
  }
}

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  // Once camera detection completes, initialize capture if we have a camera
  if (detectCameraPromise) {
    detectCameraPromise.then(() => {
      if (!noCamera) {
        video = createCapture(VIDEO);
        video.size(CAM_WIDTH, CAM_HEIGHT);
        video.hide();
      }
    });
  }

  // Button to take a snapshot
  createButton('Take Snapshot')
    .position(10, CAM_HEIGHT + 10)
    .mousePressed(() => {
      if (video && cameraCheckDone && !noCamera) {
        snapshot = video.get();
      }
    });
}

function draw() {
  background(255);

  // Show status while checking for a camera
  if (!cameraCheckDone) {
    fill(0);
    textSize(24);
    text('Checking for camera...', 10, 50);
    return;
  }

  // If camera check is done but no camera is present
  if (noCamera) {
    fill(255, 0, 0);
    textSize(24);
    text('No Camera Detected', 10, 50);
    return;
  }

  // Camera is present
  push();
  
  // Mirror the image horizontally
  translate(CAM_WIDTH, 0);
  scale(-1, 1);

  if (snapshot) {
    // Display original snapshot
    image(snapshot, 0, 0, CAM_WIDTH, CAM_HEIGHT);
    // Display greyscale version
    const gs = greyscale(snapshot);
    image(gs, -CAM_WIDTH - 10, 0, CAM_WIDTH, CAM_HEIGHT);
  } else {
    // Live feed (no snapshot taken yet)
    image(video, 0, 0, CAM_WIDTH, CAM_HEIGHT);
  }

  pop();
}
