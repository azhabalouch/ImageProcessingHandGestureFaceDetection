/**
 * Extracts a single color channel from the given image.
 * Source: Using lecture videos and coursework.
 *
 * @param {p5.Image} img - The input image from which to extract the color channel.
 * @param {string} channel - The name of the channel to extract ("red", "green", or "blue").
 * @returns {p5.Image} A new image containing only the specified color channel.
 */
function extractChannel(img, channel) {
  let channelImg = createImage(img.width, img.height);
  
  // Load pixels for both the source image and the new channel image.
  img.loadPixels();
  channelImg.loadPixels();
  
  // Loop through each pixel in the image.
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];
      
      // Depending on the channel parameter, keep only that channel's value.
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
      
      // Preserve the alpha channel.
      channelImg.pixels[index + 3] = a;
    }
  }
  
  // Update the pixels of the new image and return it.
  channelImg.updatePixels();
  return channelImg;
}  