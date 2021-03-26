<template>
  <el-dialog :title="title" :visible="open" @close="onClose" :append-to-body="true">
    <el-form :rules="rules" :model="form" ref="form" label-width="80px" size="small" v-loading="loading">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type" @change="typeChange">
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
      <el-form-item label="问题" prop="question">
        <el-input placeholder="请输入问题" v-model="form.question">
          <el-button slot="append" icon="el-icon-plus" @click="addProblem"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item
        label="相似问题"
        v-for="(question, index) of form.similarQuestion"
        :key="question.key"
        :prop="'similarQuestion.' + index + '.value'"
        :rules="{required: true, message: '请输入问题', trigger: 'blur'}"
      >
        <el-input v-model="question.value"></el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='0' || form.type==='2'">
        <el-input placeholder="请输入答案" type="textarea" v-model="form.answer" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='1'">
        <biz-editor v-show="form.type==='1'" ref="editor" height="400px" width="320px" v-model="form.answer"></biz-editor>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='3'">
        <BizAvatarUploaderNew v-model="form.answer"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="答案" prop="files" v-if="form.type==='1002'">
        <biz-file-uploader :data="{type:2}" v-model="form.files" :fileList="form.fileList" @fileListChange="fileListChange"></biz-file-uploader>
      </el-form-item>
      <el-form-item label="答案" prop="productList" v-if="form.type==='1001'">
        <div class="product-list el-upload-list el-upload-list--picture-card">
          <div tabindex="0" class="img-preview el-upload-list__item is-success" v-for="product in productList" :key="product.index">
            <img :src="product.image||defaultImg" alt class="el-upload-list__item-thumbnail" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete" @click="handleRemove(product.id)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
            <div class="detail_info">
              <span>{{product.fullName||product.name}}</span>
              <span>￥{{product.price}}元</span>
            </div>
          </div>
          <div class="avatar-uploader" @click="addProduct">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type==='1004'">
        <el-select v-model="form.answer" placeholder="请选择">
          <el-option label="预约体验" value="预约体验"></el-option>
          <el-option label="购车计算" value="购车计算"></el-option>
          <el-option label="车型对比" value="车型对比"></el-option>
          <el-option label="我的订单" value="我的订单"></el-option>
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
    <biz-save-button :operations="operations" @operate="operate"></biz-save-button>
    <biz-dialog-selector
      :loading="dialogLoading"
      :visibility.sync="showDialog"
      :tableData="products"
      :pagination="pagination"
      :filters="productFilters"
      :selectionKeys="selectedItemKeys"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"
      @confirmed="confirm"
      @filterDataChange="filterDataChange"
    >
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
  </el-dialog>
</template>

<script>
import { BizEditor } from '@/components/BizEditorH';
import { BizFileUploader, BizAvatarUploaderNew } from '@/components/BizForm';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import BizDialogSelector from '@/components/BizDialogSelector';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { customerService, commodity } from '@/common/urls';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';

