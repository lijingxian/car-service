<template>
  <biz-grid class="category-mgmt__specification-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit" style="margin-right:0px"></biz-save-button>
    <el-table :data="specificationDataList" style="width: 100%" @selection-change="handleSelectionChange" size="small">
      <el-table-column label="规格名称" prop="specificationData.name" min-width="80"></el-table-column>
      <el-table-column label="规格含义" prop="specificationData.specificationMeaning" min-width="80">
        <div slot-scope="scope">
          <div
            v-if="itemType==='0'"
          >{{scope.row.specificationData.specificationMeaning==='1'?'首付':scope.row.specificationData.specificationMeaning==='2'?'分期期数':'费率/利率'}}</div>
          <div v-if="itemType==='1'">
            {{scope.row.specificationData.specificationMeaning==='0'?'其他':scope.row.specificationData.specificationMeaning==='4'?'交强险':
            scope.row.specificationData.specificationMeaning==='5'?'车船使用税':scope.row.specificationData.specificationMeaning==='6'?'第三者责任险':
            scope.row.specificationData.specificationMeaning==='7'?'车辆损失险':scope.row.specificationData.specificationMeaning==='8'?'全车盗抢险':
            scope.row.specificationData.specificationMeaning==='9'?'玻璃单独破碎险':scope.row.specificationData.specificationMeaning==='10'?'自燃损失险':
            scope.row.specificationData.specificationMeaning==='11'?'不计免赔特约险':scope.row.specificationData.specificationMeaning==='12'?'无过责任险':
            scope.row.specificationData.specificationMeaning==='13'?'车上人员责任险':scope.row.specificationData.specificationMeaning==='14'?'车身划痕险':'涉水险'}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="类型" prop="specificationData.type" min-width="80"></el-table-column>
      <el-table-column label="排序" prop="specificationData.sort" min-width="80"></el-table-column>
      <el-table-column label="规格值" prop="specificationData.valueList" min-width="110">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.specificationData.valueList">
            {{item.name}}
            <template v-if="index < scope.row.specificationData.valueList.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope.row)">删除</el-button>
          <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showSpecificationDataEditor" center append-to-body width="500px">
      <el-form
        ref="specificationDataForm"
        size="small"
        label-width="110px"
        :model="specificationData"
        :rules="rules"
        :inline-message="true"
      >
        <el-form-item label="规格名称: " prop="name">
          <el-input v-model="specificationData.name" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item label="规格含义: " prop="specificationMeaning">
          <el-select v-model="specificationData.specificationMeaning" placeholder="请选择" @change="specificationMeaning">
            <el-option v-for="item in meanList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格类型: " prop="type">
          <el-select v-model="specificationData.type" placeholder="请选择" @change="specificationChange">
            <el-option v-for="item in typeList" :key="item.id" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input v-model="specificationData.sort" clearable placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="规格值: " prop="valueList">
          <el-tag
            v-for="(tag,index) in specificationData.valueList"
            :key="index"
            size="small"
            closable
            :disable-transitions="true"
            @close="handleTagClose(index)"
            type="warning"
            style="margin-right: 5px"
          >{{tag.name}}</el-tag>
          <el-button icon="el-icon-plus" @click.stop="handleAddSpecificationValue" size="small"></el-button>
        </el-form-item>
      </el-form>
      <el-form
        ref="specificationValueForm"
        size="small"
        label-width="110px"
        :model="specificationValueData"
        :rules="rulesValue"
        v-show="showSpecificationValueEditor"
        :inline-message="true"
      >
        <el-form-item label="规格值:" prop="valueName">
          <el-input v-model="specificationValueData.valueName" placeholder="请输入规格值"></el-input>
          <el-button @click="addNewTag" type="primary">添加</el-button>
        </el-form-item>
      </el-form>
      <el-form
        ref="specificationValueImageForm"
        size="small"
        label-width="110px"
        :model="specificationValueData"
        :rules="rules"
        v-show="showSpecificationValueImageEditor"
        :inline-message="true"
      >
        <el-form-item label="规格值图片:" prop="valueImage">
          <BizAvatarUploaderNew v-model="specificationValueData.valueImage" title="建议尺寸1:1"></BizAvatarUploaderNew>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="operationsDiag" @operate="operateHandlerDiag">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import BizSaveButton from '@/components/BizSaveButton';

import SpecificationSettingService from '@/service/commodity/category-mgmt/SpecificationSetting';

export default {
  name: 'SpecificationSetting',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew
  },
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'addSpecificationOperate',
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
          name: 'saveSpecificationOperate',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
        specificationMeaning: [{ required: true, trigger: 'blur', message: '请输入规格含义' }],
        type: [{ required: true, message: '请输入规格类型', trigger: 'blur' }]
      },
      rulesValue: {
        valueImage: [{ required: true, message: '请输入规格值图片', trigger: 'blur' }]
      },
      showSpecificationDataEditor: false,
      showSpecificationValueEditor: false,
      showSpecificationValueImageEditor: false,
      specificationDataList: [],
      specificationData: this.getDefaultSpecificationData(),
      specificationValueData: this.getDefaultSpecificationValueData(),
      typeList: [],
      meanList: [],
      separator: '、',
      newTagName: ''
    };
  },
  computed: {},
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    itemType: {
      type: String
    }
  },
  created() {
    this.query();
    this.getMeanList();
  },
  methods: {
    cancel() {
      this.showSpecificationDataEditor = false;
    },
    addNewTag() {
      if (this.itemType === '0') {
        if (this.specificationData.specificationMeaning) {
          if (this.specificationData.specificationMeaning === '0') {
            if (/^[1-9]\d*$/.test(this.specificationValueData.valueName)) {
              if (Number(this.specificationValueData.valueName) > 99 || Number(this.specificationValueData.valueName) <= 0) {
                this.$message.warning('请输入0~99（包含99）之间的正整数');
                return;
              }
            } else {
              this.$message.warning('请输入正整数');
              return;
            }
          } else if (this.specificationData.specificationMeaning === '1') {
            if (/^[1-9]\d*$/.test(this.specificationValueData.valueName)) {
              if (Number(this.specificationValueData.valueName) > 66 || Number(this.specificationValueData.valueName) <= 0) {
                this.$message.warning('请输入0~66（包含66）之间的正整数');
                return;
              }
            } else {
              this.$message.warning('请输入正整数');
              return;
            }
          } else if (this.specificationData.specificationMeaning === '2') {
            if (/^\d+\.?\d{0,1}$/.test(this.specificationValueData.valueName)) {
              if (Number(this.specificationValueData.valueName) > 99 || Number(this.specificationValueData.valueName) <= 0) {
                this.$message.warning('请输入0~99（包含99）之间的数');
                return;
              }
            } else {
              this.$message.warning('请输入0~99（包含99）之间的数并且小数点后最多保留一位小数');
              return;
            }
          }
        } else {
          this.$message.warning('请输入规格含义');
          return;
        }
      }
      const tag = String(this.specificationValueData.valueName).trim();
      if (!tag) return;
      if (this.specificationData.valueList.findIndex(valueName => valueName.name === tag) === -1) {
        this.specificationData.valueList.push({
          id: this.specificationValueData.valueID,
          image: this.specificationValueData.valueImage,
          name: this.specificationValueData.valueName
        });
      } else {
        this.$message.warning('该规格值名称已存在，请重新添加');
      }
      this.specificationValueData.valueName = '';
    },
    specificationChange() {
      this.$refs.specificationDataForm.clearValidate('type');
    },
    specificationMeaning() {
      this.$refs.specificationDataForm.clearValidate('specificationMeaning');
    },
    query() {
      this.specificationDataList = this.getSpecificationDataList();
    },
    getMeanList() {
      if (this.itemType === '0') {
        this.meanList = [
          { label: '首付', value: '1' },
          { label: '分期期数', value: '2' },
          { label: '费率/利率', value: '3' }
        ];
      } else {
        this.meanList = [
          { label: '其他', value: '0' },
          { label: '交强险', value: '4' },
          { label: '车船使用税', value: '5' },
          { label: '第三者责任险', value: '6' },
          { label: '车辆损失险', value: '7' },
          { label: '全车盗抢险', value: '8' },
          { label: '玻璃单独破碎险', value: '9' },
          { label: '自燃损失险', value: '10' },
          { label: '不计免赔特约险', value: '11' },
          { label: '无过责任险', value: '12' },
          { label: '车上人员责任险', value: '13' },
          { label: '车身划痕险', value: '14' },
          { label: '涉水险', value: '15' }
        ];
      }
    },
    update() {
      SpecificationSettingService.updateProductSpecification(
        this.getSpecificationUpdateParams(),
        data => {
          this.$message.success('更新规格成功');
          this.query();
          this.$emit('operationSuccess');
          this.showSpecificationDataEditor = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      SpecificationSettingService.saveProductSpecification(
        this.getSpecificationSaveParams(),
        data => {
          this.$message.success('添加规格成功');
          this.query();
          this.$emit('operationSuccess');
          this.showSpecificationDataEditor = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    getSpecificationDataList() {
      let table = [];
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: this.itemId
      };
      SpecificationSettingService.getProductSpecificationList(
        params,
        data => {
          data.specification.forEach((element, i) => {
            table.push({
              specificationData: {
                id: element.id,
                name: element.name,
                sort: element.sort,
                specificationMeaning: element.specificationMeaning,
                valueList: element.specificationValueData,
                type: element.type
              }
            });
          });
          this.typeList = data.types;
          this.specificationData = this.getSpecificationData(table);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
      return table;
    },
    getSpecificationData(table) {
      let index = table.findIndex(item => item.specificationData.id === this.specificationData.id);
      if (index !== -1) {
        return {
          id: table[index].specificationData.id,
          name: table[index].specificationData.name,
          sort: table[index].specificationData.sort,
          specificationMeaning: table[index].specificationData.specificationMeaning,
          valueList: table[index].specificationData.valueList,
          type: table[index].specificationData.type
        };
      } else {
        return this.getDefaultSpecificationData();
      }
    },
    operateHandler(name) {
      this[name]();
    },
    operateHandlerDiag(name) {
      this[name]();
    },
    rowEditClickHandler(row) {
      this.specificationData = Object.assign({}, row.specificationData);
      this.showSpecificationDataEditor = true;
      this.showSpecificationValueEditor = false;
      this.showSpecificationValueImageEditor = false;
    },
    rowDeleteClickHandler(row) {
      this.deleteSpecification([row.specificationData.id]);
    },
    saveSpecificationOperate() {
      if (this.showSpecificationValueImageEditor) {
        this.saveBySpecificationValueImageForm();
      } else if (this.showSpecificationValueEditor) {
        this.saveBySpecificationValueForm();
      } else if (this.showSpecificationDataEditor) {
        this.saveBySpecificationDataForm();
      }
    },
    saveBySpecificationValueImageForm() {
      this.$refs.specificationDataForm.validate((valid, a) => {
        if (valid) {
          this.$refs.specificationValueForm.validate((valid, a) => {
            if (valid) {
              if (this.specificationValueData.valueImage.trim()) {
                this.saveBySpecificationValueForm();
              } else {
                this.$refs.specificationValueImageForm.validate((valid, a) => {
                  if (valid) {
                  } else {
                    return false;
                  }
                });
              }
            } else {
              return false;
            }
          });
        }
      });
    },
    saveBySpecificationValueForm() {
      this.$refs.specificationDataForm.validate((valid, a) => {
        if (valid) {
          this.$refs.specificationValueForm.validate((valid, a) => {
            if (valid) {
              if (this.specificationValueData.valueName.trim()) {
                if (this.itemType === '0') {
                  if (this.specificationData.specificationMeaning) {
                    if (this.specificationData.specificationMeaning === '0') {
                      if (/^[1-9]\d*$/.test(this.specificationValueData.valueName)) {
                        if (
                          Number(this.specificationValueData.valueName) > 99 ||
                          Number(this.specificationValueData.valueName) <= 0
                        ) {
                          this.$message.warning('请输入0~99（包含99）之间的正整数');
                          return false;
                        }
                      } else {
                        this.$message.warning('请输入正整数');
                        return false;
                      }
                    } else if (this.specificationData.specificationMeaning === '1') {
                      if (/^[1-9]\d*$/.test(this.specificationValueData.valueName)) {
                        if (
                          (Number(this.specificationValueData.valueName) > 66 ||
                            Number(this.specificationValueData.valueName) <= 0)
                        ) {
                          this.$message.warning('请输入0~66（包含66）之间的正整数');
                          return false;
                        }
                      } else {
                        this.$message.warning('请输入正整数');
                        return false;
                      }
                    } else if (this.specificationData.specificationMeaning === '2') {
                      if (/^\d+\.?\d{0,1}$/.test(this.specificationValueData.valueName)) {
                        if (
                          Number(this.specificationValueData.valueName) > 99 ||
                          Number(this.specificationValueData.valueName) <= 0
                        ) {
                          this.$message.warning('请输入0~99（包含99）之间的数');
                          return false;
                        }
                      } else {
                        this.$message.warning('请输入0~99（包含99）之间的数并且小数点后最多保留一位小数');
                        return false;
                      }
                    }
                  } else {
                    this.$message.warning('请输入规格含义');
                    return false;
                  }
                }

                if (this.hasSameNameSpecificationData(this.specificationData)) {
                  this.$message.warning('规格名称已存在');
                  return false;
                }

                if (this.hasSameNameSpecificationValue(this.specificationValueData, this.specificationData)) {
                  this.$message.warning('规格值名称已存在');
                  return false;
                }

                let index = this.specificationData.valueList.findIndex(
                  attrValue => attrValue.id === this.specificationValueData.valueID
                );
                if (index === -1) {
                  this.specificationData.valueList.push({
                    id: this.specificationValueData.valueID,
                    image: this.specificationValueData.valueImage,
                    name: this.specificationValueData.valueName
                  });
                } else {
                  this.specificationData.valueList[index] = {
                    id: this.specificationValueData.valueID,
                    image: this.specificationValueData.valueImage,
                    name: this.specificationValueData.valueName
                  };
                }
              }
              this.saveBySpecificationDataForm();
              this.showSpecificationValueEditor = false;
              this.showSpecificationValueImageEditor = false;
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    saveBySpecificationDataForm() {
      this.$refs.specificationDataForm.validate((valid, a) => {
        if (valid) {
          if (this.hasSameNameSpecificationData(this.specificationData)) {
            this.$message.warning('规格名称已存在');
            return false;
          }

          if (this.specificationData.id) {
            this.update();
            this.resetSpecificationValueData();
          } else {
            this.save();
            // this.resetSpecificationData();
            this.resetSpecificationValueData();
          }
        } else {
          return false;
        }
      });
    },
    deleteSpecification(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SpecificationSettingService.deleteProductSpecification(
          this.getSpecificationDeleteParams(ids),
          data => {
            this.$message.success('删除成功');
            this.$emit('operationSuccess');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
        if (ids.indexOf(this.specificationData.id) >= 0) {
          this.resetSpecificationData();
        }
        this.resetSpecificationValueData();
        this.showSpecificationValueEditor = false;
        this.showSpecificationValueImageEditor = false;
      });
    },
    addSpecificationOperate() {
      this.resetSpecificationData();
      this.resetSpecificationValueData();
      this.showSpecificationDataEditor = true;
      this.showSpecificationValueEditor = false;
      this.showSpecificationValueImageEditor = false;
    },
    handleAddSpecificationValue() {
      this.resetSpecificationValueData();
      this.showSpecificationValueEditor = true;
      if (this.specificationData.type === '图片') {
        this.showSpecificationValueImageEditor = true;
      } else {
        this.showSpecificationValueImageEditor = false;
      }
    },
    handleTagClose(index) {
      this.specificationData.valueList = this.specificationData.valueList
        .slice(0, index)
        .concat(this.specificationData.valueList.slice(index + 1));
    },
    resetSpecificationData() {
      this.specificationData = this.getDefaultSpecificationData();
    },
    resetSpecificationValueData() {
      this.specificationValueData = this.getDefaultSpecificationValueData();
    },
    hideSpecificationDataEditor() {
      if (this.showSpecificationDataEditor === true) {
        this.showSpecificationDataEditor = false;
        this.specificationData = this.getDefaultSpecificationData();

        this.hideSpecificationValueEditor();
      }
    },
    hideSpecificationValueEditor() {
      if (this.showSpecificationValueEditor === true) {
        this.showSpecificationValueEditor = false;
        this.specificationValueData = this.getDefaultSpecificationValueData();

        this.hideSpecificationValueImageEditor();
      }
    },
    hideSpecificationValueImageEditor() {
      if (this.showSpecificationValueImageEditor === true) {
        this.showSpecificationValueImageEditor = false;
        this.specificationValueData = this.getDefaultSpecificationValueData();
      }
    },
    handleUploadSuccess(url) {
      this.specificationValueData.valueImage = url;
    },
    deleteSpecificationValue(attrValues) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = this.specificationDataList.findIndex(item => item.specificationData.id === this.specificationData.id);

        if (index === -1) {
          console.log('关闭Tag所属的属性在属性列中不存在');
          return;
        }

        let parameter = {
          id: this.specificationDataList[index].specificationData.id,
          name: this.specificationDataList[index].specificationData.name,
          sort: this.specificationDataList[index].specificationData.sort,
          specificationMeaning: this.specificationDataList[index].specificationData.specificationMeaning,
          valueList: this.specificationDataList[index].specificationData.valueList,
          type: this.specificationDataList[index].specificationData.type
        };

        let indexArray = [];
        parameter.valueList.forEach((element, i) => {
          if (attrValues.indexOf(element.name) >= 0) {
            indexArray.push(i);
          }
        });
        indexArray.reverse().forEach((index, i) => {
          parameter.valueList.splice(index, 1);
        });

        this.specificationData = parameter;
        this.hideSpecificationValueEditor();
        this.update();
      });
    },
    getSpecificationUpdateParams() {
      return {
        productCategoryId: this.itemId,
        id: this.specificationData.id,
        name: this.specificationData.name,
        sort: this.specificationData.sort,
        specificationMeaning: this.specificationData.specificationMeaning,
        specificationValueData: this.specificationData.valueList,
        type: this.specificationData.type
      };
    },
    getSpecificationSaveParams() {
      return {
        productCategoryId: this.itemId,
        name: this.specificationData.name,
        sort: this.specificationData.sort,
        specificationMeaning: this.specificationData.specificationMeaning,
        specificationValueData: this.specificationData.valueList,
        type: this.specificationData.type
      };
    },
    getSpecificationDeleteParams(ids) {
      return {
        productCategoryId: this.itemId,
        ids: ids
      };
    },
    getDefaultSpecificationValueData() {
      return {
        valueID: '',
        valueImage: '',
        valueName: ''
      };
    },
    getDefaultSpecificationData() {
      return {
        id: '',
        name: '',
        sort: '',
        valueList: [],
        specificationMeaning: '',
        type: ''
      };
    },
    hasSameNameSpecificationData(specificationData) {
      let index = this.specificationDataList.findIndex(item => item.specificationData.name === specificationData.name);

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (this.specificationDataList[index].specificationData.id === specificationData.id) {
        return false;
      }

      return true;
    },
    hasSameNameSpecificationValue(specificationValueData, specificationData) {
      // return parameterInfos.findIndex(item => item.name === name) !== -1;
      let index = specificationData.valueList.findIndex(item => item.name === specificationValueData.valueName);

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (specificationData.valueList[index].id === specificationValueData.valueID) {
        return false;
      }

      return true;
    }
  },
  watch: {
    itemId(Val) {
      this.hideSpecificationDataEditor();
      this.specificationData = {};
      this.specificationValueData = {};
      this.query();
      this.getMeanList();
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__specification-setting {
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
