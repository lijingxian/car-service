<template>
  <biz-grid class="category-mgmt__parameter-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <el-table :data="parameterDataList" style="width: 100%" @selection-change="handleSelectionChange" size="small">
      <el-table-column prop="name" label="参数分类" min-width="100">
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="50">
      </el-table-column>
      <el-table-column prop="parameters" label="参数">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.parameters">
            {{item.name}}
            <template v-if="index < scope.row.parameters.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope.row)">
            删除
          </el-button>
          <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showParameterDataEditor" center append-to-body width="500px">
      <el-form ref="parameterDataForm" size="small" label-width="110px" :model="parameterData" :rules="parameterDataFormRules" :inline-message="true">
        <el-form-item prop="name" label="名称:">
          <el-input v-model="parameterData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="parameterData.sort" clearable placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item prop="parameters" label="参数">
          <el-tag v-for="tag in parameterData.parameters" :key="tag.id" size="small" closable :disable-transitions="true" @close="handleTagClose(tag) "
            @click.native="handleTagClick(tag)" type="warning" style="margin-right: 5px">
            {{tag.name}}
          </el-tag>
          <el-button icon="el-icon-plus" @click.stop="handleAddParameterInfo" size="mini"></el-button>
        </el-form-item>
      </el-form>
      <el-form ref="parameterInfoForm" size="small" label-width="110px" :model="parameterInfo" :rules="parameterInfoFormRules" v-show="showParameterInfoEditor" :inline-message="true">
        <el-form-item prop="name" label="参数名称: ">
          <el-input v-model="parameterInfo.name " placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型: ">
          <el-select v-model="parameterInfo.type " placeholder="请选择型" style="width: 100%; ">
            <el-option v-for="item in parameterInfoTypeList " :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="operationsDiag" @operate="operateHandlerDiag">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/commodity/category-mgmt/parameterSetting';

