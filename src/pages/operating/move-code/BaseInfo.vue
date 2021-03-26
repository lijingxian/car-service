<template>
  <biz-grid class="base-info-move-code" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="130px" size="small" :inline-message="true">
      <el-form-item label="挪车码名称" prop="name">
        <el-input placeholder="请输入挪车码名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="生成数量" prop="count">
        <el-input v-model.number="form.count" :disabled="!!id" placeholder="生成数量区间值为0-1000"></el-input>
      </el-form-item>
      <el-form-item label="挪车码模版" prop="type">
        <el-select v-model="form.type" placeholder="请选择" :disabled="!!id">
          <el-option label="椭圆形" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挪车码效果">
        <img :src="moveCode" width="260px" />
      </el-form-item>
      <el-form-item label="所属运营商" prop="operator">
        <biz-operator-picker v-model="allocateModel.operator" @input="handleOperatorChange"
          v-show="getUser.roleLevel!=='shop'&&!id"></biz-operator-picker>
        <el-input v-show="getUser.roleLevel!=='shop'&&id" disabled v-model="operatorName"></el-input>
        <el-input v-show="getUser.roleLevel==='shop'" disabled v-model="getUser.compy.name"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺" prop="storeData">
        <biz-shop-picker v-model="allocateModel.storeData.id" :operatorId="operatorId" v-show="getUser.roleLevel!=='shop'&&!id"
          :disabled="!!id">
        </biz-shop-picker>
        <el-input v-show="getUser.roleLevel!=='shop'&&id" disabled v-model="storeName"></el-input>
        <el-input v-show="getUser.roleLevel==='shop'" disabled v-model="getUser.shop.name"></el-input>
      </el-form-item>
      <el-form-item label="生成时间">
        <el-input v-model="form.createDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="form.operator.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="来源">
        <el-input :value="form.source==='0'?'平台发放':form.source==='1'?'店铺发放':'用户申请'" disabled></el-input>
      </el-form-item>
    </el-form>
    <el-dialog :title="title" class="biz-import-file__uploading-dialog" :visible.sync="uploadingVisible" @close="clearTimeOut"
      append-to-body>
      <div class="info">
        <span class="success">成功生成：{{count}}条</span>
        <span class="error">共计：{{total}}条</span>
      </div>
      <el-progress class="biz-import-file__uploading-dialog__progress" :stroke-width="12" :percentage="percentage"></el-progress>
      <div class="info" v-show="showCurrentInfo">
        <span class="success">正在生成：{{stepkey}}</span>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizOperatorPicker } from '@/components/BizOperatorPicker';
