<template>
  <biz-grid class="activity-award">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-alert v-show="activity.type==='2'" :title="tooltip" type="info" :closable="false"></el-alert>
    <biz-list ref="table" height="400" :tableData="awardList" @rowClick="rowClick">
      <el-table-column prop="name" label="奖品名称"></el-table-column>
      <el-table-column prop="type" :formatter="getType" label="奖品类型"></el-table-column>
      <el-table-column prop="count" label="奖品面值" :formatter="getDec"></el-table-column>
      <el-table-column prop="quantity" label="奖品数量"></el-table-column>
      <el-table-column prop="date" label="操作">
        <div slot-scope="scope">
          <div>
            <el-button type="text" size="mini" @click.stop="remove(scope.row.id)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <el-dialog :title="createdText" :visible.sync="open" center append-to-body width="500px">
      <el-form v-loading="loading" :rules="rules" ref="form" :model="award" label-width="100px" size="small" :inline-message="true">
        <el-form-item label="奖品名称" prop="name">
          <el-input ref="awardTitle" placeholder="请输入奖品名称" v-model="award.name" maxlength="10" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select v-model="award.type" @change="typeChange" :disabled="!isCreated" placeholder="请选择奖品类型" style="width:220px">
            <el-option :label="awardType.label" :value="awardType.value" :key="index" v-for="(awardType,index) of awardTypeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品图片" :required="true" prop="image">
          <BizAvatarUploaderNew v-model="award.image"></BizAvatarUploaderNew>
        </el-form-item>
        <el-form-item label="奖品面值" v-show="!isXXCY" prop="count">
          <div class="reward-value" v-if="award.type==='physical'">
            <div>
              <el-radio v-model="coupon.isAmountUnfixed" label="0">固定</el-radio>
              <el-radio v-model="coupon.isAmountUnfixed" label="1" class="type-no">非固定</el-radio>
            </div>
            <div class="reward-dec">
              <el-input-number :min="min" v-model="award.count" :disabled="awardCountDisabled" placeholder="请输入奖品面值" class="reward-input"></el-input-number>
              <el-input v-model="coupon.amountDescription" placeholder="请输入奖品面值描述"></el-input>
            </div>
          </div>
          <el-input-number v-else :min="min" v-model="award.count" :disabled="awardCountDisabled" placeholder="请输入奖品面值" class="reward-input"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="是否限额">
          <div class="isScan">
            <el-radio v-model="isQuantity" label="1">是</el-radio>
            <el-radio v-model="isQuantity" label="0">否</el-radio>
          </div>
        </el-form-item>-->
        <el-form-item label="奖品数量" prop="quantity">
          <el-input-number :min="1" :max="100000" v-model="award.quantity" placeholder="请输入1-100000间的整数"></el-input-number>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="award.sort"></el-input-number>
        </el-form-item>
        <el-form-item v-show="award.type==='physical'||award.type==='cashCoupon'" label="结束时间">
          <el-date-picker v-model="coupon.endDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item v-show="award.type==='physical'||award.type==='cashCoupon'" label="使用门槛">
          <div class="isScan">
            <el-radio v-model="isLimit" label="1">限制</el-radio>
            <el-radio v-model="isLimit" label="0">不限制</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="满N元可用" v-show="isLimit==='1'&&(award.type!=='again'&&award.type!=='thanks')" prop="minimumPrice">
          <el-input-number v-model="coupon.minimumPrice" :min="0"></el-input-number>
        </el-form-item>
        <biz-save-button :operations="formOperations" @operate="operate" style="margin-right: 0;"></biz-save-button>
      </el-form>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizList } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/activity-mgmt/marketing/activityMgmt';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import BizSaveButton from '@/components/BizSaveButton';

