<template>
  <div class="member-mgmt-list-view">
    <BizList ref="table" :height="height" :tableData="cardList" @handleSelectionChange="handleSelectionChange"
      @rowClick="rowClick(arguments)" @filterChange="filterChange">
      <el-table-column type="selection" width="50" :selectable="selectAble">
      </el-table-column>
      <el-table-column min-width="200" label="会员卡信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.memberRank&&scope.row.memberRank.image" :src="scope.row.memberRank.image" />
            <img v-else :src="defaultImg" />
            <div class="wrapper">
              <div class="title">{{scope.row.template.name}}</div>
              <div class="gender">{{scope.row.sn}}</div>
              <div class="gender">{{scope.row.memberRank?scope.row.memberRank.name:''}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员信息" min-width="160">
        <template slot-scope="scope">
          <div class="customer-info" @click.stop="memberClick(scope.row)">
            <img v-if="scope.row.member.head" :src="scope.row.member.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title overflow" :title="scope.row.member.name">{{scope.row.member.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                <span>{{scope.row.member.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="所属店铺" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shop.name || '--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bean" label="V豆" min-width="80">
        <div slot-scope="scope">
          <div>
            {{scope.row.bean || '--'}}
          </div>
          <el-button type="text" size="mini" @click.stop="adjustment('beanAdd',scope.row)"
            v-if="getUser.roleLevel !== 'shop'||isEdit&&scope.row.unionConfig.editable === '1'">
            充值
          </el-button>
          <el-button type="text" size="mini" @click.stop="adjustment('beanCon',scope.row)"
            v-if="getUser.roleLevel !== 'shop'||isEdit&&scope.row.unionConfig.editable === '1'">
            消费
          </el-button>
        </div>
      </el-table-column>
      <el-table-column prop="point" label="积分" min-width="80">
        <div slot-scope="scope">
          <div>
            {{scope.row.point || '--'}}
          </div>
          <el-button type="text" size="mini" @click.stop="adjustment('pointAdd',scope.row)"
            v-if="getUser.roleLevel !== 'shop'||isEdit&&scope.row.unionConfig.editable === '1'">
            充值
          </el-button>
          <el-button type="text" size="mini" @click.stop="adjustment('pointCon',scope.row)"
            v-if="getUser.roleLevel !== 'shop'||isEdit&&scope.row.unionConfig.editable === '1'">
            消费
          </el-button>
        </div>
      </el-table-column>
      <el-table-column prop="balance" label="余额" min-width="80">
        <div slot-scope="scope">
          <div>
            {{scope.row.balance || '--'}}
          </div>
          <el-button type="text" size="mini" @click.stop="adjustment('payment',scope.row)"
              v-if="getUser.roleLevel !== 'shop'||isEdit&&scope.row.unionConfig.editable === '1'">
              充值
            </el-button>
            <el-button type="text" size="mini" @click.stop="adjustment('charge',scope.row)"
              v-if="getUser.roleLevel !== 'shop'||isEdit&&scope.row.unionConfig.editable === '1'">
              消费
            </el-button>
        </div>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="60">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{scope.row.state==='1'?'启用':'停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" prop="date" label="操作">
        <template #default="scope">
          <biz-column-operation :row="scope.row" v-if="scope.row.unionConfig.editable === '1'||getUser.roleLevel !== 'shop'">
            <el-button type="text" size="mini" @click.stop="distributeRights(scope.row)" v-if="hasAuthRightsout">
              发放权益
            </el-button>
            <el-button type="text" size="mini" @click.stop="deleteLine(scope.row)" v-if="hasAuthDel">
              删除
            </el-button>
            <el-button type="text" size="mini" @click.stop="transfer(scope.row)">
              转让
            </el-button>
          </biz-column-operation>
      </template>
      </el-table-column>
    </BizList>
    <el-dialog title="转让" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <el-form-item label="当前会员">
          <el-input v-model="form.currentMember" disabled></el-input>
        </el-form-item>
        <el-form-item label="转让会员">
          <el-input v-model="form.member.name" @focus="queryPeople"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <biz-dialog-selector title="选择会员" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :selectionMode="'single'" :filters="dialogFilters" @confirmed="handleConfirmed" @operate="dialogOperate"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="userName" label="会员信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title" :title="scope.row.name">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile||scope.row.contactMobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="状态">
        <template slot-scope="scope">
          {{getStatus(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="店铺">
        <template slot-scope="scope">
          {{scope.row.shop.name}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="最后登录">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.lastLoginIp}}
            </div>
            <div class="overflow">
              {{scope.row.lastLoginDate}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import { BizList } from '@/components/BizTable';
import defaultImg from '@/assets/images/icon_vip.png';
import { mapGetters } from 'vuex';
import BizDialogSelector from './components/BizDialogSelector';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'MemberMgmtListView',
  data() {
    return {
      defaultImg: defaultImg,
      dialogVisible: false,
      dialogLoading: true,
      dialogTableData: [],
      selectionKeys: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      form: {
        currentMember: '',
        member: {},
        cardId: ''
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
      showDialog: false
    };
  },
  props: {
    height: String,
    cardList: Array,
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    editShopIds: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    BizList,
    BizDialogSelector
  },
  mixins: [ColumnsMixin],
  created() {},
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:memberCard.delete');
    },
    hasAuthRightsout() {
      // return true;
      return this.currentAuth.includes('admin:memberCard.rightsout');
    }
  },
  mounted() {},
  methods: {
    transfer(row) {
      this.form.currentMember = row.member.name;
      this.form.cardId = row.id;
      this.form.member.name = '';
      this.dialogVisible = true;
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.member = selections[0];
    },
    confirm() {
      let params = {
        member: this.form.member.id,
        cardId: this.form.cardId
      };
      http
        .put('/admin/memberCard/memberCard/transfer.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('created');
          this.dialogVisible = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    queryPeople() {
      this.showDialog = true;
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
      service.queryPeople(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }

      return '';
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryPeople();
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryPeople();
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryPeople();
    },
    dialogOperate(name) {},
    selectAble(row) {
      return this.getUser.roleLevel !== 'shop' || (this.isEdit && row.unionConfig.editable === '1');
    },
    // // 状态文字颜色
    // stateColor(row) {
    //   if (row.state === '1') {
    //     // 启用
    //     return '#67c23a';
    //   } else {
    //     // 停用
    //     return '#f56c6c';
    //   }
    // },
    operationSuccess() {
      this.$emit('create');
    },
    rowClick() {
      if (arguments[0][2].property === 'state') {
        return false;
      }
      this.$emit('rowClick', arguments[0][0]);
    },
    memberClick(model) {
      this.$emit('memberClick', model);
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
    deleteLine(val) {
      this.$emit('deleteLine', val);
    },
    active(val) {
      this.$emit('active', val);
    },
    distributeRights(val) {
      this.$emit('distributeRights', val);
    },
    adjustment(val, row) {
      this.$refs.table.$refs.table.setCurrentRow(row);
      this.$emit('adjustment', val, row);
    },
    filterChange() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    }
  }
};
</script>
<style lang="scss">
.member-mgmt-list-view {
  height: 100%;
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: 100%;
    overflow: auto;
    .el-button {
      margin-left: 10px;
    }
  }
  .customer-info {
    img {
      position: absolute;
      top: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .title {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
