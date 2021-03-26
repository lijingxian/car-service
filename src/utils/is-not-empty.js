export default function(value) {
  let is = false;
  let str;
  if (value !== undefined && value !== null) {
    switch (Object.prototype.toString.apply(value)) {
      case '[object String]':
        str = value.replace(/(^\s*)|(\s*$)/g, '');
        if (str !== '' && str.toLowerCase() !== 'null' && str.length > 0) {
          is = true;
        }
        break;
      case '[object Number]':
        is = true;
        break;
      case '[object Boolean]':
        is = true;
        break;
      case '[object Object]':
        for (let key in value) {
          if (key) {
            is = true;
          }
        }
        break;
      case '[object Array]':
        if (value.length > 0) {
          is = true;
        }
        break;
    }
  }
  return is;
}
