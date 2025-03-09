/**
 * redThresholdCallback - Applies thresholding to the red channel.
 * Retrieves the current threshold value from the redThresholdSlider and returns a new pixel color.
 * If the red component is greater than the threshold, it returns 255; otherwise 0.
 *
 * @param {number} r - The red channel value.
 * @param {number} g - The green channel value (ignored).
 * @param {number} b - The blue channel value (ignored).
 * @param {number} a - The alpha channel value (preserved).
 * @returns {Array} An array representing the new RGBA values.
 */
function redThresholdCallback(r, g, b, a) {
  // Retrieve the threshold value for the red channel from the slider.
  let thresholdVal = redThresholdSlider.value();
  // Return new pixel values: apply threshold to red, set green and blue to 0, preserve alpha.
  return [(r > thresholdVal) ? 255 : 0, 0, 0, a];
}

/**
 * greenThresholdCallback - Applies thresholding to the green channel.
 * Retrieves the current threshold value from the greenThresholdSlider and returns a new pixel color.
 * If the green component is greater than the threshold, it returns 255; otherwise 0.
 *
 * @param {number} r - The red channel value (ignored).
 * @param {number} g - The green channel value.
 * @param {number} b - The blue channel value (ignored).
 * @param {number} a - The alpha channel value (preserved).
 * @returns {Array} An array representing the new RGBA values.
 */
function greenThresholdCallback(r, g, b, a) {
  // Retrieve the threshold value for the green channel from the slider.
  let thresholdVal = greenThresholdSlider.value();
  // Return new pixel values: apply threshold to green, set red and blue to 0, preserve alpha.
  return [0, (g > thresholdVal) ? 255 : 0, 0, a];
}

/**
 * blueThresholdCallback - Applies thresholding to the blue channel.
 * Retrieves the current threshold value from the blueThresholdSlider and returns a new pixel color.
 * If the blue component is greater than the threshold, it returns 255; otherwise 0.
 *
 * @param {number} r - The red channel value (ignored).
 * @param {number} g - The green channel value (ignored).
 * @param {number} b - The blue channel value.
 * @param {number} a - The alpha channel value (preserved).
 * @returns {Array} An array representing the new RGBA values.
 */
function blueThresholdCallback(r, g, b, a) {
  // Retrieve the threshold value for the blue channel from the slider.
  let thresholdVal = blueThresholdSlider.value();
  // Return new pixel values: apply threshold to blue, set red and green to 0, preserve alpha.
  return [0, 0, (b > thresholdVal) ? 255 : 0, a];
}
