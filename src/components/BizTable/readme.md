# 操作中心Table说明

## 操作和过滤部分说明

> BizHeader

### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| operations   | 操作部分按钮，如增加、删除等 | Array | 见示例 | [] |
| filters   | 删选数据操作部分，目前包含select、switch、input、daterange | Array | 见示例 | [] |

### Events

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| operate  | 操作事件 | name |
| inputSearch  | 搜索事件 | value |

### 举例

```html
<template>
  <div class="merchants-management">
    <biz-header :operations="operations" @operate="operate" :filters="filters" @inputSearch="inputSearch">
    </biz-header>
  </div>
</template>

<script>
import BizHeader from './BizHeader';
import MerchantsManagementService from '@/service/merchants-management/merchantsManagement';

export default {
  name: 'TableTest',
  components: {
    BizHeader
  },
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'add'
        },
        {
          label: '删除',
          name: 'delete',
          disabled: false,
          type: 'danger'
        }
      ],
      filters: [
        {
          type: 'select',
          label: '设备状态',
          name: 'add',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '选项1',
              label: '黄金糕'
            },
            {
              value: '选项2',
              label: '双皮奶'
            }
          ]
        },
        {
          type: 'switch',
          label: '',
          activeValue: 'chart',
          inactiveValue: 'table',
          activeText: '图表视图',
          inactiveText: '列表视图',
          value: 'table'
        },
        {
          type: 'input',
          label: '搜索框',
          placeholder: '请输入电话号码',
          name: 'add',
          value: ''
        },
        {
          type: 'daterange',
          label: '日期区间：',
          name: '日期区间：',
          value: ['2017-12-12', '2018-02-12']
        }
      ]
    };
  },
  computed: {
    // 把需要监听的数据放入
    watchFilters: function() {
      let filters = [];
      filters.push(this.filters[0]);
      filters.push(this.filters[1]);
      filters.push(this.filters[3]);
      return filters;
    }
  },
  created() {},
  watch: {
    watchFilters: {
      handler: function(newFilters, oldFilters) {
        // 此处应该根据现有条件进行
        console.log('条件变化，开始查询');
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    // 绑定到服务的operate,比如这里的operate的name是`delete`,这里执行MerchantsManagementService的delete函数
    operate(name) {
      MerchantsManagementService[name]();
    },
    inputSearch(value) {
      console.log('搜索了' + value);
    }
  }
};
</script>

```

## 表格主体的说明

> BizTableBody

### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| height   | Table 的高度 | String | '500' | '800' |
| tableData   | table的数据 | Array | 见示例 | [] |
| pagination   | 分页需要的初始化参数 | Object | 见示例 | 必须赋值 |

### Events

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| handleSelectionChange  | 当checkbox选择项发生变化时会触发该事件 | selection |
| rowClick  | 点击row | row |
| handleSizeChange  | 改变table每页显示数量 | pageSize |
| handleCurrentChange  | 改变当前页数 | pageNumber |

### 举例

```html
<template>
  <div class="merchants-management">
    <biz-table :operations="operations" @operate="operate" :filters="filters" @inputSearch="inputSearch" :tableData="tableData"
      :pagination="pagination" @handleSelectionChange="handleSelectionChange" @rowClick="rowClick" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column width="250" prop="date" label="用户信息">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <img :src="scope.row['date'].img" alt="">
            <div class="biz-two-row">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
              <span style="margin-left: 10px">{{ scope.row.date.value2 }}</span>
            </div>
            <el-button @click.stop="click(scope.row.id)">
              测试
            </el-button>
          </div>
        </div>
      </el-table-column>
      <el-table-column width="150" prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </biz-table>
  </div>
</template>

<script>
import BizHeader from './BizHeader';
import MerchantsManagementService from '@/service/merchants-management/merchantsManagement';

export default {
  name: 'TableTest',
  components: {
    BizHeader
  },
  data() {
    return {
      height: '800',
      tableData: [
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    };
  },
  computed: {
  },
  created() {
    this.getViewportHeight();
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
    rowClick(row) {
      this.$emit('rowClick', row);
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    // 计算视口的高度
    getViewportHeight() {
      let height = document.documentElement.clientHeight || window.innerHeight;
      this.height = String(height - 120);
    }
  }
};
</script>

```

## 整体Table

> BizTable

### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| operations   | 操作部分按钮，如增加、删除等 | Array | 见示例 | [] |
| filters   | 删选数据操作部分，目前包含select、switch、input、daterange | Array | 见示例 | [] |
| height   | Table 的高度 | String | '500' | '800' |
| tableData   | table的数据 | Array | 见示例 | [] |
| pagination   | 分页需要的初始化参数 | Object | 见示例 | 必须赋值 |

### Events

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| operate  | 操作事件 | name |
| inputSearch  | 搜索事件 | value |
| handleSelectionChange  | 当checkbox选择项发生变化时会触发该事件 | selection |
| rowClick  | 点击row | row |
| handleSizeChange  | 改变table每页显示数量 | pageSize |
| handleCurrentChange  | 改变当前页数 | pageNumber |

### 举例

```html
<template>
  <div class="merchants-management">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @inputSearch="inputSearch" :tableData="tableData"
      :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column width="250" prop="date" label="用户信息">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <img :src="scope.row['date'].img" alt="">
            <div class="biz-two-row">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
              <span style="margin-left: 10px">{{ scope.row.date.value2 }}</span>
            </div>
            <el-button @click.stop="click(scope.row.id)">
              测试
            </el-button>
          </div>
        </div>
      </el-table-column>
      <el-table-column width="150" prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </biz-flex-table>
    <biz-popup :open="open" @close="close">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="申请单基本信息" name="first">
          申请单基本信息
        </el-tab-pane>
        <el-tab-pane label="个人资质信息" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="企业资质信息" name="third">角色管理</el-tab-pane>
      </el-tabs>
    </biz-popup>
  </div>
</template>

<script>
import BizPopup from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import Img from '@/assets/images/default_user.png';
import MerchantsManagementService from '@/service/merchants-management/merchantsManagement';

export default {
  name: 'TableTest',
  components: {
    BizPopup,
    BizFlexTable
  },
  data() {
    return {
      open: false,
      dialogVisible: false,
      activeName: 'second',
      operations: [
        {
          label: '新增',
          name: 'add'
        },
        {
          label: '删除',
          name: 'delete',
          disabled: false,
          type: 'danger'
        }
      ],
      filters: [
        {
          type: 'select',
          label: '设备状态',
          name: 'add',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '选项1',
              label: '黄金糕'
            },
            {
              value: '选项2',
              label: '双皮奶'
            },
            {
              value: '选项3',
              label: '蚵仔煎'
            },
            {
              value: '选项4',
              label: '龙须面'
            },
            {
              value: '选项5',
              label: '北京烤鸭'
            }
          ]
        },
        {
          type: 'switch',
          label: '',
          activeValue: 'chart',
          inactiveValue: 'table',
          activeText: '图表视图',
          inactiveText: '列表视图',
          value: 'table'
        },
        {
          type: 'input',
          label: '搜索框',
          placeholder: '请输入电话号码',
          name: 'add',
          value: ''
        },
        {
          type: 'daterange',
          label: '日期区间：',
          name: '日期区间：',
          value: ['2017-12-12', '2018-02-12']
        }
      ],
      tableData: [
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 123,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 12878,
          date: {
            img: Img,
            value1: '用户名',
            value2: '昵称'
          },
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      pagination: {
        pageSize: 30,
        currentPage: 2,
        pageSizes: [10, 20, 50, 100],
        total: 99
      },
      multipleSelection: []
    };
  },
  computed: {
    // 把需要监听的数据放入
    watchFilters: function() {
      let filters = [];
      filters.push(this.filters[0]);
      filters.push(this.filters[1]);
      filters.push(this.filters[3]);
      return filters;
    },
    methodss: function() {
      let _this = this;
      return {
        add() {
          console.log('add');
        },
        delete() {
          console.log('delete');
          _this.operations[2].disabled = true;
        }
      };
    }
  },
  created() {},
  watch: {
    watchFilters: {
      handler: function(newFilters, oldFilters) {
        // 此处应该根据现有条件进行
        console.log('条件变化，开始查询');
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    close() {
      this.open = false;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 绑定到服务的operate
    operate(name) {
      MerchantsManagementService[name]();
    },
    inputSearch(value) {
      console.log('搜索了' + value);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    rowClick(row) {
      console.log(row);
    },
    click(id) {
      console.log(id);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss">
.merchants-management {
  padding: 10px 20px;
}
</style>



```
