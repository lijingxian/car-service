<template>
  <biz-grid class="work-sheet-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="会员" prop="member" v-if="form.type !== '3'">
        <el-input placeholder="请选择会员" v-model="form.member.nickname" @focus="handleSelect" :disabled="itemId.id !== ''">
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile" v-if="form.type !== '3'">
        <el-input placeholder="请输入联系电话" disabled v-model="form.member.mobile"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" v-if="form.type === '3'">
        <el-input placeholder="请选择姓名" v-model="form.member.name" @focus="handleSelect" :disabled="itemId.id !== ''"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName" v-if="form.type === '3'">
        <el-input placeholder="请输入用户名" v-model="form.member.userName" :disabled="itemId.id !== ''"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile" v-if="form.type === '3'">
        <el-input placeholder="请输入联系电话" disabled v-model="form.member.mobile"></el-input>
      </el-form-item>
      <!-- <el-form-item label="发起人" prop="sponsor" v-if="form.type !== '3'">
        <el-select placeholder="请选择发起人" v-model="form.sponsor.id" :disabled="form.state === 2">
          <el-option v-for="handler in handlerList" :key="handler.index" :label="handler.nickname" :value="handler.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="工单优先级" prop="level">
        <el-radio v-model="form.level" label="0">低</el-radio>
        <el-radio v-model="form.level" label="1">中</el-radio>
        <el-radio v-model="form.level" label="2">高</el-radio>
      </el-form-item>
      <el-form-item label="工单类型" prop="type">
        <el-select placeholder="请选择工单类型" v-model="form.type" :disabled="form.state === 2">
          <el-option label="售前" value="0" v-if="getUser().roleLevel==='shop'"></el-option>
          <el-option label="售后" value="1" v-if="getUser().roleLevel==='shop'"></el-option>
          <el-option label="问题反馈" value="2" v-if="getUser().roleLevel==='shop'"></el-option>
          <el-option label="投诉" value="3" v-if="getUser().roleLevel==='shop'"></el-option>
          <el-option label="拉黑" value="4" v-if="getUser().roleLevel==='shop'"></el-option>
          <el-option label="功能建议" value="5" v-if="getUser().roleLevel!=='shop'"></el-option>
          <el-option label="体验问题" value="6" v-if="getUser().roleLevel!=='shop'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单内容" prop="content" class="work-sheet-content">
        <el-input type="textarea" placeholder="请输入工单内容" v-model="form.content" :maxlength="100"></el-input>
        <!-- 多图片上传 -->
        <img-uploader v-model="imgList"></img-uploader>
        <span style="color:#666666;font-size:12px;">当前仅支持.jpeg .jpg .png格式，大小10M以内</span>
      </el-form-item>
      <el-form-item label="工单状态" prop="state">
        <el-select placeholder="请选择工单状态" v-model="form.state">
          <el-option label="待受理" :disabled="disabled1" value="0"></el-option>
          <el-option label="受理中" :disabled="disabled2" value="1"></el-option>
          <el-option label="已完成" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转交受理" class="handle-type">
        <!-- <div>
          <el-radio v-model="form.handleType" label="0">
            受理人
          </el-radio>
          <el-radio v-model="form.handleType" label="1">
            受理组
          </el-radio>
        </div> -->
        <el-select placeholder="请选择受理组" v-model="form.handleGroup.id" :disabled="form.state === 2" @change="onGroupChange">
          <el-option v-for="handleGroup in handleGroupList" :key="handleGroup.index" :label="handleGroup.name"
            :value="handleGroup.id"></el-option>
        </el-select>
        <el-select placeholder="请选择受理人" v-model="form.handlerAdmin.id" :disabled="form.state === 2" @change="onChange">
          <el-option v-for="handler in handlerList" :key="handler.index" :label="handler.name" :value="handler.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="handleContent">
        <el-input type="textarea" placeholder="请输入转交备注" autosize v-model="form.handleContent" :disabled="form.state === 2">
        </el-input>
      </el-form-item>
      <el-collapse v-model="activeNames" v-if="itemId.id !== ''">
        <el-collapse-item title="工单" name="1">
          <el-form-item label="工单号" prop="number" v-if="itemId.id !== ''">
            <el-input v-model="form.number" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createDate" v-if="itemId.id !== ''">
            <el-input v-model="form.createDate" :disabled="true"></el-input>
          </el-form-item>
          <!-- [23539] 发起人由原来的客服人员改为当前操作用户 -->
          <el-form-item label="发起人" prop="initiator" v-if="form.initiator">
            <el-input  disabled v-model="form.initiator.name"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <biz-dialog-selector class="work-sheet-select-member" title="选择会员" selectionMode="single" :isClear="false"
      :visibility="showDialog" @update:visibility="updateVisibility" :tableData="tableData" :pagination="pagination"
      :filters="filters" :selectionKeys="selectedMemberId" @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange"
      @confirmed="confirmSelected" @filterDataChange="filterDataChange">
      <el-table-column prop="name" label="会员信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="@/assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="enableState" label="状态" :formatter="getStatus">
      </el-table-column>
      <el-table-column prop="shop.name" label="所属店铺">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import BizDialogSelector from '@/components/BizDialogSelector';
