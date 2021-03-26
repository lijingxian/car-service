<template>
  <biz-grid class="motor-club-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="130px" :model="formModel" :rules="rules" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formModel.name" maxlength="20" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="head" :value="formModel.head">
        <biz-avatar-uploader-new v-model="formModel.head"  @uploadSuccess="uploadSuccess">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="formModel.remark" type="textarea" maxlength="100" placeholder="请输入简介"></el-input>
      </el-form-item>
      <el-form-item label="所在地" prop="lngBaidu" :value="formModel.lngBaidu">
        <biz-area-select :areaId="formModel.area.id" @areaChanged="handleAreaChanged"></biz-area-select>
      </el-form-item>
      <el-form-item label="车友会成员" prop="memberIds" :value="formModel.memberIds">
        <el-input :value="textComputed" readonly>
          <el-button slot="append" @click="handleMemberClick">选择</el-button>
        </el-input>

        <motor-club-people-picker v-show="false" ref="memberPicker" @on-confirm="handleConfirm"></motor-club-people-picker>
      </el-form-item>
      <el-form-item label="所属店铺" prop="shop">
        <el-select v-model="formModel.shop.id" placeholder="请选择" style="width: 100%;" disabled>
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理员">
        <span>{{formModel.owner ? formModel.owner.name : ''}}</span>
      </el-form-item>
      <el-form-item label="电话">
        <span>{{formModel.owner ? formModel.owner.mobile : ''}}</span>
      </el-form-item>
      <!-- <el-form-item label="群二维码">
        <div>
          <img :src="formModel.qrCode" v-show="formModel.id" style="width: 210px; position: relative;" />
        </div>
        <span style="color: #999;" v-show="!formModel.id">建立车友会后系统生成车友会唯一二维码标识</span>
      </el-form-item> -->
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import MotorClubPeoplePicker from '../Component/MotorClubPeoplePicker';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import BizAreaSelect from '@/components/BizAreaSelect';

import { mapGetters } from 'vuex';

import { motorClubMgmt as service } from '@/common/urls';
import http from '@/common/http';
import urlUtil from '@/utils/url';
import { VueCropper } from '@/components/BizForm';
export default {
  name: 'MotorClubBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew,
    BizAreaSelect,
    MotorClubPeoplePicker,
    VueCropper
  },
  data() {
    return {
      openV: false,
      picUrl: '',
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:fleet.edit']
        }
      ],
      rules: {
        shop: [
          {
            required: true,
            validator: (rule, rules, callback) => {
              if (this.formModel.shop.id) {
                callback();
              } else {
                callback(new Error('请选择所属店铺'));
              }
            }
          }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      shopList: [],
      formModel: this.getDefaultModel()
    };
  },
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
  created() {
    if (this.itemId.id) this.query();
    this.queryShopList();
  },
  methods: {
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.openV = true;
    },
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.formModel.head = url;
    },
    ...mapGetters(['getUser']),

    initModel(model) {
      if (model) {
        if (model.area && !model.area.id) delete model.area;
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    },
    getQueryParams() {
      return {
        id: this.itemId.id,
        fleetType: 'circle',
        shopId: window.top.SHOP_ID || ''
      };
    },
    query() {
      this.loading = true;

      http
        .get(service.baseInfo.query, this.getQueryParams())
        .then(data => {
          this.$emit('hasMemberIds', data.content.memberIds);
          this.initModel(data.content);

          return data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);

          return errData;
        })
        .finally(data => {
          this.loading = false;

          return data;
        });
    },
    queryShopList() {
      // type: '8' => club
      http
        .get(service.baseInfo.queryShopList, Object.assign({}, this.getQueryParams(), { sourceType: '8' }))
        .then(data => {
          this.shopList = data.shops;

          return data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);

          return errData;
        });
    },
    getSaveParams() {
      return {
        token: '',

        id: this.formModel.id,
        areaId: this.formModel.area.id,
        type: '0',
        name: this.formModel.name,
        remark: this.formModel.remark,
        fleetType: 'circle',
        memberIds: this.formModel.memberIds,
        head: this.formModel.head,
        shopId: this.formModel.shop.id
      };
    },
    resetModel() {
      let obj = this.getDefaultModel();
      // obj.shop.id = this.shopList[0] && this.shopList[0].id ? this.shopList[0].id : '';
      this.formModel = obj;
    },
    getDefaultModel() {
      let user = this.getUser();
      return {
        head: '',
        memberIds: [],
        // 创建时默认为当前店铺 => 平台运营选中的店铺 => 空
        shop: { id: user.shop.id || window.top.SHOP_ID || '' },
        area: { id: '1568' }, // 默认北京,
        owner: {
          name: user.realName,
          mobile: user.mobile
        }
      };
    },

    operateHandler(name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },
    handleMemberClick(e) {
      this.$refs.memberPicker.selectionKeys = this.formModel.memberIds;
      this.$refs.memberPicker.showDialog = true;
    },
    handleConfirm(keys) {
      this.$set(this.formModel, 'memberIds', keys);
    },

    save() {
      console.log(this);
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = urlUtil.toURLParams(this.getSaveParams());
          http
            .post(service.baseInfo.save + params)
            .then(data => {
              this.$message.success('保存成功');

              this.$emit('operationSuccess');
              // 刷新左侧菜单树
              window.top.postMessage({ method: 'setFleetTree' }, window.top.location.origin);
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(data => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
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
    textComputed() {
      return '已选择 ' + (this.formModel.memberIds ? this.formModel.memberIds.length : '0') + ' 人';
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.resetFields();
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  }
};
</script>

<style lang="scss">
.motor-club-mgmt__base-info {
  padding-top: 20px;
  .biz-save-button {
    float: left;
  }
  .biz-scroller {
    fieldset {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-bottom: 20px;
      padding-bottom: 20px;

      legend {
        font-size: 14px;
        color: #999;
      }

      .el-form-item--small.el-form-item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
