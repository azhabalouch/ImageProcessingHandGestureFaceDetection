/**
 * Source for comments:
 * - https://stackoverflow.com/questions/56377294/what-does-the-symbol-do-in-javascript-multiline-comments
 * - https://stackoverflow.com/questions/127095/what-is-the-preferred-method-of-commenting-javascript-objects-and-methods
 * - https://www.freecodecamp.org/news/comment-your-javascript-code/ */

/****************************************************
 * Global settings & variables
 ****************************************************/

/**
 * Task 2: Minimum resolution
 */
const CAM_WIDTH = 160;
const CAM_HEIGHT = 120;

// Video capture and processing
let video;
let snapshot;
let noCamera = false;
let cameraCheckDone = false;
let liveMode = false;
let detectCameraPromise;

// Dynamic threshold sliders
let redThresholdSlider, greenThresholdSlider, blueThresholdSlider;
let hsvThresholdSlider, ycbcrThresholdSlider;

// Radio buttons for HSV and YCbCr threshold selection
let hsvRadio, ycbcrRadio;

// Face detection
let faceDetector, currentMod = null;

// Global variables for handPose detection
let handPoseModel;
let gestureDetector;
let hands = [];           // Array to store detected hand poses
let activeFilter = 0;  // Start with no filter

// Layout for positioning
let grid;

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

/**
 * Setup initializes the canvas, video capture, face detector, UI elements.
 */
function setup() {
  createCanvas(1080, 1440);
  pixelDensity(1);
  
  if (detectCameraPromise) {
    detectCameraPromise.then(() => {
      if (!noCamera) {
        CameraManager.initVideo();

        // Initialize the face detector
        faceDetector = new FaceDetector(video, () => {
          console.log("FaceDetector is ready.");
        });
        
        // Initialize the hand pose
        handPoseModel = ml5.handpose(video, () => {
          console.log('HandPose Model loaded.');

          gestureDetector = new GestureDetector(handPoseModel);
          gestureDetector.onHandPoseModelReady();
        });
      }
    });
  }

  // Layout padding
  let paddingX = 5;
  let paddingY = 30;

  // Grid layout for displaying images
  grid = new GridLayout(0, 0, CAM_WIDTH, CAM_HEIGHT, paddingX, paddingY);

  // Snapshot button
  createButton('Take Snapshot')
    .position(grid.getPosition(0, 1).x + paddingX*2, grid.getPosition(0, 1).y - paddingY/2)
    .mousePressed(() => {
      if (video && cameraCheckDone && !noCamera) {
        snapshot = video.get();
        liveMode = false;
      }
    });

  // Live mode button
  createButton('Go Live')
    .position(grid.getPosition(1, 1).x + paddingX*2, grid.getPosition(1, 1).y - paddingY/2)
    .mousePressed(() => {
      liveMode = true;
      snapshot = null;
    });

  // Create red threshold slider
  redThresholdSlider = createSlider(0, 255, 128);
  redThresholdSlider.position(grid.getPosition(0, 3).x + paddingX, grid.getPosition(0, 3).y - paddingY/2);

  // Create green threshold slider
  greenThresholdSlider = createSlider(0, 255, 128);
  greenThresholdSlider.position(grid.getPosition(1, 3).x + paddingX, grid.getPosition(1, 3).y - paddingY/2);

  // Create blue threshold slider
  blueThresholdSlider = createSlider(0, 255, 128);
  blueThresholdSlider.position(grid.getPosition(2, 3).x + paddingX, grid.getPosition(2, 3).y - paddingY/2);

  // Create HSV threshold slider
  hsvThresholdSlider = createSlider(0, 255, 128);
  hsvThresholdSlider.position(grid.getPosition(1, 3).x + paddingX, grid.getPosition(2, 5).y - paddingY/2);

  // Create YCbCr threshold slider
  ycbcrThresholdSlider = createSlider(0, 255, 128);
  ycbcrThresholdSlider.position(grid.getPosition(2, 3).x + paddingX, grid.getPosition(2, 5).y - paddingY/2);

  // Create radio buttons for HSV threshold selection
  hsvRadio = createRadio();
  hsvRadio.option('H');
  hsvRadio.option('S');
  hsvRadio.option('V');
  hsvRadio.selected('S'); // default selection
  hsvRadio.position(grid.getPosition(1, 5).x, grid.getPosition(1, 5).y + paddingY);

  // Create radio buttons for YCbCr threshold selection
  ycbcrRadio = createRadio();
  ycbcrRadio.option('Y');
  ycbcrRadio.option('Cb');
  ycbcrRadio.option('Cr');
  ycbcrRadio.selected('Cr'); // default selection
  ycbcrRadio.position(grid.getPosition(2, 5).x, grid.getPosition(2, 5).y + paddingY);
}

/**
 * draw() loops continuously, handling camera checks, displaying images,
 * 
 * and applying transformations/filters as needed.
 */
