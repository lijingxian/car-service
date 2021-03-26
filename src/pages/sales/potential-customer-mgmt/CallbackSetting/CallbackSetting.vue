<template>
  <biz-grid class="potential-customer__callback-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-table :data="tableData" style="width: 100%" :span-method="arraySpanMethod" size="small">
      <el-table-column prop="level" label="意向等级" min-width="90" :formatter="upperCaseConverter">
        <template slot-scope="scope">
          <div v-if="scope.row.level!=='FOLLOWLIMIT'">
            {{scope.row.level}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="含义">
        <template slot-scope="scope">
          <div>
            {{scope.row.remarks}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="depict" label="描述">
        <template slot-scope="scope">
          <div>
            {{scope.row.depict}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="回访间隔" min-width="240">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.callback" class="callback-radio" v-if="scope.row.level!=='FOLLOWLIMIT'" size="mini">
            <el-radio :label="false">不回访</el-radio>
            <el-radio :label="true">回访</el-radio>
          </el-radio-group>
          <el-input v-model="scope.row.visitInterval" :disabled="!scope.row.callback" v-if="scope.row.level!=='FOLLOWLIMIT'" type="number" size="mini"
            min="0"></el-input>
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
    tableData: [],
    day: ''
  },
  methods: {
    upperCaseConverter(row) {
      return row.level.toUpperCase();
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 8) {
        if (columnIndex === 1) {
          return [1, 2];
        }
      }
    },
    query() {
      this.loading = true;
      http
        .get(potentialCustomerMgmt.callbackSetting.callbackSetting, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          data.dataList.map(item => {
            if (item.level === 'FOLLOWLIMIT') {
              item.callback = true;
            } else {
              item.callback = !!item.visitInterval;
            }
          });
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
    checkValid(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].callback) {
          let str = arr[i].visitInterval;
          if (str.indexOf('.') >= 0) {
            this.$message.warning('回访间隔必须为大于0的整数');
            return false;
          }
          let num = Number(str);
          if (isNaN(num) || num <= 0) {
            this.$message.warning('回访间隔必须为大于0的整数');
            return false;
          }
        }
      }

      return true;
    },
    convertSaveData(arr) {
      let temp = [];
      arr.forEach(item => {
        let obj = Object.assign({}, item);
        if (obj.callback) obj.visitInterval = Number.parseInt(obj.visitInterval);
        else obj.visitInterval = '';
        temp.push(obj);
      });

      return temp;
    },

    save() {
      let pass = this.checkValid(this.tableData);
      if (pass) {
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
    }
  },
  events: {
    operateHandler(name) {
      this[name]();
    }
  }
};

export default {
  name: 'CallbackSetting',
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
.potential-customer__callback-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .rule {
    padding: 20px 0px;
    font-size: 14px;
  }
  .biz-scroller {

    .callback-radio {
      float: left;

      // .el-radio + .el-radio {
      //   margin-left: 5px;
      // }
      .el-radio__label {
        font-size: 12px;
      }
    }

    .el-input {
      float: right;
      width: 70px;
      margin-left: auto;
      .el-input__inner {
        padding-left: 5px;
        padding-right: 0;
      }
      .el-input-group__append {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
  }
}
</style>
