<template>
  <biz-grid class="order-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title" v-if="activeNames.indexOf('1')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">客户信息</el-badge>
              </div>
              <!-- <div class="title-class-two">请填写客户信息</div> -->
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('1')===-1||!handler">客户信息</template>
          <el-form-item label="会员昵称" prop="member.nickname" class="isRequired">
            <el-input v-model="form.member.nickname" :disabled="itemId?true:false" placeholder="请选择或添加会员">
              <div slot="append" class="input-append" v-if="!itemId">
                <el-button type="text" @click="addMember">
                  <i class="el-icon-circle-plus-outline"></i>
                </el-button>
                <el-button type="text" @click="showDialogFc">
                  <i class="iconfont biz-icon-man"></i>
                </el-button>
              </div>
            </el-input>
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
          <el-form-item label="车辆" prop="car.id">
            <el-select v-model="form.car.id" @change="carChange" placeholder="请选择车辆" :disabled="itemId!==''">
              <el-option v-for="(car,index) in cars" :key="index" :label="car.plateNumber" :value="car.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车型" prop="car.type">
            <el-input v-model="form.car.type" :disabled="true" placeholder="选择车辆自动带入"></el-input>
          </el-form-item>
          <el-form-item label="行驶里程" prop="car.drivingRange" v-if="!form.plateNumber">
            <el-input v-model="form.car.drivingRange" :disabled="true" placeholder="选择车辆自动带入"></el-input>
          </el-form-item>
          <el-form-item label="行驶里程" prop="drivingRange" v-if="form.plateNumber">
            <el-input v-model="form.drivingRange" :disabled="true" placeholder="选择车辆自动带入"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title" v-if="activeNames.indexOf('2')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">分期信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('2')===-1||!handler">分期信息</template>
          <el-form-item label="意向分期商品">
            <el-select v-model="form.purposeProductBrand" placeholder="请输入品牌" @change="brandProductChange">
              <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="form.purposeProductSeries" placeholder="请输入系列" @change="seriesProductChange">
              <el-option v-for="item in seriesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-input v-model="form.purposeProductName" :disabled="true" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.productPrice" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="金融方案">
            <el-input v-model="form.financialPlanName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label style="margin-left:-60px">
            <el-checkbox-group v-model="form.financings">
              <el-checkbox v-for="(item,index) in financingGroup" :key="index" :label="item.name">
                {{item.name}}
                <el-input v-model="form.purchaseTax" v-if="item.type==='0'" @change="inputChange"></el-input>
                <el-input v-model="form.vehiclevesselTax" v-if="item.type==='1'" @change="inputChange"></el-input>
                <el-input v-model="form.compulsoryInsuranceTax" v-if="item.type==='3'" @change="inputChange"></el-input>
                <el-input v-model="form.cardFeeTax" v-if="item.type==='2'" @change="inputChange"></el-input>
                <el-input v-model="form.serviceChargeTax" v-if="item.type==='999'" @change="inputChange"></el-input>
                <el-input v-model="form.commercialinsurance" v-if="item.type==='998'" @change="inputChange"></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="分期金额">
            <el-input v-model="form.installmentPrice" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="首付额度" v-if="form.specificationDatas[0].valueData">
            <el-select v-model="form.specificationDatas[0].valueData[2].optionValue" @change="priceChange" placeholder="请选择首付额度">
              <el-option v-for="(car,index) in specPrices" :key="index" :label="car.name" :value="car.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分期期数" v-if="form.specificationDatas[0].valueData">
            <el-select v-model="form.specificationDatas[0].valueData[0].optionValue" @change="numSChange" placeholder="请选择分期期数">
              <el-option v-for="(car,index) in specNums" :key="index" :label="car.name" :value="car.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费率/利率" v-if="form.specificationDatas[0].valueData">
            <el-select v-model="form.specificationDatas[0].valueData[1].optionValue" placeholder="请选择费率/利率" :disabled="true">
              <el-option v-for="(car,index) in specRates" :key="index" :label="car.name" :value="car.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手续费">
            <el-input v-model="form.serviceCharge" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="首付">
            <el-input v-model="form.downpaymentPrice" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="每期还款">
            <el-input v-model="form.eachrepaymentPrice" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="每期手续费">
            <el-input v-model="form.eachServiceCharge" :disabled="true"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title" v-if="activeNames.indexOf('3')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">分期资料</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('3')===-1||!handler">分期资料</template>
          <div v-for="(item,index) in uploadInfo" :key="index">
            <el-form-item :label="item.name">
              <el-input v-model="form.infoName" minlength="1" maxlength="20" placeholder="请输入姓名" v-if="item.name==='会员姓名'"></el-input>
              <el-input v-model="form.infoGender" placeholder="请输入性别" v-if="item.name==='性别'"></el-input>
              <el-input v-model="form.infoBirth" placeholder="请输入生日" v-if="item.name==='生日'"></el-input>
              <el-input v-model="form.infoMobile" placeholder="请输入会员电话" v-if="item.name==='会员电话'"></el-input>
              <el-input v-model="form.idCardNo" placeholder="请输入身份证号" v-if="item.name==='身份证号'"></el-input>
              <el-input v-model="form.purposeCar" placeholder="请输入车辆" v-if="item.name==='车辆'"></el-input>
              <el-input v-model="form.purposeCarPrice" placeholder="请输入车辆价格" v-if="item.name==='车辆价格'"></el-input>
              <el-input v-model="form.purposeCarPlate" placeholder="请输入车牌号" v-if="item.name==='车牌号'"></el-input>
              <el-input v-model="form.brand" placeholder="请输入车辆品牌" v-if="item.name==='车辆品牌'"></el-input>
              <el-input v-model="form.series" placeholder="请输入车辆系列" v-if="item.name==='车辆系列'"></el-input>
              <el-input v-model="form.carType" placeholder="请输入车型" v-if="item.name==='车型'"></el-input>
              <el-input v-model="form.vin" placeholder="请输入车辆识别代号" v-if="item.name==='车辆识别代号'"></el-input>
              <el-input v-model="form.engineNo" placeholder="请输入发动机号" v-if="item.name==='发动机号'"></el-input>
              <el-input v-model="form.registerDate" placeholder="请输入注册日期" v-if="item.name==='注册日期'"></el-input>
              <el-input v-model="form.driverLicenseNo" placeholder="请输入驾驶证号" v-if="item.name==='驾驶证号'"></el-input>
              <el-input v-model="form.firstApplyDate" placeholder="请输入驾驶证初次领证日期" v-if="item.name==='驾驶证初次领证日期'"></el-input>
              <el-input v-model="form.validFromTo" placeholder="请输入驾驶证有效起始日期" v-if="item.name==='驾驶证有效起始日期'"></el-input>
              <el-input v-model="form.validPeriod" placeholder="请输入驾驶证有效期" v-if="item.name==='驾驶证有效期'"></el-input>
              <BizAvatarUploaderNew v-model="form.idCardFront" v-if="item.name==='身份证正面照片'"></BizAvatarUploaderNew>
              <BizAvatarUploaderNew v-model="form.idCardBack" v-if="item.name==='身份证反面照片'"></BizAvatarUploaderNew>
              <BizAvatarUploaderNew v-model="form.driverLicensePic" v-if="item.name==='驾驶证照片'"></BizAvatarUploaderNew>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title" v-if="activeNames.indexOf('4')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">订单信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('4')===-1||!handler">订单信息</template>
          <el-form-item label="订单编号" prop="sn" v-if="itemId">
            <el-input v-model="form.sn" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-input v-if="itemId" v-model="form.type" :disabled="true"></el-input>
            <el-select v-model="form.type" v-else :disabled="this.$route.params.orderType==='couponOrder'">
              <el-option v-for="item in orderStateTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单原价" prop="originalAmount" v-if="showInfo">
            <el-input v-model="form.originalAmount" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="调整金额" prop="offsetAmount" v-if="showInfo">
            <el-input-number
              v-model="form.offsetAmount"
              controls-position="right"
              :disabled="itemId!==''&&form.paymentStatus==='2'||form.type==='订单关闭'"
              @change="offsetAmountChange"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="订单现价" prop="amount" v-if="showInfo">
            <el-input v-model="form.curAmount" @change="curAmountChange" :disabled="itemId!==''&&form.paymentStatus==='2'||form.type==='订单关闭'"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="5">
          <template slot="title" v-if="activeNames.indexOf('5')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">服务信息</el-badge>
              </div>
              <!-- <div class="title-class-two">请填写服务信息</div> -->
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('5')===-1||!handler">服务信息</template>
          <el-form-item label="到店日期">
            <el-date-picker v-model="form.arrivalTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择开始时间" :disabled="!!itemId&&handler!=='service'"></el-date-picker>
          </el-form-item>
          <el-form-item label="顾问" prop="consultant.id" class="isRequired">
            <el-select v-model="form.consultant.id" placeholder="请选择顾问">
              <el-option v-for="(consultant,index) in consultants" :key="index" :label="consultant.name || '未填写'" :value="consultant.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="买家留言" prop="memo">
            <el-input v-model="form.memo" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="6" v-if="showPayment||(!itemId&&form.type==='0')">
          <template slot="title" v-if="activeNames.indexOf('6')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">付款信息</el-badge>
              </div>
              <!-- <div class="title-class-two">请填写付款信息</div> -->
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('6')===-1||!handler||(!itemId&&form.type==='0')">付款信息</template>
          <el-form-item label="支付方式" prop="paymentMethodId" class="isRequired" v-if="itemId||(!itemId&&form.type==='0')">
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
        <el-collapse-item title="优惠信息" name="7" v-if="showInfo">
          <div v-if="itemId">
            <el-form-item label="优惠券折扣" prop="couponDiscount">
              <el-input v-model="form.couponDiscount" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="V豆抵扣" prop="bean">
              <el-input-number v-model="form.bean" :disabled="true" controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item label="赠送积分" prop="point">
              <el-input v-model="form.point" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="赠送V豆" prop="giftBean">
              <el-input v-model="form.giftBean" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="福利" prop="couponDiscount">
              <el-select v-model="form.couponCodeId" placeholder="请选择" @change="couponChange">
                <el-option v-for="coupon in form.couponList" :key="coupon.id" :label="coupon.coupon.name" :value="coupon.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="V豆抵扣" prop="bean">
              <el-input-number
                v-model="form.bean"
                controls-position="right"
                :disabled="!(form.payments[0].paymentType==='会员卡余额'&&form.memberCardId&&form.bean)"
                @change="beanChange"
                :min="0"
              ></el-input-number>
              <div v-if="form.payments[0].paymentType==='会员卡余额'&&form.memberCardId">{{beanCanUse}}</div>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item name="8">
          <template slot="title" v-if="activeNames.indexOf('8')!==-1&&handler">
            <div class="title-class">
              <div class="title-class-one">
                <el-badge is-dot class="item">发票信息</el-badge>
              </div>
            </div>
          </template>
          <template slot="title" v-if="activeNames.indexOf('8')===-1||!handler">发票信息</template>
          <el-form-item label="是否需要发票" prop="invoiceState">
            <el-select v-model="form.invoiceState" :disabled="true">
              <el-option label="否" value="否"></el-option>
              <el-option label="是" value="是"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="其他信息" name="9" v-if="showInfo">
          <el-form-item label="创建时间">
            <el-input v-model="form.orderTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="执行时间">
            <el-input v-model="form.deliveryTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="付款时间">
            <el-input v-model="form.paymentTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-input v-model="form.completeTime" :disabled="true"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-dialog title="创建会员" :visible.sync="dialogVisible" width="50%" :appendToBody="true">
      <el-form :model="formModel" label-width="120px" ref="dialogFormModel" size="small" :rules="dialogRules" :inline-message="true">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formModel.mobile" placeholder="请输入手机号，如1888888888" @blur="mobileBlur"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formModel.userName" placeholder="请输入用户名，如1888888888"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formModel.nickname" placeholder="请输入昵称，如1888888888"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入姓名，如张三"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formModel.password" type="text" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formModel.gender">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
            <el-radio label="2">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="formModel.defaultCarInfo.plateNumber" placeholder="请输入车牌号，如浙12345"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="formModel.defaultCarInfo.brand" placeholder="请选择，如宝马" filterable style="width: 100%;" @change="brandChange">
            <el-option v-for="(item,index) in brandData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列">
          <el-select v-model="formModel.defaultCarInfo.series" placeholder="请选择，如宝马3系" filterable style="width: 100%;" @change="seriesChange">
            <el-option v-for="(item,index) in seriesData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="formModel.defaultCarInfo.type" placeholder="请选择，如宝马3系2016款" style="width: 100%;">
            <el-option v-for="(item,index) in modeData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆识别代码">
          <el-input v-model="formModel.defaultCarInfo.vin" placeholder="请输入车辆识别代码，如1G1BL52P7TR115520"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="createMember()" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <biz-dialog-selector
      title="选择会员"
      :visibility.sync="showDialog"
      :appendToBody="true"
      :keyField="'id'"
      :selectionKeys="selectionKeys"
      :loading="dialogLoading"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :filters="dialogFilters"
      @confirmed="handleConfirmed"
      @open="opened"
      @operate="dialogOperate"
      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="memberDialog"
    >
      <el-table-column label="用户名" width="200px">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="createDate" label="创建日期" :formatter="createDateConverter" sortable="custom"></el-table-column>
      <el-table-column label="状态" :formatter="stateConverter"></el-table-column>
      <el-table-column prop label="店铺名称">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginIp" label="最后登录地址">
        <template slot-scope="scope">
          <div class="customer-info">
            <span style="display:block">{{scope.row.loginAddress||scope.row.lastLoginIp}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginDate" label="最后登录时间" :formatter="loginDateConverter" sortable="custom"></el-table-column>
    </biz-dialog-selector>

    <biz-dialog-selector
      title="选择车型"
      :visibility.sync="showProductSelector"
      :tableData="productTableData"
      :pagination="productPagination"
      :selectionMode="'single'"
      @pageSizeChange="productPageSizeChange"
      @currentPageChange="productCurrentPageChange"
      @confirmed="confirmedProduct"
    >
      <el-table-column property="fullName" label="名称"></el-table-column>
      <el-table-column property="price" label="销售价"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
import BizSaveButton from '@/components/BizSaveButton';
import dateInterval from '@/utils/gmttime-interval';
import dateUtil from '@/utils/date';
import BizDialogSelector from './components/BizDialogSelector';
import { mapGetters } from 'vuex';
import vehicleBaseInfo from '@/service/vehicle-mgmt/VehicleBaseInfo';
import { BizAvatarUploaderNew } from '@/components/BizForm';
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
      type: String
    },
    activeNames: {
      type: Array,
      default() {
        return ['1', '2', '3', '4', '5'];
      }
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector,
    BizAvatarUploaderNew
  },
  data() {
    return {
      isShipped: false,
      beanCanUse: '',
      maxOffsetBean: 0,
      minOffsetBean: 0,
      originalAmount: '',
      orderStateTypeList: [
        { label: '订单已执行', value: '1' },
        { label: '交易完成', value: '2' },
        { label: '商家已确认', value: '0' }
      ],
      beanRate: 0,
      tagList: [],
      tax: 0,
      detailId: '',
      selectedTags: [],
      restaurants: [],
      financingGroup: [],
      brandId: '',
      seriesId: '',
      name: '',
      seriesOptions: [],
      specPrices: [],
      specNums: [],
      specRates: [],
      brandOptions: [],
      productList: [],
      specInfo: [],
      uploadInfo: [],
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
      formModel: {
        userName: '',
        mobile: '',
        name: '',
        password: '123456',
        nickname: '',
        gender: '2',
        defaultCarInfo: {
          plateNumber: '',
          brand: '',
          series: '',
          type: '',
          vin: ''
        }
      },
      form: {
        bean: '',
        financings: [],
        financialPlanId: '',
        selectedPlanId: '',
        purposeProductName: '',
        purposeProductBrand: '',
        purposeProductSeries: '',
        financialPlanName: '',
        productPrice: '',
        totalPrice: '',
        purposeProductId: '',
        discountPrice: '',
        installmentPrice: '',
        downpaymentPrice: '',
        eachrepaymentPrice: '',
        serviceCharge: '',
        infoName: '',
        infoMobile: '',
        infoGender: '',
        infoBirth: '',
        purposeCar: '',
        purposeCarPlate: '',
        purposeCarPrice: '',
        brand: '',
        series: '',
        carType: '',
        vin: '',
        engineNo: '',
        registerDate: '',
        firstApplyDate: '',
        validFromTo: '',
        validPeriod: '',
        eachServiceCharge: '',
        idCardNo: '',
        idCardFront: '',
        idCardBack: '',
        driverLicenseNo: '',
        driverLicensePic: '',
        purchaseTax: '',
        vehiclevesselTax: '',
        compulsoryInsuranceTax: '',
        cardFeeTax: '',
        serviceChargeTax: '',
        commercialinsurance: '',
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
        invoiceState: '否',
        orderTime: '',
        deliveryTime: '',
        paymentTime: '',
        completeTime: '',
        specificationDatas: [{ valueData: [{ optionValue: '' }, { optionValue: '' }, { optionValue: '' }] }],
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
      productPagination: {
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
          placeholder: '请输入店铺名称',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['currentUser']),
    getCouponCode() {
      let curCoupon;
      this.form.couponList.forEach(item => {
        if (item.id === this.form.couponCodeId) {
          curCoupon = item;
          return false;
        }
      });
      return curCoupon;
    },
    showInfo() {
      return (
        this.$route.params.orderType === 'product' ||
        this.$route.params.orderType === 'car' ||
        this.$route.params.orderType === 'general' ||
        this.$route.params.orderType === 'service' ||
        this.$route.params.orderType === 'rescue' ||
        this.$route.params.orderType === 'couponOrder'
      );
    },
    showPayment() {
      if (
        this.$route.params.orderType === 'product' ||
        this.$route.params.orderType === 'car' ||
        this.$route.params.orderType === 'general' ||
        this.$route.params.orderType === 'service' ||
        this.$route.params.orderType === 'rescue' ||
        this.$route.params.orderType === 'couponOrder'
      ) {
        if (this.itemId) {
          return true;
        } else {
          return this.form.type !== '1';
        }
      } else {
        return false;
      }
    },
    isCreate() {
      return !this.itemId;
    }
  },
  created() {
    this.queryBrandList();
    this.getBrandList();
    this.getFinancialPlans();
    !this.itemId && this.orderOptions();
    this.getStoreTags();
    this.testDrives();
  },
  watch: {
    itemId(val) {
      this.itemId && this.init();
      if (!this.itemId) {
        this.resetFormData();
        this.form.type = '2';
        this.getStoreTags();
      }
    },
    open(val) {
      this.isShipped = false;
      if (!this.itemId && val && this.isCreated) {
        this.resetFormData();
      }
      if (this.itemId) {
        this.init();
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
        financings: [],
        curAmount: '',
        couponCodeId: '',
        couponCode: {},
        couponList: [],
        purposeProductName: '',
        purposeProductBrand: '',
        purposeProductSeries: '',
        financialPlanName: '',
        productPrice: '',
        discountPrice: '',
        installmentPrice: '',
        downpaymentPrice: '',
        eachrepaymentPrice: '',
        serviceCharge: '',
        infoName: '',
        infoMobile: '',
        infoGender: '',
        infoBirth: '',
        purposeCar: '',
        purposeCarPlate: '',
        purposeCarPrice: '',
        brand: '',
        series: '',
        carType: '',
        vin: '',
        engineNo: '',
        registerDate: '',
        firstApplyDate: '',
        validFromTo: '',
        validPeriod: '',
        eachServiceCharge: '',
        idCardNo: '',
        idCardFront: '',
        idCardBack: '',
        driverLicensePic: '',
        purchaseTax: '',
        vehiclevesselTax: '',
        compulsoryInsuranceTax: '',
        cardFeeTax: '',
        serviceChargeTax: '',
        commercialinsurance: '',
        specificationDatas: [{ valueData: [{ optionValue: '' }, { optionValue: '' }, { optionValue: '' }] }],
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
        invoiceState: '否',
        orderTime: '',
        deliveryTime: '',
        paymentTime: '',
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
    onInputName() {},
    selectName() {},
    mobileBlur() {
      if (!this.formModel.id && !this.formModel.nickname) {
        this.$set(this.formModel, 'nickname', this.formModel.mobile);
      }
      if (!this.formModel.id && !this.formModel.userName) {
        this.$set(this.formModel, 'userName', this.formModel.mobile);
      }
    },
    brandChange(val) {
      this.getSeriesList(val);

      this.formModel.defaultCarInfo.series = '';
      this.formModel.defaultCarInfo.type = '';
    },
    seriesChange(val) {
      this.getModeList(val);

      this.formModel.defaultCarInfo.type = '';
    },
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
    beanChange() {
      this.getOriginalAmount();
    },
    getOriginalAmount() {
      if (!this.isCreate) {
        return;
      }
      console.log(123);
      this.form.originalAmount = (
        Number(this.originalAmount) -
        Number(this.form.bean * this.beanRate || '0') -
        Number(this.form.couponDiscount || '0') +
        Number(this.form.shippings[0].freight || '0')
      ).toFixed(2);
      this.getCurAmount();
    },
    getCurAmount() {
      this.form.curAmount = (Number(this.form.originalAmount) + Number(this.form.offsetAmount || '0')).toFixed(2);
      if (this.form.curAmount <= 0) {
        this.form.curAmount = 0.0;
      }
      this.form.curAmount = this.form.curAmount.toString();
    },
    freightChange() {
      this.getOriginalAmount();
    },
    offsetAmountChange() {
      this.getCurAmount();
    },
    curAmountChange() {
      this.form.offsetAmount =
        Number(this.form.curAmount) +
        Number(this.form.bean * this.beanRate) +
        Number(this.form.couponDiscount) -
        Number(this.form.originalAmount);
      this.form.offsetAmount = this.form.offsetAmount.toString();
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
    dateInterval(val, val1) {
      if (val && val1) {
        return dateInterval(val.split(' ')[1], val1.split(' ')[1]);
      }
    },
    showDialogFc() {
      this.showDialog = true;
      this.dialogFilters[0].value = '';
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
    queryProduct() {
      service.listProductByTestDrive(
        {
          clientType: '2',
          methodName: 'ListProductByTestDrive',
          shopId: this.getUser().shop ? this.getUser().shop.id : '' || window.top.SHOP_ID,
          pageSize: this.productPagination.pageSize,
          pageNumber: this.productPagination.currentPage
        },
        data => {
          this.productTableData = data.content;
          this.showProductSelector = true;
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    confirmedProduct(selectionKeys, selections) {
      this.form.orderItems[0].appointment.product.id = selections[0].id;
      this.form.financialPlanId = selections[0].id;
      this.form.orderItems[0].appointment.product.fullName = selections[0].fullName;
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.member.nickname = selections[0].nickname;
      // this.form.member.gender = selections[0].gender;
      this.form.member.mobile = selections[0].mobile;
      this.form.memberCardId = '';
      this.form.userId = selections[0].id;
      this.$set(this.form.member, 'gender', selections[0].gender);
      this.$set(this.form, 'selectionKeys', selectionKeys);
      this.listExistCardTemplate();
      // this.form.car.id = '';
      this.form.plateNumber = selections[0].defaultCarInfo.plateNumber;
      this.form.drivingRange = selections[0].defaultCarInfo.drivingRange || '';
      this.form.car.type = selections[0].defaultCarInfo.type || '';
      this.form.car.drivingRange = '';
      if (!this.form.shippings[0].address || !this.itemId) {
        this.form.shippings[0].address = selections[0].defaultReceiver.areaName + selections[0].defaultReceiver.address;
      }
      if (!this.form.shippings[0].consignee || !this.itemId) {
        this.form.shippings[0].consignee = selections[0].name;
      }
      if (!this.form.shippings[0].phone || !this.itemId) {
        this.form.shippings[0].phone = selections[0].mobile;
      }
      this.carOptions(this.form.userId);
      this.getCouponList();
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
    carChange(val) {
      this.cars.map(item => {
        if (item.id === val) {
          this.form.car.type = item.type;
          this.form.car.drivingRange = item.drivingRange;
          this.form.drivingRange = item.drivingRange;
        }
      });
    },
    createMember() {
      this.$refs.dialogFormModel.validate((valid, a) => {
        if (valid) {
          service.createMember(
            this.formModel,
            data => {
              this.loading = false;
              this.$message.success('保存成功');
              this.dialogVisible = false;
              this.form.member.nickname = data.data.name;
              this.form.member.gender = data.data.gender;
              this.form.member.mobile = data.data.mobile;
              this.form.userId = data.data.id;
              if (data.data.defaultCarInfo) {
                this.cars.push({
                  plateNumber: data.data.defaultCarInfo.plateNumber,
                  id: data.data.defaultCarInfo.id,
                  type: data.data.defaultCarInfo.type
                });
                this.form.car.id = data.data.defaultCarInfo.id;
                this.form.car.type = data.data.defaultCarInfo.type;
              }
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
    resetFormData() {
      this.form = this.getDefaultForm();
      // this.$refs.form.resetFields();
      this.form.userId = '';
      this.form.memberCardId = '';
      this.listExistCard = [];
      this.form.member = {};
      // this.form.shippings[0] = {};
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
      this.form.orderItems[0].appointment.product.brandId = '';
      this.form.orderItems[0].appointment.product.seriesId = '';
      this.form.orderItems[0].appointment.product.id = '';
    },
    init() {
      service.viewOrder(
        this.getSaveParams(),
        data => {
          this.form = Object.assign(this.getDefaultForm(), data.order);
          this.getUploadInfo(this.form.products[0].id);
          this.getSpecInfo(this.form.products[0].id);
          this.getFinancePlan(this.form.products[0].id);
          this.financingGroup.forEach(item => {
            if (this.form.purchaseTax && item.name === '购置税') {
              this.form.financings.push(item.name);
            } else if (this.form.vehiclevesselTax && item.name === '车船税') {
              this.form.financings.push(item.name);
            } else if (this.form.compulsoryInsuranceTax && item.name === '交强险') {
              this.form.financings.push(item.name);
            } else if (this.form.cardFeeTax && item.name === '上牌费') {
              this.form.financings.push(item.name);
            } else if (this.form.serviceChargeTax && item.name === '服务费') {
              this.form.financings.push(item.name);
            } else if (this.form.commercialinsurance && item.name === '商业保险') {
              this.form.financings.push(item.name);
            }
          });
          this.form.curAmount = Number(this.form.originalAmount) + Number(this.form.offsetAmount);
          console.log(this.form);
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
          if (
            this.form.orderItems[0].appointment &&
            this.form.orderItems[0].appointment.product &&
            this.form.orderItems[0].appointment.product.brandId
          ) {
            this.querySeriesList(this.form.orderItems[0].appointment.product.brandId);
          }
          if (
            this.form.orderItems[0].appointment &&
            this.form.orderItems[0].appointment.product &&
            this.form.orderItems[0].appointment.product.seriesId
          ) {
            this.queryTypeList(this.form.orderItems[0].appointment.product.seriesId);
          }
          if (data.order.appointmentDate) {
            this.appointmentDate = data.order.appointmentDate;
          }
          if (this.form.orderItems[0].appointment && this.form.orderItems[0].appointment.reasons) {
            this.form.orderItems[0].appointment.reasons = this.form.orderItems[0].appointment.reasons.map(item => {
              return item.id;
            });
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
          this.reasons = data.reasons;
          this.adminCurrent = [{ id: data.adminCurrent.id, name: data.adminCurrent.realName }];
          if (!this.form.consultant.id) {
            this.form.consultant = { id: data.adminCurrent.id };
          } else {
            this.adminCurrent = [{ id: this.form.consultant.id, name: this.form.consultant.realName }];
          }
          if (this.form.area) {
            this.areaId = this.form.area.id;
          }
          if (this.$route.params.orderType === 'rescue') {
            this.imageList = this.form.orderItems[0].appointment.images.map(item => {
              return { url: item.path };
            });
          }
          this.form.type = this.getOrderStatus(this.form.type);
          this.listExistCardTemplate();
          this.listAdminByRole();
          if (this.form.orderType === '2') {
            console.log('查询映射', this.form.orderType);
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
        this.form.bean = '';
        this.getOriginalAmount();
      }
    },
    memberCardChange() {
      this.getMemberCardInfo();
    },
    getMemberCardInfo() {
      let param = {
        userCardId: this.form.memberCardId
      };
      http
        .get('/admin/memberCard/memberCard.jhtml', param)
        .then(data => {
          this.form.bean = data.content.bean;
          this.beanCanUse = '可用 ' + this.form.bean;
          this.getBeanRate();
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
          if (this.form.bean > data.maxOffsetBean) {
            this.form.bean = data.maxOffsetBean;
          }
          if (Number(this.form.bean) < this.minOffsetBean || this.form.bean === '0') {
            this.beanCanUse = 'V豆不足, V豆抵扣范围[' + this.minOffsetBean + ', ' + this.maxOffsetBean + ']';
          } else {
            this.beanCanUse = 'V豆抵扣范围[' + this.minOffsetBean + ', ' + this.maxOffsetBean + ']';
          }
          this.beanChange();
        })
        .catch(ErrorData => {
          if (ErrorData.errorMessage) {
            console.log(ErrorData.errorMessage);
          }
        });
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
    loanTerm(id) {
      service.loanTerms(
        { financialId: id },
        data => {
          this.loading = false;
          this.form.orderItems[0].appointment.financialPlan.downPayments = [
            data.downPayment,
            data.downPayment + 10,
            data.downPayment + 20,
            data.downPayment + 30
          ];
          this.form.orderItems[0].appointment.downPayment = '';
          this.form.orderItems[0].appointment.financialPlan.loanTerms = data.loanTerms;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    orderOptions() {
      let containMemberPayment = false;
      this.form.type = '交易完成';
      service.options(
        { shopId: window.top.SHOP_ID },
        data => {
          this.loading = false;
          this.paymentMethods = data.paymentMethods;
          this.paymentTypes = data.paymentTypes;
          this.shippingMethod = data.shippingMethods;
          this.deliveryCorps = data.deliveryCorps;
          this.reasons = data.reasons;
          this.rescueOrganizations = data.rescueOrganizations;
          this.workers = data.workers;
          this.adminCurrent = [{ id: data.adminCurrent.id, name: data.adminCurrent.realName }];
          this.form.consultant = { id: data.adminCurrent.id };
          this.listAdminByRole();
          if (!this.itemId && this.showInfo) {
            this.paymentTypes.forEach(item => {
              if (item.name === '会员卡余额') {
                containMemberPayment = true;
                return false;
              }
            });
            if (containMemberPayment) {
              this.form.payments[0].paymentType = '会员卡余额';
            } else {
              this.form.payments[0].paymentType = this.paymentTypes[0].name;
            }
          }
          if (this.form.userId) {
            this.listExistCardTemplate();
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          ErrorData.errorMessage !== '店铺不存在' && this.$message.warning(ErrorData.errorMessage);
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
      if (this.reasons && this.reasons.length > 0 && this.itemId && this.form.orderItems[0].appointment) {
        this.form.orderItems[0].appointment.reasons = this.reasons.map(item => {
          if (
            this.form.orderItems[0].appointment &&
            this.form.orderItems[0].appointment.reasons &&
            this.form.orderItems[0].appointment.reasons.indexOf(item.id) !== -1
          ) {
            return { id: item.id, content: item.content };
          } else {
            return { id: '', content: '' };
          }
        });
      }
      if (this.form.consultant.id === '') {
        this.$message.warning('请输入顾问');
        return false;
      }
      if (this.$route.params.orderType === 'ride') {
        console.log(this.form.orderItems[0].appointment.plateNumber);
        if (this.form.orderItems[0].appointment.plateNumber === '') {
          this.$message.warning('请输入体验车号');
          return false;
        }
        if (this.form.orderItems[0].appointment.product.fullName === '') {
          this.$message.warning('请输入体验车型');
          return false;
        }
      }

      if (!this.itemId) {
        if (Number(this.form.bean) < this.minOffsetBean && Number(this.form.beanDiscount) > 0) {
          this.$message.warning('V豆不足');
          return;
        }
        if (Number(this.form.bean) < this.minOffsetBean || Number(this.form.bean) > this.maxOffsetBean) {
          this.$message.warning('V豆抵扣数值不在可用范围内');
          return;
        }
      }

      if (!this.itemId) {
        if (
          (this.$route.params.orderType === 'rescue' ||
            this.$route.params.orderType === 'product' ||
            this.$route.params.orderType === 'car' ||
            this.$route.params.orderType === 'service' ||
            this.$route.params.orderType === 'general') &&
          !this.form.payments[0].paymentType
        ) {
          this.$message.warning('请输入付款信息');
          this.loading = false;
          return false;
        }
        this.createOrder();
      } else {
        if (this.handler === 'shipping') {
          this.loading = true;
          this.shippingMethod.map(item => {
            if (item.name === this.form.shippingMethodName) {
              this.form.shippingMethodId = item.id;
            }
          });
          this.form.deliveryCorpId = this.form.shippings[0].deliveryCorpId;
          if (this.showDelivery) {
            // if (this.form.shippings[0].zipCode === '' || (!(/^\d{6}$/.test(this.form.shippings[0].zipCode)))) {
            //   this.$message.warning('请输入正确的邮编');
            //   this.loading = false;
            //   return false;
            // }
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
            if (this.form.shippings[0].freight === '' || !/^(0|[0-9][0-9]*)(\.\d+)?$/.test(this.form.shippings[0].freight)) {
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
          // 付款操作
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
            ((this.$route.params.orderType === 'rescue' ||
              this.$route.params.orderType === 'product' ||
              this.$route.params.orderType === 'car' ||
              this.$route.params.orderType === 'service' ||
              this.$route.params.orderType === 'general') &&
              !this.form.payments[0].paymentType) ||
            ((this.$route.params.orderType === 'rescue' ||
              this.$route.params.orderType === 'product' ||
              this.$route.params.orderType === 'car' ||
              this.$route.params.orderType === 'service' ||
              this.$route.params.orderType === 'general') &&
              (this.form.payments[0].paymentType === '刷卡' || this.form.payments[0].paymentType === '汇款') &&
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
      }

      let name = this.deliveryCorps.find(deliveryCorp => {
        return deliveryCorp.id === this.form.shippings[0].deliveryCorpId;
      }).name;
      if (this.handler === 'shipping' && name === '新悦物流') {
        this.submitOrder();
      }
    },
    getFinancePlan(productId) {
      let params = {
        planId: productId,
        shopId: window.top.SHOP_ID || this.getUser().shop.id
      };
      http
        .get('/admin/financialInsuranceProduct/financiaPlanOtherTaxInfo.jhtml', params)
        .then(data => {
          this.financingGroup = data.datas;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    priceChange(val) {
      this.specNums = [];
      this.form.specificationDatas[0].valueData[1].optionValue = '';
      this.form.specificationDatas[0].valueData[0].optionValue = '';
      this.specInfo.forEach(item => {
        item.specificationValueDatas.forEach(value => {
          if (value.id === val) {
            this.specNums.push({ id: item.specificationValueDatas[0].id, name: item.specificationValueDatas[0].name });
            // this.form.specificationDatas[0].valueData[0].optionValue = item.specificationValueDatas[0].name;
            // this.form.specificationDatas[0].valueData[1].optionValue = item.specificationValueDatas[1].name;
            // this.form.selectedPlanId = item.productData.id;
          }
        });
      });
    },
    numSChange(val) {
      this.form.installmentPrice = '';
      this.form.downPaymentPrice = '';
      this.form.serviceCharge = '';
      this.form.eachrepaymentPrice = '';
      this.form.eachServiceCharge = '';
      this.specInfo.forEach(item => {
        item.specificationValueDatas.forEach(value => {
          if (value.id === val) {
            this.specRates.push({ id: item.specificationValueDatas[1].id, name: item.specificationValueDatas[1].name });
            // this.form.specificationDatas[0].valueData[0].optionValue = item.specificationValueDatas[0].name;
            this.form.specificationDatas[0].valueData[1].optionValue = item.specificationValueDatas[1].name;
            this.form.selectedPlanId = item.productData.id;
            this.form.installmentPrice = ((Number(this.form.productPrice) - (Number(item.specificationValueDatas[2].name) * 0.01) * Number(this.form.productPrice))).toFixed(2);
            this.form.downpaymentPrice = (Number(item.specificationValueDatas[2].name) * 0.01 * Number(this.form.productPrice)).toFixed(2);
            this.form.serviceCharge = ((Number(this.form.productPrice) - Number(item.specificationValueDatas[2].name) * 0.01 * Number(this.form.productPrice)) * Number(item.specificationValueDatas[1].name) * 0.01).toFixed(2);
            this.form.eachrepaymentPrice = (((Number(this.form.productPrice) - (Number(item.specificationValueDatas[2].name) * 0.01) * Number(this.form.productPrice)) + ((Number(this.form.productPrice) - Number(item.specificationValueDatas[2].name) * 0.01 * Number(this.form.productPrice)) * Number(item.specificationValueDatas[1].name) * 0.01)) / Number(item.specificationValueDatas[0].name)).toFixed(2);
            this.form.eachServiceCharge = (((Number(this.form.productPrice) - Number(item.specificationValueDatas[2].name) * 0.01 * Number(this.form.productPrice)) * Number(item.specificationValueDatas[1].name) * 0.01) / Number(item.specificationValueDatas[0].name)).toFixed(2);
          }
        });
      });
    },
    getSpecInfo(productId) {
      let params = {
        id: productId,
        shopId: window.top.SHOP_ID || this.getUser().shop.id
      };
      http
        .get('/admin/shopProduct/productSpecifications.jhtml', params)
        .then(data => {
          this.specInfo = data.allProductSpecifications;
          this.specPrices = data.categorySpecifications[0].specificationValueData;
          this.specNums = data.categorySpecifications[1].specificationValueData;
          this.specRates = data.categorySpecifications[2].specificationValueData;
          // data.categorySpecifications.forEach(item => {
          //   this.specPrices.push({
          //     productId: item.id,
          //     id: item.specificationValueDatas[0].id,
          //     name: item.specificationValueDatas[0].name
          //   });
          //   // this.specNums.push({ id: item.specificationValueDatas[1].id, name: item.specificationValueDatas[1].name });
          //   // this.specRates.push({ id: item.specificationValueDatas[2].id, name: item.specificationValueDatas[2].name });
          //   // this.form.specificationDatas[0].valueData[0].optionValue = this.specPrices[0].name;
          // });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getProductList(productId) {
      let params = {
        id: productId,
        shopId: window.top.SHOP_ID || this.getUser().shop.id
      };
      http
        .get('/admin/productShippingFinancialController/queryFinancialShippingProduct.jhtml', params)
        .then(data => {
          this.productList = data.products;
          data.products.forEach((item, index) => {
            this.brandOptions.push({ id: item.brandId, name: item.brandName });
          });
          let tmp = new Map();
          this.brandOptions = this.brandOptions.filter(arr => !tmp.has(arr.brandId) && tmp.set(arr.brandId, 1));
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    brandProductChange(val) {
      this.productList.forEach((item, index) => {
        if (item.brandId === val) {
          this.seriesOptions.push({ productId: item.id, id: item.seriesId, brandId: item.brandId, name: item.seriesName });
        }
      });
    },
    seriesProductChange(val) {
      this.productList.forEach((item, index) => {
        if (item.seriesId === val) {
          this.form.purposeProductName = item.name;
          this.form.purposeProductId = item.id;
          this.form.productPrice = item.price;
        }
      });
      let params = {
        planId: this.form.financialPlanId,
        productId: this.form.purposeProductId,
        otherTax: this.tax,
        shopId: window.top.SHOP_ID || this.getUser().shop.id
      };
      http
        .get('/admin/financialInsuranceProduct/productFinanciaPlanDetail.jhtml', params)
        .then(data => {
          data.specificationGroups.forEach(item => {
            if (item.productId === data.planId) {
              this.form.financialPlanName = data.planName;
              this.form.installmentPrice = item.installmentPrice;
              this.form.downpaymentPrice = item.downpaymentPrice;
              this.form.serviceCharge = item.serviceCharge;
              this.form.eachrepaymentPrice = item.eachrepaymentPrice;
              this.form.eachServiceCharge = item.eachServiceCharge;
              this.form.selectedPlanId = data.planId;
              if (item.specificationValue && item.specificationValue.length > 0) {
                this.form.specificationDatas[0].valueData[0].optionValue = item.specificationValue[0].name;
                this.form.specificationDatas[0].valueData[1].optionValue = item.specificationValue[1].name;
                this.form.specificationDatas[0].valueData[2].optionValue = item.specificationValue[2].name;
              }
            }
          });
          this.form.totalPrice = data.totalPrice;
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getUploadInfo(productId) {
      let params = {
        planId: productId,
        shopId: window.top.SHOP_ID || this.getUser().shop.id
      };
      http
        .get('/admin/financialInsuranceProduct/financiaPlanPersonalInfo.jhtml', params)
        .then(data => {
          this.uploadInfo = data.attributeDatas;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    inputChange(val) {
      this.tax = 0;
      if (this.form.financings) {
        for (const item of this.form.financings) {
          if (item === '购置税') {
            this.tax += Number(this.form.purchaseTax);
          } else if (item === '车船税') {
            this.tax += Number(this.form.vehiclevesselTax);
          } else if (item === '交强险') {
            this.tax += Number(this.form.compulsoryInsuranceTax);
          } else if (item === '上牌费') {
            this.tax += Number(this.form.cardFeeTax);
          } else if (item === '服务费') {
            this.tax += Number(this.form.serviceChargeTax);
          } else {
            this.tax += Number(this.form.commercialinsurance);
          }
        }
      }
    },
    setOrderItems(val) {
      this.orderItems = val;
      this.orderItems.forEach(item => {
        item.productId = item.productId ? item.productId : item.id;
        this.form.financialPlanName = item.fullName;
        this.form.financialPlanId = item.productId;
        this.getProductList(item.productId);
        this.getFinancePlan(item.productId);
        this.getUploadInfo(item.productId);
        this.getSpecInfo(item.productId);
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
    getOrderApply() {
      let params = {
        userId: this.form.userId,
        shopId: window.top.SHOP_ID || this.getUser().shop.id,
        productId: this.form.purposeProductId,
        productName: this.form.purposeProductName,
        planId: this.form.financialPlanId,
        planName: this.form.financialPlanName,
        selectedPlanId: this.form.selectedPlanId,
        productPrice: this.form.productPrice,
        discountPrice: this.form.discountPrice,
        totalPrice: this.form.totalPrice,
        installmentPrice: this.form.installmentPrice,
        serviceCharge: this.form.serviceCharge,
        downpaymentPrice: this.form.downpaymentPrice,
        eachrepaymentPrice: this.form.eachrepaymentPrice,
        arrivalTime: this.form.arrivalTime,
        memberName: this.form.infoName,
        memberMobile: this.form.infoMobile,
        memberGender: this.form.infoGender,
        memberBirth: this.form.infoBirth,
        idCardNo: this.form.idCardNo,
        car: this.form.purposeCar,
        carPrice: this.form.purposeCarPrice,
        carPlate: this.form.purposeCarPlate,
        brand: this.form.brand,
        series: this.form.series,
        carType: this.form.carType,
        vin: this.form.vin,
        engineNo: this.form.engineNo,
        registerDate: this.form.registerDate,
        driverLicenseNo: this.form.driverLicenseNo,
        firstApplyDate: this.form.firstApplyDate,
        validFromTo: this.form.validFromTo,
        validPeriod: this.form.validPeriod,
        idCardFront: this.form.idCardFront,
        idCardBack: this.form.idCardBack,
        driverLicensePic: this.form.driverLicensePic
      };
      http
        .post('/admin/financialInsuranceProduct/applyInstallment.jhtml', params)
        .then(data => {
          this.detailId = data.detailId;
          this.createdOrderList();
          this.loading = false;
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
          this.loading = false;
        });
    },
    createdOrderList() {
      service.createOrder(
        {
          appointmentData: this.form.orderItems[0].appointment,
          appointmentDate: this.form.appointmentDate,
          appointmentEndDate: this.form.appointmentEndDate,
          sn: this.form.sn,
          type: this.form.type,
          orderType: '20',
          financialDetailId: this.detailId,
          orderStatus: this.form.type === '交易完成' ? '2' : this.form.type,
          bean: this.form.bean,
          couponCode: this.getCouponCode,
          amount: this.form.amount,
          amountPrepay: this.form.amountPrepay,
          paymentTypeId: this.form.paymentTypeId,
          shippingMethod: { id: this.form.shippingMethodId },
          amountFinalpay: this.form.amountFinalpay,
          originalAmount: this.form.originalAmount,
          offsetAmount: this.form.offsetAmount,
          freight: this.form.shippings && this.form.shippings.length ? this.form.shippings[0].freight : '',
          memberCardId: this.form.memberCardId,
          amountPaid: this.form.curAmount,
          userId: this.form.userId,
          consultant: { id: this.form.consultant.id },
          car: {
            id: this.form.car.id
          },
          area: { id: this.areaId },
          address: this.form.address,
          areaName: this.form.areaName,
          consignee: this.form.consignee,
          phone: this.form.phone,
          zipCode: this.form.zipCode,
          remarks: this.form.remarks,
          memo: this.form.memo,
          promotionDiscount: this.form.promotionDiscount,
          couponDiscount: this.form.couponDiscount,
          beanDiscount: this.form.beanDiscount,
          point: this.form.point,
          giftBean: this.form.giftBean,
          shippingMethodName: this.form.shippingMethodName,
          paymentMethodId: this.form.paymentMethodId,
          invoiceState: this.form.invoiceState,
          orderTime: this.form.orderTime,
          deliveryTime: this.form.deliveryTime,
          paymentTime: this.form.paymentTime,
          completeTime: this.form.completeTime,
          orderItems: this.orderItems,
          payments: [
            {
              paymentType: this.form.payments[0].paymentType,
              payBank: this.form.payments[0].payBank,
              payAccount: this.form.payments[0].payAccount
            }
          ],
          member: {
            nickname: this.form.member.nickname,
            gender: this.form.member.gender,
            mobile: this.form.member.mobile
          },
          shippings: [
            {
              shippingMethod: this.form.shippings[0].shippingMethod,
              deliveryCorpId: this.form.shippings[0].deliveryCorpId,
              expressSn: this.form.shippings[0].expressSn,
              freight: this.form.shippings[0].freight,
              address: this.form.shippings[0].address,
              consignee: this.form.shippings[0].consignee,
              phone: this.form.shippings[0].phone,
              zipCode: this.form.shippings[0].zipCode
            }
          ]
        },
        data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.form = this.getDefaultForm();
          if (this.form.orderItems[0].appointment && this.form.orderItems[0].appointment.driveStartDate) {
            this.form.orderItems[0].appointment.driveStartDate = this.form.orderItems[0].appointment.driveStartDate.split(' ')[1];
          }
          if (this.form.orderItems[0].appointment && this.form.orderItems[0].appointment.driveEndDate) {
            this.form.orderItems[0].appointment.driveEndDate = this.form.orderItems[0].appointment.driveEndDate.split(' ')[1];
          }
          this.$emit('operationSuccess');
          this.isCreated = true;
          this.itemId = data.id;
          this.tagMapping();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    createOrder() {
      this.shippingMethod.map(item => {
        if (item.name === this.form.shippingMethodName) {
          this.form.shippingMethodId = item.id;
        }
      });
      this.paymentTypes.map(item => {
        if (item.name === this.form.payments[0].paymentType) {
          this.form.paymentTypeId = item.id;
        }
      });
      this.form.appointmentData = this.form.orderItems[0].appointment;
      if (this.$route.params.orderType === 'rescue') {
        this.form.appointmentData.reasons = this.reasons.map(item => {
          if (this.form.appointmentData.reasons.indexOf(item.id) !== -1) {
            return { id: item.id, content: item.content };
          } else {
            return { id: '', content: '' };
          }
        });
      }
      if (
        (this.showInfo && !this.form.payments[0].paymentType) ||
        (this.showInfo &&
          (this.form.payments[0].paymentType === '刷卡' || this.form.payments[0].paymentType === '汇款') &&
          (this.form.payments[0].payBank === '' || this.form.payments[0].payAccount === ''))
      ) {
        this.$message.warning('请输入付款信息');
        this.loading = false;
        return false;
      }
      this.loading = true;
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.getOrderApply();
        }
      });
    },
    productChange() {
      this.modeList.map(item => {
        if (item.id === this.form.orderItems[0].appointment.product.id) {
          this.form.orderItems[0].appointment.product.price = item.price;
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
            item.template.name += ' ¥' + item.balance + ' ' + item.shop.name;
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getFinancialPlans() {
      service.getFinancialPlans(
        { shopId: window.top.SHOP_ID || '' },
        data => {
          this.loading = false;
          this.financialPlans = data.financials;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getSaveParams() {
      return {
        orderId: this.itemId
      };
    },
    areaChanged(val) {
      this.areaId = val;
      // 默认北京
      if (this.isFirst) {
        this.areaId = '1568';
        this.isFirst = false;
      }
    },
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.$set(this.form.orderItems[0].appointment.product, 'seriesId', '');
      this.$set(this.form.orderItems[0].appointment.product, 'id', '');
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.$set(this.form.orderItems[0].appointment.product, 'id', '');
    },
    queryMemberList(params) {
      service.memberList(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    opened() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称或手机号',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryMemberList(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
    },
    productPageSizeChange(val) {
      this.$set(this.productPagination, 'pageSize', val);
    },
    productCurrentPageChange(val) {
      this.$set(this.productPagination, 'currentPage', val);
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryMemberList(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryMemberList(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryMemberList(this.getDialogQueryParams());
    },
    handleSuccess(response, file, fileList) {
      this.form.orderItems[0].appointment.images.push({
        path: response.urls[0]
      });
    },
    handleRemove(file, fileList) {
      let index = this.form.orderItems[0].appointment.images.findIndex(item => item.path === file.path);

      if (index !== -1) {
        this.form.orderItems[0].appointment.images.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.picDialogVisible = true;
    },
    dialogOperate(name) {},
    queryBrandList() {
      service.brands(
        {},
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(val) {
      service.series(
        { brandId: val },
        data => {
          this.seriesList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getBrandList() {
      vehicleBaseInfo.queryBrandList(
        {},
        data => {
          this.brandData = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSeriesList(val) {
      vehicleBaseInfo.querySeriesList(
        { brand: val },
        data => {
          this.seriesData = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getModeList(val) {
      vehicleBaseInfo.queryTypeList(
        { series: val, brand: this.formModel.defaultCarInfo.brand },
        data => {
          this.modeData = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(val) {
      service.types(
        { seriesId: val, brandId: this.form.brand },
        data => {
          this.modeList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    beforeAvatarUpload(file) {
      const isImage = /^image\/(.*)$/.test(file.type);
      if (!isImage) {
        this.$message.error('请选择符合图片格式的文件上传!');
        return false;
      }

      const isLt200K = file.size / 1024 <= 200;
      if (!isLt200K) {
        this.$message.error('上传图片大小不能超过 200K!');
        return false;
      }
      return true;
    },
    addMember() {
      this.formModel = {
        userName: '',
        mobile: '',
        name: '',
        password: '123456',
        nickname: '',
        gender: '2',
        defaultCarInfo: {
          plateNumber: '',
          vin: '',
          brand: '',
          series: '',
          type: ''
        }
      };
      this.dialogVisible = true;
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
    },
    testDrives() {
      let param = {
        pageSize: 1000,
        pageNumber: 1,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/testDriveMgmt/testDrives.jhtml', param)
        .then(data => {
          this.restaurants = data.dataList.map(item => {
            return { value: item.car.plateNumber, id: item.car.id, type: item.car.type };
          });
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return state => {
        return true;
      };
    },
    handleSelect(item) {
      this.form.orderItems[0].appointment.product.fullName = item.type;
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
  .el-collapse-item__header.is-active {
    background-color: #fef3e5;
  }
  .el-collapse-item__wrap {
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 200px;
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
  .el-input-group__append {
    padding: 0 10px;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
}
</style>
