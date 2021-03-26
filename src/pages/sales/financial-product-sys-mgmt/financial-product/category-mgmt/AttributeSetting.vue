<template>
  <biz-grid class="category-mgmt__attribute-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit" style="margin-right:0px"></biz-save-button>
    <el-table :data="attributeDataList" style="width: 100%" @selection-change="handleSelectionChange" size="small">
      <el-table-column label="属性名称" prop="attributeData.name" min-width="80"></el-table-column>
      <el-table-column label="属性类型" prop="attributeData.attributeType" min-width="80">
        <div slot-scope="scope">
          <div>
            {{scope.row.attributeData.attributeType==='0'?'文本':scope.row.attributeData.attributeType==='1'?'数值':scope.row.attributeData.attributeType==='2'?'列表':
            scope.row.attributeData.attributeType==='3'?'单选':scope.row.attributeData.attributeType==='4'?'多选':scope.row.attributeData.attributeType==='5'?'日期':'图片'}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="属性分类" prop="attributeData.attributeCategory" min-width="80">
        <div slot-scope="scope">
          <div>{{scope.row.attributeData.attributeCategory==='0'?'其他':scope.row.attributeData.attributeCategory==='1'?'会员信息':scope.row.attributeData.attributeCategory==='2'?'车辆信息':'驾驶证'}}</div>
        </div>
      </el-table-column>
      <el-table-column label="属性含义" prop="attributeData.attributeMeaning" min-width="80">
        <div slot-scope="scope">
          <div>
            {{scope.row.attributeData.attributeMeaning==='0'?'其他':scope.row.attributeData.attributeMeaning==='1'?'会员姓名':scope.row.attributeData.attributeMeaning==='2'?'会员电话':
            scope.row.attributeData.attributeMeaning==='3'?'会员性别':scope.row.attributeData.attributeMeaning==='4'?'会员出生日期':scope.row.attributeData.attributeMeaning==='5'?'身份证号':
            scope.row.attributeData.attributeMeaning==='6'?'身份证正面照片':scope.row.attributeData.attributeMeaning==='7'?'身份证反面照片':scope.row.attributeData.attributeMeaning==='8'?'车辆':
            scope.row.attributeData.attributeMeaning==='9'?'车辆价格':scope.row.attributeData.attributeMeaning==='10'?'车牌号':scope.row.attributeData.attributeMeaning==='11'?'车辆品牌':
            scope.row.attributeData.attributeMeaning==='12'?'车辆车系':scope.row.attributeData.attributeMeaning==='13'?'车辆车型':scope.row.attributeData.attributeMeaning==='14'?'车辆识别代码':
            scope.row.attributeData.attributeMeaning==='15'?'车辆发动机号':scope.row.attributeData.attributeMeaning==='16'?'车辆注册日期':scope.row.attributeData.attributeMeaning==='17'?'驾驶证号':
            scope.row.attributeData.attributeMeaning==='18'?'初次领证日期':scope.row.attributeData.attributeMeaning==='19'?'有效起始日期':scope.row.attributeData.attributeMeaning==='20'?'有效期限':'驾驶证照片'}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="排序" prop="attributeData.sort" min-width="80"></el-table-column>
      <el-table-column label="属性值" prop="attributeData.options" min-width="160">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.attributeData.options">
            {{item}}
            <template v-if="index < scope.row.attributeData.options.length - 1">{{separator}}</template>
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
    <el-dialog :visible.sync="showAttributeDataEditor" center append-to-body width="500px">
      <el-form
        ref="attributeDataForm"
        size="small"
        label-width="110px"
        :model="attributeData"
        :rules="rules"
        :inline-message="true"
      >
        <el-form-item label="属性名称: " prop="name">
          <el-input v-model="attributeData.name" placeholder="请输入属性名称"></el-input>
        </el-form-item>
        <el-form-item label="属性类型: " prop="attributeType">
          <el-select v-model="attributeData.attributeType" placeholder="请选择" @change="attributeChange">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性分类: " prop="attributeCategory">
          <el-select v-model="attributeData.attributeCategory" placeholder="请选择" @change="attributeCategoryChange">
            <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性含义: " prop="attributeMeaning">
          <el-select v-model="attributeData.attributeMeaning" placeholder="请选择" @change="attributeMeaning">
            <el-option v-for="item in meanList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input v-model="attributeData.sort" clearable placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="属性值: " prop="options">
          <el-tag
            v-for="(tag,index) in attributeData.options"
            :key="index"
            size="small"
            closable
            :disable-transitions="true"
            @close="handleTagClose(index)"
            type="warning"
            style="margin-right: 5px"
          >{{tag}}</el-tag>
          <el-button icon="el-icon-plus" @click.stop="handleAddAttributeValue" size="small"></el-button>
        </el-form-item>
      </el-form>
      <el-form ref="attributeValueForm" size="small" label-width="110px" :model="attributeValueData" :rules="rules" v-show="showAttributeValueEditor">
        <el-form-item label="属性值名称: " prop="valueName">
          <el-input v-model="attributeValueData.valueName" placeholder="请输入属性值名称"></el-input>
          <el-button @click="addNewTag" type="primary">添加</el-button>
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
          name: 'saveAttributeOperate',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
        attributeMeaning: [{ required: true, trigger: 'blur', message: '请输入属性含义' }],
        attributeType: [{ required: true, message: '请输入属性类型', trigger: 'blur' }],
        attributeCategory: [{ required: true, message: '请输入属性分类', trigger: 'blur' }]
      },
      showAttributeDataEditor: false,
      showAttributeValueEditor: false,
      attributeDataList: [],
      typeList: [],
      categoryList: [],
      meanList: [],
      attributeData: this.getDefaultAttributeData(),
      attributeValueData: this.getDefaultAttributeValueData(),
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
    this.getFilters();
  },
  methods: {
    cancel() {
      this.showAttributeDataEditor = false;
    },
    getFilters() {
      this.typeList = [
        { label: '文本', value: '0' },
        { label: '数值', value: '1' },
        { label: '列表', value: '2' },
        { label: '单选', value: '3' },
        { label: '多选', value: '4' },
        { label: '日期', value: '5' },
        { label: '图片', value: '6' }
      ];
      this.meanList = [
        { label: '其他', value: '0' },
        { label: '会员姓名', value: '1' },
        { label: '会员电话', value: '2' },
        { label: '会员性别', value: '3' },
        { label: '会员出生日期', value: '4' },
        { label: '身份证号', value: '5' },
        { label: '身份证正面照片', value: '6' },
        { label: '身份证反面照片', value: '7' },
        { label: '车辆', value: '8' },
        { label: '车辆价格', value: '9' },
        { label: '车牌号', value: '10' },
        { label: '车辆品牌', value: '11' },
        { label: '车辆车系', value: '12' },
        { label: '车辆车型', value: '13' },
        { label: '车辆识别代码', value: '14' },
        { label: '车辆发动机号', value: '15' },
        { label: '车辆注册日期', value: '16' },
        { label: '驾驶证号', value: '17' },
        { label: '初次领证日期', value: '18' },
        { label: '有效起始日期', value: '19' },
        { label: '有效期限', value: '20' },
        { label: '驾驶证照片', value: '21' }
      ];
      if (this.itemType === '0') {
        this.categoryList = [
          { label: '其他', value: '0' },
          { label: '会员信息', value: '1' },
          { label: '车辆信息', value: '2' },
          { label: '驾驶证', value: '3' }
        ];
      } else {
        this.categoryList = [
          { label: '其他', value: '0' },
          { label: '会员信息', value: '1' },
          { label: '车辆信息', value: '2' }
        ];
      }
    },
    addNewTag() {
      const tag = String(this.attributeValueData.valueName).trim();
      if (!tag) return;
      if (this.attributeData.options.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
      } else {
        this.attributeData.options = [...new Set(this.attributeData.options.concat(tag))];
      }
      this.attributeValueData.valueName = '';
    },
    attributeChange() {
      this.$refs.attributeData.clearValidate('attributeType');
    },
    attributeMeaning() {
      this.$refs.attributeData.clearValidate('attributeMeaning');
    },
    attributeCategoryChange(val) {
      if (val === '0') {
        this.meanList = [{ label: '其他', value: '0' }];
        this.attributeData.attributeMeaning = '0';
      } else if (val === '1') {
        this.meanList = [
          { label: '会员姓名', value: '1' },
          { label: '会员电话', value: '2' },
          { label: '会员性别', value: '3' },
          { label: '会员出生日期', value: '4' },
          { label: '身份证号', value: '5' },
          { label: '身份证正面照片', value: '6' },
          { label: '身份证反面照片', value: '7' }
        ];
        this.attributeData.attributeMeaning = '1';
      } else if (val === '2') {
        this.meanList = [
          { label: '车辆', value: '8' },
          { label: '车辆价格', value: '9' },
          { label: '车牌号', value: '10' },
          { label: '车辆品牌', value: '11' },
          { label: '车辆车系', value: '12' },
          { label: '车辆车型', value: '13' },
          { label: '车辆识别代码', value: '14' },
          { label: '车辆发动机号', value: '15' },
          { label: '车辆注册日期', value: '16' }
        ];
        this.attributeData.attributeMeaning = '8';
      } else {
        this.meanList = [
          { label: '驾驶证号', value: '17' },
          { label: '初次领证日期', value: '18' },
          { label: '有效起始日期', value: '19' },
          { label: '有效期限', value: '20' },
          { label: '驾驶证照片', value: '21' }
        ];
        this.attributeData.attributeMeaning = '16';
      }
    },
    query() {
      this.attributeDataList = this.getAttributeDataList();
    },
    update() {
      AttributeSettingService.updateProductAttribute(
        this.getAttributeUpdateParams(),
        data => {
          this.$message.success('更新属性成功');
          this.query();
          this.showAttributeDataEditor = false;
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      AttributeSettingService.saveProductAttribute(
        this.getAttributeSaveParams(),
        data => {
          this.$message.success('添加属性成功');
          this.query();
          this.showAttributeDataEditor = false;
          this.$emit('operationSuccess');
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
    getAttributeDataList() {
      let table = [];
      let params = {
        id: this.itemId
      };
      AttributeSettingService.getProductAttributeList(
        params,
        data => {
          data.attribute.forEach((element, i) => {
            table.push({
              attributeData: {
                id: element.id,
                name: element.name,
                attributeType: element.attributeType,
                attributeMeaning: element.attributeMeaning,
                attributeCategory: element.attributeCategory,
                sort: element.sort,
                options: element.options
              }
            });
          });
          this.attributeData = this.getAttributeData(table);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.$message.warning(ErrorData.errorMessage);
        }
      );
      return table;
    },
    getAttributeData(table) {
      let index = table.findIndex(item => item.attributeData.id === this.attributeData.id);
      if (index !== -1) {
        return {
          id: table[index].attributeData.id,
          name: table[index].attributeData.name,
          sort: table[index].attributeData.sort,
          attributeType: table[index].attributeType,
          attributeMeaning: table[index].attributeMeaning,
          attributeCategory: table[index].attributeCategory,
          options: table[index].attributeData.options
        };
      } else {
        return this.getDefaultAttributeData();
      }
    },
    operateHandler(name) {
      this[name]();
    },
    rowEditClickHandler(row) {
      this.attributeData = Object.assign({}, row.attributeData);
      this.showAttributeDataEditor = true;
      this.hideAttributeValueEditor();
    },
    rowDeleteClickHandler(row) {
      this.deleteAttribute([row.attributeData.id]);
    },
    saveAttributeOperate() {
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
                if (this.attributeData.options.indexOf(this.attributeValueData.oldValueName) < 0) {
                  this.attributeData.options.push(this.attributeValueData.valueName);
                } else {
                  this.attributeData.options = this.attributeData.options.map(attrValue => {
                    return attrValue === this.attributeValueData.oldValueName ? this.attributeValueData.valueName : attrValue;
                  });
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
            this.$message.success('删除成功');
            this.$emit('operationSuccess');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
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
      this.resetAttributeData();
      this.resetAttributeValueData();
      this.showAttributeDataEditor = true;
      this.hideAttributeValueEditor();
    },
    handleAddAttributeValue() {
      this.resetAttributeValueData();
      this.showAttributeValueEditor = true;
    },
    handleTagClose(index) {
      this.attributeData.options = this.attributeData.options.slice(0, index).concat(this.attributeData.options.slice(index + 1));
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
        let index = this.attributeDataList.findIndex(item => item.attributeData.id === this.attributeData.id);

        if (index === -1) {
          console.log('关闭Tag所属的属性在属性列中不存在');
          return;
        }

        let parameter = {
          id: this.attributeDataList[index].attributeData.id,
          name: this.attributeDataList[index].attributeData.name,
          attributeType: this.attributeDataList[index].attributeData.attributeType,
          attributeMeaning: this.attributeDataList[index].attributeData.attributeMeaning,
          attributeCategory: this.attributeDataList[index].attributeData.attributeCategory,
          sort: this.attributeDataList[index].attributeData.sort,
          options: this.attributeDataList[index].attributeData.options
        };

        let indexArray = [];
        parameter.options.forEach((element, i) => {
          if (attrValues.indexOf(element) >= 0) {
            indexArray.push(i);
          }
        });
        indexArray.reverse().forEach((index, i) => {
          parameter.options.splice(index, 1);
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
        options: this.attributeData.options,
        attributeType: this.attributeData.attributeType,
        attributeMeaning: this.attributeData.attributeMeaning,
        attributeCategory: this.attributeData.attributeCategory,
        name: this.attributeData.name,
        sort: this.attributeData.sort
      };
    },
    getAttributeSaveParams() {
      return {
        productCategoryId: this.itemId,
        options: this.attributeData.options,
        name: this.attributeData.name,
        attributeType: this.attributeData.attributeType,
        attributeMeaning: this.attributeData.attributeMeaning,
        attributeCategory: this.attributeData.attributeCategory,
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
      return {
        oldValueName: '',
        valueName: ''
      };
    },
    getDefaultAttributeData() {
      return {
        id: '',
        name: '',
        sort: '',
        attributeType: '0',
        attributeMeaning: '0',
        attributeCategory: '0',
        options: []
      };
    },
    hasSameNameAttributeData(attributeData) {
      let index = this.attributeDataList.findIndex(item => item.attributeData.name === attributeData.name);

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
      let index = attributeData.options.findIndex(item => item === attributeValueData.valueName);

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (attributeData.options[index] === attributeValueData.oldValueName) {
        return false;
      }

      return true;
    }
  },
  watch: {
    itemId(Val) {
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
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
