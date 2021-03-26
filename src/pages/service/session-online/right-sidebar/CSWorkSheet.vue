<template>
  <biz-grid class="cs-work-sheet">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="会员" prop="member">
        <el-input placeholder="请选择会员" v-model="member.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input placeholder="请输入联系电话" disabled v-model="member.mobile"></el-input>
      </el-form-item>
      <el-form-item label="发起人" prop="sponsor">
        <el-select placeholder="请选择发起人" :value="getUser.id" :disabled="true">
          <el-option v-for="handler in currentUserList" :key="handler.id" :label="handler.name" :value="handler.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单优先级" prop="level">
        <el-radio v-model="form.level" label="0">低</el-radio>
        <el-radio v-model="form.level" label="1">中</el-radio>
        <el-radio v-model="form.level" label="2">高</el-radio>
      </el-form-item>
      <el-form-item label="工单类型" prop="type">
        <el-select placeholder="请选择工单类型" v-model="form.type" :disabled="form.state === 2">
          <el-option label="售前" value="0"></el-option>
          <el-option label="售后" value="1"></el-option>
          <el-option label="问题反馈" value="2"></el-option>
          <el-option label="投诉" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单内容" prop="content" class="work-sheet-content">
        <el-input type="textarea" placeholder="请输入工单内容" v-model="form.content"></el-input>
        <!-- 多图片上传 -->
        <img-uploader v-model="imgList"></img-uploader>
      </el-form-item>
      <el-form-item label="工单状态" prop="state">
        <el-select placeholder="请选择工单状态" v-model="form.state">
          <el-option label="待处理" :disabled="form.state > 0" value="0"></el-option>
          <el-option label="受理中" :disabled="form.state > 1" value="1"></el-option>
          <el-option label="已完成" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转交受理" class="handle-type">
        <div>
          <el-radio v-model="form.handleType" label="0" v-if="id === '' || form.handleType === '0'">
            受理人
          </el-radio>
          <el-radio v-model="form.handleType" label="1" v-if="id === '' || form.handleType === '1'">
            受理组
          </el-radio>
        </div>
        <el-select v-show="form.handleType === '0'" placeholder="请选择受理人" v-model="form.handler.id" :disabled="form.state === 2">
          <el-option v-for="handler in handlerList" :key="handler.index" :label="handler.name" :value="handler.id"></el-option>
        </el-select>
        <el-select v-show="form.handleType === '1'" placeholder="请选择受理组" v-model="form.handleGroup.id" :disabled="form.state === 2">
          <el-option v-for="handleGroup in handleGroupList" :key="handleGroup.index" :label="handleGroup.name" :value="handleGroup.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="handleContent">
        <el-input type="textarea" placeholder="请输入转交备注" autosize v-model="form.handleContent" :disabled="form.state === 2"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import service from '@/service/customer-service/workSheetMgmt.js';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'cs-work-sheet',
  components: {
    BizGrid,
    BizSaveButton,
    ImgUploader
  },
  props: {},
  data() {
    return {
      member: {},
      // 图片列表
      imgList: [],
      id: '',
      // 查询会员列表接口
      url: '/admin/member/json/list.jhtml',
      // 已选会员ID
      selectedMemberId: [],
      // 受理人下拉菜单
      handlerList: [],
      // 受理组下拉菜单
      handleGroupList: [],
      showDialog: false,
      isCS: true,
      rules: {
        sponsor: [{ required: true, message: '请选择发起人', trigger: 'blur' }],
        level: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
        type: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        content: [{ required: true, message: '请填写工单内容', trigger: 'blur' }],
        state: [{ required: true, message: '请选择工单状态', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      form: this.resetForm(),
      filters: [
        {
          type: 'input',
          placeholder: '请输入会员姓名或手机号',
          name: 'searchbar',
          value: ''
        }
      ],
      tableData: [],
      pagination: this.resetPagination()
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('SessionOnline', ['activatedRoom']),
    // 当前用户的客服id
    currentCSId() {
      for (const role of this.getUser.roleDatas) {
        if (role.type === '4') {
          return role.refId;
        }
      }
      return '';
    },
    currentUserList() {
      return [
        {
          id: this.getUser.id,
          name: this.getUser.name
        }
      ];
    }
  },
  watch: {
    activatedRoom() {
      this.getUserInfo();
    }
  },
  created() {
    this.getUserInfo();
    this.querySponsorList();
    this.querySponsorGroupList();
  },
  methods: {
    getUserInfo() {
      let params = {
        id: this.activatedRoom.id
      };
      http.get(urls.customerService.Client, params).then(data => {
        this.member = data.memberData;
      });
    },
    resetForm() {
      return {
        number: '',
        createDate: '',
        member: this.member,
        mobile: '',
        sponsor: {
          id: ''
        },
        level: '0',
        type: '0',
        content: '',
        images: [],
        state: '0',
        handleType: '0',
        handler: {
          id: ''
        },
        handleGroup: {
          id: ''
        },
        handleContent: ''
      };
    },
    // 会员列表Start
    updateVisibility() {
      this.showDialog = false;
    },
    resetPagination() {
      return {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      };
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryMemberList();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryMemberList();
    },
    filterDataChange(val) {
      this.filters = val;
      this.queryMemberList();
    },
    // 会员列表End
    operate(name) {
      this[name]();
    },
    // 点击'保存'按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    // 提交
    submit() {
      if (!this.id) {
        this.create();
      } else {
        this.update();
      }
    },
    // 创建
    create() {
      this.form.id = this.member.id;
      this.form.nickname = this.member.nickname;
      let params = {
        level: this.form.level,
        type: this.form.type,
        state: this.form.state,
        member: {
          id: this.member.id,
          mobile: this.member.mobile
        },
        sponsor: {
          id: this.currentCSId
        },
        handler: {
          id: this.form.handler.id
        },
        handleGroup: {
          id: this.form.handleGroup.id
        },
        images: this.formatFormImg(this.imgList),
        handleType: this.form.handleType,
        content: this.form.content,
        handleContent: this.form.handleContent
      };
      this.loading = true;
      service.createBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('created');
          this.clear();
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_CREATE: ', ErrorData);
        }
      );
    },
    // 重置表单
    clear() {
      this.form = this.resetForm();
    },
    formatImgList(list) {
      let tmp = list.map(img => {
        return { image: img };
      });
      return { images: tmp };
    },
    formatFormImg(images) {
      let tmp = images.map(img => {
        return { image: img };
      });
      return tmp;
    },
    // 获取受理人列表
    querySponsorList() {
      let params = {
        pageSize: 200,
        storeId: this.getUser.shop.id,
        hierarchyId: '1'
      };
      service.querySponsorList(
        params,
        data => {
          this.handlerList = data.content;
        },
        ErrorData => { }
      );
    },
    // 获取受理组列表
    querySponsorGroupList() {
      let params = {
        pageSize: 200
      };
      service.querySponsorGroupList(
        params,
        data => {
          this.handleGroupList = data.content;
        },
        ErrorData => { }
      );
    }
  }
};
</script>

<style lang="scss">
.cs-work-sheet {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin-bottom: 8px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}
</style>
