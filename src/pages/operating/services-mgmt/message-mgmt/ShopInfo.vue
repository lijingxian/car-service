<template>
  <biz-grid class="message-mgmt-shop-info">
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="店铺名称" prop="name">
        <el-input disabled placeholder="请输入店铺名称" v-model="form.name" maxlength="20" minlength="1"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input disabled v-model="form.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="销售电话" prop="phone">
        <el-input disabled v-model="form.phone" maxlength="12" placeholder="请输入销售电话"></el-input>
      </el-form-item>
      <el-form-item label="售后电话" prop="serviceMobile">
        <el-input disabled v-model="form.serviceMobile" maxlength="12" placeholder="请输入售后电话"></el-input>
      </el-form-item>
      <el-form-item label="客服电话" prop="customerMobile">
        <el-input disabled v-model="form.customerMobile" maxlength="12" placeholder="请输入客服电话"></el-input>
      </el-form-item>
      <el-form-item label="救援电话" prop="rescueMobile">
        <el-input disabled v-model="form.rescueMobile" maxlength="12" placeholder="请输入救援电话"></el-input>
      </el-form-item>
      <el-form-item label="店铺logo" prop="head">
        <img class="logo-img" :src="form.head" alt="" v-if="form.head">
      </el-form-item>
      <el-form-item label="店铺封面" prop="image">
        <img class="logo-img" :src="form.image" alt="">
      </el-form-item>
      <el-form-item label="所属运营商">
        <label>{{form.operatorName}}</label>
      </el-form-item>
      <el-form-item label="所属上级">
        <label>{{form.parentName}}</label>
      </el-form-item>
      <el-form-item label="状态" prop="isEnabled">
        <el-radio-group disabled v-model="form.isEnabled">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="" prop="isAllowCreateFleet">
        <el-checkbox label="允许会员创建车友会" v-model="form.isAllowCreateFleet"></el-checkbox>
      </el-form-item> -->
      <el-form-item label="" prop="communitySilent">
        <el-checkbox disabled label="社区动态禁言" true-label='1' false-label="0" v-model="form.communitySilent"></el-checkbox>
      </el-form-item>
      <el-form-item label="父子店铺关系" v-show="showUnionType">
        <div slot="label">
          父子店铺关系
          <el-button type="text" size="small" v-popover:UnionType>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="UnionType" placement="bottom-start" width="300" trigger="hover">
            <p>父子店铺可选择以下几种关系：</p>
            <p>● 独立 — 不共享任何资源，两个店铺之间没有建立起任何信任关系；</p>
            <p>● 合作联盟 — 共享商品和营销活动，店铺之间具有良好稳定的合作关系；</p>
            <p>● 品牌加盟 — 人事和财务独立，协商共享其他资源，常见于总店和子店之间，或者加盟品牌。</p>
            ● 直营连锁 — 人事、财务和资源统一管理，常见于总店和分店之间，或者直营店。
          </el-popover>
        </div>
        <el-select disabled v-model="form.unionType" placeholder="请选择" @change="unionTypeChange">
          <el-option label="独立" value="0"></el-option>
          <el-option label="合作联盟" value="1"></el-option>
          <el-option label="品牌加盟" value="2"></el-option>
          <el-option label="直营连锁" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺二维码" prop="qrCodePath">
        <div slot="label">
          店铺二维码
          <el-button type="text" size="small" v-popover:codePop>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover" content="我们将为您创建一个专属的店铺二维码，您的用户可通过扫描该二维码关注快速您的店铺，并成为您店铺的会员哦。">
          </el-popover>
        </div>
        <img :src="form.qrCodePath" width="100px" v-if="form.qrCodePath" />
        <el-button @click="view" type="primary" v-if="itemId">查看</el-button>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/federation-mgmt/federationMgmt';
