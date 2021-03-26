export default {
  // 社会信用代码
  isUnifiedSocialCreditCode(code) {
    let check = /^[0-9A-Z]{18}$/;
    return check.test(code);
  },
  // 手机号
  isMobile(code) {
    const check = /^1(3|4|5|7|8|9)\d{9}$/;
    return check.test(code);
  },
  // 自然数(大于等于零的整数)
  isNaturalNum(code) {
    const check = /^(0|[1-9][0-9]*)$/;
    return check.test(code);
  },
  // 身份证
  isIdCard(code) {
    // 18位
    const check = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return check.test(code);
  },
  // 车牌号
  isPlateNum(code) {
    const check = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/;
    return check.test(code);
  },
  // 邮编
  isPostNum(code) {
    const check = /^[0-9]{6}$/;
    return check.test(code);
  },
  // 邮箱
  isMail(code) {
    const check = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    return check.test(code);
  },
  // 数字
  isNum(code) {
    const check = /^\d+$/;
    return check.test(code);
  }
};
