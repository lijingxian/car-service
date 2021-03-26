// ===== 左侧菜单栏列表 =====

const sideList = {
  // 运营
  operating: [
    {
      title: '联盟管理',
      path: '/operating/federation-mgmt/federation',
      auth: 'admin:union.manage',
      icon: 'biz-icon-i-web-l-lmgl'
      // children: [
      //   {
      //     trees: [],
      //     auth: ''
      //   }
      //   // {
      //   //   path: '/statistics-analysis',
      //   //   title: '统计分析',
      //   //   auth: 'admin:operatorStatistics'
      //   // }
      // ]
    },
    {
      title: '用户管理',
      path: '/operating/staff-mgmt',
      auth: 'admin:admin.manage',
      icon: 'biz-icon-i-web-l-yhgl',
      children: [
        {
          path: '/admin',
          title: '管理员',
          auth: 'admin:admin'
        },
        {
          path: '/role',
          title: '角色',
          auth: 'admin:role'
        }
      ]
    },
    {
      title: '招商加盟',
      path: '/operating/merchants-mgmt',
      auth: 'admin:investment',
      icon: 'biz-icon-zhaoshangjiameng',
      children: [
        {
          path: '/investment',
          title: '加盟申请管理',
          auth: 'admin:investment.info'
        }
      ]
    },
    {
      title: '车辆管理',
      path: '/operating/vehicle-mgmt',
      auth: 'admin:car.manage',
      icon: 'biz-icon-i-web-l-clgl',
      children: [
        {
          path: '/vehicle',
          title: '全部车辆',
          auth: 'admin:car'
        },
        {
          path: '/vehicle-complaint',
          title: '车辆申诉管理',
          auth: 'admin:carAppeal'
        },
        {
          path: '/fleet',
          title: '全部车队',
          auth: 'caradmin:operateFleet'
          // children: [
          //   {
          //     trees: [
          //       {
          //         label: '丽明车队',
          //         path: '/916',
          //         children: [
          //           {
          //             label: '小丽',
          //             path: '/999'
          //           }
          //         ]
          //       },
          //       {
          //         label: '丽明车队',
          //         path: '/917'
          //       },
          //       {
          //         label: '丽明车队',
          //         path: '/918'
          //       }
          //     ],
          //     auth: ''
          //   }
          // ]
        },
        {
          path: '/statistics-analysis',
          title: '车队统计分析',
          auth: 'admin:operateFleet.statistics',
          children: [
            {
              path: '/marketing-cars',
              title: '运营车辆',
              auth: ''
            },
            {
              path: '/car-state',
              title: '车辆状态',
              auth: ''
            },
            {
              path: '/abnormal',
              title: '异常用车',
              auth: ''
            },
            {
              path: '/car-speed',
              title: '车辆速度',
              auth: ''
            },
            {
              path: '/payment',
              title: '费用分析',
              auth: ''
            }
          ]
        }
      ]
    },
    {
      title: '通讯管理',
      path: '/operating/communication-mgmt',
      auth: 'admin:operateCard.manage',
      icon: 'biz-icon-tongxunguanli',
      children: [
        {
          path: '/operator',
          title: '运营商',
          auth: 'admin:operateCard.operator'
        },
        {
          path: '/card',
          title: '通讯卡',
          auth: 'caradmin:operateCard'
        },
        {
          path: '/record',
          title: '充值记录',
          auth: 'admin:simRecharge'
        }
        // {
        //   path: '/card-statistics-analysis',
        //   title: '统计分析',
        //   auth: 'admin:simStatistics',
        //   children: [
        //     {
        //       path: '/card',
        //       title: '通讯卡统计分析',
        //       auth: 'admin:simStatistics'
        //     },
        //     {
        //       path: '/package',
        //       title: '通讯套餐统计分析',
        //       auth: 'admin:simStatistics'
        //     }
        //   ]
        // }
      ]
    },
    {
      title: '终端管理',
      path: '/operating/terminal-mgmt',
      auth: 'caradmin:operateDevice',
      icon: 'biz-icon-i-web-l-zdgl',
      children: [
        // {
        //   path: '/terminal-type',
        //   title: '终端名称',
        //   auth: '',
        //   children: [
        //     {
        //       trees: [
        //         {
        //           label: 'LPR',
        //           path: '/11/LPR'
        //         }
        //       ],
        //       auth: ''
        //     }
        //   ]
        // }
        {
          path: '/terminal-type',
          title: '终端分类',
          auth: 'caradmin:operateDevice.category'
        },
        {
          path: '/terminal-all',
          title: '全部终端',
          auth: 'caradmin:operateDevice.manage'
        }
      ]
    },
    {
      title: '挪车码管理',
      path: '/operating/move-code',
      auth: 'admin.parkingCode',
      icon: 'biz-icon-i-sh-car-smnc'
    },
    {
      title: '服务定制',
      path: '/operating/service-mgmt',
      auth: 'admin:serviceManage.manage',
      icon: 'biz-icon-i-web-l-fwdz',
      children: [
        {
          title: '服务管理',
          path: '/manage/manage',
          auth: 'admin:serviceManage'
        },
        {
          title: '服务订购',
          path: '/subscribe',
          auth: 'admin:service.subscribe'
        },
        {
          title: '服务订单',
          path: '/manage/order',
          auth: 'admin:serviceOrder'
        },
        {
          title: '短信管理',
          path: '/message-mgmt',
          auth: 'admin:service.sms.platform'
        },
        {
          title: '短信管理',
          path: '/message-mgmt',
          auth: 'admin:service.sms.store'
        }
      ]
    },
    {
      path: '/operating/statistics-analysis',
      title: '统计分析',
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
              path: '/generalViewAnalysis',
              auth: ''
            },
            {
              title: '车况',
              path: '/conditionViewAnalysis',
              auth: ''
            },
            {
              title: '驾驶行为',
              path: '/actionViewAnalysis',
              auth: ''
            },
            {
              title: '单车辆',
              path: '/singleViewAnalysis',
              auth: ''
            }
          ]
        },
        {
          path: '/operator',
          title: '运营商',
          auth: 'admin:operatorStatistics.company'
        },
        {
          path: '/shop',
          title: '店铺',
          auth: 'admin:operatorStatistics.store',
          children: [
            {
              title: '店铺群',
              path: '/shop-analysis',
              auth: ''
            },
            {
              title: '单店铺',
              path: '/single-shop-analysis',
              auth: ''
            }
          ]
        },
        {
          path: '/card',
          title: '通讯卡',
          auth: 'admin:simStatistics',
          children: [
            {
              title: '通讯卡',
              path: '/card',
              auth: ''
            },
            {
              title: '通讯套餐',
              path: '/package',
              auth: ''
            }
          ]
        },
        {
          path: '/terminal-statistics',
          title: '终端',
          auth: 'admin:terminalStatistics'
        }
      ]
    }
  ],
  // 店铺
  shop: [
    {
      title: '商品',
      path: '/shop/commodity-mgmt',
      auth: 'admin:shop.product',
      icon: 'biz-icon-i-web-l-sp',
      children: [
        {
          title: '商品管理',
          path: '/commodity',
          auth: 'admin:product'
        },
        {
          title: 'V豆商城管理',
          path: '/vbean',
          auth: 'admin:product.exchange'
        },
        // 店铺级别
        {
          title: '品牌管理',
          path: '/brand',
          auth: 'admin:shopBrand'
        },
        // 平台级别
        // {
        //   title: '品牌管理',
        //   path: '/brand',
        //   auth: 'admin:brand'
        // },
        {
          title: '商品分类',
          path: '/category',
          auth: 'admin:productCategory'
        },
        {
          title: '统计分析',
          path: '/product-statistics',
          auth: 'admin:shopStatistics.product',
          children: [
            {
              title: '概况',
              path: '/generalViewAnalysis',
              auth: ''
            }
            // {
            //   title: '品类',
            //   path: '/productCategoryAnalysis',
            //   auth: ''
            // },
            // {
            //   title: '单品',
            //   path: '/singleProductAnalysis',
            //   auth: ''
            // }
          ]
        }
      ]
    }
  ],
  // 客服
  service: [
    {
      title: '客服服务',
      path: '/service/service-mgmt',
      auth: 'admin:service.service',
      icon: 'biz-icon-i-web-l-kffw',
      children: [
        {
          // target: '_blank',
          title: '在线应答',
          path: '/online-response',
          auth: 'admin:onlineReply'
        },
        {
          title: '客服人员',
          path: '/member',
          auth: 'admin:customerServiceMember'
        },
        {
          title: '客服群组',
          path: '/group',
          auth: 'admin:group'
        },
        {
          title: '会话质检',
          path: '/quality',
          auth: 'admin:qualitySampling'
        },
        {
          title: '黑名单',
          path: '/black-list',
          auth: 'admin:blacklistCheck'
        }
        // {
        //   title: '工时管理',
        //   path: '/scheduling',
        //   auth: 'admin:customerServiceScheduling'
        // }
      ]
    },
    {
      title: '工单',
      path: '/service/worksheet',
      auth: 'admin:workRecord',
      icon: 'biz-icon-i-web-l-gd',
      children: [
        {
          title: '工单管理',
          path: '/worksheet-mgmt',
          auth: 'admin:workRecord'
        }
        // {
        //   title: '统计分析',
        //   path: '/statistics-analysis',
        //   auth: 'admin:workStatics'
        // }
      ]
    },
    {
      title: '客服知识库',
      path: '/service/robot',
      auth: 'admin:service.robot',
      icon: 'biz-icon-i-web-l-jqr',
      children: [
        // {
        //   title: '回复设置',
        //   path: '/reply',
        //   auth: 'admin:autoReply'
        // },
        {
          title: '知识库管理',
          path: '/konwledge-base',
          auth: 'admin:knowledgeBase'
        }
      ]
    },
    {
      title: '智能到店',
      path: '/service/smart-to-shop',
      auth: 'admin:IntelligentAccess',
      icon: 'biz-icon-i-web-l-zndd',
      children: [
        {
          title: '接待管理',
          path: '/reception-mgmt',
          auth: 'admin:reception'
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
      path: '/service/smart-reception',
      auth: 'admin:smartReception',
      icon: 'biz-icon-i-web-l-znjd',
      children: [
        {
          title: '机器人管理',
          path: '/robot-mgmt',
          auth: 'admin:smartReception.robotManage'
        },
        {
          title: '机器人评价',
          path: '/reception-static/review-static-detail',
          auth: 'admin:smartReception.assess'
        },
        {
          title: '知识库',
          path: '/knowledge',
          auth: 'admin:smartReception.knowledgeBase',
          children: [
            {
              title: '问答管理',
              path: '/qa-mgmt',
              auth: ''
            },
            {
              title: '流程问答',
              path: '/process-qa',
              auth: ''
            },
            {
              title: '未知问题',
              path: '/unknow-problem',
              auth: ''
            }
          ]
        },
        {
          title: '地图管理',
          path: '/map-mgmt',
          auth: 'admin:smartReception.map'
        },
        {
          title: '接待统计',
          path: '/reception-static',
          auth: 'admin:smartReception.statistics',
          children: [
            {
              title: '接待详情',
              path: '/reception-static-detail',
              auth: ''
            }
          ]
        }
      ]
    },
    {
      title: '统计分析',
      path: '/service/statistics-analysis',
      auth: 'admin:accessStatistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '客服分析',
          path: '/generalViewAnalysis',
          auth: 'admin:accessStatistics.smartReception'
        }
        // {
        //   title: '客服服务',
        //   path: '/service',
        //   auth: 'admin:accessStatistics.service'
        // }
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
          title: '活动管理',
          path: '/activity',
          auth: 'admin:activity'
        },
        {
          title: '促销管理',
          path: '/promotion',
          auth: 'admin:promotion'
        },
        {
          title: '线下活动',
          path: '/event',
          auth: 'admin:offlineActivity'
        },
        {
          title: '软文宣传',
          path: '/shop-publicity',
          auth: 'admin:article'
        },
        {
          title: '商品推广',
          path: '/product',
          auth: 'admin:articleProduct'
        }
      ]
    },
    {
      title: '活动模板管理',
      path: '/marketing/template',
      auth: 'admin:activityTemplate',
      icon: 'biz-icon-huodongmobanguanli'
    },
    {
      title: '推送管理',
      path: '/marketing/recommend',
      auth: 'admin:recommend.shop',
      icon: 'biz-icon-i-web-l-fw',
      children: [
        {
          title: 'V服',
          path: '/vfu',
          auth: 'admin:Vfuplace.shop',
          children: [
            {
              title: '服务推荐',
              path: '/service-recommend',
              auth: 'admin:recommend.recommend'
            },
            {
              title: '爱车频道',
              path: '/icar-channel',
              auth: 'admin:recommend.article'
            },
            {
              title: 'APP启动',
              path: '/app-startup',
              auth: 'admin:recommend.app'
            },
            {
              title: '近期活动',
              path: '/marketing',
              auth: 'admin:recommend.activity'
            },
            {
              title: '最新促销',
              path: '/promotion',
              auth: 'admin:recommend.promotion'
            },
            {
              title: 'V商宣传',
              path: '/v-publicity',
              auth: 'admin:recommend.articleAdvertise'
            },
            {
              title: '领优惠券',
              path: '/coupon',
              auth: 'admin:recommend.coupon'
            },
            {
              title: '微信推送',
              path: '/wechat/wechat',
              auth: 'admin:articleWechat'
            }
          ]
        },
        {
          title: '头条',
          path: '/headline',
          auth: 'admin:headline.shop',
          children: [
            {
              title: '今日头条信息流',
              path: '/head-line',
              auth: 'admin:headlineflow.shop'
            }
          ]
        },
        {
          title: '百度',
          path: '/baidu',
          auth: 'admin:baidu.shop',
          children: [
            {
              title: '百度信息流',
              path: '/baidu-info',
              auth: 'admin:baiduflow.shop'
            },
            {
              title: '百度搜索推广',
              path: '/baidu-search',
              auth: 'admin:baidusearch.shop'
            }
          ]
        }]
    },
    {
      title: '推送管理',
      path: '/marketing/recommend',
      auth: 'admin:recommend.platform',
      icon: 'biz-icon-i-web-l-fw',
      children: [
        {
          title: 'V服',
          path: '/vfu',
          auth: 'admin:Vfuplace.platform',
          children: [
            {
              title: '服务推荐',
              path: '/service-recommend',
              auth: 'admin:recommend.recommend.platform'
            },
            {
              title: '爱车频道',
              path: '/icar-channel',
              auth: 'admin:recommend.article.platform'
            },
            {
              title: 'APP启动',
              path: '/app-startup',
              auth: 'admin:recommend.app.platform'
            },
            {
              title: '近期活动',
              path: '/marketing',
              auth: 'admin:recommend.activity.platform'
            },
            {
              title: '最新促销',
              path: '/promotion',
              auth: 'admin:recommend.promotion.platform'
            },
            {
              title: 'V商宣传',
              path: '/v-publicity',
              auth: 'admin:recommend.articleAdvertise.platform'
            },
            {
              title: '领优惠券',
              path: '/coupon',
              auth: 'admin:recommend.coupon.platform'
            },
            {
              title: '微信推送',
              path: '/wechat',
              auth: 'admin:articleWechat.platform'
            }
          ]
        },
        {
          title: '头条',
          path: '/headline',
          auth: 'admin:headline.platform',
          children: [
            {
              title: '今日头条信息流',
              path: '/head-line',
              auth: 'admin:headline.platform'
            }
          ]
        },
        {
          title: '百度',
          path: '/baidu',
          auth: 'admin:baidu.platform',
          children: [
            {
              title: '百度信息流',
              path: '/baidu-info',
              auth: 'admin:baiduflow.platform'
            },
            {
              title: '百度搜索推广',
              path: '/baidu-search',
              auth: 'admin:baidusearch.platform'
            }
          ]
        }]
    },
    {
      title: '统计分析',
      path: '/marketing/statistics-analysis',
      auth: 'admin:activityStatistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '营销分析',
          path: '/marketing-analysis',
          auth: 'admin:activityStatistics.market'
        },
        {
          title: '渠道分析',
          path: '/channel-analysis',
          auth: 'admin:activityStatistics.channel'
        },
        {
          title: '粉丝分析',
          path: '/fans-analysis',
          auth: 'admin:activityStatistics.fan'
        }
      ]
    },
    {
      title: '关键词模板',
      path: '/marketing/marketing-template/key-word',
      auth: 'admin:keywordTemplate',
      icon: 'biz-icon-huodongmobanguanli'
    }
  ],
  // 会员
  member: [
    {
      title: '会籍管理',
      path: '/member',
      auth: 'admin:member',
      icon: 'biz-icon-i-web-l-hjgl',
      // 把/member作为导航页
      children: [
        {
          title: '会员管理',
          path: '/membership-mgmt',
          auth: 'admin:member.list'
        }
      ]
    },
    {
      title: '会员卡',
      path: '',
      auth: 'admin:memberCard.manage',
      icon: 'biz-icon-i-web-l-hyk',
      // 把/member作为导航页
      children: [
        {
          title: '会员卡发放',
          path: '/member/member-card/true',
          auth: 'admin:memberCard'
        },
        {
          title: '会员卡制式',
          path: '/member/member-card-template/true',
          auth: 'admin:memberCardTemplate'
        },
        // {
        //   title: '会员权益',
        //   path: '/member/member-rights',
        //   auth: 'admin:memberBenefits',
        //   icon: 'biz-icon-huiyuanquanyi'
        // },
        {
          title: '会员卡统计',
          path: '/member/member-card-template-static',
          auth: 'admin:memberCard.statistics',
          icon: 'biz-icon-tongxunguanli'
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
          title: '卡券管理',
          path: '/coupon-mgmt',
          auth: 'admin:member.memberBenefits.coupon'
        },
        {
          title: '权益管理',
          path: '/rights-mgmt',
          auth: 'admin:member.memberBenefits.benefits'
        }
      ]
    },
    {
      title: '会员关怀',
      path: '/member/member-care-mgmt',
      auth: 'admin:member.memberCare',
      icon: 'biz-icon-i-ec-online-hygh',
      children: [
        {
          title: '关怀卡分类',
          path: '/category',
          auth: 'admin:member.memberCare.category'
        },
        {
          title: '关怀卡管理',
          path: '/care',
          auth: 'admin:member.memberCare.care'
        }
      ]
    },
    // {
    //   title: '会员卡',
    //   path: '/member/member-card/true',
    //   auth: 'admin:memberCard',
    //   icon: 'biz-icon-huiyuanqia',
    //   children: [
    //     {
    //       trees: [],
    //       auth: 'admin:memberCardTemplate'
    //     }
    //   ]
    // },
    // {
    //   title: '联盟店铺会员卡',
    //   path: '/member/member-card/false',
    //   auth: 'admin:memberCard',
    //   icon: 'biz-icon-lianmengdianpuhuiyuanqia',
    //   children: [
    //     {
    //       trees: [],
    //       auth: 'admin:memberCardTemplate'
    //     }
    //   ]
    // },
    // {
    //   title: '会员卡体系统计',
    //   path: '',
    //   auth: 'admin:memberCardTemplate',
    //   icon: 'biz-icon-tongxunguanli',
    //   children: [
    //     {
    //       trees: [],
    //       auth: 'admin:memberCardTemplate'
    //     }
    //   ]
    // },
    {
      title: '车友社区',
      path: '/member/motor-club',
      auth: 'admin:fleet.manage',
      icon: 'biz-icon-i-web-l-cysq',
      children: [
        {
          title: '车友会',
          path: '/fleetMember',
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
          auth: 'admin:fleetSpace'
        },
        {
          title: '问答发布',
          path: '/question-answer-release',
          auth: 'admin:space.topic'
        },
        {
          title: '文章发布',
          path: '/article-publish',
          auth: 'admin:article'
        },
        {
          title: '活动发布',
          path: '/activity',
          auth: 'admin:fleetActivity'
        }
      ]
    },
    {
      title: '统计分析',
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
              auth: ''
            },
            {
              title: '单会员画像',
              path: '/single-member-portrait',
              auth: 'admin:member.statistics.memberPortraint'
            }
          ]
        },
        {
          title: '车友会',
          path: '/motorist/generalViewAnalysis',
          auth: 'admin:member.statistics.fleet'
        },
        {
          title: '内容分析',
          path: '/content/generalViewAnalysis',
          auth: 'admin:member.statistics.fleet'
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
          auth: 'admin:carMsg.car'
        },
        {
          title: '事故和故障',
          path: '/car/accident',
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
          auth: 'admin:serviceMsg.order'
        },
        {
          title: '维保消息',
          path: '/service/maintenance',
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
      path: '/message/message-mgmt?category=pendingRemind&state=1',
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
          auth: 'admin:sale.financialPlan'
        }
      ]
    },
    {
      title: '金融管理',
      path: '/sales/financeMgmt',
      auth: 'admin:finnancial',
      icon: 'biz-icon-jinrong',
      children: [
        {
          title: '金融机构',
          path: '/company/mgmt',
          auth: 'admin:finnancialinstitution'
        }
      ]
    },
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
          auth: 'admin:finnancialcategory'
        },
        {
          title: '金融方案',
          path: '/finance',
          auth: 'admin:finnancialPlan'
        },
        {
          title: '保险方案',
          path: '/insurance',
          auth: 'admin:insurancePlan'
        }
      ]
    },
    // 平台级
    {
      title: '金融产品',
      path: '/sales/financeProduct',
      auth: 'admin:system.finnancialProduct',
      icon: 'biz-icon-jinrong',
      children: [
        {
          title: '产品分类',
          path: '/category/sys',
          auth: 'admin:system.finnancialcategory'
        },
        {
          title: '金融方案',
          path: '/finance/sys',
          auth: 'admin:system.finnancialPlan'
        },
        {
          title: '保险方案',
          path: '/insurance/sys',
          auth: 'admin:system.insurancePlan'
        }
      ]
    },
    {
      title: '潜客管理',
      path: '/sales/potential',
      auth: 'admin:potential',
      icon: 'biz-icon-qiankeguanli',
      children: [
        {
          title: '潜客管理',
          path: '/potential',
          auth: ''
        }
      ]
    },
    {
      title: '试驾管理',
      path: '/sales/testDrive',
      auth: 'admin:testdrive',
      icon: 'biz-icon-i-web-sjgl', // TODO icon erro
      children: [
        {
          title: '试驾车辆管理',
          path: '/testDrive',
          auth: 'admin:testdriveManagment'
        }
      ]
    },
    {
      title: '统计分析',
      path: '/sales/statistics-analysis',
      icon: 'biz-icon-i-web-l-tjfx',
      auth: 'admin:potential.statistics',
      children: [
        {
          title: '潜客分析',
          path: '/general',
          auth: 'admin:potentialStatistics'
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
          auth: 'admin:aftersale.maintain'
        },
        {
          title: '预约管理',
          path: '/appointment',
          auth: 'admin:aftersale.appointment'
        },
        {
          title: '服务手册',
          path: '/booklet',
          auth: 'admin:aftersale.booklet'
          // children: [
          //   {
          //     trees: []
          //   }
          // ]
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
      title: '统计分析',
      path: '/after-sale/statistics-analysis',
      auth: 'admin:aftersale.statistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '售后记录',
          path: '/order',
          auth: 'admin:aftersale.statistics.aftersaleRecord'
        },
        {
          title: '售后订单',
          path: '/afterSale/order',
          auth: 'admin:aftersale.statistics.aftersaleOrder'
        }
      ]
    }
  ],
  // 订单
  order: [
    {
      title: '订单',
      path: '/order/product',
      auth: 'admin:order.order',
      icon: 'biz-icon-i-web-l-dd',
      children: [
        {
          title: '整车订单',
          path: '/car',
          auth: 'admin:carOrder'
        },
        {
          title: '车品订单',
          path: '/product',
          auth: 'admin:carProductOrder'
        },
        {
          title: '普通订单',
          path: '/general',
          auth: 'admin:order'
        },
        {
          title: '普通服务',
          path: '/service',
          auth: 'admin:normalService'
        },
        {
          title: '一键救援',
          path: '/rescue',
          auth: 'admin:rescue'
        },
        {
          title: '预约体验',
          path: '/ride',
          auth: 'admin:testAppointment'
        },
        {
          title: '预约置换',
          path: '/replace',
          auth: 'admin:replacementAppointment'
        },
        {
          title: '贷款购车',
          path: '/loan',
          auth: 'admin:productAppointment'
        },
        {
          title: '优惠券订单',
          path: '/couponOrder',
          auth: 'admin:couponOrder'
        },
        {
          title: '金融订单',
          path: '/product/finance/financeOrder',
          auth: 'admin:financeOrder'
        },
        {
          title: '保险订单',
          path: '/product/finance/insuranceOrder',
          auth: 'admin:insuranceOrder'
        },
        {
          title: '储值订单',
          path: '/store/store/deposit',
          auth: 'admin:deposit'
        }
      ]
    },
    {
      title: '售后退款',
      icon: 'biz-icon-i-web-l-cw',
      path: '/order/finance/refund',
      auth: 'admin:refunds'
    },
    // {
    //   title: '财务',
    //   path: '/order/finance',
    //   auth: 'admin:order.financial',
    //   icon: 'biz-icon-i-web-l-cw',
    //   children: [
    //     {
    //       title: '收款管理',
    //       path: '/payment',
    //       auth: 'admin:payment'
    //     },
    //     {
    //       title: '退款管理',
    //       path: '/refund',
    //       auth: 'admin:refunds'
    //     },
    //     {
    //       title: '储值订单',
    //       path: '/deposit',
    //       auth: 'admin:deposit'
    //     }
    //   ]
    // },
    {
      title: '物流管理',
      path: '/order/logistics',
      auth: 'admin:order.logistics',
      icon: 'biz-icon-i-web-l-wl',
      children: [
        {
          title: '发货记录',
          path: '/shipping',
          auth: 'admin:shipping'
        }
      ]
    },
    {
      title: '统计分析',
      path: '/order/statistics-analysis',
      auth: 'admin:order.statistics',
      icon: 'biz-icon-i-web-l-tjfx',
      children: [
        {
          title: '订单分析',
          path: '/OrderViewAnalysis',
          auth: 'admin:orderStatistics'
        },
        {
          title: '下单人群分析',
          path: '/OrderPopulationAnalysis',
          auth: ''
        },
        {
          title: '售后分析',
          path: '/OrderAfterSaleAnalysis',
          auth: 'admin:order.statistics.aftersale'
        },
        {
          title: '物流分析',
          path: '/OrderDeliveryAnalysis',
          auth: ''
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
      path: '/invoicing/purchase-mgmt',
      auth: 'admin:purchase',
      icon: 'biz-icon-i-web-l-cggl',
      children: [
        {
          title: '采购申请',
          path: '/purchase-apply',
          auth: 'admin:purchaseApplication'
        },
        {
          title: '采购订单',
          path: '/purchase-order-new',
          auth: 'admin:purchaseOrder'
        },
        {
          title: '采购统计',
          path: '/purchase-statistics',
          auth: 'admin:purchaseStatistic'
        }
      ]
    },
    {
      title: '代理商采购管理',
      path: '/invoicing/agency',
      auth: 'admin:purchase.agent',
      icon: 'biz-icon-i-web-l-cggl',
      children: [
        {
          title: '采购申请',
          path: '/agency-purchase-apply',
          auth: 'admin:purchaseApplication.agent',
          icon: 'biz-icon-i-web-l-cggl'
        },
        {
          title: '采购订单',
          path: '/agency-purchase-order',
          auth: 'admin:purchaseOrder.agent',
          icon: 'biz-icon-i-web-l-dlscgdd'
        },
        {
          title: '采购统计',
          path: '/agency-purchase-static',
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
          auth: 'admin:saleApplication'
        },
        {
          title: '销售订单',
          path: '/sale-order',
          auth: 'admin:saleOrder'
        },
        {
          title: '销售统计',
          path: '/sale-static',
          auth: 'admin:saleStatistic'
        }
      ]
    },
    {
      title: '供应商销售管理',
      path: '/invoicing/supplier',
      auth: 'admin:purchaseSaleStorage.sale.supplier',
      icon: 'biz-icon-i-web-l-xsgl',
      children: [
        {
          title: '销售订单',
          path: '/order-supplier',
          auth: 'admin:saleOrder.supplier',
          icon: 'biz-icon-i-web-l-gysxsdd'
        },
        {
          title: '销售统计',
          path: '/static-supplier',
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
          auth: 'admin:export'
        },
        {
          title: '入库管理',
          path: '/depot-in-mgmt',
          auth: 'admin:inport'
        },
        {
          title: '调拨管理',
          path: '/allotted-mgmt',
          auth: 'admin:storage.transfer'
        },
        {
          title: '盘点',
          path: '/inventory',
          auth: 'admin:check'
        },
        {
          title: '条码管理',
          path: '/bar-code-mgmt',
          auth: 'admin:storage.barCode'
        },
        {
          title: '库存统计',
          path: '/stock-statistics',
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
          auth: 'admin:PurchaseSaleStorage.product'
        },
        // 店铺级别
        {
          title: '品牌',
          path: '/brand',
          auth: 'admin:PurchaseSaleStorage.brand'
        },
        {
          title: '分类',
          path: '/category',
          auth: 'admin:PurchaseSaleStorage.productCategory'
        },
        {
          title: '仓库',
          path: '/store-house',
          auth: 'admin:Warehouse'
        },
        {
          title: '供应商',
          path: '/supplier',
          auth: 'admin:Supplier'
        },
        {
          title: '代理商',
          path: '/agent',
          auth: 'admin:agent'
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
          title: '店铺账户',
          path: '/shop-account',
          auth: 'admin:system.shopaccount.shop'
        },
        {
          title: '店铺账户',
          path: '/platform-account',
          auth: 'admin:system.shopaccount.platform'
        },
        {
          title: '基本设置',
          path: '/setting-mgmt',
          auth: 'admin:system.setting.base'
        },
        {
          title: '显示设置',
          path: '/display-mgmt',
          auth: 'admin:system.setting.view'
        },
        {
          title: '注册与安全',
          path: '/registrationAndSecurity-mgmt',
          auth: 'admin:system.setting.registerAndSafe'
        },
        {
          title: '邮件设置',
          path: '/email-mgmt',
          auth: 'admin:system.setting.mail'
        },
        {
          title: '存储插件',
          path: '/storage-plugin',
          auth: 'admin:storagePlugin'
        },
        {
          title: '地区管理',
          path: '/area-mgmt',
          auth: 'admin:area'
        },
        {
          title: '推荐配置',
          path: '/recommend-mgmt',
          auth: 'admin:system.setting.recommendSetting'
        },
        {
          title: '功能定义',
          path: '/function-defination',
          auth: 'admin:system.setting.base'
        }
      ]
    },
    {
      title: '电商',
      path: '/system/product',
      auth: 'admin:ecommerce.baseData',
      icon: 'biz-icon-i-web-l-ds',
      children: [
        {
          title: '推送审核设置',
          path: '/push-audit-setting',
          auth: 'admin:setting.pushAudit'
        },
        {
          title: '分类数据',
          path: '/category',
          auth: 'admin:categoryGroup'
        },
        {
          title: '品牌数据',
          path: '/brand-mgmt',
          auth: 'admin:brand'
        },
        {
          title: '产品数据',
          path: '/product',
          auth: 'admin:productGroup'
        },
        {
          title: '车辆数据',
          path: '/base-data',
          auth: 'admin:baseData'
        },
        {
          title: '支付方式',
          path: '/payment-method',
          auth: 'admin:paymentMethod'
        },
        {
          title: '配送方式',
          path: '/shipping-method',
          auth: 'admin:shippingMethod'
        },
        {
          title: '配送方式设置',
          path: '/product-settings/distributor-setting',
          auth: 'admin:shop.shippingMethod'
        },
        // 店铺
        {
          title: '物流公司',
          path: '/delivery_shop',
          auth: 'admin:deliveryCorp.shop'
        },
        // 平台
        {
          title: '物流公司',
          path: '/delivery',
          auth: 'admin:deliveryCorp'
        },
        // {
        //   title: '审批设置',
        //   path: '/approve-setting',
        //   auth: 'admin:setting.approvalSettings'
        // },
        {
          title: '流程设置',
          path: '/process-setting',
          auth: 'admin:setting.processSettings',
          children: [
            // {
            //   title: '销售流程',
            //   path: '/sale',
            //   auth: ''
            // },
            // {
            //   title: '采购流程',
            //   path: '/purchase',
            //   auth: ''
            // },
            {
              title: '销售流程设置',
              path: '/sale-setting',
              auth: ''
            },
            {
              title: '采购流程设置',
              path: '/purchase-setting',
              auth: ''
            },
            {
              title: '发货流程设置',
              path: '/shipping-setting',
              auth: ''
            }
          ]
        }
      ]
    },
    {
      title: '服务',
      path: '/system/service',
      auth: 'admin:system.service',
      icon: 'biz-icon-i-web-l-fw',
      children: [
        {
          title: '知识库',
          path: '/knowledge',
          auth: 'admin:knowledgeBase',
          children: [
            {
              title: '问答管理',
              path: '/qa-mgmt',
              auth: ''
            },
            {
              title: '未知问题',
              path: '/unknow-problem',
              auth: ''
            }
          ]
        },
        {
          title: '油价数据',
          path: '/oil-price',
          auth: 'admin:oilPrice'
        },
        {
          title: '保险公司',
          path: '/insurance-company',
          auth: 'admin:insuranceCompany'
        },
        {
          title: '车辆故障码',
          path: '/carFault-code',
          auth: 'admin.vehicleFaultCode'
        },
        {
          title: '服务手册',
          path: '/booklet',
          auth: 'admin:system.booklet'
        }
      ]
    },
    {
      title: '运营',
      path: '/system/operating',
      auth: 'admin:system.operato',
      icon: 'biz-icon-i-web-l-yy',
      children: [
        {
          title: '微信设置',
          path: '/wechatList',
          auth: 'admin:shopWechatBind'
        },
        {
          title: '公众号链接配置',
          path: '/wechat-url',
          auth: 'admin:wechatMenuPath'
        },
        {
          title: '承诺图标模版',
          path: '/icon-template',
          auth: 'admin:promiseIconTemplate'
        },
        {
          title: '电视投屏',
          path: '/screen-projection',
          auth: 'admin:advertising'
        },
        {
          title: '店铺赋能设置',
          path: '/product-settings/shop-profile-setting',
          auth: 'admin:shop.storeProfile'
        },
        {
          title: '联盟信用评价体系设置',
          path: '/product-settings/shop-rate',
          auth: 'admin:shop.creditRating',
          children: [
            {
              title: '能力评价体系设置',
              path: '/ability',
              auth: ''
            },
            {
              title: '承诺体系设置',
              path: '/promise',
              auth: ''
            },
            {
              title: '推荐体系设置',
              path: '/recommend',
              auth: ''
            }
          ]
        }
      ]
    },
    {
      title: '标签库',
      path: '/system/tag',
      auth: 'admin:system.tag',
      icon: 'biz-icon-i-web-l-bqk',
      children: [
        {
          title: '分类管理',
          path: '/tagClass',
          auth: 'admin:system.tag.tagCategory'
        },
        {
          title: '标签管理',
          path: '/tagMgmt',
          auth: 'admin:system.tag.tag'
        }
      ]
    },
    {
      title: '标签库',
      path: '/shop/tag',
      auth: 'admin:shop.tag',
      icon: 'biz-icon-i-web-l-bqk',
      children: [
        {
          title: '分类管理',
          path: '/tagClass',
          auth: 'admin:shop.tag.tagCategory'
        },
        {
          title: '标签管理',
          path: '/tagMgmt',
          auth: 'admin:shop.tag.tag'
        }
      ]
    },
    {
      title: '监控数据',
      path: '/system/log',
      auth: 'admin:log',
      icon: 'biz-icon-i-web-l-jksj',
      children: [
        {
          title: '系统日志',
          path: '/log-mgmt',
          auth: 'admin:log.system'
        },
        {
          title: '接口日志',
          path: '/interface',
          auth: 'admin:log.interface'
        },
        {
          title: '用户操作日志',
          path: '/user-operat-log',
          auth: 'admin:log.memberOperato'
        },
        {
          title: '管理员操作日志',
          path: '/admin-operate-log',
          auth: 'admin:log.adminOperato'
        },
        {
          title: '终端日志',
          path: '/terminal-log',
          auth: 'admin:log.terminal'
        }
      ]
    }
  ],
  // 个人
  admin: [
    {
      title: '个人资料',
      path: '/admin/profile',
      auth: 'admin:adminProfile.personal',
      icon: 'biz-icon-i-web-l-grxxsz'
    },
    {
      title: '修改密码',
      path: '/admin/change-password',
      auth: 'admin:adminProfile.password',
      icon: 'biz-icon-xiugaimima'
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
