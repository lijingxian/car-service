<template>
  <biz-grid class="potential-customer__intention-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-table :data="tableData" size="small">
      <el-table-column prop="level" label="意向等级" :formatter="upperCaseConverter">
        <template slot-scope="scope">
          {{scope.row.level}}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="含义"></el-table-column>
      <el-table-column prop="depict" label="描述" min-width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.depict" size="mini"></el-input>
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
    query() {
      this.loading = true;
      http
        .get(potentialCustomerMgmt.intentionSettings, { shopId: window.top.SHOP_ID || '' })
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
        temp.push(obj);
      });

      return temp;
    },

    save() {
      let arr = this.convertSaveData(this.tableData);
      http
        .post(potentialCustomerMgmt.intentionSettings, {
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
  name: 'IntentionSetting',
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
.potential-customer__intention-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-table {
    padding: 20px;
    .el-input {
      width:180px;
    }
  }
}
</style>
