<template>
  <div class="staff-mgmt-admin-mgmt">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @sort-change="handleSortChange">
      <!-- 员工信息 -->
      <el-table-column min-width="160" prop="info" label="用户信息">
        <div slot-scope="scope">
          <div class="customer-info">
            <img :src="scope.row.head ? scope.row.head : Img" alt />
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
        </div>
      </el-table-column>
      <!-- 角色 -->
      <el-table-column min-width="80" prop="roleDatas" label="角色">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{roleFormatter(scope.row)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="isEnabled" label="状态" min-width="60">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.isEnabled === '1' ? '启用' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isEnabled" label="关联门店" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.supplier?scope.row.supplier.name:''}}</div>
            <div class="overflow">{{scope.row.agent?scope.row.agent.name:''}}</div>
          </div>
        </template>
      </el-table-column>
      <!-- 所属店铺 -->
      <el-table-column prop="shop.name" label="所属店铺" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shop.name}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="登录信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              最后登录地址：{{ scope.row.loginAddress === 'null' ? '' : scope.row.loginAddress}}
            </div>
            <div class="overflow">
              最后登录时间：{{scope.row.loginDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="option" label="操作" min-width="100">
        <template slot-scope="scope" v-if="scope.row.unionConfig.editable === '1' || getUser.roleLevel !== 'shop'">
          <!-- <el-button size="mini" type="text" @click.stop="changeState(scope.row)">{{ scope.row.isEnabled === '0' ? '启用' : '停用' }}</el-button> -->
          <el-button size="mini" type="text" @click.stop="del(scope.row.masterId)" v-if="hasAuthDel">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <base-info ref="baseInfo" :isEdit="isEdit" :itemId="currentRowId" :shopId="shopId ? shopId : ''" :type="type"
          @created="refresh"></base-info>
      </el-tab-pane>
      <el-tab-pane v-if="currentRowId !== ''" label="修改密码" name="second">
        <pass-modify :id="currentRowId" :isEdit="isEdit" :masterId="masterId" @created="refresh"></pass-modify>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openAdd" @close="openAdd = false" v-model="tabName" class="add-member-popup">
      <el-tab-pane label="注册新用户" name="first">
        <base-info ref="addBaseInfo" :isEdit="isEdit" :id="currentRowId" :shopId="shopId ? shopId : ''" :type="type"
          @created="refresh"></base-info>
      </el-tab-pane>
      <el-tab-pane label="选择已注册用户" name="second">
        <select-member ref="selectMember" :isEdit="isEdit" :id="currentRowId" :shopId="shopId ? shopId : ''" :type="type"
          @created="refresh"></select-member>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './BaseInfo';
import SelectMember from './SelectMember';
import PassModify from './PassModify';
import Img from '@/assets/images/default_user.png';
import AdminMgmt from '@/service/staff-mgmt/adminMgmt';
import http from '@/common/http';
import { global } from '@/common/urls';
import { mapGetters } from 'vuex';
export default {
  name: 'AdminMgmt',
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    PassModify,
    SelectMember
  },

  data() {
    return {
      editShopIds: [],
      isEdit: true,
      isInit: true,
      // 排序
      orderProperty: '',
      orderDirection: '',
      Img: Img,
      open: false,
      openAdd: false,
      tabName: 'first',
      message: '',
      currentRowId: '',
      masterId: '',
      roleIds: [],
      // 当前父级shopId或当前角色shopId
      shopId: '',
      type: '',
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:admin.add'] },
        { label: '删除', name: 'del', type: '', disabled: true, auth: ['admin:admin.delete'] },
        { label: '刷新', name: 'refresh', type: '' }
      ],
      filters: [
        {
          type: 'select',
          placeholder: '请选择状态',
          label: '状态',
          value: '',
          options: [{ label: '全部', value: '' }, { label: '启用', value: '1' }, { label: '停用', value: '0' }]
        },
        {
          type: 'select',
          placeholder: '请选择所属店铺',
          label: '所属店铺',
          value: '',
          options: [],
          filterable: true
        },
        {
          type: 'select',
          placeholder: '请选择角色',
          label: '角色',
          filterable: true,
          multiple: true,
          collapseTags: true,
          value: [],
          options: []
        },
        {
          type: 'input',
          placeholder: '请输入姓名/手机号',
          name: 'searchbar',
          value: ''
        }
      ],
      isEnabled: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      multiSelected: []
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:admin.delete');
    }
  },
  created() {
    this.refresh();
    this.getRoleList();
    this.getEditableStores();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    selectAble(row) {
      return this.getUser.roleLevel !== 'shop' || row.unionConfig.editable === '1';
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '0'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getRoleList() {
      http
        .get('/admin/role/roleList.jhtml', {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.roleList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    // 按钮'添加'
    add() {
      this.currentRowId = '';
      this.shopId = this.$route.query.parentId || '';
      this.type = this.$route.query.type || '';
      console.log('parentId: ', this.shopId);
      this.tabName = 'first';
      this.$refs.addBaseInfo.refresh('');
      this.isEdit = true;
      this.open = false;
      this.openAdd = true;
      this.$refs.selectMember.clearSearchValue();
      this.$refs.selectMember.tableData = [];
    },
    // 按钮'删除'
    del(id) {
      // 删除管理员
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
          masterIds: ids
        };
        http
          .delete('/admin/admin/mgmt/admin.jhtml', params)
          .then(data => {
            this.$message.success('操作成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            this.$message.warning(errData.errorMessage);
          });
      });
    },
    // 搜索
    filterDataChange(val) {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.refresh();
    },
    // 获取所有店铺
    getShopList() {
      let params = {
        shopId: this.shopId,
        sourceType: '0'
      };
      AdminMgmt.getShopList(
        params,
        data => {
          let shopList = [{ label: '全部', value: '' }].concat(
            data.shops.map(shop => {
              return { label: shop.name, value: shop.id };
            })
          );
          this.filters[1].options = shopList;
        },
        ErrorData => {}
      );
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.masterId);
      });
    },
    rowClick(row) {
      if (this.getUser.roleLevel === 'shop' && row.unionConfig.editable === '0') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.currentRowId = row.id;
      this.masterId = row.masterId;
      this.shopId = row.shopId;
      this.tabName = 'first';
      this.$refs.baseInfo.refresh(row.id, row.masterId);
      this.openAdd = false;
      this.open = true;
    },
    close() {
      this.open = false;
    },
    // 修改状态
    changeState(row) {
      row.isEnabled === '0' ? (row.isEnabled = '1') : (row.isEnabled = '0');
      this.updated(row);
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.isEnabled === '1') {
        // 启用
        return '#11AE17';
      } else {
        // 停用
        return '#FF7300';
      }
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
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    // 更新状态
    updated(row) {
      let params = {
        id: row.id,
        isEnabled: row.isEnabled,
        masterId: row.masterId
      };
      AdminMgmt.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_UPDATE: ', ErrorData);
        }
      );
    },
    // 刷新列表
    refresh() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[3].value,
        roleIds: this.filters[2].value.join('&roleIds='),
        shopId: this.$route.query.type === 'shop' ? this.$route.query.parentId : '',
        searchShopId: this.filters[1].value || '',
        isEnabled: this.filters[0].value,
        parentId: this.$route.query.parentId || '',
        type: this.$route.query.type || '',
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/admin/mgmt/adminList.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
          // 第一次查询的时候提示
          if (this.isInit) {
            this.showMessage(`管理员累计 ${this.pagination.total} 名`, 'info');
            this.isInit = false;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 修改角色格式
    roleFormatter(row, column) {
      let format = [];
      row.roleDatas.map(role => {
        format = format.concat(role.name);
      });
      return format.join(',');
    }
  },
  watch: {},
  mounted() {
    this.shopId = this.$route.query.parentId || '';
    this.type = this.$route.query.type || '';
    this.getShopList();
    // 21227问题
    if (this.type) {
      document.querySelectorAll('.filter-wrap')[1].style.display = 'none';
    }
  }
};
</script>

<style lang="scss">
// .add-member-popup {
//   .popup-content {
//     width: 720px;
//   }
// }
.staff-mgmt-admin-mgmt {
  img {
    height: 40px;
    width: 40px;
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
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 170px;
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
