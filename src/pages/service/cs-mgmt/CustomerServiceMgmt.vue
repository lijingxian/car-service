<template>
  <div class="customer-service-cs-mgmt">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <!-- 客服信息 -->
      <el-table-column min-width="250" prop="info" label="客服信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
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
      <!-- 权限 -->
      <el-table-column min-width="150" prop="level" label="权限">
        <template slot-scope="scope">
          {{scope.row.level === '0' ? '客服' : '主管'}}
        </template>
      </el-table-column>
      <!-- 分组 -->
      <el-table-column min-width="250" prop="group" label="分组">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{groupFormatter(scope.row)||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 接待数 -->
      <el-table-column min-width="150" prop="receptnumber" label="接待数">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="option" label="操作" width="100">
        <template slot-scope="scope" v-if="hasAuthDel">
          <el-button size="mini" type="text" style="color: red" @click.stop="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <base-info :itemId="currentRowId" ref="baseInfo" @created="refresh"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import Img from '@/assets/images/default_user.png';
import BaseInfo from './CustomerServiceBaseInfo';
import { mapGetters } from 'vuex';
import service from '@/service/customer-service/csMgmt.js';

export default {
  name: 'CSMgmt',
  data() {
    return {
      Img: Img,
      open: false,
      tabName: 'first',
      currentRowId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:customerServiceMember.add'] },
        { label: '删除', name: 'del', type: '', disabled: true, auth: ['admin:customerServiceMember.delete'] }
      ],
      filters: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      multiSelected: []
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    ...mapGetters(['currentUser']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:customerServiceMember.delete');
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    add() {
      this.currentRowId = { id: '' };
      this.tabName = 'first';
      this.open = true;
    },
    // 按钮'删除'
    del(id) {
      // 删除客服
      // 传入id为单个删除,否则为批量删除
      let ids = id ? Array(id) : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        console.log('params: ', params);
        service.delete(
          params,
          data => {
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('ERR_DELETE: ', ErrorData);
          }
        );
      });
    },
    refresh() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.$route.query ? this.$route.name : '',
        storeId: this.currentUser.shop.id,
        hierarchyId: '1'
      };
      service.queryList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '店铺不存在') {
            this.$message.warning(ErrorData.errorMessage);
            console.log('ERR_REFRESH: ', ErrorData);
          }
        }
      );
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
      this.operations.map(item => {
        if (item.name === 'del') {
          item.disabled = true;
        }
        if (val.length > 0) {
          if (item.name === 'del') {
            item.disabled = false;
          }
        }
      });
    },
    rowClick(row) {
      this.currentRowId = { id: row.id };
      this.shopId = row.shopId;
      this.tabName = 'first';
      // this.$refs.baseInfo.refresh(row.id);
      this.open = true;
    },
    close() {
      this.open = false;
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    groupFormatter(row, column) {
      let tmp = row.csGroupList.map(group => {
        return group.name;
      });
      return tmp.join();
    },
    filterDataChange() {}
  },
  mounted() {
    this.showMessage('对客服人员进行增删改', 'info');
    this.refresh();
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo
  }
};
</script>

<style lang="scss">
.customer-service-cs-mgmt {
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
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
  .btnBorder {
    width: 56px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
}
</style>
