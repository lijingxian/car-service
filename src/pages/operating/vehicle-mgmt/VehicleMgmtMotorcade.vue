<template>
  <div class="vehicle-mgmt-fleet-vehicle">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :pagination="pagination" :tableData="tableData"
      :loading="loading" @operate="operateHandler" @size-change="pageSizeChange" @current-change="currentPageChange"
      @selection-change="selectionChangeHandler" @filter-data-change="filterDataChangeHandler"
      @row-click="rowOperationClickHandler">
      <el-table-column label="名称" min-width="130">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <el-button type="text" size="mini" @click="handleRouterPush($event, scope.row)">
                {{scope.row.name}}
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="area.name" label="地址" min-width="130">
        <template slot-scope="scope">
          <div class="customer-info">
            {{scope.row.area?scope.row.area.name?scope.row.area.name:'北京市朝阳区':'北京市朝阳区'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="memberCount" label="成员数">
      </el-table-column>
      <el-table-column prop="shop.name" label="所属店铺" min-width="130">
      </el-table-column>
      <el-table-column prop="owner.name" label="管理员" min-width="100">
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">

        <template slot-scope="scope" v-if="scope.row.unionConfig.editable === '1'|| getUser().roleLevel !== 'shop'">
          <el-button type="text" size="mini" @click.stop="deleteHandler($event, scope.row)" v-if="hasAuthDel">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <el-dialog title="导入" :visible.sync="dialogUploadVisible" width="500px">
        <el-form ref="uploadForm" size="small" label-width="110px" :model="uploadModel" :rules="uploadRules">
          <el-form-item label="导入文件" prop="file" :value="uploadModel.file">
            <div v-show="uploadModel.file">{{uploadModel.file}}</div>
            <el-upload :show-file-list="false" :on-success="handleFileUploadSuccess" :data="fileData" name="file"
              action="/admin/file/uploads.jhtml">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <biz-save-button :operations="uploadOperations" @operate="operateHandler" style="margin-right: 0;">
        </biz-save-button>
      </el-dialog>

      <motorcade-popup :open="open" :itemId="itemId" @close="open = false;" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </motorcade-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import MotorcadePopup from './motorcade/MotorcadePopup';
import http from '@/common/http';
import service from '@/service/vehicle-mgmt/VehicleMgmtMotorcade';
import { global } from '@/common/urls';
export default {
  name: 'VehicleMgmtMotorcade',
  components: {
    BizFlexTable,
    BizSaveButton,
    MotorcadePopup
  },
  props: {},
  data() {
    return {
      // 控件
      itemId: { id: '' },
      classId: '',
      selections: [],
      editShopIds: [],
      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      isEdit: true,
      tableData: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['caradmin:operateFleet.add']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['caradmin:operateFleet.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '所属店铺',
          name: 'shopName',
          filterable: true,
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
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },

      dialogUploadVisible: false,
      uploadModel: this.getDefaultUploadForm(),
      uploadRules: {
        file: [{ required: true, message: '请选择上传文件', trigger: 'blur' }]
      },
      uploadOperations: [
        {
          label: '取消',
          name: 'cancelUpload'
        },
        {
          label: '保存',
          name: 'saveUpload',
          type: 'primary',
          auth: ['caradmin:operateFleet.edit']
        }
      ],
      fileData: {
        type: '0'
      }
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('caradmin:operateFleet.delete');
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        service.delete(
          {
            ids: ids
          },
          data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          }
        );
      });
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '7'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    queryShopList() {
      http
        .get('/admin/member/json/findEShops.jhtml', {
          shopId: window.top.SHOP_ID || '',
          sourceType: '7'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[0], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage !== '店铺不存在') this.$message.warning(errData.errorMessage);
        });
    },
    operationSuccess() {
      this.open = false;
      this.query();
    },
    operateHandler(name) {
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler(model, e, column) {
      if (column.label === '操作') return;
      if (model.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.itemId = { id: model.id, userId: this.getUser().id };
      this.open = true;
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      this.operations[0].disabled = false;
      if (val.length > 0 || this.getUser().roleLevel !== 'shop') {
        this.operations[1].disabled = false;
      }
    },
    filterDataChangeHandler() {
      this.pagination.currentPage = 1;
      this.query();
    },
    deleteHandler(e, model) {
      this.deleteItem([model.id]);
    },
    handleRouterPush(e, model) {
      e.stopPropagation();

      this.$router.push({
        name: 'vehicle-mgmt-motorcade-vehicle',
        params: {
          groupId: model.id
        }
      });
    },

    refresh() {
      this.query();
    },

    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchShopId: this.filters[0].value,
        searchValue: this.filters[1].value,
        fleetType: 'group'
      };
    },
    query() {
      this.loading = true;
      service.query(
        this.getQueryParams(),
        data => {
          this.tableData = data.content;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));

          if (!this.inited) {
            let msg = '已建立车队数 ' + data.fleetCount + ', ' + '车队车辆总数 ' + data.memberTotalCount;
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: msg,
              duration: 3000
            });

            this.inited = true;
          }

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.loading = false;
          if (ErrorData.errorMessage !== '店铺不存在') this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    add() {
      this.open = true;
      this.itemId = { id: '' };
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个车队');
      }
    },

    getDefaultUploadForm() {
      return {
        file: ''
      };
    },
    cancelUpload() {
      this.dialogUploadVisible = false;
    },
    saveUpload() {
      this.$refs.uploadForm.validate((valid, a) => {
        if (valid) {
          service.upload(
            {
              file: this.uploadModel.file
            },
            data => {
              this.$message.success('保存成功');
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        } else {
          return false;
        }
      });
    },
    handleFileUploadSuccess(res) {
      console.log(res);
      this.uploadModel.file = res.fis[0].url;
    }
  },
  created() {
    this.query();
    this.queryShopList();
    this.getEditableStores();
  }
};
</script>

<style lang="scss">
.motorists-club-activity__kpi {
  top: 45px;
}

.vehicle-mgmt-fleet-vehicle {
  .customer-info {
    img {
      float: left;
      width: 48px;
      height: 48px;
    }

    .wrapper {
      margin-left: 56px;
      padding-top: 10px;
    }
  }
}
</style>
