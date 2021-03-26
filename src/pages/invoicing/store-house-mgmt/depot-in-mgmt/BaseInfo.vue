<template>
  <biz-grid class="depot-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="单据编号" prop="sn" v-if="itemId">
        <el-input v-model="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="form.businessType" placeholder="请选择业务类型" style="width:100%" @change="businessTypeChange" :disabled="!!itemId">
          <el-option label="采购入库" value="0"></el-option>
          <el-option label="销售退货" value="1"></el-option>
          <el-option label="其它入库" value="2"></el-option>
          <el-option label="盘点调整" value="3" v-if="form.businessType==='3'"></el-option>
          <el-option label="调拨" value="4" v-if="form.businessType==='4'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="往来方" prop="relatePartnerType" v-if="form.businessType!=='3'">
        <el-select placeholder v-model="form.relatePartnerType" :disabled="form.businessType === '0' || !!itemId" @change="relateTypeChange">
          <el-option label="供应商" value="0" v-if="form.businessType!=='1'"></el-option>
          <el-option label="会员" value="1" v-if="form.businessType!=='0'"></el-option>
          <el-option label="代理商" value="2" v-if="form.businessType!=='0'"></el-option>
          <el-option label="仓库" value="3" v-if="form.businessType!=='0'&&itemId"></el-option>
        </el-select>
        <!-- 供应商 -->
        <el-input
          placeholder="请选择供应商"
          v-if="form.relatePartnerType === '0'"
          v-model="form.relatePartnerName"
          @focus="showSupplierDialog = true;"
          :disabled="!!itemId"
        ></el-input>
        <!-- 会员 -->
        <el-input
          placeholder="请选择会员"
          v-if="form.relatePartnerType === '1'"
          v-model="form.relatePartnerName"
          @focus="showMemberDialog = true;"
          :disabled="!!itemId"
        ></el-input>
        <!-- 代理商 -->
        <el-input
          placeholder="请选择代理商"
          v-if="form.relatePartnerType === '2'"
          v-model="form.relatePartnerName"
          @focus="showAgentDialog = true;"
          :disabled="!!itemId"
        ></el-input>
        <!-- 仓库 -->
        <el-input
          v-if="form.relatePartnerType === '3'&&itemId"
          v-model="form.relatePartnerName"
          :disabled="!!itemId"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联单据" v-if="form.businessType === '0' || form.businessType === '1'" class="isRequired">
        <el-input placeholder="请选择关联单据" v-model="form.relateBillSn" @focus="showDialog" :disabled="form.relatePartnerName==='' || !!itemId"></el-input>
      </el-form-item>
      <el-form-item label="创建者" prop="creatorName" v-if="itemId">
        <el-input v-model="form.creatorName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="提交者" prop="auditorName" v-if="form.state === '1'&& form.businessType!=='3'">
        <el-input v-model="form.auditorName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state" v-if="itemId">
        <el-input :value="stateFormatter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate" v-if="itemId">
        <el-input v-model="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="图片资源" prop="image">
        <img-uploader v-model="form.images" :limit="3" :disabled="!!itemId" :isShowDelete="!itemId"></img-uploader>
      </el-form-item>
      <el-form-item label="视频资源" prop="video">
        <BizVideoUpload v-model="form.videos" :disabled="!!itemId"></BizVideoUpload>
      </el-form-item>
      <el-form-item label="扫码入库备注" prop="memo">
        <el-input :disabled="!!itemId" v-model="form.memo" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :disabled="form.state==='1'" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <!-- 选择会员 -->
    <biz-dialog-selector
      title="选择会员"
      :visibility.sync="showMemberDialog"
      :appendToBody="true"
      :loading="dialogLoading"
      :tableData="dialogMemberTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogMemberFilters"
      @confirmed="handleMemberConfirmed"
      @open="opened"
      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="memberDialog"
    >
      <el-table-column label="用户名" width="200px">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head">
            <img v-else src="../../../../assets/images/default_user.png">
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
      <el-table-column label="状态" :formatter="stateConverterMember"></el-table-column>
      <el-table-column prop label="店铺">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="最后登录">
        <template slot-scope="scope">
          {{scope.row.lastLoginDate}}
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <!-- 选择供应商 -->
    <biz-dialog-selector
      title="选择供应商"
      :visibility.sync="showSupplierDialog"
      :appendToBody="true"
      :tableData="dialogSupplierTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogSupplierFilters"
      @open="openedSupplier"
      @confirmed="handleSupplierConfirmed"
      @filterDataChange="supplierFilterDataChange"
      @pageSizeChange="supplierPageSizeChange"
      @currentPageChange="supplierCurrentPageChange"
      class="supplierDialog"
    >
      <el-table-column label="供应商名称" width="200px" prop="name"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
    </biz-dialog-selector>
    <!-- 选择代理商 -->
    <biz-dialog-selector
      title="选择代理商"
      :visibility.sync="showAgentDialog"
      :appendToBody="true"
      :tableData="dialogAgentTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogAgentFilters"
      @open="openedAgent"
      @confirmed="handleAgentConfirmed"
      @filterDataChange="agentFilterDataChange"
      @pageSizeChange="agentPageSizeChange"
      @currentPageChange="agentCurrentPageChange"
      class="agentDialog"
    >
      <el-table-column label="代理商名称" width="200px" prop="name"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
    </biz-dialog-selector>
    <!-- 选择关联单据 -->
    <biz-dialog-selector
      title="选择关联单据"
      :visibility.sync="showRelateDialog"
      :appendToBody="true"
      :tableData="dialogRelateTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogRelateFilters"
      @open="openedRelate"
      @confirmed="handleRelateConfirmed"
      @filterDataChange="relateFilterDataChange"
      @pageSizeChange="relatePageSizeChange"
      @currentPageChange="relateCurrentPageChange"
      class="supplierDialog"
    >
      <el-table-column prop="relateBillSn" label="编号" min-width="150"></el-table-column>
      <!-- <el-table-column prop="relateBillType" label="单据类型" min-width="150">
        <template slot-scope="scope">{{ typeFormatter(scope.row.relateBillType) }}</template>
      </el-table-column>-->
      <el-table-column label="商品信息" min-width="300">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between">
            <div style="width:100%;margin-right:30px">
              <div v-for="productItem in scope.row.itemDatas" :key="productItem.id" class="product-info" style="display:flex;width:100%;">
                <div class="wrapper">
                  <div
                    class="titleClass"
                    style="text-overflow:ellipsis;overflow:hidden;width: 250px;white-space:nowrap;"
                    :title="productItem.productName"
                  >{{productItem.productName}}</div>
                </div>
                <div class="info-bottom">
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*{{productItem.amount}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="relatePartnerName" label="往来方" min-width="150"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import service from '@/service/order-mgmt/orderMgmt';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import dateUtil from '@/utils/date';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import BizVideoUpload from '@/components/BizForm/BizVideoUpload';
// converter
const dataConverter = {
  stateConverter(row) {
    if (row.enabled === '0') return 'X';
    else if (row.enabled === '1') return '√';
    else return '--';
  },
  stateConverterMember(row) {
    if (row.enableState === '0') return '停用';
    else if (row.enableState === '1') return '启用';
    else return '--';
  },
  createDateConverter(row) {
    if (row.createDate) {
      row.createDate = row.createDate.replace(/-/g, '/');
      let date = new Date(row.createDate);
      return dateUtil.dateConverter(date);
    } else {
      return '--';
    }
  },
  loginDateConverter(row) {
    if (row.lastLoginDate) {
      row.lastLoginDate = row.lastLoginDate.replace(/-/g, '/');
      let date = new Date(row.lastLoginDate);
      return dateUtil.dateConverter(date);
    } else {
      return '--';
    }
  },
  ipConverter(row) {
    if (row.lastLoginIp) return row.lastLoginIp;
    else return '--';
  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    id: '',
    businessType: '2',
    shopId: '',
    relatePartnerType: '0',
    relatePartnerId: '',
    relatePartnerName: '',
    relateBill: '',
    relateBillSn: '',
    remark: '',
    memo: '',
    images: [],
    videos: []
  };
};
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector,
    ImgUploader,
    BizVideoUpload
  },
  data() {
    const isRelateUnitName = (rule, rules, callback) => {
      if (this.form.relatePartnerName === '') {
        callback(new Error('请选择往来方名称'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      dialogLoading: false,
      showSupplierDialog: false,
      showAgentDialog: false,
      showMemberDialog: false,
      showRelateDialog: false,
      dialogVisible: false,
      picDialogVisible: false,
      dialogImageUrl: '',
      refundsId: '',
      form: getDefaultModel(),
      itemDatas: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:inport.edit']
        }
      ],
      dialogMemberTableData: [],
      dialogSupplierTableData: [],
      dialogAgentTableData: [],
      dialogRelateTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogMemberFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入会员姓名/电话',
          name: 'searchValue',
          value: ''
        }
      ],
      dialogSupplierFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入供应商名称',
          name: 'searchValue',
          value: ''
        }
      ],
      dialogAgentFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入代理商名称',
          name: 'searchValue',
          value: ''
        }
      ],
      dialogRelateFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入单据编号/商品名称',
          name: 'searchValue',
          value: ''
        }
      ],
      rules: {
        businessType: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
        relatePartnerType: [{ required: true, trigger: 'blur', validator: isRelateUnitName }],
        relateBillSn: [{ required: true, message: '请选择关联单据', trigger: 'blur' }]
      }
    };
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case '0':
          return '未确认';
        case '1':
          return '已确认';
        default:
          return '--';
      }
    }
  },
  created() {},
  watch: {
    itemId(val) {
      if (val !== '') {
        this.query();
        this.$refs.form.clearValidate('relatePartnerType');
      } else {
        this.form = this.getDefaultModel();
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    ...dataConverter,
    operate(name) {
      this[name]();
    },
    view(image) {
      this.dialogImageUrl = image;
      this.picDialogVisible = true;
    },
    showDialog() {
      this.showRelateDialog = true;
      if (this.form.relateBillSn) {
        this.$refs.form.clearValidate('relateBillSn');
      }
    },
    businessTypeChange(val) {
      if (val === '0') {
        this.form.relatePartnerType = '0';
      } else if (val === '1') {
        this.form.relatePartnerType = '1';
      } else {
      }
      this.form.relatePartnerName = '';
      this.form.relateBillSn = '';
    },
    relateTypeChange(val) {
      this.form.relatePartnerName = '';
    },
    initModel(model) {
      if (model) {
        this.form = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }
    },
    resetModel() {
      this.form = this.getDefaultModel();
      if (this.$refs.form) this.$refs.form.resetFields();
    },
    // typeFormatter(type) {
    //   let typeList = {
    //     '0': '采购申请单',
    //     '1': '采购退货申请单',
    //     '2': '采购订单',
    //     '3': '采购退货订单',
    //     '4': '入库单',
    //     '5': '出库单',
    //     '6': '收款单',
    //     '7': '付款单',
    //     '8': '销售订单',
    //     '9': '销售退款订单',
    //     '10': '仓库盘点单'
    //   };
    //   return typeList[type];
    // },
    query() {
      this.queryDepot();
    },
    queryDepot() {
      this.loading = true;
      http
        .get(urls.invoicing.depotInMgmt.shopDepotIn, { shopId: window.top.SHOP_ID || '', id: this.itemId })
        .then(data => {
          this.loading = false;
          // 列表
          this.initModel(data.data);
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        id: this.form.id,
        businessType: this.form.businessType,
        relatePartnerType: this.form.relatePartnerType,
        relatePartnerId: this.form.relatePartnerId,
        relateBill: this.form.relateBill,
        remark: this.form.remark,
        memo: this.form.memo,
        images: this.form.images,
        videos: this.form.videos,
        shopId: window.top.SHOP_ID || '',
        refundsId: this.refundsId || ''
      };
    },

    save() {
      if ((this.form.businessType === '0' || this.form.businessType === '1') && !this.form.relateBillSn) {
        this.$message.warning('请选择关联单据');
        return false;
      }
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            http
              .put(urls.invoicing.depotInMgmt.shopDepotIn, this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                this.$message.warning(error.errorMessage);
              })
              .finally(data => {
                this.loading = false;
              });
          } else {
            http
              .post(urls.invoicing.depotInMgmt.shopDepotIn, this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess', data.id);
                this.$emit('setOrderItems', data.id);
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                this.$message.warning(error.errorMessage);
              })
              .finally(data => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    opened() {
      this.dialogMemberTableData = [];
      this.getMemberList();
    },
    openedSupplier() {
      this.dialogSupplierTableData = [];
      this.getSupplier();
    },
    openedAgent() {
      this.dialogAgentTableData = [];
      this.getAgent();
    },
    openedRelate() {
      this.dialogRelateTableData = [];
      this.getRelateList();
    },
    getSupplier() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogSupplierFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        state: '1'
      };
      http
        .get(urls.invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.dialogSupplierTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getAgent() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogAgentFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        cooperationType: '1',
        state: ''
      };
      http
        .get(urls.invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.dialogAgentTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getMemberList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogMemberFilters[0].value
      };
      service.memberList(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogMemberTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getRelateList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        businessType: this.form.businessType,
        partnerType: this.form.relatePartnerType,
        partnerId: this.form.relatePartnerId,
        searchValue: this.dialogRelateFilters[0].value
      };
      http
        .get(urls.invoicing.depotInMgmt.relateBill, params)
        .then(data => {
          this.dialogRelateTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    dialogFilterDataChange(filters) {
      this.dialogMemberFilters = filters;
      this.dialogPagination.currentPage = 1;
      this.getMemberList();
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.getMemberList();
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.getMemberList();
    },
    supplierPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.getSupplier();
    },
    supplierCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.getSupplier();
    },
    supplierFilterDataChange(val) {
      this.dialogSupplierFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getSupplier();
    },
    agentPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.getAgent();
    },
    agentCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.getAgent();
    },
    agentFilterDataChange(val) {
      this.dialogAgentFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getAgent();
    },
    relatePageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.getRelateList();
    },
    relateCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.getRelateList();
    },
    relateFilterDataChange(val) {
      this.dialogRelateFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getRelateList();
    },
    handleMemberConfirmed(selectionKeys, selections) {
      this.form.relatePartnerId = selections[0].id;
      this.form.relatePartnerName = selections[0].name;
      this.$refs.form.clearValidate('relatePartnerType');
    },
    handleSupplierConfirmed(selectionKeys, selections) {
      this.form.relatePartnerName = selections[0].name;
      this.form.relatePartnerId = selections[0].id;
      this.$refs.form.clearValidate('relatePartnerType');
    },
    handleAgentConfirmed(selectionKeys, selections) {
      this.form.relatePartnerName = selections[0].name;
      this.form.relatePartnerId = selections[0].id;
      this.$refs.form.clearValidate('relatePartnerType');
    },
    handleRelateConfirmed(selectionKeys, selections) {
      this.form.relateBillSn = selections[0].relateBillSn;
      this.form.relateBill = selections[0].relateBill;
      this.refundsId = selections[0].refundsId;
      this.$refs.form.clearValidate('relateBillSn');
    }
  }
};
</script>

<style lang="scss">
.depot-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-collapse-item__header.is-active {
    background-color: #fef3e5;
  }
  .el-collapse-item__wrap {
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
  .title-class {
    display: flex;
    justify-content: space-between;
    .title-class-one {
      color: #ff7300;
      .el-badge__content.is-fixed.is-dot {
        top: 18px;
        right: 0px;
      }
    }
    .title-class-two {
      color: red;
      font-size: 10px;
      padding-right: 10px;
    }
  }

  .el-form-item__content .el-select {
    width: 100%;
  }
  .biz-grid__content .biz-scroller {
    padding-left: 20px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .imgUpload {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 58px;
      height: 58px;
    }
    .el-upload--picture-card {
      width: 58px;
      height: 58px;
      line-height: 68px;
    }
  }
}
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
