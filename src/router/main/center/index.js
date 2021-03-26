/* eslint-disable */

// 运营Operating
let operating = [];
import operatingRoute from './operating';
operating = operating.concat(operatingRoute);

// 车辆car
let car = [];
import carRoute from './car';
car = car.concat(carRoute);

// 客服service
let service = [];
import customService from './customService';
service = service.concat(customService);

// 营销marketing
let marketing = [];
import marketingRoute from './marketing';
marketing = marketing.concat(marketingRoute);

// 会员member
let member = [];
import memberRoute from './member';
member = member.concat(memberRoute);

// 消息message
let message = [];
import newsMgmt from './newsMgmt';
import faultAlarmSetting from './faultAlarmSetting';
message = message.concat(newsMgmt);
message = message.concat(faultAlarmSetting);

// 销售sales
let sales = [];
import salesMgmt from './sales';
sales = sales.concat(salesMgmt);

// 售后after-sale
let afterSale = [];
import maintenance from './maintenance';
afterSale = afterSale.concat(maintenance);

// 进销存
let invoicing = [];
import invoicingRoute from './invoicing';
invoicing = invoicing.concat(invoicingRoute);

// 财务
let finance = [];
import financeRoute from './finance';
finance = finance.concat(financeRoute);

// 系统system
let system = [];
import systemRoute from './system';
system = system.concat(systemRoute);

// 个人admin
let admin = [];
import mine from './mine';
admin = admin.concat(mine);

// 帮助
let help = [];
import helpCenter from './help';
help = help.concat(helpCenter);

// 联盟union
let union = [];
import unionRoute from './union';
union = union.concat(unionRoute);

// oa
let oa = [];
import oaRoute from './oa';
oa = oa.concat(oaRoute);

// 测试用页面test
let test = [];
import Test from './test';
test = test.concat(Test);

let routes = Object.assign(
  {},
  { operating: operating },
  { car: car },
  { service: service },
  { marketing: marketing },
  { member: member },
  { message: message },
  { sales: sales },
  { afterSale: afterSale },
  { invoicing: invoicing },
  { finance: finance },
  { system: system },
  { admin: admin },
  { help: help },
  { union: union },
  { oa: oa },
  { test: test }
);

export default routes;
