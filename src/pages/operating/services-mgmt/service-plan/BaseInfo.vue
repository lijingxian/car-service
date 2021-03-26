<template>
  <biz-grid class="services-mgmt-platform">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" label-width="120px" size="small" v-loading="loading" :model="productData" :rules="rules" :inline-message="true">
      <el-form-item label="解决方案名称" prop="name">
        <el-input v-model="productData.name" style="width:204px;" placeholder="请输入服务名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属领域" prop="domainId">
        <el-select v-model="productData.businessService.domainId" placeholder="请选择类型">
          <el-option v-for="platformItem in domians" :key="platformItem.id" :value="platformItem.id" :label="platformItem.name"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="KEY值" prop="serviceKey">
        <el-input v-model="productData.serviceKey" style="width:204px;" placeholder="请输入KEY值"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="是否默认提供" v-if="showInfo">
        <el-switch v-model="productData.businessService.isDefault" active-value="1" inactive-value="0"  active-color="#87d068"
          inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
      <el-form-item label="是否免费" v-if="showInfo">
        <el-switch v-model="productData.isFree" active-value="1" inactive-value="0"  active-color="#87d068" inactive-color="#d9d9d9"></el-switch>
      </el-form-item> -->
      <!-- <el-form-item label="计价方式">
        <el-radio-group v-model="productData.businessService.serviceType" size="mini">
          <el-radio label="0">免费</el-radio>
          <el-radio label="1">收费</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="是否上架">
        <el-switch v-model="productData.isMarketable" active-value="1" inactive-value="0"  active-color="#87d068" inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
      <el-form-item label="方案价格" prop="price">
        <el-input-number placeholder="请输入方案价格" v-model="productData.price"></el-input-number>
      </el-form-item>
      <el-form-item label="试用期" prop="trialDays">
        <el-input v-model="productData.trialDays" style="width:204px;" placeholder="请输入试用天数"></el-input>
      </el-form-item>
      <el-form-item label="子服务">
        <div style="display:flex;flex-flow: wrap;">
          <div class="tag-container" v-for="(item, index) in productData.services" :key="index" style="padding:3px">
            <el-tag :closable="item.deletable&&item.deletable==='0'?false:true" @close="onClose(item)" class="member-tag">
              {{item.name}}</el-tag>
          </div>
        </div>
        <el-button type="primary" size="small" @click="onClickHandle">+</el-button>
      </el-form-item>
    </el-form>
    <biz-dialog-selector title="选择服务" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :tableData="dialogTableData" :pagination="dialogPagination"
      :selectionMode="'multi'" :filters="dialogFilters" @confirmed="handleConfirmed"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @selectionChange="selectionChange" @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="fullName" label="服务名称">
      </el-table-column>
      <el-table-column prop="description" label="服务简介">
        <template slot-scope="scope">
          {{getContent(scope.row.businessService.description)}}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="服务价格">
        <template slot-scope="scope">
          ¥{{scope.row.price}}
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from './BizDialogSelector';
import http from '@/common/http';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      showDialog: false,
      selectionList: [],
      serviceDatas: [],
      platformDatas: [],
      topServiceDatas: [],
      authorityTopDatas: [],
      selectionKeys: [],
      businessServiceClassify: [],
      dialogTableData: [],
      // 上级服务列表
      parentServiceList: [],
      domians: [],
      cascaderProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
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
          placeholder: '请输入服务名称',
          name: 'searchValue',
          value: ''
        }
      ],
      isCreated: true,
      form: {},
      productData: this.getDefaultProductData(),
      rules: {}
    };
  },
  computed: {
    showInfo() {
      return this.categoryType === '0' || this.productData.businessServiceType === '0';
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    tabSelection: {
      type: String
    },
    classfiy: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean
    },
    categoryType: {
      type: String,
      default: '0'
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  created() {
    this.queryParentServiceList();
  },
  watch: {
    open(val) {
      // this.$refs.form.clearValidate();
      this.getDomains();
      if (!val) {
        this.isCreated = true;
        this.authorityTopDatas = [];
        this.productData = this.getDefaultProductData();
        this.serviceDatas = [];
        this.platformDatas = [];
        this.topServiceDatas = [];
      } else {
        this.queryInit();
        this.getClassfiyList();

        if (this.id !== '') {
          if (this.categoryType === '0') {
            this.refresh();
          } else {
            this.refreshSms();
          }
          this.isCreated = false;
        } else {
          this.isCreated = true;
        }
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.onClickHandle(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.onClickHandle(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.onClickHandle(this.getDialogQueryParams());
    },
    getContent(content) {
      return content ? content.replace(/<.*?>/ig, '') : '';
    },
    selectionChange(selections) {
      console.log(selections);
      this.selectionList = [];
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    unique(newarr) {
      let res = new Map();
      return newarr.filter(arr => !res.has(arr.businessService.id) && res.set(arr.businessService.id, 1));
    },
    onClose(tag) {
      let ary = this.productData.services;
      let len = ary.length;
      for (let i = 0; i < len; i++) {
        if (ary[i] === tag) {
          ary.splice(i, 1);
          break;
        }
      }
    },
    handleConfirmed(selectionKeys, selections) {
      console.log(this.selectionList);
      console.log(this.selectionKeys);
      let arr = [];
      for (const iterator of selections) {
        this.selectionList.push(iterator);
      }
      this.selectionList = this.unique(this.selectionList);
      this.selectionList.map(item => {
        if (!this.selectionKeys.includes(item.businessService.id)) {
          arr.push(item);
        }
      });
      this.productData.services = this.productData.services.concat(arr.map(item => {
        return item.businessService;
      }));
      this.selectionKeys = this.productData.services.map(item => {
        return item.id;
      });
    },
    onClickHandle() {
      let params = {
        searchValue: this.dialogFilters[0].value,
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize
      };
      http
        .get('/admin/businessProduct/pageFrontend.jhtml', params)
        .then(data => {
          this.dialogTableData = data.dataList;
          console.log(this.productData.services);
          this.dialogPagination.total = Number(data.total);
          this.showDialog = true;
          this.selectionKeys = this.productData.services.map(item => {
            return item.id;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    queryParentServiceList() {
      http.get('/admin/businessProduct/list.jhtml', {})
        .then(data => {
          this.parentServiceList = data.dataList.map(i => ({ id: i.businessService.id, name: i.businessService.name }));
        })
        .catch();
    },
    getDomains() {
      http.get('/admin/businessServiceDomain/domainList.jhtml', {})
        .then(data => {
          this.domians = data.content;
        })
        .catch();
    },
    typeChange() {
      this.$refs.form.clearValidate('platform');
    },
    getClassfiyList() {
      http
        .get('/admin/businessServiceClassify/businessServiceClassify.jhtml', {})
        .then(data => {
          let obj;
          this.serviceDatas = [];
          data.businessServiceClassifyList.forEach(element => {
            obj = {};
            obj.label = element.name;
            obj.value = element.id;
            obj.children = [];
            this.serviceDatas.push(obj);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    getClassfiyChildList(value) {
      let obj;
      let params = {
        parent: value[0]
      };
      http
        .get('/admin/businessServiceClassify/businessServiceClassify.jhtml', params)
        .then(data => {
          this.serviceDatas.forEach(element => {
            if (element.value === value[0]) {
              element.children = [];
              data.businessServiceClassifyList.forEach(item => {
                obj = {};
                obj.label = item.name;
                obj.value = item.id;
                element.children.push(obj);
              });

              return false;
            }
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    visibleChange(val) {
      this.$refs.form.clearValidate('type');
      if (val) {
        this.getClassfiyChildList(this.businessServiceClassify);
      }
    },
    getDefaultProductData() {
      return {
        isMarketable: '1',
        price: '0',
        id: '',
        name: '',
        trialDays: '',
        services: []
      };
    },
    refresh() {
      http
        .get('/admin/solution/solution.jhtml', {
          shopId: window.top.SHOP_ID || '',
          id: this.id
        })
        .then(data => {
          this.productData = data.content;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    refreshSms() {
      http
        .get('/admin/smsPackage/query/v201901.jhtml', {
          shopId: window.top.SHOP_ID || '',
          id: this.id
        })
        .then(data => {
          this.platformDatas = data.serviceTypeEnumDatas;
          this.productData = data.data;
          this.productData.businessService = { name: data.data.name };
          if (this.classfiy.indexOf('/') !== -1) {
            this.businessServiceClassify = [this.classfiy.split('/')[0], this.classfiy.split('/')[1]];
          } else {
            this.businessServiceClassify = [this.classfiy];
          }
          this.getClassfiyChildList(this.businessServiceClassify);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    queryInit() {
      http
        .get('/admin/businessProduct/init/v201901.jhtml', {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.platformDatas = data.serviceTypeEnumDatas;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isCreated) {
            this.createService();
          } else {
            this.updateService();
          }
        } else {
          return false;
        }
      });
    },
    createService() {
      let params = Object.assign({}, this.productData, {
        // businessServiceClassify: this.businessServiceClassify[this.businessServiceClassify.length - 1]
      });
      http
        .post('/admin/solution/solution.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
          this.productData.id = data.id;
          this.isCreated = false;
          this.$emit('createdServicesSuccess', data.id, '0');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    updateService() {
      console.log(this.businessServiceClassify);
      let params = Object.assign({}, this.productData, {
        // businessServiceClassify: this.businessServiceClassify[this.businessServiceClassify.length - 1]
      });
      http
        .put('/admin/solution/solution.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.services-mgmt-platform {
  .biz-save-button {
    justify-content: flex-start;
  }
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
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
