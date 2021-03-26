<template>
  <div class="tag-class-mgmt">
    <biz-flex-table ref="table"
                    :operations="operations"
                    :filters="filters"
                    :tableData="tableData"
                    :loading="loading"

                    @operate="operateHandler"
                    @size-change="pageSizeChange"
                    @current-change="currentPageChange"
                    @selection-change="selectionChangeHandler"
                    @filter-data-change="filterDataChangeHandler"
                    @row-click="rowOperationClickHandler"
                    >
      <el-table-column prop="name" label="标签组" width="240">
      </el-table-column>
      <el-table-column label="标签名称">
        <template slot-scope="scope">
          <span
            v-for="(tag, index) in scope.row.tags"
            :key="index"
          >
            {{tag.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="deleteHandler($event, scope.row)"
            >
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>

    <div slot="float">
      <el-dialog
        title="导入"
        :visible.sync="dialogVisible"
        width="500px"
        :append-to-body="true"
      >
        <el-form
          ref="dialogForm"
          size="small"
          label-width="110px"
          :model="dialogModel"
          :rules="dialogRules"
        >
          <el-form-item label="分类" prop="classId">
            <el-select v-model="dialogModel.classId" placeholder="请选择分类" @change="handleClassChange" style="width: 100%;">
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签组" prop="groupId">
            <el-select v-model="dialogModel.groupId" placeholder="请选择标签组" style="width: 100%;">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <biz-save-button
          :operations="dialogOperations"
          @operate="operateHandler"
          style="margin-right: 0;"
          >
        </biz-save-button>
      </el-dialog>

      <tag-group-popup
        :open="open"
        :itemId="itemId"
        @close="handleClose"
        @operationSuccess="operationSuccess"
      ></tag-group-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import TagGroupPopup from './tagGroup/TagGroupPopup';

import service from '@/service/shop-rate/TagGroupMgmt';

export default {
  name: 'TagClassMgmt',
  components: {
    BizFlexTable,
    BizSaveButton,
    TagGroupPopup
  },
  props: {

  },
  watch: {
    $route(to, from) {
      this.query();
    }
  },
  data () {
    return {
      user: {},

      // 控件
      itemId: { id: '' },
      selections: [],
      classList: [],
      groupList: [],

      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      tableData: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '导入',
          name: 'import',
          type: 'primary'
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入标签组名称',
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

      dialogVisible: false,
      dialogModel: this.getDefaultDialogForm(),
      dialogRules: {
        classId: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择标签组', trigger: 'blur' }
        ]
      },
      dialogOperations: [
        {
          label: '取消',
          name: 'cancel'
        },
        {
          label: '导入',
          name: 'save',
          type: 'primary'
        }
      ]
    };
  },
  methods: {
    ...mapGetters(['getUser']),

    deleteItem (ids) {
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

    operationSuccess () {
      this.open = false;
      this.query();
    },
    operateHandler (name) {
      this[name]();
    },
    pageSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange (val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler (model, e, column) {
      if (column.label === '操作' || column.label === '名称') return;

      this.itemId = { id: String(model.id) };
      this.open = true;
    },
    selectionChangeHandler (val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    filterDataChangeHandler () {
      this.query();
    },
    deleteHandler (e, model) {
      this.deleteItem([model.id]);
    },
    handleRouterPush (e, model) {
      this.$router.push({
        name: 'vehicle-mgmt-motorcade-vehicle',
        params: {
          groupId: model.id
        }
      });
    },
    handleClose (e) {
      this.open = false;
      this.query();
    },

    getQueryParams () {
      return {
        // pageNumber: this.pagination.currentPage,
        // pageSize: this.pagination.pageSize,
        tagCategoryId: this.$route.params.classId,
        searchValue: this.filters[0].value
      };
    },
    query () {
      this.loading = true;
      service.query(
        this.getQueryParams(),
        data => {
          this.tableData = data.content;

          this.loading = false;

          if (!this.inited) {
            let count = 0;
            data.content.forEach(group => {
              if (group.tags) count += group.tags.length;
            });
            let msg =
              '共有标签组 ' + data.content.length +
              ' 个, 标签 ' + count + ' 个';
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: msg,
              duration: 3000
            });

            this.inited = true;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.loading = false;
        }
      );
    },
    queryClassList () {
      service.queryClassList(
        {},
        data => {
          this.classList = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryGroupList (classId) {
      service.queryGroupList(
        {
          tagCategoryId: classId
        },
        data => {
          this.groupList = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    add () {
      this.open = true;
      this.itemId = { id: '' };
    },
    delete () {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个标签组');
      }
    },
    import () {
      this.dialogModel = this.getDefaultDialogForm();
      this.dialogVisible = true;
      this.groupList = [];

      if (this.$refs.dialogForm) this.$refs.dialogForm.resetFields();
    },

    // Dialog
    getDefaultDialogForm () {
      return {
        classId: '',
        groupId: ''
      };
    },
    getSaveParams () {
      return {
        tagGroupId: this.dialogModel.groupId,
        // 传递的分类id为当前选中的店铺分类id
        tagCategoryId: this.$route.params.classId
      };
    },
    cancel () {
      this.dialogVisible = false;
    },
    save () {
      // 导入平台的标签组
      this.$refs.dialogForm.validate((valid, a) => {
        if (valid) {
          service.import(
            this.getSaveParams(),
            data => {
              this.$message.success('导入成功');
              this.dialogVisible = false;
              this.query();
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
    handleClassChange (val) {
      this.queryGroupList(val);
      this.$set(this.dialogModel, 'groupId', '');
    }
  },
  created () {
    this.query();
    this.queryClassList();

    // 只有拥有店铺运营权限(RoleType === '3')的用户才能看到“导入”按钮
    // 平台运营在点击系统设置中的页面中不会有“导入”按钮
    this.user = this.getUser();
    let hasShopAdminRole = false;
    this.user.roleDatas.forEach(role => {
      if (role.type === '3') hasShopAdminRole = true;
    });
    if (!hasShopAdminRole || this.$route.params.isSys) this.operations.pop();
  }
};
</script>

<style lang="scss">

</style>
