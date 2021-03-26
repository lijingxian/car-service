<template>
  <biz-grid class="service-handbook-product" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <biz-list ref="table" :height="heightList" :tableData="handelModeList" @handleSelectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="name" label="商品">
      </el-table-column>
    </biz-list>
    <biz-dialog-selector
      title="选择商品"
      :visibility.sync="showDialog"
      :tableData="giftList"
      :selectionKeys="selectedGiftIds"
      class="handbook-product-dailog"
      @confirmed="confirmedProduct"
      @selectionChange="selectionChange"
    >
      <el-table-column property="name" label="商品">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizList } from '@/components/BizTable';
import serviceProjectService from '@/service/maintenance/serviceProject';
import { mapGetters } from 'vuex';
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
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
      heightList: '100%',
      showDialog: false,
      mode: 100,
      loading: false,
      carTypes: [],
      serviceList: [],
      multipleSelection: [],
      selectionList: [],
      brandList: [],
      seriesList: [],
      handelModeList: [],
      giftList: [],
      modeList: [],
      itemList: [],
      tableData: [],
      selectedGiftList: [],
      selectedGiftIds: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'delete',
          type: ''
        },
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
  components: { BizGrid, BizSaveButton, BizList, BizDialogSelector },
  computed: {},
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
    delete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一条数据');
        return false;
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let ids = [];
            for (const iterator of this.multipleSelection) {
              ids.push(iterator.id);
            }
            let params = {
              carTypeId: ids,
              id: this.itemId
            };
            this.loading = true;
            http
              .post('/admin/appointmentBooklet/deleteCarType.jhtml', params)
              .then(data => {
                this.$message.success('操作成功');
                this.$emit('created');
                this.query();
              })
              .catch(errData => {
                this.$message.warning(errData.errorMessage);
              });
          });
      }
    },
    // updateSelection() {
    //   this.handelModeList.forEach(item => {
    //     this.selectionList.forEach(list => {
    //       if (item.id === list.id) {
    //         this.$refs.table.toggleRowSelection(item, true);
    //       }
    //     });
    //   });
    // },
    save() {
      this.productUpdate();
    },
    add() {
      this.query();
      this.showDialog = true;
    },
    confirmedProduct(val) {
      this.handelModeList = [];
      this.modeList.forEach(item => {
        this.selectionList.forEach(list => {
          if (item.id === list.id) {
            item.isSelect = true;
          }
        });
        if (item.isSelect === true) {
          this.handelModeList.push(item);
        }
      });
    },
    selectionChange(selections) {
      this.selectionList = [];
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    productUpdate() {
      this.loading = true;
      let ids = [];
      for (const iterator of this.handelModeList) {
        ids.push(iterator.id);
      }
      let params = {
        carTypeId: ids,
        id: this.itemId
      };
      this.loading = true;
      http
        .post('/admin/appointmentBooklet/addCarType.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.$emit('created');
          this.query();
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
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
      this.handelModeList = [];
      serviceProjectService.baseData(
        { type: '2', seriesId: val, brandId: this.formModel.brandId },
        data => {
          this.modeList = data.dataList ? data.dataList : [];
          this.modeList.forEach(item => {
            if (this.carTypes.includes(parseInt(item.id))) {
              item.isSelect = true;
            } else {
              item.isSelect = false;
            }
          });
          this.modeList.forEach(item => {
            if (item.isSelect === true) {
              this.handelModeList.push(item);
            }
            if (item.isSelect === false) {
              this.giftList.push(item);
            }
          });
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
      this.giftList = [];
      this.selectionList = [];
      serviceProjectService.getServiceHandbook(
        { id: this.itemId },
        data => {
          this.loading = false;
          this.formModel = data.result;
          this.tableData = data.result.booklets;
          this.carTypes = data.result.carTypeId;
          if (this.carTypes.length === 1) {
            this.handelModeList = [];
            this.modeList = [{ id: this.carTypes[0], name: data.result.carType, isSelect: true }];
            this.handelModeList = this.modeList;
          } else if (this.carTypes.length === 2) {
            this.handelModeList = [];
            this.modeList = [
              { id: this.carTypes[0], name: data.result.carType.split(',')[0], isSelect: true },
              { id: this.carTypes[1], name: data.result.carType.split(',')[1], isSelect: true }
            ];
            this.handelModeList = this.modeList;
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
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.handbook-product-dailog {
  .biz-pagination {
    display: none;
  }
}
.service-handbook-product {
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
