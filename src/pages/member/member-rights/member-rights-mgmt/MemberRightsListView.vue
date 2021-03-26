<template>
  <div class="member-rights-mgmt">
    <biz-flex-table :loading="loading" ref="table" :tableData="cardList" :checkable="false">
      <el-table-column width="180" prop="name" label="权益分类">
        <div slot-scope="scope" @click.stop="classClick(scope.row.id)">
          <span style="margin-left:5px">{{ scope.row.name }}</span>
        </div>
      </el-table-column>
      <el-table-column label="对应权益" prop="rights">
        <div slot-scope="scope" style="width:100%">
          <biz-column-table :dataList="scope.row.rights" :id="scope.row.id" @addButtonClick="addButtonClick" @rightsIconHandeler="rightsIconHandeler"
            @deleteRights="deleteRights">
          </biz-column-table>
        </div>
      </el-table-column>
      <el-table-column width="100" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteRightsClass(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import BizColumnTable from './components/BizColumnTable';
import service from '@/service/member-card-mgmt/memberCardMgmt';
export default {
  name: 'memberRightsMgmt',
  data() {
    return {
      loading: false,
      refreshSign: true,
      classId: '',
      rightsId: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  props: {
    height: String,
    cardList: Array
  },
  components: {
    BizFlexTable,
    BizColumnTable
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    operationSuccess() {
      this.$emit('create');
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      service.vipRightsList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    // 快捷操作-删除
    deleteRightsClass(id) {
      this.$emit('deleteRightsClass', id);
    },
    // 删除
    deleteRights(id) {
      this.$emit('deleteRights', id);
    },
    addButtonClick(id) {
      this.$emit('addButtonClick', id);
    },
    rightsIconHandeler(brandId, id) {
      this.$emit('rightsIconHandeler', brandId, id);
    },
    classClick(id) {
      this.$emit('classClick', id);
    }
  }
};
</script>

<style lang="scss">
.member-rights-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .el-table .cell {
    display: initial!important;
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
