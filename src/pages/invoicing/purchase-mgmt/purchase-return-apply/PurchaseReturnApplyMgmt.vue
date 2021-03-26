<template>
  <div class="purchase-return-apply-mgmt">
    <biz-flex-table
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="purchase-apply-mgmt-tabel"
    >
      <el-table-column label="编号" prop="sn" min-width="125"></el-table-column>
      <el-table-column label="商品信息" width="400">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between">
            <div style="width:100%;margin-right:30px">
              <div v-for="productItem in scope.row.itemDatas" :key="productItem.id" class="product-info">
                <div class="wrapper">
                  <div class="titleClass" :title="productItem.productName">{{productItem.productName}}</div>
                </div>
                <div class="info-bottom">
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*{{productItem.amount}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="供应商信息" prop="relatePartnerName"></el-table-column>
      <el-table-column label="单据总金额">
        <template slot-scope="scope">￥{{scope.row.totalFee}}</template>
      </el-table-column>
      <el-table-column prop="applierName" label="申请人"></el-table-column>
      <el-table-column prop="state" label="申请状态" :formatter="getStatus"></el-table-column>
      <el-table-column prop="date" label="操作" width="60">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button
              type="text"
              size="mini"
              v-if="(scope.row.state==='1' || scope.row.state==='2') && scope.row.audit==='1'"
              @click.stop="statusChange(scope.row,'1')"
            >通过</el-button>
            <el-button type="text" size="mini" v-if="scope.row.state==='0'" @click.stop="statusChange(scope.row,'0')">提交</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(scope.row.state==='1' || scope.row.state==='2') && scope.row.audit==='1'"
              @click.stop="statusChange(scope.row,'2')"
            >驳回</el-button>
            <el-button type="text" size="mini" v-if="scope.row.state !== '3' || scope.row.state !== '2'" @click.stop="deleteReturnApply($event,scope.row)">删除</el-button>
            <el-button type="text" size="mini" @click.stop="printReturnApply(scope.row)">打印</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <base-info :itemId="itemId" :isEdit="isEdit" ref="baseInfo" @setBaseItems="setBaseItems" @operationSuccess="operationSuccess"></base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo" v-if="isCreate">
        <product-info
          :itemId="itemId"
          :isEdit="isEdit"
          ref="productinfo"
          :returnId="returnId"
          @setOrderItems="setOrderItems"
          @operationSuccess="operationSuccess"
        ></product-info>
      </el-tab-pane>
      <el-tab-pane label="关联单据" name="orderinfo" v-if="isCreate">
        <order-info :itemId="itemId" :isEdit="isEdit" ref="orderinfo" @operationSuccess="operationSuccess"></order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog :visible.sync="dialogTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">供应商：{{form.relatePartnerName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">优惠率(%)：{{form.discountRate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">优惠金额(元)：{{form.discontFee}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">总金额(元)：{{form.totalFee}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">申请人：{{form.applierName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">状态：{{form.state}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remark}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="productName" label="商品">
              <template slot-scope="scope">{{scope.row.productName}}</template>
            </el-table-column>
            <el-table-column property="price" label="退货单价(元)">
              <template slot-scope="scope">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="amount" label="退货数量"></el-table-column>
            <el-table-column property="totalFee" label="金额(元)">
              <template slot-scope="scope">￥{{scope.row.totalFee}}</template>
            </el-table-column>
            <el-table-column property="depotName" label="仓库"></el-table-column>
          </el-table>
        </div>
      </vue-easy-print>
    </el-dialog>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import OrderInfo from './OrderInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';

export default {
  name: 'PurchaseReturnApplyMgmtList',
  data() {
    return {
      tabName: 'info',
      itemId: '',
      title: '',
      isEdit: true,
      isCreate: false,
      returnId: '',
      form: {},
      loading: false,
      open: false,
      dialogTableVisible: false,
      selections: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'export',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '供应商',
          name: 'supplier',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '申请人',
          name: 'people',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '申请状态',
          name: 'state',
          value: '',
          options: []
        },
        {
          type: 'daterange',
          label: '创建日期',
          name: 'publishDate',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入采购退货申请单编号',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      gridData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    vueEasyPrint,
    ProductInfo,
    OrderInfo
  },
  created() {
    this.getList();
    this.queryFilters();
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    operationSuccess(val) {
      this.$nextTick(() => {
        if (val) {
          this.itemId = String(val);
        }
      });
      this.refresh();
    },
    setOrderItems(val) {
      this.$refs.baseInfo.setOrderItems(val);
    },
    setBaseItems(val) {
      this.isCreate = true;
      this.tabName = 'productinfo';
      this.$nextTick(() => {
        this.returnId = String(val);
      });
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    statusChange(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          shopId: window.top.SHOP_ID || '',
          id: model.id,
          actionType: state
        };
        http
          .get(urls.invoicing.purchaseReturnApplyMgmt.state, params)
          .then(data => {
            this.$message.success('操作成功！');
            this.refresh();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
    },
    deleteReturnApply(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },
    // 删除
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete(urls.invoicing.purchaseReturnApplyMgmt.shopPurchaseReturnApply, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    printReturnApply(row) {
      let params = {
        id: row.id
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.print, params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = '采购退货申请单';
          this.form = data.data;
          if (this.form.state === '0') {
            this.form.state = '已创建';
          } else if (this.form.state === '1') {
            this.form.state = '已提交';
          } else if (this.form.state === '2') {
            this.form.state = '审核中';
          } else if (this.form.state === '3') {
            this.form.state = '已通过';
          } else if (this.form.state === '4') {
            this.form.state = '已驳回';
          } else {
            this.form.state = '';
          }
          this.gridData = data.data.itemDatas;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    print() {
      this.$refs.easyPrint.print();
    },
    export() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[4].value,
        supplierId: this.filters[0].value,
        applierId: this.filters[1].value,
        applyState: this.filters[2].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.export, params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = `${urls.invoicing.purchaseReturnApplyMgmt.export}?` + paramsArr.join('&');
              // 异步弹出窗口会被Chrome拦截
              // window.open(linkedUrl);
              location.href = linkedUrl;
            } else {
              if (data === '没有符合条件的数据') {
                this.$message.warning('没有符合条件的数据');
              } else {
                this.$message.warning(data.errorMessage);
                console.log('ERR_EXPORT: ', data);
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
          }
        );
    },
    add() {
      this.tabName = 'info';
      this.open = true;
      this.isCreate = false;
      this.itemId = '';
      this.isEdit = true;
    },
    rowClick(model, e, column) {
      this.tabName = 'info';
      this.open = true;
      this.isCreate = true;
      this.$nextTick(() => {
        this.itemId = model.id;
      });
      if (model.state === '0') {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[4].value,
        supplierId: this.filters[0].value,
        applierId: this.filters[1].value,
        applyState: this.filters[2].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.shopPurchaseReturnApplyList, params)
        .then(data => {
          console.log(data);
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    queryFilters() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.queryInfos, params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.supplierList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
          this.filters[1].options = [{ label: '全部', value: '' }].concat(
            data.applierList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.stateList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '已创建';
        case '1':
          return '已提交';
        case '2':
          return '审核中';
        case '3':
          return '已通过';
        case '4':
          return '已驳回';
        default:
          return '--';
      }
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    filterDataChange(filters) {
      this.filters = filters;
      this.pagination.currentPage = 1;
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
.grid18 {
  height: 20px;
}
.close-order-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 260px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.d-p-wrap {
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
}
.purchase-apply-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
}
.purchase-return-apply-mgmt {
  .biz-popup .popup-content {
    width: 600px;
  }
  .tel-style {
    color: #ff7300;
    cursor: pointer;
  }
  .operate-container {
    margin-left: 10px;
  }
  .row {
    padding: 10px 0px;
  }
  .row-top {
    padding: 10px 0px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-date-editor {
    width: 210px;
  }
  .product-info {
    margin: 5px 0px;
    width: 100%;
    display: flex;
    .wrapper {
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 250px;
        white-space: nowrap;
      }
    }
  }
  .price-info {
    width: 120px;
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .titleMember {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
