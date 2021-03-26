<template>
  <div class="membership-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      ref="table"
      :operations="operations"
      :filters="filters"
      :tableData="tableDataHandle"
      :loading="loading"
      :pagination="pagination"
      @operate="handleOperate"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @cascader-change="cascaderChange"
    >
      <template slot="operation" v-if="hasAuthImport">
        <import-file
          :tableData="importResult"
          :importLoading="importLoading"
          :total="total"
          :disabled="disabled"
          :count="count"
          :percentage="percentage"
          @clearTimeOut="clearTimeOut"
          @restProcess="restProcess"
          :stepkey="stepkey"
          :action="'/admin/member/importMember.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
        >
          <el-table-column label="序号" prop="line" width="50"></el-table-column>
          <el-table-column label="结果" width="100">
            <template slot-scope="scope">{{scope.row.result?'导入失败':''}}</template>
          </el-table-column>
          <el-table-column label="消息" prop="result"></el-table-column>
          <!-- <el-table-column label="操作">
          </el-table-column>-->
        </import-file>
      </template>
      <el-table-column label="会员信息" min-width="160">
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
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" prop="enableState">
        <template slot-scope="scope">{{scope.row.enableState==='1'?'启用':'停用'}}</template>
      </el-table-column> -->
      <el-table-column prop="shops" label="所属店铺" min-width="120">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shops" label="车辆" min-width="120">
        <template slot-scope="scope"><div @click.stop="carClick(scope.row)">{{scope.row.cars&&scope.row.cars.length>0?scope.row.cars[0].plateNumber:'--'}}</div></template>
      </el-table-column>
      <el-table-column prop="lastLoginDate" label="终端" sortable="custom" min-width="120">
        <template slot-scope="scope"><el-button type="text" size="mini" @click.stop="terminalClick(scope.row)">{{scope.row.terminals&&scope.row.terminals.length>0?scope.row.terminals[0].name:'--'}}</el-button></template>
      </el-table-column>
      <el-table-column label="围栏" prop="fenceCount">
        <template slot-scope="scope"><el-button type="text" size="mini" @click.stop="fenceClick(scope.row)">{{scope.row.fenceCount}}</el-button></template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleDeleteClick($event, scope.row)"
            v-if="(scope.row.unionConfig.editable === '1'||getUser.roleLevel !== 'shop')&&hasAuthDel"
          >删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <right-popup
        :open="open"
        ref="popup"
        :itemId="itemId"
        :isAssets="true"
        @close="open = false;"
        :isEdit="flag"
        :storeId="storeId"
        @operationSuccess="handlePopupSuccess"
      ></right-popup>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="分配顾问">
      <el-select v-model="adminId" placeholder="请选择">
        <el-option v-for="item in filters[4].options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { ImportFile } from '@/components/BizUpload';