function draw() {
  background(255);
  
  if (!cameraCheckDone) {
    fill(0);
    textSize(24);
    text('Checking for camera...', 10, 50);
    return; // Exit draw until camera detection is complete
  }
  
  if (noCamera) {
    fill(255, 0, 0);
    textSize(24);
    text('No Camera Detected', 10, 50);
    return; // Exit draw to avoid further processing
  }
  
  /**
   * Task 1: Use the snapshot or video as buffer
   */
  let processingFrame = snapshot ? snapshot : video.get();
  
  /**
   * Task 3: Display the original webcam image
   */
  image(processingFrame, grid.getPosition(0, 0).x, grid.getPosition(0, 0).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 4 - 5: Convert the image to greyscale with brightness +%20
   */
  image(ImageProcessor.greyscale(processingFrame), grid.getPosition(1, 0).x, grid.getPosition(1, 0).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 6: Display individual color channels
   */

  // Display the red channel
  const redChannel = ImageProcessor.extractChannel(processingFrame, "red");
  image(redChannel, grid.getPosition(0, 1).x, grid.getPosition(0, 1).y, CAM_WIDTH, CAM_HEIGHT);
  
  // Display the green channel
  const greenChannel = ImageProcessor.extractChannel(processingFrame, "green");
  image(greenChannel, grid.getPosition(1, 1).x, grid.getPosition(1, 1).y, CAM_WIDTH, CAM_HEIGHT);
  
  // Display the blue channel
  const blueChannel = ImageProcessor.extractChannel(processingFrame, "blue");
  image(blueChannel, grid.getPosition(2, 1).x, grid.getPosition(2, 1).y, CAM_WIDTH, CAM_HEIGHT);
  
  /**
   * Task 7: Apply dynamic thresholding to each color channel
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
   * Task 9 - 10: Repeat image and colour space conversions
   */

  image(processingFrame, grid.getPosition(0, 3).x, grid.getPosition(0, 3).y, CAM_WIDTH, CAM_HEIGHT);

  // Convert to HSV.
  let hsvConverted = ImageProcessor.convertToHSV(processingFrame);
  image(hsvConverted, grid.getPosition(1, 3).x, grid.getPosition(1, 3).y, CAM_WIDTH, CAM_HEIGHT);

  // Convert to YCbCr
  let ycbcrConverted = ImageProcessor.convertToYCbCr(processingFrame);
  image(ycbcrConverted, grid.getPosition(2, 3).x, grid.getPosition(2, 3).y, CAM_WIDTH, CAM_HEIGHT);

  // Display HSV thresholding
  let hsvThresholded = ImageProcessor.applyFilter(hsvConverted, (r, g, b, a) =>
    ImageProcessor.thresholdHSV(r, g, b, a, hsvRadio.value(), hsvThresholdSlider.value())
  );
  image(hsvThresholded, grid.getPosition(1, 4).x, grid.getPosition(1, 4).y, CAM_WIDTH, CAM_HEIGHT);

  // Display YCbCr thresholding
  let ycbcrThresholded = ImageProcessor.applyFilter(ycbcrConverted, (r, g, b, a) =>
    ImageProcessor.thresholdYCbCr(r, g, b, a, ycbcrRadio.value(), ycbcrThresholdSlider.value())
  );
  image(ycbcrThresholded, grid.getPosition(2, 4).x, grid.getPosition(2, 4).y, CAM_WIDTH, CAM_HEIGHT);

  /**
   * TASK 12 - 13 + Extension: Face detection, modification and hand filter logic
   */

  let frame = video.get();

  // Apply face modification
  if (currentMod) {
    frame = faceDetector.applyModificationToFrame(frame, currentMod);
  }
  image(frame, grid.getPosition(0, 4).x, grid.getPosition(0, 4).y, CAM_WIDTH, CAM_HEIGHT);

  // Apply gesture based color filters
  if (gestureDetector && gestureDetector.getHands().length > 0) {
    // Retrieve the most recent hands from the model
    hands = gestureDetector.getHands();

    // Check for a gesture from the first hand
    const { filter } = gestureDetector.detectGesture(hands[0]);
    if (filter >= 1 && filter <= 3 && filter !== activeFilter) {
      activeFilter = filter;
    }
  }

  // Decide which frame transformation to use
  const currentFrame =
    activeFilter === 1 ? ImageProcessor.greyscale(video.get()) :
    activeFilter === 2 ? ImageProcessor.convertToHSV(video.get()) :
    activeFilter === 3 ? ImageProcessor.convertToYCbCr(video.get()) :
    video.get();

  // Display final result in bottom row
  image(currentFrame, grid.getPosition(0, 5).x, grid.getPosition(0, 5).y, CAM_WIDTH, CAM_HEIGHT);

  if (gestureDetector){
    // Draw keypoints on top of the image.
    push();
      // Translate the drawing context so that keypoints align with the image's top-left corner.
      translate(grid.getPosition(0, 5).x, grid.getPosition(0, 5).y);
      // Use the GestureDetector instance's drawKeypoints method, passing in the p5.js drawingContext.
      gestureDetector.drawKeypoints(drawingContext, { color: 'blue', radius: 4 });
    pop();
  }
  
}

/**
 * keyPressed handler to select a face-modification mode.
 * '1' -> Greyscale
 * '2' -> Blur
 * '3' -> HSV
 * '4' -> Pixelation
 */
function keyPressed() {
  if (['1','2','3','4'].includes(key)) {
    currentMod = key;
  }
}