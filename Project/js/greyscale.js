// Source: Using coursework videos.
// For comments: https://stackoverflow.com/questions/56377294/what-does-the-symbol-do-in-javascript-multiline-comments

/**
 * Converts an image to greyscale and increases its brightness by 20%,
 * ensuring that no pixel channel exceeds 255.
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
      // Calculate the pixel index
      let index = (x + y * processedImg.width) * 4;

      // Retrieve the original RGB values
      let r = processedImg.pixels[index];
      let g = processedImg.pixels[index + 1];
      let b = processedImg.pixels[index + 2];
      
      // Source: https://planetcalc.com/9279/
      // Convert to greyscale
      let grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;

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