<template>
  <biz-grid class="open-remarks">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="功能" prop="recallTime">
        <el-select v-model="form.recallTime" placeholder="请选择功能" @change="typeChange">
          <el-option v-for="bussenies in busseniess" :key="bussenies.id" :label="bussenies.name" :value="bussenies.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" prop="keyWords" class="isRequired">
        <div class="add-tag">
          <el-input v-model="newMarketTagName" :maxlength="18" placeholder="请输入自定义关键字"></el-input>
          <el-button @click="addRecommendMarketTagByButton" type="primary">添加</el-button>
        </div>
        <div class="tag-group">
          <el-tag v-for="(tag ,index) of tags" :key="index" closable size="mini" @close="removeMarketTag(tag)">
            {{ tag }}</el-tag>
        </div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
export default {
  name: 'QaMgmtDetail',
  props: {},
  data() {
    return {
      loading: false,
      videoType: 'video',
      newMarketTagName: '',
      itemId: '',
      tags: [],
      busseniess: [],
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        recallTime: [{ required: true, message: '请选择功能', trigger: 'change' }],
        keyWords: [
          { required: false, message: '请输入关键字', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.tags.length === 0) {
                callback(new Error('请输入关键字'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        id: '',
        recallTime: ''
      };
    },
    clear() {
      this.form = this.resetForm();
    },
    typeChange() {
      http
        .get('/admin/knowledge/receptionBusseniessKeyWord.jhtml', {
          shopId: window.top.SHOP_ID || '',
          question: this.form.recallTime
        })
        .then(data => {
          this.loading = false;
          this.tags = data.data ? data.data.answer.split(',') : [];
          this.form.id = data.data ? data.data.id : '';
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    query() {
      http
        .get('/admin/reception/receptionBusseniess.jhtml', {})
        .then(data => {
          this.loading = false;
          this.busseniess = data.datas;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          let params = {
            question: this.form.recallTime,
            similarQuestion: [],
            type: '1007',
            answer: this.tags.join(','),
            id: this.form.id,
            name: this.form.recallTime,
            matchMode: '1'
          };
          if (this.form.id) {
            http
              .put('/admin/knowledge/knowledge.jhtml', params)
              .then(data => {
                this.loading = false;
                this.$message.success('保存成功');
              })
              .catch(ErrorData => {
                this.loading = false;
                console.log('ERR_REFRESH: ', ErrorData);
                this.$message.warning(ErrorData.errorMessage);
              });
          } else {
            http
              .post('/admin/knowledge/knowledge.jhtml', params)
              .then(data => {
                this.loading = false;
                this.$message.success('保存成功');
              })
              .catch(ErrorData => {
                this.loading = false;
                console.log('ERR_REFRESH: ', ErrorData);
                this.$message.warning(ErrorData.errorMessage);
              });
          }
        }
      });
    },
    addRecommendMarketTagByButton(tag) {
      if (this.newMarketTagName === '') {
        this.$message.warning('请输入自定义关键字');
        return;
      }
      tag = this.newMarketTagName;
      for (const iterator of this.tags) {
        if (iterator === tag) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    removeMarketTag(tag) {
      let index = 0;
      for (; index < this.tags.length; index++) {
        const element = this.tags[index];
        if (element === tag) {
          break;
        }
      }
      this.tags = this.tags.slice(0, index).concat(this.tags.slice(index + 1));
    }
  },
  mounted() {
    this.query();
  },
  watch: {}
};
</script>

<style lang="scss">
.open-remarks {
  .el-radio + .el-radio {
    margin-left: 0px;
  }
  .biz-save-button {
    float: left;
  }
  .el-radio {
    margin-right: 10px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  textarea[name='editorValue'] {
    display: none;
  }
}
</style>
