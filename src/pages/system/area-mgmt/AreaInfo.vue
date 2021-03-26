<template>
  <biz-grid class="area-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small">
      <el-form-item label="上级地区:">
        <div>
          <div class="biz-customcol">
            {{form.parentAreaData?form.parentAreaData.name:''}}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="order">
        <el-input placeholder="请输入排序" v-model="form.order"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/system-setting/area-mgmt/areaMgmt';

export default {
  name: 'AreaInfo',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: '',
        order: '',
        english: '',
        parentAreaData: this.getDefaultParentAreaData()
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid },
  props: {
    areaId: {
      type: String,
      default: ''
    },
    parentAreaId: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    areaId(Val) {
      if (this.open === true) {
        this.refresh();
      }
    },
    open(val) {
      this.$refs.form.clearValidate();
      if (!val) {
        this.clearFormData();
      } else {
        if (this.areaId === '') {
          this.refresh();
        }
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.areaId === '') {
            this.addArea();
          } else {
            this.updateArea();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.areaId === '' ? this.parentAreaId : this.areaId
      };
      Service.query(
        params,
        data => {
          if (this.areaId === '') {
            this.form.parentAreaData = data.area;
          } else {
            this.form.name = data.area.name;
            this.form.order = data.area.order;
            this.form.english = data.area.english;
            this.form.parentAreaData = data.area.parentAreaData;
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    addArea() {
      let params = {
        name: this.form.name,
        order: this.form.order,
        english: '',
        parentAreaData: {
          id: this.parentAreaId
        }
      };
      Service.add(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.$emit('addSuccessNotification', data.id);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    updateArea() {
      let params = {
        id: this.areaId,
        name: this.form.name,
        order: this.form.order
      };
      Service.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    clearFormData() {
      this.form.name = '';
      this.form.order = '';
      this.form.english = '';
      this.form.parentAreaData = this.getDefaultParentAreaData();
    },
    getDefaultParentAreaData() {
      return {
        id: '',
        name: '',
        order: '',
        english: '',
        parentAreaData: {
          id: '',
          name: '',
          order: '',
          english: ''
        },
        parentParentAreaData: {
          id: '',
          name: '',
          order: '',
          english: ''
        }
      };
    }
  }
};
</script>

<style lang="scss">
.area-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
