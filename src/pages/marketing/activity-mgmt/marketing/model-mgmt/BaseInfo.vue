<template>
  <div class="activity-mgmt-model-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form v-loading="loading" :rules="rules" ref="form" :model="form" label-width="100px" size="small" :inline-message="true">
      <el-form-item label="模板名称" prop="title">
        <el-input placeholder="请输入模板名称" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-select v-model="templateType" placeholder="请选择模板类型" @change="templateChange" :disabled="!!form.id">
          <el-option v-for="(type,index) of modelTypes" :key="index" :label="type.label" :value="type.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动类型" prop="marketingType">
        <el-select v-model="form.marketingType" @change="typeChange" placeholder="请选择活动类型" :disabled="!!form.id">
          <el-option :label="activityType.label" :value="activityType.value" :key="index" v-for="(activityType,index) of atypes">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动方案">
        <el-select v-model="form.shape" placeholder="请选择活动方案">
          <el-option :label="shape.label" :value="shape.value" v-for="(shape,index) of activityshapes" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动效果图">
      </el-form-item>
      <div class="activity-model-preview">
        <el-radio-group :value="previewType" size="mini" @input="modeChange">
          <el-radio-button label="vertical">纵版</el-radio-button>
          <el-radio-button label="horizontal">横版</el-radio-button>
        </el-radio-group>
        <iframe ref="iframe" @load="onLoad" :src="'/#/site/single-page?shopId=10&channel=10&activityId='+form.id+'_template'"
          frameborder="0" v-if="(['0', '1', '2'].includes(form.marketingType) || form.marketingType === '11')&&form.id" width="375px" height="560px"></iframe>
        <img :src="previewImg" alt="" width="200px" v-else>
      </div>
    </el-form>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import Service from '@/service/activity-mgmt/marketing/model-mgmt/activityMgmtModelMgmt';
import QHBImage from '@/assets/images/activity-model/qhb.png';
import YYYImage from '@/assets/images/activity-model/yyy.png';
import CJYImage from '@/assets/images/activity-model/cjy.png';
import CJFImage from '@/assets/images/activity-model/cjf.png';
import PTGImage from '@/assets/images/activity-model/ptg.png';
import NYQGImage from '@/assets/images/activity-model/nyqg.png';
import XSMSImage from '@/assets/images/activity-model/xsms.png';
import BKJImage from '@/assets/images/activity-model/bkj.png';
import TJYLImage from '@/assets/images/activity-model/tjyl.png';
import FXYLImage from '@/assets/images/activity-model/fxyl.png';
import ZMImage from '@/assets/images/activity-model/zm.png';

import BYImage from '@/assets/images/activity-model/by.png';
import CXImage from '@/assets/images/activity-model/cx.png';
import MJImage from '@/assets/images/activity-model/mj.png';
import MSImage from '@/assets/images/activity-model/ms.png';
import TCImage from '@/assets/images/activity-model/tc.png';
import YHQImage from '@/assets/images/activity-model/yhq.png';
import ZKImage from '@/assets/images/activity-model/zk.png';

