<template>
  <biz-grid class="potential-customer__channel-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="120px" :model="form">
      <el-form-item label="潜客渠道">
        <div v-for="(data,index) in tableData" :key="index">
          <el-input v-model="data.name" :disabled="data.supportEdit==='0'">
            <el-button slot="append" icon="el-icon-circle-plus" v-if="tableData.length-1===index" @click="add"></el-button>
            <el-button slot="append" icon="el-icon-circle-close" v-if="data.supportEdit==='1'" @click="remove(data)"></el-button>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
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
    tempData: [],
    day: ''
  },
  methods: {
    upperCaseConverter(row) {
      return row.level.toUpperCase();
    },
    query() {
      this.loading = true;
      http
        .get(potentialCustomerMgmt.customerChannels, { shopId: window.top.SHOP_ID || '' })
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
    add() {
      this.tableData.push({ id: '', name: '', supportEdit: '1' });
    },
    remove(data) {
      this.$confirm('删除当前渠道，则将当前渠道下全部潜客渠道置空', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData.splice(this.tableData.indexOf(data), 1);
          data.operateType = 'D';
          this.tempData.push(data);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    save() {
      let arr = this.convertSaveData(this.tableData.concat(this.tempData));
      http
        .post(potentialCustomerMgmt.customerChannels, {
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
  name: 'ChannelSetting',
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
.potential-customer__channel-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    padding: 0 20px;
    .el-form-item__label {
      text-align: left;
    }
  }
}
</style>
