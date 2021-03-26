<template>
  <biz-grid class="potential-customer-mgmt__test-drive" v-loading="loading">
    <biz-header slot="top" :operations="operations" @operate="handleOperate" style="float:left">
    </biz-header>
    <biz-list
      ref="table"
      :tableData="tableData"
      :key="Math.random()"
      :height="'100%'"
      @handleSelectionChange="handleSelectionChange"
      @rowClick="handleRowClick"
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column label="日期" prop="createDate" :formatter="dateConverter"></el-table-column>
      <el-table-column label="体验商品">
        <template slot-scope="scope">
          {{scope.row.product?scope.row.product.name:''}}
        </template>
      </el-table-column>
      <el-table-column label="体验详情">
        <template slot-scope="scope">
          <div>
            <div>体验时长{{dateInterval(scope.row.startTime,scope.row.endTime)}}</div>
            <div v-if="scope.row.remarks!==''">备注：{{scope.row.remarks}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="55">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)" style="margin-right:4px;">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="体验开始时间" prop="startTimeText">
          <el-date-picker type="datetime" v-model="formModel.startTimeText" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间"
            :editable="false" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="体验结束时间" prop="endTimeText">
          <el-date-picker type="datetime" v-model="formModel.endTimeText" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间"
            :editable="false" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="体验商品" prop="product">
          <el-select filterable allow-create placeholder="请选择体验商品" v-model="formModel.product.id">
            <el-option v-for="item in productTableData" :key="item.product.id" :label="item.product.name" :value="item.product.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.remarks" maxlength="100" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>
