export default {
  // 当前date 2018-12-02
  nowDate() {
    let time = new Date();
    let endMonth =
      time.getMonth() + 1 < 10
        ? '0' + (time.getMonth() + 1)
        : time.getMonth() + 1;

    let days = time.getDate() + 1 < 10 ? '0' + time.getDate() : time.getDate();

    return time.getFullYear().toString() + '-' + endMonth + '-' + days;
  },
  // 获得某月的天数
  getMonthDays(dateTime) {
    let time = new Date(Date.parse(dateTime.replace(/-/g, '/')));
    let monthStartDate = new Date(time.getFullYear(), time.getMonth(), 1);
    let monthEndDate = new Date(time.getFullYear(), time.getMonth() + 1, 1);
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  },
  // 半年前
  halfYearAgo(dateTime) {
    let time = '';
    if (dateTime) {
      time = new Date(Date.parse(dateTime.replace(/-/g, '/')));
    } else {
      time = new Date();
    }
    console.log(time);
    time.setMonth(time.getMonth() - 6);
    return `${time.getFullYear()}-${time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1}-${time.getDate() < 10 ? '0' + time.getDate() : time.getDate()}`;
  },
  // 上一个月 2018-12-02
  lastMonthDate() {
    let time = new Date();

    let startYear = time.getFullYear();
    let startMonth =
      time.getMonth() + 1 < 10 ? '0' + time.getMonth() : time.getMonth();

    let days = time.getDate() + 1 < 10 ? '0' + time.getDate() : time.getDate();

    if (startMonth === '00') {
      startMonth = '12';
      startYear--;
    }
    return startYear.toString() + '-' + startMonth + '-' + days;
  },
  // 下一个月 2018-12-02
  nextMonthDate() {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let nextMonth = parseInt(month) + 1;
    if (nextMonth === 13) {
      year = parseInt(year) + 1;
      nextMonth = 1;
    }
    let days2 = new Date(year, nextMonth, 0);
    days2 = days2.getDate();
    if (day > days2) {
      day = days2;
    }
    if (nextMonth < 10) {
      nextMonth = '0' + nextMonth;
    }
    return year + '-' + nextMonth + '-' + day;
  },
  // 前一年 2018.3.7
  lastYearDate() {
    let time = new Date();
    let lastYear = new Date(time.getFullYear() - 1, time.getMonth(), time.getDate());
    return lastYear.getFullYear() +
      '-' +
      this.convertToFullMode(lastYear.getMonth() + 1) +
      '-' +
      this.convertToFullMode(lastYear.getDate());
  },
  // 后二年 2019.1.24
  lastTwoYearDate() {
    let time = new Date();
    let lastYear = new Date(time.getFullYear() + 2, time.getMonth(), time.getDate());
    return lastYear.getFullYear() +
      '-' +
      this.convertToFullMode(lastYear.getMonth() + 1) +
      '-' +
      this.convertToFullMode(lastYear.getDate());
  },
  // 后N年 2019.1.24
  lastNYearDate(dateTime, yearTime) {
    let time = new Date(dateTime);
    let lastYear = new Date(time.getFullYear() + parseInt(yearTime), time.getMonth(), time.getDate());
    return lastYear.getFullYear() +
      '-' +
      this.convertToFullMode(lastYear.getMonth() + 1) +
      '-' +
      this.convertToFullMode(lastYear.getDate());
  },
  /**
   * 将日期类型转为换 yyyy-MM-dd 的格式
   * @param {Date} val
   */
  dateConverter(val) {
    if (val instanceof Date) {
      return val.getFullYear() +
        '-' +
        this.convertToFullMode(val.getMonth() + 1) +
        '-' +
        this.convertToFullMode(val.getDate());
    } else {
      return val;
    }
  },
  /**
   * 将日期转换为 HH:mm:ss 的格式
   * @param {Date} val
   */
  timeConverter(val) {
    if (val instanceof Date) {
      return this.convertToFullMode(val.getHours()) +
        ':' +
        this.convertToFullMode(val.getMinutes()) +
        ':' +
        this.convertToFullMode(val.getSeconds());
    } else {
      return val;
    }
  },
  /**
   * 将日期转换为 HH:mm 的格式
   * @param {Date} val
   */
  shortTimeConverter(val) {
    if (val instanceof Date) {
      return this.convertToFullMode(val.getHours()) +
        ':' +
        this.convertToFullMode(val.getMinutes());
    } else {
      return val;
    }
  },
  /**
   * 将日期类型转为换 yyyy-MM-dd HH:mm:ss 的格式
   * @param {Date} val
   */
  dateTimeConverter(val) {
    if (val instanceof Date) {
      return this.dateConverter(val) +
        ' ' +
        this.timeConverter(val);
    } else {
      return val;
    }
  },
  /**
   * 将“1”转换为“01”这种格式，如果是“10”，则不会转换
   * @param {String} val
   */
  convertToFullMode(val) {
    val = val.toString();
    if (val.length === 1) return '0' + val;
    else return val;
  }
};
