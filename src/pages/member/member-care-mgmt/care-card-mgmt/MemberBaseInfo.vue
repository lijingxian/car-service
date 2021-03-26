<template>
  <biz-grid class="care-card-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form v-loading="loading" :rules="rules" ref="form" :model="formModel" label-width="110px" size="small">
      <el-form-item label="关怀卡分类" prop="category">
        <el-select v-model="formModel.category">
          <el-option :label="category.name" :value="category.id" :key="category.id" v-for="category of categoryList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关怀卡名称" prop="name">
        <el-input placeholder="请输入关怀卡名称" maxlength="15" v-model="formModel.name"></el-input>
      </el-form-item>
      <el-form-item label="发放条件" prop="type" class="isRequired">
        <el-cascader v-model="bindValue" :options="options"></el-cascader>
      </el-form-item>
      <el-form-item label="发放规则" :prop="bindValue[1]==='5'?'triggerDate':''" v-if="bindValue[1]!=='2'">
        <div v-if="bindValue[1]==='0'||bindValue[1]==='3'||bindValue[1]==='4'">
          <el-input-number v-model="formModel.triggerBoundary" :min="0"></el-input-number>天前发放
        </div>
        <div v-if="bindValue[1]==='3'">
          <el-input-number v-model="formModel.triggerKilometres" :min="0"></el-input-number>或公里前发放
        </div>
        <div v-if="bindValue[1]==='1'||bindValue[1]==='6'">
          <el-input-number v-model="formModel.triggerBoundary" :min="0"></el-input-number>元发放
        </div>
        <div v-if="bindValue[1]==='5'">
          <el-date-picker v-model="formModel.triggerDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>发放
        </div>
        <div v-if="bindValue[1]==='7'">
          <el-radio-group v-model="formModel.triggerActivityChange">
            <el-radio label="0">活跃度上升</el-radio>
            <el-radio label="1">活跃度下降</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="发放时间" prop="publishTime" v-if="bindValue[1]==='0'||bindValue[1]==='3'||bindValue[1]==='4'||bindValue[1]==='5'">
        <el-select v-model="formModel.publishTime">
          <el-option label="01:00" value="01:00"></el-option>
          <el-option label="02:00" value="02:00"></el-option>
          <el-option label="03:00" value="03:00"></el-option>
          <el-option label="04:00" value="04:00"></el-option>
          <el-option label="05:00" value="05:00"></el-option>
          <el-option label="06:00" value="06:00"></el-option>
          <el-option label="07:00" value="07:00"></el-option>
          <el-option label="08:00" value="08:00"></el-option>
          <el-option label="09:00" value="09:00"></el-option>
          <el-option label="10:00" value="10:00"></el-option>
          <el-option label="11:00" value="11:00"></el-option>
          <el-option label="12:00" value="12:00"></el-option>
          <el-option label="13:00" value="13:00"></el-option>
          <el-option label="14:00" value="14:00"></el-option>
          <el-option label="15:00" value="15:00"></el-option>
          <el-option label="16:00" value="16:00"></el-option>
          <el-option label="17:00" value="17:00"></el-option>
          <el-option label="18:00" value="18:00"></el-option>
          <el-option label="19:00" value="19:00"></el-option>
          <el-option label="20:00" value="20:00"></el-option>
          <el-option label="21:00" value="21:00"></el-option>
          <el-option label="22:00" value="22:00"></el-option>
          <el-option label="23:00" value="23:00"></el-option>
          <el-option label="24:00" value="24:00"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="参与用户" prop="target">
        <rank-item ref="rank" :rankData="rankData"></rank-item>
      </el-form-item>-->
      <!-- <el-form-item label="关怀卡样式" prop="style">
        <el-select v-model="formModel.style">
          <el-option label="样式1" value="0"></el-option>
          <el-option label="样式2" value="1"></el-option>
          <el-option label="样式3" value="2"></el-option>
        </el-select>
        <el-button type="text" style="margin-left:10px;" @click="templateDialogVisible = true">全部样式</el-button>
        <el-button type="text" size="small" v-popover:tips>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="tips" placement="bottom-start" width="300" trigger="hover" content="点击此处查看全部样式"></el-popover>
      </el-form-item> -->
      <el-form-item label="关怀卡福利" prop="welfare" class="is-required">
        <el-checkbox-group v-model="welfareChecks">
          <div class="welfare-item" v-clickoutside="validateForm">
            <el-checkbox label="point" style="width:55px;">积分</el-checkbox>
            <el-input-number v-show="welfareChecks.includes('point')" v-model="formModel.point" :min="1"></el-input-number>
          </div>
          <div class="welfare-item" v-clickoutside="validateForm">
            .
            <el-checkbox label="bean" style="width:55px;">V豆</el-checkbox>
            <el-input-number v-show="welfareChecks.includes('bean')" v-model="formModel.bean" :min="1"></el-input-number>
          </div>
          <div class="welfare-item" v-clickoutside="validateForm">
            <el-checkbox label="right" style="width:55px;">权益</el-checkbox>
            <el-button v-show="welfareChecks.includes('right')" class="button-new-tag" size="small" @click="rightSelectDialogVisible = true">+添加</el-button>
            <el-button v-show="welfareChecks.includes('right')" type="text" size="small" v-popover:rights>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="rights" placement="bottom-start" width="300" trigger="hover" content="请前往【权益管理】进行权益的管理和维护"></el-popover>
          </div>
          <div v-show="welfareChecks.includes('right')" class="selected-right-list">
            <div class="right-item" v-for="item in selectedRightList" :key="item.id">
              <img :src="item.logo || defaultImg" alt />
              <span class="right-name">{{ item.name }}</span>
            </div>
          </div>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="关怀介绍" prop="description">
        <el-input type="textarea" v-model="formModel.description"></el-input>
      </el-form-item>
      <el-form-item label="启用关怀" prop="state">
        <el-switch v-model="formModel.state" active-value="1" active-color="#87d068" inactive-value="0" inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
    </el-form>

    <el-dialog
      title="权益选择"
      center
      :visible.sync="rightSelectDialogVisible"
      width="80%"
      append-to-body
      custom-class="rights-select"
      :close-on-click-modal="false"
      @close="rightSelectDialogVisible = false"
    >
      <el-form ref="formDialog" label-width="120px" size="small">
        <el-form-item v-for="right in rightList" v-if="right.rights" :label="right.name+':'" :key="right.id" prop="rights">
          <el-checkbox-group v-model="checkedRights">
            <el-checkbox v-for="item in right.rights" :label="item.id" :key="item.id" :disabled="item.valid==='0'">
              <img :src="item.logo||defaultImg" width="50px" height="50px" />
              <div class="right_name" :title="item.name">{{item.name}}</div>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" align="right">
        <el-button type="primary" @click="cancel" size="mini">取消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确认选择</el-button>
      </span>
    </el-dialog>

    <el-dialog
      append-to-body
      class="template-preview"
      :visible="templateDialogVisible"
      :open="templateDialogVisible"
      @close="templateDialogVisible=false"
      width="1000px"
    >
      <div class="template-item" v-for="(item, index) in templateGroup" :key="index">
        <div class="template-name">{{ item.name }}</div>
        <div class="template-img">
          <img :src="item.src" alt />
        </div>
        <el-button type="primary" @click="templateSelect(item.id)">使用此模板</el-button>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      class="care-card-preview"
      title="预览"
      :visible="previewDialogOpen"
      :open="previewDialogOpen"
      @close="previewDialogOpen=false"
      width="450px"
    >
      <div class="card-preview" :class="`card-style-${formModel.style}`">
        <img :src="previewCardBgImg" alt />
        <div class="preview-content">
          <div class="content-detail">
            <ol>
              <li v-if="welfareChecks.includes('bean') && formModel.bean > 0">
                <span>V豆: {{ formModel.bean }}</span>
              </li>
              <li v-if="welfareChecks.includes('point') && formModel.point > 0">
                <span>积分: {{ formModel.point }}</span>
              </li>
              <li v-if="welfareChecks.includes('right') && selectedRightList.length > 0">
                <span>权益: {{ previewRights }}</span>
              </li>
            </ol>
          </div>
          <div class="content-btn">前往[我的]查看</div>
        </div>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

