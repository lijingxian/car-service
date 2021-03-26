<template>
  <biz-grid class="member-awards">
    <!-- <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button> -->
    <biz-header slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-header>
    <el-collapse v-model="activeNames">
      <el-form ref="form" size="small" label-width="205px" :model="form" :rules="rules" style="border-bottom:1px solid #ebeef5" :disabled="!isEdit">
        <el-collapse-item title="完善信息" name="1">
          <el-form-item label="完善个人信息，赠送V豆数量" prop="memberBean" class="display-inline">
            <el-input-number v-model="form.memberBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="完善车辆信息，赠送V豆数量" prop="carBean" class="display-inline">
            <el-input-number v-model="form.carBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="完善行驶证信息，赠送V豆数量" prop="vehicleLicense" class="display-inline">
            <el-input-number v-model="form.vehicleLicense" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="完善质保信息，赠送V豆数量" prop="qualityAssuranceBean" class="display-inline">
            <el-input-number v-model="form.qualityAssuranceBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="完善保险信息，赠送V豆数量" prop="insuranceBean" class="display-inline">
            <el-input-number v-model="form.insuranceBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="完善保养信息，赠送V豆数量" prop="maintainBean" class="display-inline">
            <el-input-number v-model="form.maintainBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="完善年检信息，赠送V豆数量" prop="inspectionBean" class="display-inline">
            <el-input-number v-model="form.inspectionBean" :min="0"></el-input-number>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="促活" name="2">
          <el-form-item label="首次进入店铺送V豆数量" prop="loginShopBean" class="display-inline">
            <el-input-number v-model="form.loginShopBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每次签到奖励V豆数量" prop="signBean" class="display-inline">
            <el-input-number v-model="form.signBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每连续签到天数" prop="continueSignTimes" class="display-inline">
            <el-input-number v-model="form.continueSignTimes" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="再奖励V豆数量" prop="continueSignBean" class="display-inline">
            <el-input-number v-model="form.continueSignBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每次社区发帖奖励V豆数量" prop="spaceBean" class="display-inline">
            <el-input-number v-model="form.spaceBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每日发帖奖励次数上限" prop="spaceLimit" class="display-inline">
            <el-input-number v-model="form.spaceLimit" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每次分享奖励V豆数量" prop="shareBean" class="display-inline">
            <el-input-number v-model="form.shareBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每日分享奖励次数上限" prop="shareTimesLimit" class="display-inline">
            <el-input-number v-model="form.shareTimesLimit" :min="0"></el-input-number>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="鼓励设备使用" name="3">
          <el-form-item label="每周不良驾驶行为小于次数" prop="drivingBehaviorScore" class="display-inline">
            <el-input-number v-model="form.drivingBehaviorScore" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="赠送V豆数" prop="drivingBehaviorBean" class="display-inline">
            <el-input-number v-model="form.drivingBehaviorBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每周里程累计公里数达到" prop="mileCount" class="display-inline">
            <el-input-number v-model="form.mileCount" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="赠送V豆数" prop="mileBean" class="display-inline">
            <el-input-number v-model="form.mileBean" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="视频/拍照每日超过次数" prop="shotLimit" class="display-inline">
            <el-input-number v-model="form.shotLimit" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每次消耗V豆数" prop="shotBean" class="display-inline">
            <el-input-number v-model="form.shotBean" :min="0"></el-input-number>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="消费充值奖励" name="4">
          <el-table :data="tableData" size="small">
            <el-table-column label="消费充值奖励" prop="name"></el-table-column>
            <el-table-column prop="recharge" label="金额">
              <div slot-scope="scope">
                <div class="biz-customcol" style="width:90px">
                  <el-input-number size="mini" :min="0" v-model="scope.row.recharge"></el-input-number>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="bean" label="赠送V豆">
              <div slot-scope="scope">
                <div class="biz-customcol" style="width:90px">
                  <el-input-number size="mini" :min="0" v-model="scope.row.bean"></el-input-number>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="point" label="赠送积分">
              <div slot-scope="scope">
                <div class="biz-customcol" style="width:90px">
                  <el-input-number size="mini" :min="0" v-model="scope.row.point"></el-input-number>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="cash" label="赠送金额">
              <div slot-scope="scope">
                <div class="biz-customcol" style="width:90px">
                  <el-input-number size="mini" :min="0" v-model="scope.row.cash"></el-input-number>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="date" label="操作" type="index">
              <div slot-scope="scope">
                <div class="biz-customcol">
                  <el-button type="text" size="mini" v-if="scope.row.isShowAdd===true" @click="addExtraRecharges">添加</el-button>
                  <el-button type="text" size="mini" v-if="scope.row.isDisplay===true" @click="deleteExtraRecharges(scope)">删除</el-button>
                </div>
              </div>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="V豆线上消费" name="5">
          <el-form-item label="抵现1元须消耗V豆数数量" prop="vBean" class="display-inline">
            <el-input-number v-model="form.vBean" :min="1" :maxlength="7"></el-input-number>
          </el-form-item>
          <el-form-item label="V豆抵现上限（%）" prop="arrivalRate" class="display-inline">
            <el-input-number v-model="form.arrivalRate" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </el-collapse-item>
      </el-form>
    </el-collapse>
  </biz-grid>
