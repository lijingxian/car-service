# 导航卡说明
### Attributes:
参数 | 说明 | 类型
---|---|---
cardData | 要传入的导航卡内容 | Array

### 结构说明: 
```
cardData: [
  [                    // 导航卡组,每一个步骤放到同一个数组中
    {link: '',         // 导航卡要跳转的路由,如 '/admin-mgmt' (可选,没有则不跳转)
      tree: []         // 导航卡跳转后左侧导航树选中事件 (可选,模拟点击事件,会覆盖路由跳转)
      title: '',       // 导航卡标题
      content: '',     // 导航卡内容介绍(单行为字符串,多行为数组)
      bottom: [        // 导航卡下半部分(导航卡数据) (可选,没有bottom则不会显示分割线)
        {              // 每一条是一个对象
         content: '',  // 数据标题
         value: '',    // 数据结果
         unit: ''      // 数据单位,如 '个'
        }
      ]
    }
  ]
]
```

### 举例: 
```
[
  [{link: '/admin-mgmt',
    title: '管理员管理',
    content: '可以在管理员管理中管理对管理员进行管理',
    bottom: [
      { content: '管理员数量',
        value: this.adminCount,
        unit: '个'
      }
    ]
  }],
  [{link: '/role-mgmt',
    title: '角色管理',
    content: '可以在角色管理中对角色进行管理巴拉巴拉巴拉巴拉巴拉',
    bottom: [
      { content: '角色数量',
        value: this.roleCount,
        unit: '个'
      }
    ]
  }]
]
```