<template>
  <biz-grid class="depot-info">
    <biz-flex-table ref="table" @operate="operate" :tableData="tableData" :loading="loading" :checkable="false">
      <el-table-column label="仓库" prop="name"></el-table-column>
      <el-table-column label="库存" prop="stock"></el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';

export default {
  name: 'DepotInfo',
  components: {
    BizFlexTable,
    BizGrid
  },
  props: {
    depotName: {
      type: Array
    },
    depotItem: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      tableData: []
    };
  },
  created() {},
  computed: {},
  mounted() {},
  watch: {},
  methods: {
    operate(name) {
      this[name]();
    },
    getList() {
      let child = [];
      // for (const item of this.depotName) {
      //   if (item.value === 'value3') {
      //     child.push({ name: item.name, stock: this.depotItem[0].value3 });
      //   }
      //   if (item.value === 'value4') {
      //     child.push({ name: item.name, stock: this.depotItem[0].value4 });
      //   }
      //   if (item.value === 'value5') {
      //     child.push({ name: item.name, stock: this.depotItem[0].value5 });
      //   }
      //   if (item.value === 'value6') {
      //     child.push({ name: item.name, stock: this.depotItem[0].value6 });
      //   }
      //   if (item.value === 'value7') {
      //     child.push({ name: item.name, stock: this.depotItem[0].value7 });
      //   }
      //   if (item.value === 'value8') {
      //     child.push({ name: item.name, stock: this.depotItem[0].value8 });
      //   }
      // }
      this.depotName.forEach((item, index) => {
        child.push({ name: item.name, stock: this.depotItem[0]['value' + (index + 3)] });
      });
      this.tableData = child;
      // this.tableData = this.depotName.map(item => {
      //   if (item.name === 'value3') {
      //     return {
      //       name: item.name,
      //       value: this.depotItem[0].value3
      //     };
      //   }
      // });
    }
  }
};
</script>

<style lang="scss">
.depot-info {
}
</style>
