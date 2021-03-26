<template>
  <biz-grid class="category-mgmt__attribute-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit" style="margin-right:0px">
    </biz-save-button>
    <el-table :data="attributeDataList" style="width: 100%" @selection-change="handleSelectionChange" size="small">
      <el-table-column label="属性名称" prop="attributeData.name" min-width="80">
      </el-table-column>
      <!-- <el-table-column label="排序" prop="attributeData.sort" min-width="80">
      </el-table-column> -->
      <el-table-column label="属性值" prop="attributeData.valueList" min-width="160">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.attributeData.valueList">
            {{item}}
            <template v-if="index < scope.row.attributeData.valueList.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="操作" width="200">
        <template slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="scope.row.attributeData.id===attributeDataList[0].attributeData.id?'':moveUp(scope.row)">上移</el-button>
            <el-button type="text" size="mini" @click.stop="scope.row.attributeData.id===attributeDataList[attributeDataList.length-1].attributeData.id?'':moveDown(scope.row)">下移</el-button>
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
    <el-dialog :visible.sync="showAttributeDataEditor" center append-to-body width="500px">
      <el-form ref="attributeDataForm" size="small" label-width="110px" :model="attributeData" :rules="rules">
        <el-form-item label="属性名称: " prop="name">
          <el-input v-model="attributeData.name" placeholder="请输入属性名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="排序: " prop="sort">
          <el-input v-model="attributeData.sort" clearable placeholder="请输入排序"></el-input>
        </el-form-item> -->
        <el-form-item label="属性值: " prop="valueList">
          <el-tag v-for="tag in attributeData.valueList" :key="tag.id" size="small" closable :disable-transitions="true"
                  @close="handleTagClose(tag)" @click.native="handleTagClick(tag)" type="warning" style="margin-right: 5px">
            {{tag}}
          </el-tag>
          <el-button icon="el-icon-plus" @click.stop="handleAddAttributeValue" size="small"></el-button>
        </el-form-item>
      </el-form>
      <el-form ref="attributeValueForm" size="small" label-width="110px" :model="attributeValueData" :rules="rules" v-show="showAttributeValueEditor">
        <el-form-item label="属性值名称: " prop="valueName">
          <el-input v-model="attributeValueData.valueName" placeholder="请输入属性值名称"></el-input>
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
import http from '@/common/http';
import AttributeSettingService from '@/service/commodity/category-mgmt/AttributeSetting';

