<template>
  <div class="distributor-mgmt">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" v-loading="loading" :tableData="tableData"
      :checkable="false" @row-click="rowClick">
      <el-table-column prop="name" label="关怀卡分类名称">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="description" label="关怀卡分类描述"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="scope.$index===0?'':moveUp(scope.$index)">上移</el-button>
            <el-button type="text" size="mini" @click.stop="scope.$index===tableData.length - 1?'':moveDown(scope.$index)">下移
            </el-button>
            <el-button type="text" size="mini" @click.stop="deleteHandler(scope.row.id)" v-if="hasAuthDel">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog :visible.sync="open" center append-to-body width="500px">
      <base-info :itemId="itemId" ref="baseInfo" @refresh="refresh" @close="close"></base-info>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { mapGetters } from 'vuex';
import BaseInfo from './BaseInfo';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'CategoryMgmt',
  components: { BizFlexTable, BaseInfo },
  props: {},
  data() {
    return {
      itemId: { id: '' },
      loading: false,
      tableData: [],
      dataList: [],
      open: false,
      tabName: 'baseinfo',
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:member.memberCare.category.add']
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:member.memberCare.category.delete');
    },
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:member.memberCare.category.edit');
    }
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    close() {
      this.open = false;
    },
    refresh(id) {
      if (id) {
        this.itemId = { id };
      }
      this.getList();
    },
    add() {
      this.open = true;
      this.itemId = { id: '' };
    },
    rowClick(val) {
      this.itemId = { id: val.id };
      this.open = true;
    },
    async moveUp(index) {
      this.loading = true;
      await this.switchRow(index - 1, index);
      this.loading = false;
    },
    async moveDown(index) {
      this.loading = true;
      await this.switchRow(index, index + 1);
      this.loading = false;
    },
    switchRow(preIndex, curIndex) {
      const prev = this.tableData[preIndex];
      const current = this.tableData[curIndex];
      const params = [{ id: prev.id, order: current.order }, { id: current.id, order: prev.order }];
      return new Promise((resolve, reject) => {
        http
          .put(urls.memberCareMgmt.changeOrder, params)
          .then(data => {
            // [this.tableData[curIndex], this.tableData[preIndex]] = [this.tableData[preIndex], this.tableData[curIndex]];
            this.$set(this.tableData, preIndex, { ...current, order: prev.order });
            this.$set(this.tableData, curIndex, { ...prev, order: current.order });
            console.log('tableData: ', this.tableData);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    async deleteHandler(id) {
      try {
        await this.$confirm('确认删除?', '提示', { type: 'warning' });
        const params = {
          ids: [id]
        };
        http
          .delete(urls.memberCareMgmt.categoryCard, params)
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(err => {
            this.$message.warning(err.errorMessage);
            console.log('ERR_DELETE: ', err);
          });
      } catch (e) {
        console.log('取消删除');
      }
    },
    // 获取列表
    getList() {
      const shopId = (this.getUser.shop && this.getUser.shop.id) || window.top.SHOP_ID || '';
      const params = {
        shopId,
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.memberCareMgmt.categoryList, params)
        .then(data => {
          this.tableData = data.dataList;
          this.open = false;
        })
        .catch();
    }
  }
};
</script>

<style lang="scss">
.distributor-mgmt {
  padding-right: 5px;
  .biz-save-button {
    margin-top: 5px;
  }
}
</style>
