/****************************************************
 * ImageProcessor Class
 * --------------------------------------------------
 * Source: https://www.youtube.com/watch?v=J8Ua4zoObKU
 * 
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

  /**
   * Converts an image from RGB to YCbCr colour space.
   * Uses the standard BT.601 conversion formula.
   * @param {p5.Image} img - The input image.
   * @returns {p5.Image} The converted image.
   */
  static convertToYCbCr(img) {
    let convertedImg = createImage(img.width, img.height);
    convertedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    
    return this.processPixels(convertedImg, (r, g, b, a) => {
      // Source: (Reference Used)
      // - https://en.wikipedia.org/wiki/YCbCr
      // - https://en.wikipedia.org/wiki/Rec._601
      // - https://web.archive.org/web/20180421030430/http://www.equasys.de/colorconversion.html
      // - https://stackoverflow.com/questions/35595215/conversion-formula-from-rgb-to-ycbcr
      // - https://stackoverflow.com/questions/4041840/function-to-convert-ycbcr-to-rgb

      // Convert to YCbCr using BT.601 standard
      let Y  = 0.299 * r + 0.587 * g + 0.114 * b;
      let Cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
      let Cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;
      
      // Clamp values to [0, 255]
      Y = Y > 255 ? 255 : (Y < 0 ? 0 : Y);
      Cb = Cb > 255 ? 255 : (Cb < 0 ? 0 : Cb);
      Cr = Cr > 255 ? 255 : (Cr < 0 ? 0 : Cr);
      
      // For display purposes, assign Y, Cb, Cr to the RGB channels.
      return [Y, Cb, Cr, a];
    });
  }

  /**
   * Converts an image from RGB to HSV colour space.
   * Uses the standard algorithm to compute hue, saturation, and value.
   * The resulting HSV values are scaled to the [0, 255] range for display.
   * @param {p5.Image} img - The input image.
   * @returns {p5.Image} The converted image.
   */
  static convertToHSV(img) {
    let convertedImg = createImage(img.width, img.height);
    convertedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    
    return this.processPixels(convertedImg, (r, g, b, a) => {
      // Source: (Reference Used)
      // - https://www.rapidtables.com/convert/color/rgb-to-hsv.html
      // - https://en.wikipedia.org/wiki/HSL_and_HSV
      // - https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
      // - https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

      // Normalize RGB values to the [0, 1] range.
      let rNorm = r / 255;
      let gNorm = g / 255;
      let bNorm = b / 255;
      
      // Determine the maximum and minimum values among the normalized channels.
      let max = Math.max(rNorm, gNorm, bNorm);
      let min = Math.min(rNorm, gNorm, bNorm);
      let delta = max - min;
      
      // Calculate hue.
      let h = 0;
      if (delta === 0) {
        h = 0;
      } else if (max === rNorm) {
        h = 60 * (((gNorm - bNorm) / delta) % 6);
      } else if (max === gNorm) {
        h = 60 * (((bNorm - rNorm) / delta) + 2);
      } else if (max === bNorm) {
        h = 60 * (((rNorm - gNorm) / delta) + 4);
      }
      if (h < 0) h += 360;
      
      // Calculate saturation.
      let s = (max === 0 ? 0 : delta / max);
      
      // Value is the maximum channel value.
      let v = max;
      
      // Scale h, s, and v to the [0, 255] range.
      let scaledH = (h / 360) * 255;
      let scaledS = s * 255;
      let scaledV = v * 255;
      
      // Clamp values to [0, 255]
      scaledH = Math.min(255, Math.max(0, scaledH));
      scaledS = Math.min(255, Math.max(0, scaledS));
      scaledV = Math.min(255, Math.max(0, scaledV));
      
      // For display purposes, assign the scaled HSV values to R, G, B.
      return [scaledH, scaledS, scaledV, a];
    });
  }

  /**
   * Applies thresholding for a specific channel in the HSV color space.
   * In the converted image, the red channel holds H, green holds S, and blue holds V.
   * This version outputs a binary image (white or black).
   * @param {number} r - The H value.
   * @param {number} g - The S value.
   * @param {number} b - The V value.
   * @param {number} a - The alpha value.
   * @param {string} channel - The channel to threshold ("H", "S", or "V").
   * @param {number} thresholdVal - The threshold value.
   * @returns {Array} New RGBA values after thresholding.
   */
  static thresholdHSV(r, g, b, a, channel, thresholdVal) {
    let value;
    if (channel === "H") {
      value = r;
    } else if (channel === "S") {
      value = g;
    } else if (channel === "V") {
      value = b;
    }
    return (value > thresholdVal) ? [255, 255, 255, a] : [0, 0, 0, a];
  }

  /**
   * Applies thresholding for a specific channel in the YCbCr color space.
   * In the converted image, the red channel holds Y, green holds Cb, and blue holds Cr.
   * This version outputs a binary image (white or black).
   * @param {number} r - The Y value.
   * @param {number} g - The Cb value.
   * @param {number} b - The Cr value.
   * @param {number} a - The alpha value.
   * @param {string} channel - The channel to threshold ("Y", "Cb", or "Cr").
   * @param {number} thresholdVal - The threshold value.
   * @returns {Array} New RGBA values after thresholding.
   */
  static thresholdYCbCr(r, g, b, a, channel, thresholdVal) {
    let value;
    if (channel === "Y") {
      value = r;
    } else if (channel === "Cb") {
      value = g;
    } else if (channel === "Cr") {
      value = b;
    }
    return (value > thresholdVal) ? [255, 255, 255, a] : [0, 0, 0, a];
  }
}