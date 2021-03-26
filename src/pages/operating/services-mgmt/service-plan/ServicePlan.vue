<template>
  <biz-grid class="services-mgmt">
    <biz-header slot="top" :filters="filters" :operations="operations" @operate="operate" :views="views" @on-switch="onSwitch"
      @filter-data-change="filterDataChange">
    </biz-header>
    <!-- <biz-flex-table ref="table" :operations="operations" @operate="operate" @filter-data-change="filterDataChange" :filters="filters"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @active-item-change="activeItemChange"
      @cascader-change="cascaderChange">
      <el-table-column label="服务名称">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.businessServiceType==='0'?scope.row.businessService.name:scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="price" label="价格">
      </el-table-column>
      <el-table-column prop="" label="是否上架">
        <div slot-scope="scope" v-if="scope.row.businessServiceType==='0'">
          <div class="biz-customcol">{{scope.row.isMarketable==='1'?'√':'×'}}</div>
        </div>
      </el-table-column>
      <el-table-column width="130" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="rowDeleteClickHandler($event, scope.row)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table> -->
    <table-view :data="tableData" v-show="views[1].actived" @row-click="rowClick" ref="tableView">
      <el-table-column label="服务" prop="name">
        <span slot-scope="scope">
          <div class="biz-customcol">{{scope.row.businessServiceType==='0'?scope.row.businessService.name:scope.row.name}}</div>
        </span>
      </el-table-column>
      <el-table-column label="价格" prop="price">
        <span slot-scope="scope">
          ￥ {{ scope.row.price }}
        </span>
      </el-table-column>
      <el-table-column label="状态" prop="isMarketable">
        <span slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.isMarketable | formatState }}</span>
        </span>
      </el-table-column>
      <el-table-column label="子服务" prop="services">
        <span slot-scope="scope">
          <div v-for="service in scope.row.services" :key="service.id">
            {{ service.name}}
          </div>
        </span>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="moveUp(scope.row)">上移</el-button>
            <el-button type="text" size="mini" @click.stop="moveDown(scope.row)">下移</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </table-view>
    <card-view v-show="views[0].actived" :data="tableData" @click="rowClick" ref="cardView"></card-view>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
    <!-- 侧边弹出栏 -->
    <ServicesMgmtPoput slot="float" :open="open" :id="serviceId" :classfiy="classfiy" @close="open = false;" @operationSuccess="refresh"
      :categoryType="categoryType" @createdServicesSuccess="createdServicesSuccess"></ServicesMgmtPoput>
    <import-file :tableData="importResult" ref="imFile" :importLoading="importLoading" :successCount="successCount" :failCount="failCount"
      @on-import="handleImport" title="请上传按照模板格式填写好的Excle文件" style="display: none;">
      <el-table-column label="编号" prop="serialNo"></el-table-column>
      <!-- <el-table-column label="所属平台" prop="platform"></el-table-column>
      <el-table-column label="服务名称" prop="name"></el-table-column> -->
      <el-table-column label="信息" prop="message">
      </el-table-column>
    </import-file>
    <biz-popup-tabs :open="openSpecification" v-model="tabSelection" @close="openSpecification = false">
      <el-tab-pane label="功能规格" name="0">
        <ServiceSpecification :id="serviceId"></ServiceSpecification>
      </el-tab-pane>
      <el-tab-pane label="短信规格" name="1">
        <SmsSpecification :id="serviceId"></SmsSpecification>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openDomain" v-model="tabName" @close="openDomain = false">
      <el-tab-pane label="领域" name="2">
        <DomainSetting :id="serviceId"></DomainSetting>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { mapGetters } from 'vuex';