import RightPopup from './MembershipMgmt/MembershipMgmtPopup';
import { membershipMgmt as service, global, systemSetting } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
// 基础属性
const dataBase = {
  data: {
    editShopIds: [],
    storeId: [],
    isEdit: true,
    dialogVisible: false,
    adminId: ''
  },
  methods: {
    queryShopList() {
      http
        .get(service.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '5'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[1], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
        });
    },

    isContained(aa, bb) {
      let flag = false;
      for (let i = 0; i < bb.length; i++) {
        if (aa.indexOf(bb[i].id) !== -1) {
          flag = true;
        }
      }
      return flag;
    },
    getConsultant() {
      this.loading = true;
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['afterSaleAdmin', 'afterSale']
        })
        .then(data => {
          this.filters[4].options = [{ label: '请选择', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '5'
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
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  }
};
// Table相关
const dataTable = {
  data: {
    loading: false,
    curTagName: '',
    tableData: [],
    flag: true,
    showRecommend: false,
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary',
        disabled: false,
        class: 'hidden',
        auth: ['admin:member.add']
      },
      {
        label: '删除',
        name: 'delete',
        type: '',
        disabled: true,
        auth: ['admin:member.delete']
      },
      {
        label: '刷新',
        name: 'refreshList',
        type: ''
      },
      {
        label: '模板下载',
        name: 'download',
        type: '',
        auth: ['admin:member.import']
      },
      {
        label: '分配',
        name: 'distribute',
        type: '',
        auth: ['admin:member.distribution']
      }
    ],
    filters: [
      {
        type: 'select',
        label: '状态',
        name: 'state',
        value: '',
        class: 'hidden',
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '停用'
          },
          {
            value: '1',
            label: '启用'
          }
        ]
      },
      {
        type: 'select',
        label: '店铺名称',
        name: 'shopName',
        value: '',
        class: 'hidden',
        options: []
      },
      {
        type: 'cascader',
        label: '会员标签',
        name: 'memberTag',
        changeOnSelect: false,
        filterable: false,
        value: [''],
        class: 'hidden',
        options: []
      },
      {
        type: 'select',
        label: '挪车码',
        name: 'moveCarCode',
        value: '',
        class: 'hidden',
        options: [
          { label: '全部', value: '' },
          { label: '未发放', value: '0' },
          { label: '已发放', value: '1' }
        ]
      },
      {
        type: 'select',
        label: '专属顾问',
        name: 'consultant',
        value: '',
        class: 'hidden',
        options: []
      },
      {
        type: 'input',
        label: '',
        placeholder: '请输入姓名/手机号/车辆识别代码/车牌号',
        name: 'searchValue',
        value: ''
      }
    ],
    pagination: {
      pageSize: 20,
      currentPage: 1,
      total: 0
    },
    sortInfo: {}
  },
  methods: {
    // 查询
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        moveCarCode: this.filters[3].value,
        state: this.filters[0].value,
        searchShopId: this.filters[1].value,
        tag: this.curTagName,
        searchValue: this.filters[5].value,
        consultantId: this.filters[4].value,
        orderProperty: this.sortInfo.column,
        orderDirection: this.sortInfo.sort,

        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
    },
    getKpi() {
      http
        .get('/admin/member/queryNavigationKpi.jhtml', {})
        .then(data => {
          let msg =
            '共有会员' + data.data.memberCount + '人，今日新增' + data.data.memberInsCount + '人，您可在此页查看/编辑其基础信息;';
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          // this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    query() {
      this.loading = true;
      let param = this.getQueryParams();
      http
        .get(service.mainPage.list, param)
        .then(data => {
          this.tableData = data.content;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage !== '店铺不存在') this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh() {
      this.query();
    },
    refreshList() {
      this.itemId = { id: '' };
      this.query();
    },
    distribute() {
      if (this.selections && this.selections.length > 0) {
        this.dialogVisible = true;
      } else {
        this.$message('请选择一条数据');
      }
    },
    confirm() {
      let ids = [];
      this.selections.forEach(element => {
        ids.push(element.id);
      });
      if (!this.adminId) {
        this.$message.warning('请选择分配顾问');
        return;
      }
      http
        .put('/admin/member/distribute.jhtml', { adminId: this.adminId, ids: ids })
        .then(data => {
          this.dialogVisible = false;
          this.$message.success('分配成功');
          this.refresh();
        })
        .catch(error => {
          if (error.errorMessage !== '店铺不存在') {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    getTagClassList() {
      let url;
      let param = {
        categoryType: '会员标签',
        isIncludeTag: '1'
      };

      if (this.getUser.roleLevel === 'platform') {
        url = systemSetting.platformTagcategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = systemSetting.storeTagcategories;
        param.shopId = window.top.SHOP_ID || '';
      }

      http
        .get(url, param)
        .then(data => {
          let ary = data.content;
          let options = [
            {
              label: '全部',
              value: ''
            }
          ];
          options = options.concat(getOption(ary));
          this.filters[2].options = options;
          this.filters[2].value = [''];
        })
        .catch(error => {
          if (error.errorMessage !== '店铺不存在') {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    cascaderChange(val) {
      this.pagination.currentPage = 1;
      if (val.length === 0) {
        this.curTagName = '';
        this.filters[2].value = [];
        this.refresh();
      } else {
        this.curTagName = val[val.length - 1].id;
        if (val.length > 1 && !this.curTagName) {
          let tagCategoryId = val[val.length - 2].id;
          http
            .get('/admin/tag/storeTags.jhtml', { tagCategoryId: tagCategoryId })
            .then(data => {
              let temp = [];
              data.content.map(item => {
                temp.push(item.id);
              });
              this.curTagName = temp.join(',');
              this.refresh();
            })
            .catch(error => {
              if (error.errorMessage !== '店铺不存在') {
                this.$message.warning(error.errorMessage);
              }
            })
            .finally(() => {});
        } else {
          this.refresh();
        }
      }
    }
  },
  events: {
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
      this.operations.map(item => {
        if (item.name === 'delete') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'delete') {
            item.disabled = false;
          }
        });
      }
    },
    handleFilterDataChange() {
      this.pagination.currentPage = 1;
      this.query();
    },
    handleRowClick(model, e, column) {
      this.$refs.popup.tabSelection = '1';
      this.open = true;
      this.flag = true;
      this.storeId = model.shops;
      if (this.isEdit && model.unionConfig.editable !== '0') {
        this.flag = true;
      } else {
        this.flag = false;
      }
      this.$nextTick(function() {
        this.itemId = { id: String(model.id), userId: String(model.id) };
      });
    },
    carClick(row) {
      this.handleRowClick(row);
    },
    terminalClick(model) {
      this.$refs.popup.tabSelection = '3';
      this.open = true;
      this.flag = true;
      this.storeId = model.shops;
      if (this.isEdit && model.unionConfig.editable !== '0') {
        this.flag = true;
      } else {
        this.flag = false;
      }
      this.$nextTick(function() {
        this.itemId = { id: String(model.id), userId: String(model.id) };
      });
    },
    fenceClick(model) {
      this.$refs.popup.tabSelection = '4';
      this.open = true;
      this.flag = true;
      this.storeId = model.shops;
      if (this.isEdit && model.unionConfig.editable !== '0') {
        this.flag = true;
      } else {
        this.flag = false;
      }
      this.$nextTick(function() {
        this.itemId = { id: String(model.id), userId: String(model.id) };
      });
    },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop === 'lastLoginDate' ? 'loginDate' : column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.query();
    }
  }
};
// Table item相关
const dataTableItem = {
  data: {},
  methods: {
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
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
          .delete(service.mainPage.delete, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
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
      this.$refs.popup.tabSelection = '1';
      this.open = true;
      this.isEdit = true;
      this.itemId = { id: '' };
    },
    switchState(ids, state) {
      this.loading = true;
      let params = { ids: ids, state: state };
      http
        .post(service.mainPage.switchState, params)
        .then(data => {
          this.$message.success(state === '0' ? '停用成功' : '启用成功');
          this.query();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage !== '店铺不存在') this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  events: {
    handleRouterPush(e, model) {
      e.stopPropagation();

      this.$router.push({
        name: this.$route.params.isSys ? 'tag-group-all-mgmt' : 'tag-group-mgmt',
        params: {
          isSys: 'isSys',
          classId: model.id
        }
      });
    },
    handleDriveClick(e, model) {
      e.stopPropagation();

      this.driveItem(model.id);
    },
    handleSignClick(e, model) {
      e.stopPropagation();

      this.signItem(model.id);
    },
    handleFailClick(e, model) {
      e.stopPropagation();

      this.failItem(model.id);
    },
    handleStartClick(e, model) {
      this.switchState([model.id], '1');
    },
    handleStopClick(e, model) {
      this.switchState([model.id], '0');
    },
    handleDeleteClick(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    }
  }
};
// converter
const dataConverter = {
  stateConverter(row) {
    if (row.enableState === '0') return '停用';
    else if (row.enableState === '1') return '启用';
    else return '--';
  },
  createDateConverter(row) {
    if (!row.createDate) return '';

    row.createDate = row.createDate.replace(/-/g, '/');
    let date = new Date(row.createDate);
    return dateUtil.dateConverter(date);
  },
  loginDateConverter(row) {
    if (!row.lastLoginDate) return '--';

    row.lastLoginDate = row.lastLoginDate.replace(/-/g, '/');
    let date = new Date(row.lastLoginDate);
    return dateUtil.dateConverter(date);
  }
};

// 导入相关
const importData = {
  data: {
    importResult: [],
    importLoading: false,
    total: 0,
    count: 0,
    t: '',
    percentage: 0,
    stepkey: '',
    loading: false,
    disabled: false
  },
  methods: {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  events: {
    download() {
      window.open('/upload/mode/V%E6%9C%8D%E7%88%B1%E8%BD%A6_%E4%BC%9A%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx');
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      let url = '/admin/member/importProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.importFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
            }
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    }
  }
};

// Popup相关
const dataPopup = {
  data: {
    open: false,
    itemId: { id: '' }
  },
  methods: {},
  events: {
    handlePopupClose() {
      this.open = false;
    },
    handlePopupSuccess(val) {
      this.open = false;
      this.query();
    }
  }
};

// 组合tag，两个纯函数
const getOption = function(ary) {
  let options = [];
  for (const iterator of ary) {
    let obj = {
      value: { name: iterator.name, id: iterator.id },
      label: iterator.name
    };
    if (iterator.children.length > 0) {
      obj.children = getOption(iterator.children);
    }
    if (iterator.tags && iterator.tags.length > 0) {
      if (!obj.hasOwnProperty('children')) {
        obj.children = [];
      }
      obj.children = obj.children.concat([{ label: '全部', value: '' }]);
      let tags = getTags(iterator.tags);
      for (const tag of tags) {
        obj.children.push(tag);
      }
    }
    if (iterator.children.length === 0 && !iterator.tags) {
      obj.disabled = true;
    }
    options.push(obj);
  }
  return options;
};
const getTags = function(array) {
  let tags = [];
  for (const iterator of array) {
    tags.push({
      label: iterator.name,
      value: { name: iterator.name, id: iterator.id }
    });
  }
  return tags;
};

export default {
  name: 'MembershipMgmt',
  components: {
    BizFlexTable,
    ImportFile,
    RightPopup
  },
  props: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:member.delete');
    },
    hasAuthImport() {
      // return true;
      return this.currentAuth.includes('admin:member.import');
    },
    tableDataHandle() {
      let tabelDate = this.tableData;
      tabelDate.forEach(element => {
        if (element.shopTags) {
          element.shopTagsNew = [];
          element.shopTags.forEach((item, index) => {
            if (index < 3) {
              if (element.shopTags.length > 1 && index !== element.shopTags.length - 1) {
                // element.shopTagsNew.push(item + '、');
                element.shopTagsNew.push(item);
              } else {
                element.shopTagsNew.push(item);
              }
            }
          });
        }
      });
      return tabelDate;
    },
    ...mapGetters(['getUser']),
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  data() {
    return {
      ...dataBase.data,
      ...dataTable.data,
      ...importData.data,
      ...dataPopup.data
    };
  },
  methods: {
    ...dataBase.methods,
    ...dataBase.events,

    ...dataTable.methods,
    ...dataTable.events,

    ...dataTableItem.methods,
    ...dataTableItem.events,

    ...importData.methods,
    ...importData.events,

    ...dataPopup.methods,
    ...dataPopup.events,

    ...dataConverter
  },
  created() {
    this.$set(this.filters[5], 'value', this.$route.query.mobile);
    this.query();
    this.queryShopList();
    this.handleImport();
    this.getKpi();
    this.getEditableStores();
    this.getTagClassList();
    this.getConsultant();
  },
  mounted() {
    this.filters[0].value = '';
    this.filters[1].value = '';
    this.filters[2].value = [];
    this.filters[3].value = '';
    // this.queryKpi();
  }
};
</script>

<style lang="scss">
.membership-mgmt {
  .motorists-club-activity__kpi {
    top: 45px;
  }
  .show-more {
    cursor: pointer;
    color: coral;
  }
  .biz-input {
    width: 300px;
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
      .title {
        width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
}
</style>