import service from '@/service/customer-service/workSheetMgmt.js';
import groupBaseInfo from '@/service/customer-service/group-mgmt/groupBaseInfo';
import { mapGetters } from 'vuex';
export default {
  name: 'WorkSheetBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    // let checkMember = (rule, value, callback) => {
    //   if (!value.id) {
    //     return callback(new Error('请选择会员'));
    //   } else {
    //     return callback();
    //   }
    // };
    return {
      // 图片列表
      imgList: [],
      activeNames: [''],
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
      disabled1: false,
      disabled2: false,
      isCS: true,
      rules: {
        member: [
          // { validator: checkMember, trigger: 'blur' },
          { required: false, trigger: 'blur' }
        ],
        // sponsor: [{ required: true, message: '请选择发起人', trigger: 'blur' }],
        level: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
        type: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        content: [{ required: true, message: '请填写工单内容', trigger: 'blur' }],
        state: [{ required: true, message: '请选择工单状态', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false,
          auth: ['admin:customerServiceScheduling.edit']
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
  methods: {
    ...mapGetters(['getUser']),
    onChange() {
      if (this.form.creator.id !== this.getUser().id && this.form.state !== '1') {
        this.form.state = '1';
      }
    },
    onGroupChange(id) {
      this.querySponsorList(id);
    },
    getBaseInfo() {
      this.user = this.getUser();
      for (const iterator of this.user.roleDatas) {
        if (iterator.type === '5') {
          this.isCS = false;
          break;
        }
      }
    },
    resetForm() {
      return {
        number: '',
        createDate: '',
        member: {
          id: '',
          nickname: ''
        },
        creator: {},
        mobile: '',
        // sponsor: {
        //   id: ''
        // },
        level: '0',
        type: '0',
        content: '',
        images: [],
        state: '0',
        handleType: '0',
        handlerAdmin: {
          id: '',
          name: ''
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
      this.pagination.currentPage = 1;
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
      if (!this.form.id) {
        this.create();
      } else {
        this.update();
      }
    },
    // 创建
    create() {
      let params = Object.assign({}, this.form, this.formatImgList(this.imgList));
      this.loading = true;
      service.createBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_CREATE: ', ErrorData);
        }
      );
    },
    // 更新
    update() {
      let params = Object.assign({}, this.form, this.formatImgList(this.imgList));
      this.loading = true;
      service.updateBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.refresh();
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_UPDATE: ', ErrorData);
        }
      );
    },
    // 重置表单
    clear() {
      this.form = this.resetForm();
      this.imgList = [];
    },
    // 刷新
    refresh() {
      this.clear();
      let params = {
        id: this.id
      };
      service.queryBaseInfo(
        params,
        data => {
          this.loading = false;
          console.log(data.data);
          this.form = Object.assign(this.resetForm(), data.data);
          this.imgList = this.formatFormImg(this.form.images);
          this.operations[0].disabled = false;
          if (this.form.state === '2') {
            this.operations[0].disabled = true;
          }
          this.querySponsorList();
          if (this.form.state === '1') {
            this.disabled1 = true;
          }
          if (this.form.state === '2') {
            this.disabled1 = true;
            this.disabled2 = true;
          }
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning({
            message: ErrorData.errorMessage,
            showClose: true
          });
          console.log('ERR_REFRESH: ', ErrorData);
        }
      );
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }
      return '';
    },
    // imgList => form.images
    formatImgList(list) {
      let tmp = list.map(img => {
        return { image: img };
      });
      return { images: tmp };
    },
    // form.images => imgList
    formatFormImg(images) {
      let tmp = images.map(img => {
        return img.image;
      });
      return tmp;
    },
    // 选择会员
    handleSelect() {
      this.showDialog = true;
      this.filters[0].value = '';
      this.queryMemberList();
    },
    confirmSelected(key, value) {
      console.log(key, value);
      this.showDialog = false;
      this.$set(this.form, 'member', {
        nickname: value[0].nickname,
        id: value[0].id
      });
      this.form.member.mobile = value[0].mobile;
      this.form.member.userName = value[0].userName;
      this.form.member.name = value[0].name;
      this.selectedMemberId = key;
      this.$refs.form.clearValidate();
    },
    // 获取会员列表
    queryMemberList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.filters[0].value
      };
      service.queryMemberList(
        params,
        data => {
          this.tableData = [];
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {}
      );
    },
    // 获取受理人列表
    querySponsorList(id) {
      if (!id && !this.form.handleGroup.id) {
        this.handlerList.push({ id: this.form.handlerAdmin.id, name: this.form.handlerAdmin.name });
      }
      groupBaseInfo.query(
        {
          id: id || this.form.handleGroup.id
        },
        data => {
          this.handlerList = data.data.members;

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.loading = false;
        }
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
        ErrorData => {}
      );
    }
    // defriend({ clientId, name }) {
    //   console.log(clientId, name);
    //   this.form.member.id = clientId;
    //   this.form.member.name = name;
    //   this.form.type = '4';
    // }
  },
  computed: {},
  watch: {
    itemId(newValue, oldValue) {
      this.clear();
      this.$refs.form.$el.scrollTop = 0;
      if (newValue.id) {
        this.id = this.itemId.id;
        this.$refs.form.clearValidate();
        this.refresh();
      } else {
        this.handlerList = [];
      }
    },
    showDialog(newVal, oldVal) {
      if (newVal) {
        this.pagination = this.resetPagination();
        this.queryMemberList();
      }
    }
  },
  mounted() {
    this.querySponsorGroupList();
    // this.getBaseInfo();
  },
  components: {
    BizGrid,
    BizSaveButton,
    ImgUploader,
    BizDialogSelector
  }
};
</script>

<style lang="scss">
.work-sheet-base-info {
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

.work-sheet-select-member.biz-dialog-selector {
  .el-dialog {
    width: 800px;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
