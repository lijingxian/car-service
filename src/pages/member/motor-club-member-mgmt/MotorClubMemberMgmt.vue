<template>
  <div class="motor-club-member-mgmt" v-loading="loading">
    <!-- <div slot="top" class="vehicle-mgmt-all-vehicle__header">
      <el-radio-group v-model="showMode" size="small">
        <el-radio-button label="0">地图位置</el-radio-button>
        <el-radio-button label="1">成员列表</el-radio-button>
      </el-radio-group>
    </div> -->
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :tableData="tableData" :loading="loading" :pagination="pagination"
      @operate="handleOperate" @size-change="handleSizeChange" @current-change="handleCurrentChange" @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange" :views="views" @onSwitch="onViewSwitch">
      <el-table-column label="会员信息" min-width="340">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <el-button class="title" type="text" @click="handleMemberClick($event, scope.row)">{{scope.row.name}}</el-button>
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
      <el-table-column prop="mobile" label="手机号" min-width="110px">
      </el-table-column>
      <el-table-column prop="lastLoginDate" label="上次活跃时间" min-width="110px" :formatter="activeDate">
      </el-table-column>
      <el-table-column prop="joinDate" label="加群时间" min-width="110px" :formatter="addDateConverter">
      </el-table-column>
      <el-table-column prop="loginCount" label="活跃次数" min-width="100px">
      </el-table-column>
      <el-table-column prop="fleetActCount" label="参与活动次数" min-width="100px">
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="60px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleDeleteClick($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-store-map :value="tableData" v-show="showMode === '0'" class="map_position">
    </biz-store-map>
    <motor-club-people-picker slot="float" v-show="false" ref="memberPicker" @on-confirm="handleConfirm"></motor-club-people-picker>
    <biz-popup-tabs :open="memberInfo" @close="memberInfo=false" v-model="memberName">
      <el-tab-pane label="基本信息" name="Info">
        <membership-mgmt-base-info :itemId="memberId" ref="memberInfo"></membership-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="车辆信息" name="carInfo">
        <membership-mgmt-vehicle-info :itemId="memberId" ref="carInfo"></membership-mgmt-vehicle-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizStoreMap } from '@/components/BizStoreMap';
import MotorClubPeoplePicker from '../motor-club-mgmt/Component/MotorClubPeoplePicker';
import MembershipMgmtBaseInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import { motorClubMemberMgmt as service } from '@/common/urls';
import http from '@/common/http';
import urlUtil from '@/utils/url';
import dateUtil from '@/utils/date';
import { BizPopupTabs } from '@/components/BizPopup';

// 基础信息
const baseData = {
  data: {
    showMode: '1'
  },
  methods: {
    queryKpi() {
      this.query().then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `该车友会现有成员${data.total}名，您可点击会员条目查看详细信息`,
          duration: 3000
        });
      });
    }
  },
  events: {}
};

