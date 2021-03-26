<template>
  <biz-grid class="motor-club-mgmt__notice" v-loading="loading">
    <el-card class="box-card">
      <el-form
        ref="form"
        size="small"
        label-width="110px"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="formModel.content"  type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button
        :operations="innerOperations"
        @operate="operateHandler"
        v-if="isEdit"
      ></biz-save-button>
    </el-card>

    <div class="notice-list">
      <template v-for="item in list">
        <div class="notice-item" :key="item.id">
          <div class="title">{{item.title}}</div>
          <div class="date">{{item.sendTime}}</div>
          <div class="content">{{item.content}}</div>
          <el-button size="mini" type="text" @click="handleDeleteClick($event, item)">
            <i class="iconfont biz-icon-iconfontshanchu1"></i>
          </el-button>
        </div>
      </template>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { motorClubMgmt as service } from '@/common/urls';
import http from '@/common/http';
import urlUtil from '@/utils/url';

export default {
  name: 'MotorClubNotice',
  components: {
    BizSaveButton,
    BizGrid
  },
  data () {
    return {
      loading: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 4, max: 20, message: '长度不小于4位，不大于20位', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
          { min: 10, max: 500, message: '长度不小于10位，不大于500位', trigger: 'blur' }
        ]
      },
      formModel: this.getDefaultModel(),
      list: [],

      innerOperations: [
        {
          label: '发布',
          name: 'save',
          type: 'primary',
          auth: ['admin:fleet.edit']
        }
      ]
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created() {

  },
  methods: {
    init () {
      if (this.itemId.id) {
        this.query();
      } else {
        this.resetModel();
        this.list = [];
      }
    },
    query () {
      this.loading = true;

      http.get(service.notice.list, { shopId: window.top.SHOP_ID || '', fleetId: this.itemId.id })
        .then(data => {
          this.list = data.content;

          this.resetModel();

          return data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);

          return errData;
        })
        .finally(data => {
          this.loading = false;

          return data;
        });
    },
    getSaveParams () {
      return {
        fleetId: this.itemId.id,
        title: this.formModel.title,
        content: this.formModel.content
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();

      if (this.$refs.form) this.$refs.form.resetFields();
    },
    getDefaultModel () {
      return {
        title: '',
        content: ''
      };
    },

    operateHandler (name) {
      this[name]();
    },
    handleDeleteClick (e, model) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = urlUtil.toURLParams({ id: model.id });
        http.post(
          service.notice.delete + params
        )
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(data => {
            this.loading = false;
          });
      });
    },

    add () {
      this.resetModel();
      this.$refs.form.resetFields();
    },
    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = urlUtil.toURLParams(this.getSaveParams());
          http.post(
            service.notice.add + params
          )
            .then(data => {
              this.$message.success('保存成功');
              this.query();
              this.resetModel();
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(data => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  computed: {

  },
  watch: {
    itemId (nVal, oVal) {
      this.init();
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style lang="scss">
.motor-club-mgmt__notice {
  padding-top: 20px;

  .biz-scroller {

    fieldset {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-bottom: 20px;
      padding-bottom: 20px;

      legend {
        font-size: 14px;
        color: #999;
      }

      .el-form-item--small.el-form-item:last-child {
        margin-bottom: 0;
      }
    }
  }

  .notice-list {

    .notice-item {
      position: relative;
      border-bottom: 1px solid #e0e0e0;
      padding: 20px;
      font-size: 14px;
      color: #606266;

      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .date {
        font-size: 12px;
        color: #999;
        margin-bottom: 5px;
      }

      .el-button {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
}
</style>
