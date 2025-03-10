/****************************************************
 * CameraManager Class
 * --------------------------------------------------
 * Sources:
 * - https://stackoverflow.com/questions/30047056/is-it-possible-to-check-if-the-user-has-a-camera-and-microphone-and-if-the-permi
 * - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices  
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * 
 * Handles camera detection and initialization.
 ****************************************************/
class CameraManager {
  /**
   * Asynchronously detects if a camera is available and checks for permission.
   * 
   * If access is granted, it briefly activates the camera and then stops the stream.
   * 
   * If access is denied or an error occurs, it updates the `noCamera` flag accordingly.
   */
  static async detectCamera() {
    try {
      // Request access to the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Stop all tracks since stream is only used for checking permission
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Camera access denied or error:', err);
      noCamera = true;
    } finally {
      cameraCheckDone = true;
    }
  }
  
  /**
   * Initializes video capture if a camera is available.
   * 
   * Creates a video capture element with specified dimensions and hides it.
   */
  static initVideo() {
    if (!noCamera) {
      /**
       * Task 2: Resize the video according to requirements.
       */
      video = createCapture(VIDEO);
      video.size(CAM_WIDTH, CAM_HEIGHT);
      video.hide();
    }
  }
}