import { BizShopPicker } from '@/components/BizShopPicker';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import moveCode from '@/assets/images/moveCode.png';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      dialogVisibleScreen: false,
      moveCode: moveCode,
      open: false,
      list: [],
      operatorName: '',
      storeName: '',
      percentage: 0,
      count: 0,
      total: 0,
      stepkey: '',
      t: '',
      title: '生成中',
      importingVisible: false,
      uploadingVisible: false,
      disabled: false,
      showCurrentInfo: true,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      allocateModel: this.getDefaultAllocateForm(),
      form: this.getDefaultModel(),
      rules: {
        name: [{ required: true, message: '请输入挪车码名称', trigger: 'blur' }],
        count: [
          { required: true, message: '请输入生成数量', trigger: 'blur' },
          {
            pattern: /^([1-9][0-9]{0,2}|1000)$/,
            message: '生成数量区间值为0-1000',
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: '请选择挪车码模版', trigger: 'blur' }],
        operator: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(this.allocateModel.operator);
              if (
                this.getUser.roleLevel === 'shop' ||
                this.id ||
                (this.allocateModel.operator && this.allocateModel.operator.length > 0)
              ) {
                callback();
              } else {
                callback(new Error('请选择所属运营商'));
              }
            }
          }
        ],
        storeData: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                (this.getUser.roleLevel === 'platform' || this.getUser.roleLevel === 'company') &&
                !this.allocateModel.storeData.id &&
                !this.id
              ) {
                callback(new Error('请选择所属店铺'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BizOperatorPicker, BizShopPicker },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        this.form = this.getDefaultModel();
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(['getUser']),
    operatorId() {
      if (
        this.allocateModel.operator &&
        this.allocateModel.operator.length > 0 &&
        this.allocateModel.operator[this.allocateModel.operator.length - 1] === ''
      ) {
        return this.allocateModel.operator[this.allocateModel.operator.length - 2];
      }
      if (
        this.allocateModel.operator &&
        this.allocateModel.operator.length > 0 &&
        this.allocateModel.operator[this.allocateModel.operator.length - 1] !== ''
      ) {
        return this.allocateModel.operator[this.allocateModel.operator.length - 1];
      }
      return this.getUser.compy.id;
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    handleImport() {
      console.log(this.count);
      this.count = Math.ceil(this.form.count / 50) + this.count; // 每秒导入个数
      if (this.count > this.form.count) {
        this.percentage = 100;
        this.count = this.form.count;
        this.title = '生成完成';
        this.clearTimeOut();
        return;
      }
      this.percentage = parseInt((this.count / this.form.count) * 100);
      this.t = setTimeout(this.handleImport, 1000);
    },
    handleOperatorChange(val) {
      this.allocateModel.storeData = {
        id: '',
        name: ''
      };
    },
    getDefaultAllocateForm(ids) {
      return {
        ids: ids || [],
        operator: [],
        storeData: {
          id: '',
          name: ''
        }
      };
    },
    getDefaultModel() {
      return {
        count: '',
        id: '',
        type: '0',
        name: '',
        state: '0',
        createDate: '',
        operator: {
          name: ''
        },
        source: ''
      };
    },
    setDefaultModel() {
      this.form = {
        count: '',
        id: '',
        type: '0',
        name: '',
        state: '0',
        createDate: '',
        operator: {
          name: ''
        },
        source: ''
      };
    },
    closed() {
      this.dialogVisibleScreen = false;
    },
    play() {
      this.dialogVisibleScreen = true;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.total = this.form.count;
          if (!this.id) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        moveCarId: this.id
      };
      http
        .get('/admin/movecar/moveCar.jhtml', params)
        .then(data => {
          this.form = Object.assign(this.getDefaultModel(), data.data);
          this.operatorName = data.data.company.name;
          this.storeName = data.data.store.name;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    create() {
      this.loading = true;
      let companyId = '';
      if (
        this.allocateModel.operator &&
        this.allocateModel.operator.length > 0 &&
        this.allocateModel.operator[this.allocateModel.operator.length - 1] === ''
      ) {
        companyId = this.allocateModel.operator[this.allocateModel.operator.length - 2];
      }
      if (
        this.allocateModel.operator &&
        this.allocateModel.operator.length > 0 &&
        this.allocateModel.operator[this.allocateModel.operator.length - 1] !== ''
      ) {
        companyId = this.allocateModel.operator[this.allocateModel.operator.length - 1];
      }
      http
        .post('/admin/movecar/moveCar.jhtml', {
          count: this.form.count,
          type: '0',
          state: '0',
          name: this.form.name,
          company: this.getUser.roleLevel !== 'shop' ? { id: companyId } : { id: this.getUser.compy.id },
          store: this.getUser.roleLevel !== 'shop' ? { id: this.allocateModel.storeData.id } : { id: this.getUser.shop.id }
        })
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.$emit('created');
          this.uploadingVisible = true;
          this.handleImport();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      http
        .put('/admin/movecar/moveCar.jhtml', this.form)
        .then(data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.base-info-move-code {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-select {
    width: 100%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
$biz-import-file__uploading-dialog-width: 560px;
$biz-import-file__uploading-dialog-height: 256px;
$biz-import-file__uploading-dialog-border-radius: 12px;

$biz-import-file__progress-bar-width: 460px;
$biz-import-file__progress-bar-text-font-size: 14px;
$biz-import-file__progress-bar-text-width: 54px;
.biz-import-file__uploading-dialog {
  .el-dialog {
    width: $biz-import-file__uploading-dialog-width;
    height: $biz-import-file__uploading-dialog-height;
    border-radius: $biz-import-file__uploading-dialog-border-radius;

    .el-dialog__header {
      font-size: 16px;
      color: #1a1a1a;
      padding-left: 50px;
      text-align: center;
      .el-dialog__title {
        display: inline-block;
      }
    }

    .el-dialog__body {
      .info {
        display: flex;
        justify-content: space-between;
        text-align: right;

        > span {
          font-weight: bold;

          &.error {
            margin-right: 30px;
          }

          &.success {
            margin-left: 30px;
          }
        }
      }
      .biz-import-file__uploading-dialog__progress {
        position: relative;
        width: $biz-import-file__progress-bar-width;
        margin: (($biz-import-file__uploading-dialog-height - 54) / 2 - 42) auto
          (($biz-import-file__uploading-dialog-height - 54) / 2 - 62);

        .el-progress-bar {
          padding: 0;
        }

        .el-progress__text {
          display: inline-block;
          position: absolute;
          left: 0;
          bottom: 150%;
          width: $biz-import-file__progress-bar-text-width;
          margin-left: (-1 * $biz-import-file__progress-bar-text-width / 2);
          border-radius: 3px;
          padding: 5px 0;
          text-align: center;
          font-size: $biz-import-file__progress-bar-text-font-size !important;
          color: #fff;
          background: #ff7300;

          &:after {
            content: ' ';
            display: block;
            position: absolute;
            left: 50%;
            margin-left: -4px;
            top: 100%;
            border-color: #ff7300 transparent transparent;
            border-style: solid;
            border-width: 4px 4px 0 4px;
          }
        }
      }
    }
  }
}
</style>
