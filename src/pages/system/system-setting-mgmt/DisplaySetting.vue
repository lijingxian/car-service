<template>
  <biz-grid class="system-setting-mgmt" v-loading="loading">
    <div slot="top" class="header-button">
      <biz-header :operations="operations" @operate="operate">
      </biz-header>
    </div>
    <div class="display-setting">
      <el-form ref="form" :model="form" size="small">
        <el-form-item label="默认车辆图片：">
          <div class="el-item-con">
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultCarImage">
              </biz-avatar-uploader-new>
              <span class="name">轿车</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultTruckImage">
              </biz-avatar-uploader-new>
              <span class="name">卡车</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="默认用户头像：">
          <div class="el-item-con">
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultMaleImage">
              </biz-avatar-uploader-new>
              <span class="name">男性</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultFemaleImage">
              </biz-avatar-uploader-new>
              <span class="name">女性</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultSecretImage">
              </biz-avatar-uploader-new>
              <span class="name">保密</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="默认会员卡等级图：">
          <biz-avatar-uploader-new v-model="form.defaultMemberRankImage">
          </biz-avatar-uploader-new>
        </el-form-item>
        <el-form-item label="默认店铺Logo：">
          <biz-avatar-uploader-new v-model="form.defaultStoreLogoImage">
          </biz-avatar-uploader-new>
        </el-form-item>
        <el-form-item label="默认活动图：">
          <div class="el-item-con">
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultShakeImage">
              </biz-avatar-uploader-new>
              <span class="name">摇一摇</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultRedPacketImage">
              </biz-avatar-uploader-new>
              <span class="name">抢红包</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultLotteryImage">
              </biz-avatar-uploader-new>
              <span class="name">抽奖</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultGroupBuyingImage">
              </biz-avatar-uploader-new>
              <span class="name">拼团购</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultPanicBuyingImage">
              </biz-avatar-uploader-new>
              <span class="name">N元抢购</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultBargainImage">
              </biz-avatar-uploader-new>
              <span class="name">帮砍价</span>
            </div>
          </div>
          <div class="el-item-con pad-style">
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultSeckillImage">
              </biz-avatar-uploader-new>
              <span class="name">限时秒杀</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultRecommendRewardImage">
              </biz-avatar-uploader-new>
              <span class="name">推荐有礼</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultShareImage">
              </biz-avatar-uploader-new>
              <span class="name">分享有礼</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultRecruitImage">
              </biz-avatar-uploader-new>
              <span class="name">活动招募</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultFreeShippingImage">
              </biz-avatar-uploader-new>
              <span class="name">包邮</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultCouponImage">
              </biz-avatar-uploader-new>
              <span class="name">优惠券</span>
            </div>
          </div>
          <div class="el-item-con pad-style">
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultPromotionImage">
              </biz-avatar-uploader-new>
              <span class="name">促销</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultFullCutImage">
              </biz-avatar-uploader-new>
              <span class="name">满减</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultDiscountImage">
              </biz-avatar-uploader-new>
              <span class="name">折扣</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultFullGiftImage">
              </biz-avatar-uploader-new>
              <span class="name">满送</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultPackageImage">
              </biz-avatar-uploader-new>
              <span class="name">套餐</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="默认商品图：">
          <div class="el-item">
            <biz-avatar-uploader-new v-model="form.defaultThumbnailProductImage">
            </biz-avatar-uploader-new>
            <span class="name">缩略图</span>
          </div>
        </el-form-item>
        <el-form-item label="虚拟商品图：">
          <div class="el-item-con">
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultOneKeyRescueImage">
              </biz-avatar-uploader-new>
              <span class="name">一键救援</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultAppointmentReplacementImage">
              </biz-avatar-uploader-new>
              <span class="name">预约置换</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultAppointmentProductImage">
              </biz-avatar-uploader-new>
              <span class="name">贷款购车</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultAppointmentTestImage">
              </biz-avatar-uploader-new>
              <span class="name">预约体验</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultUserCardRechargeImage">
              </biz-avatar-uploader-new>
              <span class="name">会员卡充值</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultSimRechargeImage">
              </biz-avatar-uploader-new>
              <span class="name">通讯卡充值</span>
            </div>
            <div class="el-item">
              <biz-avatar-uploader-new v-model="form.defaultAppointmentMaintainImage">
              </biz-avatar-uploader-new>
              <span class="name">预约保养</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </biz-grid>
