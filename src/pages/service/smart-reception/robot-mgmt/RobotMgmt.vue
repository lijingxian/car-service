<template>
  <div class="robot-mgmt">
    <biz-flex-table
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :checkable="false"
    >
      <el-table-column prop="name" label="机器人" min-width="50px"></el-table-column>
      <el-table-column label="屏保">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <div v-for="(media,index) in scope.row.operationMedia" :key="index" style="margin-left:5px">
              <img :src="media.path" height="100px" style="padding-bottom:10px" />
            </div>
            <!-- {{media.path}} -->
          </div>
        </div>
      </el-table-column>
      <el-table-column label="展示屏宣传">
        <div slot-scope="scope">
          <div v-for="(media,index) in scope.row.showMedia" :key="index" class="biz-customcol">
            {{media.name}}
            <!-- <video :src="media.path" width="100px" height="100px" style="padding-bottom:10px" v-if="media.path.indexOf('/media')!==-1" controls /> -->
          </div>
        </div>
      </el-table-column>
      <el-table-column label="广告屏展示">
        <div slot-scope="scope">
          <div v-for="(media,index) in scope.row.adMedia" :key="index">
            <img :src="media.promotionData&&media.promotionData.images?media.promotionData.images[0]:''" height="100px" style="padding-bottom:10px" />
            <img :src="media.marketingData&&media.marketingData.images?media.marketingData.images:''" height="100px" style="padding-bottom:10px" />
            <img :src="media.productData&&media.productData.image?media.productData.image:''" height="100px" style="padding-bottom:10px" />
            <img :src="media.path?media.path:''" height="100px" style="padding-bottom:10px" />
          </div>
        </div>
      </el-table-column>
      <!-- <el-table-column label="服务项配置">
      </el-table-column>-->
      <el-table-column prop="electric" label="当前电量" min-width="30px"></el-table-column>
      <!-- <el-table-column prop="position" label="当前位置">
      </el-table-column>
      <el-table-column label="当前状态">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{getState(scope.row.state)}}
          </div>
        </div>
      </el-table-column>-->
      <el-table-column width="100" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="robotCommand(scope.row,'charge')">充电</el-button>
            <el-button type="text" size="mini" @click.stop="robotCommand(scope.row,'receive')">接待</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="基本信息" name="info">
        <RobotBaseInfo :itemId="itemId" @created="refresh"></RobotBaseInfo>
      </el-tab-pane>
      <el-tab-pane label="宣传屏" name="propagateScreenSetting">
        <PropagateScreenSetting :itemId="itemId" @created="refresh"></PropagateScreenSetting>
      </el-tab-pane>
      <el-tab-pane label="广告屏" name="posterScreenSetting">
        <PosterScreenSetting :itemId="itemId" @created="refresh"></PosterScreenSetting>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import RobotBaseInfo from './RobotBaseInfo';
import PropagateScreenSetting from './PropagateScreenSetting';
import PosterScreenSetting from './PosterScreenSetting';
export default {
  name: 'RobotMgmt',
  data() {
    return {
      tabName: 'info',
      itemId: '',
      defaultTab: '0',
      loading: false,
      open: false,
      selections: [],
      operations: [],
      filters: [
        {
          type: 'daterange',
          label: '日期区间：',
          value: ['2011-11-11', '2012-12-12']
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键字检索',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    RobotBaseInfo,
    PropagateScreenSetting,
    PosterScreenSetting
  },
  created() {
    this.getList();
    this.getFormatDate();
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      this.getList();
    }
  },
  methods: {
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[0].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(dt.getDate() - 30);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[0].value[0] = halfYearAgo();
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    rowClick(model, e, column) {
      this.itemId = model.id;
      this.tabName = 'info';
      this.open = true;
    },
    getState(state) {
      if (state === '0') {
        return '关机';
      } else if (state === '1') {
        return '充电';
      } else if (state === '2') {
        return '巡逻';
      } else if (state === '3') {
        return '服务';
      }
    },
    getList() {
      this.loading = true;
      http
        .get(customerService.smartReception.getRobotInfoList, {
          searchValue: this.filters[1].value,
          beginTime: this.filters[0].value[0],
          endTime: this.filters[0].value[1],
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    robotCommand(row, cmd) {
      this.$confirm('是否确认执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          http
            .get(customerService.smartReception.robotCommand, {
              id: row.id,
              cmd: cmd
            })
            .then(data => {
              this.$message.success('操作成功');
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) {
                this.$message.warning(errData.errorMessage);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    filterDataChange(filters) {
      this.refresh();
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
.robot-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
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
