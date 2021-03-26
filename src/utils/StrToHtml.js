export default {
  // 字符串中解析出img标签
  textToImg(str) {
    let imgReg = /<img.*?(?:>|\/>)/gi;
    return str.match(imgReg);
  },
  // 字符串中解析出iframe标签
  textToIframe(str) {
    let imgReg = /<iframe.*?(?:>|\/>)/gi;
    return str.match(imgReg);
  },
  // 字符串中解析出img的src
  textToImageSrc(str) {
    let imgReg = /<img.*?(?:>|\/>)/gi;
    let srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i;
    let imgs = str.match(imgReg) || [];
    let srcs = [];
    for (const img of imgs) {
      let src = img.match(srcReg);
      srcs.push(src[1]);
    }
    return srcs;
  },
  // 字符串中解析出src
  textToVideoSrc(str) {
    let imgReg = /<iframe.*?(?:>|\/>)/gi;
    let srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i;
    let imgs = str.match(imgReg) || [];
    let srcs = [];
    for (const img of imgs) {
      let src = img.match(srcReg);
      srcs.push(src[1]);
    }
    return srcs;
  },
  // 字符串中解析出src
  textToVideoSrc1(str) {
    let imgReg = /<video.*?(?:>|\/>)/gi;
    let srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i;
    let imgs = str.match(imgReg) || [];
    let srcs = [];
    for (const img of imgs) {
      let src = img.match(srcReg);
      srcs.push(src[1]);
    }
    return srcs;
  },
  // 字符串中解析出iFrame video src
  contentToVideoSrc(content) {
    let iFrameReg = /<iframe.*?(?:>|\/>)/gi;
    let srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i;

    let imgs = content.match(iFrameReg) || [];
    let srcs = [];
    for (const img of imgs) {
      console.log(img);
      if (img.search(/biz_video_iframe/) !== -1) {
        let src = img.match(srcReg);
        srcs.push(src[1]);
      }
    }
    return srcs;
  }
};