</template>

<script>
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'DisplaySetting',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      form: {
        defaultCarImage: '',
        defaultTruckImage: '',
        defaultMaleImage: '',
        defaultFemaleImage: '',
        defaultSecretImage: '',
        defaultMemberRankImage: '',
        defaultStoreLogoImage: '',
        defaultShakeImage: '',
        defaultRedPacketImage: '',
        defaultLotteryImage: '',
        defaultGroupBuyingImage: '',
        defaultPanicBuyingImage: '',
        defaultSeckillImage: '',
        defaultBargainImage: '',
        defaultRecommendRewardImage: '',
        defaultShareImage: '',
        defaultRecruitImage: '',
        defaultFreeShippingImage: '',
        defaultCouponImage: '',
        defaultPromotionImage: '',
        defaultFullCutImage: '',
        defaultDiscountImage: '',
        defaultFullGiftImage: '',
        defaultPackageImage: '',
        defaultThumbnailProductImage: '',
        defaultOneKeyRescueImage: '',
        defaultAppointmentReplacementImage: '',
        defaultAppointmentProductImage: '',
        defaultAppointmentTestImage: '',
        defaultUserCardRechargeImage: '',
        defaultSimRechargeImage: '',
        defaultAppointmentMaintainImage: ''
      }
    };
  },
  components: {
    BizHeader,
    BizAvatarUploaderNew,
    BizGrid
  },
  props: {},
  watch: {},
  created() {
    this.refresh();
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        type: '1'
      };

      http
        .get(urls.systemSetting.settings, params)
        .then(data => {
          console.log('显示设置', data);
          this.form.defaultCarImage = data.settingList.defaultCarImage;
          this.form.defaultTruckImage = data.settingList.defaultTruckImage;
          this.form.defaultMaleImage = data.settingList.defaultMaleImage;
          this.form.defaultFemaleImage = data.settingList.defaultFemaleImage;
          this.form.defaultSecretImage = data.settingList.defaultSecretImage;
          this.form.defaultMemberRankImage = data.settingList.defaultMemberRankImage;
          this.form.defaultStoreLogoImage = data.settingList.defaultStoreLogoImage;
          this.form.defaultShakeImage = data.settingList.defaultShakeImage;
          this.form.defaultRedPacketImage = data.settingList.defaultRedPacketImage;
          this.form.defaultLotteryImage = data.settingList.defaultLotteryImage;
          this.form.defaultGroupBuyingImage = data.settingList.defaultGroupBuyingImage;
          this.form.defaultPanicBuyingImage = data.settingList.defaultPanicBuyingImage;
          this.form.defaultSeckillImage = data.settingList.defaultSeckillImage;
          this.form.defaultBargainImage = data.settingList.defaultBargainImage;
          this.form.defaultRecommendRewardImage = data.settingList.defaultRecommendRewardImage;
          this.form.defaultShareImage = data.settingList.defaultShareImage;
          this.form.defaultRecruitImage = data.settingList.defaultRecruitImage;
          this.form.defaultFreeShippingImage = data.settingList.defaultFreeShippingImage;
          this.form.defaultCouponImage = data.settingList.defaultCouponImage;
          this.form.defaultPromotionImage = data.settingList.defaultPromotionImage;
          this.form.defaultFullCutImage = data.settingList.defaultFullCutImage;
          this.form.defaultDiscountImage = data.settingList.defaultDiscountImage;
          this.form.defaultFullGiftImage = data.settingList.defaultFullGiftImage;
          this.form.defaultPackageImage = data.settingList.defaultPackageImage;
          this.form.defaultThumbnailProductImage = data.settingList.defaultThumbnailProductImage;
          this.form.defaultOneKeyRescueImage = data.settingList.defaultOneKeyRescueImage;
          this.form.defaultAppointmentReplacementImage = data.settingList.defaultAppointmentReplacementImage;
          this.form.defaultAppointmentProductImage = data.settingList.defaultAppointmentProductImage;
          this.form.defaultAppointmentTestImage = data.settingList.defaultAppointmentTestImage;
          this.form.defaultUserCardRechargeImage = data.settingList.defaultUserCardRechargeImage;
          this.form.defaultSimRechargeImage = data.settingList.defaultSimRechargeImage;
          this.form.defaultAppointmentMaintainImage = data.settingList.defaultAppointmentMaintainImage;
        })
        .catch(() => {})
        .finally(() => {});
    },
    update() {
      let params = {
        defaultCarImage: this.form.defaultCarImage,
        defaultTruckImage: this.form.defaultTruckImage,
        defaultMaleImage: this.form.defaultMaleImage,
        defaultFemaleImage: this.form.defaultFemaleImage,
        defaultSecretImage: this.form.defaultSecretImage,
        defaultMemberRankImage: this.form.defaultMemberRankImage,
        defaultStoreLogoImage: this.form.defaultStoreLogoImage,
        defaultShakeImage: this.form.defaultShakeImage,
        defaultRedPacketImage: this.form.defaultRedPacketImage,
        defaultLotteryImage: this.form.defaultLotteryImage,
        defaultGroupBuyingImage: this.form.isSiteEnabled,
        defaultSeckillImage: this.form.defaultSeckillImage,
        defaultPanicBuyingImage: this.form.defaultPanicBuyingImage,
        defaultBargainImage: this.form.defaultBargainImage,
        defaultRecommendRewardImage: this.form.defaultRecommendRewardImage,
        defaultShareImage: this.form.defaultShareImage,
        defaultRecruitImage: this.form.defaultRecruitImage,
        defaultFreeShippingImage: this.form.defaultFreeShippingImage,
        defaultCouponImage: this.form.defaultCouponImage,
        defaultPromotionImage: this.form.defaultPromotionImage,
        defaultFullCutImage: this.form.defaultFullCutImage,
        defaultDiscountImage: this.form.defaultDiscountImage,
        defaultFullGiftImage: this.form.defaultFullGiftImage,
        defaultPackageImage: this.form.defaultPackageImage,
        defaultThumbnailProductImage: this.form.defaultThumbnailProductImage,
        defaultOneKeyRescueImage: this.form.defaultOneKeyRescueImage,
        defaultAppointmentReplacementImage: this.form.defaultAppointmentReplacementImage,
        defaultAppointmentProductImage: this.form.defaultAppointmentProductImage,
        defaultAppointmentTestImage: this.form.defaultAppointmentTestImage,
        defaultUserCardRechargeImage: this.form.defaultUserCardRechargeImage,
        defaultSimRechargeImage: this.form.defaultSimRechargeImage,
        defaultAppointmentMaintainImage: this.form.defaultAppointmentMaintainImage
      };
      http
        .put(urls.systemSetting.querySystemSetting, params)
        .then(data => {
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
        })
        .catch(error => {
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    }
  }
};
</script>

<style lang="scss">
.display-setting {
  width: 100%;
  .header-button {
    margin-top: 5px;
    margin-left: 15px;
  }

  .el-item-con {
    display: flex;
    width: 75%;
  }
  .pad-style {
    padding: 20px 0 0 200px;
  }
  .el-item {
    display: flex;
    flex-direction: column;
    margin-right: 25px;

    .name {
      width: 118px;
      display: block;
      text-align: center;
      color: #606266;
    }
  }
  .biz-save-button {
    margin-top: 5px;
  }
  .el-input {
    width: 40%;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    margin-top: 0px;
    margin-left: 0%;
  }
  .el-form-item__label {
    width: 200px;
    text-align: right;
    vertical-align: middle;
    float: left;
    padding: 0 12px 0 0;
  }
  .input-picture-setting {
    width: 100px;
  }
  .input-nomal-width {
    width: 360px;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-col {
    width: 200px;
  }
}
</style>
