<template>
  <biz-grid class="banisters-settings">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :model="form" ref="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="自动到店设置">
        <!-- <el-checkbox v-model="form.autoIn" true-label="1" false-label="0">自动到店</el-checkbox>
        <br />
        <el-select class="auto-leave-select" v-if="form.autoIn" v-model="form.autoInType" placeholder="请选择自动到店范围">
          <el-option label="全部车辆" value="0"></el-option>
          <el-option label="会员车辆" value="1"></el-option>
        </el-select> -->
        <el-radio-group v-model="form.autoInType">
          <el-radio label="0">全部车辆</el-radio>
          <el-radio label="1">会员车辆</el-radio>
          <el-radio label="2">非自动到店</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自动离店设置">
        <!-- <el-checkbox v-model="form.autoOut" true-label="1" false-label="0">自动离店</el-checkbox>
        <br />
        <el-select class="auto-leave-select" v-if="form.autoOut" v-model="form.autoOutType" placeholder="请选择自动离店范围">
          <el-option label="全部车辆" value="0"></el-option>
          <el-option label="会员车辆" value="1"></el-option>
        </el-select> -->
        <el-radio-group v-model="form.autoOutType">
          <el-radio label="0">全部车辆</el-radio>
          <el-radio label="1">会员车辆</el-radio>
          <el-radio label="2">非自动离店</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="临时车辆放行">
        <el-checkbox v-model="form.autoLeave" true-label="1" false-label="0"></el-checkbox>
        &nbsp;
        <el-input-number v-model="form.autoLeaveInterval" controls-position="right" :min="1" :disabled="form.autoLeave==='0'"></el-input-number> 分钟内自动放行
      </el-form-item>
      <el-form-item label="播报声音">
        <el-select v-model="form.voiceType" placeholder="请选择播报声音">
          <el-option label="小玲" value="0"></el-option>
          <el-option label="尹小坚" value="1"></el-option>
          <el-option label="易小强" value="2"></el-option>
          <el-option label="田蓓蓓" value="3"></el-option>
          <el-option label="唐老鸭" value="4"></el-option>
          <el-option label="小燕子" value="5"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { customerService } from '@/common/urls';
import http from '@/common/http';

import { mapGetters } from 'vuex';

export default {
  name: 'TemplateSettings',
  data() {
    return {
      loading: false,
      isCreate: false,
      isSetting: false,
      operations: [{ label: '保存', name: 'save', type: 'primary', auth: ['admin:reception.edit'] }],
      form: this.getOriginForm()
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizSaveButton
    // BizEditor
  },
  methods: {
    ...mapGetters(['getUser']),

    operate(name) {
      this[name]();
    },
    getOriginForm() {
      return {
        autoOut: '0',
        autoIn: '0',
        autoInType: '',
        autoOutType: '',
        voiceType: '0',
        autoLeave: '0',
        autoLeaveInterval: '15'
      };
    },
    // 点击'保存'按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    update() {
      if (this.form.autoInType === '2') {
        this.form.autoIn = '0';
      } else {
        this.form.autoIn = '1';
      }
      if (this.form.autoOutType === '2') {
        this.form.autoOut = '0';
      } else {
        this.form.autoOut = '1';
      }
      let params = Object.assign({}, this.form);
      this.loading = true;
      http
        .put(customerService.ReceptionMgmt.gate, params, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('update');
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.isCreate = true;
      this.isSetting = true;
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get(customerService.ReceptionMgmt.gate, params)
        .then(data => {
          this.form = Object.assign(this.form, data.data);
          if (data.data.autoIn === '0') {
            this.form.autoInType = '2';
          }
          if (data.data.autoOut === '0') {
            this.form.autoOutType = '2';
          }
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true,
        duration: 1000
      });
    }
  },
  mounted() {
    // this.queryTemplate();
    this.refresh();
  }
};
</script>

<style lang="scss">
.banisters-settings {
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px 20px 20px 0;
  }
  .biz-save-button {
    float: left;
  }
  .auto-leave-select {
    margin-top: 18px;
  }
}
</style>