export default {
  name: 'ActivityAward',
  data() {
    return {
      min: 0,
      tooltip: '圆形转盘需3-8个奖品，方形转盘需8个奖品',
      awardCountDisabled: false,
      isXXCY: false,
      isCreated: true,
      loading: false,
      open: false,
      isQuantity: '0',
      isLimit: '0',
      coupon: {
        endDate: '',
        minimumPrice: '0',
        isAmountUnfixed: '0',
        amountDescription: ''
      },
      award: {
        id: '',
        name: '',
        type: 'bean',
        image: '/resources/admin/images/default/bean.png',
        quantity: '1',
        sort: '1',
        count: '1'
      },
      awardList: [],
      operations: [
        {
          label: '新增',
          name: 'clear',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ],
      formOperations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }],
        count: [
          { required: true, message: '请输入奖品面值', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入奖品限额', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    activity: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {},
  computed: {
    createdText() {
      if (this.isCreated) {
        return '新建奖品';
      } else {
        return '编辑奖品';
      }
    },
    awartCountText() {
      if (this.award.type === 'physical') {
        return '奖品面值';
      } else {
        return '奖品数量';
      }
    },
    awardTypeList() {
      if (['7', '8'].indexOf(this.activity.typeStr) === -1) {
        return [
          {
            label: 'V豆',
            value: 'bean'
          },
          {
            label: '再来一次',
            value: 'again'
          },
          {
            label: '谢谢参与',
            value: 'thanks'
          },
          {
            label: '实物',
            value: 'physical'
          },
          {
            label: '现金券',
            value: 'cashCoupon'
          }
        ];
      } else {
        return [
          {
            label: 'V豆',
            value: 'bean'
          },
          {
            label: '实物',
            value: 'physical'
          },
          {
            label: '现金券',
            value: 'cashCoupon'
          }
        ];
      }
    }
  },
  components: {
    BizSaveButton,
    BizList,
    BizGrid,
    BizAvatarUploaderNew
  },
  methods: {
    typeChange(type) {
      this.awardCountDisabled = false;
      switch (type) {
        case 'bean':
          this.award.image = '/resources/admin/images/default/bean.png';
          break;
        case 'again':
          this.award.count = '1';
          this.awardCountDisabled = true;
          this.award.image = '/resources/admin/images/default/again.png';
          break;
        case 'thanks':
          this.isXXCY = true;
          this.award.image = '/resources/admin/images/default/thanks.png';
          break;
        case 'physical':
          this.award.image = '/resources/admin/images/default/present.png';
          break;
        case 'cashCoupon':
          this.award.image = '/resources/admin/images/default/coupon.png';
          break;
        default:
          break;
      }
    },
    operate(name) {
      this[name]();
    },
    refresh(activity) {
      // 重置页面data
      Object.assign(this.$data, this.$options.data());
      let params = {
        activityId: this.activity.id
      };
      Service.getAwardList(
        params,
        data => {
          this.awardList = data.data;
          this.open = false;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    clear() {
      this.isCreated = true;
      this.open = true;
      this.$refs.form.clearValidate('name');
      this.award = {
        id: '',
        name: '',
        type: 'bean',
        image: '/resources/admin/images/default/bean.png',
        quantity: '1',
        sort: '1',
        count: '1'
      };
      this.coupon = {
        endDate: '',
        minimumPrice: '0',
        isAmountUnfixed: '0',
        amountDescription: ''
      };
      this.awardCountDisabled = false;
      this.isXXCY = false;
      this.isCreated = true;
      this.loading = false;
      this.isQuantity = '0';
      this.isLimit = '0';
      this.$refs.awardTitle.focus();
    },
    save() {
      if (this.award.name) {
        if (this.award.image === '' || !this.award.image) {
          this.$message.warning('请选择奖品图片');
          return;
        }
        if (this.isCreated) {
          this.createAward();
        } else {
          this.updateAward();
        }
      } else {
        this.$message.warning('请输入奖品名称');
      }
    },
    createAward() {
      let params = {
        activityId: this.activity.id,
        name: this.award.name,
        type: this.award.type,
        image: this.award.image,
        count: this.award.count,
        quantity: this.award.quantity,
        sort: this.award.sort
      };
      if (this.award.type === 'physical' || this.award.type === 'cashCoupon') {
        params.coupon = this.coupon;
        if (this.isLimit === '0') {
          params.coupon.minimumPrice = '0';
        }
      }
      this.loading = true;
      Service.createAward(
        params,
        data => {
          this.$message.success('操作成功');
          this.refresh(this.activity);
          this.$emit('awardSuccess');
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    updateAward() {
      let params = {
        id: this.award.id,
        activityId: this.activity.id,
        name: this.award.name,
        type: this.award.type,
        image: this.award.image,
        count: this.award.count,
        quantity: this.award.quantity,
        sort: this.award.sort
      };
      if (this.award.type === 'physical' || this.award.type === 'cashCoupon') {
        params.coupon = this.coupon;
        if (this.isLimit === '0') {
          params.coupon.minimumPrice = '0';
        }
      }
      this.loading = true;
      Service.updateAward(
        params,
        data => {
          this.$message.success('操作成功');
          this.refresh(this.activity);
          this.$emit('awardSuccess');
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    remove(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          Service.deleteAward(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh(this.activity);
              this.$emit('awardSuccess');
            },
            ErrorData => {
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    getAward(id) {
      let params = {
        id: id
      };
      this.loading = true;
      Service.getAward(
        params,
        data => {
          this.isCreated = false;
          this.award.count = data.prize.count;
          this.award.id = data.prize.id;
          this.award.name = data.prize.name;
          this.award.type = data.prize.type;
          this.award.image = data.prize.image;
          this.award.sort = data.prize.sort;
          if (!data.prize.quantity || data.prize.quantity === '') {
            this.isQuantity = '0';
            this.award.quantity = '0';
          } else {
            this.isQuantity = '1';
            this.award.quantity = data.prize.quantity;
          }

          if (data.prize.type === 'physical' || data.prize.type === 'cashCoupon') {
            this.coupon.endDate = data.prize.coupon.endDate || '';
            if (data.prize.coupon.minimumPrice !== '' && data.prize.coupon.minimumPrice !== '0') {
              this.isLimit = '1';
              this.coupon.minimumPrice = data.prize.coupon.minimumPrice;
            } else {
              this.isLimit = '0';
              this.coupon.minimumPrice = '0';
            }
            this.coupon.isAmountUnfixed = data.prize.coupon.isAmountUnfixed || '';
            this.coupon.amountDescription = data.prize.coupon.amountDescription || '';
          }
          if (data.prize.type === 'thanks') {
            this.isXXCY = true;
          } else {
            this.isXXCY = false;
          }

          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    getDec(row) {
      let count = row.count.toString();
      if (count.length > 6) {
        return count.substring(0, 6) + '...';
      } else {
        return count;
      }
    },
    getType(row) {
      switch (row.type) {
        case 'bean':
          return 'V豆';
        case 'again':
          return '再来一次';
        case 'thanks':
          return '谢谢参与';
        case 'physical':
          return '实物';
        case 'cashCoupon':
          return '现金券';
        default:
          break;
      }
    },
    rowClick(row) {
      this.$refs.form.resetFields();
      this.getAward(row.id);
      this.open = true;
    },
    onUpload(url) {
      this.award.image = url;
    }
  }
};
</script>

<style lang="scss">
.activity-award {
  .el-input-number--small {
    width: 120px;
  }
  width: 100%;
  .reward-value {
    display: flex;
    align-items: center;
    .type-no {
      margin: 18px 0 0 0;
    }
    .reward-dec {
      margin-left: 10px;
      .reward-input {
        margin-bottom: 10px;
      }
    }
  }
  .biz-save-button {
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: flex-start;
  }
  .el-alert--info {
    width: 470px;
    margin-left: 5px;
  }
  .biz-list {
    margin: 5px;
  }
  .edit-explain {
    margin: 20px 20px;
    font-size: 14px;
    color: #606266;
  }
  .el-form {
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
  }
}
</style>
