<template>
  <biz-grid class="inventory-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="编号" prop="sn" v-if="itemId">
        <el-input v-model="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="盘点仓库" prop="depotId">
        <el-select v-model="form.depotId" placeholder="请选择盘点仓库" style="width:100%" :disabled="!!itemId">
          <el-option v-for="type in depotList" :key="type.id" :label="type.name" :value="type.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建者" prop="creatorName" v-if="itemId">
        <el-input v-model="form.creatorName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state" v-if="itemId">
        <el-input :value="stateFormatter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate" v-if="itemId">
        <el-input v-model="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

// 获取默认表单项
const getDefaultModel = () => {
  return {
    depotId: '',
    remark: '',
    id: '',
    shopId: ''
  };
};
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogVisible: false,
      form: getDefaultModel(),
      depotList: [],
      itemDatas: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:check.edit']
        }
      ],
      rules: {
        depotId: [{ required: true, message: '请选择盘点仓库', trigger: 'blur' }]
      }
    };
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case '0':
          return '盘点中';
        case '1':
          return '盘点完成';
        case '2':
          return '已调整';
        default:
          return '--';
      }
    }
  },
  created() {
    this.queryDepotList();
  },
  watch: {
    itemId(val) {
      if (val !== '') {
        this.queryInventory(val);
      } else {
        this.form = this.getDefaultModel();
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    initModel(model) {
      if (model) {
        this.form = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    resetModel() {
      this.form = this.getDefaultModel();
    },
    queryInventory(id) {
      this.loading = true;
      http
        .get(urls.invoicing.inventory.inventory, { shopId: window.top.SHOP_ID || '', id: id })
        .then(data => {
          this.loading = false;
          // 列表
          this.initModel(data.data);
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDefaultModel() {
      return getDefaultModel();
    },
    queryDepotList() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.storeHouseMgmt.shopDepotList, params)
        .then(data => {
          for (const list of data.dataList) {
            if (list.enabled === '1') {
              this.depotList.push(list);
            }
          }
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
    getSaveParams() {
      return {
        id: this.form.id,
        depotId: this.form.depotId,
        remark: this.form.remark,
        shopId: window.top.SHOP_ID || ''
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            http
              .put(urls.invoicing.inventory.inventory, this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                this.$message.warning(error.errorMessage);
              })
              .finally(data => {
                this.loading = false;
              });
          } else {
            http
              .post(urls.invoicing.inventory.inventory, this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess', data.id);
                this.queryInventory(data.id);
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                this.$message.warning(error.errorMessage);
              })
              .finally(data => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.inventory-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-collapse-item__header.is-active {
    background-color: #fef3e5;
  }
  .el-collapse-item__wrap {
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
  .title-class {
    display: flex;
    justify-content: space-between;
    .title-class-one {
      color: #ff7300;
      .el-badge__content.is-fixed.is-dot {
        top: 18px;
        right: 0px;
      }
    }
    .title-class-two {
      color: red;
      font-size: 10px;
      padding-right: 10px;
    }
  }

  .el-form-item__content .el-select {
    width: 100%;
  }
  .biz-grid__content .biz-scroller {
    padding-left: 20px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .imgUpload {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 58px;
      height: 58px;
    }
    .el-upload--picture-card {
      width: 58px;
      height: 58px;
      line-height: 68px;
    }
  }
}
</style>
