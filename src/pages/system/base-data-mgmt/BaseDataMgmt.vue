<template>
  <div class="base-data-mgmt">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      :filters="filters" @row-click="rowClick" @filter-data-change="filterDataChange" @selection-change="handleSelectionChange"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" :loading="loading">
      <template slot="operation">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
          :action="'/admin/brand/importBrandSeriesCar.jhtml'" :name="'uFile'" ref="importFile" @handle-import="handleImport"
          style="margin-left: 10px;">
          <el-table-column label="编号" prop="line" width="50">
          </el-table-column>
          <el-table-column label="消息" prop="result">
          </el-table-column>
          <!-- <el-table-column label="操作">
          </el-table-column> -->
        </import-file>
      </template>
      <el-table-column prop="brandName" label="品牌">
        <template slot-scope="scope">
          {{scope.row.brandName||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列">
        <template slot-scope="scope">
          {{scope.row.seriesName||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="车型">
        <template slot-scope="scope">
          {{scope.row.type||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="noticDate" label="年款">
        <template slot-scope="scope">
          {{scope.row.noticDate||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="gas" label="燃油编号">
        <template slot-scope="scope">
          {{scope.row.gas||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="urbanCondition" label="市区工况">
        <template slot-scope="scope">
          {{scope.row.urbanCondition||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="suburbanCondition" label="市郊工况">
        <template slot-scope="scope">
          {{scope.row.suburbanCondition||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="comprehensiveCondition" label="综合工况">
        <template slot-scope="scope">
          {{scope.row.comprehensiveCondition||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="整备质量">
        <template slot-scope="scope">
          {{scope.row.weight||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="pl" label="排量">
        <template slot-scope="scope">
          {{scope.row.pl||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="gearboxes" label="档位个数">
        <template slot-scope="scope">
          {{scope.row.gearboxes||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="gearboxesType" label="变速箱类型">
        <template slot-scope="scope">
          {{scope.row.gearboxesType||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="tiresFront" label="前轮胎规格">
        <template slot-scope="scope">
          {{scope.row.tiresFront||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="tiresRear" label="后轮胎规格">
        <template slot-scope="scope">
          {{scope.row.tiresRear||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          {{scope.row.status||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="oilVolume" label="油箱容积">
        <template slot-scope="scope">
          {{scope.row.oilVolume||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="startStop" label="启停">
        <template slot-scope="scope">
          {{scope.row.startStop||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="brandLogo" label="品牌图标">
        <template slot-scope="scope">
          <img :src="scope.row.brandLogo || defaultImg" :onerror="errorImg"
            style="width: 50px;height: 50px;vertical-align: middle;margin: 5px;cursor:pointer;" />
        </template>
      </el-table-column>
      <el-table-column prop="brandEnglish" label="品牌英文首字母">
        <template slot-scope="scope">
          {{scope.row.brandEnglish||'--'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="deleteBaseData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <base-data-mgmt-popup slot="float" :open="open" :itemId="itemId" :tabName="tabName" @close="open = false;itemId = '';"
      @operationSuccess="operationSuccess" :isEdit="isEdit" @createdBaseDataSuccess="createdBaseDataSuccess" :baseInfo="rowBaseInfo">
    </base-data-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/system-setting/base-data-mgmt/baseDataMgmt';
import BaseDataMgmtPopup from './BaseDataMgmtPopup';
import DefaultImg from '@/assets/images/commodity/pic_default_none.png';
import { ImportFile } from '@/components/BizUpload';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'BaseDataMgmt',
  components: {
    BizFlexTable,
    BaseDataMgmtPopup,
    ImportFile
  },
  props: {},
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键字',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      defaultImg: DefaultImg,
      errorImg: 'this.src="' + require('../../../assets/images/commodity/pic_default_fail_100.png') + '"',
      importResult: [],
      rowBaseInfo: {},
      importLoading: false,
      total: 0,
      count: 0,
      t: null,
      percentage: 0,
      stepkey: '',
      loading: false,
      disabled: false,
      isEdit: true,
      open: false,
      itemId: '',
      tabName: 'BaseDataSetting',
      multipleSelection: [],
      tableData: []
    };
  },
  computed: {},
  created() {
    this.refresh();
    this.handleImport();
  },
  mounted() {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      let url = '/admin/brand/importProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.importFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            this.$refs.importFile.uploadingVisible = true;
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
            }
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            console.log(111111);
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      if (this.open !== true) {
        this.loading = true;
      }
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value
      };
      service.getBaseDataList(
        params,
        data => {
          this.tableData = data.carTypeList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取基础数据列表失败', params);
        }
      );
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    // 批量操作-删除
    deleteList() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          let params = {
            ids: ids
          };
          service.deleteBaseData(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除基础数据成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.loading = false;
              if (ErrorData.errorMessage !== '') {
                this.$message.warning(ErrorData.errorMessage);
              }
              console.log('删除基础数据失败', params);
            }
          );
        })
        .catch(() => {});
    },
    // 快捷操作-删除
    deleteBaseData(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          service.deleteBaseData(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除基础数据成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.loading = false;
              if (ErrorData.errorMessage !== '') {
                this.$message.warning(ErrorData.errorMessage);
              }
              console.log('删除基础数据失败', params);
            }
          );
        })
        .catch(() => {});
    },
    // 添加分类
    add() {
      this.open = true;
      this.itemId = '';
      this.tabName = 'BaseDataSetting';
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    rowClick(row) {
      console.log('rowClick:', row.id);
      this.open = true;
      this.rowBaseInfo = row;
      this.itemId = row.id;
      this.tabName = 'BaseDataSetting';
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    operationSuccess() {
      this.refresh();
    },
    createdBaseDataSuccess(baseDataId) {
      this.itemId = baseDataId;
    }
  }
};
</script>

<style lang="scss">
.base-data-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .biz-two-row {
    display: flex;
    flex-wrap: wrap;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
