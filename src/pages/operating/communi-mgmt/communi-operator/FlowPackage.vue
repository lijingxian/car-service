<template>
  <biz-grid class="communi-mgmt-operator-flow-package">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-table ref="table" size="small" stripe border highlight-current-row tooltip-effect="dark" style="width: 100%;"
      :header-cell-style="headerStyle" :data="tableData" @row-click="rowClick" @selection-change="handleSelectionChange" class="cp-table">
      <el-table-column type="selection" width="20"></el-table-column>
      <el-table-column prop="rechargePackageSn" label="运营商套餐编号" width="100"></el-table-column>
      <el-table-column prop="name" label="套餐名称"></el-table-column>
      <el-table-column prop="price" label="销售价(元)" width="70"></el-table-column>
      <el-table-column prop="cost" label="采购价(元)" width="70"></el-table-column>
      <el-table-column prop="count" label="可用卡密" width="60"></el-table-column>
      <el-table-column prop="option" label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="cardMgmt(scope.row)">
            卡密管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form :rules="rules" :model="form" ref="form" label-width="130px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="运营商套餐编号" prop="rechargePackageSn">
        <el-input placeholder="请输入运营商套餐编号" v-model="form.rechargePackageSn"></el-input>
      </el-form-item>
      <el-form-item label="套餐名称" prop="name">
        <el-input placeholder="请输入套餐名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="销售价(元)" prop="price">
        <el-input placeholder="请输入销售价" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="采购价(元)" prop="cost">
        <el-input placeholder="请输入采购价" v-model="form.cost"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="notice">
        <el-input type="textarea" placeholder="请输入描述" v-model="form.notice"></el-input>
      </el-form-item>
      <el-form-item label="可用卡密" prop="count">
        <el-input placeholder="请输入可用卡密数量" v-model="form.count" disabled></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input placeholder="请输入排序" v-model="form.order"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="form.state" label="0">下架</el-radio>
        <el-radio v-model="form.state" label="1">上架</el-radio>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapMutations } from 'vuex';

import service from '@/service/communi-mgmt/communiOperator';

export default {
  name: 'OperatorFlowPackage',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    itemName: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [
        { label: '新建套餐', name: 'clear', type: 'primary' },
        { label: '删除套餐', name: 'del', type: '', disabled: true },
        { label: '保存套餐', name: 'save', type: 'primary' }
      ],
      rules: {
        rechargePackageSn: [
          { required: true, message: '请输入运营商套餐编号', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入销售价', trigger: 'blur' },
          { pattern: /^[0-9]+\.?[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入采购价', trigger: 'blur' },
          { pattern: /^[0-9]+\.?[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        order: [{ pattern: /^\+?[0-9][0-9]*$/, message: '请输入整数', trigger: 'blur' }]
      },
      form: this.resetForm(),
      headerStyle: {
        'text-align': 'center'
      },
      tableData: [],
      multiSelected: []
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    ...mapMutations('CommunicationCard', ['updateCurrentPackage']),
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        rechargePackageSn: '',
        name: '',
        price: '',
        cost: '',
        notice: '',
        count: '0',
        order: '',
        state: '0',
        packageType: '1'
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    handleSelectionChange(selectedItems) {
      this.operations[1].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
    },
    rowClick(row) {
      this.clear();
      this.form = Object.assign({}, row);
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
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
        service.deleteRechargePackage(
          params,
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.loading = false;
            console.log('ERR_DELETE: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    // 卡密管理
    cardMgmt(row) {
      this.updateCurrentPackage({
        packageId: row.id,
        operatorName: this.itemName,
        packageNumber: row.rechargePackageSn
      });
      this.$router.push({
        path: '/operating/communication-mgmt/operator/card'
      });
    },
    refresh() {
      this.loading = true;
      let params = {
        telecomOperatorId: this.itemId.id,
        packageType: '1',
        pageSize: 1000
      };
      service.queryRechargeList(
        params,
        data => {
          this.loading = false;
          this.tableData = data.content;
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      if (!this.form.id) {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      this.loading = true;
      let params = Object.assign({}, this.form, { telecomOperatorId: this.itemId.id });
      service.createRechargePackage(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.clear();
          this.refresh();
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_CREATE: ', ErrorData.errorMessage);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      this.loading = true;
      let params = Object.assign({}, this.form, { telecomOperatorId: this.itemId.id });
      service.updateRechargePackage(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.clear();
          this.refresh();
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_UPDATE: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    this.refresh();
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.communi-mgmt-operator-flow-package {
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    padding: 0 5px 10px 5px;
  }
  .el-table .cell {
    padding-right: 3px;
    padding-left: 3px;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 3px;
  }
  .cp-table {
    .el-table__empty-block {
      line-height: 60px;
    }
  }
  .el-form {
    // height: 100%;
    // overflow: auto;
    padding-top: 20px;
    // padding-right: 20px;
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
}
</style>
