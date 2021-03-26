export default {
  /**
   * @param {} src
   * src的长度就是返回的uuid的长度
   */
  getUuid(src) {
    return src.replace(/[xy]/g, function(c) {
      let r = (Math.random() * 16) | 0;
      let v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};
