<template>
  <div class="vehicle-base-info__content">
    <el-form ref="form" size="small" label-width="130px" :model="formModel" :rules="rules" :inline-message="true">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-form-item label="车牌号码" prop="plateNumber">
            <el-input v-model="formModel.plateNumber" placeholder="请输入车牌号码"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="formModel.brand" placeholder="请选择品牌" filterable style="width: 100%;" @change="handleBrandChange">
              <el-option v-for="(item,index) in brandList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系列">
            <el-select v-model="formModel.series" placeholder="请选择系列" filterable style="width: 100%;"
              @change="handleSeriesChange">
              <el-option v-for="(item,index) in seriesList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车型">
            <el-select v-model="formModel.type" placeholder="请选择车型" style="width: 100%;">
              <el-option v-for="(item,index) in modeList" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有者" v-if="!memberId">
            <people-picker contentField="userName" v-model="formModel.member"></people-picker>
          </el-form-item>
          <el-form-item label="电话" v-if="!memberId">
            <el-input v-model="formModel.member.mobile" type="phone" maxlength="12" readonly placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="所属店铺" v-if="!memberId">
            <!-- <el-select v-model="formModel.shop.id" placeholder="请选择" style="width: 100%;" disabled>
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select> -->
            <el-input v-model="formModel.shop.name" placeholder="" disabled></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formModel.state" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item,index) in stateList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div slot="label">
              注册日期
              <el-button type="text" size="small" v-popover:onTimePop>
                <i class="iconfont el-icon-question"></i>
              </el-button>
              <el-popover ref="onTimePop" placement="bottom-start" width="300" trigger="hover" content="您可在车辆行驶证上查询到此信息">
              </el-popover>
            </div>
            <el-date-picker type="date" placeholder="选择注册日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" v-model="formModel.onTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="行驶证">
            <div class="image-content">
              <BizAvatarUploaderNew v-model="formModel.carLicense.positiveImage">
              </BizAvatarUploaderNew>
              <BizAvatarUploaderNew v-model="formModel.carLicense.backgroundImage">
              </BizAvatarUploaderNew>
              <div>
                <el-button type="primary" size="mini" @click="reject" v-show="!!formModel.id&&!!formModel.carLicense.positiveImage&&!!formModel.carLicense.backgroundImage">驳回</el-button>
              </div>
            </div>
          </el-form-item> -->
          <el-form-item label="营运">
            <el-switch v-model="formModel.isCV" active-value="1" inactive-value="0" inactive-color="#d9d9d9"
              active-color="#87d068">
            </el-switch>
          </el-form-item>
          <el-form-item label="登记的交管所">
            <el-input v-model="formModel.trafficControl" maxlength="16" placeholder="请输入车辆所登记的交管所"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formModel.remarks" type="textarea" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="技术信息" name="2">
          <el-form-item label="车辆识别代号" prop="vin">
            <div slot="label">
              车辆识别代号
              <el-button type="text" size="small" v-popover:vinPop>
                <i class="iconfont el-icon-question"></i>
              </el-button>
              <el-popover ref="vinPop" placement="bottom-start" width="300" trigger="hover"
                content="车辆识别代号，即车架号，具有对车辆的唯一识别性，因此可称为“汽车身份证”。您可在车辆行驶证上查询到此信息，也可打开发动机盖，在挡板上可看到此码。">
              </el-popover>
            </div>
            <el-input v-model="formModel.vin" maxlength="17" placeholder="请输入车辆识别代号信息"></el-input>
          </el-form-item>
          <el-form-item label="发动机号" prop="engineNumber">
            <div slot="label">
              发动机号
              <el-button type="text" size="small" v-popover:engineNumberPop>
                <i class="iconfont el-icon-question"></i>
              </el-button>
              <el-popover ref="engineNumberPop" placement="bottom-start" width="300" trigger="hover" content="您可在车辆行驶证上查询到此信息">
              </el-popover>
            </div>
            <el-input v-model="formModel.engineNumber" placeholder="请输入发动机号信息"></el-input>
          </el-form-item>
          <el-form-item label="车身颜色">
            <el-select v-model="formModel.bodyColor" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item,index) in colorList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌颜色">
            <el-select v-model="formModel.plateColor" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item,index) in colorList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="燃油编号">
            <el-select v-model="formModel.fuelGrade" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item,index) in fuelGradeList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变速箱类型">
            <el-select v-model="formModel.transmissionType" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item,index) in transmissionTypeList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排放标准">
            <el-select v-model="formModel.dischargeStandard" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item,index) in effluentStandardList" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-date-picker type="date" placeholder="选择生产日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" v-model="formModel.productionTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="终端信息" name="3">
          <div>
            <biz-header :operations="ruleTableOperations" @operate="operateHandler">
            </biz-header>
            <el-table :data="terminalData" ref="terminalTable" style="width: 100%" class="cp-table" size="mini">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="terminalTypeName" label="设备类型">
              </el-table-column>
              <el-table-column prop="number" label="设备编号">
              </el-table-column>
              <el-table-column prop="title" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row, $event)">
                    编辑
                  </el-button>
                  <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-card class="box-card" v-show="showRule" style="margin-top: 20px;">
              <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="ruleRules">
                <el-form-item label="设备编号" prop="number">
                  <el-autocomplete :value="ruleModel.number" :fetch-suggestions="handleRemote" placeholder="请输入设备编号"
                    :trigger-on-focus="false" @select="handleNumberChange" @input="handleNumberInput" value-key="number"
                    style="width: 100%;"></el-autocomplete>
                </el-form-item>
                <el-form-item label="电控系统" v-show="systemList && systemList.length > 0">
                  <el-select v-model="ruleModel.diagnoseType" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item,index) in systemList" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="通讯方式">
                  <el-select v-model="ruleModel.communicationType" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item,index) in commTypeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <biz-save-button :operations="ruleOperations" @operate="operateHandler" style="margin-right: 0;">
              </biz-save-button>
            </el-card>
          </div>
        </el-collapse-item>

        <el-collapse-item title="销售信息" name="4">
          <el-form-item label="车辆销售公司">
            <el-input v-model="formModel.carSalesData.salesCompany" placeholder="请输入车辆销售公司"></el-input>
          </el-form-item>
          <el-form-item label="车辆销售单号" prop="salesContractNumber">
            <el-input v-model="formModel.carSalesData.salesContractNumber" maxlength="16" placeholder="请输入车辆销售单号"></el-input>
          </el-form-item>
          <el-form-item label="购买日期" prop="purchaseTime">
            <el-date-picker type="date" placeholder="请选择购买日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" v-model="formModel.carSalesData.purchaseTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否贷款">
            <el-radio-group v-model="formModel.carSalesData.loanType">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
              <el-radio label="2">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="销售公司电话" prop="salesCompanyPhone">
            <el-input v-model="formModel.carSalesData.salesCompanyPhone" type="phone" maxlength="12" placeholder="请输入销售公司电话">
            </el-input>
          </el-form-item>
          <el-form-item label="销售员">
            <el-input v-model="formModel.carSalesData.salesStaff" placeholder="请输入销售员"></el-input>
          </el-form-item>
          <el-form-item label="销售员电话" prop="salesStaffPhone">
            <el-input v-model="formModel.carSalesData.salesStaffPhone" type="phone" maxlength="13" placeholder="请输入销售员电话">
            </el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="质保信息" name="5">
          <el-form-item label="质保起始日期" prop="purchaseTime">
            <el-date-picker type="date" placeholder="请选择保起始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              v-model="qualityAssuranceDate" style="width: 100%;" :clearable="false"></el-date-picker>
          </el-form-item>
          <div class="zbxx">
            <el-form-item label="质保期" prop="qualityAssuranceTime" class="isRequired">
              <el-input v-model="formModel.carQualityAssurance.time">
                <template slot="append">年</template>
              </el-input>
            </el-form-item>
            <el-form-item label="或" label-width="40px" prop="qualityAssuranceDrivingRange">
              <el-input v-model="formModel.carQualityAssurance.drivingRange">
                <template slot="append">公里</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="质保截止日期" prop="purchaseTime">
            <el-date-picker type="date" placeholder="请选择质保截止日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              v-model="qualityAssuranceEndDate" style="width: 100%;" disabled></el-date-picker>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="保险信息" name="6">
          <el-form-item label="投保公司">
            <el-select v-model="formModel.carInsurance.insuranceCompany" placeholder="请选择投保公司" style="width: 100%;"
              @change="handleInsuranceChange">
              <el-option v-for="(item,index) in insuranceList" :key="index" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保单号码" prop="insurancePolicyNumber">
            <el-input v-model="formModel.carInsurance.insurancePolicyNumber" maxlength="20" placeholder="请输入保单号码"></el-input>
          </el-form-item>
          <el-form-item label="保单生效日期">
            <el-date-picker type="date" placeholder="选择保单生效日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              v-model="formModel.carInsurance.policyEffectiveDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="保单失效日期" prop="policyExpiryDate">
            <el-date-picker type="date" placeholder="选择保单失效日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              v-model="formModel.carInsurance.policyExpiryDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="客服电话" prop="customerServicePhone">
            <el-input v-model="formModel.carInsurance.customerServicePhone" type="phone" maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="理赔员姓名">
            <el-input v-model="formModel.carInsurance.claimMemberName" placeholder="请输入理赔员姓名"></el-input>
          </el-form-item>
          <el-form-item label="理赔员电话" prop="claimMemberPhone">
            <el-input v-model="formModel.carInsurance.claimMemberPhone" type="phone" maxlength="13" placeholder="请输入理赔员电话">
            </el-input>
          </el-form-item>
          <el-form-item label="保单详细信息">
            <el-input v-model="formModel.carInsurance.insuranceDetails" placeholder="请输入保单详细信息"></el-input>
          </el-form-item>
          <el-form-item label="保单说明">
            <el-input v-model="formModel.carInsurance.policyDescription" placeholder="请输入保单说明"></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="保养信息" name="7">
          <el-form-item label="车辆里程(km)" prop="nowDrivingRange">
            <el-input v-model="formModel.drivingRange" controls-position="right" placeholder="请输入车辆里程"></el-input>
          </el-form-item>
          <el-form-item label="保养日期">
            <el-date-picker type="date" placeholder="选择保养日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" v-model="formModel.carMaintain.happenDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="上次保养里程(km)" prop="drivingRange">
            <el-input v-model="formModel.carMaintain.drivingRange" controls-position="right" placeholder="请输入上次保养里程"></el-input>
          </el-form-item>
          <el-form-item label="保养间隔里程(km)" prop="drivingRangeGap">
            <el-input v-model="formModel.carMaintain.drivingRangeGap" controls-position="right"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import PeoplePicker from '../component/PeoplePicker';
