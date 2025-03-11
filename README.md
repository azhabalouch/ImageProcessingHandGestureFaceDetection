# Image Processing Application

This project shows an image processing application that works with live webcam images. It uses many techniques like RGB thresholding, color space conversion, face detection with privacy filters, and a special hand gesture control to choose filters.

## Video Demonstration

Watch the demo on YouTube:  
[https://youtu.be/C54d4kQQ6P4](https://youtu.be/C54d4kQQ6P4)

## Project Overview

The app takes live webcam images and does several tasks:
- **Webcam Capture:** Shows a live webcam image in a grid.
- **Greyscale & Brightness:** Changes the image to black and white and makes it 20% brighter.
- **Channel Splitting & Thresholding:** Breaks the image into red, green, and blue parts. Each part is thresholded with a slider to show different details.
- **Colour Space Conversion:** Changes the image into HSV and YCbCr color spaces. These methods give cleaner images with less noise.
- **Face Detection & Privacy Filters:** Uses ml5’s Face API to find faces. Then, it hides the face details by making them grey, blurry, changing their color, or pixelating them.
- **Hand Gesture Control (Extension):** Uses the HandPose model from ml5.js to let users choose filters with hand gestures.

## Credits & Resources

- **Libraries Used:** [p5.js](https://p5js.org/), [ml5.js](https://ml5js.org/)
- **Tutorials & References:**
  - Goldsmiths, University of London: BSc Computer Science module Graphics Programming Final Project
  - Tutorials from the ml5.js and p5.js communities on face detection and hand gesture control.
  - Online guides and stack overflow.
