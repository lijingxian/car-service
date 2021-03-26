<template>
  <biz-grid class="screen-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="125px" size="small" v-loading="loading">
      <el-form-item label="屏保">
        <el-upload name="file" :data="data" action="/admin/file/uploads.jhtml" :on-change="handleChange" list-type="picture-card"
          :file-list="fileList" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="展示宣传屏">
        <!-- <el-upload name="uploadFile0" :data="data" action="/rest/commonFileUpload.jhtml" :on-change="handleChangeShow" list-type="picture-card"
          :file-list="fileListShow" :on-remove="handleRemoveShow" :on-success="handleSuccessShow" :on-error="handleErrorShow"
          :before-upload="beforeUploadShow">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <el-upload class="upload-demo" action="/admin/file/uploads.jhtml" name="file" :data="data" :on-change="handleChangeShow"
          :on-success="handleSuccessShow" :on-error="handleErrorShow" :on-remove="handleRemoveShow" :before-upload="beforeUploadShow"
          :file-list="fileListShow">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="广告屏宣传" prop="productList">
        <div class="product-list">
          <div class="el-upload-list el-upload-list--picture-card">
            <div tabindex="0" class="img-preview el-upload-list__item is-success" v-for="product in products" :key="product.index">
              <img :src="product.image||defaultImg" alt="" class="el-upload-list__item-thumbnail">
              <span class="el-upload-list__item-actions">
                <!--预览图片-->
                <!-- <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(img)">
                <i class="el-icon-zoom-in"></i>
              </span> -->
                <!-- 删除 -->
                <span class="el-upload-list__item-delete" @click="handleRemoveProduct(product.id)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              <div class="detail_info">
                <span>{{product.name}}</span>
                <span>￥{{product.price}}元</span>
              </div>
            </div>
            <div class="avatar-uploader" @click="addProduct">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 商品选择 -->
    <biz-dialog-selector :loading="dialogLoading" :visibility.sync="showDialog" :tableData="productList" :pagination="pagination"
      :filters="productFilters" :selectionKeys="selectedItemKeys" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange"
      @confirmed="confirm" @filterDataChange="filterDataChange">
      <el-table-column property="sn" label="编号"></el-table-column>
      <el-table-column property="name" label="名称"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { customerService, contentMgmt } from '@/common/urls';
import http from '@/common/http';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import BizDialogSelector from '@/components/BizDialogSelector';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
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
      showDialog: false,
      dialogLoading: false,
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      fileList: [],
      products: [],
      selectedItemKeys: [],
      fileListShow: [],
      defaultImg: DefaultImg,
      rules: {},
      data: { type: '2' },
      form: this.resetForm(),
      productList: [],
      disableReception: false,
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
    BizSaveButton,
    BizDialogSelector
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
    // 添加商品
    addProduct() {
      this.queryProductList();
      this.showDialog = true;
    },
    // dialog确认
    confirm(keys) {
      this.selectedItemKeys = keys || this.selectedItemKeys;
      this.products = this.selectedItemKeys.map(key => {
        return { id: key };
      });
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
      // http
      //   .get(contentMgmt.publicity.editArticle.queryProductList, params)
      //   .then(data => {
      //     this.dialogLoading = false;
      //     this.productList = data.content;
      //     this.pagination.total = Number(data.total);
      //   })
      //   .catch(ErrorData => {
      //     this.dialogLoading = false;
      //     this.$message.warning(ErrorData.errorMessage || '操作错误');
      //   });
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
    beforeUpload(file) {
      if (file.type && file.type.split('/')[0] === 'image') {
        this.data.type = '0';
      } else {
        this.$message.warning('请上传符合的图片');
        return false;
      }
    },
    beforeUploadShow(file) {
      if (file.type && file.type.split('/')[0] === 'image') {
        this.data.type = '0';
      } else if (file.type && file.type.split('/')[0] === 'video') {
        this.data.type = '2';
      } else {
        this.$message.warning('请上传符合的视频或图片');
        return false;
      }
    },
    query() {
      this.loading = true;
      this.fileList = [];
      this.fileListShow = [];
      http
        .get(customerService.smartReception.queryRobotInfo, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId
        })
        .then(data => {
          this.loading = false;
          this.products = data.data.products;
          if (data.data.operationMedia && data.data.operationMedia.length > 0) {
            data.data.operationMedia.map(item => {
              this.fileList.push({
                url: item.path,
                path: item.path,
                name: item.name,
                position: '0'
              });
            });
          }
          if (data.data.showMedia && data.data.showMedia.length > 0) {
            data.data.showMedia.map(item => {
              this.fileListShow.push({
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
    save() {
      this.loading = true;
      let params = {
        id: this.itemId,
        operationMedia: this.fileList,
        showMedia: this.fileListShow,
        products: this.products
      };
      http
        .put(customerService.smartReception.updateRobotInfo, params)
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
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
    },
    handleRemove(file, fileList) {
      this.fileList = fileList.splice(this.fileList.indexOf(fileList), 1);
    },
    handleSuccess(file, fileList) {
      if (file.resultCode === '100') {
        this.fileList.push({
          url: file.fis[0].url,
          path: file.fis[0].url,
          name: file.fis[0].name,
          position: '0',
          id: ''
        });
      }
    },
    handleError(file, fileList) {
      this.$message.warning('发生错误');
    },
    handleChange(file, fileList) {
      // debugger
      // this.fileList = fileList.splice(this.fileList.indexOf(fileList), 1);
    },
    handleRemoveShow(file, fileList) {
      this.fileListShow = fileList;
    },
    handleSuccessShow(file, fileList) {
      if (file.resultCode === '100') {
        this.fileListShow.push({
          url: file.fis[0].url,
          path: file.fis[0].url,
          position: '1',
          name: file.fis[0].name,
          id: ''
        });
      }
    },
    handleErrorShow(file, fileList) {
      this.$message.warning('发生错误');
    },
    handleChangeShow(file, fileList) {
      // this.fileListShow = fileList.slice(-3);
    }
  }
};
</script>

<style lang="scss">
.screen-setting {
  .biz-save-button {
    float: left;
  }
  .product-list {
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
</style>
