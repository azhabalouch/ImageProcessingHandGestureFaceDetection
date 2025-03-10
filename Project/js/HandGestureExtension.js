/**
 * GestureDetector
 * ---------------
 * Sources (Reference):
 *  - [1] https://stackoverflow.com/questions/60884574/could-tfjs-models-handpose-return-multiple-predictions  
 *      → Informed the decision to process a single-hand prediction.
 *  - [2] https://github.com/tensorflow/tfjs-models/tree/master/handpose  
 *      → Primary reference for loading and using the HandPose model.
 *  - [3] https://github.com/andypotato/fingerpose  
 *      → Inspired the gesture detection logic (mapping finger extensions to filter numbers).
 *  - [4] https://github.com/ml5js/ml5-library/tree/main/examples/p5js/Handpose  
 *      → Provided example code for event binding and hand keypoint handling.
 *  - [5] https://docs.ml5js.org/#/reference/handpose  
 *      → API documentation that guided method names and event usage.
 *  - [6] https://www.youtube.com/watch?v=vfNHdVbE-l4&t=459s  
 *      → Offered insight on Hand Pose Detection with ml5.js.
 *  - [7] https://www.youtube.com/watch?v=IF414I26_K8  
 *      → 3D Pose Estimation with ml5.js.
 *  - [8] https://www.youtube.com/watch?v=Kr4s5sLoROY  
 *      → 12.4: Average Point Hand Tracking - Kinect and Processing Tutorial.
 *  - [9] https://editor.p5js.org/Samathingamajig/sketches/BV_kqU0Ik  
 *      → Served as a reference for rendering keypoints and understanding the event-driven flow.
 *
 * Class to handle:
 *  - HandPose model readiness
 *  - Real-time hand predictions
 *  - Gesture detection (mapping recognized finger poses to filter numbers)
 */
class GestureDetector {
  /**
   * @constructor
   * @param {Object} handposeModel - An instance of the loaded HandPose model.
   *
   * Sources: [2], [4], [5]  
   * These sources informed the approach to loading the model and setting up the event-driven prediction mechanism.
   */
  constructor(handposeModel) {
    this.handposeModel = handposeModel;
    this._hands = [];

    // Finger extension thresholds – tuned based on demo insights and fingerpose reference.
    // Source: [6] and [3]
    this.FINGER_THRESHOLDS = {
      // thumb:       0.20,
      indexFinger: 0.23,
      middleFinger:0.25,
      ringFinger:  0.22,
      // pinky:       0.20
    };
    // Bind event listeners.
    this._bindModelEvents();
  }

  /**
   * _bindModelEvents
   * ----------------
   * Private method: sets up the model's "predict" event listener,
   * updating our private _hands array whenever new predictions arrive.
   *
   * Source: [4], [5]  
   * The ml5.js HandPose examples show how to bind the "predict" event to update keypoints.
   */
  _bindModelEvents() {
    if (!this.handposeModel || typeof this.handposeModel.on !== "function") {
      console.warn("HandPose model is invalid or not event-driven.");
      return;
    }
    this.handposeModel.on("predict", (predictions) => {
      this._hands = predictions;
    });
  }

  /**
   * onHandPoseModelReady
   * --------------------
   * Logs a message indicating the HandPose model is successfully loaded.
   *
   * Source: [2], [4]  
   * The model readiness callback in the official examples uses similar logging.
   */
  onHandPoseModelReady() {
    console.log("HandPose model loaded and event bound.");
  }

