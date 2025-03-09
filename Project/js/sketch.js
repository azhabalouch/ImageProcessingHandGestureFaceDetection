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

let liveMode = false;


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
  createCanvas(1440, 1080);
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
        liveMode = false;
      }
    });

  // Create sliders for dynamic thresholding for channels
  redThresholdSlider = createSlider(0, 255, 128);
  redThresholdSlider.position(5, 3 * (CAM_HEIGHT + 30));

  greenThresholdSlider = createSlider(0, 255, 128);
  greenThresholdSlider.position(CAM_WIDTH + 15, 3 * (CAM_HEIGHT + 30));

  blueThresholdSlider = createSlider(0, 255, 128);
  blueThresholdSlider.position((2 * CAM_WIDTH) + 25, 3 * (CAM_HEIGHT + 30));

  // Create a button that switches to live video mode
  createButton('Go Live')
    .position(10, 3 * (CAM_HEIGHT + 40))
    .mousePressed(() => {
      liveMode = true;
      // Optionally clear any stored snapshot
      snapshot = null;
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
  let processingFrame = snapshot ? snapshot : video.get();

  push();

  // Mirror the image horizontally
  translate(CAM_WIDTH, 0);
  scale(-1, 1);

  // Helper variables to avoid hardcoding
  let paddingX = 10;
  let paddingY = 30;

  /**
   * Task 1 - 3: Show resized original snapshot
   */
  image(processingFrame, 0, 0, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 4 - 5: Convert to greyscale, increase brightness + %20
   */
  const gs = greyscale(processingFrame);
  image(gs, -CAM_WIDTH -paddingX, 0, CAM_WIDTH, CAM_HEIGHT);

  /**
   * Task 6: Extract and display the individual color channels
   */
  let redChannel = extractChannel(processingFrame, "red");
  let greenChannel = extractChannel(processingFrame, "green");
  let blueChannel = extractChannel(processingFrame, "blue");
  
  // Positions according to grid layout
  image(redChannel, 0, CAM_HEIGHT + paddingY, CAM_WIDTH, CAM_HEIGHT);
  image(greenChannel, -CAM_WIDTH -paddingX, CAM_HEIGHT + paddingY, CAM_WIDTH, CAM_HEIGHT);
  image(blueChannel, 2 * (-CAM_WIDTH -paddingX), CAM_HEIGHT + paddingY, CAM_WIDTH, CAM_HEIGHT);

  /**
   * Task 7: Apply threshold to the individual color channels using slider
   */
  let blueThreshImg = applyFilter(blueChannel, blueThresholdCallback);
  let redThreshImg = applyFilter(redChannel, redThresholdCallback);
  let greenThreshImg = applyFilter(greenChannel, greenThresholdCallback);

  // Positions according to grid layout
  image(redThreshImg, 0, 2 * (CAM_HEIGHT + paddingY), CAM_WIDTH, CAM_HEIGHT);
  image(greenThreshImg, -CAM_WIDTH -paddingX, 2 * (CAM_HEIGHT + paddingY), CAM_WIDTH, CAM_HEIGHT);
  image(blueThreshImg, 2 * (-CAM_WIDTH -paddingX), 2 * (CAM_HEIGHT + paddingY), CAM_WIDTH, CAM_HEIGHT);

  // Repeat original video according to requirements
  image(video, 0, 3.5 * (CAM_HEIGHT + paddingY), CAM_WIDTH, CAM_HEIGHT);

  pop();
}