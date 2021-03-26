<template>
  <biz-grid class="rank-item">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form size="small" label-width="140px">
      <el-form-item label="非会员接待提醒人员">
        <el-radio-group v-model="rankData.target" @change="onTypeChange">
          <el-radio label="0">全部顾问</el-radio>
          <el-radio label="1">指定顾问</el-radio>
        </el-radio-group>
      </el-form-item>
      <div style="margin:0px 0px 22px 140px">
        <span v-if="rankData.target==='0'">已选中顾问{{total}}人</span>
        <div v-if="rankData.target==='1'">
          <el-button type="primary" @click="showPeoplePicker" class="btn-style" size="mini">选择</el-button>
          <span>已选中顾问{{rankData.members.length}}人</span>
          <div :class="isShow?'nick-name-container-show':'nick-name-container'">
            <div v-for="item in rankData.members" :key="item.id" class="nick-name-title">{{item.name||item.nickname}}</div>
          </div>
          <div class="color" v-if="rankData.members.length>6" @click="view">查看全部</div>
        </div>
      </div>
      <el-form-item label="会员接待提醒人员">
        <el-radio-group v-model="rankData.target1" @change="onTypeChange">
          <el-radio label="0">全部顾问</el-radio>
          <el-radio label="1">指定顾问</el-radio>
        </el-radio-group>
      </el-form-item>
      <div style="margin-left:140px">
        <span v-if="rankData.target1==='0'">已选中顾问{{total}}人</span>
        <div v-if="rankData.target1==='1'">
          <el-button type="primary" @click="showPeoplePicker1" class="btn-style" size="mini">选择</el-button>
          <span>已选中顾问{{rankData.members1.length}}人</span>
          <div :class="isShow?'nick-name-container-show':'nick-name-container'">
            <div v-for="item in rankData.members1" :key="item.id" class="nick-name-title">{{item.name||item.nickname}}</div>
          </div>
          <div class="color" v-if="rankData.members1.length>6" @click="view">查看全部</div>
        </div>
      </div>
    </el-form>
    <biz-dialog-selector title="选择顾问" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange" @selectionChange="selectionChange"
      class="rank-dialog-selector">
      <el-table-column prop="name" label="顾问信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="@/assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector title="选择顾问" :visibility.sync="showDialog1" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys1" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed1" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange" @selectionChange="selectionChange1"
      class="rank-dialog-selector">
      <el-table-column prop="name" label="顾问信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="@/assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import BizSaveButton from '@/components/BizSaveButton';