export default {
  name: 'ActivityMgmtModelMgmtBaseInfo',
  data() {
    return {
      previewType: 'vertical',
      isCreated: true,
      loading: false,
      templateType: '0',
      imgs: {
        qhb: QHBImage,
        yyy: YYYImage,
        cjy: CJYImage,
        cjf: CJFImage,
        ptg: PTGImage,
        nyqg: NYQGImage,
        xsms: XSMSImage,
        bkj: BKJImage,
        tjyl: TJYLImage,
        fxyl: FXYLImage,
        by: BYImage,
        cx: CXImage,
        mj: MJImage,
        ms: MSImage,
        tc: TCImage,
        yhq: YHQImage,
        zk: ZKImage,
        zm: ZMImage
      },
      form: {
        id: '',
        title: '',
        marketingType: '0',
        shape: '0'
      },
      operations: [
        {
          label: '刷新',
          name: 'reLoad',
          type: 'primary',
          class: 'hidden'
        },
        {
          label: '编辑',
          name: 'edit',
          type: 'primary',
          class: 'hidden'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      modelTypes: [
        {
          label: '营销活动',
          value: '0'
        },
        {
          label: '促销活动',
          value: '1'
        }
      ],
      activityTypes: [
        {
          label: '抢红包',
          value: '0'
        },
        {
          label: '摇一摇',
          value: '1'
        },
        {
          label: '抽奖',
          value: '2'
        },
        {
          label: '拼团购',
          value: '3'
        },
        {
          label: 'N元抢购',
          value: '4'
        },
        {
          label: '限时秒杀',
          value: '5'
        },
        {
          label: '帮砍价',
          value: '6'
        },
        {
          label: '推荐有礼',
          value: '7'
        },
        {
          label: '分享有礼',
          value: '8'
        },
        {
          label: '活动招募',
          value: '9'
        },
        {
          label: '潜客活动',
          value: '11'
        }
      ],
      promotionTypes: [
        {
          label: '包邮',
          value: '0'
        },
        {
          label: '优惠券',
          value: '1'
        },
        {
          label: '促销',
          value: '2'
        },
        {
          label: '满减',
          value: '3'
        },
        {
          label: '折扣',
          value: '4'
        },
        {
          label: '满送',
          value: '5'
        },
        {
          label: '套餐',
          value: '6'
        }
      ],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        marketingType: [{ required: true, message: '请输入活动类型', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton },
  created() {},
  computed: {
    previewImg() {
      if (this.templateType === '0') {
        switch (this.form.marketingType) {
          case '0':
            return this.imgs.qhb;
          case '1':
            return this.imgs.yyy;
          case '2':
            if (this.form.shape === '0') {
              return this.imgs.cjy;
            } else if (this.form.shape === '1') {
              return this.imgs.cjf;
            } else {
            }
            return '';
          case '3':
            return this.imgs.ptg;
          case '4':
            return this.imgs.nyqg;
          case '5':
            return this.imgs.xsms;
          case '6':
            return this.imgs.bkj;
          case '7':
            return this.imgs.tjyl;
          case '8':
            return this.imgs.fxyl;
          case '9':
            return this.imgs.zm;
          default:
            return '';
        }
      } else if (this.templateType === '1') {
        switch (this.form.marketingType) {
          case '0':
            return this.imgs.by;
          case '1':
            return this.imgs.yhq;
          case '2':
            return this.imgs.cx;
          case '3':
            return this.imgs.mj;
          case '4':
            return this.imgs.zk;
          case '5':
            return this.imgs.ms;
          case '6':
            return this.imgs.tc;
          default:
            return '';
        }
      } else {
        return '11';
      }
    },
    activityshapes() {
      let activityshapes = [];
      if (this.templateType === '0') {
        switch (this.form.marketingType) {
          case '0':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '1':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '2':
            activityshapes.push({
              label: '圆形抽奖',
              value: '0'
            });
            activityshapes.push({
              label: '方形抽奖',
              value: '1'
            });
            break;
          case '3':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '4':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '5':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '6':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '7':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '8':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '9':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          default:
            break;
        }
      } else if (this.templateType === '1') {
        switch (this.form.marketingType) {
          case '0':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '1':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '2':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '3':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '4':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '5':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '6':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '7':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;
          case '8':
            activityshapes.push({
              label: '默认方案',
              value: '0'
            });
            break;

          default:
            break;
        }
      } else {
        activityshapes.push({
          label: '默认方案',
          value: '0'
        });
      }

      return activityshapes;
    },
    atypes() {
      if (this.templateType === '0') {
        return this.activityTypes;
      } else if (this.templateType === '1') {
        return this.promotionTypes;
      } else {
        return [];
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    modeChange(val) {
      this.previewType = val;
      if (val === 'horizontal') {
        this.$refs.iframe.height = '207px';
      } else {
        this.$refs.iframe.height = '560px';
      }
      this.$refs.iframe.src = `/#/template-single-page?id=${this.form.id}&mode=${val}`;
      this.$refs.iframe.contentWindow.location.reload(true);
    },
    reLoad() {
      this.$refs.iframe.contentWindow.location.reload(true);
    },
    onLoad() {
      setTimeout(() => {
        if (this.previewType === 'horizontal') {
          this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '13px';
        } else {
          this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '37.5px';
        }
      }, 200);
    },
    edit() {
      let link = document.createElement('a');
      if (['0', '1', '2'].includes(this.form.marketingType)) {
        link.setAttribute('href', `/#/template-editor?id=${this.form.id}`);
      } else {
        link.setAttribute('href', '/#/site/index?activityId=' + this.form.id + '_template');
      }
      link.target = '_blink';
      let evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true);
      link.dispatchEvent(evt);
    },
    templateChange() {
      if (this.form.marketingType === '11') {
        if (this.form.id) {
          this.operations[0].class = 'show';
          this.operations[1].class = 'show';
        }
      } else {
        this.form.marketingType = '0';
        this.operations[0].class = 'hidden';
        this.operations[1].class = 'hidden';
      }
    },
    typeChange() {
      this.$refs.form.clearValidate('marketingType');
      this.form.shape = '0';
    },
    clear() {
      this.isCreated = true;
      this.$refs.form.clearValidate();
      this.operations[0].class = 'hidden';
      this.operations[1].class = 'hidden';
      this.form = {
        id: '',
        title: '',
        marketingType: '',
        shape: '0'
      };
    },
    save() {
      this.$refs.form.validate(isValid => {
        if (isValid) {
          if (this.isCreated) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    create() {
      let params = {
        name: this.form.title,
        templateType: this.templateType,
        marketingType: this.form.marketingType,
        shape: this.form.shape
      };

      this.loading = true;

      Service.create(
        params,
        data => {
          this.$message.success('操作成功');
          this.loading = false;
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        id: this.form.id,
        name: this.form.title,
        templateType: this.templateType,
        marketingType: this.form.marketingType,
        shape: this.form.shape
      };

      this.loading = true;

      Service.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.loading = false;
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    refresh(activity) {
      this.$refs.form.clearValidate();
      this.isCreated = false;
      this.templateType = activity.templateType;
      this.form.id = activity.id;
      this.form.title = activity.name;
      this.form.shape = activity.shape;
      this.form.type = activity.type;
      this.form.marketingType = activity.marketingType;
      console.log(1111);
      if (activity.templateType === '0' && activity.marketingType === '3') {
        this.$refs.iframe.src = '/#/site/single-page?shopId=10&channel=10&activityId=' + this.form.id + '_template';
        this.$refs.iframe.contentWindow.location.reload(true);
      } else if (['0', '1', '2'].includes(activity.marketingType)) {
        // '0': 抢红包, '1': 摇一摇, '2': 抽奖,
        this.$refs.iframe.src = `/#/template-single-page?id=${this.form.id}`;
        this.$refs.iframe.contentWindow.location.reload(true);
      }
      // this.form.marketingType = activity.marketingType;
      if ((activity.marketingType === '11' || ['0', '1', '2'].includes(activity.marketingType)) && activity.templateType === '0') {
        this.operations[0].class = 'show';
        this.operations[1].class = 'show';
      } else {
        this.operations[0].class = 'hidden';
        this.operations[1].class = 'hidden';
      }
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-model-mgmt-base-info {
  .biz-save-button {
    margin: 10px;
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .activity-model-preview {
      display: flex;
      flex-direction: column;
      margin-left: 100px;
    }
  }
}
</style>
