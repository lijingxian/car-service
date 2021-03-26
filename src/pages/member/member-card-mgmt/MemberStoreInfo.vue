<template>
  <biz-grid class="member-bean-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit"></biz-header>
    <div class="header_bean" style="top:50px">当前余额：￥{{balance}}</div>
    <el-table :data="tableData" height="100%" style="margin-top:30px" size="small">
      <el-table-column label="来源" prop="type" :formatter="dateConverter"></el-table-column>
      <el-table-column label="项目" prop="itemName"></el-table-column>
      <el-table-column label="金额" prop="credit" width="50px"></el-table-column>
      <el-table-column label="日期" prop="happenData"></el-table-column>
      <el-table-column label="店铺" prop="shop.name">
        <div slot-scope="scope">{{scope.row.shop?scope.row.shop.name:''}}</div>
      </el-table-column>
      <el-table-column label="订单" prop="orderSn"></el-table-column>
      <el-table-column label="备注" prop="remarks"></el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)">凭证</el-button>
          </div>
        </div>
      </el-table-column>
    </el-table>
    <!-- <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination> -->
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog :visible.sync="showForm" :title="dialogTitle" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="当前余额" prop="balance">
          <el-input v-model="formModel.balance" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单编号" prop="sn" v-if="type==='chargebacks'">
          <el-input v-model="formModel.orderSn" placeholder="请选择订单" @focus="addOrder" readonly></el-input>
        </el-form-item>
        <el-form-item label="订单属性" prop="orderType" v-if="type==='chargebacks'">
          <el-select v-model="formModel.orderType" placeholder="请选择" @change="orderTypeChange">
            <el-option label="车品订单" value="0"></el-option>
            <el-option label="普通服务" value="2"></el-option>
            <el-option label="整车订单" value="9"></el-option>
            <el-option label="普通订单" value="10"></el-option>
            <el-option label="有价优惠券订单" value="17"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="products" v-if="type==='chargebacks'">
          <!-- <el-autocomplete v-model="formModel.products" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"
          @input="listProduct()"></el-autocomplete>-->
          <el-button type="primary" @click="selectGifts" v-show="show">添加商品</el-button>
          <el-table
            ref="brandTable"
            size="small"
            :data="selectedGiftList"
            stripe
            border
            highlight-current-row
            tooltip-effect="dark"
            style="width: 100%;"
            @cell-click="cellClick"
          >
            <el-table-column prop="fullName" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="商品价格"></el-table-column>
            <el-table-column prop="quantity" label="数量" min-width="110">
              <div slot-scope="scope">
                <div class="biz-customcol">
                  <el-input-number size="mini" :min="1" v-model="scope.row.quantity" @change="quantityChange" :disabled="!show"></el-input-number>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="date" label="操作">
              <div slot-scope="scope">
                <div class="biz-customcol">
                  <el-button type="text" size="mini" @click="delGift(scope.row)" v-show="show">删除</el-button>
                </div>
              </div>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="优惠券" prop="couponCodeId" v-if="type==='chargebacks'">
          <el-select v-model="formModel.couponCodeId" filterable clearable placeholder="请选择优惠券" @change="couponChange">
            <el-option
              v-for="(coupon,index) in couponList"
              :key="index"
              :label="coupon.coupon.name+'(￥'+coupon.coupon.amount+')'+getCouponType(coupon.coupon.type)"
              :value="coupon.id"
            >
              <span style="float: left">{{ coupon.coupon.name+'(￥'+coupon.coupon.amount+')' }}</span>
              <span style="float: right;margin-left:10px">{{ getCouponType(coupon.coupon.type) }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整V豆" prop="bean" v-if="type==='chargebacks'">
          <el-input v-model="formModel.bean" placeholder="调整V豆" @input="beanChange"></el-input>
          <div>V豆抵扣范围[{{minOffsetBean}}, {{maxOffsetBean}}]</div>
        </el-form-item>
        <el-form-item label="扣款金额" prop="amountPaid" v-if="type==='chargebacks'">
          <el-input v-model="formModel.amountPaid" placeholder="请输入扣款金额"></el-input>
        </el-form-item>
        <el-form-item label="业务类型" v-if="formModel.orderType==='2'">
          <tag-select ref="tagSelect" :tagList="tagList" :bAddTag="false" selectType="order" :selectedTags="selectedTags" @addSuccess="onAddSuccess"></tag-select>
        </el-form-item>
        <el-form-item v-if="type==='chargebacks'">
          <el-tag v-for="tag in selections" :key="tag.id" closable :type="'warning'" @close="handleClose(tag)">{{tag.value}}</el-tag>
        </el-form-item>
        <el-form-item label="储值金额" prop="amount" v-if="type==='payment'">
          <el-input v-model="formModel.amount" placeholder="请输入储值金额"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" v-if="type==='payment'">到店支付</el-form-item>
        <el-form-item label="付款方式" prop="paymentMethod" v-if="type==='payment'">
          <el-select v-model="formModel.paymentMethod" placeholder="请选择" @change="typeSwith">
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="现金" value="现金"></el-option>
            <el-option label="银行卡" value="银行卡"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款银行" prop="payBank" v-if="type==='payment'&&formModel.paymentMethod&&formModel.paymentMethod==='银行卡'">
          <el-select v-model="formModel.payBank" placeholder="请选择" @change="payBankChange">
            <el-option label="中国工商银行" value="中国工商银行"></el-option>
            <el-option label="中国农业银行" value="中国农业银行"></el-option>
            <el-option label="中国银行" value="中国银行"></el-option>
            <el-option label="中国建设银行" value="中国建设银行"></el-option>
            <el-option label="交通银行" value="交通银行"></el-option>
            <el-option label="中信银行" value="中信银行"></el-option>
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
        <el-form-item label="付款账号" prop="payAccount" v-if="type==='payment'&&formModel.paymentMethod&&formModel.paymentMethod==='银行卡'">
          <el-input v-model="formModel.payAccount" maxlength="100" placeholder="请输入付款账号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="formModel.remarks" maxlength="100" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-table-column width="110" prop="date" label="操作">
          <div slot-scope="scope">
            <div class="biz-customcol">
              <el-button type="text" size="mini" @click.stop="certificate(scope.row)">凭证</el-button>
            </div>
          </div>
        </el-table-column>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;"></biz-save-button>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">订单编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">订单类型：{{getType(form.orderType)}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">顾问：{{form.consultant?form.consultant.name?form.consultant.name:'':''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">结算时间：{{form.orderTime?form.orderTime.split(' ')[0]:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">会员姓名：{{form.member?form.member.name:''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">会员电话：{{form.member?form.member.mobile:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">车牌号：{{form.car?form.car.plateNumber?form.car.plateNumber:'':''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">车型：{{form.car?form.car.type?form.car.type:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">车辆识别代码：{{form.car?form.car.vin?form.car.vin:'':''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">赠送积分：{{form.point}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">赠送V豆：{{form.giftBean}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                使用券：
                <span
                  v-for="(couponCodes,index) in form.couponCodes"
                  :key="index"
                  v-if="form.couponCodes && form.couponCodes.length > 0"
                >{{couponCodes.name}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType==='1'||(form.giftAmount!=='0'&&form.giftAmount!==undefined)">
            <el-col :span="14">
              <div class="grid-content bg-purple">{{form.orderType==='1'?'充值金额：'+form.amount:''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">{{form.giftAmount!=='0'&&form.giftAmount!==undefined?'赠送金额：'+form.giftAmount:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.sn" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">会员卡号：{{userCard.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">会员卡余额：{{userCard.balance}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.bean" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">V豆总和：{{userCard.bean}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">积分总和：{{userCard.point}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-bottom">
            <el-col :span="14">
              <div class="grid-content bg-purple">抵扣V豆：{{form.bean}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" width="70" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="fullName" label="商品名" width="200">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.fullName}}</template>
            </el-table-column>
            <el-table-column property="price" label="单价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="小计">
              <template slot-scope="scope">￥{{scope.row.subTotal}}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="3">
              <div class="grid-content bg-purple">运费：￥{{form.freight}}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">优惠金额：￥{{form.couponDiscount}}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">V豆抵扣：￥{{form.beanDiscount}}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">调整金额：￥{{form.offsetAmount}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">实收金额：￥{{form.amountPaid}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" center width="1200px" append-to-body>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top" v-if="form.orderItems">
            <el-col :span="14">
              <div class="grid-content bg-purple">退款类型：{{form.orderItems[0].refundsType==='0'?'退款无需退货':form.orderItems[0].refundsType==='1'?'退款退货':'换货'}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">退款原因：{{form.orderItems[0].refundsReason}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderItems">
            <el-col :span="14">
              <div class="grid-content bg-purple">退款金额：{{form.orderItems[0].amoumtRefund}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">退款项目：{{form.orderItems[0].name?form.orderItems[0].name:form.orderItems[0].fullName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">退款时间：{{form.orderTime?form.orderTime.split(' ')[0]:''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">会员姓名：{{form.member?form.member.name:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">会员电话：{{form.member?form.member.mobile:''}}</div>
            </el-col>
            <el-col :span="10" v-if="userCard.sn">
              <div class="grid-content bg-purple">会员卡号：{{userCard.sn}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14" v-if="userCard.sn">
              <div class="grid-content bg-purple">会员卡余额：{{userCard.balance}}</div>
            </el-col>
            <el-col :span="10" v-if="userCard.bean">
              <div class="grid-content bg-purple">V豆总和：{{userCard.bean}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="userCard.bean">
            <el-col :span="14">
              <div class="grid-content bg-purple">积分总和：{{userCard.point}}</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <biz-dialog-selector
      title="选择商品"
      :visibility.sync="showDialog"
      :tableData="giftList"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      :selectionKeys="selectedGiftIds"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      @confirmed="confirmedProduct"
      @filterDataChange="dialogFilterDataChange"
      @selectionChange="selectionChange"
      :rowClassName="setClassName"
    >
      <el-table-column property="name" label="商品名称" width="200px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg" />
            <div style="width:120px;">{{scope.row.fullName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column property="brandName" label="品牌"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column label="剩余库存/库存">
        <template slot-scope="scope">
          <div style="width:120px;">{{scope.row.availableStock}}/{{scope.row.stock}}</div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <query-order-list :visible.sync="showOrderList" :memberId="userId" @confirm="memberSelected"></query-order-list>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
// import servicer from '@/service/activity-mgmt/promotion-mgmt/PromotionContent';
import { mapGetters } from 'vuex';
import vueEasyPrint from 'vue-easy-print';
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
import QueryOrderList from './components/QueryOrderList';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import TagSelect from '@/components/BizTagSelect';
import urls from '@/common/urls';

export default {
  name: 'MemberStoreInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    userId: {
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
    vueEasyPrint,
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizDialogSelector,
    QueryOrderList,
    TagSelect,
    BizPagination
  },
  data() {
    return {
      tagList: [],
      selectedTags: [],
      show: true,
      loading: false,
      formLoading: false,
      showForm: false,
      dialogTitle: '',
      paymentMethod: false,
      dialogTableVisible: false,
      dialogVisible: false,
      showOrderList: false,
      DefaultImg: DefaultImg,
      gridData: [],
      restaurants: [],
      couponList: [],
      bean: '',
      beanRate: '',
      type: '',
      realName: '',
      value: '',
      balance: '',
      form: {},
      title: '',
      couponAmount: '0',
      maxOffsetBean: '',
      minOffsetBean: '',
      subTotal: '',
      userCard: {},
      // 用户信息
      formModel: {
        balance: '',
        amountPaid: '',
        orderType: '',
        amount: '',
        paymentMethod: '',
        payBank: '',
        payAccount: '',
        remarks: '',
        products: '',
        bean: 0,
        couponCodeId: '',
        orderId: '',
        sn: ''
      },
      operations: [
        {
          label: '充值',
          name: 'payment',
          type: 'primary'
        },
        {
          label: '消费',
          name: 'chargebacks',
          type: 'primary'
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
      orderId: '',
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      },
      selectionList: [],
      rules: {
        amount: [
          {
            required: true,
            message: '请输入储值金额',
            trigger: 'blur'
          },
          { pattern: /^[0-9]+\.?[1-9]*$/, message: '请输入大于0的数', trigger: 'blur' }
        ],
        bean: [
          {
            required: false,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let reg = new RegExp('^(([1-9]*[1-9][0-9]*)|(0))$');
              console.log(this.formModel.bean);
              if (this.formModel && this.formModel.bean !== '' && this.formModel.bean !== undefined) {
                if (reg.test(this.formModel.bean)) {
                  console.log(this.bean);
                  if (Number(this.formModel.bean) > Number(this.bean)) {
                    callback(new Error('可用V豆不足'));
                  } else {
                    callback();
                  }
                } else {
                  callback(new Error('V豆必须为正整数或零'));
                }
              } else {
                callback();
              }
            }
          }
        ],
        payAccount: [
          {
            required: true,
            message: '请输入付款账号',
            trigger: 'blur'
          },
          { pattern: /^[0-9]*$/, message: '格式错误', trigger: 'blur' }
        ],
        paymentMethod: [
          {
            required: true,
            message: '请选择付款方式',
            trigger: 'blur'
          }
        ],
        payBank: [
          {
            required: true,
            message: '请选择付款银行',
            trigger: 'blur'
          }
        ],
        amountPaid: [
          {
            required: true,
            message: '请输入扣款金额',
            trigger: 'blur'
          },
          {
            pattern: /^(([0-9]+\.[0-9]*[0-9][0-9]*)|([0-9]*[0-9][0-9]*\.[0-9]+)|([0-9]*[0-9][0-9]*))$/,
            message: '请输入正数',
            trigger: 'blur'
          }
        ]
      },
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      selectedGiftList: [],
      selectedGiftIds: [],
      giftList: [],
      showDialog: false,
      dialogFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ]
    };
  },
  created() {
    if (this.itemId.id) {
      this.getList();
      this.getCoupon();
    }
  },
  watch: {
    'itemId.id'(nVal, oVal) {
      this.getStoreTags();
      if (nVal) {
        this.getList();
        this.getCoupon();
      }
    }
  },
  mounted() {
    this.listProduct();
  },
  methods: {
    ...mapGetters(['getUser']),
    getCouponType(type) {
      switch (type) {
        case '13':
          return '权益券';
        case '12':
          return '套餐券';
        case '11':
          return '满送券';
        case '10':
          return '折扣券';
        case '9':
          return '满减';
        case '8':
          return '包邮券';
        case '7':
          return '抵价券';
        case '6':
          return 'N元抢购';
        case '5':
          return '秒杀券';
        case '4':
          return '团购券';
        case '3':
          return '现金券';
        case '2':
          return '实物券';
        case '1':
          return '优惠券';
        case '0':
          return '红包';
        default:
          return '无';
      }
    },
    onAddSuccess() {
      this.getStoreTags();
    },
    setClassName({ row, index }) {
      return row.availableStock === '0' ? 'disabled-row' : '';
    },
    tagMapping(orderId) {
      let param = {
        refId: orderId,
        type: '7',
        tags: this.$refs.tagSelect.getCurSelectedTags()
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
    getStoreTags() {
      let param = {
        shopId: window.top.SHOP_ID || '',
        categoryType: '订单/服务业务类型'
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
    addOrder() {
      this.showOrderList = true;
    },
    memberSelected(memberInfo) {
      console.log(memberInfo);
      this.formModel.orderSn = memberInfo.orderSn;
      this.formModel.orderType = memberInfo.orderType;
      this.formModel.amountPayable = memberInfo.amountPayable;
      this.selectedGiftList = memberInfo.orderItems || [];
      this.orderId = memberInfo.orderId;
      this.subTotal = memberInfo.amountPaid;
      this.$set(this.formModel, 'amountPaid', this.subTotal);
      this.getCoupon();
      this.show = false;
    },
    cellClick(row, column, cell, event) {
      if (column.label !== '促销价') {
        this.selectedGiftList.map(gift => {
          gift.editFlag = false;
        });
      }
      if (column.label === '促销价') {
        this.selectedGiftList.map(gift => {
          if (gift.id !== row.id) {
            gift.editFlag = false;
          } else {
            gift.editFlag = true;
          }
        });
      }
    },
    selectionChange(selections) {
      console.log(selections);
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    confirmedProduct(val) {
      console.log(val);
      this.selectedGiftIds = val.concat();
      this.selectedGiftList = [];
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.$set(gift, 'quantity', 1);
          this.selectedGiftList.push(gift);
        }
      });
      let total = 0;
      this.selectedGiftList.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      this.formModel.bean = '0';
      this.formModel.couponCodeId = '';
      this.subTotal = total;
      this.$set(this.formModel, 'amountPaid', this.subTotal);
      this.getCoupon();
      this.dialogFilters[0].value = '';
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getGiftList();
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getGiftList();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getGiftList();
    },
    beanChange(val) {
      let amountPaid = 0;
      this.$set(this.formModel, 'amountPaid', 0);
      if (isNaN(parseInt(val))) {
        val = 0;
      }
      if (this.couponAmount !== '' && this.couponAmount !== undefined) {
        amountPaid = Number(this.subTotal) - Number(val * this.beanRate) - Number(this.couponAmount);
        if (amountPaid < 0) {
          amountPaid = 0;
          this.$set(this.formModel, 'amountPaid', amountPaid);
        } else {
          amountPaid = amountPaid.toFixed(2);
          this.$set(this.formModel, 'amountPaid', amountPaid);
        }
      } else {
        amountPaid = Number(this.subTotal) - Number(val * this.beanRate);
        if (amountPaid < 0) {
          amountPaid = 0;
          this.$set(this.formModel, 'amountPaid', amountPaid);
        } else {
          amountPaid = amountPaid.toFixed(2);
          this.$set(this.formModel, 'amountPaid', amountPaid);
        }
      }
    },
    selectGifts() {
      this.showDialog = !this.showDialog;
      this.selectionList = [];
      this.getGiftList();
    },
    getGiftList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        orderType: this.formModel.orderType
      };
      service.listProduct(
        params,
        data => {
          this.giftList = data.content;
          this.giftList.map(gift => {
            this.$set(gift, 'editFlag', false);
            if (!gift.promotionPrice) {
              this.$set(gift, 'promotionPrice', gift.price);
            }
          });
          this.dialogPagination.total = Number(data.total);
          console.log('111', this.giftList);
        },
        ErrorData => {
          console.log('ERR_GET_GIFT_LIST: ', ErrorData);
        }
      );
    },
    delGift(row) {
      for (let i = 0; i < this.selectedGiftList.length; i++) {
        if (this.selectedGiftList[i].id === row.id) {
          this.selectedGiftList.splice(i, 1);
        }
      }
      this.selectedGiftIds = [];
      this.selectedGiftList.map(gift => {
        this.selectedGiftIds.push(gift.id);
      });
      this.subTotal = Number(this.subTotal) - Number(row.price) * Number(row.quantity);
      this.formModel.bean = '0';
      this.formModel.couponCodeId = '';
      this.getCoupon();
    },
    quantityChange() {
      let total = 0;
      this.selectedGiftList.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      this.subTotal = total;
      this.formModel.bean = '0';
      this.formModel.couponCodeId = '';
      this.formModel.amountPaid = this.subTotal;
      this.getCoupon();
    },
    getCoupon() {
      let cartItems = this.selectedGiftList.map(item => {
        return {
          product: { id: item.id },
          quantity: item.quantity || ''
        };
      });
      let params = {
        shopId: window.top.SHOP_ID || '',
        cartItems: cartItems,
        userId: this.userId.id,
        userCardId: this.itemId.id
      };
      this.couponList = [];
      http
        .post('/admin/order/couponCodes.jhtml', params)
        .then(data => {
          this.couponList = data.content;
          this.minOffsetBean = data.minOffsetBean;
          this.maxOffsetBean = data.maxOffsetBean;
        })
        .catch(ErrorData => {
          console.log('errdata: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    couponChange(val) {
      let amount = 0;
      this.couponList.map(item => {
        if (item.id === val) {
          amount = item.coupon.amount;
        }
      });
      this.couponAmount = amount;
      let amountPaid = 0;
      if (this.formModel.bean !== '' && this.formModel.bean !== undefined) {
        amountPaid = Number(this.subTotal) - Number(this.formModel.bean * this.beanRate) - Number(amount);
        if (amountPaid < 0) {
          amountPaid = 0;
        } else {
          amountPaid = amountPaid.toFixed(2);
        }
        this.$set(this.formModel, 'amountPaid', amountPaid);
      } else {
        amountPaid = Number(this.subTotal) - Number(amount);
        if (amountPaid < 0) {
          amountPaid = 0;
        } else {
          amountPaid = amountPaid.toFixed(2);
        }
        this.$set(this.formModel, 'amountPaid', amountPaid);
      }
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    getType(orderType) {
      switch (orderType) {
        case '0':
          return '车品订单';
        case '1':
          return '充值订单';
        case '2':
          return '服务订单';
        case '3':
          return '一键救援订单';
        case '4':
          return '服务订单';
        case '5':
          return '服务订单';
        case '6':
          return '预约置换订单';
        case '7':
          return '贷款购车订单';
        case '8':
          return '预约体验订单';
        case '9':
          return '整车订单';
        case '10':
          return '普通订单';
        case '20':
          return '金融订单';
        case '21':
          return '保险订单';
        default:
          return '';
      }
    },
    dateConverter(row) {
      switch (row.type) {
        case '0':
          return '会员充值';
        case '1':
          return '会员支付';
        case '2':
          return '后台充值';
        case '3':
          return '后台扣费';
        case '4':
          return '后台支付';
        case '5':
          return '后台退款';
        case '6':
          return '活动 ';
        case '7':
          return '充值赠送';
      }
      return '';
    },
    getList() {
      this.loading = true;
      this.showForm = false;
      service.getlistStore(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || '',
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        data => {
          this.tableData = data.content;
          this.balance = data.balance;
          this.bean = data.bean;
          this.beanRate = data.beanRate;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    certificate(row) {
      if (row.orderId) {
        service.certificate(
          {
            orderId: row.orderId,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            if (row.type === '5') {
              this.dialogVisible = true;
              this.title = this.getUser().shop ? this.getUser().shop.name + '退款单' : '退款单';
            } else {
              this.dialogTableVisible = true;
              this.title = this.getUser().shop ? this.getUser().shop.name + '结算单' : '结算单';
            }
            this.form = data.order;
            this.userCard = data.userCard;
            this.gridData = data.order.orderItems;
            this.realName = data.adminCurrent ? data.adminCurrent.realName : '';
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      } else {
        http
          .get('/admin/purchaseOrder/voucher/settlement.jhtml', {
            orderId: row.purchaseOrderId,
            shopId: window.top.SHOP_ID || ''
          })
          .then(data => {
            if (row.type === '5') {
              this.dialogVisible = true;
              this.title = this.getUser().shop ? this.getUser().shop.name + '退款单' : '退款单';
            } else {
              this.dialogTableVisible = true;
              this.title = this.getUser().shop ? this.getUser().shop.name + '结算单' : '结算单';
            }
            this.form = data.order;
            this.userCard = data.userCard;
            this.gridData = data.order.orderItems;
            this.realName = data.adminCurrent ? data.adminCurrent.realName : '';
          })
          .catch(ErrorData => {
            console.log('errdata: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    orderTypeChange(val) {
      this.listProduct();
      if (val === '2') {
        this.getStoreTags();
      }
    },
    listProduct() {
      service.listProduct(
        {
          searchValue: this.formModel.products,
          shopId: window.top.SHOP_ID || '',
          orderType: this.formModel.orderType
        },
        data => {
          this.restaurants = data.content.map(item => {
            return { value: item.fullName, id: item.id };
          });
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    typeSwith(val) {
      this.$refs.form.clearValidate('paymentMethod');
      if (val === '银行卡') {
        this.paymentMethod = true;
      } else {
        this.paymentMethod = false;
      }
    },
    payBankChange() {
      this.$refs.form.clearValidate('payBank');
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelect(val) {
      this.selections.push(val);
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.type === 'payment') {
            if (Number(this.formModel.amount) === 0) {
              this.$message.warning('储值金额为大于0的数');
              this.loading = false;
              return false;
            }
            service.addScore(
              {
                id: this.itemId.id,
                shopId: window.top.SHOP_ID || '',
                amount: this.formModel.amount,
                paymentMethod: this.formModel.paymentMethod,
                payBank: this.formModel.payBank,
                payAccount: this.formModel.payAccount,
                remarks: this.formModel.remarks
              },
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.getList();
                this.$emit('saveSuccess', this.itemId.id);
                this.showForm = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            if (
              Number(this.formModel.bean) > Number(this.maxOffsetBean) ||
              Number(this.formModel.bean) < Number(this.minOffsetBean)
            ) {
              this.$message.warning('V豆超过了兑换比例限制');
              this.loading = false;
              return false;
            }
            service.reduceDeposit(
              {
                id: this.itemId.id,
                shopId: window.top.SHOP_ID || '',
                amountPaid: this.formModel.amountPaid,
                bean: this.formModel.bean,
                couponCodeId: this.formModel.couponCodeId,
                orderType: this.formModel.orderType,
                orderId: this.orderId,
                cartItems: this.selectedGiftList.map(item => {
                  return {
                    quantity: item.quantity,
                    name: item.name,
                    product: { id: item.id }
                  };
                }),
                remarks: this.formModel.remarks
              },
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.getList();
                this.$emit('saveSuccess', this.itemId.id);
                this.tagMapping(data.orderId);
                this.showForm = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        }
      });
    },
    payment() {
      this.type = 'payment';
      service.getlistStore(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = {};
          this.formModel.balance = data.balance;
          this.showForm = true;
          this.dialogTitle = '充值';
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    chargebacks() {
      this.show = true;
      this.type = 'chargebacks';
      service.getlistStore(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = {
            balance: '',
            amountPaid: '',
            orderType: '',
            amount: '',
            paymentMethod: '',
            payBank: '',
            payAccount: '',
            remarks: '',
            products: '',
            bean: 0,
            couponCodeId: '',
            orderId: '',
            sn: ''
          };
          this.selections = [];
          this.selectedGiftList = [];
          this.selectedGiftIds = [];
          this.formModel.balance = data.balance;
          this.subTotal = 0;
          this.orderId = '';
          this.showForm = true;
          this.dialogTitle = '消费';
          this.loading = false;
          this.getCoupon();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleClose(tag) {
      this.selections.splice(this.selections.indexOf(tag), 1);
    },
    cancelForm() {
      this.showForm = false;
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 300 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return true;
      };
    }
  }
};
</script>

<style lang="scss">
.dialog-column {
  display: flex;
  align-items: center;
}
.productImg {
  display: block;
  width: 50px;
  height: 50px;
  margin-right: 5px;
}

.grid18 {
  height: 20px;
}
.d-p-wrap {
  text-align: left;
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .rowNone {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      .cell {
        > div {
          text-align: left;
        }
      }
    }
  }
}
.member-bean-info {
  padding-top: 20px;
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .biz-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    align-items: center;
  }
  .header_bean {
    position: absolute;
    right: 0px;
    top: 20px;
    color: #606266;
    font-size: 14px;
    width: 300px;
  }
  .biz-customcol {
    .el-input-number--mini {
      width: 100px;
    }
    .el-input {
      width: 100px !important;
    }
  }
}
</style>
