<template>
  <biz-dialog-selector
    slot="float"
    title="成员选择"
    :visibility.sync="showDialog"
    :loading="dialogLoading"
    :tableData="dialogTableData"
    :pagination="dialogPagination"
    :keyField="'id'"
    :selectionKeys="selectionKeys"
    :rowClassName="setClassName"
    :filters="dialogFilters"
    :memberIds="memberIds"
    @confirmed="confirmedHandler"
    @open="openedHandler"

    @filterDataChange="dialogFilterDataChange"
    @pageSizeChange="dialogPageSizeChange"
    @currentPageChange="dialogCurrentPageChange"

    class="motor-club-mgmt__people-picker"
  >
    <el-table-column prop="member.name" label="用户名">
      <template slot-scope="scope">
        <div class="customer-info">
          <img v-if="scope.row.head" :src="scope.row.head" />
          <img v-else src="../../../../assets/images/default_user.png" />
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
    <el-table-column prop="mobile" label="手机号">
    </el-table-column>
  </biz-dialog-selector>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';

import { motorClubMgmt as service } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'MotorClubPeoplePicker',
  components: {
    BizDialogSelector
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array
    },
    memberIds: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      showDialog: false,
      dialogLoading: false,
      selectionKeys: [],
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
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
      ]
    };
  },
  computed: {
    textComputed () {
      return '已选择 ' + (this.value ? this.value.length : '0') + ' 人';
    }
  },
  methods: {
    getMotorcadeId () {
      return this.$route.params.groupId;
    },
    setClassName({ row, index }) {
      return this.memberIds.includes(row.id) ? 'disabled-row' : '';
    },
    queryVehicles (params) {
      this.dialogLoading = true;
      this.selectionKeys = [];
      http.get(service.baseInfo.queryMember, params)
        .then(data => {
          this.dialogTableData = data.memberDatas;

          this.$set(this.dialogPagination, 'total', parseInt(data.total));

          return data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);

          return errData;
        })
        .finally(data => {
          this.dialogLoading = false;

          return data;
        });
    },

    clickHandler (e) {
      this.showDialog = true;
    },
    confirmedHandler (selectionKeys, selections) {
      // this.$emit('input', selectionKeys);
      this.$emit('on-confirm', selectionKeys);
      this.selectionKeys = [];
    },
    getDialogQueryParams () {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,

        userSource: '',
        state: '',
        searchValue: this.dialogFilters[0].value,
        searchShopId: '',
        shopId: window.top.SHOP_IP || ''
      };
    },
    openedHandler () {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [{
        type: 'input',
        label: '',
        placeholder: '请输入姓名/手机号',
        name: 'searchValue',
        value: ''
      }];
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogFilterDataChange (filters) {
      this.$set(this.dialogPagination, 'currentPage', 1);
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogPageSizeChange (val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogCurrentPageChange (val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryVehicles(this.getDialogQueryParams());
    }
  }
};
</script>

<style lang="scss">
.motor-club-mgmt__people-picker {
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
      height: 45px;
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
</style>
