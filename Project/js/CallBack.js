function redThresholdCallback(r, g, b, a) {
  let thresholdVal = redThresholdSlider.value();
  return [(r > thresholdVal) ? 255 : 0, 0, 0, a];
}

function greenThresholdCallback(r, g, b, a) {
  let thresholdVal = greenThresholdSlider.value();
  return [0, (g > thresholdVal) ? 255 : 0, 0, a];
}

function blueThresholdCallback(r, g, b, a) {
  let thresholdVal = blueThresholdSlider.value();
  return [0, 0, (b > thresholdVal) ? 255 : 0, a];
}