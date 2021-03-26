<template>
  <biz-grid class="service-handbook-sys-item" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :model="formModel" label-width="100px" size="small" :rules="rules" :inline-message="true">
      <el-form-item label="品牌" prop="brandId">
        <el-select v-model="formModel.brandId" placeholder="请选择" filterable style="width: 100%;" @change="handleBrandChange">
          <el-option v-for="(item,index) in brandList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列" prop="seriesId">
        <el-select v-model="formModel.seriesId" placeholder="请选择" filterable style="width: 100%;" @change="handleSeriesChange">
          <el-option v-for="(item,index) in seriesList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <biz-list ref="table" :height="heightList" :tableData="modeList" @handleSelectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="name" label="车型">
      </el-table-column>
    </biz-list>
    <biz-header :operations="operationsList" @operate="operate">
    </biz-header>
    <biz-list ref="list" :height="height" :tableData="tableData" @handleSelectionChange="selectionChange" v-if="tableData.length>0">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="mileage" label="保养里程(km)" width="130px">
        <div slot-scope="scope">
          <el-input-number v-model="scope.row.mileage" placeholder="" size="mini" controls-position="right" :min="0"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column prop="cost" label="推荐价格" width="130px">
        <div slot-scope="scope">
          <el-input-number v-model="scope.row.cost" placeholder="" size="mini" controls-position="right" :min="0"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column prop="name" v-if="tableData[0].item" :label="item.name" v-for="(item,index) in tableData[0].item" :key="index"
        min-width="50px">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <div v-if="item.name===booklets.name" v-for="(booklets,index) in scope.row.item" :key="index">
              <el-checkbox v-model="booklets.ischecked" true-label='1' false-label='0'></el-checkbox>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="name" v-if="tableData[0] && tableData[0].productList" :label="item.name" v-for="(item,index) in tableData[0].productList"
        :key="index" min-width="50px">
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
import { BizHeader, BizList } from '@/components/BizTable';
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
      height: '500',
      heightList: '300',
      mode: 100,
      loading: false,
      serviceList: [],
      multipleSelection: [],
      selections: [],
      brandList: [],
      seriesList: [],
      modeList: [],
      itemList: [],
      tableData: [],
      carTypes: [],
      formModel: {},
      rules: {
        brandId: [{ required: true, message: '请选择品牌', trigger: ['blur'] }],
        seriesId: [{ required: true, message: '请选择系列', trigger: ['blur'] }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      operationsList: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: 'primary'
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
  components: { BizGrid, BizSaveButton, BizList, BizHeader },
  created() {
    this.queryBrandList();
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 282);
  },
  updated() {
    if (this.itemId) {
      this.updateSelection();
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    setDefaultModel() {
      this.tableData = this.getDefaultList();
      this.modeList = [];
      this.formModel = {
        brand: '',
        brandId: '',
        id: '',
        carType: '',
        carTypeId: [],
        name: '',
        series: '',
        seriesId: '',
        booklets: this.tableData
      };
    },
    add() {
      this.tableData.unshift({
        brand: '',
        brandId: '',
        cost: '',
        id: '',
        manufacturer: '',
        mileage: '',
        series: '',
        seriesId: '',
        time: '',
        item: [
          {
            id: '',
            ischecked: '0',
            name: '机油'
          },
          {
            id: '',
            ischecked: '0',
            name: '机油滤清'
          },
          {
            id: '',
            ischecked: '0',
            name: '汽油添加剂'
          },
          {
            id: '',
            ischecked: '0',
            name: '空气滤清'
          },
          {
            id: '',
            ischecked: '0',
            name: '空调滤清'
          },
          {
            id: '',
            ischecked: '0',
            name: '制动液'
          },
          {
            id: '',
            ischecked: '0',
            name: '变速箱油'
          },
          {
            id: '',
            ischecked: '0',
            name: '燃油滤清'
          },
          {
            id: '',
            ischecked: '0',
            name: '火花塞(整套)'
          },
          {
            id: '',
            ischecked: '0',
            name: '防冻液'
          }
        ]
      });
    },
    delete() {
      for (let i = 0; i < this.selections.length; i++) {
        if (this.tableData.indexOf(this.selections[i]) !== -1) {
          this.tableData.splice(this.tableData.indexOf(this.selections[i]), 1);
        }
      }
    },
    selectionChange(val) {
      this.selections = val;
    },
    getDefaultList() {
      return [
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 5000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 10000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 20000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 30000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '1',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '1',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 40000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 50000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 60000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '1',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '1',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '1',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '1',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 70000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 80000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 90000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '1',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '1',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '1',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        },
        {
          brand: '',
          brandId: '',
          cost: '',
          id: '',
          manufacturer: '',
          mileage: 100000,
          series: '',
          seriesId: '',
          time: '',
          item: [
            {
              id: '',
              ischecked: '1',
              name: '机油'
            },
            {
              id: '',
              ischecked: '1',
              name: '机油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '汽油添加剂'
            },
            {
              id: '',
              ischecked: '0',
              name: '空气滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '空调滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '制动液'
            },
            {
              id: '',
              ischecked: '0',
              name: '变速箱油'
            },
            {
              id: '',
              ischecked: '0',
              name: '燃油滤清'
            },
            {
              id: '',
              ischecked: '0',
              name: '火花塞(整套)'
            },
            {
              id: '',
              ischecked: '0',
              name: '防冻液'
            }
          ]
        }
      ];
    },
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          // hash 哈希
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formModel.carTypeId = [];
          let name = [];
          this.multipleSelection.map(item => {
            this.formModel.carTypeId.push(item.id);
            name.push(item.name);
          });
          this.formModel.name = this.formModel.brand + ' ' + this.formModel.series + ' ' + name.join(' ');
          if (this.formModel.carTypeId.length === 0) {
            this.$message.warning('请选择指定车型');
            return;
          }
          if (this.formModel.booklets.length === 0) {
            this.$message.warning('请添加保养手册');
            return;
          }
          let mileage = [];
          this.tableData.map(item => {
            mileage.push(item.mileage);
          });
          if (this.isRepeat(mileage)) {
            this.$message.warning('存在重复的里程');
            return;
          }
          if (this.itemId) {
            this.sysUpdate();
          } else {
            this.sysCreate();
          }
        }
      });
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
    sysCreate() {
      this.loading = true;
      serviceProjectService.maintainBookletCreate(
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
      serviceProjectService.baseData(
        {
          type: '0'
        },
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
      serviceProjectService.baseData(
        {
          type: '1',
          brandId: val
        },
        data => {
          this.seriesList = data.dataList;
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
        {
          type: '2',
          brandId: this.formModel.brandId,
          seriesId: val
        },
        data => {
          this.modeList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    updateSelection() {
      this.modeList.forEach(item => {
        if (this.carTypes.includes(parseInt(item.id))) {
          this.$refs.table.toggleRowSelection(item, true);
        } else {
          this.$refs.table.toggleRowSelection(item, false);
        }
      });
    },
    query() {
      this.loading = true;
      serviceProjectService.getServiceHandbook(
        { id: this.itemId },
        data => {
          this.loading = false;
          this.formModel = data.result;
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
    querySys() {
      this.loading = true;
      serviceProjectService.maintainBookletQuery(
        { id: this.itemId },
        data => {
          this.formModel = data.result;
          this.formModel.brandId = String(data.result.brandId);
          this.formModel.seriesId = String(data.result.seriesId);
          this.carTypes = data.result.carTypeId;
          this.loading = false;
          this.tableData = data.result.booklets;
          if (data.result.seriesId) {
            this.querySeriesList(data.result.brandId);
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
    handleBrandChange(val) {
      this.$refs.form.clearValidate('brandId');
      this.querySeriesList(val);
      this.brandList.map(item => {
        if (item.id === val) {
          this.formModel.brand = item.name;
        }
      });
      this.$set(this.formModel, 'seriesId', '');
    },
    handleSeriesChange(val) {
      this.$refs.form.clearValidate('seriesId');
      this.modeList = [];
      this.seriesList.map(item => {
        if (item.id === val) {
          this.formModel.series = item.name;
        }
      });
      this.queryTypeList(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.service-handbook-sys-item {
  .biz-save-button {
    justify-content: flex-start;
  }
  // margin-top: 10px;
  .el-form {
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
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
