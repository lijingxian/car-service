<template>
  <biz-grid class="template-setting" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit">
    </biz-header>
    <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange" @row-click="rowClick">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="道闸" prop="gateType" width="40">
        <template slot-scope="scope">
          {{scope.row.gateType==='0'?'入口':'出口'}}
        </template>
      </el-table-column>
      <el-table-column label="模版" prop="messageType" width="80">
        <template slot-scope="scope">
          {{scope.row.messageType==='0'?'通用模版':(scope.row.messageType==='1'?'会员模版':'等候消息模板')}}{{scope.row.rank?'-'+scope.row.rank.name:''}}
        </template>
      </el-table-column>
      <el-table-column label="模版消息" prop="content" width="200px"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="text" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
        <el-form-item label="道闸" prop="gateType">
          <el-select placeholder="请选择道闸" :disabled="!!formModel.id" v-model="formModel.gateType" @change="gateTypeChange">
            <el-option label="入口" value="0"></el-option>
            <el-option label="出口" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版类型" prop="messageType">
          <el-select placeholder="请选择模版类型" :disabled="!!formModel.id" v-model="formModel.messageType"  @change="messageTypeChange">
            <el-option label="通用模版" value="0" v-if="formModel.id"></el-option>
            <el-option label="会员模版" value="1"></el-option>
            <el-option label="等候消息模版" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级" prop="rank" v-if="formModel.messageType==='1'">
          <el-select placeholder="请选择会员等级" :disabled="!!formModel.id" v-model="formModel.rank.id" @change="rankChange">
            <el-option v-for="(rank,index) in rankList" :key="index" :label="rank.name" :value="rank.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版消息" prop="content">
          <div slot="label" style="display:inline-block">
            模版消息
            <el-button type="text" size="small" v-popover:codePop>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover">
              <p>通用模版消息：</p>
              <p>入口：（会员姓名）（称谓）欢迎光临!</p>
              <p>出口：（会员姓名）（称谓）欢迎下次光临，再见！</p>
              <p>会员模版消息：</p>
              <p>入口：尊敬的（会员等级）会员（会员姓名）（称谓）欢迎光临！</p>
              <p>出口：（会员姓名）（称谓）欢迎下次光临，再见！</p>
              <p>等候模版消息：</p>
              <p>入口：请稍后，（请联系）职位，姓名，电话！</p>
              <p>出口：请稍后，（请联系）职位，姓名，电话！</p>
            </el-popover>
          </div>
          <el-input v-model="formModel.content" maxlength="30" type="textarea" placeholder="请输入模版消息"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { customerService } from '@/common/urls';
import http from '@/common/http';
export default {
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizPagination
  },
  data() {
    return {
      rules: {
        gateType: [{ required: true, message: '请选择道闸', trigger: 'blur' }],
        messageType: [{ required: true, message: '请选择模版类型', trigger: 'blur' }],
        rank: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.rank.id) {
                callback();
              } else {
                callback(new Error('请选择会员等级'));
              }
            }
          }
        ],
        content: [{ required: true, message: '请输入模版消息', trigger: 'blur' }]
      },
      loading: false,
      formLoading: false,
      showForm: false,
      totalBean: '',
      // 用户信息
      formModel: {
        gateType: '',
        messageType: '1',
        rank: { id: '' },
        content: ''
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:reception.edit']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:reception.edit']
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
      rankList: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  mounted() {
    this.getMessage();
    this.listRank();
  },
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    gateTypeChange() {
      this.$refs.form.clearValidate('gateType');
    },
    messageTypeChange() {
      this.$refs.form.clearValidate('messageType');
    },
    rankChange() {
      this.$refs.form.clearValidate('rank');
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '试驾车辆';
        case '1':
          return '员工车辆';
        case '2':
          return '工程车辆';
        case '3':
          return '其他车辆';
        default:
          return '';
      }
    },
    resetForm() {
      return {
        gateType: '',
        messageType: '1',
        rank: { id: '' },
        content: '',
        id: ''
      };
    },
    rowClick(row) {
      // this.$refs.form.clearValidate();
      let params = { id: row.id || '' };
      http
        .get(customerService.ReceptionMgmt.message, params)
        .then(data => {
          this.formModel = Object.assign(this.resetForm(), data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
      this.showForm = true;
    },
    listRank() {
      this.loading = true;
      this.showForm = false;
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get(customerService.ReceptionMgmt.ranks, params)
        .then(data => {
          this.rankList = data.dataList;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMessage() {
      this.loading = true;
      this.showForm = false;
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(customerService.ReceptionMgmt.messages, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.formModel.id) {
            http
              .put(customerService.ReceptionMgmt.message, this.formModel)
              .then(data => {
                this.$message.success('更新成功');
                this.$emit('update');
                this.getMessage();
              })
              .catch(ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            http
              .post(customerService.ReceptionMgmt.message, this.formModel)
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('update');
                this.getMessage();
              })
              .catch(ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              })
              .finally(() => {
                this.loading = false;
              });
          }
        }
      });
    },
    delete() {
      let ids =
        this.selections.length === 0
          ? []
          : this.selections.map(item => {
            return item.id;
          });
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        this.loading = true;
        http
          .delete(customerService.ReceptionMgmt.message, params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.getMessage();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getMessage();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getMessage();
    },
    add() {
      this.formModel = this.resetForm();
      this.showForm = true;
      this.$refs.form.clearValidate();
    },
    cancelForm() {
      this.showForm = false;
    },
    showStorePicker(e) {
      this.showDialog = true;
    }
  }
};
</script>

<style lang="scss">
.template-setting {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .el-table__body-wrapper .is-scrolling-none {
    overflow-x: auto;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .header_bean {
    position: absolute;
    right: 0px;
    top: 10px;
    color: #606266;
    font-size: 14px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
