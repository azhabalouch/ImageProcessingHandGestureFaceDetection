/**
 * Converts an image to greyscale and increases its brightness by 20%,
 * ensuring that no pixel channel exceeds 255.
 * Using coursework and other sources.
 *
 * @param {p5.Image} img - The input image to be processed.
 * @returns {p5.Image} The processed image with greyscale and increased brightness.
 */
function greyscale(img) {
  // Create a new image, copy the source and load it for manipulation
  let processedImg = createImage(img.width, img.height);
  processedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  processedImg.loadPixels();
  
  // Iterate over each pixel in the image
  for (let y = 0; y < processedImg.height; y++) {
    for (let x = 0; x < processedImg.width; x++) {
      let index = (x + y * processedImg.width) * 4;
      let r = processedImg.pixels[index];
      let g = processedImg.pixels[index + 1];
      let b = processedImg.pixels[index + 2];
      
      // Source: https://planetcalc.com/9279/
      // Convert to greyscale
      let grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Source: https://bioimagebook.github.io/chapters/1-concepts/1-images_and_pixels/images_and_pixels.html#sec-images-luts
      // Increase the brightness by 20% to a maximum of 255
      let bright = grey * 1.2;
      bright = bright > 255 ? 255 : bright;
      
      // Update the pixel
      processedImg.pixels[index] = bright;
      processedImg.pixels[index + 1] = bright;
      processedImg.pixels[index + 2] = bright;
    }
  }
  
  // Update and return the processed image
  processedImg.updatePixels();
  return processedImg;
}