<template>
  <biz-grid class="member-card-template">
    <div class="content" v-loading="loading">
      <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <div class="title_info"></div>
      <div>会员卡基本信息</div>
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="120px" size="small" class="item" :rules="rules" :disabled="!isEdit">
          <el-form-item label="卡名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入卡名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否默认" prop="isDefault">
            <el-checkbox v-model="form.isDefault" :disabled="disabled" true-label="1" false-label="0"></el-checkbox>
          </el-form-item>
          <!-- <el-form-item label="有效期" prop="date">
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="有效期开始日期" prop="date">
            <el-date-picker v-model="form.beginDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效期截至日期" prop="date">
            <el-date-picker v-model="form.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="截至日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="title_info" v-if="this.templateId"></div>
      <div v-if="this.templateId">会员卡等级信息</div>
      <el-card v-if="this.templateId">
        <member-card-grade :gradeList="gradeList" @rowClick="rowClick" @addHandleClick="addHandleClick" @deleteLine="deleteLine"
          :isEdit="isEdit">
        </member-card-grade>
      </el-card>
      <div class="title_info" v-if="this.templateId"></div>
      <div v-if="this.templateId">会员奖励设置</div>
      <el-card v-if="this.templateId">
        <member-awards @created="refresh" :form="formModel" :templateId="templateId" ref="awards">
        </member-awards>
      </el-card>
    </div>
    <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
      <el-tab-pane label="等级信息" name="memberCardGradeInfo">
        <member-card-grade-info ref="memberCardGradeInfo" :itemId="itemId" :templateId="templateId" @operationSuccess="operationSuccess"
          :isEdit="isEdit">
        </member-card-grade-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import BizSaveButton from '@/components/BizSaveButton';
import MemberCardGrade from './MemberCardGrade';
import MemberAwards from './MemberAwards';
import MemberCardGradeInfo from './MemberCardGradeInfo';
import service from '@/service/member-card-mgmt/memberCardMgmt';
export default {
  name: 'MemberCardTemplateMgmt',
  data() {
    return {
      loading: false,
      gradeList: [],
      itemId: '',
      templateId: '',
      isCreated: false,
      disabled: false,
      isEdit: true,
      popupTabName: 'memberCardGradeInfo',
      openPopup: false,
      form: {
        name: '',
        description: '',
        state: '',
        isDefault: '0',
        beginDate: '',
        endDate: ''
      },
      rules: {
        name: [{ required: true, message: '请输入卡模版名称', trigger: 'blur' }]
      },
      formModel: {
        memberBean: '5',
        carBean: '5',
        insuranceBean: '5',
        maintainBean: '5',
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
        vBean: '100',
        arrivalRate: '2',
        extraRecharges: []
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizPopupTabs,
    BizSaveButton,
    MemberCardGrade,
    MemberAwards,
    MemberCardGradeInfo
  },
  computed: {
    dateRange: {
      get() {
        if (this.form.beginDate && this.form.endDate) {
          return [this.form.beginDate, this.form.endDate];
        } else {
          return [];
        }
      },
      set(newValue) {
        if (newValue) {
          this.form.beginDate = newValue[0];
          this.form.endDate = newValue[1];
        } else {
          this.form.beginDate = '';
          this.form.endDate = '';
        }
      }
    }
  },
  created() {
    this.templateId = this.$route.query.templateId || '';
    this.templateId && this.getList();
    if (this.templateId) this.operations[1].disabled = false;
    this.listAuthority();
  },
  mounted() {},
  watch: {
    $route(to, from) {
      this.listAuthority();
      this.templateId = this.$route.query.templateId || '';
      this.templateId && this.getList();
      if (this.templateId) this.operations[1].disabled = false;
      if (!this.templateId) {
        this.form = {
          name: '',
          description: '',
          state: '',
          isDefault: '0',
          beginDate: '',
          endDate: ''
        };
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    operationSuccess() {
      this.getList();
    },
    refresh() {},
    deleteLine(val) {
      service.delVipCardGrade(
        {
          userRankIds: [val.id],
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.$message.success('删除成功');
          this.loading = false;
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    listAuthority() {
      service.listAuthority(
        {},
        data => {
          if (
            data.authorities.indexOf('admin:memberCardTemplate.edit') > 0 &&
            this.$route.query.isEdit === 'true'
          ) {
            this.isEdit = true;
          } else {
            this.isEdit = false;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getList() {
      this.loading = true;
      this.templateId &&
        service.getVipCardTemplate(
          {
            templateId: this.templateId || ''
          },
          data => {
            this.form = data.content;
            if (data.content.isDefault === '1') {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      this.templateId &&
        service.memberRankList(
          {
            templateId: this.templateId || ''
          },
          data => {
            this.gradeList = data.content;
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      this.templateId &&
        service.setting(
          {
            userCardTemplateId: this.templateId || ''
          },
          data => {
            if (data.content.memberBean) {
              this.formModel = data.content;
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
      if (
        this.form.beginDate &&
        this.form.endDate &&
        this.form.beginDate > this.form.endDate
      ) {
        this.$message.warning('开始日期不能大于结束日期');
        return;
      }
      this.templateId &&
        service.updateTemplate(
          {
            id: this.templateId || '',
            name: this.form.name,
            description: this.form.description,
            beginDate: this.form.beginDate,
            endDate: this.form.endDate,
            state: this.form.state,
            isDefault: this.form.isDefault,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            // this.$message.success('保存成功');
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('code错误');
          }
        );
      !this.templateId &&
        service.createTemplate(
          {
            name: this.form.name,
            description: this.form.description,
            beginDate: this.form.beginDate,
            endDate: this.form.endDate,
            isDefault: this.form.isDefault,
            state: this.form.state,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.$message.success('保存成功');
            this.templateId = data.templateId;
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('code错误');
          }
        );
      this.templateId && this.$refs.awards.save();
    },
    delete() {
      let templateIds = [];
      templateIds.push(this.templateId);
      service.delTemplate(
        {
          templateIds: templateIds,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.$message.success('删除成功');
          this.templateId = '';
          this.form = {};
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    },
    rowClick(val) {
      this.isCreated = false;
      this.popupTabName = 'memberCardGradeInfo';
      this.itemId = val.id;
      this.openPopup = true;
    },
    addHandleClick() {
      this.$refs.memberCardGradeInfo.getRights();
      this.popupTabName = 'memberCardGradeInfo';
      this.itemId = '';
      this.openPopup = true;
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.operations[2].disabled = false;
        this.operations[3].disabled = false;
      }
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.member-card-template {
  .content {
    height: 100%;
    overflow: auto;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-card {
    width: 1360px;
    margin: 20px 0px;
  }
  .title_info {
    width: 2px;
    height: 13px;
    background: #ff7300;
    float: left;
    margin: 5px 5px 0px 0px;
  }
  .content {
    padding: 20px;
  }
  .item {
    width: 480px;
    .el-date-editor .el-range-separator {
      width: 10%;
    }
  }
}
</style>
