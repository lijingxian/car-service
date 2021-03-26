let SimpleText = function() {
  return {
    type: 'simple-text',
    content: '请添加文本内容',
    color: 'rgba(51, 51, 51, 1)',
    fontFamily: '',
    fontSize: 22,
    fontStyle: [],
    letterSpacing: 0,
    lineHeight: 1.5,
    textAlign: 'left',
    x: 97.5,
    y: 15,
    width: 180,
    height: 33
  };
};

let ImageF = function() {
  return {
    type: 'image',
    content: '',
    src: {
      width: 375,
      height: 375,
      url: 'https://p9-tt.byteimg.com/img/ad-tetris-site/file/1577671496425/0de42913933fd4a58f8fb88714103648~noop.webp'
    },
    x: 0,
    y: 10,
    width: 375,
    height: 375
  };
};

let FormF = function() {
  return {
    type: 'form',
    formData: {
      submitText: '立即提交',
      elements: [
        { required: true, type: 'text', label: '姓名', keyType: '姓名', value: '', key: 'name' },
        { required: true, type: 'number', label: '电话', keyType: '电话', value: '', key: 'mobile' },
        { required: true, type: 'text', label: '意向车型', keyType: '意向车型', value: '', key: 'productName' }
      ]
    },
    backgroundType: 'color',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    successTip: '提交成功',
    buttonBackColor: 'rgba(249, 194, 86, 1)',
    buttonForeColor: 'rgba(255, 255, 255, 1)',
    buttonBorderRadius: 1,
    x: 0,
    y: 20,
    width: 375,
    height: 325,
    version: 1
  };
};

let TelF = function() {
  return {
    type: 'tel',
    label: '拨打电话',
    content: '15512345678',
    color: '#ffffff',
    fontSize: 16,
    backgroundColor: 'rgba(39, 198, 147, 1)',
    // backgroundColor: '#6cbafa',
    borderRadius: 21,
    x: 78.5,
    y: 10,
    width: 184,
    height: 42,
    version: 1,
    bgType: 'color'
  };
};

let BrickF = function() {
  return {
    type: 'brick',
    children: [],
    bgType: 'color',
    bgColor: 'rgba(255, 255, 255, 1)',
    bgImage: {
      src: ''
    },
    bgMaskColor: { color: 'rgba(255, 255, 255, 0)' },
    width: 375,
    height: 375
  };
};

let BtnF = function() {
  return {
    type: 'btn',
    label: '按钮',
    content: '',
    color: '#ffffff',
    fontSize: 16,
    backgroundColor: '#6cbafa',
    borderRadius: 21,
    x: 78.5,
    y: 10,
    width: 184,
    height: 42,
    version: 1,
    bgType: 'color'
  };
};

export { BrickF, SimpleText, ImageF, FormF, TelF, BtnF };
