<template>
  <biz-grid class="fedration-mgmt-fince">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="金融方案" name="1">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="方案名称" prop="name">
          </el-table-column>
          <el-table-column prop="financialInstitutionName" label="金融机构">
          </el-table-column>
          <el-table-column prop="categoryName" label="方案分类">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="保险方案" name="2">
        <el-table ref="multipleTableI" :data="tableDataI" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChangeI">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="保险方案" prop="name"></el-table-column>
          <el-table-column prop="financialInstitutionName" label="金融机构">
          </el-table-column>
          <el-table-column prop="categoryName" label="方案分类">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
export default {
  name: 'FederationMgmtIntroduce',
  components: { BizGrid, BizSaveButton },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      activeNames: ['1'],
      multipleSelection: [],
      multipleSelectionI: [],
      storeHasFinancialList: [],
      storeHasInsuranceList: [],
      tableData: [],
      tableDataI: []
    };
  },
  props: {
    itemId: {
      type: Object
    },
    type: {
      type: String
    }
  },
  created() {
    if (this.itemId) {
      this.type !== 'operator' && this.query();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.type !== 'operator' && this.query();
    }
  },
  updated() {
    this.updateSelection();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    updateSelection() {
      this.tableData.map(item => {
        if (this.storeHasFinancialList.includes(item.id)) {
          this.$refs.multipleTable.toggleRowSelection(item, true);
        }
      });
      this.tableDataI.map(item => {
        if (this.storeHasInsuranceList.includes(item.id)) {
          this.$refs.multipleTableI.toggleRowSelection(item, true);
        }
      });
    },
    query() {
      let param = {
        shopId: this.itemId.id
      };
      http
        .get('/admin/platformfinancialProductController/financialProductList.jhtml', param)
        .then(data => {
          this.tableData = data.financialList;
          this.tableDataI = data.insuranceList;
          this.storeHasFinancialList = data.storeHasFinancialList;
          this.storeHasInsuranceList = data.storeHasInsuranceList;
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    save() {
      let param = {
        shopId: this.itemId.id,
        financialList: this.multipleSelection.map(item => {
          return item.id;
        }),
        insuranceList: this.multipleSelectionI.map(item => {
          return item.id;
        })
      };
      http
        .post('/admin/platformfinancialProductController/authorizeFinancialProductToStore.jhtml', param)
        .then(data => {
          this.$message.success('保存成功');
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    toggleSelectionI(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTableI.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTableI.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleSelectionChangeI(val) {
      this.multipleSelectionI = val;
    }
  }
};
</script>
<style lang="scss">
.fedration-mgmt-fince {
  .biz-editor {
    padding-top: 20px;
    margin: 0 auto;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
