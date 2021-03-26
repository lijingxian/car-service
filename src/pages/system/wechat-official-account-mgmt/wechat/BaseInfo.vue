<template>
  <biz-grid class="base-info-list" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <!-- <el-form-item label="店铺名称">
        <el-select v-model="form.shopId" placeholder="请选择店铺">
          <el-option v-for="item of shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="微信公众号" prop="showName">
        <!-- <el-select v-model="form.id" placeholder="请选择店铺" @change="changeShopId">
          <el-option v-for="item of wechatOpenList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select> -->
        <el-button type="text" size="mini" v-popover:showName>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="showName" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【设置】->【公众号设置】->【账号详情】->查看名称
        </el-popover>
        <el-input placeholder="请输入微信公众号" v-model="form.showName" clearable></el-input>
      </el-form-item>
      <el-form-item label="微信公众号ID" prop="showId">
        <el-button type="text" size="mini" v-popover:showId>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="showId" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【设置】->【公众号设置】->【账号详情】->查看微信号
        </el-popover>
        <el-input placeholder="请输入公众号ID" v-model="form.showId" clearable></el-input>
      </el-form-item>
      <el-form-item label="微信原始ID" prop="wecharId">
        <el-button type="text" size="mini" v-popover:wecharId>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="wecharId" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【设置】->【公众号设置】->【账号详情】->查看原始ID
        </el-popover>
        <el-input placeholder="请输入原始ID" v-model="form.wecharId" clearable></el-input>
      </el-form-item>
      <el-form-item label="微信AppID" prop="appId">
        <el-button type="text" size="mini" v-popover:appId>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="appId" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【开发】->【基本配置】->查看开发者ID
        </el-popover>
        <el-input placeholder="请输入AppID" v-model="form.appId" clearable></el-input>
      </el-form-item>
      <el-form-item label="微信AppSecret" prop="appSecret">
        <el-button type="text" size="mini" v-popover:appSecret>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="appSecret" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【开发】->【基本配置】->查看开发者密码
        </el-popover>
        <el-input placeholder="请输入AppSecret" v-model="form.appSecret" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户号：" prop="wechatPay.mchId">
        <el-button type="text" size="mini" v-popover:mchId>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="mchId" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【微信支付】->【商户信息】->查看商户号
        </el-popover>
        <el-input placeholder="请输入商户号" v-model="form.wechatPay.mchId" clearable></el-input>
      </el-form-item>
      <el-form-item label="API密钥：" prop="wechatPay.apikey">
        <el-button type="text" size="mini" v-popover:apikey>
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="apikey" placement="bottom-start" width="400" trigger="hover">
          可登陆【公众平台】（mp.weixin.qq.com）->【微信支付】->【API安全】->查看API秘钥
        </el-popover>
        <el-input placeholder="请输入API密钥" v-model="form.wechatPay.apiKey" clearable></el-input>
      </el-form-item>
      <el-form-item label="上传二维码：" prop="qrCodePath">
        <div style="float:left">
          <el-button type="text" size="mini" v-popover:qrCodePath>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="qrCodePath" placement="bottom-start" width="400" trigger="hover">
            可登陆【公众平台】（mp.weixin.qq.com）->【设置】->【公众号设置】->【账号详情】->下载二维码
          </el-popover>
        </div>
        <BizAvatarUploaderNew v-model="form.qrCodePath" title="请上传小于64k的以gif,jpeg,jpg,png结尾的图片文件">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="API证书：" prop="wechatPay.apiclientCert">
        <div style="float:left">
          <el-button type="text" size="mini" v-popover:codePop>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="codePop" placement="bottom-start" width="400" trigger="hover">
            可登陆【公众平台】（mp.weixin.qq.com）->【微信支付】->【API安全】->下载API证书
          </el-popover>
        </div>
        <BizAvatarUploaderNew v-model="form.wechatPay.apiclientCert" :fileType="'3'">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label=" ">
        <el-checkbox v-model="form.isDefault" :true-label="'true'" :false-label="'false'">是否设为默认公众号</el-checkbox>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { systemSetting } from '@/common/urls';
import http from '@/common/http';
import { BizAvatarUploaderNew } from '@/components/BizForm';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      list: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: this.getDefaultData(),
      shopList: [],
      wechatOpenList: [],
      rules: {
        showName: [{ required: true, message: '请输入微信公众号名称', trigger: 'blur' }],
        showId: [{ required: true, message: '请输入微信公众号ID', trigger: 'blur' }],
        wecharId: [{ required: true, message: '请输入微信原始ID', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入微信AppID', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入微信AppSecret', trigger: 'blur' }],
        qrCodePath: [{ required: true, message: '请上传二维码', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BizAvatarUploaderNew },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        this.form = this.getDefaultData();
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    getDefaultData() {
      return {
        appId: '',
        appSecret: '',
        wecharId: '',
        shop: '',
        isDefault: '',
        showId: '',
        showName: '',
        qrCodePath: '',
        wechatPay: {
          mchId: '',
          apiKey: '',
          apiclientCert: ''
        },
        wechatMenues: [],
        id: ''
      };
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.id) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        id: this.id
      };
      http
        .get(systemSetting.queryWechatOpen, params)
        .then(data => {
          this.form = data.data;
          this.shopList = data.shopList;
          this.wechatOpenList = data.wechatOpenList;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    create() {
      this.loading = true;
      http
        .post(systemSetting.saveWechatOpen, this.form)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('created');
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      http
        .put(systemSetting.updateWechatOpen, this.form)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('created');
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.base-info-list {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .avatar {
    text-align: left;
  }
  .biz-avatar-uploader {
    float: left;
    .name {
      width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
    }
  }
}
</style>
