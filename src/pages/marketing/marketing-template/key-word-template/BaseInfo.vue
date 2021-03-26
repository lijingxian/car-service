<template>
  <biz-grid class="key-word-template__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="关键词包" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="关键词" class="isRequired"></el-form-item>
      <el-table :data="formModel.keywords" style="width: 95%;margin-left:30px" size="small">
        <el-table-column label="关键词" prop="name"></el-table-column>
        <el-table-column label="推荐出价" prop="price">
          <div slot-scope="scope" style="display:flex;">
            <span>￥</span>
            <div class="biz-customcol" style="max-width:70px">
              <el-input size="mini" v-model="scope.row.price"></el-input>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="命中率" prop="hitRate">
          <div slot-scope="scope" style="display:flex;">
            <div class="biz-customcol" style="max-width:70px">
              <el-input size="mini" v-model="scope.row.hitRate"></el-input>
            </div>
            <span>%</span>
          </div>
        </el-table-column>
        <el-table-column prop="title" label="操作" width="60px">
          <template slot-scope="scope">
            <div class="biz-customcol">
              <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="add-tag">
        <el-input v-model="newTagName" :maxlength="18" placeholder="请输入自定义关键词"></el-input>
        <el-button @click="addNewTag" type="primary">添加</el-button>
      </div>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const initData = {
  newTagName: '',
  tableData: [],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ]
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    name: '',
    store: '',
    hierarchy: '',
    id: '',
    keywords: []
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    initModel(model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    query() {
      this.loading = true;
      http
        .get('/admin/keyword/keyword.jhtml', { store: this.getUser().shop.id || window.top.SHOP_ID, id: this.itemId.id })
        .then(data => {
          // 列表
          this.initModel(data.data);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      let hierarchy = '';
      if (this.getUser().roleLevel === 'platform') {
        hierarchy = '0';
      } else {
        hierarchy = '1';
      }
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        hierarchy: hierarchy,
        keywords: this.formModel.keywords,
        store: this.getUser().shop.id || window.top.SHOP_ID
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          let flg = true;
          let keyFlg = true;
          let pFlg = true;
          let empFlg = true;
          let hitRate = true;
          this.loading = true;
          const newName = String(this.formModel.name).trim();
          if (!newName) {
            this.$message.warning('请输入关键词包!');
            this.loading = false;
            keyFlg = false;
          } else {
            keyFlg = true;
          }
          if (this.formModel.keywords.length > 0) {
            this.formModel.keywords.forEach(item => {
              if (!item.price) {
                this.$message.warning('请输入出价');
                this.loading = false;
                empFlg = false;
              } else if (!/^[0-9]+\.?[0-9]*$/.test(item.price)) {
                this.$message.warning('推荐出价格式错误!');
                this.loading = false;
                flg = false;
              } else if (!/^\d+\.?\d{0,2}$/.test(item.price)) {
                this.$message.warning('出价小数点后最多两位小数');
                this.loading = false;
                pFlg = false;
              }
              if (!item.hitRate) {
                this.$message.warning('请输入命中率');
                this.loading = false;
                hitRate = false;
              } else if (!/^[0-9]+\.?[0-9]*$/.test(item.hitRate)) {
                this.$message.warning('命中率格式错误!');
                this.loading = false;
                hitRate = false;
              } else if (Number(item.hitRate) >= 100 || Number(item.hitRate) <= 0) {
                this.$message.warning('命中率范围为0.01-99.99!');
                this.loading = false;
                hitRate = false;
              } else if (!/^\d+\.?\d{0,2}$/.test(item.hitRate)) {
                this.$message.warning('命中率小数点后最多两位小数');
                this.loading = false;
                hitRate = false;
              }
            });
          } else {
            this.$message.warning('请添加关键词!');
            this.loading = false;
            return false;
          }
          if (flg && keyFlg && pFlg && empFlg && hitRate) {
            const success = data => {
              this.loading = false;
              this.$message.success('保存成功');
              this.$emit('operationSuccess');
            };
            const failed = errData => {
              this.loading = false;
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            };
            const final = data => {
              this.loading = false;
            };

            if (this.formModel.id) {
              http
                .put('/admin/keyword/keyword.jhtml', this.getSaveParams())
                .then(success)
                .catch(failed)
                .finally(final);
            } else {
              http
                .post('/admin/keyword/keyword.jhtml', this.getSaveParams())
                .then(success)
                .catch(failed)
                .finally(final);
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    },
    rowDeleteClickHandler(val) {
      this.formModel.keywords.splice(val.$index, 1);
    },
    addNewTag() {
      const newName = String(this.newTagName).trim();
      if (!newName) {
        this.$message.warning('请输入自定义关键词');
        return false;
      }
      for (const keyword of this.formModel.keywords) {
        if (keyword.name === newName) {
          this.$message.warning('该关键词已存在，请重新添加');
          return false;
        }
      }
      this.formModel.keywords = [
        ...new Set(this.formModel.keywords.concat({ id: '', category: '', name: newName, price: '1.00', hitRate: '60' }))
      ];
      this.newTagName = '';
    }
  }
};

export default {
  name: 'KeyWordBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...initData,
      ...formData.data,

      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.key-word-template__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    padding-right: 20px;
  }
  .add-tag {
    display: flex;
    padding: 10px 0px 7px 30px;
    .el-input {
      margin-right: 10px;
      font-size: 13px;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .el-button--primary {
      padding: 7px 15px;
    }
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
