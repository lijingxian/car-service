<template>
  <biz-grid class="increase-fee">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading">
      <div class="service-column">
        <div class="flex">
          <div class="rights_card" v-for="(tag,index) in tableData" :key="index">
            <div class="logo">
              <div class="image">
                <div>{{tag.quantity}}条</div>
                <div>￥{{tag.price}}</div>
              </div>
              <i class="el-icon-close" @click.stop="deleteHandler(tag)"></i>
            </div>
          </div>
          <div class="rights_card_add">
            <div class="image">
              <img class="addImg" :src="add" alt="" @click="open=true" />
            </div>
          </div>
        </div>
      </div>
      <div v-show="open">
        <el-form-item label="短信充值数量" prop="quantity">
          <el-input placeholder="请输入短信续增数量" v-model="form.quantity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" prop="price">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
        <biz-save-button slot="top" :operations="operations" @operate="operate" @click="open=false">
        </biz-save-button>
      </div>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/message-mgmt/messageMgmt';
import add from '@/assets/images/add.svg';
import { mapGetters } from 'vuex';
export default {
  name: 'IncreaseFee',
  props: {
    itemId: {
      type: String
    }
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      rules: {
        quantity: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                this.form.quantity === '' ||
                Number(this.form.quantity) <= 0
              ) {
                callback(new Error('请输入大于0的数字'));
              } else {
                callback();
              }
            }
          }
        ],
        price: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.form.price === '' || Number(this.form.price) <= 0) {
                callback(new Error('请输入大于0的数字'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // 用户信息
      form: {
        price: '',
        quantity: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        },
        {
          label: '取消',
          name: 'cancel',
          type: ''
        }
      ],
      tableData: [1, 2, 4, 5, 6, 7, 8],
      loading: false,
      open: false,
      add: add,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: ''
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.form.operator = this.getUser().realName;
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    cancel() {
      this.open = false;
    },
    deleteHandler(tag) {
      service.deleteSmsPackage({ ids: [tag.id] }, data => {
        this.tableData.splice(this.tableData.indexOf(tag), 1);
        this.$message.success('删除成功');
        this.getList();
      });
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    getList() {
      service.listSmsPackage({}, data => {
        this.loading = false;
        this.tableData = data.dataList;
      });
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          service.createSmsPackage(
            this.getSaveParams(),
            data => {
              this.$message.success('保存成功');
              this.form.price = '';
              this.form.quantity = '';
              this.getList();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    getSaveParams() {
      return {
        price: this.form.price || '0.00',
        quantity: this.form.quantity || '1'
      };
    }
  }
};
</script>

<style lang="scss">
.increase-fee {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-input {
    width: 200px;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
  .biz-save-button {
    justify-content: flex-start;
    margin-left: 20px;
  }
  .service-column {
    .flex {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      .rights_card {
        display: inline-block;
        width: 23%;
        position: relative;
        margin: 20px 0px 20px 20px;
        transition: all 0.3s;
        &:hover {
          opacity: 0.9;
          > .logo {
            i {
              opacity: 1;
              cursor: pointer;
            }
          }
        }
        .logo {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          border: 1px solid #c1c1c1;
          border-radius: 10%;
          .image {
            text-align: center;
            position: relative;
            padding: 10px;
          }
          i {
            font-size: 15px;
            background: #000;
            color: #fff;
            position: absolute;
            border-radius: 50%;
            float: right;
            top: 0px;
            right: 0px;
            opacity: 0;
            transition: all 0.3s;
          }
        }
      }
      .rights_card_add {
        text-align: center;
        margin: 20px 0px 20px 20px;
        .image {
          border: dashed 1px #929292;
          border-radius: 5px;
          width: 85px;
          height: 60px;
          background-repeat: no-repeat;
          padding: 2px;
          cursor: pointer;
          img {
            margin-top: 10px;
            color: #c1c1c1;
          }
        }
      }
    }
  }
}
</style>
