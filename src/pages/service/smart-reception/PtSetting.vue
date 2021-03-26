<template>
  <biz-grid class="pt-setting" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate">
    </biz-header>
    <el-table :data="tableData" style="width: 100%"  @selection-change="handleSelectionChange" @row-click="rowClick" size="small">
      <!-- <el-table-column type="selection" width="50">
      </el-table-column> -->
      <el-table-column label="点位" prop="name"></el-table-column>
      <el-table-column label="坐标点" prop="points">
        <div slot-scope="scope">
          <div>{{scope.row.position?scope.row.position.split(':')[0].substring(1): ''}}</div>
        </div>
      </el-table-column>
      <el-table-column label="描述" prop="refName">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.mark==='1'?'商品点位':scope.row.mark==='2'?'接待点位':''}}</div>
          <div class="biz-customcol">{{scope.row.refName}}</div>
        </div>
      </el-table-column>
    </el-table>
    <el-card class="box-card" v-show="showForm" style="margin-top: 20px;" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
        <el-form-item label="点位" prop="name">
          <el-input v-model="formModel.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="location" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="location">
          <el-select v-model="formModel.mark" placeholder="请选择类型" @change="markChange">
            <el-option label="无" value="0"></el-option>
            <el-option label="商品点位" value="1"></el-option>
            <el-option label="接待点位" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联商品" prop="refName" v-if="formModel.mark==='1'">
          <el-input v-model="formModel.refName" @focus="addProduct"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-card>
    <!-- 商品选择 -->
    <biz-dialog-selector :loading="dialogLoading" :visibility.sync="showDialog" :tableData="productList" :pagination="pagination"
      :filters="productFilters" :selectionMode="'single'" :selectionKeys="selectedItemKeys" @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange" @confirmed="confirm" @filterDataChange="filterDataChange">
      <el-table-column property="sn" label="编号"></el-table-column>
      <el-table-column property="name" label="名称"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import urls from '@/common/urls';
import http from '@/common/http';
import BizDialogSelector from '@/components/BizDialogSelector';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  data() {
    return {
      rules: {
        // beanCount: [
        //   { required: true, message: '请输入调整V豆', trigger: 'blur' },
        //   { pattern: /^(-)?[1-9][0-9]*$/, message: '格式错误', trigger: 'blur' }
        // ]
      },
      loading: false,
      formLoading: false,
      showForm: false,
      showDialog: false,
      dialogLoading: false,
      totalBean: '',
      location: '',
      // 用户信息
      formModel: {
        id: '',
        name: '',
        refId: '',
        mapId: '',
        type: '',
        position: '',
        mark: ''
      },
      operations: [
        // {
        //   label: '新增',
        //   name: 'add',
        //   type: 'primary'
        // },
        // {
        //   label: '删除',
        //   name: 'delete',
        //   type: 'primary'
        // }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selections: [],
      tableData: [],
      productList: [],
      selectedItemKeys: [],
      points: [],
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
  created() {},
  mounted() {},
  watch: {
    itemId(newVal, oldVal) {
      if (newVal) {
        this.query();
      }
    }
  },
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    query() {
      this.loading = true;
      this.showForm = false;
      let params = {
        mapId: this.itemId,
        type: '0'
      };
      http
        .get(urls.customerService.smartReception.queryRobotMapSetting, params)
        .then(data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(data => {
          this.loading = false;
        });
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.formModel.id) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    add() {
      this.showForm = true;
    },
    markChange(val) {
      if (val !== '1') {
        this.formModel.refId = '';
        this.formModel.refName = '';
      }
    },
    rowClick(row) {
      this.formModel.id = row.id;
      this.formModel.mapId = this.itemId;
      this.formModel.name = row.name;
      this.formModel.refId = row.refId;
      this.formModel.refName = row.refName;
      this.formModel.type = row.type;
      this.formModel.mark = row.mark;
      this.formModel.position = row.position;
      this.location = row.position
        ? row.position.split(':')[0].substring(1)
        : '';
      this.showForm = true;
    },
    update() {
      this.loading = true;
      http
        .put(
          urls.customerService.smartReception.robotMapSetting,
          this.formModel
        )
        .then(data => {
          this.$message.success('更新成功');
          this.query();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(data => {
          this.loading = false;
        });
    },
    create() {
      this.loading = true;
      http
        .post(
          urls.customerService.smartReception.robotMapSetting,
          this.formModel
        )
        .then(data => {
          this.$message.success('保存成功');
          this.query();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(data => {
          this.loading = false;
        });
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
          .delete(urls.customerService.smartReception.robotMapSetting, {
            ids: ids
          })
          .then(data => {
            this.tableData = data.data;
            this.loading = true;
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(data => {
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
    cancelForm() {
      this.showForm = false;
    },
    // 添加商品
    addProduct() {
      this.queryProductList();
      this.showDialog = true;
    },
    // dialog确认
    confirm(keys, key) {
      this.formModel.refId = key[0].id;
      this.formModel.refName = key[0].fullName;
    },
    // dialog过滤器发生变动
    filterDataChange(val) {
      // this.filters = val;
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
        type: '0',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.dialogLoading = true;
      http
        .get(urls.contentMgmt.publicity.editArticle.queryProductList, params)
        .then(data => {
          this.dialogLoading = false;
          this.productList = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    showStorePicker(e) {
      this.showDialog = true;
    }
  }
};
</script>

<style lang="scss">
.pt-setting {
  padding: 20px;

  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .header_bean {
    position: absolute;
    right: 0px;
    top: 10px;
    color: #606266;
    font-size: 14px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
