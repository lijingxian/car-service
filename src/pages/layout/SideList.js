// ===== 左侧菜单栏列表 =====

const sideList = {
  // 联盟
  union: [
    {
      title: '门店管理',
      path: '/union/federation-mgmt',
      auth: 'admin:union',
      icon: 'biz-icon-i-web-l-lmgl',
      children: [
        {
          title: '全部门店',
          path: '/federation',
          auth: 'admin:union.manage',
          icon: 'biz-icon-i-web-l-lmgl'
        },
        {
          title: '联盟评级设置',
          path: '/product-settings/shop-rate',
          auth: 'admin:shop.creditRating',
          children: [
            {
              title: '能力评价体系设置',
              path: '/ability',
              auth: '',
              icon: 'biz-icon-i-web-l-lmgl'
            },
            {
              title: '承诺体系设置',
              path: '/promise',
              auth: '',
              icon: 'biz-icon-i-web-l-lmgl'
            },
            {
              title: '推荐体系设置',
              path: '/recommend',
              auth: '',
              icon: 'biz-icon-i-web-l-lmgl'
            }
          ]
        },
        {
          title: '招商加盟',
          path: '/merchants-mgmt/investment',
          auth: 'admin:investment',
          icon: 'biz-icon-zhaoshangjiameng'
        }
      ]
    },
    {
      title: '运营配置',
      path: '/union/shop',
      auth: 'admin:store',
      icon: 'biz-icon-i-web-l-yhgl',
      children: [
        {
          title: '挪车码',
          path: '/move-code',
          auth: 'admin.parkingCode',
          icon: 'biz-icon-i-sh-car-smnc'
        },
        // {
        //   title: '配送方式',
        //   path: '/product-settings/distributor-setting',
        //   auth: 'admin:shop.shippingMethod',
        //   icon: 'biz-icon-i-web-l-yhgl'
        // },
        // // 店铺
        // {
        //   title: '物流公司',
        //   path: '/delivery_shop',
        //   auth: 'admin:deliveryCorp.shop',
        //   icon: 'biz-icon-i-web-l-yhgl'
        // },
        {
          title: 'V服账户',
          path: '/shop-account',
          auth: 'admin:system.shopaccount.shop',
          icon: 'biz-icon-i-web-l-yhgl'
        },
        {
          title: '微信账户',
          path: '/wechatList',
          auth: 'admin:shopWechatBind',
          icon: 'biz-icon-i-web-l-yhgl'
        },
        {
          title: '电视投屏',
          path: '/screen-projection',
          auth: 'admin:advertising',
          icon: 'biz-icon-i-web-l-yhgl'
        }
      ]
    },
    {
      title: '服务订购',
      path: '/union/service-mgmt',
      auth: 'admin:serviceManage.manage',
      icon: 'biz-icon-i-web-l-fwdz',
      children: [
        {
          title: '服务定义',
          path: '/manage/manage',
          auth: 'admin:serviceManage',
          icon: 'biz-icon-i-web-l-fwdz'
        },
        {
          title: '方案定义',
          path: '/manage/plan',
          auth: 'admin:serviceManage',
          icon: 'biz-icon-i-web-l-fwdz'
        },
        {
          title: '服务订购',
          path: '/subscribe',
          auth: 'admin:service.subscribe',
          icon: 'biz-icon-i-web-l-fwdz'
        },
        {
          title: '服务订单',
          path: '/manage/order',
          auth: 'admin:serviceOrder',
          icon: 'biz-icon-i-web-l-fwdz'
        },
        {
          title: '短信记录',
          path: '/message-mgmt',
          auth: 'admin:service.sms.platform',
          icon: 'biz-icon-i-web-l-fwdz'
        },
        {
          title: '短信记录',
          path: '/message-mgmt',
          auth: 'admin:service.sms.store',
          icon: 'biz-icon-i-web-l-fwdz'
        },
        {
          title: '领域设置',
          path: '/domain-mgmt',
          auth: 'admin:service.sms.platform',
          icon: 'biz-icon-i-web-l-fwdz'
        }
      ]
    },
    {
      title: '标签管理',
      path: '/union/system/tag',
      auth: 'admin:system.tag',
      icon: 'biz-icon-i-web-l-bqk',
      children: [
        {
          title: '标签分类',
          path: '',
          auth: 'admin:system.tag.tagCategory',
          icon: 'biz-icon-i-web-l-bqk'
        },
        {
          title: '标签定义',
          path: '/tagMgmt',
          auth: 'admin:system.tag.tag',
          icon: 'biz-icon-i-web-l-bqk'
        }
      ]
    },
    {
      title: '标签管理',
      path: '/union/shop/tag/tagClass',
      auth: 'admin:shop.tag',
      icon: 'biz-icon-i-web-l-bqk'
      // children: [
      //   {
      //     title: '标签分类',
      //     path: '',
      //     auth: 'admin:shop.tag.tagCategory'
      //   },
      //   {
      //     title: '标签定义',
      //     path: '/tagMgmt',
      //     auth: 'admin:shop.tag.tag'
      //   }
      // ]
    },
    {
      title: '智能到店',
      path: '/union/smart-to-shop',
      auth: 'admin:IntelligentAccess',
      icon: 'biz-icon-i-web-l-zndd',
      children: [
        {
          title: '到店记录',
          path: '/reception-mgmt',
          auth: 'admin:reception',
          icon: 'biz-icon-i-web-l-zndd'
        }
        // {
        //   title: '到店统计',
        //   path: '/statistics-analysis',
        //   auth: 'admin:accessStatistics'
        // }
      ]
    },
    {
      title: '智能接待',
      path: '/union/smart-reception',
      auth: 'admin:smartReception',
      icon: 'biz-icon-i-web-l-znjd',
      children: [
        // {
        //   title: '机器人功能',
        //   path: '/robot-function-mgmt',
        //   auth: ''
        // },
        {
          title: '机器人设置',
          path: '/robot-mgmt',
          auth: 'admin:smartReception.robotManage',
          icon: 'biz-icon-i-web-l-znjd'
        },
        {
          title: '客户评价详情',
          path: '/reception-static/review-static-detail',
          auth: 'admin:smartReception.assess',
          icon: 'biz-icon-i-web-l-znjd'
        },
        {
          title: '普通问答',
          path: '/qa-mgmt',
          auth: 'admin:smartReception.answer',
          icon: 'biz-icon-i-web-l-znjd'
        },
        {
          title: '流程问答',
          path: '/process-qa',
          auth: 'admin:smartReception.flowAnswer',
          icon: 'biz-icon-i-web-l-znjd'
        },
        {
          title: '未知问题',
          path: '/unknow-problem',
          auth: 'admin:smartReception.unknownQuestion',
          icon: 'biz-icon-i-web-l-znjd'
        },
        {
          title: '地图管理',
          path: '/map-mgmt',
          auth: 'admin:smartReception.map',
          icon: 'biz-icon-i-web-l-znjd'
        }
      ]
    },
    {
      title: '日志管理',
      path: '/union/log',
      auth: 'admin:log',
      icon: 'biz-icon-i-web-l-jksj',
      children: [
        {
          title: '系统日志',
          path: '/log-mgmt',
          icon: 'biz-icon-i-web-l-jksj',
          auth: 'admin:log.system'
        },
        {
          title: '接口日志',
          path: '/interface',
          icon: 'biz-icon-i-web-l-jksj',
          auth: 'admin:log.interface'
        },
        {
          title: '用户操作日志',
          path: '/user-operat-log',
          icon: 'biz-icon-i-web-l-jksj',
          auth: 'admin:log.memberOperato'
        },
        {
          title: '管理员操作日志',
          path: '/admin-operate-log',
          icon: 'biz-icon-i-web-l-jksj',
          auth: 'admin:log.adminOperato'
        },
        {
          title: '终端日志',
          path: '/terminal-log',
          icon: 'biz-icon-i-web-l-jksj',
          auth: 'admin:log.terminal'
        }
      ]
    },
    {
      path: '/union/statistics-analysis',
      title: '数据洞察',
      icon: 'biz-icon-i-web-l-tjfx',
      auth: 'admin:operatorStatistics',
      children: [

        {
          title: '店铺群分析',
          path: '/shop-analysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:operatorStatistics.storegroup'
        },
        {
          title: '单店铺分析',
          path: '/single-shop-analysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:operatorStatistics.store'
        },
        {
          title: '到店及接待统计',
          path: '/smart-to-shop',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:smartReception.statistics'
        },
        {
          title: '接待统计',
          path: '/reception-static',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Reception.statistics'
        },
        {
          title: '接待详情统计',
          icon: 'biz-icon-i-web-l-tjfx',
          path: '/reception-static/reception-static-detail',
          auth: 'admin:Receptiondetails.statistics'
        }
      ]
    }
  ],
  // 车辆
  car: [
    {
      title: '车辆管理',
      path: '/car/vehicle-mgmt',
      auth: 'admin:car.manage',
      icon: 'biz-icon-i-web-l-clgl',
      children: [
        {
          path: '/vehicle',
          title: '车辆信息',
          icon: 'biz-icon-i-web-l-clgl',
          auth: 'admin:car'
        },
        {
          path: '/vehicle-complaint',
          title: '车辆申诉',
          icon: 'biz-icon-i-web-l-clgl',
          auth: 'admin:carAppeal'
        },
        {
          path: '/fleet',
          title: '运营车队',
          icon: 'biz-icon-i-web-l-clgl',
          auth: 'caradmin:operateFleet'
        },
        {
          path: '/statistics-analysis',
          title: '车队数据洞察',
          auth: 'admin:operateFleet.statistics',
          children: [
            {
              path: '/marketing-cars',
              title: '运营车辆',
              icon: 'biz-icon-i-web-l-clgl',
              auth: ''
            },
            {
              path: '/car-state',
              title: '车辆状态',
              icon: 'biz-icon-i-web-l-clgl',
              auth: ''
            },
            {
              path: '/abnormal',
              title: '异常用车',
              icon: 'biz-icon-i-web-l-clgl',
              auth: ''
            },
            {
              path: '/car-speed',
              title: '车辆速度',
              icon: 'biz-icon-i-web-l-clgl',
              auth: ''
            },
            {
              path: '/payment',
              title: '费用分析',
              icon: 'biz-icon-i-web-l-clgl',
              auth: ''
            }
          ]
        }
      ]
    },
    {
      title: '通讯管理',
      path: '/car/communication-mgmt',
      auth: 'admin:operateCard.manage',
      icon: 'biz-icon-tongxunguanli',
      children: [
        {
          path: '/operator',
          title: '运营商',
          icon: 'biz-icon-tongxunguanli',
          auth: 'admin:operateCard.operator'
        },
        {
          path: '/card',
          title: '通讯卡',
          icon: 'biz-icon-tongxunguanli',
          auth: 'caradmin:operateCard'
        },
        {
          path: '/record',
          title: '充值记录',
          icon: 'biz-icon-tongxunguanli',
          auth: 'admin:simRecharge'
        }
      ]
    },
    {
      title: '终端管理',
      path: '/car/terminal-mgmt',
      auth: 'caradmin:operateDevice',
      icon: 'biz-icon-i-web-l-zdgl',
      children: [
        {
          path: '/terminal-type',
          title: '终端配置',
          icon: 'biz-icon-i-web-l-zdgl',
          auth: 'caradmin:operateDevice.category'
        },
        {
          path: '/terminal-all',
          title: '终端信息',
          icon: 'biz-icon-i-web-l-zdgl',
          auth: 'caradmin:operateDevice.manage'
        }
      ]
    },
    {
      path: '/car/statistics-analysis',
      title: '数据洞察',
      icon: 'biz-icon-i-web-l-tjfx',
      auth: 'admin:operatorStatistics',
      children: [
        {
          path: '/vehicleStatic',
          title: '车辆',
          auth: 'admin:operatorStatistics.car',
          children: [
            {
              title: '基本信息',
              icon: 'biz-icon-i-web-l-tjfx',
              path: '/generalViewAnalysis',
              auth: ''
            },
            {
              title: '车况',
              icon: 'biz-icon-i-web-l-tjfx',
              path: '/conditionViewAnalysis',
              auth: ''
            },
            {
              title: '驾驶行为',
              icon: 'biz-icon-i-web-l-tjfx',
              path: '/actionViewAnalysis',
              auth: ''
            },
            {
              title: '单车辆',
              icon: 'biz-icon-i-web-l-tjfx',
              path: '/singleViewAnalysis',
              auth: ''
            }
          ]
        },
        {
          path: '/operator',
          title: '运营商',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:operatorStatistics.company'
        },
        {
          path: '/card',
          title: '通讯卡',
          auth: 'admin:simStatistics',
          children: [
            {
              title: '通讯卡',
              path: '/card',
              icon: 'biz-icon-i-web-l-tjfx',
              auth: ''
            },
            {
              title: '通讯套餐',
              icon: 'biz-icon-i-web-l-tjfx',
              path: '/package',
              auth: ''
            }
          ]
        },
        {
          path: '/terminal-statistics',
          title: '终端',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:terminalStatistics'
        }
      ]
    }
  ],
  // 运营
  operating: [
    {
      title: '商品管理',
      path: '/operating/commodity-mgmt',
      auth: 'admin:shop.product',
      icon: 'biz-icon-i-web-l-sp',
      children: [
        {
          title: '商品信息',
          path: '/commodity',
          icon: 'biz-icon-i-web-l-sp',
          auth: 'admin:product'
        },
        {
          title: 'V豆商城',
          path: '/vbean',
          icon: 'biz-icon-i-web-l-sp',
          auth: 'admin:product.exchange'
        },
        // 店铺级别
        {
          title: '品牌信息',
          path: '/brand',
          icon: 'biz-icon-i-web-l-sp',
          auth: 'admin:shopBrand'
        },
        // 平台级别
        // {
        //   title: '品牌信息',
        //   path: '/brand',
        //   auth: 'admin:brand'
        // },
        {
          title: '商品分类',
          path: '/category',
          icon: 'biz-icon-i-web-l-sp',
          auth: 'admin:productCategory'
        }
      ]
    },
    {
      title: '订单管理',
      path: '/operating/product',
      auth: 'admin:order.order',
      icon: 'biz-icon-i-web-l-dd',
      children: [
        {
          title: '整车订单',
          path: '/car',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carOrder'
        },
        {
          title: '车品订单',
          path: '/product',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carProductOrder'
        },
        {
          title: '普通产品',
          path: '/general',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:order'
        },
        {
          title: '普通服务',
          path: '/service',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:normalService'
        },
        {
          title: '一键救援',
          path: '/rescue',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:rescue'
        },
        {
          title: '预约体验',
          path: '/ride',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:testAppointment'
        },
        {
          title: '预约置换',
          path: '/replace',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:replacementAppointment'
        },
        {
          title: '贷款购车',
          path: '/loan',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carloan'
        },
        {
          title: '优惠券订单',
          path: '/couponOrder',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:couponOrder'
        },
        {
          title: '金融订单',
          path: '/finance/finance/finance',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:financeOrder'
        },
        {
          title: '保险订单',
          path: '/insurance/insurance/insurance',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:insuranceOrder'
        },
        {
          title: '储值订单',
          path: '/store/store/deposit',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:deposit'
        }
      ]
    },
    {
      title: '物流发货',
      path: '/operating/logistics',
      auth: 'admin:order.logistics',
      icon: 'biz-icon-i-web-l-wl'
    },
    {
      title: '售后退款',
      icon: 'biz-icon-i-web-l-cw',
      path: '/operating/finance/refund',
      auth: 'admin:refunds'
    },
    {
      title: '数据洞察',
      icon: 'biz-icon-i-web-l-tjfx',
      path: '/operating/product-statistics',
      auth: 'admin:shopStatistics',
      children: [
        {
          title: '运营概况',
          path: '/generalViewAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:order.statistics.summary'
        },
        {
          title: '下单人群分析',
          path: '/OrderPopulationAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:order.statistics.buyer'
        },
        {
          title: '运营月报',
          path: '/report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.ecommerce'
        },
        {
          title: '品类分析',
          path: '/productCategoryAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:order.statistics.catagory'
        },
        {
          title: '单品分析',
          path: '/singleProductAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:order.statistics.product'
        }
      ]
    }
  ],
  // 客服
  service: [
    {
      title: '平台客服',
      path: '/service/service-mgmt/online-response-sys',
      auth: 'admin:service.service.plateForm',
      icon: 'biz-icon-i-web-l-kffw'
    },
    {
      title: '人工客服',
      path: '/service',
      auth: 'admin:service.service',
      icon: 'biz-icon-i-web-l-kffw',
      children: [
        {
          // target: '_blank',
          title: '在线应答',
          path: '/service-mgmt/online-response',
          icon: 'biz-icon-i-web-l-kffw',
          auth: 'admin:onlineReply'
        },
        {
          title: '客服人员',
          path: '/service-mgmt/member',
          icon: 'biz-icon-i-web-l-kffw',
          auth: 'admin:customerServiceMember'
        },
        {
          title: '客服群组',
          path: '/service-mgmt/group',
          icon: 'biz-icon-i-web-l-kffw',
          auth: 'admin:group'
        },
        {
          title: '会话质检',
          path: '/service-mgmt/quality',
          icon: 'biz-icon-i-web-l-kffw',
          auth: 'admin:qualitySampling'
        },
        {
          title: '黑名单',
          path: '/service-mgmt/black-list',
          icon: 'biz-icon-i-web-l-kffw',
          auth: 'admin:blacklistCheck'
        },
        {
          title: '知识库',
          path: '/service-mgmt/konwledge-base',
          icon: 'biz-icon-i-web-l-kffw',
          auth: 'admin:knowledgeBase'
        }
        // {
        //   title: '工时管理',
        //   path: '/scheduling',
        //   auth: 'admin:customerServiceScheduling'
        // }
      ]
    },
    {
      title: '工单管理',
      path: '/service/worksheet',
      auth: 'admin:customerServiceScheduling',
      icon: 'biz-icon-i-web-l-gd'
    },
    {
      title: '数据洞察',
      path: '/service/statistics-analysis',
      auth: 'admin:accessStatistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '客服分析',
          path: '/generalViewAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:accessStatistics.service'
        },
        {
          title: '客服月报',
          path: '/report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.customerservice'
        }
      ]
    }
  ],
  // 营销
  marketing: [
    {
      title: '营销管理',
      path: '/marketing/marketing-mgmt',
      auth: 'admin:activity.manage',
      icon: 'biz-icon-i-web-l-yhgl',
      children: [
        {
          title: '营销活动',
          path: '/activity',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:activity'
        },
        {
          title: '促销活动',
          path: '/promotion',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:promotion'
        },
        {
          title: '线下活动',
          path: '/event',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:offlineActivity'
        },
        {
          title: '软文宣传',
          path: '/shop-publicity',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:article'
        },
        {
          title: '软文宣传',
          path: '/shop-publicity-sys',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:article.platform'
        },
        {
          title: '商品推广',
          path: '/product',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:articleProduct'
        }
      ]
    },
    {
      title: '促销管理',
      path: '/marketing/marketing-mgmt',
      auth: 'admin:promotion.platform',
      icon: 'biz-icon-i-web-l-yhgl',
      children: [
        {
          title: '促销活动',
          path: '/promotion/admin',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:promotion.platform'
        }
      ]
    },
    {
      title: '模板管理',
      path: '/marketing/template',
      auth: 'admin:marketingTemplate',
      icon: 'biz-icon-huodongmobanguanli',
      children: [
        {
          title: '活动模版',
          path: '/activity',
          icon: 'biz-icon-huodongmobanguanli',
          auth: 'admin:activityTemplate'
        },
        {
          title: '关键词模板',
          path: '/marketing-template/key-word',
          auth: 'admin:keywordTemplate',
          icon: 'biz-icon-huodongmobanguanli'
        },
        {
          title: '素材模板',
          path: '/material-template',
          auth: 'admin:materialTemplate',
          icon: 'biz-icon-huodongmobanguanli'
        }
      ]
    },
    {
      title: '推送管理',
      path: '/marketing/recommend',
      auth: 'admin:recommend.shop',
      icon: 'biz-icon-i-web-l-fw',
      children: [
        {
          title: 'V服-服务推荐',
          path: '/vfu/service-recommend',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.recommend'
        },
        {
          title: 'V服-爱车频道',
          path: '/vfu/icar-channel',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.article'
        },
        {
          title: 'V服-APP启动',
          path: '/vfu/app-startup',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.app'
        },
        {
          title: 'V服-近期活动',
          path: '/vfu/marketing',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.activity'
        },
        {
          title: 'V服-最新促销',
          path: '/vfu/promotion',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.promotion'
        },
        {
          title: 'V服-V商宣传',
          path: '/vfu/v-publicity',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.articleAdvertise'
        },
        {
          title: 'V服-领优惠券',
          path: '/vfu/coupon',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.coupon'
        },
        {
          title: '微信-公众号',
          path: '/vfu/wechat/wechat',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:articleWechat'
        },
        {
          title: '头条-信息流',
          path: '/headline/head-line',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:headlineflow.shop'
        },
        {
          title: '百度-信息流',
          path: '/baidu/baidu-info',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:baiduflow.shop'
        },
        {
          title: '百度-搜索推广',
          path: '/baidu/baidu-search',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:baidusearch.shop'
        }]
    },
    {
      title: '推送管理',
      path: '/marketing/recommend',
      auth: 'admin:recommend.platform',
      icon: 'biz-icon-i-web-l-fw',
      children: [
        {
          title: 'V服-服务推荐',
          path: '/vfu/service-recommend',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.recommend.platform'
        },
        {
          title: 'V服-爱车频道',
          path: '/vfu/icar-channel',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.article.platform'
        },
        {
          title: 'V服-APP启动',
          path: '/vfu/app-startup',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.app.platform'
        },
        {
          title: 'V服-近期活动',
          path: '/vfu/marketing',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.activity.platform'
        },
        {
          title: 'V服-最新促销',
          path: '/vfu/promotion',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.promotion.platform'
        },
        {
          title: 'V服-V商宣传',
          path: '/vfu/v-publicity',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.articleAdvertise.platform'
        },
        {
          title: 'V服-领优惠券',
          path: '/vfu/coupon',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:recommend.coupon.platform'
        },
        {
          title: '微信-公众号',
          path: '/vfu/wechat',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:articleWechat.platform'
        },
        {
          title: '头条-信息流',
          path: '/headline/head-line',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:headline.platform'
        },
        {
          title: '百度-信息流',
          path: '/baidu/baidu-info',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:baiduflow.platform'
        },
        {
          title: '百度-搜索推广',
          path: '/baidu/baidu-search',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:baidusearch.platform'
        }]
    },
    {
      title: '数据洞察',
      path: '/marketing/statistics-analysis',
      auth: 'admin:activityStatistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '营销分析',
          path: '/marketing-analysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:activityStatistics.market'
        },
        {
          title: '渠道分析',
          path: '/channel-analysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:activityStatistics.channel'
        },
        {
          title: '粉丝分析',
          path: '/fans-analysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:activityStatistics.fan'
        },
        {
          title: '单内容分析',
          path: '/single',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:activityStatistics.fan'
        },
        {
          title: '营销月报',
          path: '/report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.marketing'
        }
      ]
    }
  ],
  // 会员
  member: [
    {
      title: '会员管理',
      path: '/member',
      auth: 'admin:member',
      icon: 'biz-icon-i-web-l-hjgl',
      // 把/member作为导航页
      children: [
        {
          title: '会籍信息',
          path: '/membership-mgmt',
          icon: 'biz-icon-i-web-l-hjgl',
          auth: 'admin:member.list'
        },
        {
          title: '会员资产',
          path: '/memberassets-mgmt',
          icon: 'biz-icon-i-web-l-hjgl',
          auth: 'admin:member.assets'
        }
      ]
    },
    {
      title: '会员卡管理',
      path: '/member/member-card',
      auth: 'admin:memberCard.manage',
      icon: 'biz-icon-i-web-l-hyk',
      // 把/member作为导航页
      children: [
        {
          title: '会员卡发放',
          path: '/member-card/true',
          icon: 'biz-icon-i-web-l-hyk',
          auth: 'admin:memberCard'
        },
        {
          title: '会员卡制式',
          path: '/member/member-card-template/true',
          icon: 'biz-icon-i-web-l-hyk',
          auth: 'admin:memberCardTemplate'
        }
      ]
    },
    {
      // 这里是为了保证和上面path为空的会员卡不冲突，设置为/member/member-rights-mgmt，实际redirect到卡券管理
      title: '会员权益',
      path: '/member/member-rights-mgmt',
      auth: 'admin:member.memberBenefits',
      icon: 'biz-icon-i-ec-online-hyqy',
      children: [
        {
          title: '卡券信息',
          path: '/coupon-mgmt',
          icon: 'biz-icon-i-ec-online-hyqy',
          auth: 'admin:member.memberBenefits.coupon'
        },
        {
          title: '权益信息',
          path: '/rights-mgmt',
          icon: 'biz-icon-i-ec-online-hyqy',
          auth: 'admin:member.memberBenefits.benefits'
        }
      ]
    },
    {
      title: '会员关怀',
      path: '/member/member-care-mgmt/care',
      auth: 'admin:member.memberCare',
      icon: 'biz-icon-i-ec-online-hygh'
    },
    {
      title: '关怀模板',
      path: '/member/member-care-mgmt/template',
      auth: 'admin:member.memberCareTemplate',
      icon: 'biz-icon-i-ec-online-hygh'
    },
    {
      title: '社区管理',
      path: '/member/motor-club',
      auth: 'admin:fleet.manage',
      icon: 'biz-icon-i-web-l-cysq',
      children: [
        {
          title: '车友会',
          path: '/fleetMember',
          icon: 'biz-icon-i-web-l-cysq',
          auth: 'admin:fleet'
          // children: [
          //   {
          //     trees: [],
          //     auth: ''
          //   }
          // ]
        },
        {
          title: '动态发布',
          path: '/dynamic',
          icon: 'biz-icon-i-web-l-cysq',
          auth: 'admin:fleetSpace'
        },
        {
          title: '问答发布',
          icon: 'biz-icon-i-web-l-cysq',
          path: '/question-answer-release',
          auth: 'admin:space.topic'
        },
        {
          title: '文章发布',
          path: '/article-publish',
          icon: 'biz-icon-i-web-l-cysq',
          auth: 'admin:article'
        },
        {
          title: '活动发布',
          path: '/activity',
          icon: 'biz-icon-i-web-l-cysq',
          auth: 'admin:fleetActivity'
        }
      ]
    },
    {
      title: '数据洞察',
      path: '/member/statistics-analysis',
      auth: 'admin:member.statistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '会员',
          path: '/user-portrait',
          auth: 'admin:member.statistics.member',
          children: [
            {
              title: '会员群画像',
              path: '/member-portrait',
              icon: 'biz-icon-i-web-l-tjfx',
              auth: 'admin:member.statistics.group'
            },
            {
              title: '单会员画像',
              path: '/single-member-portrait',
              icon: 'biz-icon-i-web-l-tjfx',
              auth: 'admin:member.statistics.singer'
            }
          ]
        },
        {
          title: '车友会',
          path: '/motorist/generalViewAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:member.statistics.fleet'
        },
        {
          title: '内容分析',
          path: '/content/generalViewAnalysis',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:member.statistics.content'
        },
        {
          title: '会员卡分析',
          path: '/member/member-card-static',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:member.statistics.card'
        },
        {
          title: '会员月报',
          path: '/member/member-report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.member'
        },
        {
          title: '会员卡月报',
          path: '/member/member-card-report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.membercard'
        }
      ]
    }
  ],
  // 消息
  message: [
    {
      title: '车辆消息',
      path: '/message/car',
      auth: 'admin:carMsg',
      icon: 'biz-icon-i-web-l-clxx',
      children: [
        {
          title: '车辆消息',
          path: '/car',
          icon: 'biz-icon-i-web-l-clxx',
          auth: 'admin:carMsg.car'
        },
        {
          title: '事故和故障',
          path: '/car/accident',
          icon: 'biz-icon-i-web-l-clxx',
          auth: 'admin:carMsg.accidents'
        }
      ]
    },
    {
      title: '服务消息',
      path: '/message/service',
      auth: 'admin:serviceMsg',
      icon: 'biz-icon-i-web-l-fwxx',
      children: [
        {
          title: '服务消息',
          path: '/service',
          icon: 'biz-icon-i-web-l-fwxx',
          auth: 'admin:serviceMsg.order'
        },
        {
          title: '维保消息',
          path: '/service/maintenance',
          icon: 'biz-icon-i-web-l-fwxx',
          auth: 'admin:serviceMsg.maintain'
        }
      ]
    },
    {
      title: '系统消息',
      path: '/message/message-mgmt?category=system',
      auth: 'admin:systemMsg',
      icon: 'biz-icon-i-web-l-xtxx'
    },
    {
      title: '社区消息',
      path: '/message/message-mgmt?category=community',
      auth: 'admin:communityMsg',
      icon: 'biz-icon-i-web-l-sqxx'
    },
    {
      title: '待办消息',
      path: '/message/message-mgmt-pending?category=pendingRemind&state=1',
      auth: 'admin:pendingdealMsg',
      icon: 'biz-icon-i-web-l-dbxx'
    },
    {
      title: '管理员消息设置',
      path: '/message/settings',
      auth: 'admin:message.personalMsgSetting',
      icon: 'biz-icon-i-web-l-grxxsz'
    },
    {
      title: '店铺消息设置',
      path: '/message/faultAlarm/car/alarm',
      auth: 'admin:message.storeMsgSetting',
      icon: 'biz-icon-i-web-l-dpxxsz'
    }
  ],
  // 销售
  sales: [
    {
      title: '金融',
      path: '/sales',
      auth: 'admin:sale.financial',
      icon: 'biz-icon-jinrong',
      children: [
        {
          title: '金融方案',
          path: '/finance/plan',
          icon: 'biz-icon-jinrong',
          auth: 'admin:sale.financialPlan'
        }
      ]
    },
    // {
    //   title: '金融管理',
    //   path: '/sales/financeMgmt',
    //   auth: 'admin:finnancial',
    //   icon: 'biz-icon-jinrong',
    //   children: [
    //     {
    //       title: '金融机构',
    //       path: '/company/mgmt',
    //       auth: 'admin:finnancialinstitution'
    //     }
    //   ]
    // },
    // 店铺级
    {
      title: '金融产品',
      path: '/sales/financeProduct',
      auth: 'admin:finnancialProduct',
      icon: 'biz-icon-jinrong',
      children: [
        {
          title: '产品分类',
          path: '/category',
          icon: 'biz-icon-jinrong',
          auth: 'admin:finnancialcategory'
        },
        {
          title: '金融方案',
          path: '/finance',
          icon: 'biz-icon-jinrong',
          auth: 'admin:finnancialPlan'
        },
        {
          title: '保险方案',
          path: '/insurance',
          icon: 'biz-icon-jinrong',
          auth: 'admin:insurancePlan'
        }
      ]
    },
    // 平台级
    {
      title: '金融产品',
      path: '/sales/financeSysProduct',
      auth: 'admin:system.finnancialProduct',
      icon: 'biz-icon-jinrong',
      children: [
        {
          title: '产品分类',
          path: '/category/sys',
          icon: 'biz-icon-jinrong',
          auth: 'admin:system.finnancialcategory'
        },
        {
          title: '金融方案',
          path: '/finance/sys',
          icon: 'biz-icon-jinrong',
          auth: 'admin:system.finnancialPlan'
        },
        {
          title: '保险方案',
          path: '/insurance/sys',
          icon: 'biz-icon-jinrong',
          auth: 'admin:system.insurancePlan'
        }
      ]
    },
    {
      title: '潜客管理',
      path: '/sales/potential/potential',
      auth: 'admin:potential',
      icon: 'biz-icon-qiankeguanli'
    },
    {
      title: '体验商品',
      path: '/sales/testDrive/testDrive',
      auth: 'admin:testdrive',
      icon: 'biz-icon-i-web-sjgl' // TODO icon erro
    },
    {
      title: '订单管理',
      path: '/sales/product',
      auth: 'admin:order.sale',
      icon: 'biz-icon-i-web-l-dd',
      children: [
        {
          title: '整车订单',
          path: '/car',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carOrder.sale'
        },
        {
          title: '车品订单',
          path: '/product',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carProductOrder.sale'
        },
        {
          title: '普通产品',
          path: '/general',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:commonorder.sale'
        },
        {
          title: '预约体验',
          path: '/ride',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:testAppointment.sale'
        },
        {
          title: '预约置换',
          path: '/replace',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:replacementAppointment.sale'
        },
        {
          title: '贷款购车',
          path: '/loan',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carloan.sale'
        },
        {
          title: '金融订单',
          path: '/finance/finance/finance',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:sale.financeOrder'
        },
        {
          title: '保险订单',
          path: '/insurance/insurance/insurance',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:sale.insuranceOrder'
        }
      ]
    },
    {
      title: '数据洞察',
      path: '/sales/statistics-analysis',
      icon: 'biz-icon-i-web-l-tjfx',
      auth: 'admin:potential.statistics',
      children: [
        {
          title: '潜客分析',
          path: '/general',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:potentialStatistics'
        },
        {
          title: '销售分析',
          path: '/sale',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:potential.statistics'
        },
        {
          title: '销售月报',
          path: '/saleReport',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.sale'
        },
        {
          title: '潜客月报',
          path: '/potentialReport',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.potential'
        }
      ]
    }
  ],
  // 售后
  'after-sale': [
    {
      title: '维修保养',
      path: '/after-sale',
      auth: 'admin:aftersale.maintainAndRepair',
      icon: 'biz-icon-i-web-l-wxby',
      children: [
        {
          title: '维保记录',
          path: '/maintenance',
          icon: 'biz-icon-i-web-l-wxby',
          auth: 'admin:aftersale.maintain'
        },
        {
          title: '预约记录',
          path: '/appointment',
          icon: 'biz-icon-i-web-l-wxby',
          auth: 'admin:aftersale.appointment'
        },
        {
          title: '服务手册',
          path: '/booklet',
          icon: 'biz-icon-i-web-l-wxby',
          auth: 'admin:aftersale.booklet'
        }
      ]
    },
    {
      title: '订单',
      path: '/after-sale/product',
      auth: 'admin:order.aftersale',
      icon: 'biz-icon-i-web-l-dd',
      children: [
        {
          title: '车品订单',
          path: '/product',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:carProductOrder.aftersale'
        },
        {
          title: '普通产品',
          path: '/general',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:commonorder.aftersale'
        },
        {
          title: '普通服务',
          path: '/service',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:normalService.aftersale'
        },
        {
          title: '一键救援',
          path: '/rescue',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:rescue.aftersale'
        },
        {
          title: '优惠券订单',
          path: '/couponOrder',
          icon: 'biz-icon-i-web-l-dd',
          auth: 'admin:couponOrder.aftersale'
        }
      ]
    },
    {
      title: '救援机构',
      icon: 'biz-icon-i-web-l-hzjyjg',
      path: '/after-sale/service/rescue',
      auth: 'admin:cooperaRescueOrg'
    },
    {
      title: '数据洞察',
      path: '/after-sale/statistics-analysis',
      auth: 'admin:aftersale.statistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '售后统计',
          path: '/aftersale',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:aftersale.statistics.aftersale'
        },
        {
          title: '售后月报',
          path: '/report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:statistics.mouthreport.aftersale'
        }
      ]
    }
  ],
  // 财务
  finance: [
    {
      title: '收款管理',
      path: '/finance/receipt-mgmt',
      auth: 'admin:finance.payment',
      icon: 'biz-icon-i-web-l-skgl'
    },
    {
      title: '付款管理',
      path: '/finance/payment-mgmt',
      auth: 'admin:finance.refunds',
      icon: 'biz-icon-i-web-l-fkgl'
    },
    {
      title: '供应商对账',
      path: '/finance/supplier-check-acount',
      auth: 'admin:finance.reconciliation',
      icon: 'biz-icon-i-web-l-gysdz'
    },
    {
      title: '代理商对账',
      path: '/finance/agent-check-acount',
      auth: 'admin:finance.reconciliation.agent',
      icon: 'biz-icon-i-web-l-dlsdz'
    },
    {
      title: '发票管理',
      path: '/finance/invoice-mgmt',
      auth: 'admin:finance.invoice',
      icon: 'biz-icon-i-web-l-gd'
    },
    {
      title: '数据洞察',
      path: '/finance/statistics-analysis',
      auth: 'admin:finance.invoice',
      icon: 'biz-icon-i-web-l-tjfx'
    }
  ],
  // 商城
  // hypermarket: [
  //   {
  //     title: '商城',
  //     path: '/hypermarket',
  //     auth: 'admin:shoppingmall.sub',
  //     icon: 'biz-icon-i-web-l-cggl'
  //   }
  // ],
  // 进销存
  invoicing: [
    {
      title: '采购管理',
      path: '/invoicing',
      auth: 'admin:purchase',
      icon: 'biz-icon-i-web-l-cggl',
      children: [
        {
          title: '采购申请',
          path: '/purchase-apply',
          icon: 'biz-icon-i-web-l-cggl',
          auth: 'admin:purchaseApplication'
        },
        {
          title: '采购订单',
          path: '/purchase-order-new',
          icon: 'biz-icon-i-web-l-cggl',
          auth: 'admin:purchaseOrder'
        },
        {
          title: '采购统计',
          path: '/purchase-statistics',
          icon: 'biz-icon-i-web-l-cggl',
          auth: 'admin:purchaseStatistic'
        }
      ]
    },
    {
      title: '代理商采购管理',
      path: '/invoicing',
      auth: 'admin:purchase.agent',
      icon: 'biz-icon-i-web-l-cggl',
      children: [
        {
          title: '采购申请',
          path: '/agency/agency-purchase-apply',
          auth: 'admin:purchaseApplication.agent',
          icon: 'biz-icon-i-web-l-cggl'
        },
        {
          title: '采购订单',
          path: '/agency/agency-purchase-order',
          auth: 'admin:purchaseOrder.agent',
          icon: 'biz-icon-i-web-l-dlscgdd'
        },
        {
          title: '采购统计',
          path: '/agency/agency-purchase-static',
          auth: 'admin:purchaseStatistic.agent',
          icon: 'biz-icon-i-web-l-dlscgdd'
        }]
    },
    {
      title: '销售管理',
      path: '/invoicing/sale',
      auth: 'admin:purchaseSaleStorage.sale',
      icon: 'biz-icon-i-web-l-xsgl',
      children: [
        {
          title: '销售申请',
          path: '/sale-apply',
          icon: 'biz-icon-i-web-l-xsgl',
          auth: 'admin:saleApplication'
        },
        {
          title: '销售订单',
          path: '/sale-order',
          icon: 'biz-icon-i-web-l-xsgl',
          auth: 'admin:saleOrder'
        },
        {
          title: '销售统计',
          path: '/sale-static',
          icon: 'biz-icon-i-web-l-xsgl',
          auth: 'admin:saleStatistic'
        }
      ]
    },
    {
      title: '供应商销售管理',
      path: '/invoicing',
      auth: 'admin:purchaseSaleStorage.sale.supplier',
      icon: 'biz-icon-i-web-l-xsgl',
      children: [
        {
          title: '销售订单',
          path: '/supplier/order-supplier',
          auth: 'admin:saleOrder.supplier',
          icon: 'biz-icon-i-web-l-gysxsdd'
        },
        {
          title: '销售统计',
          path: '/supplier/static-supplier',
          auth: 'admin:saleStatistic.supplier',
          icon: 'biz-icon-i-web-l-gysxsdd'
        }]
    },
    {
      title: '代理商销售管理',
      path: '/invoicing/sale-agent',
      auth: 'admin:purchaseSaleStorage.sale.agent',
      icon: 'biz-icon-i-web-l-xsgl',
      children: [
        {
          title: '销售订单',
          path: '/agency-sale-order',
          auth: 'admin:saleOrder.agent',
          icon: 'biz-icon-i-web-l-gysxsdd'
        },
        {
          title: '销售统计',
          path: '/static-agency',
          auth: 'admin:saleStatistic.agent',
          icon: 'biz-icon-i-web-l-gysxsdd'
        }]
    },
    {
      title: '供应商商品管理',
      path: '/invoicing/supplier/product',
      auth: 'admin:product.supplier',
      icon: 'biz-icon-i-web-l-jcsj',
      children: [
        {
          title: '商品管理',
          path: '/product-supplier',
          auth: 'admin:product.supplier',
          icon: 'biz-icon-i-web-l-gysspgl'
        }]
    },
    {
      title: '仓库管理',
      path: '/invoicing/store-house-mgmt',
      auth: 'admin:storage',
      icon: 'biz-icon-i-web-l-ckgl',
      children: [
        {
          title: '出库管理',
          path: '/depot-out-mgmt',
          icon: 'biz-icon-i-web-l-ckgl',
          auth: 'admin:export'
        },
        {
          title: '入库管理',
          path: '/depot-in-mgmt',
          icon: 'biz-icon-i-web-l-ckgl',
          auth: 'admin:inport'
        },
        {
          title: '调拨管理',
          path: '/allotted-mgmt',
          icon: 'biz-icon-i-web-l-ckgl',
          auth: 'admin:storage.transfer'
        },
        {
          title: '盘点',
          path: '/inventory',
          icon: 'biz-icon-i-web-l-ckgl',
          auth: 'admin:check'
        },
        {
          title: '条码管理',
          path: '/bar-code-mgmt',
          icon: 'biz-icon-i-web-l-ckgl',
          auth: 'admin:storage.barCode'
        },
        {
          title: '库存统计',
          path: '/stock-statistics',
          icon: 'biz-icon-i-web-l-ckgl',
          auth: 'admin:storageStatistic'
        }
      ]
    },
    {
      title: '基础数据',
      path: '/invoicing/base-data',
      auth: 'admin:basicData',
      icon: 'biz-icon-i-web-l-jcsj',
      children: [
        {
          title: '商品',
          path: '/product',
          icon: 'biz-icon-i-web-l-jcsj',
          auth: 'admin:PurchaseSaleStorage.product'
        },
        // 店铺级别
        {
          title: '品牌',
          path: '/brand',
          icon: 'biz-icon-i-web-l-jcsj',
          auth: 'admin:PurchaseSaleStorage.brand'
        },
        {
          title: '分类',
          path: '/category',
          icon: 'biz-icon-i-web-l-jcsj',
          auth: 'admin:PurchaseSaleStorage.productCategory'
        },
        {
          title: '仓库',
          path: '/store-house',
          icon: 'biz-icon-i-web-l-jcsj',
          auth: 'admin:Warehouse'
        },
        {
          title: '供应商',
          path: '/supplier',
          icon: 'biz-icon-i-web-l-jcsj',
          auth: 'admin:Supplier'
        },
        {
          title: '代理商',
          path: '/agent',
          icon: 'biz-icon-i-web-l-jcsj',
          auth: 'admin:agent'
        }
      ]
    },
    {
      title: '流程设置',
      path: '/invoicing/process-setting',
      auth: 'admin:setting.processSettings',
      icon: 'biz-icon-i-web-l-xtsj',
      children: [
        {
          title: '销售流程设置',
          path: '/sale-setting',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: ''
        },
        {
          title: '采购流程设置',
          path: '/purchase-setting',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: ''
        },
        {
          title: '发货流程设置',
          path: '/shipping-setting',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: ''
        }
      ]
    },
    {
      title: '数据洞察',
      path: '/invoicing/statistics-analysis',
      auth: 'admin:Inventory.Statistic',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '采购',
          path: '/purchase',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Statistic.purchase'
        },
        {
          title: '销售',
          path: '/sale',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Statistic.sale'
        },
        {
          title: '仓库',
          path: '/store',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Statistic.warehouse'
        },
        {
          title: '单品',
          path: '/single',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Statistic.product'
        },
        {
          title: '财务',
          path: '/finance',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Statistic.finance'
        },
        {
          title: '进销存月报',
          path: '/report',
          icon: 'biz-icon-i-web-l-tjfx',
          auth: 'admin:Statistic.mouthreport'
        }
      ]
    }
  ],
  // 系统
  system: [
    {
      title: '系统数据',
      path: '/system/setting',
      auth: 'admin:system.setting',
      icon: 'biz-icon-i-web-l-xtsj',
      children: [
        {
          title: '基本设置',
          path: '/setting-mgmt',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:system.setting.base'
        },
        {
          title: '显示设置',
          path: '/display-mgmt',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:system.setting.view'
        },
        {
          title: '注册与安全',
          path: '/registrationAndSecurity-mgmt',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:system.setting.registerAndSafe'
        },
        {
          title: '邮件设置',
          path: '/email-mgmt',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:system.setting.mail'
        },
        {
          title: '存储插件',
          path: '/storage-plugin',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:storagePlugin'
        },
        {
          title: '地区管理',
          path: '/area-mgmt',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:area'
        },
        {
          title: '推荐配置',
          path: '/recommend-mgmt',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:system.setting.recommendSetting'
        },
        {
          title: '功能定义',
          path: '/function-defination',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:system.setting.base'
        },
        {
          title: '油价数据',
          path: '/oil-price',
          icon: 'biz-icon-i-web-l-xtsj',
          auth: 'admin:oilPrice'
        }
      ]
    },
    {
      title: '联盟数据',
      path: '/system/product',
      auth: 'admin:system.operato',
      icon: 'biz-icon-i-web-l-ds',
      children: [
        {
          title: '店铺账户',
          path: '/platform-account',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:system.shopaccount.platform'
        },
        {
          title: '支付方式',
          path: '/payment-method',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:paymentMethod'
        },
        {
          title: '配送方式',
          path: '/shipping-method',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:shippingMethod'
        },
        // 平台
        {
          title: '物流公司',
          path: '/delivery',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:deliveryCorp'
        },
        {
          title: '公众号链接',
          path: '/wechat-url',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:wechatMenuPath'
        },
        {
          title: '承诺图标模版',
          path: '/icon-template',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:promiseIconTemplate'
        },
        {
          title: '小程序配置',
          path: '/mini-program',
          icon: 'biz-icon-i-web-l-ds',
          auth: 'admin:miniProgram'
        }
      ]
    },
    {
      title: '车辆客服',
      path: '/system/service',
      auth: 'admin:vehicleservice',
      icon: 'biz-icon-i-web-l-fw',
      children: [
        {
          title: '车辆数据',
          path: '/base-data',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin:baseData'
        },
        {
          title: '客服知识库',
          path: '/knowledge',
          auth: 'admin:knowledgeBase',
          children: [
            {
              title: '问答管理',
              path: '/qa-mgmt',
              icon: 'biz-icon-i-web-l-fw',
              auth: ''
            },
            {
              title: '未知问题',
              path: '/unknow-problem',
              icon: 'biz-icon-i-web-l-fw',
              auth: ''
            }
          ]
        },
        {
          title: '车辆故障码',
          path: '/carFault-code',
          icon: 'biz-icon-i-web-l-fw',
          auth: 'admin.vehicleFaultCode'
        }
      ]
    },
    {
      title: '运营营销',
      path: '/system/operating',
      auth: 'admin:ecommerce.baseData',
      icon: 'biz-icon-i-web-l-yy',
      children: [
        {
          title: '分类数据',
          path: '/category',
          icon: 'biz-icon-i-web-l-yy',
          auth: 'admin:categoryGroup'
        },
        {
          title: '品牌数据',
          path: '/brand-mgmt',
          icon: 'biz-icon-i-web-l-yy',
          auth: 'admin:brand'
        },
        {
          title: '产品数据',
          path: '/product',
          icon: 'biz-icon-i-web-l-yy',
          auth: 'admin:productGroup'
        },
        {
          title: '推送审核设置',
          path: '/push-audit-setting',
          icon: 'biz-icon-i-web-l-yy',
          auth: 'admin:setting.pushAudit'
        }
      ]
    },
    {
      title: '销售售后',
      path: '/system/sale',
      auth: 'admin:system.service',
      icon: 'biz-icon-i-web-l-yy',
      children: [
        {
          title: '保险公司',
          path: '/insurance-company',
          icon: 'biz-icon-i-web-l-yy',
          auth: 'admin:insuranceCompany'
        },
        {
          title: '服务手册',
          icon: 'biz-icon-i-web-l-yy',
          path: '/booklet',
          auth: 'admin:system.booklet'
        }
      ]
    },
    {
      title: '流量分析',
      path: '/system/static-analysis',
      auth: '',
      icon: 'biz-icon-i-web-l-tjfx'
    }
  ],
  // OA
  oa: [
    {
      title: '组织管理',
      path: '/oa',
      auth: 'admin:admin.manage',
      icon: 'biz-icon-i-web-l-yhgl',
      children: [
        {
          path: '/staff-mgmt/admin',
          title: '用户信息',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:admin'
        },
        {
          path: '/staff-mgmt/role',
          title: '角色权限',
          icon: 'biz-icon-i-web-l-yhgl',
          auth: 'admin:role'
        }
      ]
    }
  ],
  // 个人
  admin: [
    {
      title: '个人',
      path: '/admin',
      auth: 'admin:adminProfile',
      icon: 'biz-icon-i-web-l-yhgl',
      children: [
        {
          title: '个人资料',
          path: '/profile',
          auth: 'admin:adminProfile.personal',
          icon: 'biz-icon-i-web-l-grxxsz'
        },
        {
          title: '修改密码',
          path: '/change-password',
          auth: 'admin:adminProfile.password',
          icon: 'biz-icon-xiugaimima'
        }
      ]
    }
  ],
  // 帮助
  help: [
    {
      title: '帮助中心',
      path: '/help',
      auth: '',
      icon: 'biz-icon-i-web-l-yhgl'
    }
  ],
  // 测试页面
  test: [
    {
      title: '测试用页面',
      path: '/test',
      auth: ''
    }
  ]
};

export default sideList;
