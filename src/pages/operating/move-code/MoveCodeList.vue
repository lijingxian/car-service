<template>
  <div class="move-code-list">
    <biz-flex-table :checkable="false" :operations="operations" @operate="operate" :filters="filters" :loading="loading"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <!-- 表格内容 -->
      <el-table-column label="挪车码" prop="code"></el-table-column>
      <el-table-column label="URL" prop="path">
        <template slot-scope="scope">
          <div class="url-detail">
            {{getUrl(scope.row.path)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="active">
        <template slot-scope="scope">
          {{scope.row.active==='0'?'未激活':'已激活'}}
        </template>
      </el-table-column>
      <el-table-column label="会员" prop="memberData.name"></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'MoveCodeList',
  data() {
    return {
      orderProperty: '',
      orderDirection: '',
      loading: false,
      operations: [],
      filters: [
        {
          type: 'select',
          label: '状态',
          value: '',
          options: [{ label: '全部', value: '' }, { label: '未激活', value: '0' }, { label: '已激活', value: '1' }]
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: []
    };
  },
  components: {
    BizFlexTable
  },
  methods: {
    operate(name) {
      this[name]();
    },
    getUrl(url) {
      let code = url.substring(url.lastIndexOf('/') + 1, url.length).split('.')[0];
      console.log(code);
      return (
        document.location.protocol +
        '//' +
        window.location.host +
        '/vfuhuizhong/html/wxqrcode.html?type=5&id=' +
        code +
        '&shopId=' +
        this.shopId
      );
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.filters = val;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 查询
    refresh() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        moveCarId: this.id || '',
        state: this.filters[0].value || ''
      };
      this.loading = true;
      http
        .get('/admin/movecar/moveCarCodes.jhtml', params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  computed: { ...mapGetters(['getUser']) },
  created() {},
  mounted() {
    this.refresh();
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    shopId: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(nVal, oVal) {
      if (nVal) {
        if (nVal !== oVal) {
          this.filters[0].value = '';
          this.refresh();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.move-code-list {
  height: 100%;
  .biz-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
  .biz-input {
    width: 280px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
  .url-detail {
    display: -webkit-box !important;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
