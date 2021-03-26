<template>
  <biz-grid class="propagate-screen-setting">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :tableData="tableData" :loading="loading" @selection-change="handleSelectionChange">
      <el-table-column prop="name" label="视频" min-width="50px"></el-table-column>
      <el-table-column prop="products" label="关联产品">
        <div slot-scope="scope">
          <div class="biz-customcol" v-for="(product,index) in scope.row.products" :key="index">{{product.fullName}}</div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <!-- 添加宣传屏 -->
    <el-dialog :visible.sync="showScreen" center append-to-body custom-class="close-screen-dialog" title v-loading="loading">
      <div>
        <div style="display:flex;align-items: baseline;margin-bottom:10px">
          <span style="width:75px;text-align: right;margin-right: 5px;">视频：</span>
          <div>
            <el-upload
              accept="application/zip, video/*"
              name="file"
              :action="uploadAction"
              :data="uploadData"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary" style="padding: 7px 15px;">点击上传</el-button>
            </el-upload>
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
// import BizVideoUploadName from '@/components/BizForm/BizVideoUploadName';
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
      showMedia: '',
      dialogLoading: false,
      operations: [{ label: '新增', name: 'add', type: 'primary' }, { label: '删除', name: 'delete', type: '', disabled: true }],
      fileList: [],
      products: [],
      tableData: [],
      selectedItemKeys: [],
      fileListShow: [],
      defaultImg: DefaultImg,
      rules: {},
      data: { type: '2' },
      form: this.resetForm(),
      productList: [],
      multiSelected: [],
      disableReception: false,
      robotMediaProductDatas: [],
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
      ]
    };
  },
  components: {
    BizGrid,
    BizDialogSelector,
    BizFlexTable
    // BizVideoUploadName
  },
  computed: {
    uploadAction() {
      return '/admin/file/uploads.jhtml';
    },
    uploadData() {
      return { type: '2' };
    }
  },
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
      this.products = [];
      this.fileList = [];
      this.selectedItemKeys = [];
      this.showScreen = true;
    },
    confirmUpload() {
      this.loading = true;
      this.robotMediaProductDatas = [];
      if (!this.fileList || (this.fileList && this.fileList.length === 0)) {
        this.$message.warning('请选择视频格式文件上传！');
        this.loading = false;
        return false;
      } else {
        this.robotMediaProductDatas.push({
          robotMediaId: '',
          terminalId: this.itemId,
          path: this.fileList && this.fileList.length > 0 ? this.fileList[0].path : '',
          products: this.products,
          position: '1',
          name: this.fileList && this.fileList.length > 0 ? this.fileList[0].name : ''
        });
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
        this.$message.warning('未选择删除条目');
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
          this.tableData = data.data.showMedia;
          if (data.data.showMedia && data.data.showMedia.length > 0) {
            data.data.showMedia.map(item => {
              this.fileList.push({
                url: item.path,
                path: item.path,
                name: item.name,
                position: '1'
              });
            });
          }
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
    handleRemove(file, fileList) {
      this.fileList = fileList.splice(this.fileList.indexOf(fileList), 1);
    },
    handleSuccess(file, fileList) {
      if (file.resultCode === '100') {
        this.fileList.push({
          url: file.fis[0].url,
          path: file.fis[0].url,
          name: file.fis[0].name
        });
      }
    },
    handleError(file, fileList) {
      this.$message.warning('发生错误');
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.robotMediaId;
      });
      this.operations[1].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[1].disabled = false;
      }
    }
  }
};
</script>

<style lang="scss">
.propagate-screen-setting {
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
