/****************************************************
 * ImageProcessor Class
 * --------------------------------------------------
 * Provides static methods for image processing tasks.
 ****************************************************/
class ImageProcessor {

  /**
   * Converts an image to greyscale and increases brightness.
   * @param {p5.Image} img - The input image.
   * @returns {p5.Image} The processed greyscale image.
   */
  static greyscale(img) {
    let processedImg = createImage(img.width, img.height);
    processedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    processedImg.loadPixels();

    const totalPixels = img.width * img.height;

    for (let i = 0; i < totalPixels; i++) {
      const index = i * 4;
      
      const r = processedImg.pixels[index];
      const g = processedImg.pixels[index + 1];
      const b = processedImg.pixels[index + 2];

      // Source: https://idmnyu.github.io/p5.js-image/Filters/index.html
      // Calculate weighted greyscale value using standard luma formula
      const grey = r*0.299 + g*0.587 + b*0.0114;

      // Source: https://bioimagebook.github.io/chapters/1-concepts/1-images_and_pixels/images_and_pixels.html#sec-images-luts
      // Increase brightness by 20%
      let bright = grey * 1.2;
      
      // Clamp brightness to a maximum of 255
      bright = bright > 255 ? 255 : bright;

      // Set new RGB values to the increased brightness value
      processedImg.pixels[index] = bright;
      processedImg.pixels[index + 1] = bright;
      processedImg.pixels[index + 2] = bright;
    }
    processedImg.updatePixels();
    return processedImg;
  }

  /**
   * Extracts a specific color channel from an image.
   * @param {p5.Image} img - The input image.
   * @param {string} channel - The color channel ("red", "green", or "blue").
   * @returns {p5.Image} A new image with only the specified channel.
   */
  static extractChannel(img, channel) {
    // Create a new image for the channel output
    let channelImg = createImage(img.width, img.height);

    // Load pixel data for both images
    img.loadPixels();
    channelImg.loadPixels();

    const totalPixels = img.width * img.height;

    for (let i = 0; i < totalPixels; i++) {
      const index = i * 4;
      
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];
      const a = img.pixels[index + 3];
      
      // Set the pixel values based on the selected channel
      if (channel === "red") {
        channelImg.pixels[index] = r;
        channelImg.pixels[index + 1] = 0;
        channelImg.pixels[index + 2] = 0;
      } else if (channel === "green") {
        channelImg.pixels[index] = 0;
        channelImg.pixels[index + 1] = g;
        channelImg.pixels[index + 2] = 0;
      } else if (channel === "blue") {
        channelImg.pixels[index] = 0;
        channelImg.pixels[index + 1] = 0;
        channelImg.pixels[index + 2] = b;
      }

      channelImg.pixels[index + 3] = a;
    }
    channelImg.updatePixels();
    return channelImg;
  }

  /**
   * Applies thresholding for a specific channel.
   * @param {number} r - Red channel value.
   * @param {number} g - Green channel value.
   * @param {number} b - Blue channel value.
   * @param {number} a - Alpha channel value.
   * @param {string} channel - Channel to threshold ("red", "green", or "blue").
   * @param {number} thresholdVal - Threshold value.
   * @returns {Array} New RGBA values after thresholding.
   */
  static threshold(r, g, b, a, channel, thresholdVal) {
    // Apply thresholding based on the specified channel
    if (channel === "red") {
      return [(r > thresholdVal) ? 255 : 0, 0, 0, a];
    } else if (channel === "green") {
      return [0, (g > thresholdVal) ? 255 : 0, 0, a];
    } else if (channel === "blue") {
      return [0, 0, (b > thresholdVal) ? 255 : 0, a];
    }
    
    // Return original values if channel is unrecognized
    return [r, g, b, a];
  }

  /**
   * Applies a filter callback to every pixel of the image.
   * @param {p5.Image} img - The image to process.
   * @param {function} filterCallback - A function that takes (r, g, b, a) and returns new RGBA values.
   * @returns {p5.Image} The filtered image.
   */
  static applyFilter(img, filterCallback) {
    img.loadPixels();
    const totalPixels = img.width * img.height;
    for (let i = 0; i < totalPixels; i++) {
      const index = i * 4;
      
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];
      const a = img.pixels[index + 3];

      // Get new pixel values from the callback function
      const [newR, newG, newB, newA] = filterCallback(r, g, b, a);

      // Update the pixel with the new values
      img.pixels[index] = newR;
      img.pixels[index + 1] = newG;
      img.pixels[index + 2] = newB;
      img.pixels[index + 3] = newA;
    }

    // Update the image with the new pixel values
    img.updatePixels();
    
    // Return the filtered image
    return img;
  }
}