<template>
  <biz-grid class="member-grade-info" v-loading="loading">
    <biz-header slot="top" :operations="operations" @operate="handleOperate" v-if="isEdit">
    </biz-header>
    <el-table :data="tableData" height="100%" stripe highlight-current-row tooltip-effect="dark" @selection-change="handleSelectionChange"
      @row-click="rowClick" size="small">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="等级" prop="name"></el-table-column>
      <el-table-column label="积分标准" prop="point"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-color="#87d068" inactive-color="#d9d9d9" active-value="1" inactive-value="0"
            @change="stateChange(scope.row)" :disabled="!isEdit"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="等级权益" width="150px">
        <div slot-scope="scope">
          <div v-for="right in scope.row.rights" v-if="right.rights" :label="right.name+':'" :key="right.id" prop="rights">
            <div v-for="item in right.rights" :label="item.name" :key="item.id" v-if="item.isSelected==='1'" true-label='1'
              false-label='0'>{{item.name}}</div>
          </div>
        </div>
      </el-table-column>
    </el-table>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" :model="form" label-width="120px" size="small" :rules="rules" :disabled="!isEdit">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入等级名称" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="等级图标" prop="image">
          <BizAvatarUploaderNew v-model="form.image" :disabled="!isEdit" @uploadSuccess="uploadSuccess">
          </BizAvatarUploaderNew>
        </el-form-item>
        <el-form-item label="积分标准" prop="point">
          <div slot="label" style="display:inline">
            积分标准
            <el-button type="text" size="small" v-popover:point>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="point" placement="bottom-start" width="300" trigger="hover" content="会员积分达到积分标准时等级将会提升到此等级">
            </el-popover>
          </div>
          <el-input-number v-model="form.point"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="form.state" active-color="#87d068" inactive-color="#d9d9d9" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="等级权益">
          <div slot="label">
            等级权益
            <el-button type="text" size="small" v-popover:rights>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="rights" placement="bottom-start" width="300" trigger="hover" content="等级权益可在【会员权益】里添加或修改">
            </el-popover>
          </div>
          <el-button type="primary" size="mini" @click="dialogTableVisible=true">选择</el-button>
        </el-form-item>
        <!-- <el-form-item v-for="right in form.rights" v-if="right.rights" :label="right.name+':'" :key="right.id" prop="rights">
          <el-checkbox v-for="item in right.rights" :label="item.name" :key="item.id" v-model="item.isSelected" true-label='1'
            false-label='0'>{{item.name}}</el-checkbox>
        </el-form-item> -->
        <div v-for="right in form.rights" v-if="right.rights" :key="right.id" prop="rights">
          <div v-for="item in right.rights" :key="item.id" v-if="item.isSelected==='1'" class="rights-selected">
            <img :src="item.logo||defaultImg" width="50px" height="50px" />
            <div class="right_name" :title="item.name">{{item.name}}</div>
          </div>
        </div>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;" v-if="isEdit">
      </biz-save-button>
    </el-dialog>
    <el-dialog title="权益选择" center :visible.sync="dialogTableVisible" width="80%" append-to-body custom-class="rights-select"
      :close-on-click-modal="false" @close="closed">
      <el-form ref="formDialog" label-width="120px" size="small">
        <el-form-item v-for="right in form.rights" v-if="right.rights" :label="right.name+':'" :key="right.id" prop="rights">
          <el-checkbox v-for="item in right.rights" :label="item.name" :key="item.id" v-model="item.isSelected" :disabled="item.valid==='0'"
            true-label='1' false-label='0'>
            <img :src="item.logo||defaultImg" width="50px" height="50px" />
            <div class="right_name" :title="item.name">{{item.name}}</div>
          </el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" align="right">
        <el-button type="primary" @click="cancle" size="mini">取消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确认选择</el-button>
      </span>
    </el-dialog>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import BizSaveButton from '@/components/BizSaveButton';
