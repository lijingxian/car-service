<template>
  <biz-grid class="service-specification">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :tableData="tableData" @row-click="rowClick"
      :checkable="false">
      <el-table-column prop="name" label="领域名称">
        <div slot-scope="scope">
          {{scope.row.name}}
        </div>
      </el-table-column>
      <el-table-column width="130" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="rowClick(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click.stop="rowDeleteClickHandler(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <el-dialog :visible.sync="showForm" center append-to-body width="500px">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
        <el-form-item label="领域名称" prop="name">
          <el-input v-model="formModel.name"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="operate" style="margin-right: 0;"></biz-save-button>
    </el-dialog>
  </biz-grid>
</template>
<script>
import http from '@/common/http';
import BizSaveButton from '@/components/BizSaveButton';
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
export default {
  name: 'ServiceSpecification',
  data() {
    return {
      tableData: [],
      speId: '',
      name: '',
      plusButtonClick: false,
      showForm: false,
      formModel: { name: '', id: '' },
      rules: {
        name: [{ required: true, message: '请输入领域名称', trigger: 'blur' }]
      },
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
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ]
    };
  },
  props: {
    id: {
      type: String
    }
  },
  components: {
    BizFlexTable,
    BizGrid,
    BizSaveButton
  },
  created() {
    this.getServiceSpecification();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    cancelForm() {
      this.showForm = false;
    },
    rowClick(row) {
      this.showForm = true;
      this.formModel = Object.assign(this.formModel, row);
    },
    getServiceSpecification() {
      let params = {
        categoryType: 'businessService',
        userId: this.getUser().id
      };
      http
        .get('/admin/businessServiceDomain/domainList.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          this.showForm = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.formModel.id) {
            this.updateService();
          } else {
            this.createService();
          }
        }
      });
    },
    createService() {
      let params = {
        name: this.formModel.name
      };
      http
        .post('/admin/businessServiceDomain/domain.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.formModel.id = data.id;
          this.getServiceSpecification();
        })
        .catch(errData => {
          this.$notify({
            title: '警告',
            message: errData.errorMessage,
            type: 'warning'
          });
        });
    },
    updateService() {
      let params = {
        name: this.formModel.name,
        id: this.formModel.id
      };
      http
        .put('/admin/businessServiceDomain/domain.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.getServiceSpecification();
        })
        .catch(errData => {
          this.$notify({
            title: '警告',
            message: errData.errorMessage,
            type: 'warning'
          });
        });
    },
    rowDeleteClickHandler(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          http
            .delete('/admin/businessServiceDomain/domain.jhtml', { ids: [id] })
            .then(data => {
              this.$message.success('操作成功');
              this.getServiceSpecification();
            })
            .catch(errData => {
              this.$notify({
                title: '警告',
                message: errData.errorMessage,
                type: 'warning'
              });
            });
        })
        .catch(() => {});
    },
    add() {
      this.showForm = true;
      this.formModel.id = '';
      this.formModel.name = '';
    }
  }
};
</script>

<style lang="scss">
.service-specification {
  .service-Content {
    // margin-left: 50px;
    padding: 20px 50px;
    // padding-left: 180px;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .time {
    font-size: 14px;
    clear: #606266;
  }
  .tag {
    font-size: 14px;
    clear: #606266;
  }
}
</style>
