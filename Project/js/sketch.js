/****************************************************
 * Global Settings & Variables
 ****************************************************/

/**
 * Task 2: Minimum resolution
 */
const settings = {
  camWidth: 160,              // Camera image width in pixels
  camHeight: 120,             // Camera image height in pixels
  paddingX: 10,               // Horizontal padding between grid cells
  paddingY: 30,               // Vertical padding between grid cells
};


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
 * p5.js preload function:
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

/**
 * p5.js setup function:
 * Sets up the canvas, video capture, and UI elements.
 */
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

  // Create a grid layout for image positioning
  grid = new GridLayout(0, 0, settings.camWidth, settings.camHeight, settings.paddingX, settings.paddingY);
  
  UIManager.createButtonsAndSliders();
}

/**
 * p5.js draw function:
 * Continuously renders the processed images arranged in a grid layout.
 *
 * This function accomplishes assignment tasks:
 *  - Task 3: Displays the original webcam video.
 *  - Task 4: Converts the image to greyscale, increases brightness by 20% (with clamping), and displays it.
 *  - Task 6: Splits the webcam image into individual red, green, and blue channels and displays them.
 *  - Task 7: Applies dynamic thresholding (using slider input) to each color channel and displays the results.
 *  - Task 9: Displays the original webcam video (repeated) and colour space conversion.
 */
function draw() {
  // Clear the canvas with a white background
  background(255);
  
  // If camera detection is still in progress, display a status message.
  if (!cameraCheckDone) {
    fill(0);
    textSize(24);
    text('Checking for camera...', 10, 50);
    return; // Exit draw until camera detection is complete
  }
  
  // If no camera is detected, show an error message in red
  if (noCamera) {
    fill(255, 0, 0);
    textSize(24);
    text('No Camera Detected', 10, 50);
    return; // Exit draw to avoid further processing
  }
  
  /* Task 1: Use the snapshot if available; otherwise, use the current frame from the live video */
  let processingFrame = snapshot ? snapshot : video.get();
  
  /* Task 3: Display the original webcam image */
  let pos = grid.getPosition(0, 0);
  image(processingFrame, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  /* Task 4: Convert the image to greyscale with increased brightness (while clamping) and display it */
  pos = grid.getPosition(1, 0);
  const gs = ImageProcessor.greyscale(processingFrame);
  image(gs, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  /**
   * Task 6: Extract and Display Individual Color Channels
   */

  // Extract the red, green, and blue channels from the processing frame.
  const redChannel = ImageProcessor.extractChannel(processingFrame, "red");
  const greenChannel = ImageProcessor.extractChannel(processingFrame, "green");
  const blueChannel = ImageProcessor.extractChannel(processingFrame, "blue");
  
  // Display the red channel
  pos = grid.getPosition(0, 1);
  image(redChannel, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  // Display the green channel.
  pos = grid.getPosition(1, 1);
  image(greenChannel, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  // Display the blue channel.
  pos = grid.getPosition(2, 1);
  image(blueChannel, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  /**
   * Task 7: Apply Dynamic Thresholding to Each Color Channel
   */

  // Display red channel thresholding
  const redThreshImg = ImageProcessor.applyFilter(redChannel, (r, g, b, a) =>
    ImageProcessor.threshold(r, g, b, a, "red", redThresholdSlider.value())
  );
  pos = grid.getPosition(0, 2);
  image(redThreshImg, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  // Display green channel thresholding
  const greenThreshImg = ImageProcessor.applyFilter(greenChannel, (r, g, b, a) =>
    ImageProcessor.threshold(r, g, b, a, "green", greenThresholdSlider.value())
  );
  pos = grid.getPosition(1, 2);
  image(greenThreshImg, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  // Display blue channel thresholding
  const blueThreshImg = ImageProcessor.applyFilter(blueChannel, (r, g, b, a) =>
    ImageProcessor.threshold(r, g, b, a, "blue", blueThresholdSlider.value())
  );
  pos = grid.getPosition(2, 2);
  image(blueThreshImg, pos.x, pos.y, settings.camWidth, settings.camHeight);
  
  /**
   * Task 9: Display the Live Video Feed and Colour Space Conversions
   */

  // Display the live video feed
  pos = grid.getPosition(0, 4);
  image(video, pos.x, pos.y, settings.camWidth, settings.camHeight);
}