export default {
  name: 'AttributeSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'addAttributeOperate',
          type: 'primary',
          auth: ['admin:productCategory.edit']
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
          name: 'saveAttributeOperate',
          type: 'primary',
          auth: ['admin:productCategory.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
        valueName: [{ required: true, min: 1, message: '请输入属性值名称', trigger: 'blur' }]
      },
      loading: false,
      showAttributeDataEditor: false,
      showAttributeValueEditor: false,
      attributeDataList: [],
      dataList: [],
      attributeData: this.getDefaultAttributeData(),
      attributeValueData: this.getDefaultAttributeValueData(),
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
      this.showAttributeDataEditor = false;
    },
    query() {
      this.attributeDataList = this.getAttributeDataList();
    },
    showUp(row) {
      if (this.attributeDataList[0] && row.attributeData.id === this.attributeDataList[0].attributeData.id) {
        return false;
      } else {
        return true;
      }
    },
    showDown(row) {
      if (this.attributeDataList[0] && row.attributeData.id === this.attributeDataList[this.attributeDataList.length - 1].attributeData.id) {
        return false;
      } else {
        return true;
      }
    },
    moveUp(row) {
      this.loading = true;
      let sort = row.attributeData.sort;
      this.attributeDataList.map(item => {
        if (item.attributeData.id === row.attributeData.id) {
          this.attributeDataList[this.attributeDataList.indexOf(row)].attributeData.sort = this.attributeDataList[this.attributeDataList.indexOf(row) - 1].attributeData.sort;
          this.attributeDataList[this.attributeDataList.indexOf(row) - 1].attributeData.sort = sort;
          this.dataList = [this.attributeDataList[this.attributeDataList.indexOf(row)].attributeData, this.attributeDataList[this.attributeDataList.indexOf(row) - 1].attributeData];
          this.sort();
        }
      });
    },
    moveDown(row) {
      this.loading = true;
      let sort = row.attributeData.sort;
      this.dataList = [];
      this.attributeDataList.map(item => {
        if (item.attributeData.id === row.attributeData.id) {
          this.attributeDataList[this.attributeDataList.indexOf(row)].attributeData.sort = this.attributeDataList[this.attributeDataList.indexOf(row) + 1].attributeData.sort;
          this.attributeDataList[this.attributeDataList.indexOf(row) + 1].attributeData.sort = sort;
          this.dataList = [this.attributeDataList[this.attributeDataList.indexOf(row)].attributeData, this.attributeDataList[this.attributeDataList.indexOf(row) + 1].attributeData];
          this.sort();
        }
      });
    },
    sort() {
      http
        .put('/admin/attribute/attributeSort.jhtml', this.dataList)
        .then(data => {
          this.query();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    update() {
      AttributeSettingService.updateProductAttribute(
        this.getAttributeUpdateParams(),
        data => {
          console.log('[---- dachao ----] [API-属性编辑-更新成功] data=>', data);
          this.$message.success('更新属性成功');
          this.query();
          this.$emit('operationSuccess');
          this.showAttributeDataEditor = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('[---- dachao ----] [API-属性编辑-更新失败] ErrorData=>', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      AttributeSettingService.saveProductAttribute(
        this.getAttributeSaveParams(),
        data => {
          console.log('[---- dachao ----] [API-属性编辑-添加成功] data=>', data);
          this.$message.success('添加属性成功');
          this.query();
          this.$emit('operationSuccess');
          this.showAttributeDataEditor = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('[---- dachao ----] [API-属性编辑-添加失败] ErrorData=>', ErrorData);
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
    getAttributeDataList() {
      let table = [];
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: this.itemId
      };
      AttributeSettingService.getProductAttributeList(
        params,
        data => {
          console.log('[---- dachao ----] [API-属性编辑-查询成功] data=>', data);
          data.attribute.forEach((element, i) => {
            table.push({
              attributeData: {
                id: element.id,
                name: element.name,
                sort: element.sort,
                valueList: element.options
              }
            });
          });
          this.loading = false;
          console.log('[---- dachao ----] [    属性编辑        ] 查询后的所有的属性信息 table=>', table);
          console.log('[---- dachao ----] [    属性编辑        ] 当前编辑中的属性信息-更新前 attributeData=>', this.attributeData);
          this.attributeData = this.getAttributeData(table);
          console.log('[---- dachao ----] [    属性编辑        ] 当前编辑中的属性信息-更新后 attributeData=>', this.attributeData);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
          this.$message.warning(ErrorData.errorMessage);
        }
      );
      return table;
    },
    getAttributeData(table) {
      let index = table.findIndex(
        item => item.attributeData.id === this.attributeData.id
      );
      if (index !== -1) {
        return {
          id: table[index].attributeData.id,
          name: table[index].attributeData.name,
          sort: table[index].attributeData.sort,
          valueList: table[index].attributeData.valueList
        };
      } else {
        return this.getDefaultAttributeData();
      }
    },
    operateHandler(name) {
      this[name]();
    },
    operateHandlerDiag(name) {
      this[name]();
    },
    rowEditClickHandler(row) {
      console.log('[---- dachao ----] [    属性编辑        ] 编辑属性行 row=>', row);
      this.$refs.attributeDataForm.clearValidate();
      this.attributeData = Object.assign({}, row.attributeData);
      this.showAttributeDataEditor = true;
      this.hideAttributeValueEditor();
    },
    rowDeleteClickHandler(row) {
      console.log('[---- dachao ----] [    属性编辑        ] 删除属性行 row=>', row);
      this.deleteAttribute([row.attributeData.id]);
    },
    saveAttributeOperate() {
      console.log('[---- dachao ----] [    属性编辑        ] 保存属性数据');
      if (this.showAttributeValueEditor) {
        this.saveByAttributeValueForm();
      } else {
        this.saveByAttributeDataForm();
      }
    },
    saveByAttributeValueForm() {
      this.$refs.attributeDataForm.validate((valid, a) => {
        if (valid) {
          this.$refs.attributeValueForm.validate((valid, a) => {
            if (valid) {
              if (this.attributeValueData.valueName.trim()) {
                if (this.hasSameNameAttributeData(this.attributeData)) {
                  this.$message.warning('属性名称已存在');
                  return false;
                }

                if (this.hasSameNameAttributeValue(this.attributeValueData, this.attributeData)) {
                  this.$message.warning('属性值名称已存在');
                  return false;
                }

                console.log('[---- dachao ----] [    属性编辑        ] 编辑前的属性值 valueList=>', this.attributeData.valueList);
                if (this.attributeData.valueList.indexOf(this.attributeValueData.oldValueName) < 0) {
                  this.attributeData.valueList.push(this.attributeValueData.valueName);
                  console.log('[---- dachao ----] [    属性编辑        ] 新增的属性值 valueList=>', this.attributeData.valueList);
                } else {
                  this.attributeData.valueList = this.attributeData.valueList.map(attrValue => {
                    return attrValue === this.attributeValueData.oldValueName ? this.attributeValueData.valueName : attrValue;
                  });
                  console.log('[---- dachao ----] [    属性编辑        ] 修改的属性值 valueList=>', this.attributeData.valueList);
                }
              }
              this.hideAttributeValueEditor();
              this.saveByAttributeDataForm();
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    saveByAttributeDataForm() {
      this.$refs.attributeDataForm.validate((valid, a) => {
        if (valid) {
          if (this.hasSameNameAttributeData(this.attributeData)) {
            this.$message.warning('属性名称已存在');
            return false;
          }

          if (this.attributeData.id) {
            this.update();
            this.resetAttributeValueData();
          } else {
            this.save();
            // this.resetAttributeData();
            this.resetAttributeValueData();
          }
        } else {
          return false;
        }
      });
    },
    deleteAttribute(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AttributeSettingService.deleteProductAttribute(
          this.getAttributeDeleteParams(ids),
          data => {
            console.log('[---- dachao ----] [API-属性编辑-删除成功] data=>', data);
            this.$message.success('删除成功');
            this.$emit('operationSuccess');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log('[---- dachao ----] [API-属性编辑-删除失败] ErrorData=>', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          }
        );
        if (ids.indexOf(this.attributeData.id) >= 0) {
          this.resetAttributeData();
        }
        this.resetAttributeValueData();
        this.hideAttributeValueEditor();
      });
    },
    addAttributeOperate() {
      console.log('[---- dachao ----] [    属性编辑        ] 属性编辑状态 -> 新增属性');
      this.resetAttributeData();
      this.resetAttributeValueData();
      this.showAttributeDataEditor = true;
      this.hideAttributeValueEditor();
    },
    handleAddAttributeValue() {
      console.log('[---- dachao ----] [    属性编辑        ] 属性值编辑状态 -> 新增属性值');
      this.resetAttributeValueData();
      this.showAttributeValueEditor = true;
    },
    handleTagClose(tag) {
      console.log('[---- dachao ----] [    属性编辑        ] 删除属性值 tag=>', tag);
      this.deleteAttrbuteValue([tag]);
    },
    handleTagClick(tag) {
      console.log('[---- dachao ----] [    属性编辑        ] 属性值编辑状态 -> 修改属性值 tag=>', tag);
      this.attributeValueData = {
        valueName: tag,
        oldValueName: tag
      };
      this.showAttributeValueEditor = true;
    },
    resetAttributeData() {
      this.attributeData = this.getDefaultAttributeData();
    },
    resetAttributeValueData() {
      this.attributeValueData = this.getDefaultAttributeValueData();
    },
    hideAttributeDataEditor() {
      if (this.showAttributeDataEditor === true) {
        this.showAttributeDataEditor = false;
        this.attributeData = this.getDefaultAttributeData();

        this.hideAttributeValueEditor();
      }
    },
    hideAttributeValueEditor() {
      if (this.showAttributeValueEditor === true) {
        this.showAttributeValueEditor = false;
        this.attributeValueData = this.getDefaultAttributeValueData();
      }
    },
    deleteAttrbuteValue(attrValues) {
      console.log(this.attributeData);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('[---- dachao ----] [    属性编辑        ] 删除指定的属性值 attrValues=', attrValues);
        let index = this.attributeDataList.findIndex(
          item => item.attributeData.id === this.attributeData.id
        );

        if (index === -1) {
          console.log('关闭Tag所属的属性在属性列中不存在');
          return;
        }

        let parameter = {
          id: this.attributeDataList[index].attributeData.id,
          name: this.attributeDataList[index].attributeData.name,
          sort: this.attributeDataList[index].attributeData.sort,
          valueList: this.attributeDataList[index].attributeData.valueList
        };

        let indexArray = [];
        parameter.valueList.forEach((element, i) => {
          if (attrValues.indexOf(element) >= 0) {
            indexArray.push(i);
          }
        });
        indexArray.reverse().forEach((index, i) => {
          parameter.valueList.splice(index, 1);
        });

        this.attributeData = parameter;
        this.hideAttributeValueEditor();
        this.update();
      });
    },
    getAttributeUpdateParams() {
      return {
        productCategoryId: this.itemId,
        id: this.attributeData.id,
        options: this.attributeData.valueList,
        name: this.attributeData.name,
        sort: this.attributeData.sort
      };
    },
    getAttributeSaveParams() {
      return {
        productCategoryId: this.itemId,
        options: this.attributeData.valueList,
        name: this.attributeData.name,
        sort: this.attributeData.sort
      };
    },
    getAttributeDeleteParams(ids) {
      return {
        productCategoryId: this.itemId,
        ids: ids
      };
    },
    getDefaultAttributeValueData() {
      console.log('[---- dachao ----] [    属性编辑        ] 清空AttributeValueData');
      return {
        oldValueName: '',
        valueName: ''
      };
    },
    getDefaultAttributeData() {
      console.log('[---- dachao ----] [    属性编辑        ] 清空AttributeValueData');
      return {
        id: '',
        name: '',
        sort: '',
        valueList: []
      };
    },
    hasSameNameAttributeData(attributeData) {
      let index = this.attributeDataList.findIndex(
        item => item.attributeData.name === attributeData.name
      );

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (this.attributeDataList[index].attributeData.id === attributeData.id) {
        return false;
      }

      return true;
    },
    hasSameNameAttributeValue(attributeValueData, attributeData) {
      // return parameterInfos.findIndex(item => item.name === name) !== -1;
      let index = attributeData.valueList.findIndex(item => item === attributeValueData.valueName);

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (attributeData.valueList[index] === attributeValueData.oldValueName) {
        return false;
      }

      return true;
    }
  },
  watch: {
    itemId(Val) {
      console.log('[---- dachao ----] [    属性编辑        ] 商品分类选择条目变更 itemId=>', Val);
      this.hideAttributeDataEditor();
      this.attributeData = {};
      this.attributeValueData = {};
      this.query();
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__attribute-setting {
  padding-top: 20px;
  .biz-save-button {
    float: left;
  }
  .biz-scroller {
    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
