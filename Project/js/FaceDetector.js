/****************************************************
 * FaceDetector class
 * --------------------------------------------------
 * Source: https://docs.ml5js.org/#/reference/facemesh
 * 
 * Face detection and applying image modifications.
 ****************************************************/
class FaceDetector {
  /**
   * @param {p5.MediaElement} video - p5 video element used for detection.
   * @param {Function} onModelReady - Optional callback called once the faceApi model is ready.
   */
  constructor(video, onModelReady) {
    // The p5 video element holding the live camera feed.
    this.video = video;
    
    // Holds the array of detections returned by faceApi.
    this.detections = [];
    
    // Holds the bounding box (x, y, w, h) of the detected face in the video.
    this.faceBox = null;

    // Options for ml5 faceApi: detect with landmarks but no descriptors to save on computation.
    const options = { withLandmarks: true, withDescriptors: false };
    
    // Load the ml5 faceApi model. 'this.model' will be used to perform detection.
    this.model = ml5.faceApi(this.video.elt, options, () => {
      console.log("Face API model loaded.");

      // If a callback function was provided, call it here.
      if (onModelReady) onModelReady();

      // Begin continuous detection once the model is ready.
      this.detect();
    });
  }

  /**
   * Continuously detects faces from the live video stream, storing detection results
   * in `this.detections` Also extracts and stores the first face bounding box.
   */
  detect() {
    this.model.detect(this.video.elt, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      
      this.detections = results;

      // If at least one face is detected, store its bounding box.
      if (this.detections && this.detections.length > 0) {
        const { _x: x, _y: y, _width: w, _height: h } = this.detections[0].alignedRect._box;
        this.faceBox = { x, y, w, h };
      } else {
        this.faceBox = null;
      }
      
      // Call detect again to keep updating face detection results in real-time.
      this.detect();
    });
  }

  /**
   * Applies the specified modification to the face region in the given frame.
   * Available modifications:
   *   '1' -> greyscale
   *   '2' -> blur
   *   '3' -> HSV conversion
   *   '4' -> pixelation (simplified approach: greyscale + low-res scale)
   *
   * @param {p5.Image} frame - The full camera frame to modify.
   * @param {string} mod - Code indicating which modification to apply.
   * @returns {p5.Image} The frame with the modification applied.
   */
  applyModificationToFrame(frame, mod) {
    // If no face is detected, just return the original frame.
    if (!this.faceBox) return frame;
    
    // Extract bounding box of the face region.
    let { x, y, w, h } = this.faceBox;
    
    // Get the face region from the frame.
    let faceRegion = frame.get(x, y, w, h);

    let modifiedFace;
    if (mod === '1') {
      // Greyscale
      modifiedFace = ImageProcessor.greyscale(faceRegion);

    } else if (mod === '2') {
      // Blur
      let pg = createGraphics(w, h);
      pg.image(faceRegion, 0, 0);
      pg.filter(BLUR, 10);
      modifiedFace = pg;

    } else if (mod === '3') {
      // HSV conversion
      modifiedFace = ImageProcessor.convertToHSV(faceRegion);

    } else if (mod === '4') {
      // Pixelation:
      // Step 1: Convert to greyscale
      let greyFace = ImageProcessor.greyscale(faceRegion);

      // Step 2: Scale down and then back up to achieve a pixelation effect
      let blockSize = 5; // The higher this number, the chunkier the pixels
      let smallW = floor(w / blockSize);
      let smallH = floor(h / blockSize);

      // Create two p5 images to handle scaling down & up
      // 1) Scale down the face to a smaller resolution
      let scaledDown = createImage(smallW, smallH);
      scaledDown.copy(greyFace, 0, 0, w, h, 0, 0, smallW, smallH);

      // 2) Now scale the scaled-down image back up to the original face size
      let scaledUp = createImage(w, h);
      scaledUp.copy(scaledDown, 0, 0, smallW, smallH, 0, 0, w, h);

      modifiedFace = scaledUp;

    } else {
      // If no valid modification code, return the original frame
      return frame;
    }

    // Copy the modified face region back onto the main frame
    frame.copy(modifiedFace, 0, 0, w, h, x, y, w, h);
    return frame;
  }
}