<template>
  <biz-grid class="icon-template" v-loading="loading">
    <div slot="top" class="top-button">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
      </biz-header>
    </div>
    <div class="content">
      <icon-item v-for="(item, index) of itemList" :itemData="item" :key="index" @showInfo="showInfo" class="icon-item"
        @deleteIcon='deleteIconHandle'></icon-item>
    </div>
    <div slot="float">
      <icon-template-pop :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></icon-template-pop>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import IconTemplatePop from './IconTemplatePop';
import IconItem from './IconItem';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'icon-template',
  data() {
    return {
      itemId: '',
      open: false,
      loading: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入承诺名称',
          name: 'searchValue',
          value: ''
        }
      ],
      itemList: []
    };
  },
  props: {},
  components: { BizGrid, BizHeader, IconTemplatePop, IconItem },
  computed: {},
  watch: {},
  methods: {
    operationSuccess() {
      this.getList();
    },
    operate(name) {
      this[name]();
    },
    add() {
      this.open = true;
      this.itemId = '';
    },
    filterDataChange() {
      console.log('filterDataChange');
      this.getList();
    },
    showInfo(id) {
      this.open = true;
      this.itemId = id;
      console.log(this.itemId);
    },
    deleteIconHandle(itemData) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let param = {
          ids: [itemData.id]
        };

        http
          .delete(urls.systemSetting.createPromise, param)
          .then(data => {
            this.loading = false;
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          })
          .catch(error => {
            this.loading = false;
            this.$message({
              title: '警告',
              message: error.errorMessage,
              type: 'warning'
            });
          });
      });
    },
    getList() {
      let param = {
        searchValue: this.filters[0].value
      };
      http
        .get(urls.systemSetting.promiseList, param)
        .then(data => {
          console.log('承诺图标列表', data);
          this.itemList = data.content;
        })
        .catch(error => {
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
.icon-template {
  .content {
    padding: 20px;
    .icon-item {
      float: left;
    }
  }
}
</style>