export default {
  name: 'rank-item',
  data() {
    return {
      memberRankList: [],
      total: 0,
      rankTotal: 0,
      selVips: [],
      selVips1: [],
      selectionList: [],
      selectionList1: [],
      showDialog: false,
      showDialog1: false,
      showRankDialog: false,
      dialogLoading: true,
      isShow: false,
      dialogTableData: [],
      rankData: {
        target: '0',
        id: '',
        id1: '',
        target1: '0',
        members: [],
        members1: []
      },
      dialogPagination: {
        pageSize: 1000,
        currentPage: 1,
        pageSizes: [1000],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      curTagName: ''
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  watch: {},
  components: {
    BizDialogSelector,
    BizSaveButton,
    BizGrid
  },
  computed: {
    ...mapGetters(['getUser']),
    selectionKeys() {
      let list = [];
      for (const iterator of this.rankData.members) {
        list.push(iterator.id);
      }
      return list;
    },
    selectionKeys1() {
      let list = [];
      for (const iterator of this.rankData.members1) {
        list.push(iterator.id);
      }
      return list;
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    view() {
      this.isShow = true;
    },
    operate(name) {
      this[name]();
    },
    save() {
      let listDatas = [];
      if (this.rankData.target1 === '0') {
        listDatas.push({ type: '1', consultants: [], id: this.rankData.id1 });
      } else if (this.rankData.target1 === '1') {
        if (this.rankData.members1.length === 0) {
          this.$message.warning('请选择顾问');
          return;
        }
        listDatas.push({ type: '1', consultants: this.rankData.members1, id: this.rankData.id1 });
      }
      if (this.rankData.target === '0') {
        listDatas.push({ type: '0', consultants: [], id: this.rankData.id });
      } else if (this.rankData.target === '1') {
        if (this.rankData.members.length === 0) {
          this.$message.warning('请选择顾问');
          return;
        }
        listDatas.push({ type: '0', consultants: this.rankData.members, id: this.rankData.id });
      }
      http
        .put('/admin/intelligentAccess/setting/remind.jhtml', listDatas)
        .then(data => {
          this.$message.success('操作成功');
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    onTypeChange(val) {
      if (val === '0') {
        this.getVipCount();
      }
    },
    getVipCount() {
      this.loading = true;
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['service', 'salesman', 'afterSale', 'serviceAdmin', 'salesmanAdmin', 'afterSaleAdmin']
        })
        .then(data => {
          this.total = data.dataList.length;
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
    query() {
      this.loading = true;
      http
        .get('/admin/intelligentAccess/setting/remindList.jhtml', {})
        .then(data => {
          if (data.dataList) {
            this.rankData.members = data.dataList.length > 0 && data.dataList[0].consultants ? data.dataList[0].consultants : [];
            this.rankData.id = data.dataList.length > 0 && data.dataList[0].id ? data.dataList[0].id : '';
            this.rankData.id1 = data.dataList.length > 0 && data.dataList[1].id ? data.dataList[1].id : '';
            this.rankData.target = data.dataList.length > 0 && data.dataList[0].consultants && data.dataList[0].consultants.length > 0 ? '1' : '0';
            this.rankData.members1 = data.dataList.length > 0 && data.dataList[1].consultants ? data.dataList[1].consultants : [];
            this.rankData.target1 = data.dataList.length > 0 && data.dataList[1].consultants && data.dataList[1].consultants.length > 0 ? '1' : '0';
          }
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
    showPeoplePicker() {
      this.dialogFilters[0].value = '';
      this.showDialog = true;
      this.queryPeople();
    },
    showPeoplePicker1() {
      this.dialogFilters[0].value = '';
      this.showDialog1 = true;
      this.queryPeople();
    },
    queryPeople() {
      this.dialogLoading = true;
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['service', 'salesman', 'afterSale', 'serviceAdmin', 'salesmanAdmin', 'afterSaleAdmin'],
          pageSize: 1000,
          pageNumber: 1
        })
        .then(data => {
          this.dialogTableData = data.dataList;
          this.dialogPagination.total = data.dataList.length;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.dialogLoading = false;
        });
    },
    selectionChange(selections) {
      this.selectionList = [];
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    selectionChange1(selections) {
      this.selectionList1 = [];
      selections.forEach(item => {
        if (this.selectionList1.indexOf(item) === -1) {
          this.selectionList1.push(item);
        }
      });
    },
    handleConfirmed(selectionKeys, selections) {
      console.log(1111);
      let list = [];
      for (const iterator of selectionKeys) {
        this.selectionList.forEach(item => {
          if (item.id === iterator) {
            list.push({
              id: iterator,
              name: item.name,
              nickName: item.nickName
            });
          }
        });
      }
      if (this.rankData.members && this.rankData.members.length) {
        list.forEach(item => {
          if (!this.containsItem(this.rankData.members, item.id)) {
            this.rankData.members.push(item);
          }
        });
      } else {
        this.rankData.members = this.rankData.members.concat(list);
      }
      this.rankData.members = this.rankData.members.filter(item => {
        return this.containsItem(selectionKeys, item.id);
      });
    },
    handleConfirmed1(selectionKeys, selections) {
      console.log(2222);
      let list = [];
      for (const iterator of selectionKeys) {
        this.selectionList1.forEach(item => {
          if (item.id === iterator) {
            list.push({
              id: iterator,
              name: item.name,
              nickName: item.nickName
            });
          }
        });
      }
      if (this.rankData.members1 && this.rankData.members1.length) {
        list.forEach(item => {
          if (!this.containsItem(this.rankData.members1, item.id)) {
            this.rankData.members1.push(item);
          }
        });
      } else {
        this.rankData.members1 = this.rankData.members1.concat(list);
      }
      this.rankData.members1 = this.rankData.members1.filter(item => {
        return this.containsItem(selectionKeys, item.id);
      });
    },
    containsItem(ary, id) {
      let contain = false;
      ary.forEach(item => {
        if (item.id) {
          if (item.id === id) {
            contain = true;
            return false;
          }
        } else {
          if (item === id) {
            contain = true;
            return false;
          }
        }
      });
      return contain;
    },
    dialogFilterDataChange() {
      this.dialogPagination.currentPage = 1;
      this.queryPeople();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryPeople();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryPeople();
    }
  },
  created() {
    this.getVipCount();
  }
};
</script>

<style lang="scss">
.rank-dialog-selector {
  .el-dialog {
    width: 80%;
  }
  .el-dialog__header {
    text-align: center;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
.rank-item {
  font-size: 12px;
  .platform-tags {
    display: block;
    float: left;
  }
  .biz-save-button {
    float: left;
  }
  .show-more {
    color: coral;
  }
  .nick-name-container {
    max-height: 80px;
    overflow: hidden;
    .nick-name-title {
      float: left;
      width: 100px;
      margin-right: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: 20px;
    }
  }
  .color {
    color: #ff7300;
    cursor: pointer;
  }
  .nick-name-container-show {
    .nick-name-title {
      float: left;
      width: 100px;
      margin-right: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 10px 0px;
    }
  }
  .btn-style {
    margin-right: 10px;
  }
}
</style>
