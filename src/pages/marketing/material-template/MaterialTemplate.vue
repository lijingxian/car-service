<template>
  <biz-grid class="material-template">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="样式" name="first">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
        </biz-header>
        <div class="indicators-search">
          <div class="title">样式类型：</div>
          <div class="hardGroupFleet" ref="fleetGroup">
            <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部
            </el-checkbox-button>
            <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
              <el-checkbox-button v-for="(condition,index)  in fleetList" :label="condition.value" :key="index" size="mini">
                {{condition.label}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div v-for="data in tableData" :key="data.id">
          <div v-html="data.content" @click="rowClick(data)"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="模板" name="second">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
        </biz-header>
        <div v-for="data in tableData" :key="data.id">
          <div v-html="data.content" @click="rowClick(data)"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="float">
      <right-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="handleOperationSuccess"></right-popup>
    </div>
  </biz-grid>
</template>

<script>
import RightPopup from './MaterialPopup';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
// 基础属性
const dataBase = {
  // 控件
  itemId: { id: '' },
  selections: [],
  separator: ',',

  // 右侧弹窗
  open: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  importResult: [],
  importLoading: false,
  disabled: false,
  checkedFleet: ['0', '1', '2', '3', '4', '5'],
  checkAllFleet: true,
  activeName: 'first',
  fleetList: [
    {
      label: '标题', value: '0'
    },
    {
      label: '正文', value: '1'
    },
    {
      label: '引导', value: '2'
    },
    {
      label: '图文', value: '3'
    },
    {
      label: '布局', value: '4'
    },
    {
      label: '行业', value: '5'
    }
  ],
  isIndeterminateFleet: true,
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary'
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    }
  ],
  filters: [
    {
      type: 'input',
      label: '',
      placeholder: '请输入名称',
      name: 'searchValue',
      value: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    total: 0
  }
};

// 方法
const methods = {
  // 查询
  getQueryParams() {
    return {
      userId: this.getUser().id,
      type: this.checkedFleet
    };
  },
  operate(name) {
    this[name]();
  },
  handleClick(tab, event) {
    console.log(tab, event);
    this.query();
  },
  handleCheckAllFleet(val) {
    this.checkedFleet = val ? this.fleetList.map(item => {
      return item.value;
    }) : [];
    this.query();
  },
  fleetChange(val) {
    let checkedCount = val.length;
    this.checkAllFleet = checkedCount === this.fleetList.length;
    this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
    this.query();
  },
  filterDataChange() {
    this.query();
  },
  getUrl() {
    if (this.activeName === 'first') {
      return '/admin/materialTemplate/style.jhtml';
    } else {
      return '/admin/materialTemplate/material.jhtml';
    }
  },
  query() {
    this.loading = true;
    let url = '';
    if (this.activeName === 'first') {
      url = '/admin/materialTemplate/styleList.jhtml';
    } else {
      url = '/admin/materialTemplate/materialList.jhtml';
    }
    http
      .post(url, this.getQueryParams())
      .then(data => {
        this.tableData = data.dataList;
        this.pagination.total = Number(data.total);
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  refresh() {
    this.query();
  },

  // 删除
  deleteItem(ids) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      http
        .delete(this.getUrl(), { ids: ids })
        .then(data => {
          this.$message.success('删除成功');
          this.query();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    });
  },
  delete() {
    if (this.selections && this.selections.length > 0) {
      let ids = [];
      this.selections.forEach(element => {
        ids.push(element.id);
      });
      this.deleteItem(ids);
    } else {
      this.$message('请选择一条数据');
    }
  },

  // 添加
  add() {
    this.open = true;
    this.itemId = { id: '', type: this.activeName };
  },
  rowClick(row) {
    this.open = true;
    this.itemId = { id: row.id, type: this.activeName };
  }
};

// 事件
const events = {
  handleOperationSuccess() {
    this.open = false;
    this.query();
  },
  handleOperate(name) {
    this[name]();
  },
  handlePageSizeChange(val) {
    this.pagination.pageSize = val;
    this.pagination.currentPage = 1;
    this.query();
  },
  handleCurrentPageChange(val) {
    this.pagination.currentPage = val;
    this.query();
  },
  handleSelectionChange(val) {
    this.selections = val;
    this.operations[1].disabled = true;
    if (val.length > 0) {
      this.operations[1].disabled = false;
    }
  }
};

export default {
  name: 'KeyWordTemplate',
  components: {
    RightPopup,
    BizGrid,
    BizHeader
  },
  props: {},
  data() {
    return {
      ...dataBase,
      ...dataTable
    };
  },
  methods: {
    ...mapGetters(['getUser']),

    ...methods,
    ...events
  },
  created() {
    this.query();
    // this.handleImport();
  }
};
</script>

<style lang="scss">
  .material-template {
    .indicators-search {
      display: -webkit-box;
      height: auto;
      .hardGroupFleet {
        display: flex;
      }
      .el-checkbox-button {
        padding: 15px;
      }
      .el-checkbox-button__inner {
        padding: 10px;
        font-size: 12px;
        border: none;
      }
      .el-checkbox-button:first-child .el-checkbox-button__inner {
        border: none;
        border-radius: 15px;
      }
      .el-checkbox-button:last-child .el-checkbox-button__inner {
        border-radius: 15px;
      }
      .el-checkbox-button,
      .el-checkbox-button__inner {
        border-radius: 15px;
      }
      .el-checkbox-button.is-checked .el-checkbox-button__inner {
        background-color: #f8d6ad;
        border-color: #fff;
        box-shadow: -1px 0 0 0 #fff;
        color: #ff7300;
      }
      .title {
        padding: 20px 10px;
        font-size: 12px;
        height: 100%;
      }
      .hardGroup {
        display: flex;
        width: calc(100% - 90px);
      }
      .hardSeriesGroup {
        display: flex;
        width: calc(100% - 90px);
      }
    }
  }
</style>