</template>

<script>
import service from '@/service/member-card-mgmt/memberCardMgmt';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'MemberAwards',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizHeader
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      showForm: false,
      selections: [],
      tableData: [],
      activeNames: ['0', '1', '2', '3', '4', '5'],
      form: {
        memberBean: '5',
        carBean: '5',
        insuranceBean: '5',
        maintainBean: '5',
        inspectionBean: '5',
        qualityAssuranceBean: '5',
        loginShopBean: '50',
        signBean: '1',
        continueSignTimes: '5',
        continueSignBean: '10',
        spaceBean: '1',
        spaceLimit: '5',
        shareBean: '1',
        shareTimesLimit: '5',
        drivingBehaviorScore: '7',
        drivingBehaviorBean: '100',
        vehicleLicense: '5',
        mileCount: '300',
        mileBean: '100',
        shotLimit: '3',
        shotBean: '5',
        cardConsume: '',
        cardConsumeBean: '',
        cardConsumePoint: '',
        consume: '1',
        consumeBean: '1',
        consumePoint: '1',
        recharge: '',
        rechargeBean: '',
        rechargePoint: '',
        rechargeCash: '',
        vBean: '100',
        arrivalRate: '2',
        extraRecharges: []
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        memberBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        carBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        insuranceBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        maintainBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        qualityAssuranceBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        inspectionBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        loginShopBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        signBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        continueSignTimes: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        continueSignBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        spaceBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        spaceLimit: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        shareBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        shareTimesLimit: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        drivingBehaviorScore: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        drivingBehaviorBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        vehicleLicense: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        mileCount: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        mileBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        shotLimit: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        shotBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        consume: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        consumeBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        consumePoint: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        cardConsume: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        cardConsumeBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        cardConsumePoint: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        recharge: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        rechargeBean: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        rechargePoint: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        rechargeCash: [{ pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }],
        vBean: [
          { required: true, trigger: 'blur', message: '必填' },
          { pattern: /^[1-9]\d*$/, message: '请输入正确的数值', trigger: 'blur' }
        ],
        arrivalRate: [
          { required: true, trigger: 'blur', message: '必填' },
          {
            pattern: /^\d\.([0-9]{1,2}|[0-9][1-9])$|^[0-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/,
            message: '请输入正确的数值',
            trigger: 'blur'
          }
        ]
      }
    };
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
    getDefaultTableData() {
      this.tableData = [
        {
          name: '会员卡消费',
          recharge: this.form.cardConsume,
          bean: this.form.cardConsumeBean,
          point: this.form.cardConsumePoint,
          cash: this.form.cash,
          isDisplay: false,
          isShowAdd: false
        },
        {
          name: '其他消费',
          recharge: this.form.consume,
          bean: this.form.consumeBean,
          point: this.form.consumePoint,
          cash: this.form.cash,
          isDisplay: false,
          isShowAdd: false
        },
        {
          name: '会员卡充值',
          recharge: this.form.recharge,
          bean: this.form.rechargeBean,
          point: this.form.rechargePoint,
          cash: this.form.rechargeCash,
          isDisplay: false,
          isShowAdd: false
        }
      ];
    },
    addExtraRecharges() {
      this.form.extraRecharges.push({
        id: Math.floor(Math.random() * 100000).toString(),
        recharge: '',
        bean: '',
        point: '',
        cash: '',
        isShowAdd: true
      });
      this.getDefaultTableData();
      this.form.extraRecharges.forEach((item, index) => {
        if (index + 1 === this.form.extraRecharges.length) {
          this.tableData.push({ id: item.id, name: '会员卡充值', recharge: item.recharge, bean: item.bean, point: item.point, cash: item.cash, isShowAdd: item.isShowAdd, isDisplay: true });
        } else {
          this.tableData.push({ id: item.id, name: '会员卡充值', recharge: item.recharge, bean: item.bean, point: item.point, cash: item.cash, isDisplay: true, isShowAdd: false });
        }
      });
    },
    deleteExtraRecharges(item) {
      this.form.extraRecharges.splice(this.form.extraRecharges.indexOf(item), 1);
      console.log(this.form.extraRecharges);
      this.getDefaultTableData();
      if (this.form.extraRecharges.length > 0) {
        this.form.extraRecharges.forEach((item, index) => {
          if (index + 1 === this.form.extraRecharges.length) {
            this.tableData.push({ id: item.id, name: '会员卡充值', recharge: item.recharge, bean: item.bean, point: item.point, cash: item.cash, isShowAdd: true, isDisplay: true });
          } else {
            this.tableData.push({ id: item.id, name: '会员卡充值', recharge: item.recharge, bean: item.bean, point: item.point, cash: item.cash, isShowAdd: false, isDisplay: true });
          }
        });
      } else {
        this.tableData = [
          {
            name: '会员卡消费',
            recharge: this.form.cardConsume,
            bean: this.form.cardConsumeBean,
            point: this.form.cardConsumePoint,
            cash: this.form.cash,
            isDisplay: false,
            isShowAdd: false
          },
          {
            name: '其他消费',
            recharge: this.form.consume,
            bean: this.form.consumeBean,
            point: this.form.consumePoint,
            cash: this.form.cash,
            isDisplay: false,
            isShowAdd: false
          },
          {
            name: '会员卡充值',
            recharge: this.form.recharge,
            bean: this.form.rechargeBean,
            point: this.form.rechargePoint,
            cash: this.form.rechargeCash,
            isDisplay: false,
            isShowAdd: true
          }
        ];
      }
    },
    initModel() {
      this.form = {
        memberBean: '5',
        carBean: '5',
        insuranceBean: '5',
        maintainBean: '5',
        qualityAssuranceBean: '',
        inspectionBean: '5',
        loginShopBean: '50',
        signBean: '1',
        continueSignTimes: '5',
        continueSignBean: '10',
        spaceBean: '1',
        spaceLimit: '5',
        shareBean: '1',
        shareTimesLimit: '5',
        drivingBehaviorScore: '7',
        drivingBehaviorBean: '100',
        vehicleLicense: '5',
        mileCount: '300',
        mileBean: '100',
        shotLimit: '3',
        shotBean: '5',
        consume: '1',
        consumeBean: '1',
        consumePoint: '1',
        recharge: '',
        rechargeBean: '',
        rechargePoint: '',
        rechargeCash: '',
        vBean: '100',
        arrivalRate: '2',
        extraRecharges: []
      };
    },
    operate(name) {
      this[name]();
    },
    getList() {
      service.setting(
        {
          userCardTemplateId: this.itemId.id || ''
        },
        data => {
          this.form = Object.assign(this.form, data.content);
          this.getDefaultTableData();
          if (data.content.extraRecharges.length > 0) {
            data.content.extraRecharges.forEach((element, index) => {
              if (index + 1 === data.content.extraRecharges.length) {
                this.tableData.push({ id: element.id, name: '会员卡充值', recharge: element.recharge, bean: element.bean, point: element.point, cash: element.cash, isDisplay: true, isShowAdd: true });
              } else {
                this.tableData.push({ id: element.id, name: '会员卡充值', recharge: element.recharge, bean: element.bean, point: element.point, cash: element.cash, isDisplay: true, isShowAdd: false });
              }
            });
          } else {
            this.tableData = [
              {
                name: '会员卡消费',
                recharge: this.form.cardConsume,
                bean: this.form.cardConsumeBean,
                point: this.form.cardConsumePoint,
                cash: this.form.cash,
                isDisplay: false,
                isShowAdd: false
              },
              {
                name: '其他消费',
                recharge: this.form.consume,
                bean: this.form.consumeBean,
                point: this.form.consumePoint,
                cash: this.form.cash,
                isDisplay: false,
                isShowAdd: false
              },
              {
                name: '会员卡充值',
                recharge: this.form.recharge,
                bean: this.form.rechargeBean,
                point: this.form.rechargePoint,
                cash: this.form.rechargeCash,
                isDisplay: false,
                isShowAdd: true
              }
            ];
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
      this.$refs.form.validate(isValid => {
        if (isValid) {
          this.form.extraRecharges = [];
          this.tableData.forEach((item, index) => {
            if (index === 0) {
              this.form.cardConsume = item.recharge;
              this.form.cardConsumeBean = item.bean;
              this.form.cardConsumePoint = item.point;
              this.form.cash = item.cash;
            }
            if (index === 1) {
              this.form.consume = item.recharge;
              this.form.consumeBean = item.bean;
              this.form.consumePoint = item.point;
              this.form.cash = item.cash;
            }
            if (index === 2) {
              this.form.recharge = item.recharge;
              this.form.rechargeBean = item.bean;
              this.form.rechargePoint = item.point;
              this.form.rechargeCash = item.cash;
            }
            if (index > 2) {
              this.form.extraRecharges.push({ id: item.id, recharge: item.recharge, bean: item.bean, point: item.point, cash: item.cash });
            }
          });
          this.form.userCardTemplateId = this.itemId.id;
          this.form.signTimes = '1';
          this.form.cash = '1';
          this.form.shareTimes = '1';
          this.itemId.id &&
            service.settingUpdate(
              this.form,
              data => {
                this.$message.success('保存成功');
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                console.log('code错误');
              }
            );
        }
      });
    }
  }
};
</script>

<style lang="scss">
.member-awards {
  padding: 20px;
  font-size: 14px;
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .el-input {
    width: auto !important;
  }
  .title0 {
    border-bottom: 2px solid #ff7300;
    width: 56px;
    color: #ff7300;
    margin: 0px 0px 20px;
  }
  .title1 {
    border-bottom: 2px solid #ff7300;
    width: 28px;
    color: #ff7300;
    margin: 0px 0px 20px;
  }
  .title2 {
    border-bottom: 2px solid #ff7300;
    width: 84px;
    color: #ff7300;
    margin: 0px 0px 20px;
  }
  .display-inline {
    display: inline-block;
  }
  .el-icon-error,
  .el-icon-circle-plus-outline {
    font-size: 20px;
    cursor: pointer;
    color: #7f7f7f;
    padding-bottom: 20px;
    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>
