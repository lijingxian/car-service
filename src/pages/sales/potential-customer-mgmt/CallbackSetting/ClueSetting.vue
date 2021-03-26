<template>
  <biz-grid class="potential-customer__clue-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-table :data="tableData" style="width: 100%" size="small" :span-method="arraySpanMethod">
      <el-table-column prop="remarks" label="描述">
        <template slot-scope="scope">
          <div v-if="scope.row.level==='FOLLOWLIMIT'">
            <el-input v-model="scope.row.visitInterval" size="mini">
              <div slot="prepend">潜客分配后，</div>
              <div slot="append">天未跟进回访，抛回公海</div>
            </el-input>
          </div>
          <div v-else>
            {{scope.row.remarks}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="设置" width="350">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.isValid" class="callback-radio" v-if="scope.row.level!=='FOLLOWLIMIT'" size="mini">
            <el-radio label="1">可见</el-radio>
            <el-radio label="0">不可见</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';

const data = {
  data: {
    loading: false,
    operations: [
      {
        label: '保存',
        name: 'save',
        type: 'primary'
      }
    ],
    form: {},
    tableData: [],
    day: ''
  },
  methods: {
    upperCaseConverter(row) {
      return row.level.toUpperCase();
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 2) {
        if (columnIndex === 0) {
          return [1, 2];
        }
      }
    },
    query() {
      this.loading = true;
      http
        .get(potentialCustomerMgmt.callbackSetting.callbackSetting, {
          shopId: window.top.SHOP_ID || '',
          type: 'track'
        })
        .then(data => {
          this.tableData = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    convertSaveData(arr) {
      let temp = [];
      arr.forEach(item => {
        let obj = Object.assign({}, item);
        obj.visitInterval = Number.parseInt(obj.visitInterval);
        temp.push(obj);
      });

      return temp;
    },

    save() {
      let arr = this.convertSaveData(this.tableData);
      http
        .post(potentialCustomerMgmt.callbackSetting.callbackSetting, {
          shopId: window.top.SHOP_ID || '',
          dataList: arr
        })
        .then(data => {
          this.$message.success('保存成功');

          this.$emit('operationSuccess');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    }
  },
  events: {
    operateHandler(name) {
      this[name]();
    }
  }
};

export default {
  name: 'ClueSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...data.data
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  },
  methods: {
    ...data.events,
    ...data.methods
  },
  watch: {
    itemId(nVal, oVal) {
      console.log(nVal);
      this.query();
    }
  }
};
</script>

<style lang="scss">
.potential-customer__clue-setting {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-input-group__append, .el-input-group__prepend{
    background-color: #ffffff;
    color: #606266;
  }
  padding-top: 20px;
  .el-table {
    padding: 20px;
    .el-input {
      width: 90%;
    }
  }
}
</style>
