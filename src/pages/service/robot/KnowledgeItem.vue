<template>
  <biz-grid class="cs-knowledge-item">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operate">
    </biz-save-button>
    <el-form v-loading="loading"
             :rules="rules"
             ref="form"
             :model="form"
             :inline-message="true"
             label-width="100px"
             size="small">
      <el-form-item label="类别"
                    prop="firstType">
        <el-select v-model="form.firstType" @change="firstTypeChange">
          <el-option :label="type.label"
                     :value="type.value"
                     :key="index"
                     v-for="(type,index) of FList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子类别"
                    prop="secondType">
        <el-select v-model="form.secondType">
          <el-option :label="type.label"
                     :value="type.value"
                     :key="index"
                     v-for="(type,index) of SList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字"
                    prop="question">
        <el-input placeholder="请输入关键字"
                  type="textarea"
                  :rows="2"
                  v-model="form.question"></el-input>
      </el-form-item>
      <el-form-item label="客服答案"
                    prop="answer">
        <el-input placeholder="请输入客服答案"
                  type="textarea"
                  :rows="2"
                  v-model="form.answer"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import RobotService from '@/service/customer-service/robot/robot';

export default {
  name: 'KnowledgeItem',
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:knowledgeBase.edit']
        }
      ],
      form: {
        firstType: '',
        secondType: '',
        question: '',
        answer: ''
      },
      rules: {
        firstType: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ],
        secondType: [
          { required: true, message: '请选择子类别', trigger: 'change' }
        ],
        question: [
          { required: true, message: '请输入关键字', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请输入客服答案', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 100个字符之内', trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    KFatherTypeList: Array,
    activatedObj: Object
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  created() {},
  mounted() {},
  computed: {
    FList() {
      let list = [];
      for (const iterator of this.KFatherTypeList) {
        list.push({
          value: iterator.id,
          label: iterator.name
        });
      }
      return list;
    },
    SList() {
      let list = [];
      for (const iterator of this.KFatherTypeList) {
        if (iterator.id === this.form.firstType) {
          for (const siterator of iterator.list) {
            list.push({
              value: siterator.id,
              label: siterator.name
            });
          }
          break;
        }
      }
      return list;
    }
  },
  watch: {
    activatedObj(obj) {
      console.log(obj);
      this.$refs.form.resetFields();
      if (obj.id === '') {
        this.clear();
      } else {
        this.refresh();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    firstTypeChange() {
      this.form.secondType = '';
    },
    clear() {
      this.form.firstType = '';
      this.form.secondType = '';
      this.form.question = '';
      this.form.answer = '';
    },
    save() {
      if (this.isCreated()) {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        let params = {
          question: this.form.question,
          answer: this.form.answer,
          parentCategory: {
            id: this.form.firstType
          },
          childCategory: {
            id: this.form.secondType
          }
        };
        this.loading = true;
        RobotService.createK(
          params,
          data => {
            this.$message.success('操作成功');
            this.loading = false;
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    update() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        let params = {
          id: this.activatedObj.id,
          question: this.form.question,
          answer: this.form.answer,
          parentCategory: {
            id: this.form.firstType
          },
          childCategory: {
            id: this.form.secondType
          }
        };
        this.loading = true;
        RobotService.updateK(
          params,
          data => {
            this.$message.success('操作成功');
            this.loading = false;
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    refresh() {
      let params = {
        id: this.activatedObj.id
      };
      RobotService.getK(
        params,
        data => {
          this.form.firstType = data.data.parentCategory.id;
          this.form.secondType = data.data.childCategory.id;
          this.form.question = data.data.question;
          this.form.answer = data.data.answer;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    isCreated() {
      return this.activatedObj.id === '';
    }
  }
};
</script>

<style lang="scss">
.cs-knowledge-item {
  .biz-save-button {
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
  }
}
</style>