// Table相关
const dataTable = {
  data: {
    loading: false,
    memberInfo: false,
    memberName: 'Info',
    memberId: { id: '' },
    tableData: [],
    selections: [],
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary'
      },
      {
        label: '删除',
        name: 'delete',
        type: '',
        disabled: true
      },
      {
        label: '刷新',
        name: 'refresh',
        type: ''
      },
      {
        label: '签到管理',
        name: 'signin',
        type: 'primary'
      }
    ],
    views: [
      {
        actived: true,
        class: 'iconfont biz-icon-liebiaoshitu',
        name: 'list'
      },
      {
        actived: false,
        class: 'iconfont biz-icon-tongjishitu',
        name: 'chart'
      }
    ],
    pagination: {
      pageSize: 20,
      currentPage: 1,
      total: 0
    },
    filters: [
      {
        type: 'input',
        label: '',
        placeholder: '请输入会员姓名/手机号',
        name: 'searchValue',
        value: ''
      }
    ]
  },
  methods: {
    add() {
      // this.$refs.memberPicker.selectionKeys = this.formModel.memberIds;
      this.$refs.memberPicker.showDialog = true;
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
    onViewSwitch(name) {
      if (name === 'list') {
        this.showMode = '1';
        this.views[0].actived = true;
        this.views[1].actived = false;
        this.$refs.table.$refs.table.isHidden = false;
      } else {
        this.showMode = '0';
        this.views[1].actived = true;
        this.views[0].actived = false;
        this.$refs.table.$refs.table.isHidden = true;
      }
    },
    refresh() {
      this.query();
    },
    signin() {
      this.$router.push({
        path: `/member/motor-club/signup/${this.$route.params.fleetId}`
      });
    },

    // 查询
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',

        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.filters[0].value,

        fleetId: this.$route.params.fleetId
      };
    },
    // 点击会员名字跳转会籍管理
    handleMemberClick(e, row) {
      e.stopPropagation();
      this.memberId = { id: row.id };
      this.memberInfo = true;
      console.log(row);
      // this.$router.push({
      //   path: '/member/membership-mgmt',
      //   query: {
      //     mobile: row.mobile
      //   }
      // });
    },
    query() {
      this.loading = true;

      return http
        .get(service.listPage.list, this.getQueryParams())
        .then(data => {
          this.tableData = data.memberList;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));

          return data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }

          return errData;
        })
        .finally(data => {
          this.loading = false;

          return data;
        });
    },

    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = urlUtil.toURLParams({
          fleetId: this.$route.params.fleetId,
          ids: ids
        });
        http
          .post(service.listPage.delete + params, {})
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },

    // converter
    activeDate(row) {
      if (!row.lastLoginDate) return '--';

      let date = new Date(row.lastLoginDate);
      return dateUtil.dateConverter(date);
    },
    addDateConverter(row) {
      if (!row.joinDate) return '--';

      let date = new Date(row.joinDate);
      return dateUtil.dateConverter(date);
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    },
    handleSizeChange(val) {
      this.$set(this.pagination, 'pageSize', val);
      this.$set(this.pagination, 'currentPage', 1);
      this.query();
    },
    handleCurrentChange(val) {
      this.$set(this.pagination, 'currentPage', val);
      this.query();
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.selections = val;
    },
    handleFilterDataChange() {
      this.pagination.currentPage = 1;
      this.query();
    },

    handleDeleteClick(e, model) {
      this.deleteItem([model.id]);
    }
  }
};

// 添加相关
const dataAdd = {
  methods: {
    addMember(keys) {
      this.loading = true;
      let params = urlUtil.toURLParams({
        memberIds: keys.join(','),
        fleetId: this.$route.params.fleetId
      });
      http
        .post(service.listPage.addMember + params, {})
        .then(data => {
          this.$message.success('添加成功');
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
    }
  },
  events: {
    handleConfirm(keys) {
      this.addMember(keys);
    }
  }
};

export default {
  name: 'MotorClubMemberMgmt',
  components: {
    BizFlexTable,
    MotorClubPeoplePicker,
    BizStoreMap,
    BizPopupTabs,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo
  },
  data() {
    return {
      ...baseData.data,
      ...dataTable.data
    };
  },
  methods: {
    ...dataTable.methods,
    ...dataTable.events,

    ...baseData.methods,
    ...baseData.events,

    ...dataAdd.methods,
    ...dataAdd.events
  },
  mounted() {
    this.queryKpi();
  },
  watch: {
    showMode(val) {
      if (val === '0') {
        this.refresh();
      } else {
        this.$refs.table.doLayout();
      }
    },
    $route(to, from) {
      this.query();
    }
  }
};
</script>

<style lang="scss">
.motor-club-member-mgmt {
  height: 100%;
  .vehicle-mgmt-all-vehicle__header {
    text-align: right;
    padding: 5px 10px 0;
  }
  .map_position {
    padding-top: 40px;
  }
  .title {
    white-space: pre-wrap;
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
</style>
