<template>
  <biz-grid class="member-bean-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit"></biz-header>
    <div class="header_bean" style="top:50px">当前V豆：{{totalBean}}</div>
    <el-table :data="tableData" height="100%" style="margin-top:30px" @selection-change="handleSelectionChange" highlight-current-row tooltip-effect="dark" stripe size="small">
      <el-table-column label="来源" prop="typeName">
        <!-- <template slot-scope="scope">
          {{scope.row.tags&&scope.row.tags.length>0?scope.row.tags[0]:scope.row.typeName}}
        </template>-->
      </el-table-column>
      <el-table-column label="数量" prop="beanCount"></el-table-column>
      <el-table-column label="日期" prop="happenData" width="150px"></el-table-column>
      <el-table-column label="备注" prop="memo"></el-table-column>
    </el-table>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog :visible.sync="showFormAdd" title="充值" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="V豆总数" prop="totalBean">
          <el-input v-model="formModel.totalBean" :disabled="true" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="充值数量" prop="beanCount">
          <el-input v-model="formModel.beanCount" placeholder="输入充值数量，如500" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="tags">
          <div>店铺调增</div>
          <el-radio-group v-model="increase">
            <el-radio :label="increaseTag.id" v-for="(increaseTag,index) in increaseTags" :key="index">{{increaseTag.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.memo" maxlength="100" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;"></biz-save-button>
    </el-dialog>
    <el-dialog :visible.sync="showFormConsumption" title="消费" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="V豆总数" prop="totalBean">
          <el-input v-model="formModel.totalBean" :disabled="true" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="消费数量" prop="beanCount">
          <el-input v-model="formModel.beanCount" placeholder="输入消费数量，如500" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="tags">
          <div>店铺调减</div>
          <el-radio-group v-model="reductions">
            <el-radio :label="reductionsTag.id" v-for="(reductionsTag,index) in reductionsTags" :key="index">{{reductionsTag.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.memo" maxlength="100" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperationsCon" @operate="handleOperateCon" style="margin-right: 0;"></biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import http from '@/common/http';
export default {
  name: 'MemberBaseInfo',
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
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizPagination
  },
  data() {
    return {
      rules: {
        beanCount: [
          { required: true, message: '请输入调整V豆', trigger: 'blur' },
          { pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的正整数', trigger: 'blur' }
        ],
        tags: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.increase || this.reductions) {
                callback();
              } else {
                callback(new Error('请选择来源'));
              }
            }
          }
        ]
      },
      increase: '',
      increaseTags: [],
      reductions: '',
      reductionsTags: [],
      loading: false,
      formLoading: false,
      showFormAdd: false,
      showFormConsumption: false,
      totalBean: '',
      // 用户信息
      formModel: {
        totalBean: '',
        beanCount: '',
        memo: ''
      },
      operations: [
        {
          label: '充值',
          name: 'add',
          type: 'primary'
        },
        {
          label: '消费',
          name: 'consumption',
          type: 'primary'
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelFormAdd'
        },
        {
          label: '保存',
          name: 'saveAdd',
          type: 'primary'
        }
      ],
      formOperationsCon: [
        {
          label: '取消',
          name: 'cancelFormCon'
        },
        {
          label: '保存',
          name: 'saveCon',
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
      }
    };
  },
  created() {
    if (this.itemId.id) this.getList();
  },
  watch: {
    'itemId.id'(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    getTagIncrease() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        categoryType: 'V豆标签/店铺调增'
      };
      http
        .get('/admin/tag/storeTags.jhtml', params)
        .then(data => {
          this.increaseTags = data.content;
          if (this.increaseTags.length > 0) {
            this.increase = this.increaseTags[0].id;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getTagReductions() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        categoryType: 'V豆标签/店铺调减'
      };
      http
        .get('/admin/tag/storeTags.jhtml', params)
        .then(data => {
          this.reductionsTags = data.content;
          if (this.reductionsTags.length > 0) {
            this.reductions = this.reductionsTags[0].id;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dateConverter(row) {
      switch (row.type) {
        case '0':
          return '签到';
        case '1':
          return '消费';
        case '2':
          return '系统转账（转出）';
        case '3':
          return '订单退还';
        case '4':
          return '系统转账（转入）';
        case '5':
          return '平台激励';
        case '6':
          return '平台消耗';
        case '7':
          return '活动';
        case '8':
          return '系统';
        case '9':
          return '关怀';
      }
      return '';
    },
    getList() {
      this.loading = true;
      this.showForm = false;
      service.getlistVbean(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || '',
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.totalBean = data.totalBean;
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleOperate(name) {
      this[name]();
    },
    handleOperateCon(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    saveAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let tags = [];
          this.increaseTags.map(item => {
            if (item.id === this.increase) {
              tags.push({ id: item.id, name: item.name });
            }
          });
          if (this.increase === '') {
            this.$message.warning('请选择来源');
            return false;
          }
          this.loading = true;
          service.createBean(
            {
              memberCardId: this.itemId.id,
              beanCount: this.formModel.beanCount,
              memo: this.formModel.memo,
              shopId: window.top.SHOP_ID || '',
              tags: tags
            },
            data => {
              this.$message.success('保存成功');
              this.loading = false;
              this.getList();
              this.$emit('operationSuccess');
              this.showFormAdd = false;
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = false;
            }
          );
        }
      });
    },
    saveCon() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let tags = [];
          this.reductionsTags.map(item => {
            if (item.id === this.reductions) {
              tags.push({ id: item.id, name: item.name });
            }
          });
          if (this.reductions === '') {
            this.$message.warning('请选择来源');
            return false;
          }
          this.loading = true;
          service.createBean(
            {
              memberCardId: this.itemId.id,
              beanCount: -Number(this.formModel.beanCount),
              memo: this.formModel.memo,
              shopId: window.top.SHOP_ID || '',
              tags: tags
            },
            data => {
              this.$message.success('保存成功');
              this.loading = false;
              this.getList();
              this.$emit('operationSuccess');
              this.showFormConsumption = false;
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = false;
            }
          );
        }
      });
    },
    add() {
      service.getlistVbean(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = {};
          this.formModel.totalBean = data.totalBean;
          this.loading = false;
          this.showFormAdd = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
      this.increase = '';
      this.reductions = '';
      this.getTagIncrease();
      this.getTagReductions();
    },
    consumption() {
      service.getlistVbean(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = {};
          this.formModel.totalBean = data.totalBean;
          this.loading = false;
          this.showFormConsumption = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
      this.increase = '';
      this.reductions = '';
      this.getTagIncrease();
      this.getTagReductions();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    cancelFormAdd() {
      this.showFormAdd = false;
    },
    cancelFormCon() {
      this.showFormConsumption = false;
    },
    showStorePicker(e) {
      this.showDialog = true;
    }
  }
};
</script>

<style lang="scss">
.member-bean-info {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .biz-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
    left: 0px;
    top: 20px;
    color: #606266;
    font-size: 14px;
    width: 300px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
