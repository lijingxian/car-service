<template>
  <biz-grid class="services-mgmt-platform">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" label-width="120px" size="small" v-loading="loading" :model="productData" :rules="rules" :inline-message="true">
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="productData.businessService.name" style="width:204px;" placeholder="请输入服务名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="platform">
        <el-select v-model="productData.businessServiceType" placeholder="请选择类型" :disabled="!!productData.id" @change="typeChange">
          <el-option v-for="platformItem in platformDatas" :key="platformItem.value" :value="platformItem.value" :label="platformItem.label"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="分类" prop="type">
        <el-cascader :options="serviceDatas" :change-on-select="true" :props="cascaderProps" v-model="businessServiceClassify" @change="getClassfiyChildList" @active-item-change="getClassfiyChildList"
          @visible-change="visibleChange">
        </el-cascader>
      </el-form-item> -->
      <el-form-item label="上级服务">
        <el-select v-model="productData.businessService.parentIds" multiple placeholder="请选择上级服务">
          <el-option v-for="parentService in parentServiceList" :key="parentService.id" :value="parentService.id" :label="parentService.name"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="所属领域" prop="domainId">
        <el-select v-model="productData.businessService.domainId" placeholder="请选择类型">
          <el-option v-for="platformItem in domians" :key="platformItem.id" :value="platformItem.id" :label="platformItem.name"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="KEY值" prop="serviceKey">
        <el-input v-model="productData.businessService.serviceKey" style="width:204px;" placeholder="请输入KEY值"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="是否默认提供" v-if="showInfo">
        <el-switch v-model="productData.businessService.isDefault" active-value="1" inactive-value="0"  active-color="#87d068"
          inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
      <el-form-item label="是否免费" v-if="showInfo">
        <el-switch v-model="productData.isFree" active-value="1" inactive-value="0"  active-color="#87d068" inactive-color="#d9d9d9"></el-switch>
      </el-form-item> -->
      <el-form-item label="服务类型">
        <el-radio-group v-model="productData.businessService.serviceType" size="mini">
          <el-radio label="0">免费</el-radio>
          <el-radio label="1">基础服务</el-radio>
          <el-radio label="2">增值服务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否上架" v-if="showInfo">
        <el-switch v-model="productData.isMarketable" active-value="1" inactive-value="0"  active-color="#87d068" inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
      <el-form-item :label="productData.businessServiceType==='0'?'服务价格（月）':'服务价格（条）'" prop="price" v-if="productData.businessService.serviceType!=='0'">
        <el-input placeholder="请输入服务价格" v-model="productData.price" style="width:210px;"></el-input>
      </el-form-item>
      <el-form-item label="试用期" prop="trialDays">
        <el-input v-model="productData.businessService.trialDays" style="width:204px;" placeholder="请输入试用天数"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
export default {
  name: 'BaseInfo',
  data() {
    const isMarketPriceValid = (rule, rules, callback) => {
      if (this.productData.price === '') {
        this.productData.price = 0;
      }
      if (Number(this.productData.price) >= 0) {
        callback();
      } else {
        callback(new Error('服务价格必须为数字值'));
      }
    };
    return {
      loading: false,
      serviceDatas: [],
      platformDatas: [],
      topServiceDatas: [],
      authorityTopDatas: [],
      businessServiceClassify: [],
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
      isCreated: true,
      productData: this.getDefaultProductData(),
      rules: {
        platform: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.productData.businessServiceType) {
                callback();
              } else {
                callback(new Error('请选择所属平台'));
              }
            }
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.productData.businessService.name) {
                callback();
              } else {
                callback(new Error('请输入服务名称'));
              }
            }
          }
        ],
        type: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              console.log(this.businessServiceClassify);
              if (
                this.businessServiceClassify &&
                this.businessServiceClassify !== undefined &&
                this.businessServiceClassify.length > 0 &&
                this.businessServiceClassify[0] !== ''
              ) {
                callback();
              } else {
                callback(new Error('请选择服务类型'));
              }
            }
          }
        ],
        description: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.productData.businessService.description) {
                callback();
              } else {
                callback(new Error('请输入服务简介'));
              }
            }
          }
        ],
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.productData.businessService.code) {
                callback();
              } else {
                callback(new Error('请输入服务code'));
              }
            }
          }
        ],
        price: [
          {
            required: false,
            trigger: 'blur',
            validator: isMarketPriceValid
          }
        ]
      }
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
    BizSaveButton
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
        isFree: '0',
        isMarketable: '1',
        price: '0',
        id: '',
        businessService: {
          domainId: '',
          serviceKey: '',
          trialDays: '',
          parentIds: [],
          platform: '',
          name: '',
          type: '',
          description: '',
          isDefault: '1',
          code: '',
          serviceType: '0'
        }
      };
    },
    refresh() {
      http
        .get('/admin/businessProduct/query/v201901.jhtml', {
          shopId: window.top.SHOP_ID || '',
          id: this.id
        })
        .then(data => {
          this.platformDatas = data.serviceTypeEnumDatas;
          this.productData = data.productData;
          this.authorityTopDatas = data.authorityTopDatas;
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
            if (this.showInfo) {
              this.createService();
            } else {
              this.createSms();
            }
          } else {
            if (this.showInfo) {
              this.updateService();
            } else {
              this.updateSms();
            }
          }
        } else {
          return false;
        }
      });
    },
    createSms() {
      let params = {
        name: this.productData.businessService.name,
        price: this.productData.price,
        isMarketable: this.productData.isMarketable,
        // businessServiceClassify: this.businessServiceClassify[this.businessServiceClassify.length - 1],
        businessServiceType: '1'
      };
      http
        .post('/admin/smsPackage/create/v201901.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.productData.id = data.id;
          this.isCreated = false;
          this.$emit('operationSuccess');
          this.$emit('createdServicesSuccess', data.id, '1');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    updateSms() {
      let params = {
        id: this.productData.id,
        name: this.productData.businessService.name,
        price: this.productData.price,
        isMarketable: this.productData.isMarketable,
        // businessServiceClassify: this.businessServiceClassify[this.businessServiceClassify.length - 1],
        businessServiceType: '1'
      };
      http
        .put('/admin/smsPackage/update/v201901.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    createService() {
      let params = Object.assign({}, this.productData, {
        // businessServiceClassify: this.businessServiceClassify[this.businessServiceClassify.length - 1]
      });
      http
        .post('/admin/businessProduct/businessProduct/v201901.jhtml', params)
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
        .put('/admin/businessProduct/businessProduct/v201901.jhtml', params)
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