export default {
  name: 'ParameterSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ],
      operationsDiag: [
        {
          label: '取消',
          name: 'cancel',
          type: ''
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      parameterDataFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      parameterInfoFormRules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: ['blur', 'change'] }]
      },
      showParameterDataEditor: false,
      showParameterInfoEditor: false,
      parameterInfoTypeList: [],
      parameterDataList: [],
      parameterData: this.getDefaultParameterData(),
      parameterInfo: this.getDefaultParameterInfo(),
      separator: '、'
    };
  },
  computed: {},
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created() {
    this.query();
  },
  methods: {
    cancel() {
      this.showParameterDataEditor = false;
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    getDefaultParameterData() {
      return {
        id: '',
        name: '',
        sort: '',
        parameters: [],
        productCategoryId: ''
      };
    },
    getDefaultParameterInfo() {
      return {
        id: '',
        name: '',
        type: ''
      };
    },
    operateHandler(name) {
      this[name]();
    },
    operateHandlerDiag(name) {
      this[name]();
    },
    rowEditClickHandler(row) {
      if (this.showParameterDataEditor === false) {
        this.showParameterDataEditor = true;
      }
      this.$refs.parameterDataForm.clearValidate('name');
      if (this.parameterData.id !== row.id) {
        this.parameterData = this.changeParameterData(row);
        // 编辑不同的parameterData时关闭ParameterInfo编辑栏
        this.hideParameterInfoEditor();
      }

      this.$nextTick(() => {
        this.$refs.parameterDataForm.$el['0'].focus();
      });
    },
    changeParameterData(row) {
      return {
        id: row.id,
        name: row.name,
        sort: row.sort,
        parameters: row.parameters,
        productCategoryId: row.productCategoryId
      };
    },
    add() {
      if (this.showParameterDataEditor === false) {
        this.showParameterDataEditor = true;
      }

      // 添加新parameterData时关闭ParameterInfo编辑栏
      this.hideParameterInfoEditor();

      // 添加新parameterData时编辑栏设置默认值
      this.parameterData = this.getDefaultParameterData();
      this.$refs.parameterDataForm.clearValidate('name');
      this.$nextTick(() => {
        this.$refs.parameterDataForm.$el['0'].focus();
      });
    },
    hideParameterDataEditor() {
      if (this.showParameterDataEditor === true) {
        this.showParameterDataEditor = false;
        this.parameterData = this.getDefaultParameterData();

        // 关闭parameterData编辑栏时关闭ParameterInfo编辑栏
        this.hideParameterInfoEditor();
      }
    },
    hideParameterInfoEditor() {
      if (this.showParameterInfoEditor === true) {
        this.showParameterInfoEditor = false;
        this.parameterInfo = this.getDefaultParameterInfo();
      }
    },
    save() {
      if (this.showParameterInfoEditor === true) {
        this.handlerParameterInfo();
      } else if (this.showParameterDataEditor === true) {
        this.handlerParameterData();
      }
    },
    handlerParameterData() {
      this.$refs.parameterDataForm.validate(valid => {
        if (valid) {
          let parameter = this.getParameterData();

          if (this.hasSameNameParameterData(parameter)) {
            this.$message.warning('参数分类名称已存在');
            return false;
          }

          if (parameter.id) {
            console.log('parameterData变更');
            this.updateParameterData(parameter);
          } else {
            console.log('parameterData添加');
            this.saveParameterData(parameter);
          }
        } else {
          return false;
        }
      });
    },
    handlerParameterInfo() {
      this.$refs.parameterDataForm.validate(valid => {
        if (valid) {
          this.$refs.parameterInfoForm.validate(valid => {
            if (valid) {
              let info = this.getParameterInfo();
              let parameter = this.getParameterData();

              let index = parameter.parameters.findIndex(
                item => item.id === info.id
              );

              if (this.hasSameNameParameterData(parameter)) {
                this.$message.warning('参数分类名称已存在');
                return false;
              }

              if (this.hasSameNameParameterInfo(info, parameter.parameters)) {
                this.$message.warning('参数名称已存在');
                return false;
              }

              // parameterData中不存在ParameterInfo时追加ParameterInfo
              // parameterData中存在ParameterInfo时替换ParameterInfo
              if (index === -1) {
                console.log('ParameterInfo添加');
                parameter.parameters.push(info);
              } else {
                console.log('ParameterInfo变更');
                parameter.parameters[index] = info;
              }

              // parameterData有id,更新parameterData
              // parameterData没有id,添加parameterData
              if (parameter.id) {
                this.updateParameterData(parameter);
              } else {
                this.saveParameterData(parameter);
              }
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    handleTagClose(tag) {
      let index = this.parameterDataList.findIndex(
        item => item.id === this.parameterData.id
      );

      if (index === -1) {
        console.log('关闭Tag所属的参数在参数列中不存在');
        return;
      }

      let parameter = {
        id: this.parameterDataList[index].id,
        name: this.parameterDataList[index].name,
        sort: this.parameterDataList[index].sort,
        parameters: this.parameterDataList[index].parameters,
        productCategoryId: this.parameterDataList[index].productCategoryId
      };

      parameter.parameters = parameter.parameters.filter(
        item => item.id !== tag.id
      );

      this.hideParameterInfoEditor();
      this.updateParameterData(parameter);
    },
    handleTagClick(tag) {
      if (this.showParameterInfoEditor === false) {
        this.showParameterInfoEditor = true;
      }

      // 显示当前选中的ParameterInfo信息
      this.parameterInfo.id = tag.id;
      this.parameterInfo.name = tag.name;
      this.parameterInfo.type = tag.type;
    },
    handleAddParameterInfo() {
      if (this.showParameterInfoEditor === false) {
        this.showParameterInfoEditor = true;
      }

      // 添加新ParameterInfo时编辑栏设置默认值
      this.parameterInfo = this.getDefaultParameterInfo();
    },
    updateParameterData(parameter) {
      console.log('变更前parameterData', this.parameterData);
      console.log('参数parameterData', parameter);
      service.updateCategoryParameter(
        parameter,
        data => {
          console.log('更新参数分类成功', data.id);
          this.$message.success('更新参数分类成功');
          this.$emit('operationSuccess');
          this.hideParameterInfoEditor();
          this.query();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('更新参数分类失败');
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    saveParameterData(parameter) {
      console.log('保存前parameterData', this.parameterData);
      console.log('参数parameterData', parameter);
      if (parameter.productCategoryId === '') {
        parameter.productCategoryId = this.itemId;
      }
      service.saveCategoryParameter(
        parameter,
        data => {
          console.log('添加参数分类成功', data.id);
          this.$message.success('添加参数分类成功');
          this.parameterData = this.getDefaultParameterData();
          this.$emit('operationSuccess');
          this.parameterData.id = data.id;
          this.query();
          this.$nextTick(function() {
            this.hideParameterDataEditor();
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('添加参数分类失败');
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    query() {
      console.log('查询分类的参数', this.itemId);
      let params = {
        id: Number(this.itemId)
      };
      service.getCategoryParameter(
        params,
        data => {
          console.log('查询分类的参数成功', data);
          this.parameterDataList = data.parameterGroups;
          this.parameterInfoTypeList = data.allParameterType;
          if (this.showParameterDataEditor === true) {
            this.parameterData = this.getParameterDataFromList(
              this.parameterData.id
            );
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('查询分类的参数失败', this.itemId);
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getParameterDataFromList(id) {
      let index = this.parameterDataList.findIndex(item => item.id === id);
      if (index !== -1) {
        return {
          id: this.parameterDataList[index].id,
          name: this.parameterDataList[index].name,
          sort: this.parameterDataList[index].sort,
          parameters: this.parameterDataList[index].parameters,
          productCategoryId: this.parameterDataList[index].productCategoryId
        };
      } else {
        console.log('新添加的参数在分类中没有找到', this.parameterData.id);
        return this.getDefaultParameterData();
      }
    },
    rowDeleteClickHandler(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          let params = {
            ids: ids
          };
          service.deleteCategoryParameter(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$emit('operationSuccess');
              this.hideParameterDataEditor();
              this.query();
            },
            ErrorData => {
              console.log('删除失败', ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    getParameterData() {
      return {
        id: this.parameterData.id,
        name: this.parameterData.name,
        sort: this.parameterData.sort,
        parameters: this.parameterData.parameters,
        productCategoryId: this.parameterData.productCategoryId
      };
    },
    getParameterInfo() {
      return {
        id: this.parameterInfo.id,
        name: this.parameterInfo.name,
        type: this.parameterInfo.type
      };
    },
    hasSameNameParameterData(parameter) {
      let index = this.parameterDataList.findIndex(
        item => item.name === parameter.name
      );

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (this.parameterDataList[index].id === parameter.id) {
        return false;
      }

      return true;
    },
    hasSameNameParameterInfo(info, parameterInfos) {
      // return parameterInfos.findIndex(item => item.name === name) !== -1;
      let index = parameterInfos.findIndex(item => item.name === info.name);

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (parameterInfos[index].id === info.id) {
        return false;
      }

      return true;
    }
  },
  watch: {
    itemId(Val) {
      console.log('ParameterSetting::watch() Val:', Val);
      this.hideParameterDataEditor();
      this.parameterInfoTypeList = [];
      this.parameterDataList = [];
      this.query();
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__parameter-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
