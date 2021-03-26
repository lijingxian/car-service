<template>
  <biz-grid class="potential-customer-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="渠道" prop="customerChannel">
        <el-select v-model="formModel.customerChannel.id" placeholder="请选择渠道" filterable style="width: 100%;" @change="channelChange">
          <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formModel.mobile" type="phone" placeholder="请输入手机号" maxlength="11" :disabled="!!itemId.id">
          <template slot="append">
            <el-button size="small" @click="handleCreateClick">创建会员</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="客户姓名" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="客户类型" prop="customerType">
        <el-select v-model="formModel.customerType" placeholder="请选择客户类型" filterable style="width: 100%;" @change="customerTypeChange">
          <el-option v-for="item in customerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gernder">
        <el-radio-group v-model="formModel.gernder">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
          <el-radio label="unknown">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像" prop="image">
        <BizAvatarUploaderNew v-model="formModel.head" @uploadSuccess="uploadSuccess">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="建档日期" prop="entryDate">
        <el-date-picker type="date" placeholder="请选择建档日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="formModel.entryDate"
          :picker-options="pickerOptions" :clearable="false" :disabled="!!itemId.id" style="width: 200px;"></el-date-picker>
      </el-form-item>
      <el-form-item label="首次邀约来店">
        <el-date-picker type="date" :placeholder="itemId.id ? '----' : '选择首次邀约来店'" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          v-model="formModel.inshopDate" :disabled="!!itemId.id" style="width: 200px;"></el-date-picker>
      </el-form-item>
      <el-form-item label="销售顾问" prop="salesAdvisor">
        <el-select v-model="formModel.salesAdvisor.id" placeholder="请选择销售顾问" filterable style="width: 100%;">
          <el-option v-for="item in salesList" :key="item.id" :label="item.name || '未填写'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item name="1" title="扩展信息">
          <!-- <el-form-item label="身份证" prop="certificateNumber">
            <el-input v-model="formModel.certificateNumber" maxlength="18" placeholder="请输入身份证"></el-input>
          </el-form-item> -->
          <el-form-item label="婚姻状况">
            <el-select v-model="formModel.maritalStatus" placeholder="请选择婚姻状况" filterable style="width: 100%;">
              <el-option v-for="item in maritalStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="formModel.address" maxlength="100" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="职业">
            <el-input v-model="formModel.job" maxlength="20" placeholder="请输入职业"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import { mapGetters, mapMutations } from 'vuex';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { VueCropper } from '@/components/BizForm';
