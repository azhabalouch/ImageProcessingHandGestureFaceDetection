/* 
  Source for comments:
  - https://stackoverflow.com/questions/56377294/what-does-the-symbol-do-in-javascript-multiline-comments
  - https://stackoverflow.com/questions/127095/what-is-the-preferred-method-of-commenting-javascript-objects-and-methods
  - https://www.freecodecamp.org/news/comment-your-javascript-code/
*/


/*******************
 * Global Variables
 *******************/
let video, snapshot;
const CAM_WIDTH = 160;
const CAM_HEIGHT = 120;

let noCamera = false;
let cameraCheckDone = false;
let detectCameraPromise;

/**
 * Preloads resources and starts camera detection.
 */
function preload() {
  if (navigator.mediaDevices) {
    detectCameraPromise = detectCamera();
  } else {
    console.error('MediaDevices not supported');
    noCamera = true;
    cameraCheckDone = true;
  }
}

/**
 * Initializes the canvas, camera capture, and snapshot button.
 */
function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  // Initialize video capture after camera detection completes
  if (detectCameraPromise) {
    detectCameraPromise.then(() => {
      if (!noCamera) {
        video = createCapture(VIDEO);
        video.size(CAM_WIDTH, CAM_HEIGHT);
        video.hide();
      }
    });
  }

  // Create a button to capture a snapshot from the video feed
  createButton('Take Snapshot')
    .position(10, CAM_HEIGHT + 10)
    .mousePressed(() => {
      if (video && cameraCheckDone && !noCamera) {
        snapshot = video.get();
      }
    });
}

/**
 * Draws the video or snapshot and additional processing if available.
 */
function draw() {
  background(255);

  // Display status while checking for camera
  if (!cameraCheckDone) {
    fill(0);
    textSize(24);
    text('Checking for camera...', 10, 50);
    return;
  }

  // Show error message if no camera is detected
  if (noCamera) {
    fill(255, 0, 0);
    textSize(24);
    text('No Camera Detected', 10, 50);
    return;
  }

  // Select the current frame (snapshot if available, otherwise live video)
  let currentFrame = snapshot || video;

  push();

  // Mirror the image horizontally
  translate(CAM_WIDTH, 0);
  scale(-1, 1);

  // Display the current frame
  image(currentFrame, 0, 0, CAM_WIDTH, CAM_HEIGHT);

  // Helper variables to avoid hardcoding
  let paddingX = 10;
  let paddingY = 30;

  // If a snapshot exists, display additional processed versions
  if (snapshot) {
    /**
     * Task 1 - 3: Show resized original snapshot
     */
    image(snapshot, 0, 0, CAM_WIDTH, CAM_HEIGHT);
    
    /**
     * Task 4 - 5: Convert to greyscale, increase brightness + %20
     */
    const gs = greyscale(snapshot);
    image(gs, -CAM_WIDTH -paddingX, 0, CAM_WIDTH, CAM_HEIGHT);

    /**
     * Task 4 - 5: Extract and display the individual color channels.
     */
    let redChannel = extractChannel(snapshot, "red");
    let greenChannel = extractChannel(snapshot, "green");
    let blueChannel = extractChannel(snapshot, "blue");
    
    // Adjust positions according to your grid layout.
    image(redChannel, 0, CAM_HEIGHT + paddingY, CAM_WIDTH, CAM_HEIGHT);
    image(greenChannel, -CAM_WIDTH -paddingX, CAM_HEIGHT + paddingY, CAM_WIDTH, CAM_HEIGHT);
    image(blueChannel, 2 * (-CAM_WIDTH -paddingX), CAM_HEIGHT + paddingY, CAM_WIDTH, CAM_HEIGHT);
  }
  
  pop();
}