import templateBlank0 from '@/assets/images/care-card/birthday_blank.png';
import templateBlank1 from '@/assets/images/care-card/festival_blank.png';
import templateBlank2 from '@/assets/images/care-card/common_blank.png';

import template0 from '@/assets/images/care-card/birthday.png';
import template1 from '@/assets/images/care-card/festival.png';
import template2 from '@/assets/images/care-card/common.png';

import Clickoutside from 'element-ui/src/utils/clickoutside';

const getFormModel = () => {
  return {
    name: '',
    description: '',
    // { id: '' }
    category: '',
    type: '0',
    style: '0',
    state: '0',
    publishTime: '09:00',
    triggerBoundary: '',
    triggerDate: '',
    triggerActivityChange: '0',
    triggerKilometres: '0',
    point: '0',
    bean: '0'
  };
};

export default {
  name: 'MemberBaseInfo',
  directives: { Clickoutside },
  data() {
    return {
      bindValue: ['riqi', '0'],
      options: [
        {
          value: 'riqi',
          label: '日期',
          children: [
            {
              value: '0',
              label: '生日'
            },
            {
              value: '5',
              label: '指定日期'
            }
          ]
        },
        {
          value: 'huiyuan',
          label: '会员',
          children: [
            {
              value: '2',
              label: '新会员'
            },
            {
              value: '7',
              label: '活跃度变化'
            }
          ]
        },
        {
          value: 'dingdan',
          label: '订单',
          children: [
            {
              value: '1',
              label: '累计消费'
            },
            {
              value: '6',
              label: '单次消费'
            }
          ]
        },
        {
          value: 'shouhou',
          label: '售后',
          children: [
            {
              value: '3',
              label: '保养到期'
            },
            {
              value: '4',
              label: '保险到期'
            }
          ]
        }
      ],
      defaultImg: '/resources/admin/images/default/icon_vip.png',
      categoryList: [],
      templateDialogVisible: false,
      flg: true,
      templateGroup: [
        { id: '0', name: '样式1', src: template0 },
        { id: '1', name: '样式2', src: template1 },
        { id: '2', name: '样式3', src: template2 }
      ],
      previewDialogOpen: false,
      rightSelectDialogVisible: false,
      loading: false,
      // rankData: {
      //   target: '0',
      //   members: [],
      //   memberRanks: []
      // },
      welfareChecks: [],
      welfareList: [
        { name: '积分', value: 'point' },
        { name: 'V豆', value: 'bean' },
        { name: '权益', value: 'rightList' }
      ],
      rightList: [],
      checkedRights: [],
      selectedRights: [],
      formModel: getFormModel(),
      operations: [
        {
          label: '预览',
          name: 'preview',
          type: ''
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:member.memberCare.care.edit']
        }
      ],
      rules: {
        category: [{ required: true, message: '请选择关怀卡分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入关怀卡名称', trigger: 'blur' }],
        welfare: [{ validator: this.validateWelfare, trigger: 'blur' }],
        triggerDate: [{ required: true, message: '请输入发放规则', trigger: 'blur' }],
        publishTime: [{ required: true, message: '请选择发放时间', trigger: 'blur' }]
      }
    };
  },
  props: {
    memberRankList: Array,
    defaultShop: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          address: ''
        };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  created() {
    this.getCategoryList();
    this.getRightList();
  },
  mounted() {},
  computed: {
    ...mapGetters(['getUser']),
    id() {
      return this.itemId.id;
    },
    shopId() {
      return (this.getUser.shop && this.getUser.shop.id) || window.top.SHOP_ID || '';
    },
    selectedRightList() {
      let arr = [];
      this.rightList.forEach(item => {
        item.rights &&
          item.rights.forEach(right => {
            if (this.selectedRights.includes(right.id)) {
              arr.push(right);
            }
          });
      });
      return arr;
    },
    previewCardBgImg() {
      switch (this.formModel.style) {
        case '0':
          return templateBlank0;
        case '1':
          return templateBlank1;
        case '2':
          return templateBlank2;
        default:
          return '';
      }
    },
    previewRights() {
      if (!this.selectedRightList.length) return '';
      return (
        this.selectedRightList
          .map(right => right.name)
          .splice(0, 2)
          .join(' ') + `${this.selectedRightList.length > 2 ? '...' : ''}`
      );
    }
  },
  watch: {
    id(nVal, oVal) {
      if (nVal !== oVal) {
        this.$refs.form.$el.scrollTop = 0;
        this.$refs.form.clearValidate();
        this.clear();
        if (nVal) {
          this.refresh();
        }
      }
    }
  },
  methods: {
    validateForm() {
      this.$refs.form.validateField('welfare');
    },
    validateWelfare(rule, value, callback) {
      const { welfareChecks, formModel, selectedRights } = this;
      const isValid =
        welfareChecks.length &&
        ((welfareChecks.includes('point') && formModel.point > 0) ||
          (welfareChecks.includes('bean') && formModel.bean > 0) ||
          (welfareChecks.includes('right') && !!selectedRights.length));
      if (!isValid) return callback(new Error('请选择关怀卡福利'));
      callback();
    },
    templateSelect(id) {
      this.formModel.style = id;
      this.templateDialogVisible = false;
    },
    // 获取关怀卡分类接口
    getCategoryList() {
      const { shopId } = this;
      const params = {
        shopId,
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.memberCareMgmt.categoryList, params)
        .then(data => {
          this.categoryList = data.dataList;
          this.formModel.category = this.categoryList[0].id;
        })
        .catch();
    },
    // 获取权益列表
    getRightList() {
      const params = {
        shopId: this.shopId
      };
      http
        .get(urls.memberCareMgmt.rightList, params)
        .then(data => {
          this.rightList = data.content;
        })
        .catch();
    },
    cancel() {
      this.checkedRights = [...this.selectedRights];
      this.rightSelectDialogVisible = false;
    },
    confirm() {
      if (this.checkedRights.length === 0) {
        this.$message('请选择权益');
      } else {
        this.selectedRights = [...this.checkedRights];
        this.rightSelectDialogVisible = false;
      }
    },
    operate(name) {
      this[name]();
    },
    clear() {
      this.$refs.form.clearValidate();
      this.formModel = getFormModel();
      if (this.categoryList[0]) {
        this.formModel.category = this.categoryList[0].id;
      }
      // this.$set(this.rankData, 'target', '0');
      // this.$set(this.rankData, 'members', []);
      // this.$set(this.rankData, 'memberRanks', []);
      // this.$refs.rank.clearData();
      this.selectedRights = [];
      this.checkedRights = [];
      this.welfareChecks = [];
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.itemId.id) {
            this.create();
          } else {
            this.update();
          }
        }
      });
    },
    // 添加接口
    create() {
      this.flg = true;
      const { shopId } = this;
      ['bean', 'point', 'right'].forEach((i, index) => {
        if (!this.welfareChecks.includes(i)) {
          if (index < 2) {
            this.formModel[i] = '0';
          } else {
            this.selectedRights = [];
            this.checkedRights = [];
          }
        }
      });
      const rightsList = this.selectedRights.map(rightId => ({ id: rightId }));
      if (this.welfareChecks.includes('right') && rightsList.length === 0) {
        this.$message.warning('请选择权益');
        this.flg = false;
      }
      if (this.flg) {
        this.formModel.type = this.bindValue[1];
        const params = Object.assign(
          {},
          this.formModel,
          { category: { id: this.formModel.category } },
          // this.rankData,
          { rightsList },
          { shopId }
        );
        http
          .post(urls.memberCareMgmt.memberCare, params)
          .then(data => {
            this.$message.success('操作成功');
            this.$emit('refresh', data.data.id);
          })
          .catch(err => {
            this.$notify({
              message: err.errorMessage,
              type: 'warning'
            });
          });
      } else {
        return false;
      }
    },
    // 更新接口
    update() {
      this.flg = true;
      const { shopId } = this;
      ['bean', 'point', 'right'].forEach((i, index) => {
        if (!this.welfareChecks.includes(i)) {
          if (index < 2) {
            this.formModel[i] = '0';
          } else {
            this.selectedRights = [];
            this.checkedRights = [];
          }
        }
      });
      this.formModel.type = this.bindValue[1];
      const rightsList = this.selectedRights.map(rightId => ({ id: rightId }));
      if (this.welfareChecks.includes('right') && rightsList.length === 0) {
        this.$message.warning('请选择权益');
        this.flg = false;
      }
      if (this.flg) {
        const params = Object.assign(
          {},
          this.formModel,
          { category: { id: this.formModel.category } },
          // this.rankData,
          { rightsList },
          { shopId },
          { id: this.itemId.id }
        );
        http
          .put(urls.memberCareMgmt.memberCare, params)
          .then(data => {
            this.$message.success('更新成功');
            this.$emit('refresh', data.data.id);
          })
          .catch(err => {
            this.$notify({
              message: err.errorMessage,
              type: 'warning'
            });
          });
      } else {
        return false;
      }
    },
    // 预览
    preview() {
      this.previewDialogOpen = true;
    },
    // 查询
    refresh() {
      const { id } = this.itemId;
      const params = { id };
      http
        .get(urls.memberCareMgmt.memberCare, params)
        .then(data => {
          this.formModel = Object.assign({}, getFormModel(), data.data);
          this.formModel.category = data.data.category.id;
          if (this.formModel.type === '0' || this.formModel.type === '5') {
            this.bindValue = ['riqi', this.formModel.type];
          } else if (this.formModel.type === '2' || this.formModel.type === '7') {
            this.bindValue = ['huiyuan', this.formModel.type];
          } else if (this.formModel.type === '1' || this.formModel.type === '6') {
            this.bindValue = ['dingdan', this.formModel.type];
          } else if (this.formModel.type === '3' || this.formModel.type === '4') {
            this.bindValue = ['shouhou', this.formModel.type];
          }
          // const { target, members, memberRanks } = data.data;
          // this.rankData.target = target;
          // this.rankData.members = members;
          // this.rankData.memberRanks = memberRanks;
          // if (this.rankData.target === '0') {
          //   this.$refs.rank.getVipCount();
          // } else if (this.rankData.memberRanks.length) {
          //   this.$refs.rank.memberRankHandle();
          // }
          this.selectedRights = data.data.rightsList.map(right => right.id);
          this.checkedRights = [...this.selectedRights];
          data.data.bean !== '0' && this.welfareChecks.push('bean');
          data.data.point !== '0' && this.welfareChecks.push('point');
          data.data.rightsList.length > 0 && this.welfareChecks.push('right');
        })
        .catch();
    }
  }
};
</script>

