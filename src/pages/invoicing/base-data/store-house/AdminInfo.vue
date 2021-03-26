<template>
  <biz-grid class="product-info" v-loading="loading">
    <div slot="top">
      <biz-save-button :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
      <el-form :inline="true" :inline-message="true">
        <el-form-item label="管理员范围">
          <el-radio-group v-model="type" @change="typeChange">
            <el-radio label="0">所有员工</el-radio>
            <el-radio label="1">指定员工</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <biz-list ref="table" :tableData="tableData" :height="'100%'" v-loading="loading">
      <el-table-column min-width="140" prop="info" label="员工信息">
        <div slot-scope="scope">
          <div class="customer-info">
            <img :src="scope.row.head ? scope.row.head : Img" alt />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="isEnabled" label="状态" min-width="60">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.isEnabled === '1' ? '启用' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.loginAddress === 'null' ? '' : scope.row.loginAddress}}
            </div>
            <div class="overflow">
              {{scope.row.loginDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" type="index" v-if="isEdit" width="60">
        <template slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click="deleteHandeler(scope)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <biz-dialog-selector title="选择人员" :visibility.sync="showDialog" :tableData="giftList" :pagination="dialogPagination"
      :filters="dialogFilters" :selectionKeys="selectedGiftIds" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange" class="product-info-dailog" @confirmed="confirmedProduct"
      @filterDataChange="dialogFilterDataChange" @selectionChange="selectionChange">
      <el-table-column min-width="160" prop="info" label="用户信息">
        <div slot-scope="scope">
          <div class="customer-info">
            <img :src="scope.row.head ? scope.row.head : Img" alt />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="isEnabled" label="状态" min-width="60">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.isEnabled === '1' ? '启用' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="登录信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              最后登录地址：{{ scope.row.loginAddress === 'null' ? '' : scope.row.loginAddress}}
            </div>
            <div class="overflow">
              最后登录时间：{{scope.row.loginDate}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import BizList from '@/components/BizTable/BizList';
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import BizDialogSelector from '@/components/BizDialogSelector';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import Img from '@/assets/images/default_user.png';
export default {
  name: 'ProductInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    returnId: {
      type: String
    }
  },
  data() {
    return {
      type: '0',
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      Img: Img,
      selectedGiftList: [],
      selectedGiftIds: [],
      selectionList: [],
      tableDataInDePot: [],
      showDialog: false,
      showDialogInDepot: false,
      DefaultImg: DefaultImg,
      productCategoryId: '',
      amount: '',
      paginationExpend: {
        pageSize: 1000,
        pageSizes: [1000],
        currentPage: 1,
        total: 9
      },
      dialogFilters: [],
      giftList: [],
      categoryDatas: [],
      loading: false,
      open: false,
      totalFee: '',
      row: {},
      height: '585',
      tableData: [],
      restaurants: [],
      selections: [],
      itemDatas: [],
      dialogTableVisible: false,
      currentRow: {},
      storeList: [],
      tableDataTemp: [],
      title: '',
      operations: [
        {
          label: '新增',
          name: 'addProduct',
          type: 'primary',
          class: 'hidden'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:inport.edit']
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizList,
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  watch: {
    itemId(val) {
      this.tableData = [];
      this.storeList = [];
      this.itemId && this.getList();
    },
    returnId(val) {
      this.tableData = [];
      this.storeList = [];
      this.returnId && this.getList();
    }
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 175);
  },
  methods: {
    ...mapGetters(['getUser']),
    expandChange(row) {
      this.currentRow = row;
      // this.query(row);
    },
    typeChange() {
      if (this.type === '1') {
        this.operations[0].class = 'show';
      } else {
        this.operations[0].class = 'hidden';
      }
    },
    close() {
      this.showDialogInDepot = false;
    },
    confirm(row) {
      this.row = row;
      this.query();
    },
    handleFilterDataChange() {
      this.query();
    },
    handleRowClick(model, e, column) {},
    handleDeleteClick(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },
    addProduct() {
      this.getGiftList();
      this.selectedGiftIds.splice(0, this.selectedGiftIds.length);
      this.selectedGiftList.splice(0, this.selectedGiftList.length);
      this.showDialog = true;
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getGiftList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getGiftList();
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getGiftList();
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.isEnabled === '1') {
        // 启用
        return '#11AE17';
      } else {
        // 停用
        return '#FF7300';
      }
    },
    getGiftList() {
      let params = {
        roleTypes: '19',
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/admin/listAdminByRole.jhtml', params)
        .then(data => {
          this.giftList = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    confirmedProduct(val) {
      this.selectedGiftIds = val.concat();
      this.selectedGiftList = [];
      this.tableDataTemp = [];
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.selectedGiftList.push(gift);
        }
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
      });
      this.storeList = [];
      this.addHandler();
    },
    handleSelect(val) {
      let contain = false;
      val.productId = val.id;
      val.id = '';
      if (this.tableData.length === 0) {
        this.tableDataTemp.push(val);
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId === val.productId) {
          this.tableData[i].amount = (Number(this.tableData[i].amount) + 1).toString();
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.tableDataTemp.push(val);
      }
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.flag = true;
      this.getList();
    },
    getList() {
      this.typeChange();
      this.loading = true;
      let params = {
        id: this.itemId.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/invoicing/stock/shopDepot/listAdmins.jhtml', params)
        .then(data => {
          this.loading = false;
          this.type = data.data.adminScope;
          this.tableData = data.data.admins;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    addHandler() {
      this.loading = true;
      let params = {
        id: this.itemId.id,
        adminScope: this.type,
        admins: this.tableDataTemp
      };
      http
        .post('/admin/invoicing/stock/shopDepot/admin.jhtml  ', params)
        .then(data => {
          this.$message.success('保存成功');
          this.getList();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteHandeler(val) {
      if (val.row.id === '') {
        this.tableData.splice(val.$index, 1);
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http
            .delete('/admin/invoicing/stock/shopDepot/admin.jhtml ', { id: this.itemId.id, admins: [val.row] })
            .then(data => {
              this.$message.success('删除成功');
              this.getList();
            })
            .catch(errData => {
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        });
      }
    },
    save() {
      this.loading = true;
      let params = {
        id: this.itemId.id,
        adminScope: this.type
      };
      http
        .put('/admin/invoicing/stock/shopDepot/admin.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
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
.product-info-dailog {
  .el-dialog__header {
    text-align: center;
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
.depot-in-dialog {
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }

  .first-name {
    .el-table__expand-icon {
      display: none;
    }
  }
}
.dialog-column {
  display: flex;
  align-items: center;
  .productImg {
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .biz-two-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .titleClass {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 200px;
      white-space: nowrap;
    }
  }
}
.product-info {
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
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    padding: 0px 10px;
  }
  .el-input-number--mini {
    width: 110px;
  }
  .el-button--small {
    margin-top: 20px;
  }
  .delete-btn {
    color: red;
  }
  .subTotal {
    float: right;
  }
  .el-autocomplete {
    width: 220px;
  }
  .biz-customcol {
    .el-input-number--mini .el-input-number__increase,
    .el-input-number--mini .el-input-number__decrease {
      width: 20px;
    }
  }
}
</style>
