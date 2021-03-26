<template>
  <biz-grid class="shop-rate__shop-evaluation" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
      <el-form-item label="等级" prop="gradeId">
        <el-select v-model="formModel.gradeId" placeholder="请选择等级" style="width: 100%;" @change="handleGradeChange">
          <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-button style="float: right;" size="small" type="primary" @click="configVisible = !configVisible">配置</el-button>
        <el-rate v-model="formModel.score" disabled style="margin-top: 7px;"></el-rate>

        <fieldset v-show="configVisible">
          <legend>评分配置</legend>
          <div class="group-list">
            <div class="group-item" v-for="(group, index) in groups" :key="index">
              <div class="title">{{group.name}}
                <span class="score">{{group.score}}</span>
              </div>
              <el-checkbox-group v-model="formModel.indicatorItems" size="small" @change="handleTagChange">
                <el-checkbox v-for="(tag, index) in group.indicatorData.indicatorItems" :key="index" :label="tag.id" border>{{tag.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </fieldset>
      </el-form-item>
      <el-form-item label="店铺特色">
        <tag-select ref="tagSelect" :tagList="tagList" :selectedTags="selectedTags" categoryType="店铺特色" @addSuccess="onAddSuccess" class="tag-select-shop"></tag-select>
      </el-form-item>
      <el-form-item label="店铺承诺">
        <el-checkbox-group v-model="formModel.promises" class="terminal-mgmt-class__class-ability-setting__checkbox-group">
          <div v-for="item in promiseList" :key="item.id" class="checkbox-item">
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <el-dialog title="从标签库导入" :visible.sync="dialogVisible" width="500px" append-to-body>
      <el-form ref="dialogForm" size="small" label-width="110px" :model="dialogModel" :rules="dialogRules">
        <el-form-item label="分类" prop="classId">
          <el-select v-model="dialogModel.classId" placeholder="请选择" @change="handleClassChange" style="width: 100%;">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签组" prop="groupId">
          <el-select v-model="dialogModel.groupId" placeholder="请选择标签组" style="width: 100%;" @change="handleGroupChange">
            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="dialogOperations" @operate="operateHandler" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import TagSelect from '@/components/BizTagSelect';
import http from '@/common/http';
import urls from '@/common/urls';

import service from '@/service/shop-rate/ShopEvaluation';

const getDefaultModel = function() {
  return {
    gradeId: '',
    indicatorItems: [],
    tags: [],
    promises: [],
    score: 0
  };
};

// Base
// ========================================
// 属性
const data = {
  tagList: [],
  selectedTags: [],
  loading: false,
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ],
  rules: {
    gradeId: [{ required: true, message: '请选择等级', trigger: 'blur' }]
  },
  formModel: getDefaultModel(),
  levelList: [],
  promiseList: [],
  groups: []
};
// 方法
const methods = {
  getStoreTags() {
    let param = {
      categoryType: '店铺特色',
      shopId: window.top.SHOP_ID || ''
    };
    http
      .get(urls.systemSetting.storeTags, param)
      .then(data => {
        this.tagList = data.content;
      })
      .catch(error => {
        console.log(error.errorMessage);
      });
  },
  onAddSuccess() {
    this.getStoreTags();
  },
  query() {
    this.loading = true;
    this.selectedTags = [];
    service.query(
      {
        childrenShopId: this.itemId.id
        // childrenShopId: '40'
      },
      data => {
        // 设置备选项
        this.levelList = data.unionGrades;
        this.promiseList = data.unionPromises;
        this.groups = [];
        // 解决score默认为空的情况
        let obj = Object.assign(this.getDefaultModel(), data.storeScore);
        obj.score = isNaN(Number(obj.score)) ? 0 : Number(obj.score);
        // 将Grade信息转换成控件所需要的
        obj.gradeId = obj.grade && obj.grade.id ? obj.grade.id : '';
        console.log(obj.gradeId);
        this.changeGrade(obj.gradeId);
        // 修改tags的名字属性值
        obj.tags = this.getAppendingTags(obj.tags);

        this.formModel = obj;
        obj.tags.forEach(item => {
          this.selectedTags.push(item.name);
        });

        this.recountScore();

        this.$refs.form.resetFields();

        this.loading = false;
      },
      // result_code 不是100的处理
      ErrorData => {
        // console.log(ErrorData);
        // console.log('code错误');

        this.loading = false;
      }
    );
  },
  getSaveParams() {
    return {
      id: this.formModel.id,
      score: this.formModel.score,
      grade: { id: this.formModel.gradeId },
      indicatorItems: this.formModel.indicatorItems,
      tags: this.$refs.tagSelect.getCurSelectedTags('shop'),
      promises: this.formModel.promises,
      childrenStore: {
        id: this.itemId.id
        // id: '40'
      }
    };
  },
  resetModel() {
    this.formModel = this.getDefaultModel();
  },
  getDefaultModel() {
    return getDefaultModel();
  },

  save() {
    this.$refs.form.validate((valid, a) => {
      if (valid) {
        this.loading = true;
        service.update(
          this.getSaveParams(),
          data => {
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          }
        );
      } else {
        return false;
      }
    });
  },
  changeGrade(gradeId) {
    for (let i = 0; i < this.levelList.length; i++) {
      if (this.levelList[i].id === gradeId) {
        this.groups = this.levelList[i].indicators;
      }
    }
  }
};
// 事件
const events = {
  operateHandler(name) {
    this[name]();
  },
  handleAddressChange(val) {
    this.formModel.address = val;
  },
  handleUploadSuccess(url) {
    this.formModel.logo = url;
  },
  handleAreaChanged(areaId) {
    this.formModel.area.id = areaId;
  },
  handleGradeChange(val) {
    this.changeGrade(val);
    this.$refs.form.clearValidate('gradeId');
    this.recountScore();
  }
};

// Dialog
// ========================================
const getDefaultDialogForm = function() {
  return {
    classId: '',
    groupId: ''
  };
};
const dataDialog = {
  dialogVisible: false,
  classList: [],
  groupList: [],
  dialogModel: getDefaultDialogForm(),
  dialogRules: {
    classId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
    groupId: [{ required: true, message: '请选择标签组', trigger: 'blur' }]
  },
  dialogOperations: [
    {
      label: '取消',
      name: 'cancelDialog'
    },
    {
      label: '导入',
      name: 'saveDialog',
      type: 'primary'
    }
  ]
};
const methodsDialog = {
  getDefaultDialogForm() {
    return getDefaultDialogForm();
  },
  getSaveParamsDialog() {
    return {
      tagGroupId: this.dialogModel.groupId
    };
  },
  cancelDialog() {
    this.dialogVisible = false;
  },
  checkIncluded(name, tags) {
    let result = false;
    tags.forEach(item => {
      if (item.content === name) {
        result = true;
      }
    });
    return result;
  },
  getAppendingTags(tags) {
    let temp = [];
    tags.forEach(item => {
      if (!this.checkIncluded(item.name, temp)) {
        item.content = item.name;
        temp.push(item);
      }
    });

    return temp;
  },
  getImportTags(tags) {
    let temp = this.formModel.tags;
    tags.forEach(item => {
      if (!this.checkIncluded(item.name, temp)) {
        item.content = item.name;
        temp.push(item);
      }
    });

    return temp;
  },
  saveDialog() {
    this.$refs.dialogForm.validate((valid, a) => {
      if (valid) {
        service.queryTagList(
          this.getSaveParamsDialog(),
          data => {
            this.$message.success('导入成功');
            this.$set(
              this.formModel,
              'tags',
              this.getImportTags(data.content)
            );

            this.dialogVisible = false;
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
  queryClassList() {
    // service.queryClassList(
    //   {},
    //   data => {
    //     this.classList = data.content;
    //   },
    //   // result_code 不是100的处理
    //   ErrorData => {
    //     // console.log(ErrorData);
    //     // console.log('code错误');
    //   }
    // );
  },
  queryGroupList(classId) {
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
  }
};
const eventsDialog = {
  handleClassChange(val) {
    this.queryGroupList(val);
    this.$set(this.dialogModel, 'groupId', '');
    this.$refs.dialogForm.clearValidate('classId');
  },
  handleGroupChange(val) {
    this.$refs.dialogForm.clearValidate('groupId');
  }
};

// Config
// ========================================
const dataConfig = {
  configVisible: false
};
const methodsConfig = {
  recountScore() {
    let score = 0;
    console.log(this.groups);
    this.groups.forEach(group => {
      let baseScore = Number(group.indicatorData.baseScore);
      let weight = Number(group.weight);
      weight = isNaN(weight) ? 0 : weight;

      group.indicatorData.indicatorItems.forEach(item => {
        if (this.formModel.indicatorItems.indexOf(item.id) >= 0) {
          baseScore += Number(item.score);
        }
      });

      if (baseScore < 0) baseScore = 0;
      else if (baseScore > 5) baseScore = 5;

      this.$set(group, 'score', baseScore);
      score += (baseScore * weight) / 100;
    });
    // score = score.toFixed(2);
    score = Math.floor(score);
    this.$set(this.formModel, 'score', score);
  }
};
const eventsConfig = {
  handleTagChange(val) {
    this.recountScore();
  }
};

export default {
  name: 'ShopEvaluation',
  components: {
    BizSaveButton,
    BizGrid,
    TagSelect
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    type: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      ...data,
      ...dataDialog,
      ...dataConfig
    };
  },
  methods: {
    ...methods,
    ...events,

    ...methodsDialog,
    ...eventsDialog,

    ...methodsConfig,
    ...eventsConfig
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal && nVal.id) {
        this.type !== 'operator' && this.query();
        this.getStoreTags();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  },
  created() {
    if (this.itemId.id) {
      if (this.type !== 'operator') {
        this.query();
        this.getStoreTags();
      }
    }
    this.type !== 'operator' && this.queryClassList();
  }
};
</script>

<style lang="scss">
.shop-rate__shop-evaluation {
  padding-top: 20px;
  .biz-save-button {
    float: left;
  }
  .biz-scroller {

    .terminal-mgmt-class__class-ability-setting__checkbox-group {
      .checkbox-item {
        .el-checkbox {
          display: block;
          padding-bottom: 5px;

          & + .el-checkbox {
            margin-left: 0;
          }

          .el-checkbox__input {
            float: right;
            margin-top: 8px;
          }

          .el-checkbox__label {
            padding-left: 0;
          }
        }
      }
    }

    fieldset {
      margin-top: 10px;
      color: #606266;
      border-color: #eee;
      border-radius: 4px;
    }

    .group-list {
      .group-item {
        margin-bottom: 10px;
        .el-checkbox.is-bordered + .el-checkbox.is-bordered {
          margin-left: 0px;
        }
        .title {
          .score {
            color: #ff7300;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
