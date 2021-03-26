<template>
  <biz-grid class="modify-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <biz-list ref="table" :tableData="tableData" :loading="loading">
      <el-table-column label="商品" prop="productName"></el-table-column>
      <el-table-column label="盈亏" prop="profit"></el-table-column>
      <el-table-column label="调整数量" prop="adjustAmount">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" v-model="scope.row.adjustAmount" style="width:150px"></el-input-number>
          </div>
        </div>
      </el-table-column>
    </biz-list>
  </biz-grid>
</template>

<script>
import BizList from '@/components/BizTable/BizList';
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'ModifyInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      operations: [
        {
          label: '确认调整',
          name: 'modifiy',
          type: 'primary',
          auth: ['admin:check.edit']
        }
      ]
    };
  },
  components: {
    BizList,
    BizGrid,
    BizSaveButton
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh(id) {
      this.loading = true;
      let params = {
        id: id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.inventory.itemList, params)
        .then(data => {
          for (const item of data.itemList) {
            this.$set(item, 'adjustAmount', item.profit);
            this.tableData.push(item);
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    modifiy() {
      console.log(this.tableData);
      this.itemDatas = this.tableData.map(item => {
        return {
          id: item.id || '',
          billId: this.itemId,
          productId: item.productId ? item.productId : item.id,
          amount: item.amount || '',
          productName: item.productName,
          depotId: item.depotId,
          depotName: item.depotName,
          inventoryAmount: item.inventoryAmount || '',
          profit: item.profit || '',
          adjustAmount: item.adjustAmount
        };
      });

      let flag = false;
      this.tableData.forEach(item => {
        if (item.adjustAmount === '') {
          this.$message.warning('请填写调整数量！');
          flag = true;
        }
      });
      if (flag) {
        return false;
      } else {
        let params = {
          itemDatas: this.itemDatas
        };
        http
          .put(urls.invoicing.inventory.adjustInventory, params)
          .then(data => {
            this.$message.success('保存成功');
            this.$emit('operationSuccess', this.itemId);
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          });
      }
    },
    updateHeight() {
      setTimeout(() => {
        this.$refs.table.doHeight();
      }, 100);
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {},
  watch: {}
};
</script>

<style lang="scss">
.modify-info {
  padding: 10px;
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