<style lang="scss">
.rights-select {
  .el-dialog__footer {
    text-align: right;
  }
  .el-checkbox {
    margin-left: 30px;
    width: 220px;
    top: -25px;
    .right_name {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
    img {
      position: relative;
      top: 20px;
      margin-right: 10px;
    }
  }
  .el-dialog--center .el-dialog__footer {
    text-align: right;
  }
}

.care-card-preview {
  .card-preview {
    margin: 0 auto;
    width: 350px;
    height: 623px;
    position: relative;
    img {
      position: absolute;
      width: 350px;
      object-fit: cover;
    }
    .preview-content {
      height: 153px;
      z-index: 1;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #000;
      font-size: 16px;
      left: 100px;
      top: 300px;
      span {
        color: #000;
      }
      ol {
        padding-left: 5px;
        li {
          color: #bd9f6e;
        }
      }
      .content-btn {
        font-size: 14px;
        margin-top: 30px;
        margin-left: 5px;
        color: #fff;
        border-radius: 10px;
        text-align: center;
        width: 120px;
        line-height: 28px;
      }
    }
    &.card-style-0 {
      .preview-content {
        width: 180px;
        top: 260px;
      }
      .content-btn {
        background: #5348a5;
      }
    }
    &.card-style-1 {
      .preview-content {
        top: 320px;
      }
      ol li {
        color: #eb4a47;
      }
      .content-btn {
        background: #eb4a47;
      }
    }
    &.card-style-2 {
      .preview-content {
        top: 250px;
      }
      .content-btn {
        background: linear-gradient(#fae3b4, #cdaf80, #aa8858);
      }
    }
  }
}

.template-preview {
  .el-dialog__body {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .template-item {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .template-name {
      font-size: 16px;
      color: #101010;
      margin-bottom: 5px;
    }
    .template-img {
      width: 226px;
      margin-bottom: 20px;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
  }
}

.care-card-base-info {
  .biz-save-button {
    margin-top: 10px;
    margin-bottom: 10px;
    float: left;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .el-radio {
      width: 100px;
      margin-bottom: 5px;
    }
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    .selected-right-list {
      .right-item {
        display: flex;
        padding: 5px 0px;
        font-size: 14px;
        line-height: 50px;
        img {
          width: 50px;
          height: 50px;
          margin: 0px 10px 0px 0px;
          object-fit: cover;
        }
        .right-name {
          width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
      }
    }
  }
}
</style>
