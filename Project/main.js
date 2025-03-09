// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
import { greyscale } from './modules/greyscale.js';

let video, snapshot;
const camWidth = 160, camHeight = 120;
let noCamera = false;

/*
  Asynchronous camera detection using MediaDevices API | Source: MDN Web Docs
  https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise */
async function detectCamera() {
  if (navigator.mediaDevices) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (!devices.some(device => device.kind === 'videoinput')) {
        noCamera = true;
        console.error('No camera detected.');
      }
    } catch (error) {
      console.error("Error detecting camera:", error);
      noCamera = true;
    }
  } else {
    noCamera = true;
    console.error("MediaDevices not supported");
  }
}

async function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  // Wait for the asynchronous camera detection to complete
  await detectCamera();

  // Set up video capture only if a camera is detected
  if (!noCamera) {
    video = createCapture(VIDEO);
    video.size(camWidth, camHeight);
    video.hide();
  }

  // Create a button for snapshot
  createButton('Take Snapshot')
    .position(10, camHeight + 10)
    .mousePressed(() => {
      if (video) {
        snapshot = video.get();
      }
    });
}

function draw() {
  background(255);

  // Show error message if no camera is detected
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

  // If a snapshot exists, process it using greyscale
  if (snapshot) {
    let processed = greyscale(snapshot);
    // Align it to the right of first snapshot
    image(processed, camWidth + 10, 0, camWidth, camHeight);
  }
}