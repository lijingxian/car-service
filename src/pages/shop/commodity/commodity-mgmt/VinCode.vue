<template>
  <div class="vin-code">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="!showForm">
      <el-table-column min-width="100" prop="number" label="车辆识别码（VIN码）">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: red" @click.stop="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog class="box-card" :visible.sync="showForm" append-to-body title="添加车辆识别码" width="600px">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
        <el-form-item label="车辆识别码" prop="number">
          <el-input v-model="formModel.number" style="width:220px"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import BizSaveButton from '@/components/BizSaveButton';
export default {
  name: 'RecordsList',
  data() {
    return {
      // 计时器ID
      timer: null,
      formModel: {
        number: '',
        id: '',
        productId: ''
      },
      isSetting: false,
      open: false,
      showForm: false,
      tabName: 'first',
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:product.edit'] },
        { label: '删除', name: 'del', disabled: true, auth: ['admin:product.edit'] },
        { label: '刷新', name: 'refresh', type: '', auth: ['admin:product.edit'] }
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
      filters: [
        // {
        //   type: 'input',
        //   label: '',
        //   placeholder: '车辆识别码（VIN码）',
        //   value: ''
        // }
      ],
      rules: {
        number: [{ required: true, message: '请输入车辆识别码', trigger: 'blur' }]
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      multiSelected: []
    };
  },
  props: {
    itemId: {
      type: String
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    handleOperate(name) {
      this[name]();
    },
    // 按钮'添加'
    add() {
      this.formModel.number = '';
      this.formModel.id = '';
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
    },
    save() {
      this.formModel.productId = this.itemId;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formModel.id &&
            http
              .put('/admin/product/vinManage/vinCode.jhtml', this.formModel)
              .then(data => {
                this.$message.success('更新成功');
                this.showForm = false;
                this.refresh();
              })
              .catch(errData => {
                console.log(errData);
                this.$message.warning(errData.errorMessage);
              });
          !this.formModel.id &&
            http
              .post('/admin/product/vinManage/vinCode.jhtml', this.formModel)
              .then(data => {
                this.$message.success('保存成功');
                this.showForm = false;
                this.refresh();
              })
              .catch(errData => {
                console.log(errData);
                this.$message.warning(errData.errorMessage);
              });
        }
      });
    },
    // 按钮'删除'
    del(id) {
      // 传入id为单个删除,否则为批量删除
      let ids = id ? Array(id) : this.multiSelected;
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
          ids: ids,
          shopId: window.top.SHOP_ID
        };
        http
          .delete('/admin/product/vinManage/vinCode.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
          });
      });
    },
    // 过滤器发生变动
    filterDataChange(val) {
      console.log('> ', val);
      this.filters = val;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      if (val.length > 0) {
        this.operations[1].disabled = false;
      } else {
        this.operations[1].disabled = true;
      }
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
    },
    rowClick(row) {
      this.formModel.number = row.number;
      this.formModel.id = row.id;
      this.showForm = true;
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    close() {
      this.open = false;
    },
    refresh() {
      console.log('filters: ', this.filters);
      this.showForm = false;
      let params = {
        productId: this.itemId,
        // searchValue: this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/product/vinManage/vinCodes.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  created() {
    this.refresh();
  },
  watch: {
    itemId(nVal, oVal) {
      this.refresh();
    }
  },
  components: {
    BizFlexTable,
    BizSaveButton
  }
};
</script>

<style lang="scss">
.vin-code {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-input-group {
    width: 225px;
  }
  .biz-table-filter .filter-wrap .biz-date-range .el-date-editor--daterange.el-input__inner {
    width: 200px;
  }
  .biz-input {
    top: 20px !important;
    right: 15px !important;
  }
}
</style>
