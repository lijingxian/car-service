<template>
  <biz-grid class="qa-mgmt-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type" @change="typeChange" style="line-height:20px">
          <el-radio label="0">纯文本</el-radio>
          <el-radio label="1">富文本</el-radio>
          <el-radio label="3">图片</el-radio>
          <el-radio label="2">超链接</el-radio>
          <el-radio label="1002">音频</el-radio>
          <el-radio label="1001">商品</el-radio>
          <el-radio label="1004">功能</el-radio>
          <el-radio label="1005">活动</el-radio>
          <el-radio label="1006">抽奖</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="匹配方式" prop="matchMode">
        <el-radio-group v-model="form.matchMode">
          <el-radio label="0">模糊</el-radio>
          <el-radio label="1">精准</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="问答名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="问题" prop="question">
        <div slot="label" style="float:right">
          问题
          <el-button type="text" size="small" v-popover:onTimePop>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="onTimePop" placement="bottom-start" width="300" trigger="hover" content="组合问题需要用 & 分隔">
          </el-popover>
        </div>
        <el-input placeholder="请输入问题" v-model="form.question">
          <el-button slot="append" icon="el-icon-plus" @click="addProblem"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="similarQuestion" v-for="(similarQuestion,index) in form.similarQuestion" :key="index">
        <el-input placeholder="请输入问题" v-model="similarQuestion.name">
        </el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='0' || form.type==='2'">
        <el-input placeholder="请输入答案" type="textarea" v-model="form.answer" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='1'">
        <biz-editor ref="editor" height="400px" width="320px" v-model="form.answer"></biz-editor>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='3'">
        <BizAvatarUploaderNew v-model="form.answer">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="答案" prop="files" v-if="form.type==='1002'">
        <biz-file-uploader :data="{type:2}" v-model="form.files" :fileList="form.fileList"></biz-file-uploader>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='1004'">
        <el-select v-model="form.answer" placeholder="请选择">
          <!-- <el-option label="预约试驾" value="预约试驾"></el-option>
          <el-option label="购车计算" value="购车计算"></el-option>
          <el-option label="车型对比" value="车型对比"></el-option>
          <el-option label="我的订单" value="我的订单"></el-option>
          <el-option label="会员信息" value="会员信息"></el-option> -->
          <el-option v-for="list in functionAnswerList" :key="list.id" :label="list.name" :value="list.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="答案" prop="activeAnswer" v-if="form.type==='1005'||form.type==='1006'">
        <div class="product-list el-upload-list el-upload-list--picture-card">
          <div tabindex="0" class="img-preview el-upload-list__item is-success" v-for="active in activeAnswerList"
            :key="active.index">
            <img :src="active.cover||defaultImg" alt class="el-upload-list__item-thumbnail">
            <span class="el-upload-list__item-actions">
              <!-- 删除 -->
              <span class="el-upload-list__item-delete" @click="handleRemoveActive(active.id)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
            <div class="detail_info">
              <span>{{active.title}}</span>
            </div>
          </div>
          <div class="avatar-uploader" @click="addActive">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="答案" prop="productList" v-if="form.type==='1001'">
        <div class="product-list el-upload-list el-upload-list--picture-card">
          <div tabindex="0" class="img-preview el-upload-list__item is-success" v-for="product in productList"
            :key="product.index">
            <img :src="product.image||defaultImg" alt class="el-upload-list__item-thumbnail">
            <span class="el-upload-list__item-actions">
              <!-- 删除 -->
              <span class="el-upload-list__item-delete" @click="handleRemove(product.id)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
            <div class="detail_info">
              <span>{{product.fullName}}</span>
              <span>￥{{product.price}}元</span>
            </div>
          </div>
          <div class="avatar-uploader" @click="addProduct">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="访问次数" prop="count">
        <el-input v-model="form.count" disabled></el-input>
      </el-form-item>
      <el-form-item label="最近访问时间" prop="date">
        <el-input v-model="form.date" disabled></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input-number v-model="form.weight" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
    </el-form>
    <biz-dialog-selector :loading="dialogLoading" :visibility.sync="showDialog" :tableData="products" :pagination="pagination"
      :filters="productFilters" :selectionKeys="selectedItemKeys" @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange" @confirmed="confirm" @filterDataChange="filterDataChange">
      <el-table-column property="sn" label="编号"></el-table-column>
      <el-table-column property="name" label="名称"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column prop="stock" label="剩余库存/库存总数" sortable="custom" width="150">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{ scope.row.availableStock }}/
            <span :style="{color: stateColor(scope.row)}">{{ scope.row.stock }}</span>
          </div>
        </div>
      </el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector :loading="dialogLoading" :visibility.sync="showDialogActive" :tableData="actives"
      :pagination="paginationActive" :selectionKeys="selectedItemKeysActive" :filters="activeFilters"
      @pageSizeChange="handleSizeChangeActive" @currentPageChange="handleCurrentChangeActive" @confirmed="confirmActive"
      @filterDataChange="filterDataChangeActive">
      <el-table-column prop="title" label="活动名称"></el-table-column>
      <el-table-column prop="shopname" label="店铺名称"></el-table-column>
      <el-table-column prop="type" :formatter="getState" label="状态"></el-table-column>
      <el-table-column prop="beginDate" sortable="custom" label="开始时间"></el-table-column>
      <el-table-column prop="endDate" sortable="custom" label="结束时间"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { customerService, contentMgmt } from '@/common/urls';
