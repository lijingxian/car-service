<template>
  <biz-grid class="category-mgmt__specification-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <el-table :data="specificationDataList" style="width: 100%" @selection-change="handleSelectionChange" size="small">
      <el-table-column label="规格名称" prop="specificationData.name" min-width="80">
      </el-table-column>
      <el-table-column label="类型" prop="specificationData.type" min-width="80">
      </el-table-column>
      <!-- <el-table-column label="排序" prop="specificationData.sort" min-width="80">
      </el-table-column> -->
      <el-table-column label="规格值" prop="specificationData.valueList" min-width="110">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.specificationData.valueList">
            {{item.name}}
            <template v-if="index < scope.row.specificationData.valueList.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="操作" width="200">
        <template slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="scope.row.specificationData.id===specificationDataList[0].specificationData.id?'':moveUp(scope.row)">上移</el-button>
            <el-button type="text" size="mini" @click.stop="scope.row.specificationData.id===specificationDataList[specificationDataList.length-1].specificationData.id?'':moveDown(scope.row)">下移</el-button>
            <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope.row)">
              删除
            </el-button>
            <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row)">
              编辑
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showSpecificationDataEditor" center append-to-body width="500px">
      <el-form ref="specificationDataForm" size="small" label-width="110px" :model="specificationData" :rules="rules">
        <el-form-item label="规格名称: " prop="name">
          <el-input v-model="specificationData.name" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item label="规格类型: " prop="type">
          <el-select v-model="specificationData.type" placeholder="请选择" style="width: 100%;" @change="specificationChange">
            <el-option v-for="item in typeList" :key="item.id" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input v-model="specificationData.sort" clearable placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="规格值: " prop="valueList">
          <el-tag v-for="tag in specificationData.valueList" :key="tag.id" size="small" closable :disable-transitions="true"
                  @close="handleTagClose(tag)" @click.native="handleTagClick(tag)" type="warning" style="margin-right: 5px">
            {{tag.name}}
          </el-tag>
          <el-button icon="el-icon-plus" @click.stop="handleAddSpecificationValue" size="small"></el-button>
        </el-form-item>
      </el-form>
      <el-form ref="specificationValueForm" size="small" label-width="110px" :model="specificationValueData" :rules="rules" v-show="showSpecificationValueEditor">
        <el-form-item label="规格值名称:" prop="valueName">
          <el-input v-model="specificationValueData.valueName" placeholder="请输入规格值名称"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="specificationValueImageForm" size="small" label-width="110px" :model="specificationValueData" :rules="rules" v-show="showSpecificationValueImageEditor">
        <el-form-item label="规格值图片:" prop="attrValueImag">
          <BizAvatarUploaderNew v-model="specificationValueData.valueImage" title="建议尺寸1:1">
          </BizAvatarUploaderNew>
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
import http from '@/common/http';
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
        type: [{ required: true, message: '请输入规格类型', trigger: 'blur' }],
        valueName: [{ required: true, min: 1, message: '请输入规格值名称', trigger: 'blur' }],
        attrValueImag: [{ required: true, min: 1, message: '请输入规格值图片', trigger: 'blur' }]
      },
      showSpecificationDataEditor: false,
      showSpecificationValueEditor: false,
      showSpecificationValueImageEditor: false,
      loading: false,
      specificationDataList: [],
      dataList: [],
      specificationData: this.getDefaultSpecificationData(),
      specificationValueData: this.getDefaultSpecificationValueData(),
      typeList: [],
      separator: '、'
    };
  },
  computed: {
  },
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
      this.showSpecificationDataEditor = false;
    },
    specificationChange() {
      this.$refs.specificationDataForm.clearValidate('type');
    },
    query() {
      this.specificationDataList = this.getSpecificationDataList();
    },
    showUp(row) {
      if (this.specificationDataList[0] && row.specificationData.id === this.specificationDataList[0].specificationData.id) {
        return false;
      } else {
        return true;
      }
    },
    showDown(row) {
      if (this.specificationDataList[0] && row.specificationData.id === this.specificationDataList[this.specificationDataList.length - 1].specificationData.id) {
        return false;
      } else {
        return true;
      }
    },
    moveUp(row) {
      this.loading = true;
      let sort = row.specificationData.sort;
      this.specificationDataList.map(item => {
        if (item.specificationData.id === row.specificationData.id) {
          this.specificationDataList[this.specificationDataList.indexOf(row)].specificationData.sort = this.specificationDataList[this.specificationDataList.indexOf(row) - 1].specificationData.sort;
          this.specificationDataList[this.specificationDataList.indexOf(row) - 1].specificationData.sort = sort;
          this.dataList = [this.specificationDataList[this.specificationDataList.indexOf(row)].specificationData, this.specificationDataList[this.specificationDataList.indexOf(row) - 1].specificationData];
          this.sort();
        }
      });
    },
    moveDown(row) {
      this.loading = true;
      let sort = row.specificationData.sort;
      this.dataList = [];
      this.specificationDataList.map(item => {
        if (item.specificationData.id === row.specificationData.id) {
          this.specificationDataList[this.specificationDataList.indexOf(row)].specificationData.sort = this.specificationDataList[this.specificationDataList.indexOf(row) + 1].specificationData.sort;
          this.specificationDataList[this.specificationDataList.indexOf(row) + 1].specificationData.sort = sort;
          this.dataList = [this.specificationDataList[this.specificationDataList.indexOf(row)].specificationData, this.specificationDataList[this.specificationDataList.indexOf(row) + 1].specificationData];
          this.sort();
        }
      });
    },
    sort() {
      http
        .put('/admin/specification/specificationSort.jhtml', this.dataList)
        .then(data => {
          this.query();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    update() {
      SpecificationSettingService.updateProductSpecification(
        this.getSpecificationUpdateParams(),
        data => {
          console.log('[---- dachao ----] [API-规格编辑-更新成功] data=>', data);
          this.$message.success('更新规格成功');
          this.query();
          this.$emit('operationSuccess');
          this.showSpecificationDataEditor = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('[---- dachao ----] [API-规格编辑-更新失败] ErrorData=>', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      SpecificationSettingService.saveProductSpecification(
        this.getSpecificationSaveParams(),
        data => {
          console.log('[---- dachao ----] [API-规格编辑-添加成功] data=>', data);
          this.$message.success('添加规格成功');
          this.query();
          this.$emit('operationSuccess');
          this.showSpecificationDataEditor = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('[---- dachao ----] [API-规格编辑-添加失败] ErrorData=>', ErrorData);
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
          console.log('[---- dachao ----] [API-规格编辑-查询成功] data=>', data);
          data.specification.forEach((element, i) => {
            table.push({
              specificationData: {
                id: element.id,
                name: element.name,
                sort: element.sort,
                valueList: element.specificationValueData,
                type: element.type
              }
            });
          });
          this.typeList = data.types;
          this.loading = false;
          console.log('[---- dachao ----] [    规格编辑        ] 查询后的所有的规格信息 table=>', table);
          console.log('[---- dachao ----] [    规格编辑        ] 当前编辑中的规格信息-更新前 specificationData=>', this.specificationData);
          this.specificationData = this.getSpecificationData(table);
          console.log('[---- dachao ----] [    规格编辑        ] 当前编辑中的规格信息-更新后 specificationData=>', this.specificationData);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('[---- dachao ----] [API-规格编辑-查询失败] ErrorData=>', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
      return table;
    },
    getSpecificationData(table) {
      let index = table.findIndex(
        item => item.specificationData.id === this.specificationData.id
      );
      if (index !== -1) {
        return {
          id: table[index].specificationData.id,
          name: table[index].specificationData.name,
          sort: table[index].specificationData.sort,
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
      console.log('[---- dachao ----] [    规格编辑        ] 编辑规格行 row=>', row);
      this.$refs.specificationDataForm.clearValidate();
      this.specificationData = Object.assign({}, row.specificationData);
      this.showSpecificationDataEditor = true;
      this.showSpecificationValueEditor = false;
      this.showSpecificationValueImageEditor = false;
    },
    rowDeleteClickHandler(row) {
      console.log('[---- dachao ----] [    规格编辑        ] 删除规格行 row=>', row);
      this.deleteSpecification([row.specificationData.id]);
    },
    saveSpecificationOperate() {
      console.log('[---- dachao ----] [    规格编辑        ] 保存规格数据');
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
                console.log('[---- dachao ----] [    规格编辑        ] 保存规格值图片数据');
                this.saveBySpecificationValueForm();
              } else {
                console.log('[---- dachao ----] [    规格编辑        ] 没有输入规格值图片数据');
                this.$refs.specificationValueImageForm.validate((valid, a) => {
                  if (valid) {
                  } else {
                    return false;
                  }
                });
              }
              // this.$refs.specificationValueImageForm.validate((valid, a) => {
              //   console.log('[---- dachao ----] [    规格编辑        ] saveByspecificationValueImageForm() - refs.specificationValueImageForm valid=', valid);
              //   console.log('[---- dachao ----] [    规格编辑        ] saveByspecificationValueImageForm() - this.specificationValueData=', this.specificationValueData);
              //   if (valid) {
              //     this.saveBySpecificationValueForm();
              //   } else {
              //     return false;
              //   }
              // });
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
              console.log('[---- dachao ----] [    规格编辑        ] 编辑前的规格值 valueList=>', this.specificationData.valueList);
              if (this.specificationValueData.valueName.trim()) {
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
                  console.log('[---- dachao ----] [    规格编辑        ] 新增的规格值 valueList=>', this.specificationData.valueList);
                } else {
                  this.specificationData.valueList[index] = {
                    id: this.specificationValueData.valueID,
                    image: this.specificationValueData.valueImage,
                    name: this.specificationValueData.valueName
                  };
                  console.log('[---- dachao ----] [    规格编辑        ] 修改的属性值 valueList=>', this.specificationData.valueList);
                }
                this.saveBySpecificationDataForm();
              }
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
        console.log('[---- dachao ----] [    属性编辑        ] 保存规格数据');
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
            console.log('[---- dachao ----] [API-规格编辑-删除成功] data=>', data);
            this.$message.success('删除成功');
            this.$emit('operationSuccess');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log('[---- dachao ----] [API-规格编辑-删除失败] ErrorData=>', ErrorData);
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
      console.log('[---- dachao ----] [    规格编辑        ] 规格编辑状态 -> 新增规格');
      this.resetSpecificationData();
      this.resetSpecificationValueData();
      this.showSpecificationDataEditor = true;
      this.showSpecificationValueEditor = false;
      this.showSpecificationValueImageEditor = false;
    },
    handleAddSpecificationValue() {
      console.log('[---- dachao ----] [    规格编辑        ] 规格值编辑状态 -> 新增规格值');
      this.resetSpecificationValueData();
      this.showSpecificationValueEditor = true;
      if (this.specificationData.type === '图片') {
        this.showSpecificationValueImageEditor = true;
      } else {
        this.showSpecificationValueImageEditor = false;
      }
    },
    handleTagClose(tag) {
      console.log('[---- dachao ----] [    规格编辑        ] 删除规格值 tag=>', tag);
      this.deleteSpecificationValue([tag.name]);
    },
    handleTagClick(tag) {
      console.log('[---- dachao ----] [    规格编辑        ] 规格值编辑状态 -> 修改规格值 tag=>', tag);
      this.specificationValueData = {
        valueID: tag.id,
        valueName: tag.name,
        valueImage: tag.image
      };
      this.showSpecificationValueEditor = true;
      if (this.specificationData.type === '图片') {
        this.showSpecificationValueImageEditor = true;
      } else {
        this.showSpecificationValueImageEditor = false;
      }
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
      console.log('[---- dachao ----] [    规格编辑        ] 规格值图片加载成功 url=>', url);
      this.specificationValueData.valueImage = url;
    },
    deleteSpecificationValue(attrValues) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('[---- dachao ----] [    规格编辑        ] 删除指定的规格值 attrValues=', attrValues);

        let index = this.specificationDataList.findIndex(
          item => item.specificationData.id === this.specificationData.id
        );

        if (index === -1) {
          console.log('关闭Tag所属的属性在属性列中不存在');
          return;
        }

        let parameter = {
          id: this.specificationDataList[index].specificationData.id,
          name: this.specificationDataList[index].specificationData.name,
          sort: this.specificationDataList[index].specificationData.sort,
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
        specificationValueData: this.specificationData.valueList,
        type: this.specificationData.type
      };
    },
    getSpecificationSaveParams() {
      return {
        productCategoryId: this.itemId,
        name: this.specificationData.name,
        sort: this.specificationData.sort,
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
      console.log('[---- dachao ----] [    规格编辑        ] 清空SpecificationValueData');
      return {
        valueID: '',
        valueImage: '',
        valueName: ''
      };
    },
    getDefaultSpecificationData() {
      console.log('[---- dachao ----] [    规格编辑        ] 清空SpecificationData');
      return {
        id: '',
        name: '',
        sort: '',
        valueList: [],
        type: ''
      };
    },
    hasSameNameSpecificationData(specificationData) {
      let index = this.specificationDataList.findIndex(
        item => item.specificationData.name === specificationData.name
      );

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
      console.log('[---- dachao ----] [    规格编辑        ] 商品分类选择条目变更 itemId=>', Val);
      this.hideSpecificationDataEditor();
      this.specificationData = {};
      this.specificationValueData = {};
      this.query();
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
