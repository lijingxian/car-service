<template>
  <biz-grid class="afterSale-process">
    <div v-for="(refund,index) in refunds" :key="refund.id" v-loading="loading">
      <div class="refundsHead">
        <div class="refundsContent">
          <img class="image" v-bind:src="refund.orderItem.thumbnail" width="20px" />
          <label>{{refund.orderItem.fullName}}</label>
          <label class="price" v-if="refund.type!=='2'">￥{{refund.amount}}</label>
          <label class="refundsState">{{refundsStates[refund.state]}}</label>
        </div>
      </div>
      <el-steps direction="vertical" space="auto">
        <el-step title="新申请" :status="refund.refundsRecords[0].type==='0'?'finish':'wait'">
          <div slot="description">
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type=='0'">
              <!-- <p v-if="refund.state==='6'">买家取消退货</p> -->
              <p v-if="refund.type==='1'">买家申请退货</p>
              <p v-if="refund.type==='0'">买家申请退款</p>
              <p v-if="refund.type==='2'">买家申请换货</p>
              <p v-if="refund.type!=='2'">退款原因：{{refund.reason}}</p>
              <p v-if="refund.type!=='2'">退款金额：{{refund.amount}}</p>
              <p v-if="refund.type!=='2'">退款说明：{{refund.description}}</p>
              <p v-if="refund.type==='2'">换货原因：{{refund.reason}}</p>
              <p v-if="refund.type==='2'">换货数量：{{refund.orderItem.quantity}}</p>
              <p v-if="refund.type==='2'">换货地址：{{refund.receiverAddress}}</p>
              <p v-if="refund.type==='2'">换货说明：{{refund.description}}</p>
              <div style="display:flex">
                凭证：
                <div v-for="refundsImages in refund.refundsImages" :key="refundsImages"
                  style="display: inline-block;padding:0px 5px">
                  <img :src="refundsImages" height="100" @click="enlarge(refundsImages)" />
                </div>
                <div @click="close" class="overlay">
                  <img :src="imageValue" :style="imgStyle" />
                </div>
              </div>
              <p>{{refund.createDate}}</p>
              <div v-if="refund.state==='0'">
                <el-button @click="agree(index)" size="small" class="demo-step-button" v-if="isEdit">同意</el-button>
                <el-button @click="refuse(index)" size="small" class="demo-step-button" v-if="isEdit">拒绝</el-button>
              </div>
              <form action :id="'agreeForm_'+index">
                <table class="agreeContent" :id="'agreeContent_'+index">
                  <input type="hidden" name="refundId" v-bind:value="refund.id" />
                  <input type="hidden" name="state" value="2" />
                  <input type="hidden" name="orderId" v-model="orderId" />
                  <input type="hidden" name="refundType" v-bind:value="refund.type" />
                  <tr>
                    <th>售后详情:</th>
                    <td>
                      <textarea name="details" :rows="3" />
                      </td>
                  </tr>
                  <tr v-if="refund.type==='2'||refund.type==='1'">
                    <th>收货地址：</th>
                      <el-card>
                        <div class="left" @click="clickAdress">
                          <div class="address">
                            <div class="receiver-address">
                              <span>{{getAddress?getAddress.consignee:''}}</span>
                              <span style="margin-left:10px">{{getAddress?getAddress.phone:''}}</span>
                            </div>
                            <div class="icon">
                              <span>
                                <i class="el-icon-location-outline"></i>
                                {{getAddress?(getAddress.areaName+getAddress.address):'请设置收货地址'}}
                              </span>
                              <span style="float:right">
                                <i class="right-arrow iconfont biz-icon-i-web-zk1"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <i class="right-arrow iconfont icon-i-sh-man-tz"></i>
                        </div>
                      </el-card>
                  </tr>
                  <el-button @click="agreeSubmit(index)" size="small" class="demo-step-button" v-if="isEdit">确定</el-button>
                </table>
              </form>
              <form action :id="'refuseForm_'+index">
                <table class="refuseContent" :id="'refuseContent_'+index">
                  <input type="hidden" name="refundId" v-bind:value="refund.id" />
                  <input type="hidden" name="state" value="1" />
                  <input type="hidden" name="orderId" v-model="orderId" />
                  <tr>
                    <th>拒绝原因:</th>
                    <td>
                      <textarea name="details" :rows="3" />
                    </td>
                  </tr>
                  <!-- <tr>
                    <th>备注:</th>
                    <td>
                      <input type="text" name="remarks" />
                    </td>
                  </tr>-->
                  <el-button @click="refuseSubmit(index)" size="small" class="demo-step-button" v-if="isEdit">确定</el-button>
                </table>
              </form>
            </div>
          </div>
        </el-step>
        <el-step
          title="售后中"
          :status="refund.refundsRecords[0].type==='2'||refund.refundsRecords[0].type==='3'||refund.refundsRecords[0].type==='7'||refund.refundsRecords[0].type==='8'?'finish':'wait'"
        >
          <div slot="description">
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='2'&&refund.type!=='2'">
              <p>卖家同意退货申请，等待买家发货给卖家</p>
              <p>售后详情：{{refundsRecord.details}}</p>
              <p>{{refundsRecord.happenDate}}</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='2'&&refund.type==='2'">
              <p>卖家同意换货申请，等待买家发货给卖家</p>
              <p>售后详情：{{refundsRecord.details}}</p>
              <p>{{refundsRecord.happenDate}}</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='3'">
              <p>买家已退货，等待卖家收货</p>
              <p>物流公司：{{refundsRecord.deliveryCorp}}</p>
              <p>物流单号：{{refundsRecord.trackingNo}}</p>
              <p v-if="refund.type!=='2'">退款说明：{{refundsRecord.details}}</p>
              <p>{{refundsRecord.happenDate}}</p>
              <div v-if="refund.type!=='2'" v-for="returnsImages in refund.returnsImages" :key="returnsImages" style="display: inline-block;padding:0px 5px">
                <img v-bind:src="returnsImages" height="100" @click="enlarge(returnsImages)" />
              </div>
              <div v-if="refund.type!=='2'" @click="close" class="overlay">
                <img :src="imageValue" :style="imgStyle" />
              </div>
              <div v-if="refund.state=='3'">
                <el-button @click="agree1(index)" size="small" class="demo-step-button" v-if="isEdit">确认收货</el-button>
                <el-button @click="refuse1(index)" size="small" class="demo-step-button" v-if="isEdit">拒绝收货</el-button>
              </div>
              <form action :id="'refuseForm1_'+index">
                <table class="refuseContent1" :id="'refuseContent1_'+index">
                  <input type="hidden" name="refundId" v-bind:value="refund.id" />
                  <input type="hidden" name="state" value="4" />
                  <input type="hidden" name="orderId" v-model="orderId" />
                  <tr>
                    <th>拒绝原因:</th>
                    <td>
                      <textarea name="details" :rows="3" />
                    </td>
                  </tr>
                  <!-- <tr>
                    <th>备注:</th>
                    <td>
                      <input type="text" name="remarks" />
                    </td>
                  </tr>-->
                  <el-button @click="refuseSubmit1(index)" size="small" class="demo-step-button" v-if="isEdit">确定</el-button>
                </table>
              </form>
              <form action :id="'agreeForm1_'+index">
                <table class="agreeContent1" :id="'agreeContent1_'+index">
                  <input type="hidden" name="refundId" v-bind:value="refund.id" />
                  <input v-if="refund.type!=='2'" type="hidden" name="state" value="5" />
                  <input v-if="refund.type==='2'" type="hidden" name="state" value="7" />
                  <input type="hidden" name="orderId" v-model="orderId" />
                  <tr>
                    <th>收货详情:</th>
                    <td>
                      <textarea name="details" :rows="3" />
                    </td>
                  </tr>
                  <!-- <tr>
                    <th>备注:</th>
                    <td>
                      <input type="text" name="remarks" />
                    </td>
                  </tr>-->
                  <el-button @click="agreeSubmit1(index)" size="small" class="demo-step-button" v-if="isEdit">确定</el-button>
                </table>
              </form>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='7'">
              <p>卖家已收到买家的换货商品，待发出换货商品</p>
              <p>{{refundsRecord.happenDate}}</p>
              <div v-if="refund.state=='7'">
                <el-button @click="shipping(index)" size="small" class="demo-step-button" v-if="isEdit">发货</el-button>
              </div>
              <form action :id="'shippingForm_'+index">
                <table class="shippingContent1" :id="'shippingContent1_'+index">
                  <input type="hidden" name="refundId" v-bind:value="refund.id" />
                  <input type="hidden" name="state" value="8" />
                  <input type="hidden" name="orderId" v-model="orderId" />
                  <tr>
                    <th>物流公司:</th>
                    <td>
                      <select name="deliveryId" v-model="deliveryId" style="width:225px">
                        <option v-for="(deliveryCorps,index) in deliveryCorps" :key="index" :label="deliveryCorps.name" :value="deliveryCorps.id"></option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>物流单号:</th>
                    <td>
                      <input type="text" name="trackingNo" onKeyUp="value=value.replace(/[\W]/g,'')"/>
                    </td>
                  </tr>
                  <tr>
                    <th>物流费用:</th>
                    <td>
                      <input type="text" name="tackingAmount" onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"/>
                    </td>
                  </tr>
                  <el-button @click="shippingSubmit1(index)" size="small" class="demo-step-button" v-if="isEdit">确定</el-button>
                </table>
              </form>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='8'">
              <p>卖家已发出换新货，等待买家收货</p>
              <p>物流公司：{{refundsRecord.deliveryCorp}}</p>
              <p>物流单号：{{refundsRecord.trackingNo}}</p>
              <p>{{refundsRecord.happenDate}}</p>
            </div>
          </div>
        </el-step>
        <el-step
          title="售后完成"
          :status="refund.refundsRecords[0].type==='1'||refund.refundsRecords[0].type==='4'||refund.refundsRecords[0].type==='5'||refund.refundsRecords[0].type==='6'||refund.refundsRecords[0].type==='9'?'finish':'wait'"
        >
          <div slot="description">
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type=='5'">
              <p>{{refundsRecord.happenDate}}</p>

              <p>退款金额：{{refundsRecord.amount}}</p>
              <p>售后详情：{{refundsRecord.details}}</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type=='6'&&refund.type!=='2'">
              <p>买家取消退货</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type=='6'&&refund.type==='2'">
              <p>买家取消换货</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='1'">
              <p>卖家拒绝售后申请</p>
              <p>拒绝原因：{{refundsRecord.details}}</p>
              <p>{{refundsRecord.happenDate}}</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='4'">
              <p>卖家拒绝收货</p>
              <p>拒绝原因：{{refundsRecord.details}}</p>
              <p>{{refundsRecord.happenDate}}</p>
            </div>
            <div v-for="refundsRecord in refund.refundsRecords" :key="refundsRecord.id" v-if="refundsRecord.type==='9'">
              <p>买家已确认收货，换货完成</p>
            </div>
          </div>
        </el-step>
      </el-steps>
    </div>
    <div v-if="refunds.length === 0" :style="styleObject"></div>
    <el-dialog :visible.sync="dialogVisiable" append-to-body custom-class="bill-dialog">
      <bill-info style="margin-top: 15px;" @selectedItem="selectedItem"></bill-info>
    </el-dialog>
  </biz-grid>
