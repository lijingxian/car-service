let now = new Date(); // 当前日期
let nowDayOfWeek = now.getDay() - 1; // 今天本周的第几天
let nowDay = now.getDate(); // 当前日
let nowMonth = now.getMonth(); // 当前月
let nowYear = now.getYear(); // 当前年
nowYear += nowYear < 2000 ? 1900 : 0;
export default {
  // 格局化日期：yyyy-MM-dd
  formatDate: function(date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = '0' + mymonth;
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday;
    }
    return myyear + '-' + mymonth + '-' + myweekday;
  },
  // 获得某月的天数
  getMonthDays: function(myMonth) {
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  },
  // 获得本季度的开端月份
  getQuarterStartMonth: function() {
    let quarterStartMonth = 0;
    if (nowMonth < 3) {
      quarterStartMonth = 0;
    }
    if (nowMonth > 2 && nowMonth < 6) {
      quarterStartMonth = 3;
    }
    if (nowMonth > 5 && nowMonth < 9) {
      quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
      quarterStartMonth = 9;
    }
    return quarterStartMonth;
  },
  // 获得今天开始/结束时间
  today: function() {
    return this.formatDate(now);
  },
  // 获得本周的开端日期
  getWeekStartDate: function() {
    let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return this.formatDate(weekStartDate);
  },
  // 获得本周的停止日期
  getWeekEndDate: function() {
    let weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return this.formatDate(weekEndDate);
  },
  // 获得本月的开端日期
  getMonthStartDate: function() {
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    return this.formatDate(monthStartDate);
  },
  // 获得本月的停止日期
  getMonthEndDate: function() {
    let monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    return this.formatDate(monthEndDate);
  },
  // 获得本季度的开端日期
  getQuarterStartDate: function() {
    let quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(), 1);
    return this.formatDate(quarterStartDate);
  },
  // 获得本季度的停止日期
  getQuarterEndDate: function() {
    let quarterEndMonth = this.getQuarterStartMonth() + 2;
    let quarterStartDate = new Date(
      nowYear,
      quarterEndMonth,
      this.getMonthDays(quarterEndMonth)
    );
    return this.formatDate(quarterStartDate);
  },
  //  获得半年开始
  getQuarterHalfYearStart: function() {
    let str = '';
    if (nowMonth <= 6) {
      //
      str = nowYear + '-01-01';
    } else {
      str = nowYear + '-07-01';
    }
    return str;
  },
  //  获得半年结束
  getQuarterHalfYearEnd: function() {
    let str = '';
    if (nowMonth <= 6) {
      //
      str = nowYear + '-06-30';
    } else {
      str = nowYear + '-12-31';
    }
    return str;
  },
  //  获得一年的开始时间
  getQuarterYearStart: function() {
    return nowYear + '-01-01';
  },
  //  获得一年的结束时间
  getQuarterYearEnd: function() {
    return nowYear + '-12-31';
  },
  //  获得近一周的时间
  getBeforeWeek: function() {
    let oneweekdate = new Date(now - 7 * 24 * 3600 * 1000);
    let year = oneweekdate.getFullYear();
    let month = oneweekdate.getMonth() + 1;
    let day1 =
      oneweekdate.getDate() > 9
        ? oneweekdate.getDate()
        : '0' + oneweekdate.getDate();
    return year + '-' + month + '-' + day1;
  },
  //  获得近一个月的时间
  getPreOneMonthDay: function() {
    let date = new Date();
    let nowMonth = date.getMonth() + 1;
    if (nowMonth < 10) {
      nowMonth = '0' + nowMonth;
    }
    let nowDay = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    let nowdatestr = date.getFullYear() + '-' + nowMonth + '-' + nowDay;
    let dateArr = nowdatestr.split('-');
    let year = dateArr[0]; // 获取当前日期的年份
    let month = dateArr[1]; // 获取当前日期的月份
    let day = dateArr[2]; // 获取当前日期的日
    // let days = new Date(year, month, 0);
    // days = days.getDate(); // 获取当前日期中月的天数
    let year2 = year;
    let month2 = parseInt(month) - 1;
    if (month2 <= 0) {
      year2 = parseInt(year2) - 1;
      month2 = 12 - (Math.abs(month2) % 12);
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    let t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
  },
  //  获得近三个月的时间
  getPreThreeMonthDay: function() {
    let date = new Date();
    let nowMonth = date.getMonth() + 1;
    if (nowMonth < 10) {
      nowMonth = '0' + nowMonth;
    }
    let nowDay = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    let nowdatestr = date.getFullYear() + '-' + nowMonth + '-' + nowDay;
    let dateArr = nowdatestr.split('-');
    let year = dateArr[0]; // 获取当前日期的年份
    let month = dateArr[1]; // 获取当前日期的月份
    let day = dateArr[2]; // 获取当前日期的日
    // let days = new Date(year, month, 0);
    // days = days.getDate(); // 获取当前日期中月的天数
    let year2 = year;
    let month2 = parseInt(month) - 3;
    if (month2 <= 0) {
      year2 = parseInt(year2) - 1;
      month2 = 12 - (Math.abs(month2) % 12);
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    let t2 = year2 + '-' + month2 + '-' + day;
    return t2;
  }
};
