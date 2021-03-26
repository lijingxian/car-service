<template>
  <biz-grid class="services-mgmt-subscription-service">
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <div class="line">
        <el-form-item label="分享"> </el-form-item>
      </div>
      <div class="parentContent">
        <el-checkbox-group v-model="product_sharesIds">
          <el-checkbox v-for="(item,index) of view.shares" :key="item.id" :checked="item.isSelected==='1'" :label="item.id"
            @change="sharesButtonClick(item.id,index)" @mouseenter.native="mouseenter(item.id)"
            @mouseleave.native="mouseleave(item.id)" border :style="item.businessService.hasChildren==='1'?'float:left':''"
            ref="sharesButton" :disabled="isSelect()">
            <span
              :class="{'buttonBought ':item.businessService.subscribeState==='1', 'buttonNotBought':item.businessService.subscribeState!=='1'}">{{item.businessService.name}}
              <i v-if="item.businessService.hasChildren==='1'" class="el-icon-d-arrow-right"></i>
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="sharesChildContent" ref="sharesChildButton">
        <el-checkbox-group v-model="pushSharesIds">
          <el-checkbox v-show="parentId !== ''" v-for="item of view.sharesChild" :key="item.id" :checked="item.isSelected==='1'"
            :label="item.id" @change="calculate" border @mouseenter.native="mouseenter(item.id)"
            @mouseleave.native="mouseleave(item.id)">
            <span
              :class="{'buttonBought ':item.businessService.subscribeState==='1', 'buttonNotBought':item.businessService.subscribeState!=='1'}">{{item.businessService.name}}
              <i v-if="item.businessService.hasChildren==='1'" class="el-icon-d-arrow-right"></i>
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="line">
        <el-form-item label="电商"></el-form-item>
      </div>
      <div class="parentContent" style="margin-bottom:15px;">
        <el-checkbox-group v-model="product_ecommercesIds">
          <el-checkbox v-for="(item,index) of view.ecommerces" :key="item.id" :label="item.id" :checked="item.isSelected==='1'"
            @change="ecommercesButtonClick(item.id,index)" @mouseenter.native="mouseenter(item.id)"
            @mouseleave.native="mouseleave(item.id)" :style="item.businessService.hasChildren==='1'?'float:left':''" border
            ref="ecommercesButton" :disabled="isSelect()">
            <span
              :class="{'buttonBought ':item.businessService.subscribeState==='1', 'buttonNotBought':item.businessService.subscribeState!=='1'}">{{item.businessService.name}}
              <i v-if="item.businessService.hasChildren==='1'" class="el-icon-d-arrow-right">
              </i>
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="ecommerceChildContent" ref="ecommercesChildButton">
        <el-checkbox-group v-model="pushEcommerceIds">
          <el-checkbox v-show="parentId !== ''" v-for="item of view.ecommercesChild" :key="item.id"
            :checked="item.isSelected==='1'" :label="item.id" @change="calculate" border @mouseenter.native="mouseenter(item.id)"
            @mouseleave.native="mouseleave(item.id)">
            <span
              :class="{'buttonBought ':item.businessService.subscribeState==='1', 'buttonNotBought':item.businessService.subscribeState!=='1'}">{{item.businessService.name}}
              <i v-if="item.businessService.hasChildren==='1'" class="el-icon-d-arrow-right"></i>
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="line">
        <el-form-item label="汽车后服务"> </el-form-item>
      </div>
      <div class="parentContent">
        <el-checkbox-group v-model="product_aftermarketsIds">
          <el-checkbox v-for="(item,index) of view.aftermarkets" :key="index" :label="item.id" :checked="item.isSelected==='1'"
            @change="aftermarketsButtonClick(item.id,index)" border @mouseenter.native="mouseenter(item.id)"
            @mouseleave.native="mouseleave(item.id)" :style="item.businessService.hasChildren==='1'?'float:left':''"
            ref="afterSaleButton" :disabled="isSelect()">
            <span
              :class="{'buttonBought ':item.businessService.subscribeState==='1', 'buttonNotBought':item.businessService.subscribeState!=='1'}">{{item.businessService.name}}
              <i v-if="item.businessService.hasChildren==='1'" class="el-icon-d-arrow-right"></i>
            </span>
          </el-checkbox>
        </el-checkbox-group>
        <div class="afterSaleChildContent" ref="afterSaleChildButton">
          <el-checkbox-group v-model="pushAftermarketsIds">
            <el-checkbox v-show="parentId !== ''" v-for="item of view.aftermarketsChild" :key="item.id"
              :checked="item.isSelected==='1'" :label="item.id" @change="calculate" @mouseenter.native="mouseenter(item.id)"
              @mouseleave.native="mouseleave(item.id)" border>
              <span
                :class="{'buttonBought ':item.businessService.subscribeState==='1', 'buttonNotBought':item.businessService.subscribeState!=='1'}">{{item.businessService.name}}
                <i v-if="item.businessService.hasChildren==='1'" class="el-icon-d-arrow-right"></i>
              </span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="popover popoverClass1" v-show="previewDialogOpen" @mouseenter="popoverDialogVisible"
        @mouseleave="popoverDialogClose">
        <form>
          <div class="service" style="color: #606266;">服务：{{serviceData.parentName}}</div>
          <div class="parentService" style="color: #606266;">子服务：{{serviceData.name}}</div>
          <div class="serviceDescription" style="color: #606266;">服务说明：{{serviceData.description}}</div>
          <el-table :data="SpecificationData">
            <el-table-column property="period" label="年限" :formatter="periodFormatter"></el-table-column>
            <el-table-column property="price" label="价格"></el-table-column>
            <el-table-column property="discount" label="折扣" :formatter="discountFormatter"></el-table-column>
          </el-table>
        </form>
      </div>
      <el-form-item label="支付方式：" prop="paymentTypeName" style="margin-top:40px;margin-bottom:50px">
        <el-radio-group v-model="form.paymentTypeName" style="margin-left:-50px;margin-top: -5px;">
          <el-radio label="支付宝">支付宝</el-radio>
          <el-radio label="个人银联">个人银联</el-radio>
          <el-radio label="企业银联">企业银联</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="续费时长：" style="margin-bottom:50px">
        <div class="paymentButton" style="margin-top: -5px;">
          <el-radio-group v-model="paymentPatternId" @change="calculate" style="margin-left: -40px;">
            <el-radio-button v-for="item of view.paymentPatternList" :key="item.sId" :label="item.sId" :disabled="isSelect()">
              {{item.period}}个月</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <div class="payList">
        <div style="font-size:14px;color: #606266;margin-left:10px;">配置费用：</div>
        <div class="content" v-for="item in businessList" :key="item" style="display:flex;margin-left: 90px;">
          <div class="selectId"
            style="background-color:#ff7300;padding:10px;font-size:12px;color: #fff;margin-bottom:10px;width:170px;text-align:center;">
            {{item.name}}</div>
          <div class="timeBegin"
            style="margin-left: 130px;margin-bottom: 10px;padding:10px;font-size:12px;background-color:#ff7300;margin-right:10px;color: #fff;">
            {{item.startDate}}</div>
          <div class="timeEnd" style="margin-bottom: 10px;font-size:12px;background-color:#ff7300;padding:10px;color: #fff;">
            {{item.endDate}}</div>
          <div class="payment" style="margin-left:30px;color:#ff7300;margin-top: 10px;font-size:16px;margin-left: 100px;">
            ￥{{item.oneAmount}}</div>
        </div>
      </div>
      <div class="pay">
        <div class="tatol" style="font-size:14px;color: #606266;">合计</div>
        <div class="amount">￥{{form.amount}}</div>
        <div class="economy">省：{{form.economy}} 实付{{form.actualPayment}}</div>
        <div class="discount">立享{{form.discount}}折优惠(实例规格)</div>
        <biz-save-button :operations="operations" @operate="operate">
        </biz-save-button>
      </div>
    </el-form>
    <el-dialog title="网上支付提示(支付完成前请不要关闭此窗口)" :visible.sync="dialogVisible" width="35%" :before-close="handleClose"
      custom-class="paymentDialog">
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成支付
      </span>
      <span>
        没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <span v-popover:codePop class="helpClass">查看帮助</span>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">支付遇到问题</el-button>
        <el-button type="primary" @click="payQuery" size="mini">支付完成</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import subscriptionService from '@/service/services-mgmt/services-order/subscriptionService';