</template>
<script>
import service from '@/service/order-mgmt/orderMgmt';
import defaultImage from '@/assets/images/default_user.png';
import { BizGrid } from '@/components/BizGrid';
import NoContent from '@/assets/images/emptyGray.png';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import BillInfo from './components/BillInfo';
export default {
  components: { BizGrid, BillInfo },
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
  data() {
    return {
      activeStep: 0,
      loading: false,
      dialogVisiable: false,
      refunds: [],
      refundsRecords: [],
      refundsImages: [],
      formData: [],
      getAddress: {},
      refundType: '',
      refundId: '',
      orderId: '',
      message: '',
      imageValue: '',
      imgStyle: '',
      deliveryId: '',
      trackingNo: '',
      tackingAmount: '',
      currentState: '',
      active: '',
      defaultImage: defaultImage,
      showShippingEditor: false,
      deliveryCorps: [],
      refundsStates: {
        0: '未确认',
        1: '拒绝退款退货/换货申请',
        2: '同意退/换货申请',
        3: '买家发货',
        4: '卖家拒收',
        5: '卖家退款',
        6: '取消退款',
        7: '卖家发货',
        8: '买家收货'
      }
    };
  },
  computed: {
    ...mapGetters(['getUser']),
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
  created() {
    this.initData();
    this.getAddressList();
  },
  watch: {
    itemId(newVal, oldVal) {
      if (newVal.id !== '') {
        this.initData();
      }
    }
  },
  methods: {
    clickAdress() {
      console.log(1111);
      this.dialogVisiable = true;
    },
    selectedItem(val) {
      this.dialogVisiable = false;
      this.getAddress = val;
    },
    getAddressList() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.receiverList, params)
        .then(data => {
          if (data.receivers.length > 0) {
            this.getAddress = data.receivers[0];
          }
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
    initData() {
      let params = {
        orderId: this.itemId.id
      };
      service.viewOrderRefunds(
        params,
        data => {
          this.refunds = data.refunds;
          // data.refunds.map((item, index) => {
          //   this.currentState = item.refundsRecords[0].type;
          //   if (this.currentState === '0') {
          //     return (this.active = '1');
          //   } else if (
          //     (this.currentState === '2' || this.currentState === '3' || this.currentState === '7' || this.currentState === '8')
          //   ) {
          //     return (this.active = '2');
          //   } else if (
          //     (this.currentState =
          //       '1' ||
          //       this.currentState === '4' ||
          //       this.currentState === '5' ||
          //       this.currentState === '6' ||
          //       this.currentState === '9')
          //   ) {
          //     return (this.active = '3');
          //   } else {
          //   }
          // });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    close() {
      document.querySelector('.overlay').style.display = 'none';
    },
    // 图片放大
    enlarge(item) {
      document.querySelector('.overlay').style.display = 'block';
      this.imageValue = item || defaultImage;
      this.imgStyle = 'position: absolute; top: 100px; right: 150px;padding:20px;height: 500px;background:#fff';
    },
    agree(index) {
      let agreeContentIndex = 'agreeContent_' + index;
      let refuseContentIndex = 'refuseContent_' + index;
      document.getElementById(agreeContentIndex).style.display = 'block';
      let objInput = document.getElementById(agreeContentIndex).getElementsByTagName('input');
      for (let i = 0; i < objInput.length - 1; i++) {
        this.refundType = objInput[1].value;
      }
      document.getElementById(refuseContentIndex).style.display = 'none';
    },

    refuse(index) {
      let agreeContentIndex = 'agreeContent_' + index;
      let refuseContentIndex = 'refuseContent_' + index;
      document.getElementById(agreeContentIndex).style.display = 'none';
      document.getElementById(refuseContentIndex).style.display = 'block';
    },
    agree1(index) {
      let agreeContentIndex = 'agreeContent1_' + index;
      let refuseContentIndex = 'refuseContent1_' + index;
      document.getElementById(agreeContentIndex).style.display = 'block';
      document.getElementById(refuseContentIndex).style.display = 'none';
    },
    refuse1(index) {
      let agreeContentIndex = 'agreeContent1_' + index;
      let refuseContentIndex = 'refuseContent1_' + index;
      document.getElementById(agreeContentIndex).style.display = 'none';
      document.getElementById(refuseContentIndex).style.display = 'block';
    },
    agreeSubmit(index) {
      let agreeFormIndex = 'agreeForm_' + index;
      let formData = {
        orderId: this.itemId.id,
        depotReceiverId: this.getAddress.id,
        refundId: document.getElementById(agreeFormIndex)[0].value,
        refundsState: document.getElementById(agreeFormIndex)[1].value,
        details: document.getElementById(agreeFormIndex)[4].value,
        remarks: document.getElementById(agreeFormIndex)[5].value
      };
      this.loading = true;
      service.refundsAudit(
        formData,
        data => {
          this.$message.success('操作成功');
          this.initData();
          this.$emit('operationSuccess');
          document.getElementById(agreeFormIndex).style.display = 'none';
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          ErrorData.errorMessage !== '店铺不存在' && this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    refuseSubmit(index) {
      let refuseFormIndex = 'refuseForm_' + index;
      let formData = {
        orderId: this.itemId.id,
        refundId: document.getElementById(refuseFormIndex)[0].value,
        refundsState: document.getElementById(refuseFormIndex)[1].value,
        details: document.getElementById(refuseFormIndex)[3].value,
        remarks: document.getElementById(refuseFormIndex)[4].value
      };
      console.log(formData);
      this.loading = true;
      service.refundsAudit(
        formData,
        data => {
          this.$message.success('操作成功');
          this.initData();
          this.$emit('operationSuccess');
          this.loading = false;
          document.getElementById(refuseFormIndex).style.display = 'none';
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          ErrorData.errorMessage !== '店铺不存在' && this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    agreeSubmit1(index) {
      this.loading = true;
      let agreeFormIndex = 'agreeForm1_' + index;
      let formData = {
        orderId: this.itemId.id,
        refundId: document.getElementById(agreeFormIndex)[0].value,
        refundsState: document.getElementById(agreeFormIndex)[1].value,
        details: document.getElementById(agreeFormIndex)[3].value,
        remarks: document.getElementById(agreeFormIndex)[4].value
      };
      console.log(formData);
      service.refundsAudit(
        formData,
        data => {
          this.$message.success('操作成功');
          this.initData();
          this.$emit('operationSuccess');
          document.getElementById(agreeFormIndex).style.display = 'none';
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          ErrorData.errorMessage !== '店铺不存在' && this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    refuseSubmit1(index) {
      this.loading = true;
      let refuseFormIndex = 'refuseForm1_' + index;
      let formData = {
        orderId: this.itemId.id,
        refundId: document.getElementById(refuseFormIndex)[0].value,
        refundsState: document.getElementById(refuseFormIndex)[1].value,
        details: document.getElementById(refuseFormIndex)[3].value,
        remarks: document.getElementById(refuseFormIndex)[4].value
      };
      service.refundsAudit(
        formData,
        data => {
          this.$message.success('操作成功');
          this.initData();
          this.$emit('operationSuccess');
          document.getElementById(refuseFormIndex).style.display = 'none';
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          ErrorData.errorMessage !== '店铺不存在' && this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    shipping(index) {
      let shippingContentIndex = 'shippingContent1_' + index;
      document.getElementById(shippingContentIndex).style.display = 'block';
      this.init();
    },
    // 获取物流公司
    init() {
      service.viewOrder(
        { orderId: this.itemId.id },
        data => {
          this.deliveryCorps = data.deliveryCorps;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    shippingSubmit1(index) {
      this.loading = true;
      let shippingFormIndex = 'shippingForm_' + index;
      let formData = {
        orderId: this.itemId.id,
        refundId: document.getElementById(shippingFormIndex)[0].value,
        refundsState: document.getElementById(shippingFormIndex)[1].value,
        details: '',
        remarks: '',
        deliveryId: document.getElementById(shippingFormIndex)[3].value,
        trackingNo: document.getElementById(shippingFormIndex)[4].value,
        tackingAmount: document.getElementById(shippingFormIndex)[5].value
      };
      service.refundsAudit(
        formData,
        data => {
          this.$message.success('操作成功');
          this.initData();
          this.$emit('operationSuccess');
          document.getElementById(shippingFormIndex).style.display = 'none';
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          ErrorData.errorMessage !== '店铺不存在' && this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    messageClick() {
      this.initData();
      this.message = '';
    }
  }
};
</script>
<style lang="scss">
.afterSale-process {
  .el-step__title {
    font-size: 14px;
  }
  .el-steps {
    padding: 20px;
  }
  .agreeContent,
  .agreeContent1,
  .shippingContent1 {
    display: none;
    border: 1px solid #c1c1c1;
    background-color: #f7f7f7;
    margin: 20px 0px 0px 0px;
    th {
      padding: 10px;
      text-align: right;
    }
    input,
    textarea {
      width: 223px;
    }
    button {
      margin: 10px 10px 10px 250px;
    }
  }
  .refuseContent,
  .refuseContent1 {
    display: none;
    border: 1px solid #c1c1c1;
    background-color: #f7f7f7;
    margin: 20px 0px 0px 0px;
    th {
      padding: 10px;
      text-align: right;
    }
    input,
    textarea {
      width: 223px;
    }
    button {
      margin: 10px 10px 10px 250px;
    }
  }
  .overlay {
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    width: 100%;
    display: none;
    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 299;
  }
  .refundsHead {
    background: #f2f2f2;
    width: 100%;
    height: 50px;
    font-size: 14px;
    .refundsContent {
      height: 50px;
      line-height: 50px;
      .image {
        margin: 0px 10px 0px 20px;
      }
      .price {
        color: #ff7300;
        margin-right: 10px;
        float: right;
      }
      .refundsState {
        float: right;
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
</style>