import { BizHeader } from '@/components/BizTable';
import date from '@/utils/date';
import service from '@/service/vehicle-mgmt/VehicleBaseInfo';
// import { BizAvatarUploaderNew } from '@/components/BizForm';
import http from '@/common/http';
export default {
  name: 'VehicleBaseInfoContent',
  components: {
    BizSaveButton,
    PeoplePicker,
    BizHeader
    // BizAvatarUploaderNew
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules: {
        plateNumber: [
          { required: true, message: '请输入车牌号码', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1,2}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
              if (express.test(this.formModel.plateNumber)) {
                callback();
              } else {
                callback(new Error('车牌号格式错误'));
              }
            }
          }
        ],
        vin: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.vin) {
                this.$set(this.formModel, 'vin', this.formModel.vin.toUpperCase());
              }
              let express = /^[A-Z0-9]{17}$/;
              if (!this.formModel.vin || express.test(this.formModel.vin)) {
                callback();
              } else {
                callback(new Error('车辆识别代号格式错误'));
              }
            }
          }
        ],
        engineNumber: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.engineNumber) {
                this.$set(this.formModel, 'engineNumber', this.formModel.engineNumber.toUpperCase());
              }
              let express = /^[a-zA-Z0-9]{6,14}$/;
              if (!this.formModel.engineNumber || express.test(this.formModel.engineNumber)) {
                callback();
              } else {
                callback(new Error('发动机号格式错误'));
              }
            }
          }
        ],
        salesContractNumber: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.carSalesData && this.formModel.carSalesData.salesContractNumber) {
                this.$set(
                  this.formModel.carSalesData,
                  'salesContractNumber',
                  this.formModel.carSalesData.salesContractNumber.toUpperCase()
                );
              }

              let express = /^[A-Z0-9]*$/;
              if (
                !this.formModel.carSalesData ||
                !this.formModel.carSalesData.salesContractNumber ||
                express.test(this.formModel.carSalesData.salesContractNumber)
              ) {
                callback();
              } else {
                callback(new Error('车辆销售单号格式错误'));
              }
            }
          }
        ],

        // salesCompanyPhone: [
        //   {
        //     trigger: 'blur',
        //     validator: (rule, rules, callback) => {
        //       let express = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        //       if (
        //         !this.formModel.carSalesData.salesCompanyPhone ||
        //         express.test(this.formModel.carSalesData.salesCompanyPhone)
        //       ) {
        //         callback();
        //       } else {
        //         callback(new Error('销售公司电话格式错误'));
        //       }
        //     }
        //   }
        // ],
        salesStaffPhone: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let express = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
              if (!this.formModel.carSalesData.salesStaffPhone || express.test(this.formModel.carSalesData.salesStaffPhone)) {
                callback();
              } else {
                callback(new Error('销售员电话格式错误'));
              }
            }
          }
        ],
        customerServicePhone: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let express = /^[0-9]\d*$/;
              if (
                !this.formModel.carInsurance.customerServicePhone ||
                express.test(this.formModel.carInsurance.customerServicePhone)
              ) {
                callback();
              } else {
                callback(new Error('客服电话格式错误'));
              }
            }
          }
        ],
        claimMemberPhone: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let express = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
              if (!this.formModel.carInsurance.claimMemberPhone || express.test(this.formModel.carInsurance.claimMemberPhone)) {
                callback();
              } else {
                callback(new Error('理赔员电话格式错误'));
              }
            }
          }
        ],

        insurancePolicyNumber: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let express = /^[0-9]{20}$/;
              if (
                !this.formModel.carInsurance.insurancePolicyNumber ||
                express.test(this.formModel.carInsurance.insurancePolicyNumber)
              ) {
                callback();
              } else {
                callback(new Error('保单号码格式错误'));
              }
            }
          }
        ],
        policyExpiryDate: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                this.formModel.carInsurance.policyExpiryDate &&
                this.formModel.carInsurance.policyEffectiveDate &&
                this.formModel.carInsurance.policyExpiryDate <= this.formModel.carInsurance.policyEffectiveDate
              ) {
                callback(new Error('保单失效日期要晚于保单生效日期'));
              } else {
                callback();
              }
            }
          }
        ],
        purchaseTime: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                this.formModel.carSalesData.purchaseTime &&
                this.formModel.productionTime &&
                this.formModel.carSalesData.purchaseTime < this.formModel.productionTime
              ) {
                callback(new Error('购买日期要晚于生产日期'));
              } else {
                callback();
              }
            }
          }
        ],
        nowDrivingRange: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let reg = new RegExp(/^\+?[0-9][0-9]*$/);
              if (this.formModel.drivingRange && !reg.test(this.formModel.drivingRange)) {
                callback(new Error('请输入整数'));
              } else {
                callback();
              }
            }
          }
        ],
        drivingRange: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let reg = new RegExp(/^\+?[0-9][0-9]*$/);
              if (this.formModel.carMaintain.drivingRange && !reg.test(this.formModel.carMaintain.drivingRange)) {
                callback(new Error('请输入整数'));
              } else {
                callback();
              }
            }
          }
        ],
        drivingRangeGap: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let reg = new RegExp(/^\+?[0-9][0-9]*$/);
              if (this.formModel.carMaintain.drivingRangeGap && !reg.test(this.formModel.carMaintain.drivingRangeGap)) {
                callback(new Error('请输入整数'));
              } else {
                callback();
              }
            }
          }
        ],
        qualityAssuranceTime: [
          { required: false, message: '请输入质保期', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let reg = new RegExp(/^\+?[1-9][0-9]*$/);
              if (this.formModel.carQualityAssurance.time && !reg.test(this.formModel.carQualityAssurance.time)) {
                callback(new Error('请输入一个大于0的整数'));
              } else if (!this.formModel.carQualityAssurance.time) {
                callback(new Error('请输入质保期'));
              } else {
                callback();
              }
            }
          }
        ],
        qualityAssuranceDrivingRange: [
          { required: false, message: '请输入里程', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let reg = new RegExp(/^\+?[1-9][0-9]*$/);
              if (this.formModel.carQualityAssurance.drivingRange && !reg.test(this.formModel.carQualityAssurance.drivingRange)) {
                callback(new Error('请输入一个大于0的整数'));
              } else if (!this.formModel.carQualityAssurance.drivingRange) {
                callback(new Error('请输入里程'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      shopList: [],
      brandList: [],
      seriesList: [],
      modeList: [],
      stateList: [],
      transmissionTypeList: [],
      plateNumberTypeList: [],
      colorList: [],
      fuelGradeList: [],
      effluentStandardList: [],
      systemList: [],
      commTypeList: [],
      insuranceList: [],
      selections: [],
      formModel: this.getDefaultModel(),
      activeNames: ['1'],
      terminalData: [],
      ruleTableOperations: [
        {
          label: '新增',
          name: 'addOperate',
          type: 'primary'
        }
      ],
      showRule: false,
      ruleModel: this.getDefaultRuleModel(),
      ruleOperations: [
        {
          label: '取消',
          name: 'cancelRuleOperate'
        },
        {
          label: '保存',
          name: 'saveRuleOperate',
          type: 'primary',
          auth: ['admin:car.edit']
        }
      ],
      ruleRules: {
        number: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.ruleModel.number) {
                callback();
              } else {
                callback(new Error('请选择终端'));
              }
            }
          },
          {
            trigger: ['blur'],
            validator: (rule, rules, callback) => {
              this.checkNumber(this.ruleModel.number, callback);
            }
          }
        ]
      },

      selectLoading: false,
      terminalList: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    memberId: {
      type: Object
    }
  },
  created() {
    this.queryShopList();
    this.queryBrandList();
    this.queryInsuranceList();
    this.queryDimList();
    this.effluentStandardList = ['国Ⅰ', '国Ⅱ', '国Ⅲ', '国Ⅳ', '国Ⅴ', '国Ⅵ', '欧Ⅰ', '欧Ⅱ', '欧Ⅲ', '欧Ⅳ', '欧Ⅴ'];
    this.commTypeList = [
      { id: '0', name: '自动切换' },
      { id: '1', name: '网络' },
      { id: '2', name: '蓝牙' },
      { id: '3', name: 'WIFI' },
      { id: '4', name: 'GPRS' },
      { id: '5', name: '3G' },
      { id: '6', name: '4G' }
    ];

    this.deletedRules = [];
  },
  methods: {
    reject() {
      http
        .put('/admin/car/carLicense/state.jhtml', {
          id: this.formModel.id
        })
        .then(data => {
          this.$message.success('驳回成功');
          this.$emit('operationSuccess');
          this.formModel.carLicense.positiveImage = '';
          this.formModel.carLicense.backgroundImage = '';
        })
        .catch(errData => {
          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },
    getTerminalList() {
      http
        .get('/admin/terminal/memberTerminals.jhtml', {
          userId: this.memberId ? this.memberId.id : '',
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.terminalData = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          console.log(this.terminalData.indexOf(row));
          this.terminalData.forEach((item, index) => {
            if (row.id === item.id) {
              this.$refs.terminalTable.toggleRowSelection(item);
            }
          });
        });
      } else {
        this.$refs.terminalTable.clearSelection();
      }
    },
    queryShopList() {
      service.queryShopList(
        {},
        data => {
          this.shopList = data.storeList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryBrandList() {
      service.queryBrandList(
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
      service.querySeriesList(
        { brand: val },
        data => {
          this.seriesList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(val) {
      service.queryTypeList(
        { series: val, brand: this.formModel.brand },
        data => {
          this.modeList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryInsuranceList() {
      service.queryInsuranceList(
        {},
        data => {
          this.insuranceList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryDimList() {
      service.queryDimList(
        {},
        data => {
          this.stateList = data.carStateList;
          this.transmissionTypeList = data.transmissionTypeList;
          this.plateNumberTypeList = data.plateNumberTypeList;
          this.colorList = data.colorList;
          this.fuelGradeList = data.fuelGradeList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSaveParams() {
      let addList = [];
      addList = addList.concat(this.formModel.terminals);
      let deleteList = this.deletedRules;
      let numberList = [];
      addList.forEach(item => {
        numberList.push(item.number);
      });
      deleteList.forEach(item => {
        if (numberList.indexOf(item.number) < 0) {
          addList.push({ terminalType: item.terminalType, type: item.type });
        }
      });
      this.formModel.carQualityAssurance.qualityAssuranceDate = this.qualityAssuranceDate;
      this.formModel.carQualityAssurance.qualityAssuranceEndDate = this.qualityAssuranceEndDate;
      return {
        id: this.formModel.id,
        plateNumber: this.formModel.plateNumber,
        brand: this.formModel.brand,
        series: this.formModel.series,
        type: this.formModel.type,
        member: this.memberId ? this.memberId : this.formModel.member,
        shop: this.formModel.shop,
        state: this.formModel.state,
        onTime: this.formModel.onTime,
        isCV: this.formModel.isCV,
        trafficControl: this.formModel.trafficControl,
        remarks: this.formModel.remarks,
        drivingRange: this.formModel.drivingRange,
        carshipId: this.formModel.carshipId,
        vin: this.formModel.vin,
        engineNumber: this.formModel.engineNumber,
        bodyColor: this.formModel.bodyColor,
        plateColor: this.formModel.plateColor,
        fuelGrade: this.formModel.fuelGrade,
        carLicense: this.formModel.carLicense,
        transmissionType: this.formModel.transmissionType,
        dischargeStandard: this.formModel.dischargeStandard,
        productionTime: this.formModel.productionTime,

        terminals: addList,

        carSalesData: this.formModel.carSalesData,
        carInsurance: this.formModel.carInsurance,
        carMaintain: this.formModel.carMaintain,
        carQualityAssurance: this.formModel.carQualityAssurance
      };
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        member: {
          id: '',
          name: ''
        },
        bodyColor: '2',
        plateColor: '0',
        fuelGrade: '1',
        carLicense: {
          positiveImage: '',
          backgroundImage: ''
        },
        transmissionType: '2',
        dischargeStandard: '国5',
        shop: {
          id: '',
          name: ''
        },
        engineNumber: '',
        carSalesData: {
          salesCompanyPhone: '',
          salesStaffPhone: ''
        },
        carInsurance: {
          insuranceCompany: '平安保险',
          customerServicePhone: '95518',
          claimMemberPhone: ''
        },
        carMaintain: {
          drivingRangeGap: '5000'
        },
        carQualityAssurance: {
          drivingRange: '60000',
          qualityAssuranceDate: '',
          qualityAssuranceEndDate: '',
          time: '3',
          carId: '',
          id: ''
        },
        terminals: []
      };
    },

    operateHandler(name) {
      this[name]();
    },
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.$set(this.formModel, 'series', '');
      this.$set(this.formModel, 'type', '');
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.$set(this.formModel, 'type', '');
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (
            (this.formModel.backgroundImage && !this.formModel.positiveImage) ||
            (!this.formModel.backgroundImage && this.formModel.positiveImage)
          ) {
            this.$message.warning('驾驶证正反面图片都需要上传');
            return false;
          }
          this.$emit('on-loading', true);
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
                this.$emit('on-loading', false);
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.$emit('on-loading', false);
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
                this.$emit('on-loading', false);
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.$emit('on-loading', false);
              }
            );
          }
        } else {
          this.$message.warning('车辆信息输入有误，请修改');
          return false;
        }
      });
    },
    handleInsuranceChange(val) {
      this.insuranceList.forEach(item => {
        if (item.name === val) {
          this.$set(this.formModel.carInsurance, 'customerServicePhone', item.phoneNumber);
        }
      });
    },

    getDefaultRuleModel() {
      return {
        number: '',
        diagnoseType: '',
        communicationType: '0'
      };
    },
    rowEditClickHandler(model, e, column) {
      e.stopPropagation();

      this.systemList = model.diagnoseTypes ? model.diagnoseTypes : [];
      this.terminalList = [];
      this.ruleModel = Object.assign({}, model);
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    rowDeleteClickHandler(e, model) {
      // this.deleteRule([model.id]);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据终端号码确定位置，进行删除操作
        this.formModel.terminals.forEach((item, i) => {
          if (item.number === model.number) {
            this.formModel.terminals.splice(i, 1);
          }
        });
        this.deletedRules.push(model);
      });
    },
    addOperate() {
      this.resetRuleModel();
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    resetRuleModel() {
      this.systemList = [];
      this.terminalList = [];
      this.ruleModel = this.getDefaultRuleModel();
    },
    cancelRuleOperate() {
      this.showRule = false;
    },
    saveRuleOperate() {
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          // 判断是否存在终端编号
          // 如果存在，则进行修改操作，否则，执行添加
          let replaced = false;
          this.formModel.terminals.forEach((item, i) => {
            if (item.number === this.ruleModel.number) {
              this.formModel.terminals.splice(i, 1, this.getRuleParams());
              replaced = true;
            }
          });
          if (!replaced) {
            this.formModel.terminals.push(this.getRuleParams());
          }

          this.showRule = false;
        } else {
          return false;
        }
      });
    },
    getRuleParams() {
      return Object.assign({}, this.ruleModel);
    },
    checkNumber(val, callback) {
      // 根据设备编号查询
      service.queryTerminalInfo(
        {
          sn: val,
          carId: this.itemId.id,
          shopId: window.top.SHOP_ID
        },
        data => {
          this.systemList = data.diagnoseTypes ? data.diagnoseTypes : [];
          data.diagnoseType = this.systemList.length > 0 ? this.systemList[0] : '';
          for (let i = 0; i < this.systemList.length; i++) {
            if (this.systemList[i] === this.ruleModel.diagnoseType) {
              data.diagnoseType = this.systemList[i];
              break;
            }
          }
          Object.assign(this.ruleModel, data);

          callback();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('ERROR_QUERY', ErrorData);

          // this.$message.warning(ErrorData.errorMessage);
          // 失败后清空相关信息
          this.systemList = [];
          this.$set(this.ruleModel, 'diagnoseType', '');
          callback(new Error(ErrorData.errorMessage));
        }
      );
    },

    handleNumberChange(val) {
      this.$set(this.ruleModel, 'number', val.number);
      this.$refs.ruleForm.clearValidate();
      // this.checkNumber(val.number);
    },
    handleNumberInput(val) {
      this.$set(this.ruleModel, 'number', val);
    },
    handleRemote(query, cb) {
      if (query) {
        this.queryTerminalList(query, cb);
      } else {
        this.terminalList = [];
      }
    },
    queryTerminalList(searchKey, cb) {
      this.$emit('on-loading', true);

      service.queryTerminalList(
        {
          number: searchKey
        },
        data => {
          // this.terminalList = data.dataList;
          cb(data.dataList);

          this.$emit('on-loading', false);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.$emit('on-loading', false);
        }
      );
    }
  },
  computed: {
    point: {
      get() {
        return {
          lng: this.formModel.lngBaidu,
          lat: this.formModel.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.formModel.lngBaidu = nVal.lng;
          this.formModel.latBaidu = nVal.lat;
        }
      }
    },
    qualityAssuranceDate: {
      get() {
        if (!this.formModel.carQualityAssurance.qualityAssuranceDate && this.formModel.onTime) {
          return this.formModel.onTime;
        } else {
          return this.formModel.carQualityAssurance.qualityAssuranceDate;
        }
      },
      set(nVal) {
        if (nVal) {
          this.formModel.carQualityAssurance.qualityAssuranceDate = nVal;
        }
      }
    },
    qualityAssuranceEndDate: {
      get() {
        if (
          !this.formModel.carQualityAssurance.qualityAssuranceEndDate &&
          this.qualityAssuranceDate &&
          this.formModel.carQualityAssurance.time
        ) {
          return date.lastNYearDate(this.qualityAssuranceDate, this.formModel.carQualityAssurance.time);
        } else {
          return this.formModel.carQualityAssurance.qualityAssuranceEndDate;
        }
      },
      set(nVal) {
        if (nVal) {
          this.formModel.carQualityAssurance.qualityAssuranceEndDate = nVal;
        }
      }
    }
  },
  watch: {
    itemId(nVal, oVal) {
      console.log(nVal);
      if (nVal.id) {
        this.$emit('on-loading', true);
        service.query(
          {
            carId: nVal.id,
            carShipId: nVal.carShipId
          },
          data => {
            let obj = Object.assign(this.getDefaultModel(), data.car);
            this.formModel = obj;
            this.querySeriesList(this.formModel.brand);
            this.queryTypeList(this.formModel.series);

            this.$refs.form.resetFields();
            this.activeNames = ['1'];
            this.deletedRules = [];
            this.toggleSelection(this.formModel.terminals);
            this.$emit('on-loading', false);
            this.showRule = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
            this.$emit('on-loading', false);
          }
        );
      } else {
        this.resetModel();
        this.$refs.form.$el.scrollTop = 0;
        this.$refs.form.resetFields();
        this.activeNames = ['1'];
      }
    },
    'memberId.id'(nVal, oVal) {
      this.getTerminalList();
    }
  }
};
</script>

<style lang="scss">
.vehicle-base-info__content {
  height: 100%;
  .el-form {
    height: 100%;
    overflow: auto;
    .image-content {
      display: flex;
      justify-content: space-between;
    }
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .cp-table {
    .el-table__empty-block {
      line-height: 60px;
    }
  }
  .zbxx {
    display: flex;
    .el-input__inner {
      width: 80px;
    }
  }
  fieldset {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-bottom: 20px;
    padding-bottom: 20px;

    legend {
      font-size: 14px;
      color: #999;
    }
    .el-input-number--small {
      width: 100%;
    }
    .el-form-item--small.el-form-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
