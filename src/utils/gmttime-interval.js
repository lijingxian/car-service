export default function(endTime, startTime) {
  if (!endTime || !startTime) {
    return 0;
  }
  let startArr = startTime.split(':');
  let endArr = endTime.split(':');
  let result = (endArr[0] - startArr[0]) * 60 + (endArr[1] - startArr[1]) + (endArr[2] - startArr[2]) / 60;
  if (result < 0) {
    return 0;
  } else {
    return result;
  }
}
