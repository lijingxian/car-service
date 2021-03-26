<template>
  <biz-grid class="promise-rating-mgmt__promise-base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
      <el-form-item label="承诺名称" prop="name">
        <el-autocomplete v-model="formModel.name" :fetch-suggestions="handleRemote" placeholder="请输入承诺名称" :trigger-on-focus="true"
          @select="handlePromiseChange" value-key="name" :maxlength="5" style="width: 100%;"></el-autocomplete>
      </el-form-item>
      <el-form-item label="承诺图标">
        <biz-avatar-uploader-new v-model="formModel.icon">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="承诺描述">
        <el-input v-model="formModel.description" type="textarea" :maxlength="200" placeholder="请输入承诺描述"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/shop-rate/PromiseBaseInfo';
import urls from '@/common/urls';
import http from '@/common/http';
const getDefaultModel = function() {
  return {
    icon: ''
  };
};

// 属性
const data = {
  loading: false,
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ],
  rules: {
    name: [{ required: true, message: '请输入承诺名称', trigger: 'blur' }]
  },
  formModel: getDefaultModel()
};

// 方法
const methods = {
  query() {
    this.loading = true;
    service.query(
      {
        id: this.itemId.id,
        terminalTypeId: '2'
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
    return {
      id: this.formModel.id,
      name: this.formModel.name,
      icon: this.formModel.icon,
      description: this.formModel.description
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
  handleAreaChanged(areaId) {
    this.formModel.area.id = areaId;
  }
};

// 承诺默认列表相关
const promiseData = {
  data: {
    promiseList: []
  },
  events: {
    handlePromiseChange(val) {
      this.$set(this.formModel, 'icon', val.value);
      this.$set(this.formModel, 'name', val.name);
      this.$refs.form.validate();
    },
    handleRemote(key, callback) {
      if (key) {
        let arr = this.promiseList.filter(item => {
          return item.name.indexOf(key) >= 0;
        });
        callback(arr);
      } else {
        callback(this.promiseList);
      }
    }
  },
  methods: {
    queryPromiseList() {
      http
        .get(urls.systemSetting.promiseList, {})
        .then(data => {
          console.log('承诺图标列表', data);
          this.itemList = data.content.map(item => {
            return { name: item.name, value: item.icon, description: item.description };
          });
          this.promiseList = [
            { name: '一次修好', value: 'static/promises/yicixiuhao.png', description: '' },
            { name: '一年保修', value: 'static/promises/yinianbaoxiu.png', description: '' },
            { name: '24小时救援', value: 'static/promises/24xiaoshijiuyuan.png', description: '' },
            { name: '低价保证', value: 'static/promises/dijiabaozheng.png', description: '' },
            { name: '就近安装', value: 'static/promises/jiujinanzhuang.png', description: '' },
            { name: '快速维修', value: 'static/promises/kuaisuweixiu.png', description: '' },
            { name: '无理由退换', value: 'static/promises/wuliyoutuihuan.png', description: '' },
            { name: '验收无忧', value: 'static/promises/yanshouwuyou.png', description: '' },
            { name: '正品保证', value: 'static/promises/zhengpinbaozheng.png', description: '' },
            { name: '专属接待', value: 'static/promises/zhuanshujiedai.png', description: '' },
            { name: '专业服务', value: 'static/promises/zhuanyefuwu.png', description: '' }
          ].concat(this.itemList);
        })
        .catch(error => {
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    }
  }
};

export default {
  name: 'PromiseBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew
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
      ...data,
      ...promiseData.data
    };
  },
  methods: {
    ...methods,

    ...events,

    ...promiseData.methods,
    ...promiseData.events
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal && nVal.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();

    this.queryPromiseList();
  }
};
</script>

<style lang="scss">
.promise-rating-mgmt__promise-base-info {
  padding-top: 20px;
}
</style>
