<template>
  <biz-grid class="tag-class-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
      <el-form-item label="指标名称" prop="name">
        <el-input v-model="formModel.name" maxlength="20" placeholder="请输入指标名称"></el-input>
      </el-form-item>
      <el-form-item label="指标基础分" prop="baseScore">
        <el-input v-model="formModel.baseScore" type="number" max="5" min="0" placeholder="请输入指标基础分"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <rate-list v-model="formModel.indicatorItems" placeholder="请输入标签"></rate-list>
      </el-form-item>
    </el-form>

    <el-dialog title="导入标签" :visible.sync="dialogVisible" append-to-body width="500px">
      <el-form ref="dialogForm" size="small" label-width="50px" :model="dialogModel">
        <el-form-item label="分类">
          <el-cascader :options="options" v-model="selTagClass" change-on-select @change="onChange" class="cascader"></el-cascader>
        </el-form-item>
      </el-form>
      <div class="tag-container">
        <el-checkbox-group v-model="selTagList" v-if="classTagList.length">
          <el-checkbox-button v-for="tag in classTagList" :label="tag.name" :key="tag.name" class="shop-tags">{{tag.name}}</el-checkbox-button>
        </el-checkbox-group>
        <div v-else class="empty">暂无数据</div>
      </div>
      <biz-save-button :operations="dialogOperations" @operate="operateHandler" style="margin-right: 0; margin-bottom: 0; margin-top: 20px;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import RateList from '../Components/RateList';
import http from '@/common/http';
import service from '@/service/shop-rate/IndicatorBaseInfo';
import { mapGetters } from 'vuex';