  /**
   * detectGesture
   * -------------
   * Identifies a gesture based on the positions and distances of recognized finger landmarks.
   * Returns an object containing the "filter" number: 1, 2, 3, or 0 if no recognized gesture.
   *
   * Source: [3], [6], [7], [8]  
   * The gesture mapping logic (e.g., index only → filter 1; index + middle → filter 2; etc.)
   * was inspired by the fingerpose library and YouTube tutorials demonstrating practical gesture detection.
   *
   * @param {Object} hand - A single hand prediction object from the HandPose model.
   * @return {Object} - { filter: number }
   */
  detectGesture(hand) {
    // Guard: verify the hand object is valid and has 'annotations'.
    if (!hand?.annotations) return { filter: 0 };

    // Distance between 'palmBase' and 'middleFingerTip' as a reference.
    const palmBase = hand.annotations.palmBase?.[0];
    const middleTip = hand.annotations.middleFinger?.[3];
    if (!palmBase || !middleTip) return { filter: 0 };

     // Exclude predictions that fall within the face bounding box
    if (typeof faceDetector !== "undefined" && faceDetector.faceBox) {
      const { x, y, w, h } = faceDetector.faceBox;
      // If the palm base is inside the face bounding box, skip this prediction.
      if (palmBase[0] >= x && palmBase[0] <= x + w &&
          palmBase[1] >= y && palmBase[1] <= y + h) {
        return { filter: 0 };
      }
    }

    // Calculate a reference distance for comparing finger extensions.
    const refDist = this._distPoints(palmBase, middleTip);
    if (refDist <= 0) return { filter: 0 };

    // Check all five fingers using the helper function.
    const indexExtended  = this._isFingerExtended(hand.annotations, "indexFinger",  refDist);
    const middleExtended = this._isFingerExtended(hand.annotations, "middleFinger", refDist);
    const ringExtended   = this._isFingerExtended(hand.annotations, "ringFinger",   refDist);
    const pinkyExtended  = this._isFingerExtended(hand.annotations, "pinky",        refDist);
    const thumbExtended  = this._isFingerExtended(hand.annotations, "thumb",        refDist);

    /*
      Decide final filter output.
      - Filter 1: index only
      - Filter 2: index + middle
      - Filter 3: index + middle + ring
      - Filter 0: none recognized
    */
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) return { filter: 1 };
    if (indexExtended &&  middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) return { filter: 2 };
    if (indexExtended &&  middleExtended &&  ringExtended && !pinkyExtended && !thumbExtended) return { filter: 3 };

    return { filter: 0 };
  }

  /**
   * _isFingerExtended
   * -----------------
   * Checks if a specified finger is extended by comparing the ratio
   * (finger length / reference distance) to its threshold.
   *
   * Source: [3], [6]  
   * The technique to compare finger length with a reference distance (using keypoint distances)
   * is adapted from fingerpose and tuning from related YouTube demos.
   *
   * @param {Object} annotations - A hand's annotation object from the model.
   * @param {string} fingerName  - Name of the finger (e.g. 'indexFinger').
   * @param {number} refDist     - Reference distance for scaling.
   * @return {boolean}           - True if the finger is extended beyond the threshold.
   */
  _isFingerExtended(annotations, fingerName, refDist) {
    const finger = annotations[fingerName];
    // Guard: finger data might be missing for certain hands/poses.
    if (!finger) return false;

    // Typical 4 keypoints: [0]MCP, [1]PIP, [2]DIP, [3]Tip
    const [px, py] = finger[1]; // PIP
    const [tx, ty] = finger[3]; // Tip

    const fingerDist = this._distPoints([px, py], [tx, ty]);
    const ratio = fingerDist / refDist;

    // Default threshold is 0.35 if fingerName is not in FINGER_THRESHOLDS.
    const threshold = this.FINGER_THRESHOLDS[fingerName] ?? 0.35;

    return ratio > threshold;
  }

  /**
   * _distPoints
   * -----------
   * Helper method that returns the 2D distance between two points.
   *
   * Source: Standard Euclidean distance calculation (common in many demos and examples such as [4]).
   *
   * @param {Array<number>} pointA - [x1, y1].
   * @param {Array<number>} pointB - [x2, y2].
   * @return {number} - Euclidean distance between pointA and pointB.
   */
  _distPoints([x1, y1], [x2, y2]) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * getHands
   * --------
   * Public accessor to retrieve the current set of hand predictions.
   *
   * Source: [4], [5]  
   * Similar accessor patterns are used in ml5.js examples to check predictions.
   */
  getHands() {
    return this._hands;
  }
  /**
   * drawKeypoints
   * -------------
   * Draws keypoints on the provided canvas context for each detected hand.
   *
   * The method checks for a "landmarks" array in each hand prediction, which
   * contains all keypoints. If not available, it falls back to iterating over
   * the "annotations" property while avoiding duplicate points.
   *
   * Source: [9]  
   * Inspired by examples showing keypoint rendering in p5.js.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
   * @param {Object} options - Optional drawing parameters (e.g., { color: 'red', radius: 5 }).
   */
  drawKeypoints(ctx, options = {}) {
    const defaultOptions = { color: 'red', radius: 5 };
    const { color, radius } = Object.assign({}, defaultOptions, options);

    this._hands.forEach(hand => {
      let keypoints = [];
      // Use landmarks if available
      if (hand.landmarks) {
        keypoints = hand.landmarks;
      } else if (hand.annotations) {
        // Flatten annotations while removing duplicates.
        const seen = new Set();
        for (const finger in hand.annotations) {
          hand.annotations[finger].forEach(point => {
            const key = point.toString();
            if (!seen.has(key)) {
              seen.add(key);
              keypoints.push(point);
            }
          });
        }
      }
      // Draw each keypoint as a circle.
      keypoints.forEach(point => {
        const [x, y] = point;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      });
    });
  }
}