import service from '@/service/services-mgmt/services-mgmt/servicesMgmt';
import ServicesMgmtPoput from './ServicesMgmtPopup';
import { BizPopupTabs } from '@/components/BizPopup';
import { ImportFile } from '@/components/BizUpload';
import ServiceSpecification from '@/pages/operating/services-mgmt/services-specification/ServiceSpecification';
import SmsSpecification from '@/pages/operating/services-mgmt/services-specification/SmsSpecification';
import DomainSetting from './DomainSetting';
import TableView from './TableView';
import CardView from './CardView';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'ServicesMgmt',
  components: {
    BizHeader,
    BizPagination,
    TableView,
    CardView,
    ImportFile,
    ServicesMgmtPoput,
    BizPopupTabs,
    ServiceSpecification,
    SmsSpecification,
    DomainSetting,
    BizGrid
  },
  filters: {
    formatState(value) {
      const stateList = ['已下架', '已上架'];
      return stateList[value];
    }
  },
  data() {
    return {
      refreshSign: true,
      serviceId: '',
      open: false,
      loading: false,
      openSpecification: false,
      tabSelection: '0',
      tabName: '2',
      categoryType: '',
      classfiy: '',
      serviceClassifyName: '',
      selections: [],
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-qiapianshitu',
          name: 'card',
          title: '卡片视图'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '列表视图'
        }
      ],
      filters: [
        {
          type: 'select',
          label: '状态',
          value: '',
          options: [{ value: '', label: '全部' }, { value: '1', label: '已上架' }, { value: '0', label: '已下架' }]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入服务名称',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '规格设置',
          name: 'setting',
          type: ''
        }
      ],
      tableData: [],
      multipleSelection: [],
      // 上传Start
      importResult: [],
      importLoading: false,
      openDomain: false,
      successCount: 0,
      failCount: 0,
      // 上传End
      serviceDatas: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  created() {
    this.getUser();
    this.refresh();
  },
  mounted() {},
  watch: {},
  mixins: [ColumnsMixin],
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    onSwitch(name) {
      this.views.forEach(view => {
        if (view.name === name) {
          view.actived = true;
        } else {
          view.actived = false;
        }
      });
    },
    stateColor(row) {
      if (row.isMarketable === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    setting() {
      this.openSpecification = true;
    },
    domainSetting() {
      this.openDomain = true;
    },
    add() {
      this.serviceId = '';
      this.categoryType = '';
      this.open = true;
    },
    createdServicesSuccess(id, type) {
      this.serviceId = id;
      this.categoryType = type;
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        state: this.filters[0].value,
        serviceClassifyName: this.serviceClassifyName,
        searchValue: this.filters[1].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/solution/solutionPage.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          // console.log(data);
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    getPlatform(row) {
      switch (row.businessService.platform) {
        case 'share':
          return '分享平台';
        case 'ecommerce':
          return '电商平台';
        case 'auto_aftermarket':
          return '汽车后服务平台';
        default:
          break;
      }
    },
    getType(row) {
      switch (row.businessService.type) {
        case 'platform':
          return '平台服务';
        case 'shop':
          return '店铺服务';
        default:
          break;
      }
    },
    getFree(row) {
      switch (row.isFree) {
        case '0':
          return '否';
        case '1':
          return '是';
        default:
          break;
      }
    },
    getDefault(row) {
      switch (row.businessService.isDefault) {
        case '0':
          return '否';
        case '1':
          return '是';
        default:
          break;
      }
    },
    switchStatus(ids, state) {
      service.updateBusinessProductState(
        {
          ids: ids,
          marketable: state
        },
        data => {
          this.$message.success('设置成功');
          this.refresh();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    rowDeleteClickHandler(e, model) {
      this.deleteRule([model.id]);
    },
    rowStartClickHandler(e, model) {
      this.switchStatus([model.id], 'true');
    },
    rowStopClickHandler(e, model) {
      this.switchStatus([model.id], 'false');
    },
    start() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
        this.switchStatus(ids, 'false');
      } else {
        this.$message('请选择一个服务进行启用');
      }
    },
    stop() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
        this.switchStatus(ids, 'true');
      } else {
        this.$message('请选择一个服务进行停用');
      }
    },
    deleteList() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个服务进行删除');
      }
    },
    moveUp(row) {
      this.loading = true;
      let params = {
        id: row.businessService.id,
        operation: 'up'
      };
      http
        .post('/admin/solution/solutionSort.jhtml', params)
        .then(data => {
          this.getList();
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    moveDown(row) {
      this.loading = true;
      let params = {
        id: row.businessService.id,
        operation: 'down'
      };
      http
        .post('/admin/solution/solutionSort.jhtml', params)
        .then(data => {
          this.getList();
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    // 快捷操作-删除
    deleteRule(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete('/admin/solution/solution.jhtml', { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.filterDataChange();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage || '操作出现错误');
          });
      });
    },
    import() {
      this.$confirm('是否确认导入?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs.imFile.$children[0].$refs['upload-inner'].$refs.input.click();
        })
        .catch(() => {});
    },
    handleImport(url) {
      this.importLoading = true;
      service.importBusinessProduct(
        {
          filePath: url
        },
        data => {
          this.importLoading = false;
          this.importResult = data.data;
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    rowClick(row) {
      this.serviceId = row.id;
      this.classfiy = row.businessServiceClassifyPathId;
      this.categoryType = row.businessServiceType;
      this.open = true;
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSelectionChange(val) {
      this.operations[2].disabled = true;
      if (val.length > 0) {
        this.operations[2].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.services-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .message-mgmt-header {
    position: absolute;
    top: 5px;
    left: 10px;
    font-size: 14px;
    z-index: 1;
  }
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
}
</style>
