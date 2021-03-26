<template>
  <biz-grid class="rights-base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-collapse v-model="activeTab">
      <el-collapse-item title="基本信息" name="baseInfo">
        <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
          <el-form-item label="权益分类" prop="categoryId">
            <el-select v-model="formModel.categoryId" placeholder="请选择权益分类">
              <el-option v-for="item in classifies" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益名称" prop="name">
            <el-input v-model="formModel.name" placeholder="请输入权益名称"></el-input>
          </el-form-item>
          <el-form-item label="有效期" prop="inDateType">
            <el-select v-model="formModel.inDateType" @change="clear">
              <el-option label="请选择" value></el-option>
              <el-option label="不限" value="unlimited"></el-option>
              <el-option label="一个月" value="one_month"></el-option>
              <el-option label="三个月" value="three_months"></el-option>
              <el-option label="六个月" value="six_months"></el-option>
              <el-option label="一年" value="one_year"></el-option>
              <el-option label="两年" value="two_years"></el-option>
              <el-option label="自定义" value="user_define"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="截止时间" v-if="formModel.inDateType==='user_define'" prop="limitDate">
            <el-date-picker v-model="formModel.limitDate" placeholder="请选择" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="权益图标" prop="logo">
            <BizAvatarUploaderNew v-model="formModel.logo" @uploadSuccess="uploadSuccess"></BizAvatarUploaderNew>
          </el-form-item>
          <el-form-item label="权益说明" prop="description">
            <el-input v-model="formModel.description" type="textarea" placeholder="请输入权益说明"></el-input>
          </el-form-item>
          <el-form-item label="使用说明" prop="memo">
            <el-input v-model="formModel.memo" type="textarea" placeholder="请输入使用说明"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="权益券" name="Rights">
        <div class="rights-btns">
          <el-button size="small" type="primary" @click="chooseRight">选择</el-button>
          <el-button size="small" type="primary" @click="createRight">新建</el-button>
        </div>
        <div class="rights">
          <coupon-item v-for="right of rights" :item="right" :key="right.id" @check-change="checkChange(right,arguments[0])" @deleteRight="deleteRight"></coupon-item>
        </div>
      </el-collapse-item>
    </el-collapse>
    <selected-rights-dialog :visibility.sync="showDialog" :selectionKeys="selectionKeys" @confirmed="confirmed" title="卡券选择"></selected-rights-dialog>
    <right-dialog :visibility.sync="rightDialog" :mode="'coupon'" @update="createdRight" title="卡券创建"></right-dialog>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import ticket from '@/assets/images/pic_ticket_bg_y.png';
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import SelectedRightsDialog from './components/SelectedRightsDialog';
import RightDialog from './components/RightDialog';
import { couponMgmt, memberRightsMgmt } from '@/common/urls';
import http from '@/common/http';
import CouponItem from './components/CouponItemInfo';
import { VueCropper } from '@/components/BizForm';
export default {
  name: 'RightsBaseInfo',
  props: {
    classId: {
      type: String
    },
    rightsId: {
      type: String
    }
  },
  components: {
    RightDialog,
    CouponItem,
    SelectedRightsDialog,
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew,
    VueCropper
  },
  data() {
    return {
      openV: false,
      picUrl: '',
      rightDialog: false,
      ticket: ticket,
      activeTab: ['baseInfo', 'Rights'],
      // selectionKeys: [],
      showDialog: false,
      loading: false,
      formLoading: false,
      classifies: [],
      // 用户信息
      formModel: {
        categoryId: '',
        name: '',
        inDateType: '',
        countLimit: '',
        logo: '/resources/admin/images/icon_vip.png',
        description: '',
        memo: '',
        rightsCouponList: []
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:member.memberBenefits.benefits.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入权益名称', trigger: 'blur' }],
        inDateType: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
        limitDate: [{ required: true, message: '请输入截止日期', trigger: 'blur' }]
      },
      rights: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    selectionKeys() {
      return this.rights.map(right => right.id);
    }
  },
  watch: {
    rightsId(nVal, oVal) {
      this.$refs.form.resetFields();
      this.rightsId && this.query();
      if (!this.rightsId) {
        this.formModel = { grade: '1', categoryId: this.classId, logo: '/resources/admin/images/icon_vip.png', rightsCouponList: [] };
        this.rights = [];
      }
    },
    classId(nVal, oVal) {
      this.init();
      if (!this.rightsId) {
        this.formModel = { grade: '1', categoryId: this.classId, logo: '/resources/admin/images/icon_vip.png', rightsCouponList: [] };
      }
    }
  },
  mounted() {},
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
      this.formModel.logo = url;
    },
    createdRight(id) {
      this.formModel.rightsCouponList.push({ id });
      this.getRights();
    },
    createRight() {
      this.rightDialog = true;
    },
    chooseRight() {
      this.showDialog = true;
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    operate(name) {
      this[name]();
    },
    clear() {
      this.$refs.form.clearValidate(['inDateType']);
    },
    query() {
      if (!this.rightsId) {
        return;
      }
      this.loading = true;
      let params = {
        id: this.rightsId,
        grade: '1',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(memberRightsMgmt.baseInfo, params)
        .then(data => {
          this.formModel = data.content;
          if (!this.formModel.logo) {
            this.formModel.logo = '/resources/admin/images/icon_vip.png';
          }
          this.getRights();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.rightsId) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    create() {
      this.loading = true;
      http
        .post(memberRightsMgmt.baseInfo, this.formModel)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('createRights', data.id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      this.loading = true;
      http
        .put(memberRightsMgmt.baseInfo, this.formModel)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('createRights', data.id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    init() {
      this.loading = true;
      http
        .get(memberRightsMgmt.types, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          this.classifies = data.content;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getRights() {
      this.rights = [];
      let promises = [];
      for (const iterator of this.formModel.rightsCouponList) {
        let params = {
          id: iterator.id
        };
        promises.push(http.get(couponMgmt.baseInfo, params));
      }
      Promise.all(promises).then(data => {
        for (const iterator of data) {
          iterator.data.checked = false;
          this.rights.push(iterator.data);
        }
      });
    },
    confirmed(SelectionKeys) {
      this.formModel.rightsCouponList = [];
      for (const iterator of SelectionKeys) {
        this.formModel.rightsCouponList.push({
          id: iterator
        });
      }
      this.getRights();
    },
    checkChange(item, value) {
      this.rights.find(right => {
        return right.id === item.id;
      }).checked = value;
    },
    deleteRight(item) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let index = this.formModel.rightsCouponList.findIndex(right => right.id === item.id);
          this.formModel.rightsCouponList.splice(index, 1);
          this.rights.splice(index, 1);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.rights-base-info {
  padding: 20px;
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .biz-save-button {
    float: left;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .rights {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    .coupon-item {
      height: 82px;
      width: 350px;
      background-color: #f7f6f6;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      margin-bottom: 10px;
      .coupon {
        display: flex;
        background: #fff;
        img {
          position: relative;
        }
        .after {
          background: #fff;
          height: 80px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          .validity {
            color: #888888;
            font-size: 12px;
            margin-left: 10px;
          }
          span {
            font-size: 15px;
            margin-left: 20px;
            line-height: 40px;
          }
        }
        .before {
          background: #ffac30;
          width: 130px;
          height: 80px;
          .amount {
            font-size: 22px;
          }
          span {
            display: block;
            text-align: center;
            line-height: 40px;
            color: #fff;
            font-size: 14px;
          }
        }
      }
      .content {
        height: 250px;
        font-size: 13px;
        color: #101010;
        padding: 5px 5px 0 5px;
      }
      .bottom {
        padding: 5px 0;
        display: flex;
        justify-content: center;
        background-color: #fff;
      }
    }
  }

  .rights-btns {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
