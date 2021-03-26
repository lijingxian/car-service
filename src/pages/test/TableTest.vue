<template>
  <div class="merchants-Mgmt">
    <biz-flex-table :operations="operations"
               @operate="operate"
               :filters="filters"
               @filter-data-change="filterDataChange"
               :tableData="tableData"
               :pagination="pagination"
               @selection-change="handleSelectionChange"
               @row-click="rowClick"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange">
      <el-table-column width="250"
                       prop="date"
                       label="用户信息">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <img :src="scope.row['date'].img"
                 alt="">
            <div class="biz-two-row">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
              <span style="margin-left: 10px">{{ scope.row.date.value2 }}</span>
            </div>
            <el-button size="mini"
                       @click.stop="click(scope.row.id)">
              测试
            </el-button>
          </div>
        </div>
      </el-table-column>
      <el-table-column width="150"
                       prop="name"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="address"
                       label="地址">
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open"
                    @close="close"
                    value="first">
      <el-tab-pane label="申请单基本信息"
                   name="first">
        申请单基本信息
      </el-tab-pane>
      <el-tab-pane label="个人资质信息"
                   name="second">配置管理</el-tab-pane>
      <el-tab-pane label="企业资质信息"
                   name="third">角色管理</el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import Img from '@/assets/images/default_user.png';
import MerchantsMgmtService from '@/service/merchants-mgmt/merchantsMgmt';
import TService from '@/service/test/service';

export default {
  name: 'TableTest',
  components: {
    BizPopupTabs,
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
          type: ''
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
              value: '选1',
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
        },
        {
          type: 'datetimerange',
          label: '日期区间：',
          name: '日期区间：',
          value: ['2017-12-12 11:31:00', '2018-02-12 10:10:12']
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
        pageSize: 50,
        currentPage: 2,
        pageSizes: [10, 20, 50, 100],
        total: 99
      },
      multipleSelection: []
    };
  },
  computed: {
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
  created() {
    TService.query()
      .then(data => {
        console.log(data);
      })
      .catch(errorMessage => {
        console.warn(errorMessage);
      })
      .finally(() => {
        console.warn('结束');
      });
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
      MerchantsMgmtService[name]();
    },
    // filter变化
    filterDataChange(filters) {
      console.log(filters);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.open = true;
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
.merchants-Mgmt {
  padding: 10px 20px;
}
</style>
