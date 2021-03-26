export default {
  // --------------------------商品管理Start-----------------------
  // 获取推荐列表
  getCommodityList: '/admin/product/union/list.jhtml',
  // 删除推荐
  delete: '/admin/shopProduct/shopProductItem.jhtml',
  // 请求商品的基本信息
  queryProductBasicInfo: '/admin/shopProduct/shopProductBasicInfo.jhtml',
  // 更新商品的基本信息
  updateProductBasicInfo: '/admin/shopProduct/shopProductBasicInfo.jhtml',
  // 添加商品的基本信息
  creatProductBasicInfo: '/admin/shopProduct/shopProductBasicInfo.jhtml',
  // 根据商品分类查找相应的品牌
  getBrands: '/admin/shopProduct/queryBrandsByCategory.jhtml',
  // 根据品牌获取系列
  getSeries: '/admin/shopProduct/querySeriesByBrand.jhtml',
  // 获取系列下的名称
  getName: '/admin/shopProduct/queryTypeByBrandSeries.jhtml',
  // 下架和上架
  soldoutAndPutaway: '/admin/shopProduct/updateMarketableState.jhtml',
  // 克隆商品
  cloneProduct: '/admin/shopProduct/cloneProduct.jhtml',
  // 创建整车-获取品牌
  getVehicleBrands: '/admin/shopProduct/queryBrandDatas.jhtml',
  // 创建整车-获取系列 使用getSeries
  // 创建整车-获取名称
  getVehicleNames: '/admin/shopProduct/queryCarTypeInfo.jhtml',
  // 创建整车
  createVehicle: '/admin/shopProduct/importProductDataFromBaseDate.jhtml',
  // 获取过滤器
  queryFilters: '/admin/shopProduct/filter.jhtml',

  // 请求指定商品ID的商品详情
  queryProductDetail: '/admin/shopProduct/productDetail.jhtml',
  // 更新指定商品ID的商品详情
  updateProductDetail: '/admin/shopProduct/productDetail.jhtml',

  // 请求指定商品ID的商品详情-平台
  queryProductDetail_pm: '/admin/baseData/basicData/detail.jhtml',
  // 更新指定商品ID的商品详情-平台
  updateProductDetail_pm: '/admin/baseData/basicData/detail.jhtml',
  // 导入商品文件
  uploadProductFile: '/admin/shopProduct/importFileProduct.jhtml',
  // 获取导入商品分类列表
  queryPlatformCategoryTree:
    '/admin/shopProduct/queryPlatformCategoryTree.jhtml',
  // 获取导入品牌系列列表
  queryPlatformImportInfo: '/admin/shopProduct/queryPlatformImportInfo/v2.jhtml',
  // 从平台导入商品
  importPlatformProduct: '/admin/shopProduct/importPlatformProduct/v2.jhtml',
  // 获取商品参数
  getParameterGroups: '/admin/shopProduct/productParameters.jhtml',
  // 更新商品参数
  updateParameterGroups: '/admin/shopProduct/productParameters.jhtml',

  // 获取商品属性
  getAttributeGroups: '/admin/shopProduct/productAttributes.jhtml',
  // 更新商品属性
  updateAttributeGroups: '/admin/shopProduct/productAttributes.jhtml',

  // 获取商品图片
  getImageGroups: '/admin/shopProduct/productImages.jhtml',
  // 更新商品图片
  updateImageGroups: '/admin/shopProduct/productImages.jhtml',
  // 更新商品VR图片
  updateProductVrMediaBath: '/admin/shopProduct/productVrMediaBath.jhtml',

  // 获取商品图片-平台
  getImageGroups_pm: '/admin/baseData/basicData/images.jhtml',
  // 更新商品图片-平台
  updateImageGroups_pm: '/admin/baseData/basicData/images.jhtml',
  // 更新商品VR图片-平台
  updateProductVrMediaBath_pm: '/admin/baseData/basicData/vrMediaBath.jhtml',

  // 获取商品规格
  getSpecificationGroups: '/admin/shopProduct/productSpecifications.jhtml',
  // 更新商品规格
  updateSpecificationGroups: '/admin/shopProduct/productSpecifications.jhtml',
  // --------------------------商品管理End-----------------------

  // --------------------------品牌管理Start-----------------------
  // 获取品牌列表
  getBrandManageList: '/admin/shopBrand/brandSeries.jhtml',
  // 删除品牌
  deleteBrand: '/admin/shopBrand/brand.jhtml',
  // 删除系列
  deleteSeries: '/admin/shopSeries/series.jhtml',
  // 添加品牌
  createBrand: '/admin/shopBrand/brand.jhtml',
  // 添加系列
  createSeries: '/admin/shopSeries/series.jhtml',
  // 更新品牌
  updateBrand: '/admin/shopBrand/brand.jhtml',
  // 更新系列
  updateSeries: '/admin/shopSeries/series.jhtml',
  // 查询品牌
  queryByBrand: '/admin/shopBrand/brand.jhtml',
  // 查询系列
  queryBySeries: '/admin/shopSeries/query.jhtml',
  // 根据首字母获取品牌名称
  queryBrand: '/admin/shopBrand/query.jhtml',
  // 根据品牌获取系列
  querySeries: '/admin/shopSeries/querySeries.jhtml',
  // --------------------------品牌管理End-----------------------

  // --------------------------分类管理Start-----------------------
  // 获取品牌管理列表
  getProductCategoryList: '/admin/json/ShopProduct_category/list.jhtml',
  // 添加分类
  saveProductCategory: '/admin/json/ShopProduct_category/category.jhtml',
  // 删除分类
  deleteProductCategory: '/admin/json/ShopProduct_category/category.jhtml',
  // 更新分类
  updateProductCategory: '/admin/json/ShopProduct_category/category.jhtml',
  // 获取分类
  getProductCategory: '/admin/json/ShopProduct_category/categoryQuery.jhtml',
  // 获取导入品牌管理列表
  getInputProductCategoryList:
    '/admin/json/ShopProduct_category/platformAdd.jhtml',
  // 更新导入品牌管理列表
  saveInputProductCategoryList: '/admin/json/ShopProduct_category/import.jhtml',

  // 添加参数
  saveCategoryParameter: '/admin/parameter_group/parameterGroup.jhtml',
  // 删除参数
  deleteCategoryParameter: '/admin/parameter_group/parameterGroup.jhtml',
  // 更新参数
  updateCategoryParameter: '/admin/parameter_group/parameterGroup.jhtml',
  // 获取参数
  getCategoryParameter: '/admin/parameter_group/parameterGroupQuery.jhtml',

  // 获取产品属性列表
  getProductAttributeList: '/admin/attribute/attributeQuery.jhtml',
  // 添加产品属性
  saveProductAttribute: '/admin/attribute/attribute.jhtml',
  // 更新产品属性
  updateProductAttribute: '/admin/attribute/attribute.jhtml',
  // 更新删除属性
  deleteProductAttribute: '/admin/attribute/attribute.jhtml',
  // 获取产品规格列表
  getProductSpecificationList: '/admin/specification/specificationQuery.jhtml',
  // 添加产品规格
  saveProductSpecification: '/admin/specification/specification.jhtml',
  // 更新产品规格
  updateProductSpecification: '/admin/specification/specification.jhtml',
  // 更新删除规格
  deleteProductSpecification: '/admin/specification/specification.jhtml',
  // 通过/取消审核商品
  audit: '/admin/auditTarget/audit.jhtml',
  // 审核商品
  auditTarget: '/admin/auditTarget/auditTarget.jhtml',
  // 撤回商品
  recallProduct: '/admin/product/recallProduct.jhtml'
  // --------------------------分类管理End-----------------------
};
