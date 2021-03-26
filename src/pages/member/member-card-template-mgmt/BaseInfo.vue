<template>
  <biz-grid class="member-card-template-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit" style="margin-right: 0px;">
    </biz-save-button>
    <el-form ref="form" :model="form" label-width="120px" size="small" class="item" :rules="rules" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="会员卡名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入卡名称"></el-input>
      </el-form-item>
      <el-form-item label="会员卡描述" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入会员卡描述"></el-input>
      </el-form-item>
      <!-- <el-form-item label="有效期" prop="date">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
      </el-form-item> -->
      <el-form-item label="有效期开始日期" prop="date">
        <el-date-picker v-model="form.beginDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效期截止日期" prop="date">
        <el-date-picker v-model="form.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="截至日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-switch v-model="form.state"  active-color="#87d068" inactive-color="#d9d9d9" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="默认会员卡" prop="isDefault">
        <el-switch v-model="form.isDefault" :disabled="disabled"  active-color="#87d068" inactive-color="#d9d9d9" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="奖励设置" prop="isGeneralReward">
        <el-radio-group v-model="form.isGeneralReward" style="padding:5px">
          <el-radio label="1">通用奖励设置</el-radio>
          <el-radio label="0">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import date from '@/utils/date';
export default {
  name: 'MemberCardTemplateMgmt',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  data() {
    return {
      loading: false,
      gradeList: [],
      templateId: '',
      isCreated: false,
      disabled: false,
      form: {
        name: '',
        description: '',
        state: '1',
        isDefault: '0',
        beginDate: '',
        endDate: '',
        isGeneralReward: '1'
      },
      rules: {
        name: [{ required: true, message: '请输入卡模版名称', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  computed: {
    dateRange: {
      get() {
        if (this.form.beginDate && this.form.endDate) {
          return [this.form.beginDate, this.form.endDate];
        } else {
          return [date.nowDate(), date.lastTwoYearDate()];
        }
      },
      set(newValue) {
        if (newValue) {
          this.form.beginDate = newValue[0];
          this.form.endDate = newValue[1];
        } else {
          this.form.beginDate = '';
          this.form.endDate = '';
        }
      }
    }
  },
  created() {},
  mounted() {},
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal.id) {
        if (nVal.id !== oVal.id) {
          this.getList();
        }
      } else {
        if (nVal.id !== oVal.id) {
          this.initModel();
        }
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    operationSuccess() {
      this.getList();
    },
    initModel() {
      this.form = {
        name: '',
        description: '',
        state: '1',
        isDefault: '0',
        isGeneralReward: '1',
        beginDate: date.nowDate(),
        endDate: date.lastTwoYearDate()
      };
    },
    refresh() {},
    getList() {
      this.loading = true;
      this.itemId.id &&
        service.getVipCardTemplate(
          {
            templateId: this.itemId.id || ''
          },
          data => {
            this.form = data.content;
            if (data.content.isDefault === '1') {
              this.disabled = true;
            } else {
              this.disabled = false;
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
      if (this.form.beginDate && this.form.endDate && this.form.beginDate > this.form.endDate) {
        this.$message.warning('开始日期不能大于结束日期');
        return;
      }
      this.itemId.id &&
        service.updateTemplate(
          {
            id: this.itemId.id || '',
            name: this.form.name,
            description: this.form.description,
            beginDate: this.form.beginDate,
            endDate: this.form.endDate,
            state: this.form.state,
            isDefault: this.form.isDefault,
            isGeneralReward: this.form.isGeneralReward,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('code错误');
          }
        );
      !this.itemId.id &&
        service.createTemplate(
          {
            name: this.form.name,
            description: this.form.description,
            beginDate: this.form.beginDate,
            endDate: this.form.endDate,
            isDefault: this.form.isDefault,
            isGeneralReward: this.form.isGeneralReward,
            state: this.form.state,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.$message.success('保存成功');
            this.itemId.id = data.templateId;
            this.getList();
            this.$emit('operationSuccess', data.templateId);
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('code错误');
          }
        );
      this.templateId && this.$refs.awards.save();
    }
  }
};
</script>

<style lang="scss">
.member-card-template-info {
  padding: 20px;
  height: 100%;
  overflow: auto;
  .biz-save-button {
    float: left;
  }
  .el-card {
    width: 1360px;
    margin: 20px 0px;
  }
  .title_info {
    width: 2px;
    height: 13px;
    background: #ff7300;
    float: left;
    margin: 5px 5px 0px 0px;
  }
  .item {
    .el-date-editor .el-range-separator {
      width: 10%;
    }
  }
}
</style>
