export default {
  // 招商申请列表
  list: '/admin/investment/list.jhtml',
  // 统计信息
  statistics: '/admin/investment/count.jhtml',
  // 创建招商申请
  create: '/admin/investment/create.jhtml',
  // 查看招商申请
  select: '/admin/investment/query.jhtml',
  // 修改招商申请
  edit: '/admin/investment/update.jhtml',
  // 获取运营商列表
  companyList: '/admin/company/json/list.jhtml',
  // 测试的运营商列表
  operateList: '/admin/telecomOperator/list.jhtml',
  // 地区列表
  areaList: '/rest/area/list.jhtml',
  // 地区父级查询
  areaParent: '/rest/area/queryParentArea.jhtml',

  // 基础信息通过
  passBaseInfo: '/admin/investment/pass.jhtml',
  // 基础信息废弃
  abandonedBaseInfo: '/admin/investment/totalFail.jhtml',
  // 发送邮件
  sendMail: '/admin/investment/sendMail.jhtml',

  // 个人资质创建
  createPsnQua: '/admin/personalInfo/create.jhtml',
  // 个人资质查询
  selectPsnQua: '/admin/personalInfo/query.jhtml',
  // 个人资质更新
  updatePsnQua: '/admin/personalInfo/update.jhtml',
  // 个人资质通过
  passedPsnQua: '/admin/personalInfo/update.jhtml',
  // 个人资质废弃
  abandonedPsnQua: '/admin/investment/totalFail.jhtml',

  // 企业资质创建
  createComQua: '/admin/enterpriseInfo/create.jhtml',
  // 企业资质查询
  selectComQua: '/admin/enterpriseInfo/query.jhtml',
  // 企业资质更新
  updateComQua: '/admin/enterpriseInfo/update.jhtml',
  // 企业资质通过
  passedComQua: '/admin/enterpriseInfo/update.jhtml',
  // 企业资质废弃
  abandonedComQua: '/admin/investment/totalFail.jhtml',

  // 通过审核
  passed: '/admin/investment/totalPass.jhtml',
  // 废弃
  failed: '/admin/investment/totalFail.jhtml',
  // 导航
  queryNavigationKpi: '/admin/investment/queryNavigationKpi.jhtml'
};
