<template>
  <biz-grid class="system-setting-mgmt" v-loading="loading">
    <div slot="top" class="header-button">
      <biz-header :operations="operations" @operate="operate">
      </biz-header>
    </div>
    <div class="registration-and-security-setting">
      <el-form ref="form" :rules="rules" :model="form" size="small">
        <el-form-item label="禁用用户名：" prop="disabledUsername">
          <el-input placeholder="请输入禁用用户名" v-model="form.disabledUsername" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="用户名最小长度：" prop="usernameMinLength">
          <el-input placeholder="请输入用户名最小长度" v-model="form.usernameMinLength" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="用户名最大长度：" prop="usernameMaxLength">
          <el-input placeholder="请输入用户名最大长度" v-model="form.usernameMaxLength" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="密码最小长度：" prop="passwordMinLength">
          <el-input placeholder="请输入密码最小长度" v-model="form.passwordMinLength" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="密码最大长度：" prop="passwordMaxLength">
          <el-input placeholder="请输入密码最大长度" v-model="form.passwordMaxLength" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="注册协议：" prop="registerAgreement">
          <el-input placeholder="请输入注册协议" v-model="form.registerAgreement" class="input-nomal-width" type="textarea" :autosize="{ minRows: 8, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="是否允许E-mail登录：" prop="isEmailLogin">
          <el-radio v-model="form.isEmailLogin" label="true">是</el-radio>
          <el-radio v-model="form.isEmailLogin" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="验证码类型：">
          <el-scrollbar>
            <el-checkbox-group v-model="form.captchaTypes">
              <div class="checkbox-group">
                <el-checkbox v-for="item in captchaTypes4Selection" :key="item.id" :label="item.id">
                  <div class="checkbox-group-item">{{item.name}}</div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-scrollbar>
        </el-form-item>
        <el-form-item label="连续登录失败最大次数：" prop="accountLockCount">
          <el-input placeholder="请输入连续登录失败最大次数" v-model="form.accountLockCount" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="上传文件最大限制：" prop="uploadMaxSize">
          <el-input placeholder="请输入上传文件最大限制" v-model="form.uploadMaxSize" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传图片扩展名：" prop="uploadImageExtension">
          <el-input placeholder="请输入允许上传图片扩展名" v-model="form.uploadImageExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传Flash扩展名：" prop="uploadFlashExtension">
          <el-input placeholder="请输入允许上传Flash扩展名" v-model="form.uploadFlashExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传媒体扩展名：" prop="uploadMediaExtension">
          <el-input placeholder="请输入允许上传媒体扩展名" v-model="form.uploadMediaExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传文件扩展名：" prop="uploadFileExtension">
          <el-input placeholder="请输入允许上传文件扩展名" v-model="form.uploadFileExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传升级文件扩展名：" prop="uploadUpgradeExtension">
          <el-input placeholder="请输入允许上传升级文件扩展名" v-model="form.uploadUpgradeExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="图片上传路径：" prop="imageUploadPath">
          <el-input placeholder="请输入图片上传路径" v-model="form.imageUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="Flash上传路径:：" prop="flashUploadPath">
          <el-input placeholder="请输入Flash上传路径" v-model="form.flashUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="媒体上传路径：" prop="mediaUploadPath">
          <el-input placeholder="请输入媒体上传路径" v-model="form.mediaUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="文件上传路径：" prop="fileUploadPath">
          <el-input placeholder="请输入文件上传路径" v-model="form.fileUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="升级文件上传路径：" prop="upgradeUploadPath">
          <el-input placeholder="请输入升级文件上传路径" v-model="form.upgradeUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="VR文件上传路径：" prop="vrUploadPath">
          <el-input placeholder="请输入VR文件上传路径" v-model="form.vrUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺上传路径前缀：" prop="shopUploadPathPrefix">
          <el-input placeholder="请输入店铺上传路径前缀" v-model="form.shopUploadPathPrefix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺图片上传路径后缀：" prop="shopImageUploadPathSuffix">
          <el-input placeholder="请输入店铺图片上传路径后缀" v-model="form.shopImageUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺Flash上传路径后缀：" prop="shopFlashUploadPathSuffix">
          <el-input placeholder="请输入店铺Flash上传路径后缀" v-model="form.shopFlashUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺媒体上传路径后缀：" prop="shopMediaUploadPathSuffix">
          <el-input placeholder="请输入店铺媒体上传路径后缀" v-model="form.shopMediaUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺文件上传路径后缀：" prop="shopFileUploadPathSuffix">
          <el-input placeholder="请输入店铺文件上传路径后缀" v-model="form.shopFileUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺升级文件上传路径后缀：" prop="shopUpgradeUploadPathSuffix">
          <el-input placeholder="请输入店铺升级文件上传路径后缀" v-model="form.shopUpgradeUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="店铺VR文件上传路径后缀：" prop="shopVrUploadPathSuffix">
          <el-input placeholder="请输入店铺VR文件上传路径后缀" v-model="form.shopVrUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="上传路径后缀：" prop="uploadPathSuffix">
          <el-input placeholder="请输入上传路径后缀" v-model="form.uploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="缺省店铺ID：" prop="defaultShopId">
          <el-input placeholder="请输入缺省店铺ID" v-model="form.defaultShopId" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="智能到店店铺图片上传路径后缀：" prop="uploadIntelligentaccessExtension">
          <el-input placeholder="请输入智能到店店铺图片上传路径后缀" v-model="form.uploadIntelligentaccessExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="智能到店上传路径：" prop="intelligentaccessUploadPath">
          <el-input placeholder="请输入智能到店上传路径" v-model="form.intelligentaccessUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传智能到店资源扩展名：" prop="shopIntelligentaccessUploadPathSuffix">
          <el-input placeholder="请输入允许上传智能到店资源扩展名" v-model="form.shopIntelligentaccessUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="人脸识别店铺图片上传路径后缀：" prop="uploadFaceRecognitionExtension">
          <el-input placeholder="请输入人脸识别店铺图片上传路径后缀" v-model="form.uploadFaceRecognitionExtension" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="人脸识别上传路径：" prop="faceRecognitionUploadPath">
          <el-input placeholder="请输入人脸识别上传路径" v-model="form.faceRecognitionUploadPath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="允许上传人脸识别资源扩展名：" prop="shopFaceRecognitionUploadPathSuffix">
          <el-input placeholder="请输入允许上传人脸识别资源扩展名" v-model="form.shopFaceRecognitionUploadPathSuffix" class="input-nomal-width"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import Service from '@/service/system-setting/system-setting-mgmt/systemSettingMgmt';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'RegistrationAndSecuritySetting',
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
        disabledUsername: '',
        usernameMinLength: '',
        usernameMaxLength: '',
        passwordMinLength: '',
        passwordMaxLength: '',
        registerAgreement: '',
        isEmailLogin: 'false',
        captchaTypes: [],
        accountLockCount: '',
        uploadMaxSize: '',
        uploadImageExtension: '',
        uploadFlashExtension: '',
        uploadMediaExtension: '',
        uploadFileExtension: '',
        uploadUpgradeExtension: '',
        imageUploadPath: '',
        flashUploadPath: '',
        mediaUploadPath: '',
        fileUploadPath: '',
        upgradeUploadPath: '',
        vrUploadPath: '',
        shopUploadPathPrefix: '',
        shopImageUploadPathSuffix: '',
        shopFlashUploadPathSuffix: '',
        shopMediaUploadPathSuffix: '',
        shopFileUploadPathSuffix: '',
        shopUpgradeUploadPathSuffix: '',
        shopVrUploadPathSuffix: '',
        uploadPathSuffix: '',
        defaultShopId: '',
        uploadIntelligentaccessExtension: '',
        intelligentaccessUploadPath: '',
        shopIntelligentaccessUploadPathSuffix: '',
        uploadFaceRecognitionExtension: '',
        faceRecognitionUploadPath: '',
        shopFaceRecognitionUploadPathSuffix: ''
      },
      rules: {
        usernameMinLength: [{ required: true, message: '请输入用户名最小长度', trigger: 'focus' }],
        usernameMaxLength: [{ required: true, message: '请输入用户名最大长度', trigger: 'focus' }],
        passwordMinLength: [{ required: true, message: '请输入密码最小长度', trigger: 'focus' }],
        passwordMaxLength: [{ required: true, message: '请输入密码最大长度', trigger: 'focus' }],
        registerAgreement: [{ required: true, message: '请输入注册协议', trigger: 'focus' }],
        accountLockCount: [
          {
            required: true,
            message: '请输入连续登录失败最大次数',
            trigger: 'focus'
          }
        ],
        uploadMaxSize: [
          {
            required: true,
            message: '请输入上传文件最大限制',
            trigger: 'focus'
          }
        ],
        imageUploadPath: [
          {
            required: true,
            message: '请输入图片上传路径',
            trigger: 'focus'
          }
        ],
        flashUploadPath: [
          {
            required: true,
            message: '请输入Flash上传路径',
            trigger: 'focus'
          }
        ],
        mediaUploadPath: [
          {
            required: true,
            message: '请输入媒体上传路径',
            trigger: 'focus'
          }
        ],
        fileUploadPath: [
          {
            required: true,
            message: '请输入文件上传路径',
            trigger: 'focus'
          }
        ],
        upgradeUploadPath: [
          {
            required: true,
            message: '请输入升级文件上传路径',
            trigger: 'focus'
          }
        ],
        vrUploadPath: [
          {
            required: true,
            message: '请输入VR文件上传路径',
            trigger: 'focus'
          }
        ],
        shopUploadPathPrefix: [
          {
            required: true,
            message: '请输入店铺上传路径前缀',
            trigger: 'focus'
          }
        ],
        shopImageUploadPathSuffix: [
          {
            required: true,
            message: '请输入店铺图片上传路径后缀',
            trigger: 'focus'
          }
        ],
        shopFlashUploadPathSuffix: [
          {
            required: true,
            message: '请输入店铺Flash上传路径后缀',
            trigger: 'focus'
          }
        ],
        shopMediaUploadPathSuffix: [
          {
            required: true,
            message: '请输入店铺媒体上传路径后缀',
            trigger: 'focus'
          }
        ],
        shopFileUploadPathSuffix: [
          {
            required: true,
            message: '请输入店铺文件上传路径后缀',
            trigger: 'focus'
          }
        ],
        shopUpgradeUploadPathSuffix: [
          {
            required: true,
            message: '请输入店铺升级文件上传路径后缀',
            trigger: 'focus'
          }
        ],
        shopVrUploadPathSuffix: [
          {
            required: true,
            message: '请输入店铺VR文件上传路径后缀',
            trigger: 'focus'
          }
        ],
        uploadPathSuffix: [{ required: true, message: '请输入上传路径后缀', trigger: 'focus' }],
        defaultShopId: [{ required: true, message: '请输入缺省店铺ID', trigger: 'focus' }],
        uploadIntelligentaccessExtension: [{ required: true, message: '请输入智能到店店铺图片上传路径后缀', trigger: 'focus' }],
        intelligentaccessUploadPath: [{ required: true, message: '请输入智能到店上传路径', trigger: 'focus' }],
        shopIntelligentaccessUploadPathSuffix: [
          { required: true, message: '请输入允许上传智能到店资源扩展名', trigger: 'focus' }
        ],
        uploadFaceRecognitionExtension: [{ required: true, message: '请输入人脸识别店铺图片上传路径后缀', trigger: 'focus' }],
        faceRecognitionUploadPath: [{ required: true, message: '请输入人脸识别上传路径', trigger: 'focus' }],
        shopFaceRecognitionUploadPathSuffix: [{ required: true, message: '请输入允许上传人脸识别资源扩展名', trigger: 'focus' }]
      },
      captchaTypes4Selection: []
    };
  },
  components: {
    BizHeader,
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
        name: 'registrationAndSecurity'
      };
      Service.query(
        params,
        data => {
          this.form.disabledUsername = data.settingList !== undefined ? data.settingList.disabledUsername : '';
          this.form.usernameMinLength = data.settingList !== undefined ? data.settingList.usernameMinLength : '';
          this.form.usernameMaxLength = data.settingList !== undefined ? data.settingList.usernameMaxLength : '';
          this.form.passwordMinLength = data.settingList !== undefined ? data.settingList.passwordMinLength : '';
          this.form.passwordMaxLength = data.settingList !== undefined ? data.settingList.passwordMaxLength : '';
          this.form.registerAgreement = data.settingList !== undefined ? data.settingList.registerAgreement : '';
          this.form.isEmailLogin = data.settingList !== undefined ? data.settingList.isEmailLogin : '';
          this.form.captchaTypes =
            data.settingList !== undefined ? this.convertCommaStr2Array(data.settingList.captchaTypes) : [];
          this.form.accountLockCount = data.settingList !== undefined ? data.settingList.accountLockCount : '';
          this.form.uploadMaxSize = data.settingList !== undefined ? data.settingList.uploadMaxSize : '';
          this.form.uploadImageExtension = data.settingList !== undefined ? data.settingList.uploadImageExtension : '';
          this.form.uploadFlashExtension = data.settingList !== undefined ? data.settingList.uploadFlashExtension : '';
          this.form.uploadMediaExtension = data.settingList !== undefined ? data.settingList.uploadMediaExtension : '';
          this.form.uploadFileExtension = data.settingList !== undefined ? data.settingList.uploadFileExtension : '';
          this.form.uploadUpgradeExtension = data.settingList !== undefined ? data.settingList.uploadUpgradeExtension : '';
          this.form.imageUploadPath = data.settingList !== undefined ? data.settingList.imageUploadPath : '';
          this.form.flashUploadPath = data.settingList !== undefined ? data.settingList.flashUploadPath : '';
          this.form.mediaUploadPath = data.settingList !== undefined ? data.settingList.mediaUploadPath : '';
          this.form.fileUploadPath = data.settingList !== undefined ? data.settingList.fileUploadPath : '';
          this.form.upgradeUploadPath = data.settingList !== undefined ? data.settingList.upgradeUploadPath : '';
          this.form.vrUploadPath = data.settingList !== undefined ? data.settingList.vrUploadPath : '';
          this.form.shopUploadPathPrefix = data.settingList !== undefined ? data.settingList.shopUploadPathPrefix : '';
          this.form.shopImageUploadPathSuffix = data.settingList !== undefined ? data.settingList.shopImageUploadPathSuffix : '';
          this.form.shopFlashUploadPathSuffix = data.settingList !== undefined ? data.settingList.shopFlashUploadPathSuffix : '';
          this.form.shopMediaUploadPathSuffix = data.settingList !== undefined ? data.settingList.shopMediaUploadPathSuffix : '';
          this.form.shopFileUploadPathSuffix = data.settingList !== undefined ? data.settingList.shopFileUploadPathSuffix : '';
          this.form.shopUpgradeUploadPathSuffix =
            data.settingList !== undefined ? data.settingList.shopUpgradeUploadPathSuffix : '';
          this.form.shopVrUploadPathSuffix = data.settingList !== undefined ? data.settingList.shopVrUploadPathSuffix : '';
          this.form.uploadPathSuffix = data.settingList !== undefined ? data.settingList.uploadPathSuffix : '';
          this.form.defaultShopId = data.settingList !== undefined ? data.settingList.defaultShopId : '';
          this.form.uploadIntelligentaccessExtension =
            data.settingList !== undefined ? data.settingList.uploadIntelligentaccessExtension : '';
          this.form.intelligentaccessUploadPath =
            data.settingList !== undefined ? data.settingList.intelligentaccessUploadPath : '';
          this.form.shopIntelligentaccessUploadPathSuffix =
            data.settingList !== undefined ? data.settingList.shopIntelligentaccessUploadPathSuffix : '';
          this.form.uploadFaceRecognitionExtension =
            data.settingList !== undefined ? data.settingList.uploadFaceRecognitionExtension : '';
          this.form.faceRecognitionUploadPath = data.settingList !== undefined ? data.settingList.faceRecognitionUploadPath : '';
          this.form.shopFaceRecognitionUploadPathSuffix =
            data.settingList !== undefined ? data.settingList.shopFaceRecognitionUploadPathSuffix : '';

          this.captchaTypes4Selection = data.captchaTypes;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        disabledUsername: this.form.disabledUsername,
        usernameMinLength: this.form.usernameMinLength,
        usernameMaxLength: this.form.usernameMaxLength,
        passwordMinLength: this.form.passwordMinLength,
        passwordMaxLength: this.form.passwordMaxLength,
        registerAgreement: this.form.registerAgreement,
        isEmailLogin: this.form.isEmailLogin,
        captchaTypes: this.convertArray2CommaStr(this.form.captchaTypes),
        accountLockCount: this.form.accountLockCount,
        uploadMaxSize: this.form.uploadMaxSize,
        uploadImageExtension: this.form.uploadImageExtension,
        uploadFlashExtension: this.form.uploadFlashExtension,
        uploadMediaExtension: this.form.uploadMediaExtension,
        uploadFileExtension: this.form.uploadFileExtension,
        uploadUpgradeExtension: this.form.uploadUpgradeExtension,
        imageUploadPath: this.form.imageUploadPath,
        flashUploadPath: this.form.flashUploadPath,
        mediaUploadPath: this.form.mediaUploadPath,
        fileUploadPath: this.form.fileUploadPath,
        upgradeUploadPath: this.form.upgradeUploadPath,
        vrUploadPath: this.form.vrUploadPath,
        shopUploadPathPrefix: this.form.shopUploadPathPrefix,
        shopImageUploadPathSuffix: this.form.shopImageUploadPathSuffix,
        shopFlashUploadPathSuffix: this.form.shopFlashUploadPathSuffix,
        shopMediaUploadPathSuffix: this.form.shopMediaUploadPathSuffix,
        shopFileUploadPathSuffix: this.form.shopFileUploadPathSuffix,
        shopUpgradeUploadPathSuffix: this.form.shopUpgradeUploadPathSuffix,
        shopVrUploadPathSuffix: this.form.shopVrUploadPathSuffix,
        uploadPathSuffix: this.form.uploadPathSuffix,
        defaultShopId: this.form.defaultShopId,
        uploadIntelligentaccessExtension: this.form.uploadIntelligentaccessExtension,
        intelligentaccessUploadPath: this.form.intelligentaccessUploadPath,
        shopIntelligentaccessUploadPathSuffix: this.form.shopIntelligentaccessUploadPathSuffix,
        uploadFaceRecognitionExtension: this.form.uploadFaceRecognitionExtension,
        faceRecognitionUploadPath: this.form.faceRecognitionUploadPath,
        shopFaceRecognitionUploadPathSuffix: this.form.shopFaceRecognitionUploadPathSuffix
      };
      console.log('params', params);
      Service.update(
        params,
        data => {
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
        },
        ErrorData => {
          this.$message({
            title: '警告',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    },
    clearFormData() {
      this.form.disabledUsername = '';
      this.form.usernameMinLength = '';
      this.form.usernameMaxLength = '';
      this.form.passwordMinLength = '';
      this.form.passwordMaxLength = '';
      this.form.registerAgreement = '';
      this.form.isEmailLogin = 'false';
      this.form.captchaTypes = [];
      this.form.accountLockCount = '';
      this.form.uploadMaxSize = '';
      this.form.uploadImageExtension = '';
      this.form.uploadFlashExtension = '';
      this.form.uploadMediaExtension = '';
      this.form.uploadFileExtension = '';
      this.form.uploadUpgradeExtension = '';
      this.form.imageUploadPath = '';
      this.form.flashUploadPath = '';
      this.form.mediaUploadPath = '';
      this.form.fileUploadPath = '';
      this.form.upgradeUploadPath = '';
      this.form.vrUploadPath = '';
      this.form.shopUploadPathPrefix = '';
      this.form.shopImageUploadPathSuffix = '';
      this.form.shopFlashUploadPathSuffix = '';
      this.form.shopMediaUploadPathSuffix = '';
      this.form.shopFileUploadPathSuffix = '';
      this.form.shopUpgradeUploadPathSuffix = '';
      this.form.shopVrUploadPathSuffix = '';
      this.form.uploadPathSuffix = '';
      this.form.defaultShopId = '';
      this.form.uploadIntelligentaccessExtension = '';
      this.form.intelligentaccessUploadPath = '';
      this.form.shopIntelligentaccessUploadPathSuffix = '';
      this.form.uploadFaceRecognitionExtension = '';
      this.form.faceRecognitionUploadPath = '';
      this.form.shopFaceRecognitionUploadPathSuffix = '';
    },
    convertCommaStr2Array(commaStr) {
      let arr = [];
      if (commaStr === undefined || commaStr === '') {
        return arr;
      }
      arr = commaStr.split(','); // "1,2,3", 在每个逗号(,)处进行分解 ["1", "2", "3"]
      return arr;
    },
    convertArray2CommaStr(selectedArray) {
      let commaStr = '';
      if (selectedArray === undefined) {
        return commaStr;
      }
      commaStr = selectedArray.join(','); // ["0", "1", "2", "3"]，用(,)隔开"0,1,2,3,4"
      return commaStr;
    }
  }
};
</script>

<style lang="scss">
.registration-and-security-setting {
  .header-button {
    margin-top: 5px;
    margin-left: 15px;
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
    margin-left: 10px;
  }
  .el-form-item__label {
    width: 250px;
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
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-col {
    width: 200px;
  }
  .checkbox-group {
    font-size: 14px;
    // width: 600px;
  }
  .el-checkbox-group .el-checkbox {
    width: 120px;
    margin: 0;
    .checkbox-group-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
