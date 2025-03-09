/**
 * Checks for a video-input device (camera) using MediaDevices.enumerateDevices.
 *
 * Source: MDN Web Docs  
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices  
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 *
 * If no camera is detected, sets the global variable 'noCamera' to true and logs an error.
 * If an error occurs during detection, logs the error and sets 'noCamera' to true.
 * Once the check is complete (whether successful or not), sets 'cameraCheckDone' to true.
 *
 * @returns {Promise<void>} A promise that resolves when the camera detection process is complete.
 */
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