// 初始化时需要的一些数据
const listData = {
  customerTypeList: [{ label: '个人', value: 'personal' }, { label: '行业', value: 'company' }, { label: '其他', value: 'other' }],
  maritalStatusList: [{ label: '已婚', value: 'married' }, { label: '未婚', value: 'unmarried' }],
  salesList: [],
  activeNames: [],
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    }
  },
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      auth: ['admin:potential.edit']
    }
  ]
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    customerChannel: { id: '' },
    entryDate: new Date(),
    salesAdvisor: { id: '' },
    gernder: 'unknown',
    head: '/resources/admin/images/Avatar.png',
    customerType: 'personal'
  };
};
// 表单相关信息
const formData = {
  data: {
    openV: false,
    picUrl: '',
    loading: false,
    channelList: [],
    defaultUser: '/resources/admin/images/Avatar.png',
    formModel: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.openV = true;
    },
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.formModel.head = url;
    },
    customerTypeChange() {
      this.$refs.form.clearValidate('customerType');
    },
    channelChange() {
      this.$refs.form.clearValidate('customerChannel');
    },
    queryConsumerInfo() {
      http
        .get(potentialCustomerMgmt.baseInfo.editQuery, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId.id,
          viewMode: this.viewMode
        })
        .then(data => {
          // 销售主管可以选择其他人员
          // 普通销售人员默认为自己，如果该潜客有销售顾问数据，则使用该数据
          if (!this.salesList || this.salesList.length === 0) {
            if (data.potentialConsumer && data.potentialConsumer.salesAdvisor && data.potentialConsumer.salesAdvisor.id) {
              this.salesList = [{ name: '无', id: '' }].concat([
                {
                  name: data.potentialConsumer.salesAdvisor.name,
                  id: data.potentialConsumer.salesAdvisor.id
                }
              ]);
            } else {
              this.salesList = [{ name: '无', id: '' }].concat([{ name: this.getUser().realName, id: this.getUser().id }]);
            }
          }
          // 如果potentialConsumer存在，则是编辑状态，否则为新增
          if (data.potentialConsumer) {
            let obj = data.potentialConsumer;
            obj.entryDate = new Date(obj.entryDate);
            obj.inshopDate = obj.inshopDate ? new Date(obj.inshopDate) : undefined;
            if (!obj.salesAdvisor) obj.salesAdvisor = { id: '' };
            this.formModel = obj;
            let flag = true;
            this.salesList.map(item => {
              if (
                data.potentialConsumer.salesAdvisor &&
                data.potentialConsumer.salesAdvisor.id &&
                item.id === data.potentialConsumer.salesAdvisor.id
              ) {
                flag = false;
              }
            });
            if (flag && data.potentialConsumer.salesAdvisor && data.potentialConsumer.salesAdvisor.id) {
              this.salesList = this.salesList.concat([
                { name: data.potentialConsumer.salesAdvisor.name, id: data.potentialConsumer.salesAdvisor.id }
              ]);
            }
          } else {
            let obj = this.getDefaultModel();
            obj.salesAdvisor.id = this.getUser().id;
            this.formModel = obj;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        })
        .finally(data => {
          this.loading = false;
        });
    },
    resetModel() {
      if (!this.salesList || this.salesList.length === 0) {
        this.salesList = [{ name: '无', id: '' }].concat([{ name: this.getUser().realName, id: this.getUser().id }]);
      }
      let obj = this.getDefaultModel();
      obj.salesAdvisor.id = this.getUser().id;
      this.formModel = obj;
    },
    getChannelList() {
      http
        .get(potentialCustomerMgmt.customerChannels, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          this.channelList = data.dataList.map(item => {
            return { value: item.id, label: item.name };
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        token: '',
        id: this.formModel.id,
        customerChannel: { id: this.formModel.customerChannel.id },
        entryDate: dateUtil.dateConverter(this.formModel.entryDate),
        inshopDate: dateUtil.dateConverter(this.formModel.inshopDate),
        potentialConsumerId: this.formModel.potentialConsumerId,
        salesAdvisor: { id: this.formModel.salesAdvisor.id },
        name: this.formModel.name,
        gernder: this.formModel.gernder,
        head: this.formModel.head,
        customerType: this.formModel.customerType,
        mobile: this.formModel.mobile,
        // certificateNumber: this.formModel.certificateNumber,
        maritalStatus: this.formModel.maritalStatus,
        address: this.formModel.address,
        job: this.formModel.job,
        shopId: window.top.SHOP_ID || '',
        viewMode: this.viewMode
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = this.getSaveParams();
          !this.formModel.id &&
            http
              .post(potentialCustomerMgmt.baseInfo.add, params)
              .then(data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess', data.potentialConsumerId);
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
          this.formModel.id &&
            http
              .put(potentialCustomerMgmt.baseInfo.update, params)
              .then(data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
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
        } else {
          return false;
        }
      });
    }
  }
};
// 创建会员
const createMemberData = {
  events: {
    handleCreateClick(e) {
      if (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.formModel.mobile)) {
        this.createMember();
      }
    }
  },
  methods: {
    createMember() {
      this.loading = true;
      http
        .post(potentialCustomerMgmt.baseInfo.createMember, {
          shopId: window.top.SHOP_ID || '',
          gender: this.formModel.gernder,
          mobile: this.formModel.mobile,
          name: this.formModel.name,
          userSource: '1',
          viewMode: this.viewMode
        })
        .then(data => {
          this.$message.success('创建成功');
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
  }
};

export default {
  name: 'PotentialCustomerBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew,
    VueCropper
  },
  data() {
    let checkCustomerChannel = (rule, rules, callback) => {
      if (!this.formModel.customerChannel.id) {
        return callback(new Error('请选择渠道'));
      }
      return callback();
    };
    return {
      ...listData,
      ...formData.data,
      rules: {
        customerChannel: [
          {
            required: true,
            validator: checkCustomerChannel,
            trigger: 'blur'
          }
        ],
        // salesAdvisor: [
        //   {
        //     required: true,
        //     validator: checkAdvisor,
        //     trigger: ['blur', 'change']
        //   }
        // ],
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
          { max: 20, message: '客户姓名长度不得超过20位', trigger: 'blur' }
        ],
        gernder: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        entryDate: [{ required: true, message: '请输入建档日期', trigger: 'blur' }],
        customerType: [{ required: true, message: '请选择客户类型', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ]
        // certificateNumber: [
        //   {
        //     pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        //     message: '身份证号格式错误',
        //     trigger: 'blur'
        //   }
        // ]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    viewMode: {
      type: String,
      default() {
        return 'merge';
      }
    }
  },
  computed: {
    ...mapGetters('Sales', ['potentialInfo', 'consumerInfo'])
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Sales', ['updatePotentialInfo', 'updateConsumer']),
    ...formData.methods,
    ...formData.events,

    ...createMemberData.methods,
    ...createMemberData.events
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.clearValidate();
      this.activeNames = [];
      if (this.potentialInfo.sales) {
        this.salesList = [{ name: '无', id: '' }].concat(this.potentialInfo.sales);
      }
      if (nVal.id) {
        this.queryConsumerInfo();
      }
    }
  },
  created() {
    this.getChannelList();
    this.salesList = this.potentialInfo.sales || [];
    if (this.itemId.id) this.queryConsumerInfo();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-collapse-item__header.is-active {
    background-color: #fef3e5;
  }
  .el-collapse-item__wrap {
    padding-top: 10px;
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
  .biz-scroller {
  }
}
</style>
