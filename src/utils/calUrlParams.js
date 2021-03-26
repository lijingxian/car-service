let defaultJoinMark = '&';
let defaultSetValueMark = '=';

function getParams(str, joinMark, setValueMark) {
  let dataObj = {};
  let splitedStrArr = str.split(joinMark);
  splitedStrArr.forEach(splitedStr => {
    let splitedKeyAndValue = splitedStr.split(setValueMark);
    dataObj[splitedKeyAndValue[0]] = splitedKeyAndValue[1];
  });
  return dataObj;
}

function getCleanHash() {
  return location.hash.replace('#', '');
}

function getCleanQuery() {
  return location.search.replace('?', '').replace('/', '');
}

export default {
  getUriQuery() {
    return getParams(getCleanQuery(), defaultJoinMark, defaultSetValueMark);
  },
  getUriHash() {
    return getParams(getCleanHash(), defaultJoinMark, defaultSetValueMark);
  }
};