import add from '@/assets/images/add.svg';
import { mapGetters } from 'vuex';

export default {
  name: 'SubscriptionService',
  components: {
    BizGrid,
    BizSaveButton
  },
  computed: {
    pushSharesIds: {
      get() {
        return this.product_sharesChildrenIds;
      },
      set(value) {
        // 先删除当前显示的全部项
        this.view.sharesChild.forEach(key => {
          this.product_sharesChildrenIds = this.product_sharesChildrenIds.filter(item => item !== key.id);
        });

        // 添加当前显示的选中项
        value.forEach(val => {
          this.product_sharesChildrenIds.push(val);
        });
      }
    },
    pushEcommerceIds: {
      get() {
        return this.product_ecommercesChildrenIds;
      },
      set(value) {
        // 先删除当前显示的全部项
        this.view.ecommercesChild.forEach(key => {
          this.product_ecommercesChildrenIds = this.product_ecommercesChildrenIds.filter(item => item !== key.id);
        });

        // 添加当前显示的选中项
        value.forEach(val => {
          this.product_ecommercesChildrenIds.push(val);
        });
      }
    },
    pushAftermarketsIds: {
      get() {
        return this.product_aftermarketsChildrenIds;
      },
      set(value) {
        // 先删除当前显示的全部项
        this.view.aftermarketsChild.forEach(key => {
          this.product_aftermarketsChildrenIds = this.product_aftermarketsChildrenIds.filter(item => item !== key.id);
        });

        // 添加当前显示的选中项
        value.forEach(val => {
          this.product_aftermarketsChildrenIds.push(val);
        });
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      orderId: '',
      parentId: '',
      mouseOverId: '',
      isMouseIn: false,
      type: '',
      // 用户信息
      form: {
        paymentTypeName: '支付宝',
        amount: '0',
        discount: '0.00',
        economy: '0.00',
        actualPayment: '0.00'
      },
      operations: [
        {
          label: '立即购买',
          name: 'orderNow',
          type: 'primary'
        }
      ],
      // 页面固定显示项目
      view: {
        shares: [],
        aftermarkets: [],
        ecommerces: [],
        sharesChild: [],
        ecommercesChild: [],
        aftermarketsChild: [],
        paymentPatternList: []
      },
      add: add,
      paymentPatternId: '0',
      serviceData: [],
      SpecificationData: [],
      previewDialogOpen: false,
      businessList: [],
      // 选中购买项目的ids 开始
      product_sharesIds: [],
      product_sharesChildrenIds: [],
      product_ecommercesIds: [],
      product_ecommercesChildrenIds: [],
      product_aftermarketsIds: [],
      product_aftermarketsChildrenIds: []
    };
  },
  created() {
    this.orderId = this.$route.query.id;
    this.type = this.$route.query.type;
    this.queryItem();
    this.queryPaymentPattern();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    queryItem() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        businessOrderId: this.orderId
      };
      subscriptionService.listBusinessService(
        params,
        data => {
          this.view.shares = data.shares;
          this.view.aftermarkets = data.autoAftermarkets;
          this.view.ecommerces = data.ecommerces;
          setTimeout(() => {
            this.calculate();
          }, 500);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    queryPaymentPattern() {
      let params = {
        businessOrderId: this.orderId
      };
      subscriptionService.queryPaymentPattern(
        params,
        data => {
          this.view.paymentPatternList = data.paymentPatternList;
          this.view.paymentPatternList.forEach(element => {
            if (element.isSelected === '1') {
              this.paymentPatternId = element.sId;
              return true;
            }
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    DisplaySubButton() {
      this.view.sharesChild = [];
      this.view.ecommercesChild = [];
      this.view.aftermarketsChild = [];

      let params = {
        shopId: window.top.SHOP_ID || '',
        parentId: this.parentId,
        businessOrderId: this.orderId
      };
      subscriptionService.listBusinessService(
        params,
        data => {
          this.view.sharesChild = data.shares;
          this.view.ecommercesChild = data.ecommerces;
          this.view.aftermarketsChild = data.autoAftermarkets;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    queryBusinessService() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: this.mouseOverId
      };
      subscriptionService.queryBusinessService(
        params,
        data => {
          this.serviceData = data.serviceData;
          this.SpecificationData = data.SpecificationData;
          this.previewDialogOpen = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    payQuery() {
      if (this.form.paymentTypeName === '支付宝') {
        this.alipayQuery();
      } else if (this.form.paymentTypeName === '个人银联') {
        this.unionGatePayQuery();
      } else {
        this.unionB2BPayQuery();
      }
    },
    periodFormatter(row) {
      return row.period + '个月';
    },
    discountFormatter(row) {
      if (row.discount === '1') {
        return '无';
      } else {
        return row.discount * 10 + '折';
      }
    },
    checkedItem() {
      let ids = [];
      ids = ids.concat(this.product_sharesIds);
      ids = ids.concat(this.product_sharesChildrenIds);
      ids = ids.concat(this.product_ecommercesIds);
      ids = ids.concat(this.product_ecommercesChildrenIds);
      ids = ids.concat(this.product_aftermarketsIds);
      ids = ids.concat(this.product_aftermarketsChildrenIds);
      return ids;
    },
    orderNow() {
      if (this.paymentPatternId === '0') {
        this.$message.warning('请选择购买时长');
        return;
      }

      let ids = this.checkedItem();
      if (ids.length === 0) {
        this.$message.warning('请选择购买商品');
        return;
      }

      let params = {
        shopId: window.top.SHOP_ID || '',
        productIds: ids,
        specificationId: this.paymentPatternId,
        type: this.type
      };

      if (this.type !== '') {
        subscriptionService.createBusinessOrder(
          params,
          data => {
            this.orderId = data.orderId;

            if (this.form.amount === '0.00') {
              this.freePay();
            } else {
              this.dialogVisible = true;
              if (this.form.paymentTypeName === '支付宝') {
                // if (
                //   navigator.userAgent.indexOf('Firefox') !== -1 ||
                //   navigator.userAgent.indexOf('MSIE') !== -1
                // ) {
                //   this.dialogVisible = false;
                //   this.$message.warning('此浏览器不支持支付，请更换浏览器');
                //   return;
                // }
                this.alipayPagePay();
              } else if (this.form.paymentTypeName === '个人银联') {
                this.unionGatePay();
              } else {
                this.unionB2BPay();
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      } else {
        if (this.form.amount === '0.00') {
          this.freePay();
        } else {
          this.dialogVisible = true;
          if (this.form.paymentTypeName === '支付宝') {
            // if (
            //   navigator.userAgent.indexOf('Firefox') !== -1 ||
            //   navigator.userAgent.indexOf('MSIE') !== -1
            // ) {
            //   this.dialogVisible = false;
            //   this.$message.warning('此浏览器不支持支付，请更换浏览器');
            //   return;
            // }
            this.alipayPagePay();
          } else if (this.form.paymentTypeName === '个人银联') {
            this.unionGatePay();
          } else {
            this.unionB2BPay();
          }
        }
      }
    },
    freePay() {
      subscriptionService.authorityService(
        { orderId: this.orderId },
        data => {
          this.$message.success('操作成功');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    alipayPagePay() {
      subscriptionService.alipayPagePay(
        { orderId: this.orderId },
        data => {
          // let newwin = window.open('', '_blank', '');
          // // if (newwin === null) {
          // //   this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          // // }
          // newwin.document.open('text/html', 'replace');
          // newwin.opener = null;
          // newwin.document.write(data.response.body);
          // newwin.document.close();
          window.open(data.response.body);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    unionGatePay() {
      subscriptionService.unionGatePay(
        { orderId: this.orderId },
        data => {
          let newwin = window.open('', '_blank', '');
          if (newwin === null) {
            this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          }
          newwin.document.open('text/html', 'replace');
          newwin.opener = null;
          newwin.document.write(data.response);
          newwin.document.close();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    unionB2BPay() {
      subscriptionService.unionB2BPay(
        { orderId: this.orderId },
        data => {
          let newwin = window.open('', '_blank', '');
          if (newwin === null) {
            this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          }
          newwin.document.open('text/html', 'replace');
          newwin.opener = null;
          newwin.document.write(data.response);
          newwin.document.close();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    alipayQuery() {
      subscriptionService.alipayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/order',
            query: {}
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/order',
            query: {}
          });
        }
      );
    },
    unionGatePayQuery(orderId) {
      subscriptionService.unionGatePayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/order',
            query: {}
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/order',
            query: {}
          });
        }
      );
    },
    unionB2BPayQuery(orderId) {
      subscriptionService.unionB2BPayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/order',
            query: {}
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/order',
            query: {}
          });
        }
      );
    },
    calculate() {
      if (this.paymentPatternId === '0') {
        return;
      }

      let ids = this.checkedItem();
      if (ids.length === 0) {
        this.businessList = [];
        this.form.amount = '';
        this.form.discount = '';
        this.form.economy = '';
        this.form.actualPayment = '';
        return;
      }

      let params = {
        productIds: ids,
        specificationId: this.paymentPatternId
      };

      subscriptionService.calculate(
        params,
        data => {
          this.businessList = data.businessList;
          this.form.amount = data.amount;
          this.form.discount = data.discount;
          this.form.economy = data.economy;
          this.form.actualPayment = data.actualPayment;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    sharesButtonClick(id, index) {
      if (this.parentId === id) {
        this.parentId = '';
        this.view.sharesChild.forEach(element => {
          this.product_sharesChildrenIds.forEach((val, index) => {
            if (val === element.id) {
              this.product_sharesChildrenIds.splice(index, 1);
              return true;
            }
          });
        });
      } else {
        let exist = false;
        this.product_sharesIds.forEach(element => {
          if (id === element) {
            exist = true;
            return true;
          }
        });
        if (!exist) {
          this.product_sharesIds.push(id);
        }
        this.parentId = id;
        this.DisplaySubButton();
      }

      this.calculate();

      this.$refs.sharesChildButton.style.top = this.$refs.sharesButton[index].$el.offsetTop + 45 + 'px';
      this.$refs.sharesChildButton.style.left = this.$refs.sharesButton[index].$el.offsetLeft + 'px';
    },
    ecommercesButtonClick(id, index) {
      if (this.parentId === id) {
        this.parentId = '';
        this.view.ecommercesChild.forEach(element => {
          this.product_ecommercesChildrenIds.forEach((val, index) => {
            if (val === element.id) {
              this.product_ecommercesChildrenIds.splice(index, 1);
              return true;
            }
          });
        });
      } else {
        let exist = false;
        this.product_ecommercesIds.forEach(element => {
          if (id === element) {
            exist = true;
            return true;
          }
        });
        if (!exist) {
          this.product_ecommercesIds.push(id);
        }
        this.parentId = id;
        this.DisplaySubButton();
      }

      this.calculate();

      this.$refs.ecommercesChildButton.style.top = this.$refs.ecommercesButton[index].$el.offsetTop + 45 + 'px';
      this.$refs.ecommercesChildButton.style.left = this.$refs.ecommercesButton[index].$el.offsetLeft + 'px';
    },
    aftermarketsButtonClick(id, index) {
      if (this.parentId === id) {
        this.parentId = '';
        this.view.aftermarketsChild.forEach(element => {
          this.product_aftermarketsChildrenIds.forEach((val, index) => {
            if (val === element.id) {
              this.product_aftermarketsChildrenIds.splice(index, 1);
              return true;
            }
          });
        });
      } else {
        let exist = false;
        this.product_aftermarketsIds.forEach(element => {
          if (id === element) {
            exist = true;
            return true;
          }
        });
        if (!exist) {
          this.product_aftermarketsIds.push(id);
        }
        this.parentId = id;
        this.DisplaySubButton();
      }

      this.calculate();

      this.$refs.afterSaleChildButton.style.top = this.$refs.afterSaleButton[index].$el.offsetTop + 35 + 'px';
      this.$refs.afterSaleChildButton.style.left = this.$refs.afterSaleButton[index].$el.offsetLeft + 'px';
    },
    mouseenter(id) {
      this.mouseOverId = id;
      setTimeout(() => {
        if (this.mouseOverId !== id) {
          return;
        }
        if (!this.isMouseIn) {
          this.queryBusinessService();
        }
      }, 300);
    },
    mouseleave(id) {
      setTimeout(() => {
        if (this.isMouseIn) {
          this.previewDialogOpen = true;
        } else {
          this.previewDialogOpen = false;
        }
      }, 200);
    },
    popoverDialogVisible() {
      this.isMouseIn = true;
    },
    popoverDialogClose() {
      this.isMouseIn = false;
      this.previewDialogOpen = false;
    },
    isSelect() {
      if (this.type === '') {
        return true;
      }
    }
  }
};
</script>

<style lang="scss">
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.helpClass {
  color: #ff7300;
  font-size: 12px;
}
.services-mgmt-subscription-service {
  overflow: auto;
  .biz-save-button {
    margin-top: 10px;
  }
  .biz-scroller {
    position: relative;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .line {
    width: 3px;
    height: 20px;
    background-color: #ff7300;
    margin-right: 5px;
    margin-left: 20px;
    margin-bottom: 18px;
  }
  .buttonBought {
    cursor: pointer;
    color: #ff7300;
  }
  .buttonNotBought {
    cursor: pointer;
    color: #1a1a1a;
  }
  .parentContent {
    margin-left: 10px;
  }
  .parentContent .el-checkbox-group .el-checkbox {
    margin: 10px 10px 40px 20px;
    border-radius: 2px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 12px;
  }
  .sharesChildContent .el-checkbox {
    border-radius: 2px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 12px;
  }
  .ecommerceChildContent .el-checkbox {
    border-radius: 2px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 12px;
  }
  .afterSaleChildContent .el-checkbox {
    border-radius: 2px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 12px;
  }
  .mu-raised-button-label {
    font-size: 13px;
  }
  .el-form-item__label {
    text-align: left;
    margin-left: 10px;
    margin-top: -5px;
  }
  .el-checkbox__inner {
    border: none;
  }
  .el-checkbox__label {
    font-size: 13px;
  }
  .pay {
    margin-top: 20px;
    background-color: #f7f8fa;
    height: 60px;
    line-height: 60px;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    display: flex;
  }
  .pay .amount {
    color: #ff7300;
    padding: 0 20px 0 40px;
    font-size: 24px;
  }
  .pay .economy {
    color: #8cae73;
    padding: 0 20px 0 0;
    font-size: 14px;
  }
  .pay .discount {
    color: #ff7300;
    padding: 0 100px 0 0;
    font-size: 14px;
  }
  .popover {
    position: fixed;
    background: #fff;
    border-radius: 2px;
    transform-origin: center top;
    z-index: 20141408;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647), 0 1px 4px rgba(0, 0, 0, 0.117647);
    font-size: 14px;
  }
  .popoverClass1 {
    padding: 20px;
    left: 40% !important;
    max-height: 200px !important;
    overflow: auto !important;
    margin-top: -15px;
    position: absolute;
  }
  .paymentButton .el-radio-button {
    border-radius: 2px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: none;
  }
  .el-checkbox__inner {
    border: 1px solid#dcdfe6;
  }
  .el-radio-button__inner {
    border: none;
  }
  .sharesChildContent {
    position: absolute;
    top: 110px;
    margin: 0px 50px;
  }
  .ecommerceChildContent {
    position: absolute;
    top: 330px;
    margin: 0px 50px;
  }
  .afterSaleChildContent {
    position: absolute;
    top: 450px;
    margin: 0px 50px;
  }
}
</style>
