/****************************************************
 * UIManager Class
 * --------------------------------------------------
 * Creates and positions UI elements (buttons and sliders).
 ****************************************************/
class UIManager {
  /**
   * Creates buttons and sliders for the user interface.
   */
  static createButtonsAndSliders() {
    // Snapshot Button
    const snapshotBtn = createButton('Take Snapshot');
    snapshotBtn.position(10, settings.camHeight + 10);
    snapshotBtn.mousePressed(() => {
      if (video && cameraCheckDone && !noCamera) {
        snapshot = video.get();
        liveMode = false;
      }
    });
    
    // Live Video Button
    const liveBtn = createButton('Go Live');
    liveBtn.position(120, settings.camHeight + 10);
    liveBtn.mousePressed(() => {
      liveMode = true;
      snapshot = null;
    });
    
    // Create and position threshold sliders with labels
    createP('Red Threshold').position(5, 3 * (settings.camHeight + 30));
    redThresholdSlider = createSlider(0, 255, 128);
    redThresholdSlider.position(5, 3 * (settings.camHeight + 50));
    
    createP('Green Threshold').position(settings.camWidth + 15, 3 * (settings.camHeight + 30));
    greenThresholdSlider = createSlider(0, 255, 128);
    greenThresholdSlider.position(settings.camWidth + 15, 3 * (settings.camHeight + 50));
    
    createP('Blue Threshold').position((2 * settings.camWidth) + 25, 3 * (settings.camHeight + 30));
    blueThresholdSlider = createSlider(0, 255, 128);
    blueThresholdSlider.position((2 * settings.camWidth) + 25, 3 * (settings.camHeight + 50));
  }
}