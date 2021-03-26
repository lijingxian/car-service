<template>
  <biz-grid class="service-handbook-item" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <biz-list ref="list" :height="heightList" :tableData="tableData" @handleSelectionChange="handleSelectionChange"
      v-if="tableData.length>0">
      <el-table-column prop="mileage" label="保养里程(km)" width="130px">
        <div slot-scope="scope">
          <el-input-number v-model="scope.row.mileage" placeholder="" size="mini" controls-position="right" :min="0">
          </el-input-number>
        </div>
      </el-table-column>
      <el-table-column prop="cost" label="推荐价格" width="130px">
        <div slot-scope="scope">
          <el-input-number v-model="scope.row.cost" placeholder="" size="mini" controls-position="right" :min="0">
          </el-input-number>
        </div>
      </el-table-column>
      <el-table-column prop="name" v-if="tableData[0].item" :label="item.name" v-for="(item,index) in tableData[0].item"
        :key="index" min-width="50px">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <div v-if="item.id===booklets.id" v-for="(booklets,index) in scope.row.item" :key="index">
              <el-checkbox v-model="booklets.ischecked" true-label='1' false-label='0'></el-checkbox>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="name" v-if="tableData[0] && tableData[0].productList" :label="item.name"
        v-for="(item,index) in tableData[0].productList" :key="index" min-width="50px">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <div v-if="item.id===booklets.id" v-for="(booklets,index) in scope.row.productList" :key="index">
              <el-checkbox v-model="booklets.ischecked" true-label='1' false-label='0'></el-checkbox>
            </div>
          </div>
        </div>
      </el-table-column>
    </biz-list>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizList } from '@/components/BizTable';
import serviceProjectService from '@/service/maintenance/serviceProject';
import { mapGetters } from 'vuex';
export default {
  name: 'ServiceHandbookItem',
  props: {
    itemId: {
      type: String
    }
  },
  data() {
    return {
      isCreated: true,
      height: '900',
      heightList: '100%',
      mode: 100,
      loading: false,
      carTypes: [],
      serviceList: [],
      multipleSelection: [],
      brandList: [],
      seriesList: [],
      modeList: [],
      itemList: [],
      tableData: [],
      formModel: {},
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:aftersale.booklet.edit']
        }
      ]
    };
  },
  watch: {
    itemId(nVal, oVal) {
      if (this.itemId) {
        if (this.getUser().roleLevel === 'shop') {
          this.query();
        } else {
          this.querySys();
        }
      }
    }
  },
  components: { BizGrid, BizSaveButton, BizList },
  created() {
    this.queryBrandList();
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 282);
  },
  // updated() {
  //   this.updateSelection();
  // },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    selectAble(row) {
      return false;
    },
    // updateSelection() {
    //   this.modeList.forEach(item => {
    //     if (this.carTypes.includes(parseInt(item.id))) {
    //       this.$refs.table.toggleRowSelection(item, true);
    //     } else {
    //       this.$refs.table.toggleRowSelection(item, false);
    //     }
    //   });
    // },
    save() {
      if (this.getUser().roleLevel === 'shop') {
        this.shopUpdate();
      } else {
        this.sysUpdate();
      }
    },
    shopUpdate() {
      this.loading = true;
      serviceProjectService.updateServiceHandbook(
        this.formModel,
        data => {
          this.$message.success('保存成功');
          this.loading = false;
          this.$emit('created');
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          this.$message.error(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    },
    sysUpdate() {
      this.loading = true;
      serviceProjectService.maintainBookletUpdate(
        this.formModel,
        data => {
          this.$message.success('保存成功');
          this.loading = false;
          this.$emit('created');
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          this.$message.error(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    },
    queryBrandList() {
      serviceProjectService.queryBrandList(
        {},
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(val) {
      serviceProjectService.querySeriesList(
        { brand: val },
        data => {
          this.seriesList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(val) {
      serviceProjectService.baseData(
        { type: '2', seriesId: val, brandId: this.formModel.brandId },
        data => {
          this.modeList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    query() {
      this.loading = true;
      serviceProjectService.getServiceHandbook(
        { id: this.itemId },
        data => {
          this.loading = false;
          this.formModel = data.result;
          this.tableData = data.result.booklets;
          this.carTypes = data.result.carTypeId;
          if (this.carTypes.length === 1) {
            this.modeList = [{ id: this.carTypes[0], name: data.result.carType }];
          } else if (this.carTypes.length === 2) {
            this.modeList = [
              { id: this.carTypes[0], name: data.result.carType.split(',')[0] },
              { id: this.carTypes[1], name: data.result.carType.split(',')[1] }
            ];
          } else {
            this.queryTypeList(data.result.seriesId);
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          console.log('code错误');
        }
      );
    },
    querySys() {
      this.loading = true;
      serviceProjectService.maintainBookletQuery(
        { id: this.itemId },
        data => {
          this.formModel = data.result;
          this.loading = false;
          this.tableData = data.result.booklets;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          console.log('code错误');
        }
      );
    },
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.$set(this.formModel, 'series', '');
      this.$set(this.formModel, 'type', '');
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.$set(this.formModel, 'type', '');
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.service-handbook-item {
  // margin-top: 10px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
  }
  thead .el-checkbox {
    display: none;
  }
  .biz-list {
    margin: 0 5px;
  }
  .el-input-number--small {
    width: 100%;
  }
  .biz-customcol {
    flex-wrap: wrap;
  }
  .el-input-number--mini {
    width: 110px;
  }
}
</style>