<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import BizList from '@/components/BizTable/BizList';
import { BizPagination } from '@/components/BizTable';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
// 基础内容
const dataBase = {
  data: {
    loading: false,
    pagination: {
      pageSize: 20,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      pagerCount: 2
    },
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary',
        auth: ['admin:potential.edit']
      },
      {
        disabled: true,
        label: '删除',
        name: 'delete',
        type: '',
        auth: ['admin:potential.edit']
      }
    ],
    productTableData: []
  },
  methods: {
    ...mapGetters(['getUser']),
    dateInterval(val, val1) {
      if (val && val1) {
        let dateBegin = new Date(val);
        let dateEnd = new Date(val1);
        let dateDiff = dateEnd.getTime() - dateBegin.getTime();
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
        let leave1 = dateDiff % (24 * 3600 * 1000);
        let hours = Math.floor(leave1 / (3600 * 1000));
        let leave2 = leave1 % (3600 * 1000);
        let minutes = Math.floor(leave2 / (60 * 1000));
        let leave3 = leave2 % (60 * 1000);
        let seconds = Math.round(leave3 / 1000);
        return (dayDiff > 0 ? dayDiff + 'd' : '') + (hours > 0 ? hours + 'h' : '') + minutes + 'min' + (seconds > 0 ? seconds + 's' : '');
      }
    },
    queryProduct() {
      let params = {
        shopId: this.getUser().shop ? this.getUser().shop.id : '' || window.top.SHOP_ID,
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get('/admin/testDriveMgmt/testDrives.jhtml', params)
        .then(data => {
          this.productTableData = this.unique(data.dataList);
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    unique(newarr) {
      let res = new Map();
      return newarr.filter(arr => !res.has(arr.product.id) && res.set(arr.product.id, 1));
    },
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        viewMode: this.viewMode,
        potentialConsumerId: this.itemId.id,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
    },
    query() {
      this.loading = true;

      http
        .get(potentialCustomerMgmt.testDrive.list, this.getQueryParams())
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.showForm = false;
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

    add() {
      this.initForm();
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
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  }
};

// Table相关
const dataTable = {
  data: {
    tableData: [],
    selections: []
  },
  methods: {
    dateConverter(row) {
      if (row.createDate) {
        row.createDate = row.createDate.replace(/-/g, '/');
        let date = new Date(row.createDate);
        return dateUtil.dateConverter(date);
      } else {
        return '--';
      }
    },
    startTimeConverter(row) {
      if (row.startTime) {
        row.startTime = row.startTime.replace(/-/g, '/');
        let date = new Date(row.startTime);
        return dateUtil.shortTimeConverter(date);
      } else {
        return '--';
      }
    },
    endTimeConverter(row) {
      if (row.endTime) {
        row.endTime = row.endTime.replace(/-/g, '/');
        let date = new Date(row.endTime);
        return dateUtil.shortTimeConverter(date);
      } else {
        return '--';
      }
    },

    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          viewMode: this.viewMode,
          ids: ids
        };
        http
          .delete(potentialCustomerMgmt.testDrive.delete, params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
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
      });
    }
  },
  events: {
    rowDeleteClickHandler(e, row) {
      e.stopPropagation();

      this.deleteItem([row.id]);
    },
    handleRowClick(row) {
      this.queryItem(row.id);
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.selections = val;
    }
  }
};

// 表单相关
const getDefaultFormModel = () => {
  let time = new Date();
  console.log(time.getHours());
  let hours = time.getHours();
  let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  return {
    startTimeText: dateUtil.nowDate() + ' ' + hours + ':' + minutes + ':' + seconds,
    endTimeText: dateUtil.nowDate() + ' ' + hours + ':' + (minutes + 30) + ':' + seconds,
    product: { id: '', name: '' }
  };
};
const dataForm = {
  data: {
    formLoading: false,
    showForm: false,
    formModel: getDefaultFormModel(),
    formOperations: [
      {
        label: '取消',
        name: 'cancelForm'
      },
      {
        label: '保存',
        name: 'saveForm',
        type: 'primary'
      }
    ]
  },
  methods: {
    queryItem(id) {
      this.formLoading = true;
      http
        .get(potentialCustomerMgmt.testDrive.item, {
          testDriveRecordId: id,
          potentialConsumerId: this.itemId.id,
          viewMode: this.viewMode
        })
        .then(data => {
          // 设置对象的默认值，并且整理字段
          let obj = data.testDriveRecord;
          // obj.testTime = new Date(obj.testTime.replace(/-/g, '/'));
          obj.startTimeText = obj.startTime;
          obj.endTimeText = obj.endTime;
          obj.brand = obj.product.brandId ? obj.product.brandId.toString() : '';
          obj.series = obj.product.seriesId ? obj.product.seriesId.toString() : '';

          this.initForm(obj);
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.formLoading = false;
        });
    },
    initForm(model) {
      this.showForm = true;
      let defaultModel = getDefaultFormModel();
      this.formModel = model ? Object.assign(defaultModel, model) : defaultModel;

      if (this.$refs.form) this.$refs.form.resetFields();
    },

    cancelForm() {
      this.showForm = false;
    },
    getSaveParams() {
      return {
        token: '',
        id: this.formModel.id,
        remarks: this.formModel.remarks,
        product: {
          id: this.formModel.product.id
        },
        startTime: this.formModel.startTimeText,
        endTime: this.formModel.endTimeText,
        potentialConsumerId: this.itemId.id,
        shopId: window.top.SHOP_ID || '',
        viewMode: this.viewMode
      };
    },
    saveForm() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = this.getSaveParams();
          !this.formModel.id &&
            http
              .post(potentialCustomerMgmt.testDrive.add, params)
              .then(data => {
                this.query();
                this.showForm = false;
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) {
                  this.$message.warning(errData.errorMessage);
                }
              })
              .finally(data => {
                this.loading = false;
              });
          this.formModel.id &&
            http
              .put(potentialCustomerMgmt.testDrive.update, params)
              .then(data => {
                this.query();
                this.showForm = false;
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) {
                  this.$message.warning(errData.errorMessage);
                }
              })
              .finally(data => {
                this.loading = false;
              });
        } else {
          return false;
        }
      });
    }
  },
  events: {}
};

export default {
  name: 'PotentialCustomerTestDrive',
  components: {
    BizHeader,
    BizGrid,
    BizList,
    BizPagination,
    BizSaveButton
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    viewMode: {
      type: String,
      default() {
        return 'merge';
      }
    }
  },
  data() {
    return {
      ...dataBase.data,
      ...dataTable.data,
      ...dataForm.data,

      rules: {
        startTimeText: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.startTimeText > this.formModel.endTimeText) {
                callback(new Error('开始时间不能大于结束时间'));
              } else {
                callback();
              }
            }
          }
        ],
        endTimeText: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.startTimeText > this.formModel.endTimeText) {
                callback(new Error('结束时间不能小于开始时间'));
              } else {
                callback();
              }
            }
          }
        ],
        product: [
          { required: true, message: '请选择车型', trigger: ['blur', 'change'] },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!this.formModel.product.id) {
                callback(new Error('请选择体验车型'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    ...dataBase.methods,
    ...dataBase.events,

    ...dataTable.methods,
    ...dataTable.events,

    ...dataForm.methods,
    ...dataForm.events
  },
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      }
    }
  },
  created() {
    this.queryProduct();

    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__test-drive {
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