import http from '@/common/http';
export default {
  name: 'FederationMgmtInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  components: {
    BizGrid
  },
  computed: {
    point: {
      get() {
        return {
          lng: this.form.lngBaidu,
          lat: this.form.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.form.lngBaidu = nVal.lng;
          this.form.latBaidu = nVal.lat;
        }
      }
    }
  },
  data() {
    return {
      showSetting: false,
      showUnionType: false,
      loading: false,
      selectionKeys: [],
      defaultShopLogo: '/resources/admin/images/shop-logo.png',
      // 用户信息
      form: {
        id: '',
        name: '',
        address: '',
        phone: '',
        serviceMobile: '',
        customerMobile: '',
        rescueMobile: '',
        parent: '',
        parentType: '',
        head: this.defaultShopLogo,
        image: '',
        communitySilent: false,
        selectionKeys: [],
        companyId: '',
        isEnabled: '1',
        lngBaidu: '',
        latBaidu: '',
        unionType: '0',
        configList: [
          { type: '0', toSon: '0', toFather: '0', name: '员工' },
          { type: '1', toSon: '0', toFather: '0', name: '财务' },
          { type: '2', toSon: '0', toFather: '0', name: '商品' },
          { type: '3', toSon: '0', toFather: '0', name: '营销' },
          { type: '4', toSon: '0', toFather: '0', name: '订单' },
          { type: '5', toSon: '0', toFather: '0', name: '会员' },
          { type: '6', toSon: '0', toFather: '0', name: '会员卡' },
          { type: '7', toSon: '0', toFather: '0', name: '车队' },
          { type: '8', toSon: '0', toFather: '0', name: '车友会' }
        ],
        operatorName: '',
        parentName: ''
      },
      resetForm: {
        id: '',
        name: '',
        address: '',
        phone: '',
        serviceMobile: '',
        customerMobile: '',
        rescueMobile: '',
        parent: '',
        parentType: '',
        head: this.defaultShopLogo,
        image: '',
        communitySilent: false,
        selectionKeys: [],
        companyId: '',
        isEnabled: '1',
        lngBaidu: '',
        latBaidu: '',
        unionType: '0',
        configList: [
          { type: '0', toSon: '0', toFather: '0', name: '员工' },
          { type: '1', toSon: '0', toFather: '0', name: '财务' },
          { type: '2', toSon: '0', toFather: '0', name: '商品' },
          { type: '3', toSon: '0', toFather: '0', name: '营销' },
          { type: '4', toSon: '0', toFather: '0', name: '订单' },
          { type: '5', toSon: '0', toFather: '0', name: '会员' },
          { type: '6', toSon: '0', toFather: '0', name: '会员卡' },
          { type: '7', toSon: '0', toFather: '0', name: '车队' },
          { type: '8', toSon: '0', toFather: '0', name: '车友会' }
        ],
        operatorName: '',
        parentName: ''
      }
    };
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.$refs.form.clearValidate();
        this.queryStoreOrOperator();
      } else {
        this.form = this.defaultMOdel();
      }
    }
  },
  created() {
    this.getDefaultImg();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    getDefaultImg() {
      let params = {
        type: 'displaySetting'
      };
      http
        .get('/admin/settings/settings.jhtml', params)
        .then(data => {
          if (data.settingList.defaultStoreLogoImage) {
            this.defaultShopLogo = data.settingList.defaultStoreLogoImage;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    defaultMOdel() {
      return {
        id: '',
        name: '',
        address: '',
        phone: '',
        serviceMobile: '',
        customerMobile: '',
        rescueMobile: '',
        parent: '',
        parentType: '',
        head: this.defaultShopLogo,
        image: '',
        communitySilent: false,
        selectionKeys: [],
        companyId: '',
        isEnabled: '1',
        lngBaidu: '',
        latBaidu: '',
        unionType: '0',
        configList: [
          { type: '0', toSon: '0', toFather: '0', name: '员工' },
          { type: '1', toSon: '0', toFather: '0', name: '财务' },
          { type: '2', toSon: '0', toFather: '0', name: '商品' },
          { type: '3', toSon: '0', toFather: '0', name: '营销' },
          { type: '4', toSon: '0', toFather: '0', name: '订单' },
          { type: '5', toSon: '0', toFather: '0', name: '会员' },
          { type: '6', toSon: '0', toFather: '0', name: '会员卡' },
          { type: '7', toSon: '0', toFather: '0', name: '车队' },
          { type: '8', toSon: '0', toFather: '0', name: '车友会' }
        ],
        operatorName: '',
        parentName: ''
      };
    },
    handleConfirmed(selectionKeys, selections) {
      this.form = selections[0];
      // this.itemId = selections[0].id;
      this.$set(this.form, 'selectionKeys', selectionKeys);
      this.form.configList = [
        { type: '0', toSon: '0', toFather: '0', name: '员工' },
        { type: '1', toSon: '0', toFather: '0', name: '财务' },
        { type: '2', toSon: '0', toFather: '0', name: '商品' },
        { type: '3', toSon: '0', toFather: '0', name: '营销' },
        { type: '4', toSon: '0', toFather: '0', name: '订单' },
        { type: '5', toSon: '0', toFather: '0', name: '会员' },
        { type: '6', toSon: '0', toFather: '0', name: '会员卡' },
        { type: '7', toSon: '0', toFather: '0', name: '车队' },
        { type: '8', toSon: '0', toFather: '0', name: '车友会' }
      ];
      this.form.unionType = '0';
      this.$refs.form.clearValidate('name');
      this.$refs.form.clearValidate('address');
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    parentCompanyAndStore() {
      service.parentCompanyAndStore(
        {
          id: this.parent || ''
        },
        data => {
          this.form.parentName = data.parentName;
          this.form.operatorName = data.operatorName;
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    unionTypeChange(value) {
      switch (value) {
        case '1':
          this.form.configList = [
            { type: '0', toSon: '0', toFather: '0', name: '员工' },
            { type: '1', toSon: '0', toFather: '0', name: '财务' },
            { type: '2', toSon: '1', toFather: '2', name: '商品' },
            { type: '3', toSon: '1', toFather: '2', name: '营销' },
            { type: '4', toSon: '0', toFather: '1', name: '订单' },
            { type: '5', toSon: '0', toFather: '1', name: '会员' },
            { type: '6', toSon: '1', toFather: '1', name: '会员卡' },
            { type: '7', toSon: '0', toFather: '0', name: '车队' },
            { type: '8', toSon: '0', toFather: '0', name: '车友会' }
          ];
          break;
        case '2':
          this.form.configList = [
            { type: '0', toSon: '0', toFather: '0', name: '员工' },
            { type: '1', toSon: '0', toFather: '0', name: '财务' },
            { type: '2', toSon: '1', toFather: '1', name: '商品' },
            { type: '3', toSon: '1', toFather: '1', name: '营销' },
            { type: '4', toSon: '1', toFather: '1', name: '订单' },
            { type: '5', toSon: '1', toFather: '1', name: '会员' },
            { type: '6', toSon: '1', toFather: '1', name: '会员卡' },
            { type: '7', toSon: '1', toFather: '1', name: '车队' },
            { type: '8', toSon: '1', toFather: '1', name: '车友会' }
          ];
          break;
        case '3':
          this.form.configList = [
            { type: '0', toSon: '1', toFather: '1', name: '员工' },
            { type: '1', toSon: '1', toFather: '1', name: '财务' },
            { type: '2', toSon: '1', toFather: '1', name: '商品' },
            { type: '3', toSon: '1', toFather: '1', name: '营销' },
            { type: '4', toSon: '1', toFather: '1', name: '订单' },
            { type: '5', toSon: '1', toFather: '1', name: '会员' },
            { type: '6', toSon: '1', toFather: '1', name: '会员卡' },
            { type: '7', toSon: '1', toFather: '1', name: '车队' },
            { type: '8', toSon: '1', toFather: '1', name: '车友会' }
          ];
          break;
        default:
          this.form.configList = [
            { type: '0', toSon: '0', toFather: '0', name: '员工' },
            { type: '1', toSon: '0', toFather: '0', name: '财务' },
            { type: '2', toSon: '0', toFather: '0', name: '商品' },
            { type: '3', toSon: '0', toFather: '0', name: '营销' },
            { type: '4', toSon: '0', toFather: '0', name: '订单' },
            { type: '5', toSon: '0', toFather: '0', name: '会员' },
            { type: '6', toSon: '0', toFather: '0', name: '会员卡' },
            { type: '7', toSon: '0', toFather: '0', name: '车队' },
            { type: '8', toSon: '0', toFather: '0', name: '车友会' }
          ];
      }
    },
    queryStoreOrOperator() {
      this.loading = true;
      this.itemId &&
        service.query(
          {
            id: this.itemId.id || '',
            type: 'store'
          },
          data => {
            this.form = Object.assign(this.form, data.content);
            if (data.content.configList && data.content.configList.length > 0) {
              this.showUnionType = true;
            } else {
              this.showUnionType = false;
            }
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.itemId || this.form.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                // this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            if (this.form.address === '') {
              this.$message.warning('请填写地址');
              this.loading = false;
              return false;
            }
            this.loading = true;
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          }
        }
      });
    },
    getSaveParams() {
      return {
        id: this.itemId ? this.itemId : this.form.id,
        name: this.form.name,
        parent: this.itemId ? this.form.parent : this.parent,
        parentType: this.itemId ? this.form.parentType : this.parentType,
        address: this.form.address,
        latBaidu: this.form.latBaidu,
        lngBaidu: this.form.lngBaidu,
        phone: this.form.phone,
        serviceMobile: this.form.serviceMobile,
        customerMobile: this.form.customerMobile,
        rescueMobile: this.form.rescueMobile,
        head: this.form.head,
        image: this.form.image,
        isEnabled: this.form.isEnabled,
        communitySilent: this.form.communitySilent,
        unionType: this.parentType === 'store' || this.form.parentType === 'store' ? this.form.unionType : '',
        configList: this.parentType === 'store' || this.form.parentType === 'store' ? this.form.configList : []
      };
    },
    isShow(showSetting) {
      this.showSetting = !showSetting;
    },
    showStorePicker(e) {
      this.showDialog = true;
    },
    queryStoreList(params) {
      service.listAdditiveStore(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleAddressChange(val) {
      this.$set(this.form, 'address', val);
      this.$refs.form.clearValidate('address');
    },
    handleUploadSuccess(url) {
      this.$set(this.form, 'head', url);
    },
    opened() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryStoreList(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        parentType: this.parentType,
        parentId: this.parent
      };
    },
    dialogFilterDataChange(filters) {
      this.queryStoreList(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryStoreList(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryStoreList(this.getDialogQueryParams());
    },
    print() {
      window.open(
        document.location.protocol +
          '//' +
          window.location.host +
          '/#/qrcode-print?img=' +
          this.form.qrCodePath +
          '&shopName=' +
          this.form.name
      );
    },
    view() {
      window.open(document.location.protocol + '//' + window.location.host + this.form.qrCodePath);
    },
    dialogOperate(name) {}
  }
};
</script>

<style lang="scss">
.biz-store-dialog-selector {
  .biz-two-column {
    display: flex;
    img {
      width: 100px;
      height: 100px;
    }
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.message-mgmt-shop-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-col .el-input {
    width: 80%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
  .logo-img {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
}
</style>
