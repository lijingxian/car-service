<template>
  <div class="order-mgmt-list-p">
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
      @select="select"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="order-mgmt-tabel"
      :isMergeInvoice="true"
    >
      <div slot="operation" class="operate-container">
        <el-radio-group v-model="curSelectDateType" @change="onChangeDateType" size="mini">
          <el-radio-button v-for="item in dateTypeList" :label="item" :key="item">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table-column label="订单信息" min-width="215px">
        <template slot-scope="scope">
          <div class="order-content">
            <div style="display:flex">
              <div class="customer-info">{{scope.row.sn}}</div>
              <i class="iconfont biz-icon-i-web-md" style="font-size:32px;color:#ff7300"
                v-if="scope.row.dType==='purchaseOrder'"></i>
              <i class="iconfont biz-icon-i-web-bing" style="font-size:30px;color:#ff7300" v-if="scope.row.isMerged ==='1'"></i>
              <i class="iconfont biz-icon-i-web-zhuan" style="font-size:30px;color:rgb(135, 208, 104)"
                v-if="scope.row.isTransfered ==='1'"></i>
            </div>
            <div>创建日期：{{scope.row.orderTime}}</div>
            <div>状态：
              <span :style="{color: stateColor(scope.row)}">{{getOrderStatus(scope.row)}}</span></div>
            <div class="shop-over">所属店铺：{{scope.row.shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="代理商" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.agent?scope.row.agent.name:'--'}}
            </div>
            <div class="overflow">
              创建人：{{scope.row.operatorName?scope.row.operatorName:'--'}}
            </div>
            <div class="overflow">
              电话：{{scope.row.member.mobile?scope.row.member.mobile:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="100px" prop="amount">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              不含税：{{scope.row.amountWithoutTax?scope.row.amountWithoutTax:'--'}}
            </div>
            <div class="overflow">
              税额：{{scope.row.tax?scope.row.tax:'--'}}
            </div>
            <div class="overflow">
              含税：{{scope.row.amount?scope.row.amount:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="220px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.orderItems.length>0?[scope.row.orderItems[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                    <div>{{orderItem.product?orderItem.product.barCode:''}}</div>
                    <div class="overflow">单价(不含税)：{{orderItem.priceWithoutTax?orderItem.priceWithoutTax:'--'}}</div>
                    <div>单价(含税)：{{orderItem.price?orderItem.price:'--'}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.orderItems.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="80">
        <template #default="scope">
          <biz-column-operation :row="scope.row" v-if="(scope.row.unionConfig.editable === '1' || getUser().roleLevel !== 'shop') && scope.row.isValid === '1'">
            <el-button type="text" size="mini" v-if="scope.row.type==='9' && scope.row.hasSyncOrder === '0'" @click.stop="refundsHandler(scope.row)">退款</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.type==='2'&&(orderType==='ride'||orderType==='replace'||orderType==='loan') && scope.row.hasSyncOrder === '0'"
              @click.stop="service(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(orderType==='service'||orderType==='rescue')&&((scope.row.type==='2'&&scope.row.shippingWay==='1')||(scope.row.type==='2'&&scope.row.shippingWay==='2')) && scope.row.hasSyncOrder === '0'"
              @click.stop="serviceHandler(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.type==='2'&&scope.row.shippingWay==='2'&&(orderType==='car'||orderType==='product'||orderType==='general'||scope.row.dType==='purchaseOrder') && scope.row.hasSyncOrder === '0'"
              @click.stop="excuteHandler(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(orderType==='service'||orderType==='rescue')&&scope.row.type==='3'&&scope.row.shippingWay==='0' && scope.row.hasSyncOrder === '0'"
              @click.stop="excuteHandler(scope.row)"
            >服务</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="((scope.row.type==='3'&&scope.row.shippingWay==='0')||(scope.row.type==='2'&&scope.row.shippingWay==='1'))&&(orderType==='car'||orderType==='product'||orderType==='general'||scope.row.dType==='purchaseOrder') && scope.row.hasSyncOrder === '0' && orderType !== 'service'"
              @click.stop="shippingHandler(scope.row)"
            >发货</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="((scope.row.type==='11'&&scope.row.shippingWay==='1')||(scope.row.type==='12'&&scope.row.shippingWay==='1')) && scope.row.hasSyncOrder === '0'"
              @click.stop="paymentHandler(scope.row)"
            >付款</el-button>
            <el-button type="text" size="mini" v-if="scope.row.type==='2'||scope.row.type==='1'" @click.stop="closeOrder(scope.row)">关闭</el-button>
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)">凭证</el-button>
            <el-button type="text" size="mini" v-if="scope.row.type!=='6'&&!scope.row.invoiceId" @click.stop="invoiceHandler(scope.row)">补开发票</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.type==='1'&&((scope.row.auditState==='1'&& scope.row.audit==='1') || (scope.row.auditState==='2'&& scope.row.audit==='1'))"
              @click.stop="toPass(scope.row)"
            >审核</el-button>
            <!-- <el-button type="text" size="mini" v-if="scope.row.isMerged==='0' && scope.row.type==='2'"
              @click.stop="mergeOrder(scope.row)">合并订单</el-button>
            <el-button type="text" size="mini" v-if="scope.row.isTransfered==='0'" @click.stop="returnOrder(scope.row)">转采购
            </el-button>-->
          </biz-column-operation>
        </template>
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
      <el-tab-pane label="订单进度" name="loginfo" v-if="itemId">
        <order-logs :itemId="itemId" :isEdit="isEdit" ref="loginfo" :paymentMethodName="paymentMethodName" @logistics="logistics"></order-logs>
      </el-tab-pane>
      <el-tab-pane label="售后进度" name="afterprocess" v-if="itemId">
        <after-process :itemId="itemId" :isEdit="isEdit" ref="afterprocess" @operationSuccess="operationSuccess"></after-process>
      </el-tab-pane>
      <el-tab-pane label="服务记录" name="orderhistory" v-if="itemId">
        <order-history :itemId="itemId" :isEdit="isEdit" ref="orderhistory" @operationSuccess="operationSuccess"></order-history>
      </el-tab-pane>
      <el-tab-pane label="发票" name="invoice" v-if="itemId&&orderState!=='6'">
        <invoice-info
          :itemId="itemId"
          :invoiceInfoId="invoiceInfoId"
          :invoiceId="invoiceId"
          :price="price"
          :open="open"
          :userId="userId"
          :isEdit="isEdit"
          ref="invoice"
          @operationSuccess="operationSuccess"
        ></invoice-info>
      </el-tab-pane>
      <el-tab-pane label="子订单信息" name="orderChild" v-if="mergeState==='1'">
        <order-child-info
          :itemId="itemId"
          :invoiceInfoId="invoiceInfoId"
          :invoiceId="invoiceId"
          :price="price"
          :open="open"
          :userId="userId"
          :isEdit="isEdit"
          ref="orderChild"
          @operationSuccess="operationSuccess"
        ></order-child-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openInvocie" @close="openInvocie=false" v-model="tabName">
      <el-tab-pane label="发票" name="invoice">
        <invoice-info
          :itemId="itemId"
          :invoiceInfoId="invoiceInfoId"
          :invoiceId="invoiceId"
          :price="price"
          :open="openInvocie"
          :userId="userId"
          :isEdit="isEdit"
          :orderIds="orderIds"
          ref="invoice"
          @operationSuccess="operationSuccess"
        ></invoice-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openSetting" @close="openSetting=false" v-model="settingName">
      <el-tab-pane label="设置" name="setting">
        <rescue-setting ref="settingInfo" @operationSuccess="operationSuccess"></rescue-setting>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="memberInfo" @close="memberInfo=false" v-model="memberName">
      <el-tab-pane label="基本信息" name="memberInfo">
        <membership-mgmt-base-info :itemId="memberId" @operationSuccess="operationSuccess" ref="memberInfo"></membership-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="车辆信息" name="carInfo">
        <membership-mgmt-vehicle-info :itemId="memberId" ref="carInfo"></membership-mgmt-vehicle-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog :visible.sync="showPassOrder" center append-to-body custom-class="close-order-dialog" title="审核" v-loading="loading">
      <div>
        <div class="reson-container">
          <span>审核结果：</span>
          <el-radio v-model="auditState" label="1" size="mini">通过</el-radio>
          <el-radio v-model="auditState" label="2" size="mini">驳回</el-radio>
          <div style="padding: 5px 0px;margin-top:15px;" v-show="auditState==='2'">
            <span>驳回理由：</span>
            <el-select v-model="curSelectAjectReason" placeholder="请选择驳回理由" class="order-select" size="mini">
              <el-option v-for="reason in reasonAjectList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
            </el-select>
          </div>
          <el-input v-model="remarks" type="textarea" style="margin-top:15px;"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showPassOrder=false" size="mini" type="primary">取消</el-button>
        <el-button @click="statusChange(row,auditState)" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body custom-class="orderDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="printExport" size="mini">导出</el-button>
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
              <div class="grid-content bg-purple">结算时间：{{form.orderTime}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">代理商：{{form.agentName}}</div>
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
          <el-row :gutter="10" v-if="userCard.sn" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">会员卡号：{{userCard.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">会员卡余额：{{userCard.balance}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.sn" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">赠送V豆：{{form.giftBean}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">赠送积分：{{form.point}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.bean" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">V豆总和：{{userCard.bean}}</div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">积分总和：{{userCard.point}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple" v-if="userCard.sn">抵扣V豆：{{form.bean}}</div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="fullName" label="商品名">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.fullName}}</template>
            </el-table-column>
            <el-table-column property="barCode" label="条码">
              <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
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
            <!-- <el-col :span="5">
              <div class="grid-content bg-purple">V豆抵扣：￥{{form.beanDiscount}}</div>
            </el-col>-->
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
    <biz-dialog-selector
      title="合并订单"
      :visibility.sync="showMergeOrder"
      :tableData="orderList"
      :pagination="dialogPagination"
      :selectionKeys="selectedOrderIds"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="product-info-dailog"
      @confirmed="confirmedMergeOrder"
      @selectionChange="selectionChange"
    >
      <el-table-column label="订单信息" prop="sn" min-width="185px"></el-table-column>
      <el-table-column label="商品信息" min-width="200px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%;margin-right:30px">
              <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id" class="product-info">
                <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
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
    </biz-dialog-selector>
    <el-dialog :visible.sync="showOrderContactor" center append-to-body custom-class="order-contactor-dialog" title="合并订单" v-loading="loading">
      <div>
        <div v-if="contactorList.length>0">
          <div>确认联系人信息，如有多个请选择。</div>
          <el-card v-for="contactor in contactorList" :key="contactor.id">
            <div>
              <div class="radio-i">
                <el-radio v-model="contactor.isChecked" label="1" size="mini" @change="selectChange(contactor)">
                  <span style="color:#ffffff">.</span>
                </el-radio>
                <div class="receiver-info">
                  <span>{{contactor.consignee?contactor.consignee:''}}</span>
                  <span style="margin-left:15px">{{contactor.phone?contactor.phone:''}}</span>
                  <p>{{contactor.areaName + contactor.address}}</p>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <div v-if="invoiceList.length>0">
            确认发票信息，如有多个请选择。
            <el-card v-for="invoice in invoiceList" :key="invoice.id">
              <div>
                <div class="radio-i">
                  <el-radio v-model="invoice.isChecked" label="1" size="mini" @change="selectChangeByInvoice(invoice)">
                    <span style="color:#ffffff">.</span>
                  </el-radio>
                  <div>
                    <div class="default">
                      <span>发票抬头：</span>
                      <span>{{invoice.invoiceTitle}}</span>
                    </div>
                    <div style="padding-top:10px">
                      <span>发票类型：</span>
                      <span>{{invoice.invoiceType==='0'?'个人':invoice.invoiceType==='1'?'增值税普通发票':invoice.invoiceType==='2'?'增值税专用发票':''}}</span>
                    </div>
                    <div style="padding:10px 0px">
                      <span>联系人：</span>
                      <span>{{invoice.contacts}}</span>
                    </div>
                    <div>
                      <span>联系电话：</span>
                      <span>{{invoice.mobile}}</span>
                    </div>
                    <div class="content-d" style="padding: 10px 0px;">
                      <span>详细地址：</span>
                      <span>{{invoice.area?invoice.area.fullName + invoice.address:invoice.address}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showOrderContactor=false" size="mini" type="primary">取消</el-button>
        <el-button @click="confirmMerge" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showReturnPurchase" center append-to-body custom-class="return-purchase-dialog" title="提交采购订单" v-loading="loading">
      <div class="order-confirm">
        <div class="order-confirm-content">
          <div v-if="returnOrderList.length>0">
            <div class="order-address" @click="clickAdress" v-if="showAddress">
              <div class="left">
                <div class="address">
                  <div class="receiver-address">
                    <span>{{getAddress?getAddress.consignee:''}}</span>
                    <span>{{getAddress?getAddress.phone:''}}</span>
                  </div>
                  <div class="icon">
                    <span>
                      <i class="el-icon-location-outline"></i>
                      {{getAddress?(getAddress.areaName+getAddress.address):'请设置收货地址'}}
                    </span>
                    <span>
                      <i class="right-arrow iconfont biz-icon-i-web-zk1"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <i class="right-arrow iconfont icon-i-sh-man-tz"></i>
              </div>
            </div>
            <div v-for="(returnList,index) in returnOrderList" :key="index" style="box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);padding: 20px;margin-bottom: 10px;">
              <div class="order-goods">
                <div class="shop-name">
                  <img :src="iconShop" />
                  <span style="fontSize:14px">{{getUser().shop.name}}</span>
                </div>
                <div v-for="(item,index) of returnList.cartItems" :key="index">
                  <el-checkbox v-model="item.isSelected" :min="1" true-label="1" false-label="0" size="mini" @change="selectReturnOrder(returnList)">
                    <span style="color:#ffffff">.</span>
                  </el-checkbox>
                  <div class="order-goods-div">
                    <div class="img-div">
                      <img v-if="item.product.image&&item.product.image!==' '" :src="item.product.image" :onerror="errorImg" />
                    </div>
                    <div class="goods-info">
                      <span class="name">{{item.product.fullName}}</span>
                      <div class="money-info">
                        <span class="count-money">￥{{item.product.price}}</span>
                        <el-input-number :min="1" v-model="item.quantity" size="mini" class="count-num">X{{item.quantity}}</el-input-number>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-info">
                <div class="select-tyle">
                  <span>支付方式</span>
                  <el-select v-model="returnList.paymentMethodId" @change="paymentChange(returnList.paymentMethodId,index)" size="mini">
                    <el-option v-for="payOption in payOptions" :key="payOption.id" :label="payOption.name" :value="payOption.id"></el-option>
                  </el-select>
                </div>
                <div class="select-tyle">
                  <span>配送方式</span>
                  <el-select v-model="returnList.shippingMethodId" @change="inputChange(returnList.shippingMethodId,index)" size="mini">
                    <el-option v-for="optionItem in options" :key="optionItem.id" :label="optionItem.name" :value="optionItem.id"></el-option>
                  </el-select>
                </div>
                <div class="buy-leave-mes">
                  <span>买家留言</span>
                  <el-input type="textarea" size="mini" placeholder="选填：填写内容已和卖家协商确认" v-model="returnList.memo"></el-input>
                </div>
              </div>
            </div>
            <div class="order-info">
              <div class="order-dispatch">
                <span style="display:flex;align-items:center;">
                  <el-checkbox v-model="invoiceChecked" @change="invoiceChange" />
                  <span class="label">发票信息</span>
                </span>
                <div class="invoice-info" @click="clickInvoiceInfo">
                  <span class="invoice-title" style="font-size:14px" v-if="invoiceChecked">{{getInvoice?getInvoice.invoiceTitle:'暂无发票'}}</span>
                  <span class="invoice-title" style="font-size:14px" v-if="!invoiceChecked">{{'不开具发票'}}</span>
                  <i class="right-arrow iconfont biz-icon-i-web-zk1"></i>
                </div>
              </div>
            </div>
            <div class="order-count-div">
              <div class="order-count">
                <span class="pro-count">产品总额</span>
                <span>￥{{getCountMouny}}</span>
              </div>
              <div class="order-count">
                <span class="pro-count">运费</span>
                <span>+￥{{ getFreight }}</span>
              </div>
              <div class="order-count">
                <span class="pro-count" style="color:#333;">合计</span>
                <span class="count-money">￥{{getAmount?getAmount:getAmount.toFixed(2)}}</span>
              </div>
            </div>
          </div>
          <div v-if="productGroupWithNoSupplier.length>0">
            <div>以下商品无供应商，暂不支持提交采购订单</div>
            <div v-for="(noSupplier,index) of productGroupWithNoSupplier" :key="index">
              <div v-for="(item,index) of noSupplier.cartItems" :key="index">
                <div class="order-goods-div">
                  <div class="img-div">
                    <img v-if="item.product.image&&item.product.image!==' '" :src="item.product.image" :onerror="errorImg" />
                  </div>
                  <div class="goods-info">
                    <span class="name">{{item.product.fullName}}</span>
                    <div class="money-info">
                      <span class="count-money">￥{{item.product.price}}</span>
                      <span class="count-num">X{{item.quantity}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="foot" slot="bottom">
            <el-button class="submit" type="primary" @click="submit" :disabled="returnOrderList.length===0">提交订单</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisiable" append-to-body custom-class="bill-dialog">
      <bill-info @selectedItem="selectedItem"></bill-info>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisiableInvoice" append-to-body custom-class="bill-dialog">
      <return-invoice-info @selectedInvoice="selectedInvoice"></return-invoice-info>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BizDialogSelector from '@/components/BizDialogSelector';
import service from '@/service/order-mgmt/orderMgmt';
import BaseInfo from './OrderMgmt/BaseInfo';
import ProductInfo from './OrderMgmt/ProductInfo';
import OrderLogs from './OrderMgmt/OrderLogs';
import AfterProcess from './OrderMgmt/AfterProcess';
import OrderHistory from './OrderMgmt/OrderHistory';
import InvoiceInfo from './OrderMgmt/InvoiceInfo';
import RescueSetting from './OrderMgmt/RescueSetting';
import OrderChildInfo from './OrderMgmt/OrderChildInfo';
import BillInfo from './OrderMgmt/components/BillInfo';
import ReturnInvoiceInfo from './OrderMgmt/components/InvoiceInfo';
import iconShop from '@/assets/images/store.png';
import MembershipMgmtBaseInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import http from '@/common/http';
import axios from 'axios';
import { mapGetters } from 'vuex';
import urls, { global, membershipMgmt } from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';
import dateTime from '@/utils/dateTime';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'OrderMgmtList',
  data() {
    return {
      iconShop: iconShop,
      iframeSrc: '',
      showIframe: false,
      openInvocie: false,
      auditState: '1',
      remarks: '',
      row: {},
      taskId: '',
      t: '',
      percentage: 0,
      curSelectAjectReason: '申报的商品与实际需要采购的商品不符',
      reasonAjectList: [
        {
          label: '申报的商品与实际需要采购的商品不符',
          value: '申报的商品与实际需要采购的商品不符'
        },
        {
          label: '送达仓库地址填写错误',
          value: '送达仓库地址填写错误'
        },
        {
          label: '申报的商品供应方已停售或缺货',
          value: '申报的商品供应方已停售或缺货'
        },
        {
          label: '申报的商品数量有误',
          value: '申报的商品数量有误'
        },
        {
          label: '已与部分商品供应商终止合作',
          value: '已与部分商品供应商终止合作'
        },
        {
          label: '其他原因',
          value: '其他原因'
        }
      ],
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
      errorImg: 'this.src="' + require('../../../../assets/images/commodity/pic_default_fail.png') + '"',
      showCloseOrder: false,
      showPassOrder: false,
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
      orderIds: [],
      isEdit: true,
      form: {},
      userCard: {},
      paymentMethodName: '',
      paymentMethodId: '',
      orderType: '',
      orderState: '',
      mergeState: '',
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
      orderList: [],
      showMergeOrder: false,
      selectedOrderIds: [],
      selectionList: [],
      mergeOrderId: '',
      showOrderContactor: false,
      contactorList: [],
      invoiceList: [],
      isChecked: '1',
      returnOrderId: '',
      returnOrderList: [],
      showReturnPurchase: false,
      dialogVisiable: false,
      showAddress: true,
      payType: '',
      payOptions: [],
      type: '',
      shippingMethodId: '',
      options: [],
      invoiceChecked: false,
      dialogVisiableInvoice: false,
      receiverId: '',
      receivers: [],
      freight: 0,
      getAddress: {},
      leaveMessage: '',
      productGroupWithNoSupplier: [],
      selectionProduct: [],
      isSelected: '1',
      supplierId: '',
      getInvoice: {},
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          class: 'hidden'
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        },
        {
          label: '合并开票',
          name: 'mergeInvioce',
          type: '',
          disabled: true
        }
      ],
      filters: [
        {
          type: 'select',
          label: '代理商',
          name: 'shop',
          value: [],
          class: 'hidden',
          filterable: true,
          multiple: true,
          collapseTags: true,
          options: [
            {
              value: '',
              label: '全部'
            }
          ]
        },
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
            { value: '9', label: '退款退货中' },
            { value: '11', label: '已确认收货' },
            { value: '12', label: '部分支付' },
            { value: '13', label: '部分发货' }
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
          placeholder: '请输入订单编号/商品条码/商品名称',
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
      },
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    ProductInfo,
    OrderLogs,
    AfterProcess,
    InvoiceInfo,
    RescueSetting,
    OrderHistory,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo,
    vueEasyPrint,
    BizDialogSelector,
    OrderChildInfo,
    BillInfo,
    ReturnInvoiceInfo,
    ExportFileNew
  },
  created() {
    this.orderType = this.$route.params.orderType || '';
    this.getList();
    this.queryOrderKpi();
    this.getEditableStoresByAgent();
    this.listAdminByRole();
    this.getEditableStores();
    this.queryShopList();
  },
  watch: {
    $route(to, from) {
      Object.assign(this.$data, this.$options.data());
      this.orderType = this.$route.params.orderType || '';
      this.getList();
      this.queryOrderKpi();
      this.listAdminByRole();
      this.getEditableStores();
      this.queryShopList();
    }
  },
  mixins: [ColumnsMixin],
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  computed: {
    // 是否显示发票列
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    },
    getAmount() {
      let amount = 0;
      amount = Number(Number(this.getCountMouny) + Number(this.getFreight)).toFixed(2);
      return amount >= 0 ? amount : 0;
    },
    getFreight() {
      let freight;
      for (const item of this.returnOrderList) {
        if (item.type === '顺丰速递') {
          freight = 20.0;
        } else {
          freight = 0;
        }
      }
      return freight;
    },
    getCountMouny() {
      let count = 0;
      for (const item of this.returnOrderList) {
        let ary = item.cartItems;
        let len = ary.length;
        for (let i = 0; i < len; i++) {
          if (ary[i].isSelected === '1') {
            count += ary[i].product.price * ary[i].quantity;
          }
        }
      }
      return parseFloat(count).toFixed(2);
    }
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    toPass(row, state) {
      this.remarks = '';
      this.row = row;
      this.showPassOrder = true;
    },
    statusChange(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          shopId: window.top.SHOP_ID || '',
          id: model.id,
          actionType: state,
          details: state === '2' ? this.curSelectAjectReason : '',
          remarks: this.remarks
        };
        http
          .post('/admin/purchaseOrderManage/audit.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.refresh();
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
        this.filters[5].class = 'hidden';
        this.filters[6].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
        this.filters[5].class = 'show';
        this.filters[6].class = 'show';
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
      this.open = false;
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
          this.$set(this.filters[1], 'options', arr);
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
          this.filters[6].value = [dateTime.today(), dateTime.today()];
          break;
        case '近一周订单':
          this.filters[6].value = [dateTime.getBeforeWeek(), dateTime.today()];
          break;
        case '近一月订单':
          this.filters[6].value = [dateTime.getPreOneMonthDay(), dateTime.today()];
          break;
        case '近三月订单':
          this.filters[6].value = [dateTime.getPreThreeMonthDay(), dateTime.today()];
          break;
        default:
          this.filters[6].value = [];
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
    getEditableStoresByAgent() {
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', {
          cooperationType: '1',
          pageSize: 1000,
          pageNumber: 1
        })
        .then(data => {
          this.filters[0].options = [{ value: '', label: '全部' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
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
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
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
    async printExport() {
      let params = {
        orderId: this.orderId
      };
      try {
        let response = await axios.post('/admin/purchaseOrder/voucher/export/settlement.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
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
    certificate(row) {
      window.dType = row.dType;
      service.certificate(
        {
          orderId: row.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '结算单' : '结算单';
          this.form = data.order;
          this.orderId = row.id;
          this.form.agentName = row.agent.name;
          this.realName = data.adminCurrent ? data.adminCurrent.realName : '';
          this.userCard = data.userCard;
          this.gridData = data.order.orderItems;
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
      http
        .get('/admin/purchaseOrderManage/kpi.jhtml', {
          shopId: window.top.SHOP_ID || '',
          type: '3'
        })
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待审核${data.data.dayUnconfirmed}条，待发货${data.data.dayConfirmed}条`,
            duration: 3000
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    memberClick(row) {
      this.$refs.memberInfo.operations = [];
      this.$refs.carInfo.operations = [];
      this.$refs.carInfo.ishandler = false;
      this.memberId = { id: row.member.id };
      this.memberInfo = true;
    },
    exportStart() {
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
        agentIds: this.filters[0].value,
        shopId: this.filters[1].value || window.top.SHOP_ID || '',
        consultantId: this.filters[2].value || '',
        state: this.filters[3].value || '',
        invoiceState: this.filters[4].value || '',
        dateType: this.filters[5].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[6].value[0] ? this.filters[6].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[6].value[1] ? this.filters[6].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/purchaseOrderManage/agentSalesOrders/exportStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      try {
        let response = await axios.get('/admin/purchaseOrderManage/agentSalesOrders/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    add() {
      window.dType = 'order';
      this.isEdit = true;
      this.tabName = 'productinfo';
      this.$refs.productinfo.tableData = [];
      this.$refs.baseInfo.orderItems = [];
      this.$refs.productinfo.form.products = '';
      this.$refs.productinfo.subTotal = '';
      this.$refs.baseInfo.resetFormData();
      this.itemId = '';
      this.activeNames = ['1', '2', '4', '5'];
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
      this.mergeState = model.isMerged;
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
      if ((model.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') || model.isValid === '0') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
    },
    getList() {
      this.loading = true;
      let params = {
        orderId: this.$route.query.id || '',
        agentIds: this.filters[0].value,
        shopId: this.filters[1].value || window.top.SHOP_ID || '',
        dateType: this.filters[5].value,
        searchValue: this.filters[7].value,
        orderType: this.orderType,
        consultantId: this.filters[2].value || '',
        state: this.filters[3].value,
        invoiceState: this.filters[4].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[6].value[0] ? this.filters[6].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[6].value[1] ? this.filters[6].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .post('/admin/purchaseOrderManage/agentSalesOrders.jhtml', params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
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
        })
        .catch(errData => {
          console.log(errData);
          this.loading = false;
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    service(row) {
      this.orderState = row.type;
      window.dType = row.dType;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['2'];
      this.handler = 'service';
      this.open = true;
    },
    serviceHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'productinfo';
      this.itemId = row.id;
      this.activeNames = ['2'];
      this.handler = 'service';
      this.open = true;
    },
    shippingHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['5'];
      this.handler = 'shipping';
      this.open = true;
    },
    paymentHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['4'];
      this.handler = 'payment';
      this.open = true;
    },
    refundsHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.itemId = row.id;
      this.tabName = 'afterprocess';
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
      // this.activeNames = ['2'];
      // this.handler = 'service';
    },
    mergeInvioce() {
      window.dType = 'purchaseOrder';
      this.itemId = this.selections[0].id;
      this.invoiceInfoId = this.selections[0].invoiceInfoId;
      this.invoiceId = this.selections[0].invoiceId;
      this.userId = this.selections[0].member.id;
      this.orderState = '1';
      this.openInvocie = true;
      this.tabName = 'invoice';
      this.orderIds = [];
      this.price = 0;
      this.selections.forEach(element => {
        this.orderIds.push(element.id);
        this.price = Number(element.amount) + Number(this.price);
      });
      this.price = this.price.toFixed(2);
    },
    // 合并订单
    mergeOrder(row) {
      this.mergeOrderId = row.id;
      this.orderList = [];
      this.dialogPagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.selectedOrderIds.splice(0, this.selectedOrderIds.length);
      this.getOrderList();
      this.showMergeOrder = true;
    },
    getOrderList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        orderId: this.mergeOrderId
      };
      http
        .get('/admin/purchaseOrderManage/storeSalesOrders/mergeList.jhtml', params)
        .then(data => {
          this.orderList = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getMergeinfo() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        orderId: this.mergeOrderId,
        ids: this.selectedOrderIds
      };
      http
        .post('/admin/purchaseOrderManage/storeSalesOrders/mergeinfo.jhtml', params)
        .then(data => {
          this.contactorList = data.receivers;
          this.invoiceList = data.invoices;
          this.invoiceList.map(item => {
            this.$set(item, 'isChecked', '0');
          });
          this.contactorList.map(item => {
            this.$set(item, 'isChecked', '0');
          });
          if (this.contactorList.length > 0) {
            this.contactorList[0].isChecked = '1';
          }
          if (this.invoiceList.length > 0) {
            this.invoiceList[0].isChecked = '1';
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    confirmedMergeOrder(val) {
      this.selectedOrderIds = val.concat();
      this.getMergeinfo();
      this.showOrderContactor = true;
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getOrderList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getOrderList();
    },
    selectChange(row) {
      this.contactorList.map(item => {
        if (item.consignee !== row.consignee) {
          item.isChecked = '0';
        }
      });
    },
    selectChangeByInvoice(row) {
      this.invoiceList.map(item => {
        if (item.invoiceTitle !== row.invoiceTitle) {
          item.isChecked = '0';
        }
      });
    },
    selectReturnOrder(row) {},
    confirmMerge() {
      let receiver = {};
      let invoice = {};
      for (const receiverItem of this.contactorList) {
        if (receiverItem.isChecked === '1') {
          receiver.address = receiverItem.address;
          receiver.areaName = receiverItem.areaName;
          receiver.consignee = receiverItem.consignee;
          receiver.phone = receiverItem.phone;
        }
      }
      for (const invoiceItem of this.invoiceList) {
        if (invoiceItem.isChecked === '1') {
          invoice.invoiceTitle = invoiceItem.invoiceTitle;
          invoice.code = invoiceItem.code;
          invoice.registerAddress = invoiceItem.registerAddress;
          invoice.registerMobile = invoiceItem.registerMobile;
          invoice.bank = invoiceItem.bank;
          invoice.account = invoiceItem.account;
          invoice.contacts = invoiceItem.contacts;
          invoice.mobile = invoiceItem.mobile;
          this.$set(invoice, 'area', { id: invoiceItem.area ? invoiceItem.area.id : '' });
          invoice.address = invoiceItem.address;
          invoice.invoiceType = invoiceItem.invoiceType;
        }
      }
      this.selectedOrderIds.unshift(this.mergeOrderId);
      let params = {
        ids: this.selectedOrderIds,
        receiver: receiver,
        invoice: invoice
      };
      http
        .post('/admin/purchaseOrderManage/storeSalesOrders/merge.jhtml', params)
        .then(data => {
          this.$message.success('订单合并成功');
          this.showOrderContactor = false;
          this.refresh();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.selectedOrderIds = [];
            this.$message.warning(error.errorMessage);
          }
        });
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
      this.activeNames = ['2'];
      this.handler = 'service';
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
    select(val, row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[3].disabled = true;
      this.selections = val;
      if (val.length > 0) {
        this.operations[3].disabled = false;
      }
      let newArr = [];
      for (let i in this.selections) {
        if (newArr.indexOf(this.selections[i].agent.id) === -1) {
          newArr.push(this.selections[i].agent.id);
        }
      }
      if (newArr.length > 1) {
        this.operations[3].disabled = true;
      }
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
    // 转采购
    returnOrder(row) {
      this.returnOrderId = row.id;
      this.returnOrderList = [];
      this.invoiceChecked = false;
      this.getReturnPurchase();
      this.showReturnPurchase = true;
    },
    getReturnPurchase() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        orderId: this.returnOrderId
      };
      http
        .get('/admin/purchaseOrder/toPurchase/productGroup.jhtml', params)
        .then(data => {
          this.returnOrderList = data.productGroup;
          this.productGroupWithNoSupplier = data.productGroupNoSupplier;
          this.selectionProduct = [];
          this.returnOrderList = data.productGroup.map((item, index) => {
            for (const list of item.cartItems) {
              this.$set(list, 'isSelected', '1');
            }
            return {
              cartItems: item.cartItems,
              supplier: item.supplier,
              memo: item.memo,
              paymentMethodId: item.paymentMethodId,
              shippingMethodId: item.shippingMethodId
            };
          });
          this.returnOrderConfirm();
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    clickAdress() {
      this.dialogVisiable = true;
    },
    paymentChange(val, index) {},
    inputChange(val, index) {
      let arr = this.options;
      let len = this.options.length;

      for (let i = 0; i < len; i++) {
        if (val === arr[i].id) {
          if (arr[i].isNeedReceiver === '0') {
            this.receiverId = '';
            this.showAddress = false;
          } else {
            this.receiverId = this.receivers[0].id;
            this.getAddress = this.receivers[0];
            this.showAddress = true;
          }
          this.refreshFreight(arr[i].name);
          return;
        }
      }
    },
    refreshFreight(shippingMethodName) {
      if (shippingMethodName === '顺丰速递') {
        this.freight = 20.0;
      } else {
        this.freight = 0;
      }
    },
    selectedItem(val) {
      this.dialogVisiable = false;
      this.getAddress = val;
      this.receiverId = val.id;
    },
    selectedInvoice(val) {
      this.dialogVisiableInvoice = false;
      this.getInvoice = val;
      this.invoiceChecked = true;
      this.invoiceId = val.id;
    },
    returnOrderConfirm() {
      let interfaceName = '';

      interfaceName = urls.hypermarketMgmt.fillIn;
      for (const item of this.returnOrderList) {
        let param = {
          cartItems: item.cartItems,
          methodName: '',
          clientType: '2',
          shopId: this.getUser().shop.id,
          userId: this.getUser().id,
          orderType: '0' // 订单类型[0:购物消费(车品类商品),1:充值,2:整车预定(整车类商品),3:预约维修,4:预约保养,5:有价优惠券]/
        };

        param.methodName = 'FillInOrder';
        http
          .post(interfaceName, param)
          .then(data => {
            this.receiverId = data.receivers[0].id;
            this.getAddress.consignee = data.receivers[0].consignee;
            this.getAddress.phone = data.receivers[0].phone;
            this.getAddress.areaName = data.receivers[0].areaName;
            this.getAddress.address = data.receivers[0].address;

            this.receivers = data.receivers;
            this.payOptions = data.paymentMethods;
            this.options = data.shippingMethods;

            this.payType = data.paymentMethods[0].name;
            this.type = data.shippingMethods[0].name;
            item.paymentMethodId = data.paymentMethods[0].id;
            item.shippingMethodId = data.shippingMethods[0].id;

            if (data.shippingMethods && data.shippingMethods.length) {
              if (data.shippingMethods[0].isNeedReceiver === '0') {
                this.showAddress = false;
              } else {
                this.showAddress = true;
              }
            }
          })
          .catch(err => {
            this.$message.warning(err.errorMessage);
          })
          .finally(() => {});
      }
    },
    invoiceChange(val) {
      console.log(val);
      if (val) {
        let params = {
          clientType: '2',
          userId: this.userId,
          shopId: this.getUser().shop.id
        };
        http
          .get(urls.hypermarketMgmt.invoiceInfos, params)
          .then(data => {
            this.getInvoice = data.invoices[0];
            this.invoiceId = data.invoices[0].id;
          })
          .catch(ErrorData => {
            this.$message({
              message: ErrorData.errorMessage,
              type: 'warning'
            });
            console.log('ERR_REFRESH: ', ErrorData);
          })
          .finally(data => {});
      }
    },
    clickInvoiceInfo() {
      this.dialogVisiableInvoice = true;
    },
    submit() {
      if (
        (!this.getAddress || !this.getAddress.address) &&
        ((this.payType === '在线支付' && this.showAddress) || this.payType === '货到付款')
      ) {
        this.$message.warning('请设置收货地址');
        return;
      }
      this.confirmReturnOrder();
    },
    confirmReturnOrder() {
      for (const item of this.returnOrderList) {
        // item.paymentMethodId = this.paymentMethodId;
        // item.shippingMethodId = this.shippingMethodId;
        item.receiverId = this.receiverId;
        item.invoiceId = this.invoiceId;
        for (const list of item.cartItems) {
          if (list.isSelected === '1') {
            this.selectionProduct.push(item);
          }
        }
      }
      let params = {
        productGroup: this.selectionProduct,
        orderId: this.returnOrderId,
        userId: this.getUser().id,
        shopId: this.getUser().shop.id
      };
      http
        .post('/admin/purchaseOrder/toPurchase/create.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.showReturnPurchase = false;
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    stateColor(row) {
      if (row.type === '5' || row.type === '7') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getOrderStatus(row) {
      switch (row.type) {
        case '11':
          return '已确认发货';
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
    width: 300px;
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
.order-contactor-dialog {
  .el-card {
    margin-bottom: 10px;
  }
  .el-card__body {
    padding: 10px;
  }
  .radio-i {
    display: flex;
    .el-radio {
      line-height: 80px;
      margin-right: 0px;
    }
    .receiver-info {
      padding: 10px;
      span {
        display: inline-block;
        font-size: 13px;
      }

      p {
        font-size: 13px;
        color: #808080;
        display: flex;
        align-items: center;
      }
    }
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
.order-mgmt-list-p {
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
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
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
.product-info-dailog {
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
.return-purchase-dialog {
  .order-confirm-content {
    height: 100%;
    padding-bottom: 45px;
    padding: 0px 10px;
    .order-address {
      padding: 10px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      border: 1px solid #e5e5e5;
      .left {
        color: #808080;
        display: flex;
        width: 100%;
        .address {
          width: 100%;
          .icon {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            cursor: pointer;
          }
          .receiver-address {
            color: #000;
            span {
              display: inline-block;
              font-size: 13px;
              margin: 0 20px 10px 15px;
            }
          }
          p {
            font-size: 13px;
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .order-goods {
      background: #ffffff;
      margin-bottom: 10px;
      padding: 10px;
      .shop-name {
        padding-bottom: 10px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        img {
          width: 18px;
          margin-right: 10px;
        }
      }
      .order-goods-div {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .img-div {
          width: 80px;
          height: 80px;
          overflow: hidden;
          display: flex;
          flex-grow: 0;
          flex-direction: row;
          align-items: center;
          margin-right: 10px;
          img {
            display: inline-block;
            width: 100%;
            vertical-align: middle;
          }
        }

        .goods-info {
          width: calc(100% - 80px);

          .name {
            display: block;
            margin-bottom: 20px;
            font-size: 14px;
            color: #000;
          }

          .money-info {
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .count-money {
              color: red;
              display: inline-block;
            }

            .count-num {
              display: inline-block;
              color: #808080;
            }
          }
        }
      }
    }
    .order-goods-div {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .img-div {
        width: 80px;
        height: 80px;
        overflow: hidden;
        display: flex;
        flex-grow: 0;
        flex-direction: row;
        align-items: center;
        margin-right: 10px;
        img {
          display: inline-block;
          width: 100%;
          vertical-align: middle;
        }
      }

      .goods-info {
        width: calc(100% - 80px);

        .name {
          display: block;
          margin-bottom: 20px;
          font-size: 14px;
          color: #000;
        }

        .money-info {
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .count-money {
            color: red;
            display: inline-block;
          }

          .count-num {
            display: inline-block;
            color: #808080;
          }
        }
      }
    }
    .order-info {
      background: #ffffff;
      margin-bottom: 10px;

      .select-tyle {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        padding: 5px 0px;
        .label {
          margin-left: 5px;
        }
      }

      .inv-info {
        font-size: 14px;

        a {
          color: #808080;
        }
      }

      .order-dispatch {
        padding: 13px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #e5e5e5;
        .invoice-info {
          display: flex;
          align-items: center;
          color: #666;
          cursor: pointer;
          overflow: hidden;
          .delete-btn {
            font-size: 16px;
            margin: 0 6px;
          }
        }
        .label {
          font-size: 14px;
        }
        .select {
          width: 70%;
          text-align: right;
        }
      }

      .order-vd {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        padding: 0 10px;
        height: 43px;
      }

      .buy-leave-mes {
        font-size: 14px;
        margin-bottom: 10px;
        .el-textarea {
          margin-top: 5px;
        }
        .label {
          margin-left: 5px;
        }

        .mes-input {
          width: 70%;
          text-align: right;
        }
      }
    }

    .order-count-div {
      background: #ffffff;
      padding: 10px;
      font-size: 14px;
      margin-bottom: 10px;
      .order-count {
        background: #ffffff;
        line-height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #888;

        .pro-count {
          display: block;
        }

        .count-money {
          color: red;
        }
      }
      .subscription {
        border-top: 1px solid #e5e5e5;
        margin-top: 10px;
        .subscription-count {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            display: block;
            margin-top: 10px;
          }
        }
      }
    }

    .foot {
      padding: 0;
      height: 45px;
      display: grid;
      justify-content: right;
      align-items: center;
      z-index: 10;
      bottom: 1px;
      font-size: 14px;

      .pay-for {
        margin-left: 10px;
      }

      .count-money {
        color: red;
        font-size: 16px;
      }
      .submit {
        padding: 7px 15px;
      }
    }
    .cube-checkbox {
      padding: 0 6px;
    }
  }
}
</style>
