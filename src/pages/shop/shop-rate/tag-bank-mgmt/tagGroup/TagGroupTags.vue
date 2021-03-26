<template>
  <biz-grid class="tag-group-mgmt__tags" v-loading="loading">
    <div>
      <biz-header :operations="tableOperations" @operate="operateHandler" @rowClick="rowEditClickHandler">
      </biz-header>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        @selection-change="selectionChangeHandler"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="name" label="标签名称"></el-table-column>
        <el-table-column prop="title" label="操作" width="90">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row,$event)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-card class="box-card" v-show="showInnerForm">
        <h5>{{ innerModel.id ? '编辑标签' : '新建标签' }}</h5>
        <el-form
          ref="innerForm"
          size="small"
          label-width="110px"
          :model="innerModel"
          :rules="innerRules"
          >
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="innerModel.name" maxlength="20" placeholder="请输入标签名称"></el-input>
          </el-form-item>
        </el-form>
        <biz-save-button
          :operations="innerOperations"
          @operate="operateHandler"
          style="margin-right: 0;"
        ></biz-save-button>
      </el-card>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/shop-rate/TagGroupTags';

export default {
  name: 'TagGroupTags',
  components: {
    BizSaveButton,
    BizHeader,
    BizGrid
  },
  props: {
    itemId: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],

      tableOperations: [
        {
          label: '新增',
          name: 'addOperate',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'deleteOperate',
          type: '',
          disabled: true
        }
      ],

      showInnerForm: false,
      innerModel: this.getDefaultModel(),
      innerRules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
      },
      innerOperations: [
        {
          label: '取消',
          name: 'cancelInnerFormOperate'
        },
        {
          label: '保存',
          name: 'saveInnerFormOperate',
          type: 'primary'
        }
      ]
    };
  },
  created() {},
  methods: {
    init () {
      if (this.itemId && this.itemId.id) {
        this.query();
      } else {
        this.tableData = [];
      }

      this.loading = false;
      this.showInnerForm = false;
    },
    query () {
      service.query(
        {
          tagGroupId: this.itemId.id
        },
        data => {
          this.tableData = data.content;

          // reset
          this.selections = [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSaveParams () {
      return {
        id: this.innerModel.id,
        name: this.innerModel.name,
        tagGroupId: this.itemId.id
      };
    },
    resetModel () {
      this.innerModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {

      };
    },
    deleteRule (ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.delete(
          {
            ids: ids
          },
          data => {
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },

    operateHandler(name) {
      this[name]();
    },
    addOperate() {
      this.resetModel();
      this.showInnerForm = true;
      if (this.$refs.innerForm) this.$refs.innerForm.resetFields();
    },
    deleteOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个标签进行删除');
      }
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    rowDeleteClickHandler(e, model) {
      this.deleteRule([model.id]);
    },
    rowEditClickHandler(model, e, column) {
      this.innerModel = Object.assign({}, model);
      this.showInnerForm = true;

      if (this.$refs.innerForm) this.$refs.innerForm.resetFields();
    },

    // 弹出编辑内容
    cancelInnerFormOperate() {
      this.showInnerForm = false;
    },
    saveInnerFormOperate() {
      this.$refs.innerForm.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.innerModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.query();
                this.showInnerForm = false;
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.query();
                this.showInnerForm = false;
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          }
        } else {
          return false;
        }
      });
    }
  },
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.tag-group-mgmt__tags {
  .biz-scroller {
    padding: 20px;

    .box-card {
      margin-top: 20px;

      .el-card__body {
        padding: 20px 20px;

        h5 {
          margin: 10px 0 20px;
          text-align: center;
          color: #606266;
        }

        .biz-save-button {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
