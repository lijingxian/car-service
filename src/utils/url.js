export default {
  toURLParams (obj) {
    let result = [];
    for (let key in obj) {
      result.push('&');
      if (obj[key] instanceof Array) {
        obj[key].forEach((item, index) => {
          if (index !== 0) result.push('&');
          result.push(key);
          result.push('=');
          result.push(item);
        });
      } else {
        result.push(key);
        result.push('=');
        result.push(obj[key]);
      }
    }

    // 编码防止IE请求时乱码
    return encodeURI(result.join('').replace('&', '?'));
  }
};
