<template>
  <biz-grid class="bar-basic-info">
    <biz-header slot="top" :operations="operations" @operate="operate">
    </biz-header>
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :rules="rules"
      :disabled="form.state==='1'" :inline-message="true">
      <el-form-item label="编号" prop="sn">
        <el-input :value="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="业务类型" prop="type">
        <el-select v-model="form.type" placeholder="">
          <el-option label="调拨" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调出仓库" prop="depotOut">
        <el-select v-model="form.depotOut.id" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="shopDepot in shopDepots" :label="shopDepot.name" :value="shopDepot.id" :key="shopDepot.id"
            v-show="shopDepot.id!==form.depotIn.id" :disabled="shopDepot.enabled==='0'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调入仓库" prop="depotIn">
        <el-select v-model="form.depotIn.id" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="(shopDepot,index) in shopDepots" :label="shopDepot.name" :value="shopDepot.id" :key="index"
            v-show="shopDepot.id!==form.depotOut.id" :disabled="shopDepot.enabled==='0'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联出库单" prop="relateDepotOutBill">
        <el-input :value="form.relateDepotOutBill?form.relateDepotOutBill.sn:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="关联入库单" prop="relateDepotInBill">
        <el-input :value="form.relateDepotInBill?form.relateDepotInBill.sn:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input :value="form.creator||getUser().name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="确认人" prop="modifier">
        <el-input :value="form.auditorName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input :value="form.state==='1'?'已确认':'未确认'" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="createDate">
        <el-input :value="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="mini" @click="showDialog=true" style="float:right" :disabled="form.state==='1'">选择商品
    </el-button>
    <el-table size="small" :data="form.items">
      <el-table-column label="商品" prop="fullName" min-width="140"></el-table-column>
      <el-table-column prop="barCode" label="条码" min-width="150">
        <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
      </el-table-column>
      <el-table-column label="库存数量" prop="stockAmount" min-width="80" v-if="form.state!=='1'"></el-table-column>
      <el-table-column label="调拨数量" prop="quantity" min-width="160">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" :min="1" v-model="scope.row.quantity" :disabled="form.state==='1'">
            </el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="deleteHandeler(scope)" :disabled="form.state==='1'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <biz-dialog-selector title="选择商品" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectedGiftIds" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @open="opened" @operate="dialogOperate"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange" @selectionChange="selectionChange"
      @currentPageChange="dialogCurrentPageChange" @active-item-change="activeItemChange" @cascaderChange="cascaderChange">
      <el-table-column property="fullName" label="商品名称" width="300px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <div class="biz-two-row">
              <div style="margin-left: 10px" class="titleClass" :title="scope.row.productName">{{scope.row.productName}}</div>
              <div style="margin-left: 10px">编号：{{scope.row.productSn}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <!-- <el-table-column property="vin" label="车辆识别代码"></el-table-column> -->
      <el-table-column label="在库库存">
        <template slot-scope="scope">
          <div style="width:120px;">{{scope.row.stockAmount}}</div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import BizDialogSelector from '@/components/BizDialogSelector';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import date from '@/utils/date.js';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    templateId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    shopDepots: {
      type: Array
    }
  },
  components: {
    BizGrid,
    BizHeader,
    BizDialogSelector
  },
  data() {
    let validateDepotOut = (rule, value, callback) => {
      if (!this.form.depotOut.id) {
        callback(new Error('请选择调出仓库'));
      } else {
        callback();
      }
    };
    let validateDepotIn = (rule, value, callback) => {
      if (!this.form.depotIn.id) {
        callback(new Error('请选择调入仓库'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      // 用户信息
      form: this.getDefaultForm(),
      operations: [
        {
          label: '保存',
          name: 'save',
          disabled: false,
          type: 'primary',
          auth: ['admin:storage.transfer.edit']
        }
      ],
      dialogLoading: true,
      dialogTableData: [],
      selectedGiftList: [],
      selectedGiftIds: [],
      selectionList: [],
      productCategoryId: '',
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'select',
          label: '品牌',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称',
          name: 'searchValue',
          value: ''
        }
      ],
      showDialog: false,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      categoryDatas: [],
      errUserName: '',
      errName: '',
      rules: {
        type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        depotOut: [
          { required: true, message: '请选择调出仓库', trigger: 'change' },
          { validator: validateDepotOut, trigger: 'change' }
        ],
        depotIn: [
          { required: true, message: '请选择调入仓库', trigger: 'change' },
          { validator: validateDepotIn, trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    itemId: {
      handler: function(nVal) {
        if (nVal) {
          this.$refs.form.resetFields();
          this.query();
        } else {
          this.form = this.getDefaultForm();
          this.operations[0].type = 'primary';
          this.operations[0].disabled = false;
        }
      }
    }
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    getDefaultForm() {
      return {
        sn: '',
        type: '1',
        depotIn: {
          id: '',
          name: ''
        },
        depotOut: {
          id: '',
          name: ''
        },
        relateDepotInBill: {
          id: '',
          name: ''
        },
        relateDepotOutBill: {
          id: '',
          name: ''
        },
        state: '',
        items: [],
        remarks: '',
        createDate: date.dateTimeConverter(new Date()),
        creator: ''
      };
    },
    deleteHandeler(val) {
      this.form.items.splice(val.$index, 1);
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    handleConfirmed(val) {
      this.selectedGiftIds = val.concat();
      this.selectedGiftList = [];
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.$set(gift, 'quantity', 1);
          this.$set(gift, 'fullName', gift.productName);
          this.selectedGiftList.push(gift);
        }
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
      });
    },
    handleSelect(val) {
      let contain = false;
      // val.productId = val.id;
      val.id = '';
      if (this.form.items.length === 0) {
        this.form.items.push(val);
        return;
      }
      for (let i = 0; i < this.form.items.length; i++) {
        if (this.form.items[i].productId === val.productId) {
          this.form.items[i].quantity = (Number(this.form.items[i].quantity) + 1).toString();
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.form.items.push(val);
      }
    },
    query() {
      if (this.itemId) {
        this.loading = true;
        http
          .get(urls.invoicing.allottedMgmt.depotTransfer, { id: this.itemId })
          .then(data => {
            this.loading = false;
            this.form = Object.assign(this.getDefaultForm(), data.data);
            if (this.form.state === '1') {
              this.operations[0].type = '';
              this.operations[0].disabled = true;
            }
            this.$emit('operationSuccess');
          })
          .catch(errData => {
            this.loading = false;
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          });
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.itemId &&
            http
              .put(urls.invoicing.allottedMgmt.depotTransfer, this.form)
              .then(data => {
                this.loading = false;
                this.$message.success('更新成功');
                this.$emit('operationSuccess');
              })
              .catch(errData => {
                this.loading = false;
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              });
          !this.itemId &&
            http
              .post(urls.invoicing.allottedMgmt.depotTransfer, this.form)
              .then(data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
              })
              .catch(errData => {
                this.loading = false;
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              });
        }
      });
    },
    showStorePicker(e) {
      this.showDialog = true;
    },
    queryProducts(params) {
      http
        .get(urls.invoicing.allottedMgmt.products, params)
        .then(data => {
          this.dialogLoading = false;
          this.dialogTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.dialogLoading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    opened() {
      this.selectedGiftIds.splice(0, this.selectedGiftIds.length);
      this.selectedGiftList.splice(0, this.selectedGiftList.length);
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'select',
          label: '品牌',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryFilters();
      this.queryProducts(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        productCategoryId: this.productCategoryId,
        brandId: this.getSelectedBrandId(),
        depotId: this.form.depotOut.id,
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[2].value
      };
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryProducts(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryProducts(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryProducts(this.getDialogQueryParams());
    },
    dialogOperate(name) {},
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get('/admin/shopProduct/filter.jhtml', params)
        .then(data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          this.setBrandFilters(data.brandDatas);
        })
        .catch(() => {});
    },
    setCategoryFilters() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];

      this.categoryDatas.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
      });

      this.dialogFilters[0].options = options;
    },
    setBrandFilters(brandDatas) {
      this.dialogFilters[1].options = brandDatas.map(brand => {
        return { value: brand.id, label: brand.name };
      });
      this.dialogFilters[1].options.splice(0, 0, {
        value: '',
        label: '全部'
      });
    },
    getSelectedBrandId() {
      return this.dialogFilters[1].value;
    },
    activeItemChange(val) {
      let param = {
        shopId: this.getUser().shop.id,
        parentId: val.toString()
      };
      http
        .get('/admin/shopProduct/productCategorys.jhtml', param)
        .then(data => {
          this.setCategoryFilters();
          let curItem;
          this.dialogFilters[0].options.forEach(item => {
            if (item.value === val[0]) {
              curItem = item.children;
            }
          });
          data.dateList.forEach(element => {
            curItem.push({ value: element.id, label: element.name });
          });
        })
        .catch(() => {});
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.queryProducts(this.getDialogQueryParams());
    }
  }
};
</script>

<style lang="scss">
.bar-basic-info {
  .el-form {
    overflow: auto;
    width: 100%;
  }
  .biz-header {
    float: left;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-col .el-input {
    width: 80%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
