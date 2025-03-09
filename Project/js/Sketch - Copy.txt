/**
 * Source for comments:
 * - https://stackoverflow.com/questions/56377294/what-does-the-symbol-do-in-javascript-multiline-comments
 * - https://stackoverflow.com/questions/127095/what-is-the-preferred-method-of-commenting-javascript-objects-and-methods
 * - https://www.freecodecamp.org/news/comment-your-javascript-code/ */

/****************************************************
 * Global Settings & Variables
 ****************************************************/

/**
 * Task 2: Minimum resolution
 */
const CAM_WIDTH = 160;
const CAM_HEIGHT = 120;

// Global variables for video capture and processing
let video;                    // Webcam video
let grid;                     // Instance for grid layout
let snapshot;                 // p5.Image snapshot captured from video
let noCamera = false;         // Flag indicating whether a camera is available
let cameraCheckDone = false;  // Flag to indicate camera detection completion
let liveMode = false;         // Toggle for live video mode
let detectCameraPromise;      // Promise for asynchronous camera detection


// Global sliders for dynamic thresholding
let redThresholdSlider, greenThresholdSlider, blueThresholdSlider;

/**
 * Initiates camera detection before setup
 */
function preload() {
  if (navigator.mediaDevices) {
    detectCameraPromise = CameraManager.detectCamera();
  } else {
    console.error('MediaDevices not supported');
    noCamera = true;
    cameraCheckDone = true;
  }
}

function setup() {
  createCanvas(1440, 1080);
  pixelDensity(1);
  
  if (detectCameraPromise) {
    detectCameraPromise.then(() => {
      if (!noCamera) {
        CameraManager.initVideo();
      }
    });
  }

  // To add space between grid
  let paddingX = 5;
  let paddingY = 30;

  // Initialize the GridLayout
  grid = new GridLayout(0, 0, CAM_WIDTH, CAM_HEIGHT, paddingX, paddingY);

  // Create and position the 'Take Snapshot' button
  createButton('Take Snapshot')
    .position(grid.getPosition(0, 1).x + paddingX*2, grid.getPosition(0, 1).y - paddingY/2)
    .mousePressed(() => {
      if (video && cameraCheckDone && !noCamera) {
        snapshot = video.get();
        liveMode = false;
      }
    });

  // Create and position the 'Go Live' button
  createButton('Go Live')
    .position(grid.getPosition(1, 1).x + paddingX*2, grid.getPosition(1, 1).y - paddingY/2)
    .mousePressed(() => {
      liveMode = true;
      snapshot = null;
    });

  // Create and position the Red Threshold slider
  redThresholdSlider = createSlider(0, 255, 128);
  redThresholdSlider.position(grid.getPosition(0, 3).x + paddingX, grid.getPosition(0, 3).y - paddingY/2);

  // Create and position the Green Threshold slider
  greenThresholdSlider = createSlider(0, 255, 128);
  greenThresholdSlider.position(grid.getPosition(1, 3).x + paddingX, grid.getPosition(1, 3).y - paddingY/2);

  // Create and position the Blue Threshold slider
  blueThresholdSlider = createSlider(0, 255, 128);
  blueThresholdSlider.position(grid.getPosition(2, 3).x + paddingX, grid.getPosition(2, 3).y - paddingY/2);
}

function draw() {
  background(255);
  
  // If camera detection is still in progress
  if (!cameraCheckDone) {
    fill(0);
    textSize(24);
    text('Checking for camera...', 10, 50);
    return; // Exit draw until camera detection is complete
  }
  
  // If no camera is detected
  if (noCamera) {
    fill(255, 0, 0);
    textSize(24);
    text('No Camera Detected', 10, 50);
    return; // Exit draw to avoid further processing
  }
  
  /* Task 1: Use the snapshot if available; otherwise, use the current frame from the live video */
  let processingFrame = snapshot ? snapshot : video.get();
  
  /* Task 3: Display the original webcam image */
  image(processingFrame, grid.getPosition(0, 0).x, grid.getPosition(0, 0).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 4: Convert the image to greyscale with increased brightness (while clamping) and display it
   */
  image(ImageProcessor.greyscale(processingFrame), grid.getPosition(1, 0).x, grid.getPosition(1, 0).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 6: Extract and Display Individual Color Channels
   */

  // Extract the red, green, and blue channels from the processing frame.
  const redChannel = ImageProcessor.extractChannel(processingFrame, "red");
  const greenChannel = ImageProcessor.extractChannel(processingFrame, "green");
  const blueChannel = ImageProcessor.extractChannel(processingFrame, "blue");
  
  // Display the red channel
  image(redChannel, grid.getPosition(0, 1).x, grid.getPosition(0, 1).y, CAM_WIDTH, CAM_HEIGHT);
  
  // Display the green channel.
  image(greenChannel, grid.getPosition(1, 1).x, grid.getPosition(1, 1).y, CAM_WIDTH, CAM_HEIGHT);
  
  // Display the blue channel.
  image(blueChannel, grid.getPosition(2, 1).x, grid.getPosition(2, 1).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 7: Apply Dynamic Thresholding to Each Color Channel
   */

  // Display red channel thresholding
  const redThreshImg = ImageProcessor.applyFilter(redChannel, (r, g, b, a) =>
    ImageProcessor.threshold(r, g, b, a, "red", redThresholdSlider.value())
  );
  image(redThreshImg, grid.getPosition(0, 2).x, grid.getPosition(0, 2).y, CAM_WIDTH, CAM_HEIGHT);
  
  // Display green channel thresholding
  const greenThreshImg = ImageProcessor.applyFilter(greenChannel, (r, g, b, a) =>
    ImageProcessor.threshold(r, g, b, a, "green", greenThresholdSlider.value())
  );
  image(greenThreshImg, grid.getPosition(1, 2).x, grid.getPosition(1, 2).y, CAM_WIDTH, CAM_HEIGHT);
  
  // Display blue channel thresholding
  const blueThreshImg = ImageProcessor.applyFilter(blueChannel, (r, g, b, a) =>
    ImageProcessor.threshold(r, g, b, a, "blue", blueThresholdSlider.value())
  );
  image(blueThreshImg, grid.getPosition(2, 2).x, grid.getPosition(2, 2).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 9: Display the Live Video Feed and Colour Space Conversions
   */

  // Display the live video feed
  image(video, grid.getPosition(0, 3).x, grid.getPosition(0, 3).y, CAM_WIDTH, CAM_HEIGHT);
}
