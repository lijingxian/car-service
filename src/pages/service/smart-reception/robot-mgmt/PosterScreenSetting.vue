<template>
  <biz-grid class="poster-screen-setting">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :tableData="tableData" :loading="loading" @selection-change="handleSelectionChange">
      <el-table-column label="展示内容" min-width="50px">
        <div slot-scope="scope">
          <img :src="scope.row.promotionData&&scope.row.promotionData.images?scope.row.promotionData.images[0]:''" height="100px" style="padding-bottom:10px" />
          <img :src="scope.row.marketingData&&scope.row.marketingData.images?scope.row.marketingData.images:''" height="100px" style="padding-bottom:10px" />
          <img :src="scope.row.productData&&scope.row.productData.image?scope.row.productData.image:''" height="100px" style="padding-bottom:10px" />
          <img :src="scope.row.path?scope.row.path:''" height="100px" style="padding-bottom:10px" />
        </div>
      </el-table-column>
      <el-table-column prop label="关联产品">
        <div slot-scope="scope">
          <div class="biz-customcol" v-for="(product,index) in scope.row.products" :key="index">{{product.fullName}}</div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <!-- 添加广告屏 -->
    <el-dialog :visible.sync="showScreen" center append-to-body custom-class="close-screen-dialog" title v-loading="loading">
      <div>
        <div style="display:flex;align-items: baseline;margin-bottom:10px">
          <span style="margin-right: 5px;">展示内容：</span>
          <div>
            <el-radio-group @change="indicatorChanged" v-model="radioValue" size="mini">
              <el-radio-button label="0">添加活动</el-radio-button>
              <el-radio-button label="1">添加商品</el-radio-button>
              <el-radio-button label="2">添加海报图片</el-radio-button>
            </el-radio-group>
            <div v-if="radioValue==='0'" style="margin-top:10px">
              <img :src="activityData&&activityData.images?activityData.images[0]:''" height="100px" style="padding-bottom:10px" />
            </div>
            <div v-if="radioValue==='1'" style="margin-top:10px">
              <img :src="productData&&productData.image?productData.image:''" height="100px" style="padding-bottom:10px" />
            </div>
            <div v-if="radioValue==='2'" style="margin-top:10px">
              <BizAvatarUploaderNew @uploadSuccess="handleSuccess" v-model="imagePath"></BizAvatarUploaderNew>
            </div>
          </div>
        </div>
        <div>
          <span style="margin-right: 5px;">关联产品：</span>
          <el-button type="primary" size="mini" @click="addProduct" style="margin-bottom:10px">添加</el-button>
          <div class="product-list">
            <div class="el-upload-list el-upload-list--picture-card">
              <div tabindex="0" class="img-preview el-upload-list__item is-success" v-for="product in products" :key="product.index">
                <img :src="product.image||defaultImg" alt class="el-upload-list__item-thumbnail" />
                <span class="el-upload-list__item-actions">
                  <!-- 删除 -->
                  <span class="el-upload-list__item-delete" @click="handleRemoveProduct(product.id)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
                <div class="detail_info">
                  <span>{{product.fullName}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showScreen=false" size="mini" type="primary">取消</el-button>
        <el-button @click="confirmUpload" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!-- 商品选择 -->
    <biz-dialog-selector
      :loading="dialogLoading"
      :visibility.sync="showDialog"
      :tableData="productList"
      :pagination="pagination"
      :filters="productFilters"
      :selectionKeys="selectedItemKeys"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"
      @confirmed="confirm"
      @filterDataChange="filterDataChange"
    >
      <el-table-column property="sn" label="编号"></el-table-column>
      <el-table-column property="fullName" label="名称"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
    </biz-dialog-selector>
    <!-- 商品选择 -->
    <biz-dialog-selector
      :loading="dialogLoading"
      title="选择商品"
      :visibility.sync="showProductDialog"
      :tableData="productSelect"
      :pagination="dialogProductPagination"
      :filters="productSelectFilters"
      @pageSizeChange="handleProductSizeChange"
      @currentPageChange="handleProductCurrentChange"
      @confirmed="handleProductConfirmed"
      :selectionMode="'single'"
      :isClear="false"
      @filterDataChange="dialogProductFilterDataChange"
    >
      <el-table-column property="name" label="名称"></el-table-column>
      <el-table-column property="categoryName" label="类型"></el-table-column>
      <el-table-column property="shop.name" label="店铺"></el-table-column>
      <el-table-column :prop="'state'" label="状态" :formatter="getState"></el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector
      title="选择活动"
      :visibility.sync="showActiveDialog"
      :appendToBody="true"
      :tableData="dialogActiveTableData"
      :pagination="dialogActivePagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogActiveFilters"
      @confirmed="handleActiveConfirmed"
      @filterDataChange="dialogActiveFilterDataChange"
      @pageSizeChange="dialogActivePageSizeChange"
      @currentPageChange="dialogActiveCurrentPageChange"
      class="activeDialog"
    >
      <el-table-column label="名称" prop>
        <div slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </div>
      </el-table-column>
      <el-table-column label="类型" prop>
        <div slot-scope="scope">
          <span>{{getType(scope.row)}}</span>
        </div>
      </el-table-column>
      <el-table-column label="店铺" prop>
        <div slot-scope="scope">
          <span v-if="dialogActiveFilters[0].value==='promotion'">{{scope.row.shopData.name}}</span>
          <span v-if="dialogActiveFilters[0].value==='marketing'">{{scope.row.shopname}}</span>
        </div>
      </el-table-column>
      <el-table-column label="状态" :formatter="getStateStr" :prop="'stateStr'"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizFlexTable } from '@/components/BizTable';
