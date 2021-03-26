<template>
  <div class="storage-plugin-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      @row-click="rowClick" @size-change="handleSizeChange" @current-change="handleCurrentChange" :checkable="checkable">
      <el-table-column prop="name" label="名称">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.name}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="version" label="版本">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.version}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="author" label="作者">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.author}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="isEnabled" label="启用">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="scope.row.isEnabled === 'true'">
            <i class="el-icon-check" style="color=green"></i>
          </div>
          <div class="biz-customcol" v-if="scope.row.isEnabled === 'false'">
            <i class="el-icon-close"></i>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="isInstalled" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="scope.row.isInstalled === 'false' && scope.row.id !== 'filePlugin'">
            <el-button type="text" size="mini" @click.stop="installRow(scope.row.id)">
              安装
            </el-button>
          </div>
          <div class="biz-customcol" v-if="scope.row.isInstalled === 'true' && scope.row.id !== 'filePlugin'">
            <el-button type="text" size="mini" @click.stop="uninstallRow(scope.row.id)">
              卸载
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <storage-plugin-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :id="id4Popup" @refreshNotification="refresh"></storage-plugin-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import StoragePluginMgmtPopup from './StoragePluginMgmtPopup';
import Service from '@/service/system-setting/storage-plugin-mgmt/storagePluginMgmt';

export default {
  name: 'StoragePluginMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 1
      },
      checkable: false
    };
  },
  components: {
    BizFlexTable,
    StoragePluginMgmtPopup
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      Service.getList(
        params,
        data => {
          this.tableData = data.storagePluginList;
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
    // 快捷操作-安装
    installRow(id) {
      this.$confirm('您确定要安装该插件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: id
          };
          Service.install(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '安装成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message({
                title: '警告',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
            }
          );
        })
        .catch(() => {});
    },
    // 快捷操作-卸载
    uninstallRow(id) {
      this.$confirm('您确定要卸载该插件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: id
          };
          Service.uninstall(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '卸载成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message({
                title: '警告',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
            }
          );
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    rowClick(row) {
      if (row.isInstalled === 'false') {
        this.$message({
          type: 'warning',
          message: '请先安装插件，然后再进行设置!'
        });
        return;
      }
      this.openPopup = true;
      this.id4Popup = row.id;
    },
    closePopup() {
      this.openPopup = false;
    }
  }
};
</script>

<style lang="scss">
.storage-plugin-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
  .el-icon-check {
    color: green;
  }
  .el-icon-close {
    color: red;
  }
}
</style>
