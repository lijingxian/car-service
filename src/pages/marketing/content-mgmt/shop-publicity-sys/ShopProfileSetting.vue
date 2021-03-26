<template>
  <biz-grid class="shop-profile-setting">
    <biz-flex-table :loading="loading" ref="table" :tableData="tableData" :checkable="checkable">
      <el-table-column label="赋能内容" prop="name"></el-table-column>
      <el-table-column label="状态" prop="receiveArticleSwitchs">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.receiveArticleSwitchs"  active-color="#87d068" @change="onChange($event, scope.row)"></el-switch>
        </template>
      </el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'shop-profile-setting',
  data() {
    return {
      loading: false,
      checkable: false,
      tableData: [{ name: '允许该店铺接受平台推送的资讯文章', receiveArticleSwitchs: false }]
    };
  },
  props: {},
  components: {
    BizFlexTable,
    BizGrid
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {},
  methods: {
    // 查询店铺赋能信息
    getInfo () {
      this.loading = true;
      http
        .get(urls.shopRate.storeProfile, { store: this.getUser.shop.id })
        .then(data => {
          this.loading = false;
          console.log('店铺赋能信息', data);
          this.tableData[0].receiveArticleSwitchs = data.data.receiveArticleSwitchs === '1';
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    onChange(e, row) {
      this.loading = true;
      let param = {
        store: this.getUser.shop.id,
        receiveArticleSwitchs: this.tableData[0].receiveArticleSwitchs ? '1' : '0'
      };
      http
        .put(urls.shopRate.storeProfileSwitchs, param)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style lang="scss">
.shop-profile-setting {
}
</style>