export default {
  name: 'process-qa-item',
  components: {
    BizEditor,
    BizFileUploader,
    BizDialogSelector,
    BizAvatarUploaderNew,
    BizSaveButton
  },
  props: {
    open: Boolean,
    flowId: {
      type: String,
      default() {
        return '';
      }
    },
    parenteId: {
      type: String,
      default() {
        return '';
      }
    },
    itemObjId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  data() {
    return {
      dialogLoading: false,
      showDialog: false,
      showDialogActive: false,
      products: [],
      productList: [],
      selectedItemKeys: [],
      actives: [],
      selectedItemKeysActive: [],
      activeAnswerList: [],
      title: '编辑问答',
      loading: false,
      defaultImg: DefaultImg,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        },
        {
          label: '取消',
          name: 'cancel',
          type: ''
        }
      ],
      form: {
        type: '0',
        matchMode: '0',
        weight: '0',
        question: '',
        similarQuestion: [],
        answer: ''
      },
      rules: {
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
      }
    };
  },
  computed: {},
  watch: {
    itemObjId(itemObjId) {
      if (itemObjId.id) {
        this.query();
      } else {
        this.clear();
      }
    }
  },
  created() {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.form.type === '1002') {
            this.form.answer = this.form.files[0];
          }
          if (this.form.type === '1001') {
            if (this.productList.length <= 0) {
              this.$message.warning('请添加商品');
              return;
            }
            this.form.answer = this.productList.map(item => item.id).join(',');
          }
          if (this.form.type === '1005' || this.form.type === '1006') {
            let activeId = this.activeAnswerList.map(item => {
              return item.id;
            });
            this.form.answer = activeId.join(',');
          }
          if (this.itemObjId.id) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    create() {
      let params = {
        flowId: this.flowId,
        parenteId: this.parenteId,
        type: this.form.type,
        matchMode: this.form.matchMode,
        answer: this.form.answer,
        question: this.form.question,
        similarQuestion: this.form.similarQuestion.map(item => item.value)
      };
      http
        .post(customerService.processQA.node, params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('refresh');
          this.$emit('close');
          this.clear();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      let params = {
        flowId: this.flowId,
        id: this.itemObjId.id,
        parenteId: this.parenteId,
        type: this.form.type,
        matchMode: this.form.matchMode,
        answer: this.form.answer,
        question: this.form.question,
        similarQuestion: this.form.similarQuestion.map(item => item.value)
      };
      http
        .put(customerService.processQA.node, params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('refresh');
          this.$emit('close');
          this.clear();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    cancel() {
      this.$emit('close');
    },
    typeChange() {
      this.form.answer = '';
    },
    addProblem() {
      this.form.similarQuestion.push({
        value: '',
        key: Date.now()
      });
    },
    onClose() {
      this.$emit('close');
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    },
    // dialog过滤器发生变动
    filterDataChange(val) {
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
      this.queryProductsByIds();
    },
    confirmActive(keys, row) {
      console.log(row);
      this.selectedItemKeysActive = keys || this.selectedItemKeysActive;
      this.activeAnswerList = row;
    },
    // 根据ID查询商品
    queryProductsByIds() {
      let promises = [];
      for (const id of this.selectedItemKeys) {
        let params = {
          id,
          shopId: window.top.SHOP_ID || ''
        };
        promises.push(http.get(commodity.queryProductBasicInfo, params));
      }
      Promise.all(promises).then(list => {
        this.productList = list.map(item => item.productBasicInfoData);
        this.form.answer = this.productList.map(item => item.id).join(',');
      });
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
    removePic(id) {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].id === id) {
          this.productList.splice(i, 1);
        }
        this.selectedItemKeys.forEach((element, index) => {
          if (element === id) {
            this.selectedItemKeys.splice(index, 1);
            return false;
          }
        });
      }
      this.form.answer = this.productList.map(item => item.id).join(',');
    },
    query() {
      let params = {
        id: this.itemObjId.id
      };
      http
        .get(customerService.processQA.node, params)
        .then(data => {
          this.form.type = data.data.type;
          this.form.matchMode = data.data.matchMode;
          this.form.question = data.data.question;
          this.form.similarQuestion = data.data.similarQuestion.map(item => {
            return {
              value: item,
              key: Date.now()
            };
          });

          if (this.form.type === '1002') {
            this.form.files = [data.data.answer];
            this.form.fileList = [{ name: data.dataanswer, url: data.data.answer }];
          } else if (this.form.type === '1001') {
            this.selectedItemKeys = data.data.answer.split(',');
            this.queryProductsByIds();
          } else if (this.form.type === '1005' || this.form.type === '1006') {
            let ids = data.data.answer.split(',');
            this.queryActivesByIds(ids);
          } else {
            this.form.answer = data.data.answer;
          }
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 根据ID查询活动
    queryActivesByIds(ids) {
      http
        .post('/admin/marketing/activityList.jhtml', { ids: ids })
        .then(data => {
          this.activeAnswerList = data.activityList;
          // this.form.answer = this.activeAnswerList.map(item => item.id).join(',');
        })
        .catch();
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
    clear() {
      this.form.answer = '';
      this.form.type = '0';
      this.form.matchMode = '0';
      this.form.question = '';
      this.form.similarQuestion = [];
      this.products = [];
      this.productList = [];
      this.selectedItemKeys = [];
    },
    fileListChange(fileList) {
      console.log(fileList);
    }
  }
};
</script>
