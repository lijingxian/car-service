<template>
  <div class="financial-order-list">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="order-mgmt-tabel"
    >
      <div slot="operation" class="operate-container">
        <el-radio-group v-model="curSelectDateType" @change="onChangeDateType" size="mini">
          <el-radio-button v-for="item in dateTypeList" :label="item" :key="item">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table-column label="订单信息" min-width="215px">
        <template slot-scope="scope">
          <div class="customer-info">{{scope.row.sn}}</div>
          <i class="iconfont biz-icon-i-web-md" style="font-size:32px;color:#ff7300" v-if="scope.row.dType==='purchaseOrder'"></i>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="200px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%;margin-right:30px">
              <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id" class="product-info">
                <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                <img v-else-if="orderItem.name==='一键救援'" src="../../../assets/images/rescue.jpg" />
                <img v-else src="/resources/admin/images/default/product-default-100.png" />
                <div class="wrapper">
                  <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                </div>
                <div class="info-bottom">
                  <div
                    style="margin-left:7px;opacity:0.65"
                  >{{orderItem.fullName&&orderItem.fullName.indexOf('[')!==-1?orderItem.fullName.split("[")[1].split("]")[0]:''}}</div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品价格&数量" min-width="120px">
        <template slot-scope="scope">
          <div>
            <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id">￥{{orderItem.price}}&nbsp;&nbsp;&nbsp;x{{orderItem.quantity}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格信息" min-width="90px">
        <template slot-scope="scope">￥{{scope.row.amount}}</template>
      </el-table-column>
      <el-table-column label="客户信息" min-width="170px">
        <template slot-scope="scope">
          <div class="customer-info" @click.stop="memberClick(scope.row)">
            <img v-if="scope.row.member.head" :src="scope.row.member.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="titleMember" :title="scope.row.member.name">{{scope.row.member.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                <span>{{scope.row.member.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" min-width="90px">
        <template slot-scope="scope">{{scope.row.shop.name}}</template>
      </el-table-column>
      <el-table-column prop="invoiceState" label="发票" min-width="50px" :formatter="getInvoiceStatus" v-if="showInvoice"></el-table-column>
      <el-table-column prop="type" label="状态" min-width="85" :formatter="getOrderStatus"></el-table-column>
      <el-table-column prop="date" label="操作" min-width="60">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.type==='2'&&(orderType==='ride'||orderType==='replace'||orderType==='loan') && scope.row.hasSyncOrder === '0'"
              @click.stop="service(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(orderType==='service'||orderType==='rescue')&&((scope.row.type==='2'&&scope.row.method==='1')||(scope.row.type==='2'&&scope.row.method==='2')) && scope.row.hasSyncOrder === '0'"
              @click.stop="serviceHandler(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.type==='2'&&scope.row.method==='2'&&(orderType==='car'||orderType==='product'||orderType==='general'||scope.row.dType==='purchaseOrder') && scope.row.hasSyncOrder === '0'"
              @click.stop="excuteHandler(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(orderType==='service'||orderType==='rescue')&&scope.row.type==='3'&&scope.row.method==='0' && scope.row.hasSyncOrder === '0'"
              @click.stop="excuteHandler(scope.row)"
            >服务</el-button>
            <el-button type="text" size="mini" v-if="scope.row.type==='2'||scope.row.type==='1'" @click.stop="closeOrder(scope.row)">关闭</el-button>
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)">凭证</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <el-popover ref="confirmOrder" placement="top-start" min-width="300" v-model="visiable">
      <p>
        <i class="el-icon-warning" style="color:#ff7300;margin-right:10px"></i>您要确认此订单么?
      </p>
      <div style="text-align: right; margin: 0">
        <!-- <el-button size="mini" type="text" @click="cancle(scope.$index)">取消</el-button> -->
        <el-button size="mini" type="text">确定</el-button>
      </div>
    </el-popover>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <base-info
          :itemId="itemId"
          :isEdit="isEdit"
          ref="baseInfo"
          :handler="handler"
          :open="open"
          :activeNames="activeNames"
          @xrorder="xrorder"
          @operationSuccess="operationSuccess"
        ></base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <product-info :itemId="itemId" :isEdit="isEdit" ref="productinfo" @setOrderItems="setOrderItems" @operationSuccess="operationSuccess"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body custom-class="orderDialog">
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
            <el-table-column property="isTotal" min-width="70" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="name" label="商品名" min-width="200">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.name}}</template>
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
    <el-dialog :visible.sync="showOrderCertificate" center width="1200px" append-to-body custom-class="orderDialog">
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
              <div class="grid-content bg-purple">完成时间：{{form.orderTime?form.orderTime.split(' ')[0]:''}}</div>
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
          <el-row :gutter="10" class="row" v-if="form.orderType === '8'">
            <el-col :span="14">
              <div class="grid-content bg-purple">体验车型：{{form.orderItems[0].appointment.product.fullName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">体验车牌：{{form.orderItems[0].appointment.plateNumber}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '8'">
            <el-col :span="14">
              <div class="grid-content bg-purple">体验时间：{{form.orderItems[0].appointment.driveStartDate}}-{{form.orderItems[0].appointment.driveEndDate}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">体验里程：{{form.orderItems[0].appointment.endMileage-form.orderItems[0].appointment.startMileage}}km</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '8'">
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '6'">
            <el-col :span="14">
              <div class="grid-content bg-purple">已有车型：{{form.orderItems[0].appointment.car.type}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">行驶里程：{{form.orderItems[0].appointment.drivingRange}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '6'">
            <el-col :span="14">
              <div class="grid-content bg-purple">心仪车型：{{form.orderItems[0].appointment.product.brandName + form.orderItems[0].appointment.product.fullName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '7'">
            <el-col :span="14">
              <div class="grid-content bg-purple">金融方案：{{form.orderItems[0].appointment.financialPlan.name}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">首付比例：{{form.orderItems[0].appointment.downPayment}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '7'">
            <el-col :span="14">
              <div class="grid-content bg-purple">还款年限：{{form.orderItems[0].appointment.year}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">月供：￥{{monthPay()}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType === '7'">
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row" v-if="form.orderType!=='7'">
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
    <el-dialog :visible.sync="showCloseOrder" center append-to-body custom-class="close-order-dialog">
      <div>
        <div>请您在与客户沟通一致的前提下使用此功能，订单关闭后，不能恢复</div>
        <div class="reson-container">
          <span class="start">*</span>
          <span>请选择关闭订单的理由：</span>
          <el-select v-model="curSelectCloseReason" placeholder="请选择关闭理由" class="order-select">
            <el-option v-for="reason in reasonList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
          </el-select>
        </div>
        <div class="deccription">
          <span class="dec-label">备注：</span>
          <el-input v-model="closeDeccription" placeholder="请输入备注" type="textarea" :rows="4"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="cancelClose">取消</el-button>
        <el-button @click="confirmClose">确定关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showIframe" center width="1200px" append-to-body>
      <iframe :src="iframeSrc" frameborder="0" style="height: 600px;width:100%;"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/order-mgmt/orderMgmt';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import { global, membershipMgmt } from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';
import dateTime from '@/utils/dateTime';
import axios from 'axios';
export default {
  name: 'OrderMgmtList',
  data() {
    return {
      iframeSrc: '',
      showIframe: false,
      showOrderCertificate: false,
      closeDeccription: '',
      curSelectCloseReason: '',
      reasonList: [
        { label: '长时间联系不到客户，交易不成功', value: '长时间联系不到客户，交易不成功' },
        { label: '客户购买意向不明确，取消交易', value: '客户购买意向不明确，取消交易' },
        { label: '客户已通过其他渠道支付款项', value: '客户已通过其他渠道支付款项' },
        { label: '客户不想买了', value: '客户不想买了' },
        { label: '重复订单', value: '重复订单' },
        { label: '缺货，订单无法完成', value: '缺货，订单无法完成' },
        { label: '其他理由', value: '其他理由' }
      ],
      errorImg: 'this.src="' + require('../../../assets/images/commodity/pic_default_fail.png') + '"',
      showCloseOrder: false,
      curSelectDateType: '全部',
      dateTypeList: ['全部', '今日订单', '近一周订单', '近一月订单', '近三月订单'],
      tabName: 'info',
      settingName: 'setting',
      memberName: 'memberInfo',
      memberInfo: false,
      showRecommend: false,
      itemId: '',
      userId: '',
      invoiceInfoId: '',
      invoiceId: '',
      title: '',
      handler: '',
      memberId: { id: '' },
      editShopIds: [],
      isEdit: true,
      form: {},
      userCard: {},
      paymentMethodName: '',
      orderType: '',
      orderState: '',
      invoiceState: '',
      price: '',
      realName: '',
      defaultTab: '0',
      activeNames: ['1'],
      loading: false,
      visiable: false,
      open: false,
      openSetting: false,
      dialogTableVisible: false,
      selections: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: this.hasAuthAdd()
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'export',
          type: '',
          auth: this.hasAuthExport()
        },
        {
          label: '设置',
          name: 'setting',
          type: 'primary',
          auth: ['admin:rescue.set']
        }
      ],
      filters: [
        // {
        //   type: 'select',
        //   label: '订单类型',
        //   name: 'shop',
        //   value: '',
        //   class: 'hidden',
        //   options: [
        //     {
        //       value: '',
        //       label: '全部'
        //     },
        //     {
        //       value: 'purchaseOrder',
        //       label: '门店订单'
        //     },
        //     {
        //       value: 'order',
        //       label: '个人订单'
        //     }
        //   ]
        // },
        {
          type: 'select',
          label: '店铺',
          name: 'shop',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '顾问',
          name: 'consultantId',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          class: 'hidden',
          options: [
            { value: '', label: '全部' },
            { value: '1', label: '待商家确认' },
            { value: '2', label: '商家已确认' },
            { value: '3', label: '买家已付款' },
            { value: '4', label: '订单已执行' },
            { value: '5', label: '交易完成' },
            { value: '6', label: '订单关闭' },
            { value: '7', label: '已评价' },
            { value: '9', label: '退款退货中' }
          ]
        },
        {
          type: 'select',
          label: '发票',
          name: 'invoiceState',
          value: '',
          class: 'hidden',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '待开票' },
            { value: '1', label: '待邮寄' }
            // { value: 'expressed', label: '已邮寄' },
            // { value: 'completed', label: '已签收' }
          ]
        },
        {
          type: 'select',
          label: '时间类型',
          name: 'dateType',
          value: '0',
          class: 'hidden',
          options: [
            { value: '0', label: '创建时间' },
            { value: '1', label: '完成时间' }
          ]
        },
        {
          type: 'daterange',
          label: '日期',
          class: 'hidden',
          name: 'publishDate',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入订单编号/姓名/电话',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      gridData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    ProductInfo,
    vueEasyPrint
  },
  created() {
    this.orderType = this.$route.params.orderType || '';
    if (this.orderType !== 'rescue') {
      this.operations.splice(3, 1);
    }
    this.getList();
    this.queryOrderKpi();
    this.listAdminByRole();
    this.getEditableStores();
    this.queryShopList();
  },
  watch: {
    $route(to, from) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.orderType = this.$route.params.orderType || '';
      if (this.orderType !== 'rescue') {
        this.operations.splice(3, 1);
      }
      this.getList();
      this.queryOrderKpi();
      this.listAdminByRole();
      this.getEditableStores();
      this.queryShopList();
    }
  },
  computed: {
    // 是否显示发票列
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      if (this.$route.params.orderType === 'car') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating' ? 'admin:carOrder.edit' : 'admin:carOrder.sale.edit'
        );
      } else if (this.$route.params.orderType === 'product') {
        return this.currentAuth.includes(this.swichAuth('editProduct'));
      } else if (this.$route.params.orderType === 'general') {
        return this.currentAuth.includes(this.swichAuth('editGeneral'));
      } else if (this.$route.params.orderType === 'service') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating' ? 'admin:normalService.edit' : 'admin:normalService.aftersale.edit'
        );
      } else if (this.$route.params.orderType === 'rescue') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating' ? 'admin:rescue.edit' : 'admin:rescue.aftersale.edit'
        );
      } else if (this.$route.params.orderType === 'ride') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating' ? 'admin:testAppointment.edit' : 'admin:testAppointment.sale.edit'
        );
      } else if (this.$route.params.orderType === 'replace') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating'
            ? 'admin:replacementAppointment.edit'
            : 'admin:replacementAppointment.sale.edit'
        );
      } else if (this.$route.params.orderType === 'loan') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating' ? 'admin:carloan.edit' : 'admin:carloan.sale.edit'
        );
      } else if (this.$route.params.orderType === 'couponOrder') {
        return this.currentAuth.includes(
          this.$route.path.split('/')[1] === 'operating' ? 'admin:couponOrder.edit' : 'admin:couponOrder.aftersale.edit'
        );
      } else if (this.$route.params.orderType === 'deposit') {
        return this.currentAuth.includes('admin:deposit.edit');
      } else {
        return true;
      }
    },
    showInvoice() {
      let orderTypeList = ['service', 'product', 'car', 'general', 'rescue', 'couponOrder'];
      return orderTypeList.indexOf(this.$route.params.orderType) !== -1;
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    swichAuth(handler) {
      let path = this.$route.path.split('/');
      if (path[1] === 'operating') {
        if (handler === 'addProduct') {
          return ['admin:carProductOrder.add'];
        } else if (handler === 'editProduct') {
          return 'admin:carProductOrder.edit';
        } else if (handler === 'exportProduct') {
          return ['admin:carProductOrder.export'];
        }
        if (handler === 'addGeneral') {
          return ['admin:order.add'];
        } else if (handler === 'editGeneral') {
          return 'admin:order.edit';
        } else if (handler === 'exportGeneral') {
          return ['admin:order.export'];
        }
      }
      if (path[1] === 'sales') {
        if (handler === 'addProduct') {
          return ['admin:carProductOrder.sale.add'];
        } else if (handler === 'editProduct') {
          return 'admin:carProductOrder.sale.edit';
        } else if (handler === 'exportProduct') {
          return ['admin:carProductOrder.sale.export'];
        }
        if (handler === 'addGeneral') {
          return ['admin:order.sale.add'];
        } else if (handler === 'editGeneral') {
          return 'admin:order.sale.edit';
        } else if (handler === 'exportGeneral') {
          return ['admin:order.sale.export'];
        }
      }
      if (path[1] === 'after-sale') {
        if (handler === 'addProduct') {
          return ['admin:carProductOrder.aftersale.add'];
        } else if (handler === 'editProduct') {
          return 'admin:carProductOrder.aftersale.edit';
        } else if (handler === 'exportProduct') {
          return ['admin:carProductOrder.aftersale.export'];
        }
        if (handler === 'addGeneral') {
          return ['admin:order.aftersale.add'];
        } else if (handler === 'editGeneral') {
          return 'admin:order.aftersale.edit';
        } else if (handler === 'exportGeneral') {
          return ['admin:order.aftersale.export'];
        }
      }
    },
    hasAuthAdd() {
      console.log(123);
      if (this.$route.params.orderType === 'car') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:carOrder.add' : 'admin:carOrder.sale.add'];
      } else if (this.$route.params.orderType === 'product') {
        this.swichAuth('addProduct');
      } else if (this.$route.params.orderType === 'general') {
        this.swichAuth('addGeneral');
      } else if (this.$route.params.orderType === 'service') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:normalService.add' : 'admin:normalService.aftersale.add'];
      } else if (this.$route.params.orderType === 'rescue') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:rescue.add' : 'admin:rescue.aftersale.add'];
      } else if (this.$route.params.orderType === 'ride') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:testAppointment.add' : 'admin:testAppointment.sale.add'];
      } else if (this.$route.params.orderType === 'replace') {
        return [
          this.$route.path.split('/')[1] === 'operating'
            ? 'admin:replacementAppointment.add'
            : 'admin:replacementAppointment.sale.add'
        ];
      } else if (this.$route.params.orderType === 'loan') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:carloan.add' : 'admin:carloan.sale.add'];
      } else if (this.$route.params.orderType === 'couponOrder') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:couponOrder.add' : 'admin:couponOrder.aftersale.add'];
      } else if (this.$route.params.orderType === 'deposit') {
        return ['admin:deposit.add'];
      } else {
        return true;
      }
    },
    hasAuthExport() {
      if (this.$route.params.orderType === 'car') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:carOrder.export' : 'admin:carOrder.sale.export'];
      } else if (this.$route.params.orderType === 'product') {
        this.swichAuth('exportProduct');
      } else if (this.$route.params.orderType === 'general') {
        this.swichAuth('exportGeneral');
      } else if (this.$route.params.orderType === 'service') {
        return [
          this.$route.path.split('/')[1] === 'operating' ? 'admin:normalService.export' : 'admin:normalService.aftersale.export'
        ];
      } else if (this.$route.params.orderType === 'rescue') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:rescue.export' : 'admin:rescue.aftersale.export'];
      } else if (this.$route.params.orderType === 'ride') {
        return [
          this.$route.path.split('/')[1] === 'operating' ? 'admin:testAppointment.export' : 'admin:testAppointment.sale.export'
        ];
      } else if (this.$route.params.orderType === 'replace') {
        return [
          this.$route.path.split('/')[1] === 'operating'
            ? 'admin:replacementAppointment.export'
            : 'admin:replacementAppointment.sale.export'
        ];
      } else if (this.$route.params.orderType === 'loan') {
        return [this.$route.path.split('/')[1] === 'operating' ? 'admin:carloan.export' : 'admin:carloan.sale.export'];
      } else if (this.$route.params.orderType === 'couponOrder') {
        return [
          this.$route.path.split('/')[1] === 'operating' ? 'admin:couponOrder.export' : 'admin:couponOrder.aftersale.export'
        ];
      } else if (this.$route.params.orderType === 'deposit') {
        return ['admin:deposit.export'];
      } else {
        return true;
      }
    },
    operate(name) {
      this[name]();
    },
    monthPay() {
      if (this.form.orderItems[0].appointment.year) {
        this.form.orderItems[0].appointment.financialPlan.loanTerms.map(item => {
          if (item.year === this.form.orderItems[0].appointment.year) {
            this.form.orderItems[0].appointment.rate = item.rate;
          }
        });
        if (this.form.orderItems[0].appointment.rate > 0) {
          return (
            ((((this.form.orderItems[0].appointment.product.price -
              (this.form.orderItems[0].appointment.product.price * this.form.orderItems[0].appointment.downPayment) / 100) *
              this.form.orderItems[0].appointment.rate) /
              12) *
              Math.pow(1 + this.form.orderItems[0].appointment.rate / 12, this.form.orderItems[0].appointment.year * 12)) /
            (Math.pow(1 + this.form.orderItems[0].appointment.rate / 12, this.form.orderItems[0].appointment.year * 12) - 1)
          ).toFixed(2);
        } else {
          return (this.form.orderItems[0].appointment.product.price / (this.form.orderItems[0].appointment.year * 12)).toFixed(2);
        }
      }
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
        this.filters[5].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
        this.filters[5].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    xrorder() {
      this.iframeSrc = 'http://122.143.21.152/xymx/userinajLoginAction.action?name=jianwl&&pwd=123456';
      this.showIframe = true;
    },
    logistics(vin) {
      this.iframeSrc = 'http://122.143.21.152/xymx/getzaitupageDeliveryAction.action?num=' + vin;
      this.showIframe = true;
    },
    refresh() {
      this.itemId = '';
      this.flag = true;
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    queryShopList() {
      http
        .get(membershipMgmt.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '4'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[0], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    cancelClose() {
      this.showCloseOrder = false;
    },
    confirmClose() {
      if (!this.curSelectCloseReason) {
        this.$message.warning('请选择关闭理由');
        return;
      }
      this.showCloseOrder = false;
      this.loading = true;
      service.closeOrder(
        {
          orderId: this.itemId,
          shopId: window.top.SHOP_ID || '',
          reason: this.curSelectCloseReason,
          memo: this.closeDeccription
        },
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    onChangeDateType(val) {
      switch (val) {
        case '今日订单':
          this.filters[5].value = [dateTime.today(), dateTime.today()];
          break;
        case '近一周订单':
          this.filters[5].value = [dateTime.getBeforeWeek(), dateTime.today()];
          break;
        case '近一月订单':
          this.filters[5].value = [dateTime.getPreOneMonthDay(), dateTime.today()];
          break;
        case '近三月订单':
          this.filters[5].value = [dateTime.getPreThreeMonthDay(), dateTime.today()];
          break;
        default:
          this.filters[5].value = [];
          break;
      }
      this.getList();
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
        case '17':
          return '优惠券订单';
        default:
          return '';
      }
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '4'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
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
      //  + ' ' +
      // (hour < 10 ? '0' + hour : hour) +
      // ':' +
      // (min < 10 ? '0' + min : min) +
      // ':' +
      // (sec < 10 ? '0' + sec : sec);

      return newTime;
    },
    listAdminByRole() {
      let roleTypes = '';
      if (this.$route.params.orderType === 'car') {
        roleTypes = ['salesman'];
      } else {
        roleTypes = ['afterSale', 'reception', 'testDriver'];
      }
      service.listAdminByRole(
        { roleTypes: roleTypes },
        data => {
          this.loading = false;
          this.filters[1].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    cancle(index) {
      let length = document.querySelectorAll('.el-popover').length - 1;
      document.querySelectorAll('.el-popover')[length].style.display = 'none';
    },
    setOrderItems(val) {
      this.tabName = 'info';
      this.$refs.baseInfo.setOrderItems(val);
    },
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    certificate(row) {
      window.dType = row.dType;
      service.certificate(
        {
          orderId: row.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          if (row.orderType === '6') {
            this.showOrderCertificate = true;
            this.title = this.getUser().shop ? this.getUser().shop.name + '预约置换单' : '预约置换单';
            this.form = data.order;
          } else if (row.orderType === '7') {
            this.showOrderCertificate = true;
            this.title = this.getUser().shop ? this.getUser().shop.name + '贷款购车单' : '贷款购车单';
            this.form = data.order;
          } else if (row.orderType === '8') {
            this.showOrderCertificate = true;
            this.title = this.getUser().shop ? this.getUser().shop.name + '预约体验单' : '预约体验单';
            this.form = data.order;
          } else {
            this.dialogTableVisible = true;
            this.title = this.getUser().shop ? this.getUser().shop.name + '结算单' : '结算单';
            this.form = data.order;
            this.realName = data.adminCurrent ? data.adminCurrent.realName : '';
            this.userCard = data.userCard;
            this.gridData = data.order.orderItems;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    setting() {
      this.$refs.settingInfo.getList();
      this.openSetting = true;
    },
    queryOrderKpi() {
      service.queryOrderKpi(
        {
          type: this.orderType,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          if (data.data.dayNewAdd) {
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: `今日新增${data.data.dayNewAdd}条，待确认${data.data.dayUnconfirmed}条，待执行${data.data.dayConfirmed}条`,
              duration: 3000
            });
          } else {
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: `今日新增${0}条，待确认${0}条，待执行${0}条`,
              duration: 3000
            });
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    memberClick(row) {
      this.$refs.memberInfo.operations = [];
      this.$refs.carInfo.operations = [];
      this.$refs.carInfo.ishandler = false;
      this.memberId = { id: row.member.id };
      this.memberInfo = true;
    },
    async export() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        orderId: this.$route.query.orderId || '',
        orderType: this.orderType || '',
        shopId: this.filters[0].value || window.top.SHOP_ID || '',
        consultantId: this.filters[1].value || '',
        state: this.filters[2].value || '',
        invoiceState: this.filters[3].value || '',
        dateType: this.filters[4].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[5].value[0] ? this.filters[5].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[5].value[1] ? this.filters[5].value[1] + ' ' + '23:59:59' : ''
      };
      try {
        let response = await axios.post('/admin/order/export.jhtml', params, {
          responseType: 'blob'
        });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    add() {
      window.dType = 'order';
      this.isEdit = true;
      if (
        this.$route.params.orderType === 'loan' ||
        this.$route.params.orderType === 'replace' ||
        this.$route.params.orderType === 'ride'
      ) {
        this.tabName = 'info';
        // this.$refs.baseInfo.$refs.form.resetFields();
        this.$refs.baseInfo.queryBrandList();
        this.$refs.baseInfo.getFinancialPlans();
      } else {
        this.tabName = 'productinfo';
        this.$refs.productinfo.tableData = [];
        this.$refs.baseInfo.orderItems = [];
        this.$refs.productinfo.form.products = '';
        this.$refs.productinfo.subTotal = '';
      }
      this.$refs.baseInfo.resetFormData();
      this.itemId = '';
      this.activeNames = ['1'];
      this.$refs.baseInfo.selectedTags = [];
      this.$refs.baseInfo.imageList = [];
      this.$refs.baseInfo.orderOptions();
      this.open = true;
      this.handler = '';

      if (this.$route.params.orderType === 'service') {
        this.$refs.baseInfo.getStoreTags();
      }
    },
    rowClick(model, e, column) {
      window.dType = model.dType;
      this.tabName = 'info';
      this.orderState = model.type;
      this.itemId = model.id;
      this.userId = model.member.id;
      this.invoiceInfoId = model.invoiceInfoId;
      this.invoiceId = model.invoiceId;
      this.activeNames = ['1'];
      this.open = true;
      this.handler = '';
      this.invoiceState = model.invoiceState;
      this.price = model.amount;
      this.paymentMethodName = model.paymentMethodName;
      this.isEdit = false;
      // if ((model.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || model.isValid === '0') {
      //   this.isEdit = false;
      // } else {
      // this.isEdit = true;
      // if (this.hasAuthEdit) {
      //   this.isEdit = true;
      // } else {
      //   this.isEdit = false;
      // }
      // }
    },
    getList() {
      this.loading = true;
      let params = {
        orderId: this.$route.query.id || '',
        shopId: this.filters[0].value || window.top.SHOP_ID || '',
        dateType: this.filters[4].value,
        searchValue: this.filters[6].value,
        orderType: '21',
        consultantId: this.filters[1].value || '',
        state: this.filters[2].value,
        invoiceState: this.filters[3].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[5].value[0] ? this.filters[5].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[5].value[1] ? this.filters[5].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.listOrder(
        params,
        data => {
          this.loading = false;
          this.tableData = data.content;
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].orderItems[1] &&
              this.tableData[i].orderItems[1].fullName === this.tableData[i].orderItems[0].fullName
            ) {
              this.tableData[i].orderItems[0].quantity = this.tableData[i].orderItems.length;
              this.tableData[i].orderItems = [this.tableData[i].orderItems[0]];
            }
          }
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    service(row) {
      this.orderState = row.type;
      window.dType = row.dType;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['5'];
      this.handler = 'service';
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      this.open = true;
    },
    serviceHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'productinfo';
      this.itemId = row.id;
      this.activeNames = ['5'];
      this.handler = 'service';
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      this.open = true;
    },
    shippingHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['5'];
      this.handler = 'shipping';
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      this.open = true;
    },
    paymentHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['4'];
      this.handler = 'payment';
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      this.open = true;
    },
    refundsHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.itemId = row.id;
      this.tabName = 'afterprocess';
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      this.open = true;
      this.$refs.afterprocess.initData();
    },
    invoiceHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.open = true;
      this.tabName = 'invoice';
      this.itemId = row.id;
      this.userId = row.member.id;
      this.invoiceInfoId = row.invoiceInfoId;
      this.invoiceId = row.invoiceId;
      this.price = row.amount;
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      // this.activeNames = ['2'];
      // this.handler = 'service';
    },
    excuteHandler(row) {
      // service.excuteOrder(
      //   {
      //     id: row.id,
      //     shopId: window.top.SHOP_ID || ''
      //   },
      //   data => {
      //     this.loading = false;
      //     this.$message.success('操作成功');
      //     this.getList();
      //   },
      //   // result_code 不是100的处理
      //   ErrorData => {
      //     this.loading = false;
      //     this.$message.warning(ErrorData.errorMessage);
      //   }
      // );
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['5'];
      this.handler = 'service';
      if ((row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || row.isValid === '0') {
        this.isEdit = false;
      } else {
        // this.isEdit = true;
        if (this.hasAuthEdit) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      this.open = true;
    },
    confirmOrder(row) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.dType = row.dType;
        service.confirmOrder(
          {
            orderId: row.id,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.getList();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    closeOrder(row) {
      this.itemId = row.id;
      window.dType = row.dType;
      this.showCloseOrder = true;
      this.curSelectCloseReason = '';
      this.closeDeccription = '';
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    getOrderStatus(row) {
      switch (row.type) {
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
    },
    getInvoiceStatus(row) {
      switch (row.invoiceState) {
        case '5':
          return '已开票';
        case '4':
          return '已撤销';
        case '3':
          return '已签收';
        case '2':
          return '已邮寄';
        case '1':
          return '待邮寄';
        case '0':
          return '待开票';
        default:
          return '未申请';
      }
    },
    orderConfirm(row) {
      service.orderConfirm(
        {
          orderId: row.order.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.$message.success('操作成功');
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    messagePendingDeal(row) {
      let ids = [];
      ids.push(row.messageId);
      this.loading = true;
      this.$confirm('是否确认处理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          service.messagePendingDeal(
            { ids: ids },
            data => {
              this.$message.success('操作成功');
              this.loading = false;
              this.getList();
            },
            // result_code 不是100的处理
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
            }
          );
        },
        () => {
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.grid18 {
  height: 20px;
}
.close-order-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 260px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.d-p-wrap {
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
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
}
.order-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
}
.financial-order-list {
  .biz-popup .popup-content {
    width: 600px;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    width: 25%;
    margin-left: 0px;
    margin: 5px 0px;
    .filter-label {
      width: 60px;
      text-align: right;
    }
    .el-select {
      width: 100%;
    }
    .biz-date-range {
      width: 200px;
    }
  }
  .operate-container {
    margin-left: 10px;
  }
  .row {
    padding: 10px 0px;
  }
  .row-top {
    padding: 10px 0px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-date-editor {
    width: 210px;
  }
  .product-info {
    min-height: 48px;
    margin: 5px 0px;
    width: 100%;
    img {
      float: left;
      width: 48px;
      height: 48px;
    }
    .wrapper {
      margin-left: 56px;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
      }
    }
  }
  .info-bottom {
    display: flex;
    justify-content: space-between;
  }
  .price-info {
    width: 120px;
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
      .titleMember {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
</style>
