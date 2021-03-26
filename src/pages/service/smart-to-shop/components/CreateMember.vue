<template>
  <el-dialog append-to-body class="create-member" title="创建会员" width="500px" :visible.sync="dialogVisible" @open="clear">
    <biz-grid>
      <el-form ref="form" size="small" label-width="80px" :model="form" :rules="rules" :v-loading="loading" :inline-message="true">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号，如1888888888" @blur="mobileBlur"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名，如1888888888"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称，如1888888888"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名，如张三"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" auto-complete="off" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" auto-complete="off" v-model="checkPass" placeholder="请确认密码"></el-input>
        </el-form-item> -->
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="form.gender" label="0">男</el-radio>
          <el-radio v-model="form.gender" label="1">女</el-radio>
          <el-radio v-model="form.gender" label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="defaultCarInfo.plateNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="brand" placeholder="请选择，如宝马" filterable style="width: 100%;" @change="handleBrandChange">
            <el-option v-for="(item,index) in brandList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列">
          <el-select v-model="series" placeholder="请选择，如宝马3系" filterable style="width: 100%;" @change="handleSeriesChange">
            <el-option v-for="(item,index) in seriesList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="type" placeholder="请选择，如宝马3系2016款" style="width: 100%;">
            <el-option v-for="(item,index) in modeList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆识别代码">
          <el-input v-model="vin" placeholder="请输入车辆识别代码，如1G1BL52P7TR115520"></el-input>
        </el-form-item>
      </el-form>
    </biz-grid>
    <biz-save-button slot="footer" :operations="operations" @operate="operate"></biz-save-button>
  </el-dialog>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/vehicle-mgmt/VehicleBaseInfo';
import { customerService } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'CreateMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    plateNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    let pwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else {
        if (this.checkPass) {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    let checkPass = (rule, value, callback) => {
      if (!this.checkPass) {
        callback(new Error('请再次输入密码'));
      } else if (this.checkPass !== this.form.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      loading: false,
      brandList: [],
      seriesList: [],
      modeList: [],
      brand: '',
      series: '',
      type: '',
      vin: '',
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 20, message: '不得超过20位', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 20, message: '不得超过20位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 20, message: '不得超过20位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: pwd, trigger: 'blur' },
          { min: 6, max: 20, message: '密码应在6-20位之间', trigger: 'blur' }
        ],
        checkPass: [{ validator: checkPass, trigger: 'blur', required: true }],
        type: [{ required: true, message: '请输入车型', trigger: 'blur' }],
        vin: [
          { required: true, message: '请输入车辆识别代码', trigger: 'blur' },
          {
            pattern: /^[A-Z0-9]{17}$/,
            message: '车辆识别代码格式错误',
            trigger: 'blur'
          }
        ]
      },
      form: this.getDefaultForm(),
      checkPass: '',
      operations: [{ label: '创建', name: 'save', type: 'primary' }]
    };
  },
  computed: {
    defaultCarInfo() {
      return {
        plateNumber: this.plateNumber,
        brand: this.brand,
        series: this.series,
        type: this.type,
        vin: this.vin
      };
    }
  },
  created() {
    this.queryBrandList();
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    mobileBlur() {
      if (!this.form.id && !this.form.nickname) {
        this.$set(this.form, 'nickname', this.form.mobile);
      }
      if (!this.form.id && !this.form.userName) {
        this.$set(this.form, 'userName', this.form.mobile);
      }
    },
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.$set(this.series, '');
      this.$set(this.type, '');
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.$set(this.type, '');
    },
    querySeriesList(val) {
      service.querySeriesList(
        { brand: val },
        data => {
          this.seriesList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryBrandList() {
      service.queryBrandList(
        {},
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(val) {
      service.queryTypeList(
        { series: val, brand: this.brand },
        data => {
          this.modeList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.create();
        } else {
          return false;
        }
      });
    },
    create() {
      let params = Object.assign(
        this.form,
        this.defaultCarInfo,
        { defaultCarInfo: this.defaultCarInfo },
        { token: '' }
      );
      this.loading = true;
      http
        .post(customerService.ReceptionMgmt.baseInfo.createMember, params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          let memberInfo = {
            memberId: data.member.id,
            memberName: data.member.name,
            memberCardSn: data.memberCard.sn,
            userRankName: data.memberCard.memberRank.name
          };
          this.$emit('created', Object.assign({}, memberInfo));
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    clear() {
      this.form = this.getDefaultForm();
      this.checkPass = '';
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    getDefaultForm() {
      return {
        userName: '',
        nickname: '',
        mobile: '',
        password: '123456',
        name: '',
        gender: '2'
      };
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true,
        duration: 1000
      });
    }
  },
  mounted() {},
  watch: {
    visible(newVal, oldVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal, oldVal) {
      if (!newVal) {
        this.$emit('update:visible', false);
      }
    }
  }
};
</script>

<style lang="scss">
.create-member {
  .biz-grid,
  .biz-scroller {
    position: static;
  }
  .el-form {
    margin: 0 20px;
  }
  .el-dialog__body {
    padding-bottom: 0;
  }
}
</style>
