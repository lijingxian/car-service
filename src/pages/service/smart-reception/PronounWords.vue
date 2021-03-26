<template>
  <biz-grid class="potential-customer__channel-setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="120px" :model="form">
      <el-form-item label="指代词">
        <div v-for="(item,index) in tableData" :key="index">
          <el-input v-model="item.name">
            <el-button slot="append" icon="el-icon-circle-plus" v-if="tableData.length-1===index" @click="add"></el-button>
            <el-button slot="append" icon="el-icon-circle-close" v-if="tableData.length>1" @click="remove(item)"></el-button>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';

const data = {
  data: {
    loading: false,
    operations: [
      {
        label: '保存',
        name: 'save',
        type: 'primary'
      }
    ],
    form: {
      id: ''
    },
    tableData: [{ name: '' }],
    tempData: [],
    day: ''
  },
  methods: {
    upperCaseConverter(row) {
      return row.level.toUpperCase();
    },
    query() {
      this.loading = true;
      http
        .get('/admin/knowledge/receptionPronounKeyWord.jhtml', { shopId: window.top.SHOP_ID || '', question: '指代词' })
        .then(data => {
          if (data.data) {
            let tempData = data.data.answer.split(',');
            this.tableData = this.convertData(tempData);
            this.form.id = data.data.id;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    convertData(arr) {
      let temp = [];
      arr.forEach(item => {
        let obj = Object.assign({}, { name: item });
        temp.push(obj);
      });

      return temp;
    },
    convertSaveData(arr) {
      let temp = [];
      arr.forEach(item => {
        temp.push(item.name);
      });

      return temp.join(',');
    },
    add() {
      this.tableData.push({ name: '' });
    },
    remove(data) {
      this.$confirm('确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData.splice(this.tableData.indexOf(data), 1);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    save() {
      let arr = this.convertSaveData(this.tableData);
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          let params = {
            question: '指代词设置',
            similarQuestion: [],
            type: '1008',
            answer: arr,
            id: this.form.id,
            name: '指代词设置',
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
    }
  },
  events: {
    operateHandler(name) {
      this[name]();
    }
  }
};

export default {
  name: 'ChannelSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...data.data
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
  created() {
    this.query();
  },
  methods: {
    ...data.events,
    ...data.methods
  },
  watch: {
    itemId(nVal, oVal) {
      console.log(nVal);
      this.query();
    }
  }
};
</script>

<style lang="scss">
.potential-customer__channel-setting {
  padding-top: 20px;
  .biz-save-button {
    float: left;
  }
  .el-form {
    padding: 0 20px;
    .el-form-item__label {
      text-align: left;
    }
  }
}
</style>
