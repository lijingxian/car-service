export default {
  // 文章管理获取列表
  ArticleMgmt_queryList: '/admin/article/article/list.jhtml',
  // 文章列表删除
  ArticleMgmt_deleteList: '/admin/article/article/delete.jhtml',
  // 文章列表发布按钮
  ArticleMgmt_publishToApp: '/admin/article/article/updatePublishState.jhtml',
  // 文章管理基本信息获取
  ArticleMgmt_queryBaseInfo: '/admin/article/article/query.jhtml',
  // 基本信息更新
  ArticleMgmt_updateBaseInfo: '/admin/article/article/update.jhtml',
  // 基本信息创建
  ArticleMgmt_createBaseInfo: '/admin/article/article/create.jhtml',
  // 文章管理基本信息类型获取
  ArticleMgmt_queryTypeList: '/admin/article/article/init.jhtml',

  // 文章分类获取列表
  CategoryMgmt_query: '/admin/article_category/category/list.jhtml',
  // 文章分类删除
  CategoryMgmt_delete: '/admin/article_category/category/delete.jhtml',
  // 文章分类基本信息获取
  CategoryMgmt_queryBaseInfo: '/admin/article_category/category/query.jhtml',
  // 文章分类基本信息创建
  CategoryMgmt_createBaseInfo: '/admin/article_category/category/create.jhtml',
  // 文章分类基本信息更新
  CategoryMgmt_updateBaseInfo: '/admin/article_category/category/update.jhtml',
  // 基本信息获取上级分类
  CategoryMgmt_queryList: '/admin/article_category/category/init.jhtml',

  // 获取微信公众号列表
  WechatPublication_queryWechatList: '/admin/articleWechat/wechatQuery.jhtml',
  // 微信发布
  WechatPublication_publish: '/admin/articleWechat/publics.jhtml',
  // 根据id数组传文章内容list
  ShopPublicity_queryList: '/admin/article/article/queryList.jhtml',

  // 微信文章
  // 查询列表
  Wechat_queryList: '/admin/articleWechat/wechatNews/list.jhtml',
  // 查询基本信息
  Wechat_queryBaseInfo: '/admin/articleWechat/wechatNews/query.jhtml',
  // 更新基本信息
  Wechat_updateBaseInfo: '',
  // 删除基本信息
  Wechat_deleteBaseInfo: '',

  // 店铺宣传/商品推广共用接口
  publicity: {
    // 查询列表
    queryList: '/admin/article/articles.jhtml',
    // 列表删除
    delete: '/admin/article/article/delete.jhtml',
    // 发布到APP
    publish: '/admin/article/article/updatePublishState.jhtml',
    // 审核
    check: '/admin/article/article/auditState.jhtml',
    // 编辑文章
    editArticle: {
      query: '/admin/article/article/query.jhtml',
      create: '/admin/article/article/create.jhtml',
      update: '/admin/article/article/update.jhtml',
      queryProductList: '/admin/order/product/list.jhtml',
      findProduct: '/admin/order/json/findProductListByIds.jhtml'
    },
    // 推送
    push: {
      query: '/admin/recommendPosition/settings.jhtml',
      // save: '/admin/recommendPosition/recommend.jhtml'
      save: '/admin/recommendPosition/settings.jhtml'
    }

  }
};