import { VueCropper } from '@/components/BizForm';
import http from '@/common/http';
export default {
  name: 'MemberGradeInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    templateId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizAvatarUploaderNew,
    BizSaveButton,
    VueCropper,
    BizPagination
  },
  data() {
    return {
      openV: false,
      picUrl: '',
      loading: false,
      formLoading: false,
      defaultImg: '/resources/admin/images/default/icon_vip.png',
      showForm: false,
      dialogTableVisible: false,
      flag: false,
      selectionIds: [],
      currentRights: [],
      id: '',
      // 用户信息
      form: {
        name: '',
        image: this.defaultImg,
        point: '',
        state: '1',
        rights: []
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入等级名称',
            trigger: 'change'
          }
        ],
        point: [
          { required: true, message: '请输入积分标准', trigger: 'blur' },
          { pattern: /^\+?[0-9]\d*$/, message: '请输入正确的积分', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getDefaultImg();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.getList();
      } else {
        this.initModel();
      }
    }
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
      this.form.image = url;
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    closed() {
      if (!this.flag) {
        this.cancle();
      }
    },
    cancle() {
      this.dialogTableVisible = false;
      this.flag = false;
      this.form.rights = this.form.rights.forEach(item => {
        item.rights.forEach(right => {
          if (right.isSelected === '1') {
            right.isSelected = '0';
          }
        });
      });
      this.id &&
        service.getVipCardGradeInfo(
          {
            rankId: this.id || '',
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.form.rights = data.content.rights;
            this.form.rights.forEach(item => {
              item.rights.forEach(right => {
                if (this.selectionIds.indexOf(right.id) !== -1) {
                  right.isSelected = '1';
                }
              });
            });
          },
          // result_code 不是100的处理
          ErrorData => {
            this.formLoading = false;
            console.log(ErrorData);
            console.log('code错误');
          }
        );
    },
    confirm() {
      this.dialogTableVisible = false;
      this.flag = true;
      this.selectionIds = [];
      this.form.rights.forEach(item => {
        item.rights.forEach(right => {
          if (right.isSelected === '1') {
            this.selectionIds.push(right.id);
          }
        });
      });
    },
    getDefaultImg() {
      let params = {
        type: 'displaySetting'
      };
      http
        .get('/admin/settings/settings.jhtml', params)
        .then(data => {
          if (data.settingList.defaultThumbnailProductImage) {
            this.defaultImg = data.settingList.defaultThumbnailProductImage;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    stateChange(item) {
      service.editVipCardGrade(
        {
          id: item.id,
          name: item.name,
          image: item.image,
          point: item.point,
          state: item.state,
          rights: item.rights,
          template: { id: this.itemId.id }
        },
        data => {
          this.$message.success('操作成功');
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    initModel() {
      this.form = {
        name: '',
        image: this.defaultImg,
        point: '',
        state: '1',
        rights: []
      };
    },
    add() {
      this.showForm = true;
      this.initModel();
      this.getRights();
    },
    cancelForm() {
      this.showForm = false;
    },
    getList() {
      this.showForm = false;
      service.memberRankList(
        {
          templateId: this.itemId.id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    query(id) {
      this.formLoading = true;
      this.id = id;
      service.getVipCardGradeInfo(
        {
          rankId: id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.form = Object.assign(this.form, data.content);
          this.formLoading = false;
          this.currentRights = this.form.rights;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.formLoading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getRights() {
      service.getRightsList(
        {
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.form.name = '';
          this.form.point = '';
          this.form.state = '1';
          this.form.rights = data.content;
          this.currentRights = this.form.rights;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    rowClick(row, e, column) {
      if (column.label === '状态') {
        return false;
      }
      this.query(row.id);
      this.showForm = true;
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.operations[1].disabled = false;
      } else {
        this.operations[1].disabled = true;
      }
      this.selections = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    delete() {
      let ids = [];
      this.selections.map(item => {
        ids.push(item.id);
      });
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        service.delVipCardGrade(
          {
            userRankIds: ids,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.$message.success('删除成功');
            this.getList();
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.form.id &&
            service.editVipCardGrade(
              this.form,
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.getList();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          if (!this.form.id) this.form.template = { id: this.itemId.id };
          !this.form.id &&
            service.addVipCardGrade(
              this.form,
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.getList();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
        }
      });
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
.member-grade-info {
  padding: 20px;
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .rights-selected {
    display: flex;
    padding: 5px 0px;
    font-size: 14px;
    line-height: 50px;
    img {
      margin: 0px 10px 0px 30px;
    }
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
