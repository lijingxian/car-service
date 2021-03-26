<template>
  <biz-grid class="rights-coupon-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate">
    </biz-header>
    <div class="coupon-content">
      <div v-for="coupon in tableData" :key="coupon.id" class="flex">
        <div class="check">
          <el-checkbox v-model="coupon.selected" @change="rowSelectTrigger(coupon.id,'select',coupon)"></el-checkbox>
        </div>
        <div class="coupon" @click="query(coupon)">
          <div class="before">
            <span class="amount">￥{{coupon.amount}}</span>
            <span>{{coupon.minimumPrice ? '满' + coupon.minimumPrice + '减' + coupon.amount : '无限制'}}</span>
          </div>
          <div class=""><img :src="ticket" height="80px"></div>
          <div class="after">
            <span>{{coupon.name}}</span>
          </div>
        </div>
      </div>
      <div v-if="tableData.length === 0" :style="styleObject"></div>
    </div>
    <el-card class="box-card" v-show="showForm" style="margin-top: 20px;" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="券类型" prop="type">
          <el-input v-model="type" :disabled="true" placeholder="请输入券类型"></el-input>
        </el-form-item>
        <el-form-item label="权益券名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入权益券名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="amount">
          <el-input-number v-model="formModel.amount" :min="1" placeholder="请输入面值" @change="clear"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="使用门槛" prop="isRequirement">
          <el-radio-group v-model="formModel.isRequirement" @change="isRequirementChange">
            <el-radio label="1">限制</el-radio>
            <el-radio label="0">不限制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="满(元)可用" prop="minimumPrice" v-if="formModel.isRequirement==='1'">
          <el-input v-model="formModel.minimumPrice" type="number" min="0"></el-input>
        </el-form-item> -->
        <el-form-item label="使用门槛" prop="minimumPrice" :error="errPrice">
          <el-radio v-model="formModel.isRequirement" label="0" @change="isRequirementChange">不限制</el-radio>
          <el-radio v-model="formModel.isRequirement" label="1">满(元)可用</el-radio>
          <el-input v-model="formModel.minimumPrice" v-if="formModel.isRequirement === '1'">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发放周期" prop="issueMode">
          <el-radio-group v-model="formModel.issueMode" @change="issueModeChange">
            <el-radio label="0">单次发放</el-radio>
            <el-radio label="1">周期发放</el-radio>
            <el-radio label="2">不限次</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="天" prop="cycleDay" v-if="formModel.issueMode==='1'">
          <el-input v-model="formModel.cycleDay" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="张" prop="quantity" v-if="formModel.issueMode==='0'">
          <el-input v-model="formModel.quantity" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" prop="description">
          <el-input v-model="formModel.description" type="textarea" placeholder="请使用规则"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-card>
  </biz-grid>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import ticket from '@/assets/images/pic_ticket_bg_y.png';
export default {
  name: 'MemberBaseInfo',
  props: {
    classId: {
      type: String
    },
    rightsId: {
      type: String
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      showForm: false,
      errPrice: '',
      ticket: ticket,
      type: '权益券',
      // 用户信息
      formModel: {
        name: '',
        amount: '',
        isRequirement: '1',
        minimumPrice: '',
        issueMode: '',
        cycleDay: '',
        quantity: '',
        description: ''
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:member.memberBenefits.benefits.edit']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:member.memberBenefits.benefits.edit']
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selections: [],
      tableData: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入面值', trigger: 'blur' }],
        minimumPrice: [
          {
            required: true,
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入非负数字',
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.isRequirement === '1' && !this.formModel.minimumPrice) {
                callback(new Error('请输入使用门槛'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  created() {
    this.rightsId && this.getList();
  },
  watch: {
    rightsId(nVal, oVal) {
      this.getList();
    }
  },
  mounted() {},
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    isRequirementChange(val) {
      this.formModel.minimumPrice = '';
      this.$refs.form.clearValidate('minimumPrice');
    },
    clear() {
      this.$refs.form.clearValidate(['amount']);
    },
    issueModeChange(val) {
      this.$set(this.formModel, 'cycleDay', '');
      this.$set(this.formModel, 'quantity', '');
    },
    getList() {
      this.loading = true;
      this.showForm = false;
      if (!this.rightsId) this.tableData = [];
      this.loading = false;
      this.rightsId &&
        service.rightsCouponList(
          {
            rightsId: this.rightsId || ''
          },
          data => {
            this.tableData = data.content.map(item => {
              return {
                id: item.id || '',
                amount: item.amount || '',
                minimumPrice: item.minimumPrice || '',
                name: item.name || '',
                issueMode: item.issueMode || '',
                cycleDay: item.cycleDay || '',
                quantity: item.quantity || '',
                isRequirement: item.isRequirement || '1',
                description: item.description || '',
                selected: false
              };
            });
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            this.loading = false;
            console.log('code错误');
          }
        );
    },
    handleOperate(name) {
      this[name]();
    },
    rowSelectTrigger(rowId, buttonType, row) {
      if (row.selected) {
        this.selections.splice(this.tableData.indexOf(row), 0, rowId);
        this.operations[1].disabled = false;
      } else {
        this.selections.splice(this.tableData.indexOf(row), 1);
        if (this.selections.length === 0) this.operations[1].disabled = true;
      }
    },
    query(coupon) {
      this.loading = true;
      this.showForm = false;
      this.$refs.form.clearValidate();
      service.queryRightsCoupon(
        {
          id: coupon.id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = data.content;
          this.loading = false;
          this.showForm = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          console.log('code错误');
        }
      );
    },
    save() {
      if (!this.rightsId) {
        this.$message.warning('请先创建权益');
        return false;
      }
      if (this.formModel.quantity && !/^(0|[1-9][0-9]*)$/.test(this.formModel.quantity)) {
        this.$message.warning('请输入正确的张数');
        return false;
      }
      if (this.formModel.cycleDay && !/^(0|[1-9][0-9]*)$/.test(this.formModel.cycleDay)) {
        this.$message.warning('请输入正确的天数');
        return false;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.formModel.id &&
            service.rightsCouponUpdate(
              this.formModel,
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.getList();
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          !this.formModel.id &&
            service.rightsCouponCreate(
              this.formModel,
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.getList();
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
        }
      });
    },
    add() {
      this.formModel = {};
      this.formModel.rightsId = this.rightsId;
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
    },
    delete() {
      if (this.selections.length === 0) {
        this.$message.warning('请选择一条记录');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.deleteRightscoupon(
          { ids: this.selections },
          data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.getList();
            this.operations[1].disabled = true;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    }
  }
};
</script>

<style lang="scss">
.rights-coupon-info {
  padding: 20px;
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .coupon-content {
    height: 50%;
    position: relative;
    overflow: auto;
  }
  .flex {
    display: flex;
    margin-top: 20px;
  }
  .check {
    line-height: 80px;
    margin-right: 10px;
  }
  .coupon {
    display: flex;
    img {
      position: relative;
      z-index: 10;
    }
  }
  .after {
    background: #feedd1;
    width: 200px;
    height: 80px;
    position: relative;
    left: -5px;
    z-index: 0;
    border-radius: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    span {
      font-size: 12px;
      margin-left: 20px;
      line-height: 40px;
    }
  }
  .before {
    background: #ffac30;
    width: 150px;
    height: 80px;
    border-radius: 5px 0px 0px 5px;
    .amount {
      font-size: 22px;
    }
    span {
      display: block;
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
