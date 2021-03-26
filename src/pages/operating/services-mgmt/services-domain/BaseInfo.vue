<template>
  <biz-grid class="services-mgmt-order-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" label-width="120px" size="small" v-loading="loading"  :inline-message="true">
      <el-form-item label="领域名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="基础服务">
        <div style="display:flex;flex-flow: wrap;">
          <div class="tag-container" v-for="(item, index) in form.baseTags" :key="index" style="padding:3px">
            <el-tag :closable="item.deletable&&item.deletable==='0'?false:true" @close="onClose(item)" class="member-tag">
              {{item.name}}</el-tag>
          </div>
        </div>
        <el-button type="primary" size="small" @click="onClickHandle">+</el-button>
      </el-form-item>
      <el-form-item label="基础商品分类">
        <div style="display:flex;flex-flow: wrap;">
          <div class="tag-container" v-for="(item, index) in form.classTags" :key="index" style="padding:3px">
            <el-tag  @close="onCloseClass(item)" class="member-tag" closable>
              {{item.name}}</el-tag>
          </div>
        </div>
        <el-button type="primary" size="small" @click="onClickHandleClass">+</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="promotion-dialog-checkbox" title="选择分类" :visible.sync="showClassSelector" append-to-body>
      <!-- <el-checkbox-group v-model="classArr">
        <el-checkbox v-for="category in baseInfo.productCategories" :key="category.index" :label="category.id">{{category.name}}
        </el-checkbox>
      </el-checkbox-group> -->
      <el-tree :props="defaultProps" node-key="id" :highlight-current="highlightCurrent" :data="dataTree" show-checkbox
        @check-change="handleCheckChange" ref="tree">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showClassSelector = false">取 消</el-button>
        <el-button type="primary" @click="confirmClasses">确 定</el-button>
      </span>
    </el-dialog>
    <biz-dialog-selector title="选择服务" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :tableData="dialogTableData" :pagination="dialogPagination"
      :selectionMode="'multi'" :filters="dialogFilters" @confirmed="handleConfirmed"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @selectionChange="selectionChange" @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="fullName" label="服务名称">
      </el-table-column>
      <el-table-column prop="description" label="服务简介">
        <template slot-scope="scope">
          {{getContent(scope.row.businessService.description)}}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="服务价格">
        <template slot-scope="scope">
          ¥{{scope.row.price}}
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizDialogSelector from './BizDialogSelector';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'BaseInfo',
  data() {
    return {
      highlightCurrent: true,
      showDialog: false,
      loading: false,
      showSelecTags: false,
      showClassSelector: false,
      selectionKeys: [],
      dialogTableData: [],
      selections: [],
      selectionList: [],
      // 选中的分类项
      classArr: [],
      tagTypeOptions: [],
      tagOptions: [],
      selectTag: [],
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入服务名称',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: this.getDefaultModel()
    };
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case 'unpaid':
          return '买家未付款';
        case 'paid':
          return '交易完成';
        case 'cancelled':
          return '交易关闭';
        default:
          return '';
      }
    }
  },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = Number(value).toFixed(2);
      // num.toFixed(2)获取的是字符串
      return Number(realVal);
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    refreshSign: Boolean
  },
  components: {
    BizGrid,
    BizDialogSelector,
    BizSaveButton
  },
  watch: {
    refreshSign: function() {
      this.refresh();
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    getContent(content) {
      return content ? content.replace(/<.*?>/ig, '') : '';
    },
    clear() {
      this.form = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        id: '',
        name: '',
        baseTags: [],
        classTags: []
      };
    },
    refresh(id = '') {
      let params = { id: id || this.id, userId: this.getUser().id };
      http
        .get('/admin/businessServiceDomain/domain.jhtml', params)
        .then(data => {
          this.form = Object.assign(this.getDefaultModel(), data.content);
          this.form.baseTags = data.content.serviceIds.map(item => {
            return item.serviceData;
          });
          let arr = [];
          data.content.serviceIds.forEach((element, index) => {
            // 去重
            if (index === 0) {
              arr = arr.concat(element.categoryDatas || []);
            }
          });
          this.form.classTags = arr;
          this.loading = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      let arr = [];
      let brr = this.form.classTags.map(item => {
        return item.id;
      });
      arr = this.form.baseTags.map(item => {
        return { serviceId: item.businessService ? item.businessService.id : item.id, categoryIds: brr };
      });
      let params = { id: this.id, userId: this.getUser().id, name: this.form.name, serviceIds: arr };
      if (this.id) {
        http.put('/admin/businessServiceDomain/domain.jhtml', params)
          .then(data => {
            this.$message.success('操作成功');
            this.$emit('operationSuccess');
            this.loading = false;
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            this.loading = false;
            this.$message.warning(errData.errorMessage);
          });
      } else {
        http.post('/admin/businessServiceDomain/domain.jhtml', params)
          .then(data => {
            this.$message.success('操作成功');
            this.refresh(data.id);
            this.$emit('operationSuccess');
            this.loading = false;
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            this.loading = false;
            this.$message.warning(errData.errorMessage);
          });
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      console.log(this.$refs.tree.getCheckedNodes());
      this.$nextTick(() => {
        this.classArr = this.$refs.tree.getCheckedNodes().map(item => {
          return item.id;
        });
      });
    },
    loadNode() {
      http
        .get('/admin/product_category/listPlatformCategory.jhtml', {
          pageNumber: 1,
          pageSize: 1000
        })
        .then(data => {
          this.dataTree = [];
          data.ProductCategoryManage.map(item => {
            this.dataTree.push({
              label: item.name,
              id: item.id,
              children: item.childrenProductCategoryDataList.map(element => {
                return { label: element.name, id: element.id };
              })
            });
          });
          this.$refs.tree.setCheckedKeys(
            this.form.classTags.map(item => {
              return item.id;
            })
          );
          console.log(this.dataTree);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    selectionChange(selections) {
      console.log(selections);
      this.selectionList = [];
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    handleConfirmed(selectionKeys, selections) {
      console.log(this.selectionList);
      console.log(this.selectionKeys);
      let arr = [];
      for (const iterator of selections) {
        this.selectionList.push(iterator);
      }
      this.selectionList = this.unique(this.selectionList);
      this.selectionList.map(item => {
        if (!this.selectionKeys.includes(item.businessService.id)) {
          arr.push(item);
        }
      });
      this.form.baseTags = this.form.baseTags.concat(arr.map(item => {
        return item.businessService;
      }));
      this.selectionKeys = this.form.baseTags.map(item => {
        return item.id;
      });
    },
    unique(newarr) {
      let res = new Map();
      return newarr.filter(arr => !res.has(arr.businessService.id) && res.set(arr.businessService.id, 1));
    },
    confirmClasses() {
      this.showClassSelector = false;
      this.productCategories = [];
      this.$refs.tree.getCheckedNodes().map(category => {
        if (this.classArr.indexOf(category.id) !== -1) {
          this.productCategories.push({ id: category.id, name: category.label });
        }
      });
      console.log(this.form.classTags);
      this.form.classTags = this.productCategories;
      console.log(this.form.classTags);
    },
    onClickHandle() {
      let params = {
        searchValue: this.dialogFilters[0].value,
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize
      };
      http
        .get('/admin/businessProduct/pageFrontend.jhtml', params)
        .then(data => {
          this.dialogTableData = data.dataList;
          console.log(this.form.baseTags);
          this.dialogPagination.total = Number(data.total);
          this.showDialog = true;
          this.selectionKeys = this.form.baseTags.map(item => {
            return item.id;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    onClickHandleClass() {
      this.loadNode();
      this.showClassSelector = true;
    },
    onClose(tag) {
      let ary = this.form.baseTags;
      let len = ary.length;
      for (let i = 0; i < len; i++) {
        if (ary[i] === tag) {
          ary.splice(i, 1);
          break;
        }
      }
    },
    onCloseClass(tag) {
      let ary = this.form.classTags;
      let len = ary.length;
      for (let i = 0; i < len; i++) {
        if (ary[i] === tag) {
          ary.splice(i, 1);
          break;
        }
      }
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.onClickHandle(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.onClickHandle(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.onClickHandle(this.getDialogQueryParams());
    },
    getSaveParams() {
      return {
        businessOrderId: this.id
      };
    }
  }
};
</script>

<style lang="scss">
.services-mgmt-order-base-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
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