export default {
  name: 'IndicatorBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    RateList
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      selTagClass: [],
      selTagList: [],
      classTagList: [],
      options: [],
      loading: false,
      operations: [
        {
          label: '导入标签',
          name: 'import'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
        baseScore: [
          { required: true, message: '请输入指标基础分', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                Number(this.formModel.baseScore) < 0 ||
                Number(this.formModel.baseScore) > 5 ||
                this.formModel.baseScore.toString().indexOf('.') !== -1
              ) {
                callback(new Error('请输入大于0、小于5的整数'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      formModel: this.getDefaultModel(),

      // dialog
      dialogVisible: false,
      dialogModel: this.getDefaultDialogModel(),
      classList: [],
      groupList: [],
      dialogOperations: [
        {
          label: '取消',
          name: 'dialogCancel'
        },
        {
          label: '导入',
          name: 'dialogSave',
          type: 'primary',
          disabled: true
        }
      ],
      dialogTableData: []
    };
  },
  methods: {
    query() {
      this.loading = true;
      service.query(
        {
          id: this.itemId.id,
          terminalTypeId: '2',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.data);
          this.formModel = obj;

          this.$refs.form.resetFields();

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.loading = false;
        }
      );
    },
    getSaveParams() {
      console.log('123', this.formModel.indicatorItems);
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        baseScore: this.formModel.baseScore,
        indicatorItems: this.formModel.indicatorItems,
        shopId: window.top.SHOP_ID || ''
      };
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        baseScore: 3,
        indicatorItems: []
      };
    },

    operateHandler(name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleUploadSuccess(url) {
      this.formModel.cover = url;
    },
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.formModel.id) {
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
            service.add(
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
          }
        } else {
          return false;
        }
      });
    },
    import() {
      this.dialogModel = this.getDefaultDialogModel();
      this.selTagClass = [];
      this.selTagList = [];
      this.classTagList = [];
      this.dialogVisible = true;
      this.groupList = [];
      this.dialogTableData = [];
    },

    // Dialog
    queryClassList() {
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
    },
    queryTagList(groupId) {
      service.queryTagList(
        {
          tagGroupId: groupId
        },
        data => {
          this.dialogTableData = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getDefaultDialogModel() {
      return {
        selected: []
      };
    },
    handleClassChange(val) {
      this.queryGroupList(val);
      this.$set(this.dialogModel, 'groupId', '');
    },
    handleGroupChange(val) {
      this.queryTagList(val);
    },
    dialogCancel() {
      this.dialogVisible = false;
    },
    /**
     * 判断字段是否在当前列表中已经存在
     */
    checkIncluded(text) {
      let result = false;

      if (this.formModel.indicatorItems.length === 0) return result;

      this.formModel.indicatorItems.forEach(item => {
        if (item.name === text) result = true;
      });
      return result;
    },
    dialogSave() {
      let arr = [];
      this.selTagList.forEach(item => {
        if (!this.checkIncluded(item)) {
          arr.push({ name: item, score: 0 });
        } else {
          this.$message.warning('标签已存在，不能重复导入');
        }
      });

      this.$set(this.formModel, 'indicatorItems', this.formModel.indicatorItems.concat(arr));
      this.dialogVisible = false;
    },
    selectionChangeHandler(rows) {
      this.$set(this.dialogModel, 'selected', rows);
    },
    onChange(value) {
      console.log(value);
      this.classTagList = [];
      this.getTagList(value[value.length - 1]);
    },
    getHierarchy() {
      switch (this.getUser.roleLevel) {
        case 'platform':
          return '0';
        case 'shop':
          return '1';
        default:
          return '4';
      }
    },
    getTagList(id) {
      let param = {
        tagCategoryId: id,
        searchValue: '',
        shopId: window.top.SHOP_ID || '',
        hierarchy: this.getHierarchy()
      };

      http
        .get('/admin/tag/storeTags.jhtml', param)
        .then(data => {
          console.log('标签分类下标签列表', data);
          this.classTagList = data.content;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    },
    getTagClassList() {
      this.loading = true;
      let param = {
        categoryType: '店铺能力标签',
        isIncludeParent: '1',
        shopId: window.top.SHOP_ID || ''
      };

      http
        .get('/admin/tag/storeTagcategories.jhtml', param)
        .then(data => {
          console.log('店铺标签分类逐级获取', data);
          this.loading = false;
          let ary = data.content;
          let obj;
          this.options = [];
          ary.forEach(element => {
            obj = {};
            obj.label = element.name;
            obj.value = element.id;
            this.options.push(obj);

            if (element.children && element.children.length) {
              obj.children = [];
              element.children.forEach(elementOne => {
                let objOne = {};
                objOne.label = elementOne.name;
                objOne.value = elementOne.id;
                obj.children.push(objOne);

                if (elementOne.children && elementOne.children.length) {
                  objOne.children = [];
                  elementOne.children.forEach(elementTwo => {
                    let objTwo = {};
                    objTwo.label = elementTwo.name;
                    objTwo.value = elementTwo.id;
                    objOne.children.push(objTwo);

                    if (elementTwo.children && elementTwo.children.length) {
                      objTwo.children = [];
                      elementTwo.children.forEach(elementThree => {
                        let objThree = {};
                        objThree.label = elementThree.name;
                        objThree.value = elementThree.id;
                        objTwo.children.push(objThree);
                      });
                    }
                  });
                }
              });
            }
          });
        })
        .catch(() => {})
        .finally(() => {});
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal && nVal.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    },
    selTagList(val) {
      this.dialogOperations[1].disabled = !val.length;
    }
  },
  created() {
    if (this.itemId.id) this.query();
    this.queryClassList();
    this.getTagClassList();
  }
};
</script>

<style lang="scss">
.el-dialog__body {
  .cascader {
    width: 80%;
  }

  .tag-container {
    height: 200px;
    overflow-y: auto;
    .shop-tags {
      margin: 5px;
      border-radius: 0;
    }
    .el-checkbox-button__inner {
      border-left: 1px solid #dcdfe6;
      border-radius: 0;
      border-color: #dcdfe6;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner {
      border-color: #ff7300;
    }
    .empty {
      margin: 50px 0 10px 0;
      text-align: center;
    }
  }
}

.tag-class-mgmt__base-info {
  padding-top: 20px;

  .el-form-item__content {
    margin-left: 5px;
  }

  .biz-scroller {
    padding: 20px;
  }
}
</style>
