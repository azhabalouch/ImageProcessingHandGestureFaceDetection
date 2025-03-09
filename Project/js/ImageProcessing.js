/****************************************************
 * ImageProcessor Class
 * --------------------------------------------------
 * Provides static methods for image processing tasks.
 ****************************************************/
class ImageProcessor {
  /**
   * A helper method that processes every pixel of an image using a callback.
   * @param {p5.Image} img - The image to process.
   * @param {function} pixelCallback - A callback that receives (r, g, b, a) and returns new [r, g, b, a].
   * @returns {p5.Image} The processed image.
   */
  static processPixels(img, pixelCallback) {
    img.loadPixels();
    const totalPixels = img.width * img.height;
    for (let i = 0; i < totalPixels; i++) {
      const index = i * 4;
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];
      const a = img.pixels[index + 3];

      const [newR, newG, newB, newA] = pixelCallback(r, g, b, a);

      img.pixels[index] = newR;
      img.pixels[index + 1] = newG;
      img.pixels[index + 2] = newB;
      img.pixels[index + 3] = newA;
    }
    img.updatePixels();
    return img;
  }

  /**
   * Converts an image to greyscale with increased brightness.
   * @param {p5.Image} img - The input image.
   * @returns {p5.Image} The processed greyscale image.
   */
  static greyscale(img) {
    let processedImg = createImage(img.width, img.height);
    processedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    
    return this.processPixels(processedImg, (r, g, b, a) => {
      // Source: https://idmnyu.github.io/p5.js-image/Filters/index.html
      // Calculate weighted greyscale value using standard luma formula
      const grey = r * 0.299 + g * 0.587 + b * 0.0114;

      // Source: https://bioimagebook.github.io/chapters/1-concepts/1-images_and_pixels/images_and_pixels.html#sec-images-luts
      // Increase brightness by 20%
      let bright = grey * 1.2;
      
      bright = bright > 255 ? 255 : bright;
      return [bright, bright, bright, a];
    });
  }

  /**
   * Extracts a specific color channel from an image.
   * @param {p5.Image} img - The input image.
   * @param {string} channel - The color channel ("red", "green", or "blue").
   * @returns {p5.Image} A new image with only the specified channel.
   */
  static extractChannel(img, channel) {
    let channelImg = createImage(img.width, img.height);
    channelImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    
    return this.processPixels(channelImg, (r, g, b, a) => {
      if (channel === "red") {
        return [r, 0, 0, a];
      } else if (channel === "green") {
        return [0, g, 0, a];
      } else if (channel === "blue") {
        return [0, 0, b, a];
      }
      return [r, g, b, a];
    });
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
    if (channel === "red") {
      return [(r > thresholdVal) ? 255 : 0, 0, 0, a];
    } else if (channel === "green") {
      return [0, (g > thresholdVal) ? 255 : 0, 0, a];
    } else if (channel === "blue") {
      return [0, 0, (b > thresholdVal) ? 255 : 0, a];
    }
    return [r, g, b, a];
  }

  /**
   * Applies a filter callback to every pixel of the image.
   * @param {p5.Image} img - The image to process.
   * @param {function} filterCallback - A function that takes (r, g, b, a) and returns new RGBA values.
   * @returns {p5.Image} The filtered image.
   */
  static applyFilter(img, filterCallback) {
    // Create a copy of the image to avoid modifying the original
    let filteredImg = createImage(img.width, img.height);
    filteredImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    
    return this.processPixels(filteredImg, filterCallback);
  }
}