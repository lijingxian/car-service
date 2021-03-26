<template>
  <biz-grid class="order-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="订单编号" prop="sn" v-if="itemId">
        <el-input v-model="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-input v-model="form.type" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="订单原价" prop="originalAmount">
        <el-input v-model="form.originalAmount" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="调整金额" prop="offsetAmount">
        <el-input placeholder="请输入内容" v-model="form.offsetAmount" class="input-with-select" :disabled="itemId!==''&&form.paymentStatus==='2'||form.type==='订单关闭'" @change="offsetAmountChange">
          <el-select v-model="form.offsetAmountMethod" slot="prepend" placeholder="请选择">
            <!-- <el-option label="调整额" value="0"></el-option> -->
            <el-option label="调整率" value="1"></el-option>
          </el-select>
          <el-button slot="append" v-if="form.offsetAmountMethod==='1'">%</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="订单现价" prop="amount">
        <el-input v-model="form.curAmount" @change="curAmountChange" :disabled="form.type==='订单关闭'"></el-input>
      </el-form-item>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title" v-if="activeNames.indexOf('1')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">客户信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('1')===-1||!handler">客户信息</template>
          <el-form-item label="会员" prop="member.nickname" class="isRequired">
            <el-input v-model="form.member.nickname" :disabled="itemId?true:false" placeholder="请选择或添加会员"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="member.gender">
            <el-select v-model="form.member.gender" :disabled="!itemId===false">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
              <el-option label="保密" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="member.mobile">
            <el-input v-model="form.member.mobile" :disabled="!itemId===false" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="车辆" prop="palteNumber" v-if="form.plateNumber">
            <el-input v-model="form.plateNumber" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车型" prop="car.type">
            <el-input v-model="form.car.type" :disabled="true" placeholder="选择车辆自动带入"></el-input>
          </el-form-item>
          <el-form-item label="行驶里程" prop="drivingRange" v-if="form.plateNumber">
            <el-input v-model="form.drivingRange" :disabled="true" placeholder="选择车辆自动带入"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title" v-if="activeNames.indexOf('2')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">服务信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('2')===-1||!handler">服务信息</template>
          <el-form-item label="顾问" prop="consultant.id" class="isRequired">
            <el-select v-model="form.consultant.id" placeholder="请选择顾问">
              <el-option v-for="(consultant,index) in consultants" :key="index" :label="consultant.name || '未填写'" :value="consultant.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="买家留言" prop="memo">
            <el-input v-model="form.memo" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务类型">
            <tag-select ref="tagSelect" :tagList="tagList" :bAddTag="false" selectType="order" :selectedTags="selectedTags" @addSuccess="onAddSuccess"></tag-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="3" v-if="showPayment">
          <template slot="title" v-if="activeNames.indexOf('3')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">付款信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('3')===-1||!handler">付款信息</template>
          <el-form-item label="支付方式" prop="paymentMethodId" class="isRequired" v-if="itemId">
            <el-select v-model="form.paymentMethodId" :disabled="!itemId===false" placeholder="请选择支付方式">
              <el-option v-for="(paymentMethod,index) in paymentMethods" :key="index" :label="paymentMethod.name" :value="paymentMethod.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付款方式" prop="payments[0].paymentType" class="isRequired">
            <el-select v-model="form.payments[0].paymentType" :disabled="itemId?handler!=='payment':false" placeholder="请选择付款方式" @change="paymentTypeChange">
              <el-option v-for="(paymentTypes,index) in paymentTypes" :key="index" :label="paymentTypes.name" :value="paymentTypes.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡" prop="memberCardId" v-if="form.payments[0].paymentType==='会员卡余额'" class="isRequired">
            <el-select v-model="form.memberCardId" :disabled="itemId?handler!=='payment':false" placeholder="请选择会员卡" @change="memberCardChange">
              <el-option v-for="(item,index) in listExistCard" :key="index" :label="item.template.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="付款银行"
            prop="payments[0].payBank"
            v-if="form.payments[0].paymentType==='刷卡'||form.payments[0].paymentType==='汇款'"
            class="isRequired"
          >
            <el-select v-model="form.payments[0].payBank" :disabled="itemId?handler!=='payment':false" placeholder="请选择付款银行">
              <el-option label="中国工商银行" value="中国工商银行"></el-option>
              <el-option label="中国农业银行" value="中国农业银行"></el-option>
              <el-option label="中国银行" value="中国银行"></el-option>
              <el-option label="中国建设银行" value="中国建设银行"></el-option>
              <el-option label="交通银行" value="交通银行"></el-option>
              <el-option label="中信银行" value="中信银行"></el-option>
              <el-option label="广发银行" value="广发银行"></el-option>、
              <el-option label="深圳发展银行" value="深圳发展银行"></el-option>
              <el-option label="招商银行" value="招商银行"></el-option>
              <el-option label="中国光大银行" value="中国光大银行"></el-option>
              <el-option label="华夏银行" value="华夏银行"></el-option>
              <el-option label="中国民生银行" value="中国民生银行"></el-option>
              <el-option label="兴业银行" value="兴业银行"></el-option>
              <el-option label="上海浦东发展银行" value="上海浦东发展银行"></el-option>
              <el-option label="恒丰银行" value="恒丰银行"></el-option>
              <el-option label="浙商银行" value="浙商银行"></el-option>
              <el-option label="渤海银行" value="渤海银行"></el-option>
              <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行"></el-option>
              <el-option label="其他银行" value="其他银行"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="付款帐号"
            prop="payments[0].payAccount"
            v-if="form.payments[0].paymentType==='刷卡'||form.payments[0].paymentType==='汇款'"
            class="isRequired"
          >
            <el-input v-model="form.payments[0].payAccount" :disabled="itemId?handler!=='payment':false" placeholder="请输入付款帐号"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="优惠信息" name="4">
          <!-- <el-form-item label="销售折扣" prop="promotionDiscount">
            <el-input v-model="form.promotionDiscount" :disabled="true"></el-input>
          </el-form-item>-->
          <div v-if="itemId">
            <el-form-item label="优惠券折扣" prop="couponDiscount">
              <el-input v-model="form.couponDiscount" :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="V豆抵扣" prop="beanDiscount">
              <el-input v-model="form.beanDiscount" :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item label="赠送积分" prop="point">
              <el-input v-model="form.point" :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="赠送V豆" prop="giftBean">
              <el-input v-model="form.giftBean" :disabled="true"></el-input>
            </el-form-item> -->
          </div>
          <div v-else>
            <el-form-item label="福利" prop="couponDiscount">
              <el-select v-model="form.couponCodeId" placeholder="请选择" @change="couponChange">
                <el-option v-for="coupon in form.couponList" :key="coupon.id" :label="coupon.coupon.name" :value="coupon.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="V豆抵扣" prop="beanDiscount">
              <el-input v-model="form.beanDiscount" :disabled="!(form.payments[0].paymentType==='会员卡余额'&&form.memberCardId&&form.bean)" :min="0"></el-input>
              <div v-if="form.payments[0].paymentType==='会员卡余额'&&form.memberCardId">{{beanCanUse}}</div>
            </el-form-item> -->
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item name="5">
          <template slot="title" v-if="activeNames.indexOf('5')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">物流信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('5')===-1||!handler">物流信息</template>
          <el-form-item label="配送方式" prop="shippingMethodName">
            <el-select v-model="form.shippingMethodName" :disabled="itemId&&!isPend?true:false" placeholder="请选择配送方式" @change="onShippingChange">
              <el-option label="空" value></el-option>
              <el-option v-for="(shippingMethod,index) in shippingMethod" :key="index" :label="shippingMethod.name" :value="shippingMethod.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流公司" prop="shippings[0].deliveryCorpId" v-if="form.shippingMethodName&&showDelivery" class="isRequired">
            <el-select v-model="form.shippings[0].deliveryCorpId" filterable :disabled="itemId&&!isPend?handler!=='shipping' || isShipped:false" placeholder="请选择物流公司">
              <el-option v-for="(deliveryCorps,index) in deliveryCorps" :key="index" :label="deliveryCorps.name" :value="deliveryCorps.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号" prop="shippings[0].expressSn" v-if="form.shippingMethodName&&showDelivery" class="isRequired">
            <el-input v-model="form.shippings[0].expressSn" :disabled="itemId&&!isPend?handler!=='shipping' || isShipped:false" placeholder="请输入物流单号"></el-input>
          </el-form-item>
          <el-form-item label="物流费用" prop="shippings[0].freight" v-if="form.shippingMethodName&&showDelivery" class="isRequired">
            <el-input
              v-model="form.shippings[0].freight"
              :disabled="itemId&&!isPend?handler!=='shipping' || isShipped:false"
              placeholder="请输入物流费用"
              @change="freightChange"
            ></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="shippings[0].address" v-if="form.shippingMethodName&&showReceiver" class="isRequired">
            <el-input v-model="form.shippings[0].address" :disabled="itemId&&!isPend?handler!=='shipping' || isShipped:false" placeholder="请输入收货地址"></el-input>
          </el-form-item>
          <el-form-item label="收货人" prop="shippings[0].consignee" v-if="form.shippingMethodName&&showReceiver" class="isRequired">
            <el-input v-model="form.shippings[0].consignee" :disabled="itemId&&!isPend?handler!=='shipping' || isShipped:false" placeholder="请输入收货人"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="shippings[0].phone" v-if="form.shippingMethodName&&showReceiver" class="isRequired">
            <el-input v-model="form.shippings[0].phone" :disabled="itemId&&!isPend?handler!=='shipping' || isShipped:false" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-collapse-item> -->
        <el-collapse-item title="其他信息" name="6">
          <el-form-item label="创建时间">
            <el-input v-model="form.orderTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="执行时间">
            <el-input v-model="form.deliveryTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="付款时间">
            <el-input v-model="form.paymentTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="预计交货时间">
            <el-input v-model="form.deliverDate" :disabled="form.type!=='待商家确认'&&form.type!=='商家已确认'"></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-input v-model="form.completeTime" :disabled="true"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
