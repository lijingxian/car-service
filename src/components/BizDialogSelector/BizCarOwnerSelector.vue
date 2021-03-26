<template>
  <div class="biz-car-owner-selector">
    <biz-dialog-selector title="选择车主" selectionMode="single" :visibility="visibility" @update:visibility="updateVisibility" :tableData="tableData" :pagination="pagination"
      :filters="filters" :selectionKeys="selectionKeys" @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange"
      @confirmed="confirmedDriver" @filterDataChange="filterDataChange" :isClear="isClear" class="memberDialog">
      <el-table-column label="用户信息" width="200px">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../assets/images/default_user.png" />
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
      <el-table-column label="状态" :formatter="stateConverter"></el-table-column>
      <el-table-column prop label="店铺名称">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from './BizDialogSelector.vue';
import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';

export default {
  name: 'BizCarOwnerSelector',
  props: {
    visibility: {
      require: true,
      type: Boolean
    },
    isClear: {
      type: Boolean
    },
    selectionKeys: {
      type: Array,
      default() {
        return [];
      }
    }
    // 查询链接,默认车主选择列表
    // url: {
    //   type: String,
    //   default: '/admin/maintenance/queryMemberPage.jhtml'
    // }
  },
  data () {
    return {
      url: '/admin/maintenance/queryMemberPage.jhtml',
      filters: [
        {
          type: 'input',
          placeholder: '请输入姓名/手机/车辆识别代码/车牌号搜索',
          name: 'searchbar',
          value: ''
        }
      ],
      tableData: [],
      pagination: this.resetPagination()
    };
  },
  methods: {
    stateConverter(row) {
      if (row.enableState === '0') return '停用';
      else if (row.enableState === '1') return '启用';
      else return '--';
    },
    // vibility.sync -> :visibility + @update:visibility
    updateVisibility(val) {
      this.$emit('update:visibility', val);
    },
    resetPagination() {
      return {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      };
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryDriverList();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryDriverList();
    },
    // key: 选中的id, val: 选中的信息对象
    confirmedDriver(key, val) {
      this.$emit('confirmed', key, val);
    },
    filterDataChange(val) {
      this.filters = val;
      this.pagination = this.resetPagination();
      this.queryDriverList();
    },
    queryDriverList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.filters[0].value
      };
      this.getList(
        params,
        data => {
          this.pagination.total = Number(data.total);
          this.tableData = data.datas;
        },
        ErrorData => {
          console.log('ERR_GET_DRIVER_LIST: ', ErrorData);
        }
      );
    },
    getList(params, success, fail) {
      axios
        .get(this.url, { params: params })
        .then(responseHandle(success, fail))
        .catch(error => {
          console.error(error);
        });
    }
  },
  components: {
    BizDialogSelector
  },
  watch: {
    visibility(newVal, oldVal) {
      this.$emit('update:visibility', newVal);
      if (newVal) {
        this.pagination = this.resetPagination();
        this.queryDriverList();
      }
    }
  }
};
</script>

<style lang="scss">
.memberDialog {
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