import { BizEditor } from '@/components/BizEditorH';
import { BizFileUploader, BizAvatarUploaderNew } from '@/components/BizForm';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import BizDialogSelector from '@/components/BizDialogSelector';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';
export default {
  name: 'QaMgmtDetail',
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
      dialogLoading: false,
      showDialog: false,
      showDialogActive: false,
      loading: false,
      products: [],
      actives: [],
      defaultImg: DefaultImg,
      selectedItemKeys: [],
      selectedItemKeysActive: [],
      productList: [],
      activeAnswerList: [],
      videoType: 'video',
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        name: [{ required: true, message: '请填写问答名称', trigger: 'blur' }],
        question: [{ required: true, message: '请填写问题', trigger: 'blur' }],
        files: [{ required: true, message: '请填写答案', trigger: 'blur' }],
        answer: [
          { required: true, message: '请填写答案', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let validate = /^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i;
              if (this.form.type === '2' && !validate.test(value)) {
                callback(new Error('请输入正确的超链接地址'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      productFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      activeFilters: [
        {
          type: 'radio',
          label: '活动类型：',
          name: 'type',
          value: '2',
          options: [
            {
              label: '抽奖',
              value: '2'
            },
            {
              label: '活动招募',
              value: '9'
            }
          ]
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      paginationActive: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      functionAnswerList: [],
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizEditor,
    BizAvatarUploaderNew,
    BizFileUploader,
    BizDialogSelector
  },
  methods: {
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    },
    getFunctionAnswerList() {
      http
        .get('/admin/reception/receptionBusseniess.jhtml', {})
        .then(data => {
          this.loading = false;
          this.functionAnswerList = data.datas;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getState(row) {
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
    },
    addActive() {
      if (this.form.type === '1006') {
        this.activeFilters = [
          {
            type: 'radio',
            label: '活动类型：',
            name: 'type',
            value: '2',
            options: [
              {
                label: '抽奖',
                value: '2'
              }
            ]
          }
        ];
      } else {
        this.activeFilters = [
          {
            type: 'radio',
            label: '活动类型：',
            name: 'type',
            value: '9',
            options: [
              {
                label: '招募活动',
                value: '9'
              }
            ]
          }
        ];
      }
      this.showDialogActive = true;
      this.getActivityList();
    },
    // 获取活动列表
    getActivityList() {
      this.dialogLoading = true;
      let params = {
        typeStr: this.activeFilters[0].value,
        pageNumber: this.paginationActive.currentPage,
        pageSize: this.paginationActive.pageSize
      };
      activityMgmtService.getActivityList(
        params,
        data => {
          this.dialogLoading = false;
          this.actives = data.content;
          this.paginationActive.total = Number(data.total);
        },
        ErrorData => {
          this.dialogLoading = false;
          console.log(ErrorData);
          if (ErrorData.errorMessage !== '店铺不存在') this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    filterDataChangeActive(val) {
      this.paginationActive.currentPage = 1;
      this.getActivityList();
    },
    // 分页
    handleSizeChangeActive(val) {
      this.paginationActive.pageSize = val;
      this.getActivityList();
    },
    // 跳页
    handleCurrentChangeActive(val) {
      this.paginationActive.currentPage = val;
      this.getActivityList();
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
    // dialog确认
    confirm(keys) {
      this.selectedItemKeys = keys || this.selectedItemKeys;
      this.form.productList = this.selectedItemKeys.map(key => {
        return { id: key };
      });
      this.queryProductsByIds(this.selectedItemKeys);
      this.$refs.form.clearValidate('productList');
    },
    confirmActive(keys, row) {
      console.log(row);
      this.selectedItemKeysActive = keys || this.selectedItemKeysActive;
      this.activeAnswerList = row;
    },
    // 根据ID查询商品
    queryActivesByIds(ids) {
      http
        .post('/admin/marketing/activityList.jhtml', { ids: ids })
        .then(data => {
          this.activeAnswerList = data.activityList;
        })
        .catch();
    },
    // 根据ID查询活动
    queryProductsByIds(ids) {
      http
        .post(contentMgmt.publicity.editArticle.findProduct, { ids: ids })
        .then(data => {
          this.productList = data.content.concat(this.productList);
          this.form.productList = this.productList.map(key => {
            return { id: key.id };
          });
        })
        .catch();
    },
    // 查询商品列表
    queryProductList() {
      let params = {
        searchValue: this.productFilters[0].value,
        state: '2',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.dialogLoading = true;
      http
        .get('/admin/product/union/list.jhtml', params)
        .then(data => {
          this.dialogLoading = false;
          this.products = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // 添加商品
    addProduct() {
      this.selectedItemKeys = this.productList;
      this.productFilters[0].value = '';
      this.pagination.currentPage = 1;
      this.queryProductList();
      this.showDialog = true;
    },
    // 删除商品列表
    handleRemove(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removePic(id);
      });
    },
    handleRemoveActive(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeActive(id);
      });
    },
    removeActive(id) {
      for (let i = 0; i < this.activeAnswerList.length; i++) {
        if (this.activeAnswerList[i].id === id) {
          this.activeAnswerList.splice(i, 1);
        }
        this.selectedItemKeysActive.forEach((element, index) => {
          if (element === id) {
            this.selectedItemKeysActive.splice(index, 1);
            return false;
          }
        });
      }
    },
    removePic(id) {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].id === id) {
          this.productList.splice(i, 1);
        }
        this.form.productList = this.productList.map(product => {
          return { id: product.id };
        });
        this.selectedItemKeys.forEach((element, index) => {
          if (element === id) {
            this.selectedItemKeys.splice(index, 1);
            return false;
          }
        });
      }
    },
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        question: '',
        similarQuestion: [],
        type: '0',
        answer: '',
        id: '',
        name: '',
        matchMode: '1',
        weight: '0',
        files: [],
        fileList: []
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
      this.productList = [];
    },
    typeChange() {
      this.form.answer = '';
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.form.type === '10001') {
            this.$message.warning('请选择类型');
            return;
          }
          if (this.form.type === '1002') {
            this.form.answer = this.form.files[0];
          }
          if (this.form.type === '1001') {
            let productId = this.form.productList.map(item => {
              return item.id;
            });
            this.form.answer = productId.join(',');
          }
          if (this.form.type === '1005' || this.form.type === '1006') {
            let activeId = this.activeAnswerList.map(item => {
              return item.id;
            });
            this.form.answer = activeId.join(',');
          }
          this.form.similarQuestion =
            this.form.similarQuestion.length > 0
              ? this.form.similarQuestion.map(item => {
                return item.name;
              })
              : [];
          this.form = Object.assign(this.form, {
            similarQuestion: this.form.similarQuestion
          });

          if (this.form.id) {
            http
              .put(customerService.smartReception.knowledgeStock, this.form)
              .then(data => {
                this.loading = false;
                this.$message.success('更新成功');
                this.$emit('created');
                this.refresh(data.id);
              })
              .catch(ErrorData => {
                this.loading = false;
                console.log('ERR_REFRESH: ', ErrorData);
                this.$message.warning(ErrorData.errorMessage);
              });
          } else {
            http
              .post(customerService.smartReception.knowledgeStock, this.form)
              .then(data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('created');
                this.refresh(data.id);
              })
              .catch(ErrorData => {
                this.loading = false;
                console.log('ERR_REFRESH: ', ErrorData);
                this.$message.warning(ErrorData.errorMessage);
              });
          }
        }
      });
    },
    refresh(id) {
      this.loading = true;
      let params = { id: this.itemId || id };
      http
        .get(customerService.smartReception.knowledgeStock, params)
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.resetForm(), data.data);
          if (this.form.type === '1002') {
            this.form.files = [this.form.answer];
            this.form.fileList = [{ name: this.form.answer, url: this.form.answer }];
          }
          this.form.similarQuestion =
            data.data.similarQuestion && data.data.similarQuestion.length > 0
              ? data.data.similarQuestion.map(item => {
                return { name: item };
              })
              : [];
          if (this.form.type === '10001') {
            this.form.type = '0';
          }
          if (this.form.type === '1001') {
            let ids = this.form.answer.split(',');
            this.queryProductsByIds(ids);
          }
          if (this.form.type === '1005' || this.form.type === '1006') {
            let ids = this.form.answer.split(',');
            this.queryActivesByIds(ids);
          }
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    addProblem() {
      this.form.similarQuestion.push({ name: '' });
    }
  },
  mounted() {
    this.getFunctionAnswerList();
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal) {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.qa-mgmt-info {
  .biz-save-button {
    float: left;
  }
  .el-radio + .el-radio {
    margin-left: 0px;
  }
  .el-radio {
    margin-right: 10px;
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
  textarea[name='editorValue'] {
    display: none;
  }
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
    width: 120px;
    height: auto;
  }
  .avatar-uploader {
    cursor: pointer;
    width: 100px;
    height: 100px;
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
      line-height: 100px;
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
}
</style>
