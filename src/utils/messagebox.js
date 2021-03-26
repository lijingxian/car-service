export default {
  clearMessageBoxes () {
    let arr = document.querySelectorAll('.el-message');
    arr.forEach(element => {
      element.remove();
    });
  }
};