import BizSaveButton from '@/components/BizSaveButton';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
import TagSelect from '@/components/BizTagSelect';
import http from '@/common/http';
import urls from '@/common/urls';
// converter
const dataConverter = {
  stateConverter(row) {
    if (row.enableState === '0') return '停用';
    else if (row.enableState === '1') return '启用';
    else return '--';
  },
  createDateConverter(row) {
    if (row.createDate) {
      row.createDate = row.createDate.replace(/-/g, '/');
      let date = new Date(row.createDate);
      return dateUtil.dateConverter(date);
    } else {
      return '--';
    }
  },
  loginDateConverter(row) {
    if (row.lastLoginDate) {
      row.lastLoginDate = row.lastLoginDate.replace(/-/g, '/');
      let date = new Date(row.lastLoginDate);
      return dateUtil.dateConverter(date);
    } else {
      return '--';
    }
  },
  ipConverter(row) {
    if (row.lastLoginIp) return row.lastLoginIp;
    else return '--';
  }
};
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    handler: {
      type: String,
      default() {
        return '';
      }
    },
    activeNames: {
      type: Array,
      default() {
        return ['1', '2', '3', '4', '5'];
      }
    },
    isPend: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    TagSelect
  },
  data() {
    return {
      isShipped: false,
      beanCanUse: '',
      maxOffsetBean: 0,
      minOffsetBean: 0,
      originalAmount: '',
      orderStateTypeList: [{ label: '订单已执行', value: '1' }, { label: '交易完成', value: '2' }],
      beanRate: 0,
      tagList: [],
      selectedTags: [],
      restaurants: [],
      dialogRules: {
        userName: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '用户名只能为数字或字母', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        nickname: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, max: 20, message: '密码应在6-20位之间', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, trigger: 'blur', message: '请再次输入密码' },
          {
            trigger: 'blur',
            validator: (rule, dialogRules, callback) => {
              if (this.formModel.password === this.formModel.rePassword) {
                callback();
              } else {
                callback(new Error('两次输入密码不一致'));
              }
            }
          }
        ]
      },
      loading: false,
      picDialogVisible: false,
      showProductSelector: false,
      dialogImageUrl: '',
      isFirst: true,
      showDialog: false,
      dialogVisible: false,
      showDelivery: false,
      showReceiver: false,
      flag: false,
      data: { type: '', method: '' },
      productTableData: [],
      imageList: [],
      consultants: [],
      shippingMethod: [],
      deliveryCorps: [],
      paymentTypes: [],
      paymentMethods: [],
      listExistCard: [],
      brandList: [],
      seriesList: [],
      modeList: [],
      brandData: [],
      seriesData: [],
      modeData: [],
      financialPlans: [],
      selectionKeys: [],
      rescueOrganizations: [],
      cars: [],
      reasons: [],
      workers: [],
      orderItems: [],
      areaId: '1568',
      useTime: '',
      useMileage: '',
      appointmentDate: '',
      downPaymentPrice: '',
      loanPrice: '',
      form: {
        bean: '',
        appointmentData: {
          appontmentDate: '',
          driveEndDate: '',
          driveStartDate: '',
          startMileage: '',
          endMileage: '',
          level: '',
          palteNumber: '',
          productId: '',
          drivingRange: '',
          onTime: '',
          downPayment: '',
          year: '',
          price: '',
          fee: '',
          personId: '',
          workUnit: '',
          houseState: '',
          onCity: '',
          intentionTime: '',
          monthIncome: '',
          carState: '',
          way: '',
          rescueUnit: '',
          rescuerId: '',
          rescueCar: '',
          distance: '',
          workerLocation: '',
          reasons: [],
          images: [],
          voices: [],
          financialPlan: {
            id: '',
            name: '',
            loanTerm: [],
            downPayments: []
          },
          product: {
            brandId: '',
            seriesIs: '',
            id: '',
            fullName: ''
          },
          car: {
            type: ''
          }
        },
        appointmentDate: '',
        appointmentEndDate: '',
        sn: '',
        type: '',
        amount: '',
        amountPrepay: '',
        amountFinalpay: '',
        originalAmount: '',
        offsetAmount: '',
        offsetAmountMethod: '1',
        AdjustPriceRate: '100',
        curAmount: '',
        memberCardId: '',
        userId: '',
        consultant: { id: '' },
        area: { id: '1568' },
        car: { id: '', tpye: '', drivingRange: '' },
        address: '',
        areaName: '',
        consignee: '',
        phone: '',
        zipCode: '',
        remarks: '',
        memo: '',
        promotionDiscount: '',
        couponDiscount: '',
        couponCodeId: '',
        couponCode: {},
        couponList: [],
        beanDiscount: '',
        point: '',
        giftBean: '',
        shippingMethodName: '',
        paymentMethodId: '',
        shippingMethodId: '',
        invoiceState: '',
        orderTime: '',
        deliveryTime: '',
        paymentTime: '',
        deliverDate: '',
        completeTime: '',
        orderItems: [
          {
            appointment: {
              appontmentDate: '',
              driveEndDate: '',
              driveStartDate: '',
              startMileage: '',
              endMileage: '',
              level: '',
              palteNumber: '',
              productId: '',
              drivingRange: '',
              onTime: '',
              downPayment: '',
              year: '',
              price: '',
              fee: '',
              personId: '',
              workUnit: '',
              houseState: '',
              onCity: '',
              intentionTime: '',
              monthIncome: '',
              carState: '',
              way: '',
              rescueUnit: '',
              rescuerId: '',
              rescueCar: '',
              distance: '',
              plateNumber: '',
              workerLocation: '',
              reasons: [],
              images: [],
              voices: [],
              financialPlan: {
                id: '',
                name: '',
                loanTerm: [],
                downPayments: []
              },
              product: {
                brandId: '',
                seriesIs: '',
                id: '',
                fullName: ''
              },
              car: {
                type: ''
              }
            }
          }
        ],
        payments: [
          {
            paymentType: '',
            payBank: '',
            payAccount: ''
          }
        ],
        member: {
          nickname: '',
          gender: '',
          mobile: ''
        },
        shippings: [
          {
            shippingMethod: '',
            deliveryCorpId: '',
            expressSn: '',
            freight: '',
            address: '',
            consignee: '',
            phone: '',
            zipCode: ''
          }
        ]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      adminCurrent: [],
      dialogLoading: true,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      isCreated: false,
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称/手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['currentUser']),
    showPayment() {
      if (this.itemId) {
        return true;
      } else {
        return this.form.type !== '1';
      }
    },
    isCreate() {
      return !this.itemId;
    }
  },
  created() {
    this.getStoreTags();
  },
  watch: {
    itemId(val) {
      this.itemId && this.init();
      this.isShipped = false;
      if (!this.itemId) {
        this.resetFormData();
        this.getStoreTags();
      }
    },
    form: {
      deep: true,
      immediate: true,
      handler: function(integral) {
        this.showDelivery = false;
        this.showReceiver = false;
        this.shippingMethod.map(item => {
          if (item.name === integral.shippingMethodName && item.isNeedDelivery === '1') {
            this.showDelivery = true;
          }
          if (item.name === integral.shippingMethodName && item.isNeedReceiver === '1') {
            this.showReceiver = true;
          }
        });
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    ...dataConverter,
    getDefaultForm() {
      return {
        bean: '',
        curAmount: '',
        couponCodeId: '',
        couponCode: {},
        couponList: [],
        appointmentData: {
          appontmentDate: '',
          driveEndDate: '',
          driveStartDate: '',
          startMileage: '',
          endMileage: '',
          level: '',
          palteNumber: '',
          productId: '',
          drivingRange: '',
          onTime: '',
          downPayment: '',
          year: '',
          price: '',
          fee: '',
          personId: '',
          workUnit: '',
          houseState: '',
          onCity: '',
          intentionTime: '',
          monthIncome: '',
          carState: '',
          way: '',
          rescueUnit: '',
          rescuerId: '',
          rescueCar: '',
          distance: '',
          workerLocation: '',
          reasons: [],
          images: [],
          voices: [],
          financialPlan: {
            id: '',
            name: '',
            loanTerm: [],
            downPayments: []
          },
          product: {
            brandId: '',
            seriesIs: '',
            id: '',
            fullName: ''
          },
          car: {
            type: ''
          }
        },
        appointmentDate: '',
        appointmentEndDate: '',
        sn: '',
        type: '',
        amount: '',
        amountPrepay: '',
        amountFinalpay: '',
        originalAmount: '',
        offsetAmount: '0',
        offsetAmountMethod: '1',
        AdjustPriceRate: '100',
        memberCardId: '',
        userId: '',
        consultant: { id: '' },
        area: { id: '1568' },
        car: { id: '', tpye: '', drivingRange: '' },
        address: '',
        areaName: '',
        consignee: '',
        phone: '',
        zipCode: '',
        remarks: '',
        memo: '',
        promotionDiscount: '',
        couponDiscount: '',
        beanDiscount: '',
        point: '',
        giftBean: '',
        shippingMethodName: '',
        paymentMethodId: '',
        shippingMethodId: '',
        invoiceState: '',
        orderTime: '',
        deliveryTime: '',
        paymentTime: '',
        deliverDate: '',
        completeTime: '',
        orderItems: [
          {
            appointment: {
              appontmentDate: '',
              driveEndDate: '',
              driveStartDate: '',
              startMileage: '',
              endMileage: '',
              level: '',
              palteNumber: '',
              productId: '',
              drivingRange: '',
              onTime: '',
              downPayment: '',
              year: '',
              price: '',
              fee: '',
              plateNumber: '',
              personId: '',
              workUnit: '',
              houseState: '',
              onCity: '',
              intentionTime: '',
              monthIncome: '',
              carState: '',
              way: '',
              rescueUnit: '',
              rescuerId: '',
              rescueCar: '',
              distance: '',
              workerLocation: '',
              reasons: [],
              images: [],
              voices: [],
              financialPlan: {
                id: '',
                name: '',
                loanTerm: [],
                downPayments: []
              },
              product: {
                brandId: '',
                seriesIs: '',
                id: '',
                fullName: ''
              },
              car: {
                type: ''
              }
            }
          }
        ],
        payments: [
          {
            paymentType: '',
            payBank: '',
            payAccount: ''
          }
        ],
        member: {
          nickname: '',
          gender: '',
          mobile: ''
        },
        shippings: [
          {
            shippingMethod: '',
            deliveryCorpId: '',
            expressSn: '',
            freight: '',
            address: '',
            consignee: '',
            phone: '',
            zipCode: ''
          }
        ]
      };
    },
    onShippingChange() {
      if (!(this.form.shippingMethodName && this.showDelivery)) {
        this.form.shippings[0].freight = '';
        this.getOriginalAmount();
      }
    },
    // 业务类型tag
    getStoreTags() {
      let param = {
        categoryType: '订单/服务业务类型',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.storeTags, param)
        .then(data => {
          console.log('订单/服务业务类型标签', data);
          this.tagList = data.content;
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    getOriginalAmount() {
      if (!this.isCreate) {
        return;
      }
      this.form.originalAmount = (
        Number(this.originalAmount) -
        Number(this.form.beanDiscount * this.beanRate || '0') -
        Number(this.form.couponDiscount || '0') +
        Number(this.form.shippings[0].freight || '0')
      ).toFixed(2);
      this.getCurAmount();
    },
    // 调整金额
    getCurAmount() {
      if (this.form.offsetAmountMethod === '0') {
        this.form.curAmount = (Number(this.form.originalAmount) + Number(this.form.offsetAmount || '0')).toFixed(2);
        if (this.form.curAmount <= 0) {
          this.form.curAmount = 0.0;
        }
        this.form.curAmount = this.form.curAmount.toString();
      } else {
        this.form.curAmount = (Number(this.form.originalAmount) * Number(this.form.offsetAmount / 100 || '1')).toFixed(2);
        if (this.form.curAmount <= 0) {
          this.form.curAmount = 0.0;
        }
        this.form.curAmount = this.form.curAmount.toString();
      }
    },
    couponChange() {
      this.form.couponList.forEach(item => {
        if (item.id === this.form.couponCodeId) {
          this.form.couponDiscount = item.coupon.amount;
          return false;
        }
      });
      this.getOriginalAmount();
    },
    freightChange() {
      this.getOriginalAmount();
    },
    // 调整金额
    offsetAmountChange() {
      this.getCurAmount();
    },
    // 订单现价
    curAmountChange() {
      if (this.form.offsetAmountMethod === '0') {
        this.form.offsetAmount =
          Number(this.form.curAmount) +
          Number(this.form.beanDiscount * this.beanRate) +
          Number(this.form.couponDiscount) -
          Number(this.form.originalAmount);
        this.form.offsetAmount = this.form.offsetAmount.toString();
      } else {
        this.form.offsetAmount =
          ((Number(this.form.curAmount) +
          Number(this.form.beanDiscount * this.beanRate) +
          Number(this.form.couponDiscount)) /
          Number(this.form.originalAmount));
        this.form.offsetAmount = (this.form.offsetAmount * 100).toString();
      }
    },
    tagMapping() {
      let param = {
        refId: this.itemId,
        type: '7',
        tags: this.$refs.tagSelect.getCurSelectedTags(),
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post(urls.systemSetting.tagMapping, param)
        .then(data => {
          console.log('映射成功');
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    // tag
    getTagMapping() {
      this.selectedTags = [];
      let param = {
        refId: this.itemId,
        type: '7',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.tagMapping, param)
        .then(data => {
          console.log('查看映射信息', data);
          if (data.data.tags) {
            this.selectedTags = data.data.tags;
          }
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    onAddSuccess() {
      this.getStoreTags();
    },
    operate(name) {
      this[name]();
    },
    resetFormData() {
      this.form = this.getDefaultForm();
      this.form.userId = '';
      this.form.memberCardId = '';
      this.listExistCard = [];
      this.form.member = {};
      this.form.couponList = [];
      this.form.couponCodeId = '';
      this.form.beanDiscount = '';
      this.paymentTypes = [];
      this.form.payments[0].paymentType = '';
      this.form.shippings[0].deliveryCorpId = '';
      this.form.originalAmount = '';
      this.form.curAmount = '';
      this.form.car.type = '';
      this.form.car.drivingRange = '';
      this.form.drivingRange = '';
      this.form.plateNumber = '';
      this.form.car.id = '';
      this.form.offsetAmount = '';
    },
    carOptions(id) {
      let curCar;
      service.carOptions(
        {
          memberId: id
        },
        data => {
          this.cars = data.cars;
          if (this.cars.length > 0) {
            this.cars.forEach(item => {
              if (item.plateNumber === this.form.plateNumber) {
                curCar = item;
                return false;
              }
            });
            this.form.car.id = curCar ? curCar.id : '';
            this.cars.map(item => {
              if (item.id === this.form.car.id) {
                this.form.car.type = item.type;
                return false;
              }
            });
          }
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    init() {
      service.viewOrder(
        this.getSaveParams(),
        data => {
          this.form = data.order;
          if (this.form.offsetAmountMehthod === '0') {
            this.form.curAmount = Number(this.form.originalAmount) + Number(this.form.offsetAmount);
          } else {
            this.form.offsetAmount = this.form.offsetAmountRate;
            this.form.curAmount = Number(this.form.originalAmount) * Number(this.form.offsetAmount);
          }
          if (this.form.payments.length === 0) {
            this.form.payments = [
              {
                paymentType: '',
                payBank: '',
                payAccount: ''
              }
            ];
            this.form.payments[0].paymentType = this.form.paymentTypeName;
          } else {
            this.form.memberCardId = this.form.payments[0].memberCardId;
          }
          if (this.form.shippings.length === 0) {
            this.form.shippings = [
              {
                shippingMethod: '',
                deliveryCorpId: '',
                expressSn: '',
                freight: '',
                address: (this.form.area && this.form.area.fullName) ? this.form.area.fullName + this.form.address : this.form.address,
                consignee: this.form.consignee,
                phone: this.form.phone,
                zipCode: this.form.zipCode
              }
            ];
          }
          this.carOptions(this.form.member.id);
          this.shippingMethod = data.shippingMethods;
          this.deliveryCorps = data.deliveryCorps;
          this.paymentTypes = data.paymentTypes;
          this.paymentMethods = data.paymentMethods;
          this.paymentMethods.map(item => {
            if ((item.name = data.order.paymentMethodName)) {
              this.form.paymentMethodId = item.id;
            }
          });
          if (this.form.paymentMethodName === '到店支付') {
            this.paymentTypes.forEach((item, index) => {
              if (item.name === '会员卡余额') {
                this.paymentTypes.splice(index, 1);
              }
            });
          }
          this.adminCurrent = [{ id: data.adminCurrent.id, name: data.adminCurrent.realName }];
          if (!this.form.consultant.id) {
            this.form.consultant = { id: data.adminCurrent.id };
          } else {
            this.adminCurrent = [{ id: this.form.consultant.id, name: this.form.consultant.realName }];
          }
          if (this.form.area) {
            this.areaId = this.form.area.id;
          }

          this.form.type = this.getOrderStatus(this.form.type);
          this.listExistCardTemplate();
          this.listAdminByRole();
          if (this.form.orderType === '2') {
            this.getTagMapping();
            this.getStoreTags();
          }
          this.offsetAmountChange();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    paymentTypeChange(val) {
      if (val !== '会员卡余额') {
        this.form.memberCardId = '';
        this.form.beanDiscount = '';
        this.getOriginalAmount();
      }
    },
    memberCardChange() {
      this.getMemberCardInfo();
      this.getBeanRate();
    },
    getMemberCardInfo() {
      let param = {
        userCardId: this.form.memberCardId
      };
      http
        .get('/admin/memberCard/memberCard.jhtml', param)
        .then(data => {
          this.form.bean = data.content.bean;
          // this.beanCanUse = '可用 ' + this.form.bean;
          this.getCouponList();
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getBeanRate() {
      let param = {
        id: this.form.memberCardId
      };
      http
        .get('/admin/memberCard/memberCard.jhtml', param)
        .then(data => {
          this.beanRate = Number(data.rewardSet.cash) / Number(data.rewardSet.vBean);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getCouponList() {
      if (this.orderItems.length === 0) {
        return;
      }
      this.form.couponList = [];
      let cartItems = this.orderItems.map(item => {
        return {
          product: { id: item.productId },
          quantity: item.quantity || ''
        };
      });
      let params = {
        shopId: window.top.SHOP_ID || '',
        cartItems: cartItems,
        userId: this.form.userId,
        userCardId: this.form.memberCardId
      };
      http
        .post('/admin/order/couponCodes.jhtml', params)
        .then(data => {
          this.form.couponList = data.content;
          this.maxOffsetBean = data.maxOffsetBean;
          this.minOffsetBean = data.minOffsetBean;
          // if (Number(this.form.bean) < this.minOffsetBean || this.form.bean === '0') {
          //   this.beanCanUse = 'V豆不足, V豆抵扣范围[' + this.minOffsetBean + ', ' + this.maxOffsetBean + ']';
          // } else {
          //   this.beanCanUse = 'V豆抵扣范围[' + this.minOffsetBean + ', ' + this.maxOffsetBean + ']';
          // }
        })
        .catch(ErrorData => {
          if (ErrorData.errorMessage) {
            console.log(ErrorData.errorMessage);
          }
        });
    },
    listExistCardTemplate() {
      service.listExistCardTemplate(
        { userId: this.form.userId },
        data => {
          this.loading = false;
          this.listExistCard = data.content;
          this.listExistCard.forEach(item => {
            item.template.name += ' ¥' + item.balance;
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 顾问
    listAdminByRole() {
      let roleTypes = '';
      roleTypes = ['supplier'];
      service.listAdminByRole(
        { roleTypes: roleTypes },
        data => {
          this.loading = false;
          this.flag = false;
          console.log(this.form.consultant.id);
          data.dataList.map(item => {
            if (item.id === this.adminCurrent[0].id) {
              this.flag = true;
            }
          });
          if (!this.flag) {
            this.consultants = data.dataList.concat(this.adminCurrent);
          } else {
            this.consultants = data.dataList;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    async submitOrder() {
      let send = await this.analysisAddress(this.currentUser.shop.address);
      let receive = await this.analysisAddress(this.form.shippings[0].address);
      let orderItems = this.form.orderItems;
      let list = [];
      for (const orderItem of orderItems) {
        for (let index = 0; index < orderItem.quantity; index++) {
          let params = {
            cname: this.currentUser.shop.name,
            spro: send.province,
            scity: send.city,
            num: orderItem.product.vins[index].number,
            epro: receive.province,
            ecity: receive.city,
            depname: this.form.shippings[0].consignee
          };
          list.push(http.post('/admin/order/shipping2XinYue.jhtml', params));
        }
      }
      Promise.all(list)
        .then(data => {
          this.$emit('xrorder');
        })
        .catch(data => {
          this.$emit('xrorder');
        });
    },
    async analysisAddress(address) {
      console.log('开始解析, ' + address);
      return new Promise((resolve, reject) => {
        let myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(address, function(point) {
          // 根据坐标得到地址描述
          myGeo.getLocation(point, function(result) {
            console.log(result);
            resolve({
              province: result.addressComponents.province,
              city: result.addressComponents.city
            });
          });
        });
      });
    },
    save() {
      this.form.offsetAmountRate = this.form.offsetAmount;
      if (this.form.consultant.id === '') {
        this.$message.warning('请输入顾问');
        return false;
      }
      if (this.handler === 'shipping') {
        this.loading = true;
        this.shippingMethod.map(item => {
          if (item.name === this.form.shippingMethodName) {
            this.form.shippingMethodId = item.id;
          }
        });
        this.form.deliveryCorpId = this.form.shippings[0].deliveryCorpId;
        if (this.showDelivery) {
          if (this.form.shippings[0].deliveryCorpId === '') {
            this.$message.warning('请输入物流公司');
            this.loading = false;
            return false;
          }
          if (this.form.shippings[0].expressSn === '') {
            this.$message.warning('请输入物流单号');
            this.loading = false;
            return false;
          }
          if (this.form.shippings[0].freight === '' || !/^(0|[1-9][0-9]*)(\.\d+)?$/.test(this.form.shippings[0].freight)) {
            this.$message.warning('请输入正确的物流费用');
            this.loading = false;
            return false;
          }
          if (!this.showReceiver) {
            this.$set(this.form, 'shippingData', {
              expressSn: this.form.shippings[0].expressSn,
              freight: this.form.shippings[0].freight
            });
          } else {
            this.$set(this.form, 'shippingData', {
              phone: this.form.shippings[0].phone || this.form.phone,
              address: this.form.shippings[0].address || this.form.areaName,
              consignee: this.form.shippings[0].consignee || this.form.consignee,
              expressSn: this.form.shippings[0].expressSn,
              freight: this.form.shippings[0].freight
            });
          }
        } else if (this.showReceiver && !this.showDelivery) {
          this.$set(this.form, 'shippingData', {
            phone: this.form.shippings[0].phone || this.form.phone,
            address: this.form.shippings[0].address || this.form.areaName,
            consignee: this.form.shippings[0].consignee || this.form.consignee
          });
          this.$set(this.form, 'deliveryCorpId', this.form.shippings[0].deliveryCorpId);
        }
        this.loading = true;
        // 发货操作
        service.shippingOrder(
          this.form,
          data => {
            this.loading = false;
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
            console.log('shipping-success');
            // 物流发货之后刷新tab=======================================================================================
            this.isShipped = true;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
        // 执行操作
      } else if (this.handler === 'service') {
        this.loading = true;
        service.excuteOrder(
          this.form,
          data => {
            this.loading = false;
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      } else if (this.handler === 'payment') {
        this.loading = true;
        this.paymentTypes.map(item => {
          if (item.name === this.form.payments[0].paymentType) {
            this.form.paymentTypeId = item.id;
          }
        });
        this.form.payment = {
          payBank: this.form.payments[0].payBank,
          payAccount: this.form.payments[0].payAccount,
          amount: this.form.amount
        };
        if (
          !this.form.payments[0].paymentType ||
          ((this.form.payments[0].paymentType === '刷卡' || this.form.payments[0].paymentType === '汇款') &&
            (this.form.payments[0].payBank === '' || this.form.payments[0].payAccount === ''))
        ) {
          this.$message.warning('请输入付款信息');
          this.loading = false;
          return false;
        }
        this.$refs.form.validate((valid, a) => {
          if (valid) {
            service.paymentOrder(
              this.form,
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            this.loading = false;
          }
        });
      } else {
        this.loading = true;
        service.updateOrder(
          this.form,
          data => {
            this.loading = false;
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
            if (this.form.orderType === '2') {
              this.tagMapping();
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      }

      let name = this.deliveryCorps.find(deliveryCorp => {
        return deliveryCorp.id === this.form.shippings[0].deliveryCorpId;
      }).name;
      if (this.handler === 'shipping' && name === '新悦物流') {
        this.submitOrder();
      }
    },
    setOrderItems(val) {
      this.orderItems = val;
      this.orderItems.forEach(item => {
        item.productId = item.productId ? item.productId : item.id;
      });
      let total = 0;
      val.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      this.originalAmount = total;
      this.form.originalAmount = total;
      this.offsetAmountChange();
      if (this.form.member.nickname) {
        this.getCouponList();
      }
    },
    getSaveParams() {
      return {
        orderId: this.itemId
      };
    },
    getOrderStatus(type) {
      switch (type) {
        case '11':
          return '卖家已发货';
        case '10':
          return '退款退货完成';
        case '9':
          return '退款退货中';
        case '8':
          return '已过期';
        case '7':
          return '已评价';
        case '6':
          return '订单关闭';
        case '5':
          return '交易完成';
        case '4':
          return '订单已执行';
        case '3':
          return '买家已付款';
        case '2':
          return '商家已确认';
        case '1':
          return '待商家确认';
        default:
          return '无';
      }
    }
  }
};
</script>

<style lang="scss">
.memberDialog {
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
.order-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .input-with-select {
    .el-input {
      width: 85px!important;
    }
  }
  .el-collapse-item__header.is-active {
    background-color: #fef3e5;
  }
  .el-collapse-item__wrap {
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
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

  .el-form-item__content .el-select {
    width: 100%;
  }
  .biz-grid__content .biz-scroller {
    padding-left: 20px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .imgUpload {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 58px;
      height: 58px;
    }
    .el-upload--picture-card {
      width: 58px;
      height: 58px;
      line-height: 68px;
    }
  }
}
</style>
