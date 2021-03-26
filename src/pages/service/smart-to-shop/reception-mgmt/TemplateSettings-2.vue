<template>
  <biz-grid class="template-settings">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="150px" size="small" v-loading="loading">
      <el-form-item>
        <template slot="label">
          入口道闸欢迎消息
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" style="width: 300px;">此处修改入口道闸欢迎消息 示例: (车牌)/n(会员姓名)XXX4S店竭诚欢迎您的到来! 注: 括号部分请勿修改, 不超过30个字</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <el-select v-model="form.accessMsgType" placeholder="请选择入口道闸消息模板">
          <el-option v-for="item in templateList" :key="item.accessMsgType" :label="item.name" :value="item.accessMsgType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="accessMsg">
        <el-input v-model="form.accessMsg" :disabled="form.accessMsgType === '0'" type="textarea" placeholder="请输入入口道闸消息"></el-input>
        <!-- <biz-editor ref="editor" mini :isDisabled="form.accessMsgType === '0'" :height="200" :width="260" v-model="form.accessMsg" :isSetting="isSetting"></biz-editor> -->
      </el-form-item>
      <el-form-item>
        <template slot="label">
          出口道闸欢迎消息
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" style="width: 300px;">此处修改出口道闸欢迎消息 示例: (车牌)/n(会员姓名)XXX4S店竭诚欢迎您再次到来! 注: 括号部分请勿修改,不超过30个字</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <el-select v-model="form.leaveMsgType" placeholder="请选择出口道闸消息模板">
          <el-option v-for="item in templateList" :key="item.leaveMsgType" :label="item.name" :value="item.leaveMsgType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="leaveMsg">
        <el-input v-model="form.leaveMsg" :disabled="form.leaveMsgType === '0'" type="textarea" placeholder="请输入出口道闸消息"></el-input>
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
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        accessMsg: [
          { required: true, message: '请输入入口道闸消息', trigger: 'blur' },
          { max: 30, message: '不得多于30字', trigger: 'blur' }
        ],
        leaveMsg: [
          { required: true, message: '请输入出口道闸消息', trigger: 'blur' },
          { max: 30, message: '不得多于30字', trigger: 'blur' }
        ]
      },
      form: this.getOriginForm(),
      templateList: [],
      templateMap: new Map()
    };
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
        // accessId: '',
        // leaveId: '',
        accessMsgType: '',
        leaveMsgType: '',
        accessMsg: '',
        leaveMsg: ''
        // isAutoOpen: false,
        // isAutoIn: false,
        // autoInType: '',
        // autoOpenType: ''
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
      let params = Object.assign({}, this.form);
      this.loading = true;
      http
        .post(
          customerService.ReceptionMgmt.templateSettings.templateData,
          params
        )
        .then(data => {
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
      http
        .get(customerService.ReceptionMgmt.templateSettings.templateData, {
          shopId: this.getUser().shop.id
        })
        .then(data => {
          this.templateList = data.dataList;
          // 暂时以accessMsgType进行区分，后台数据结构未来需要重构
          this.templateList.forEach(item => {
            this.templateMap.set(item.accessMsgType, item);
          });
          Object.assign(this.form, data.data);
          this.form.accessMsg = this.form.accessMsg.replace('/n', '');
          this.form.leaveMsg = this.form.leaveMsg.replace('/n', '');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.isCreate = false;
            this.isSetting = false;
          });
        });
    },
    // queryTemplate() {
    //   http
    //     .get(customerService.ReceptionMgmt.templateSettings.queryTemplate)
    //     .then(data => {
    //       let map = new Map();
    //       let mapAccess = new Map();
    //       let mapLeave = new Map();
    //       data.data.map(item => {
    //         map.set(item.id, item);
    //         mapAccess.set(item.accessMsg, item.id);
    //         mapLeave.set(item.leaveMsg, item.id);
    //       });
    //       this.templateMap = map;
    //       this.mapByAccessMsg = mapAccess;
    //       this.mapByLeaveMsg = mapLeave;
    //       this.templateList = [{ id: '', name: '自定义模板' }].concat(
    //         data.data
    //       );
    //       // this.templateList = data.data;
    //     })
    //     .catch();
    // },
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
  },
  watch: {
    'form.accessMsgType': function(newVal, oldVal) {
      if (newVal === '0' && !this.isCreate) {
        this.$set(
          this.form,
          'accessMsg',
          this.templateMap.get(newVal).accessMsg.replace('/n', '')
        );
      }
    },
    // 'form.accessMsg': function(newVal, oldVal) {
    //   if (this.form.accessId && newVal !== this.templateMap.get(this.form.accessId).accessMsg) {
    //     this.form.accessId = '';
    //   }
    //   if (this.mapByAccessMsg.get(newVal)) {
    //     this.form.accessId = this.mapByAccessMsg.get(newVal);
    //   }
    // },
    'form.leaveMsgType': function(newVal, oldVal) {
      if (newVal === '0' && !this.isCreate) {
        this.$set(
          this.form,
          'leaveMsg',
          this.templateMap.get(newVal).leaveMsg.replace('/n', '')
        );
      }
    }
    // 'form.leaveMsg': function(newVal, oldVal) {
    //   if (this.form.leaveId && newVal !== this.templateMap.get(this.form.leaveId).leaveMsg) {
    //     this.form.leaveId = '';
    //   }
    //   if (this.mapByLeaveMsg.get(newVal)) {
    //     this.form.leaveId = this.mapByLeaveMsg.get(newVal);
    //   }
    // }
  }
};
</script>

<style lang="scss">
.template-settings {
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px 20px 20px 0;
  }
  .auto-leave-select {
    margin-top: 18px;
  }
}
</style>
