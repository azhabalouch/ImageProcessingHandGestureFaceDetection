/**
 * Applies a given filter callback to each pixel of the image.
 *
 * @param {p5.Image} img - The p5 image to be processed.
 * @param {function} filterCallback - A callback that takes (r, g, b, a)
 *   and returns an array [newR, newG, newB, newA].
 * @returns {p5.Image} The processed image.
 */
function applyFilter(img, filterCallback) {
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];

      // Get the new pixel values from the callback.
      let [newR, newG, newB, newA] = filterCallback(r, g, b, a);
      img.pixels[index]     = newR;
      img.pixels[index + 1] = newG;
      img.pixels[index + 2] = newB;
      img.pixels[index + 3] = newA;
    }
  }
  img.updatePixels();
  return img;
}
  