import { customerService, contentMgmt } from '@/common/urls';
import http from '@/common/http';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import BizDialogSelector from '@/components/BizDialogSelector';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import { BizAvatarUploaderNew } from '@/components/BizForm';
export default {
  name: 'ScreenSetting',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      loading: false,
      showScreen: false,
      showDialog: false,
      showProductDialog: false,
      showMedia: '',
      dialogLoading: false,
      showActiveDialog: false,
      openedActive: false,
      showTable: true,
      dialogActiveTableData: [],
      operations: [{ label: '新增', name: 'add', type: 'primary' }, { label: '删除', name: 'delete', type: '', disabled: true }],
      fileList: [],
      products: [],
      imagePath: '',
      tableData: [],
      activityData: {},
      selectedItemKeys: [],
      fileListShow: [],
      defaultImg: DefaultImg,
      rules: {},
      data: { type: '2' },
      form: this.resetForm(),
      productList: [],
      productSelect: [],
      multiSelected: [],
      marketingData: {},
      promotionData: {},
      productData: {},
      disableReception: false,
      robotMediaProductDatas: [],
      showUpload: false,
      radioValue: '',
      fileData: {
        type: '0'
      },
      dialogProductPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      dialogActivePagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      productFilters: [
        {
          type: 'input',
          placeholder: '请输入商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      productSelectFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      dialogActiveFilters: [
        {
          type: 'radio',
          label: '',
          name: 'type',
          value: 'promotion',
          options: [
            {
              label: '促销活动',
              value: 'promotion'
            },
            {
              label: '营销活动',
              value: 'marketing'
            }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入活动名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizDialogSelector,
    BizFlexTable,
    BizAvatarUploaderNew
  },
  computed: {},
  watch: {
    itemId(nweVal, oldVal) {
      if (nweVal) {
        this.query();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {};
    },
    add() {
      this.productList = [];
      this.productSelect = [];
      this.marketingData = {};
      this.promotionData = {};
      this.productData = {};
      this.products = [];
      this.dialogActiveTableData = [];
      this.fileList = [];
      this.selectedItemKeys = [];
      this.radioValue = '';
      this.showScreen = true;
    },
    indicatorChanged(val) {
      this.products = [];
      this.imagePath = '';
      this.activityData = {};
      this.marketingData = {};
      this.promotionData = {};
      this.productData = {};
      if (val === '0') {
        this.dialogActivePagination.currentPage = 1;
        this.queryLink();
        this.showActiveDialog = true;
      } else if (val === '1') {
        this.productSelectFilters[0].value = '';
        this.dialogProductPagination.currentPage = 1;
        this.getProductList();
        this.showProductDialog = true;
      } else if (val === '2') {
        this.showUpload = true;
      }
    },
    confirmUpload() {
      this.loading = true;
      this.robotMediaProductDatas = [];
      if (
        this.radioValue === '' ||
        (this.radioValue === '0' && !this.activityData) ||
        (this.radioValue === '1' && !this.productData) ||
        (this.radioValue === '2' && this.imagePath === '')
      ) {
        this.$message.warning('请选择展示内容');
        this.loading = false;
        return false;
      } else {
        if (this.radioValue === '0' && this.dialogActiveFilters[0].value === 'promotion') {
          this.robotMediaProductDatas.push({
            robotMediaId: '',
            terminalId: this.itemId,
            promotionData: this.promotionData,
            products: this.products,
            position: '2'
          });
        } else if (this.radioValue === '0' && this.dialogActiveFilters[0].value === 'marketing') {
          this.robotMediaProductDatas.push({
            robotMediaId: '',
            terminalId: this.itemId,
            marketingData: this.marketingData,
            products: this.products,
            position: '2'
          });
        } else if (this.radioValue === '1') {
          this.robotMediaProductDatas.push({
            robotMediaId: '',
            terminalId: this.itemId,
            productData: this.productData,
            products: this.products,
            position: '2'
          });
        } else if (this.radioValue === '2') {
          this.robotMediaProductDatas.push({
            robotMediaId: '',
            terminalId: this.itemId,
            path: this.imagePath,
            products: this.products,
            position: '2'
          });
        }

        http
          .put('/admin/reception/robotMediaProduct.jhtml', this.robotMediaProductDatas)
          .then(data => {
            this.loading = false;
            this.$message.success('添加成功');
            this.showScreen = false;
            this.query();
            this.$emit('created');
          })
          .catch(errData => {
            console.log(errData);
            this.loading = false;
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // 添加商品
    addProduct() {
      this.queryProductList();
      this.showDialog = true;
    },
    // dialog确认
    confirm(keys) {
      this.selectedItemKeys = keys || this.selectedItemKeys;
      // this.products = this.selectedItemKeys.map(key => {
      //   return { id: key };
      // });
      this.queryProductsByIds(this.selectedItemKeys);
    },
    getProductList() {
      let params = {
        searchValue: this.productSelectFilters[0].value,
        type: '0',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogProductPagination.currentPage,
        pageSize: this.dialogProductPagination.pageSize
      };
      this.dialogLoading = true;
      http
        .get('/admin/product/union/list.jhtml', params)
        .then(data => {
          this.dialogLoading = false;
          this.productSelect = data.content;
          this.dialogProductPagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // 根据ID查询商品
    queryProductsByIds(ids) {
      http
        .post(contentMgmt.publicity.editArticle.findProduct, { ids: ids })
        .then(data => {
          this.products = data.content;
        })
        .catch();
    },
    // 删除商品列表
    handleRemoveProduct(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removePic(id);
      });
    },
    removePic(id) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          this.products.splice(i, 1);
        }
      }
    },
    delete() {
      let ids = this.multiSelected.length === 0 ? [] : this.multiSelected;
      if (ids.length === 0) {
        this.showMessage('未选择删除条目', 'warning');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        this.loading = true;
        http
          .delete('/admin/reception/robotMediaProduct.jhtml', params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();
            this.$emit('created');
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    handleActiveConfirmed(key, row) {
      this.activityData = Object.assign({}, row[0]);
      if (this.dialogActiveFilters[0].value === 'marketing') {
        this.marketingData = Object.assign({}, row[0]);
        this.promotionData = {};
      } else if (this.dialogActiveFilters[0].value === 'promotion') {
        this.promotionData = Object.assign({}, row[0]);
        this.marketingData = {};
      }
    },
    handleProductConfirmed(key, row) {
      this.productData = Object.assign({}, row[0]);
    },
    // dialog过滤器发生变动
    dialogActiveFilterDataChange(val) {
      // this.filters = val;
      this.dialogActivePagination.currentPage = 1;
      this.queryLink();
    },
    // 分页
    dialogActivePageSizeChange(val) {
      this.dialogActivePagination.pageSize = val;
      this.queryLink();
    },
    // 跳页
    dialogActiveCurrentPageChange(val) {
      this.dialogActivePagination.currentPage = val;
      this.queryLink();
    },
    dialogProductFilterDataChange(val) {
      // this.filters = val;
      this.dialogProductPagination.currentPage = 1;
      this.getProductList();
    },
    // 分页
    handleProductSizeChange(val) {
      this.dialogProductPagination.pageSize = val;
      this.getProductList();
    },
    // 跳页
    handleProductCurrentChange(val) {
      this.dialogProductPagination.currentPage = val;
      this.getProductList();
    },
    // dialog过滤器发生变动
    filterDataChange(val) {
      // this.filters = val;
      this.pagination.currentPage = 1;
      this.queryProductList();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryProductList();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryProductList();
    },
    queryLink() {
      let params = {
        searchValue: this.dialogActiveFilters[1].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogActivePagination.currentPage,
        pageSize: this.dialogActivePagination.pageSize
      };
      this.dialogLoading = true;
      let url = '';
      if (this.dialogActiveFilters[0].value === 'promotion') {
        this.dialogActiveFilters[1].placeholder = '请输入促销活动名称';
        url = '/admin/promotion/union/listPromotion.jhtml';
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        this.dialogActiveFilters[1].placeholder = '请输入营销活动名称';
        url = '/admin/marketing/union/listActivity.jhtml';
      }
      http
        .get(url, params)
        .then(data => {
          this.dialogLoading = false;
          this.dialogActiveTableData = data.content;
          this.dialogActivePagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // 查询商品列表
    queryProductList() {
      let params = {
        searchValue: this.productFilters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.dialogLoading = true;
      CommodityMgmtService.getCommodityList(
        params,
        data => {
          this.dialogLoading = false;
          this.productList = data.content;
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        }
      );
    },
    beforeAvatarUpload(file) {
      const isVideo = /^video\/(.*)$/.test(file.type);
      if (!isVideo) {
        this.$message.error('请选择符合视频格式的文件上传!');
      }
      return isVideo;
    },
    query() {
      this.loading = true;
      this.fileList = [];
      http
        .get(customerService.smartReception.queryRobotInfo, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId
        })
        .then(data => {
          this.loading = false;
          this.tableData = data.data.adMedia;
        })
        .catch(errData => {
          console.log(errData);
          this.loading = false;
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSuccess(file) {
      if (file.resultCode === '100') {
        this.imagePath = file.fis[0].url;
      }
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.robotMediaId;
      });
      this.operations[1].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    getType(row) {
      if (this.dialogActiveFilters[0].value === 'promotion') {
        switch (row.typeStr) {
          case '0':
            return '包邮';
          case '1':
            return '优惠券';
          case '2':
            return '促销';
          case '3':
            return '满减';
          case '4':
            return '折扣';
          case '5':
            return '满送';
          case '6':
            return '套餐';
          case '7':
            return '会员价';
          default:
            return '';
        }
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.typeStr) {
          case '0':
            return '抢红包';
          case '1':
            return '摇一摇';
          case '2':
            return '抽奖';
          case '3':
            return '拼团购';
          case '4':
            return 'N元抢购';
          case '5':
            return '限时秒杀';
          case '6':
            return '帮砍价';
          case '7':
            return '推荐有礼';
          case '8':
            return '分享有礼';
          case '9':
            return '活动招募';
          default:
            break;
        }
      }
    },
    getState(row) {
      switch (row.state) {
        case '0':
          return '已创建';

        case '1':
          return '已提交';

        case '2':
          return '已上架';

        case '3':
          return '已下架';
        default:
          break;
      }
    },
    getStateStr(row) {
      if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
              return '进行中';
            } else if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
              return '已结束';
            } else {
              return '进行中';
            }
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      } else {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            return '进行中';
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      }
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    }
  }
};
</script>

<style lang="scss">
.poster-screen-setting {
  .avatar-uploader {
    cursor: pointer;
    width: 150px;
    height: 150px;
    text-align: center;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
    .el-upload--text {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader-icon {
      line-height: 150px;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .operate {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      opacity: 0;
      transition: all 0.3s;
      .el-icon-zoom-in,
      .el-icon-plus {
        margin: 0 5px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
        .el-icon-zoom-in,
        .el-icon-plus {
          cursor: pointer;
        }
      }
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  img {
    margin-top: 10px;
    max-width: 100%;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
  .el-radio {
    width: 70px;
  }
}
.close-screen-dialog {
  .product-list {
    margin-left: 75px;
    // 图片预览
    .el-upload-list.el-upload-list--picture-card {
      display: flex;
      flex-wrap: wrap;
    }
    .content_class {
      height: 100%;
      overflow: auto;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 300px;
      height: 100px;
      .detail_info {
        margin-left: 20px;
      }
    }
    .el-upload-list--picture-card .el-upload-list__item-thumbnail {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
