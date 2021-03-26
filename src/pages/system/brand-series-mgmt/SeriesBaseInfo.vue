<template>
  <biz-grid class="series-base-info-system">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading">
      <el-form-item label="系列名称" prop="name">
        <el-input placeholder="请输入系列名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Logo" prop="image">
        <BrandSeriesUploader v-model="form.image" title="建议尺寸3:2">
        </BrandSeriesUploader>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import BrandSeriesUploader from './BrandSeriesUploader';
import DefaultImg from '@/assets/images/commodity/brand-default.png';
import seriesBaseInfoService from '@/service/system-setting/brand-series-mgmt/baseInfo';

export default {
  name: 'SeriesBaseInfo',
  data() {
    return {
      isCreated: true,
      loading: false,
      list: [],
      // seriesQueryList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        id: '',
        name: '',
        image: DefaultImg
      },
      DefaultImg: DefaultImg,
      rules: {
        name: [{ required: true, message: '请输入系列名称', trigger: 'focus' }],
        image: [{ required: true, message: '请添加系列Logo', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BrandSeriesUploader },
  props: {
    id: {
      type: String,
      default: ''
    },
    brandId: {
      type: String,
      default: ''
    },
    refreshSign: Boolean,
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.isCreated = true;
        this.seriesQueryList = [];
        this.form.name = '';
        this.form.image = DefaultImg;
      } else {
        if (this.id !== '') {
          this.isCreated = false;
        } else {
          this.isCreated = true;
          this.refresh();
        }
      }
    },
    refreshSign: function() {
      this.isCreated = false;
      this.refresh();
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
          if (this.isCreated) {
            this.createSeries();
          } else {
            this.updateSeries();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id,
        brandId: this.brandId
      };
      seriesBaseInfoService.queryBySeries(
        params,
        data => {
          this.form.name = data.seriesData.name;
          this.form.image = data.seriesData.image;
          // this.seriesQueryList = data.seriesDataList;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    createSeries() {
      let params = {
        brandId: this.brandId,
        name: this.form.name,
        image: this.form.image
      };
      seriesBaseInfoService.createSeries(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('created');
          this.$emit('createdSeriesSuccess', data.id);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    updateSeries() {
      let params = {
        id: this.id,
        name: this.form.name,
        image: this.form.image,
        brandId: this.brandId
      };
      seriesBaseInfoService.updateSeries(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    handleUploadSuccess(url) {
      this.form.image = url;
    }
    // querySearchAsync(queryString, callback) {
    //   for (let i of this.seriesQueryList) {
    //     i.value = i.name;
    //   }
    //   this.list = this.seriesQueryList;
    //   callback(this.list);
    // },
    // handleSelect(item) {
    //   for (let i of this.list) {
    //     if (i.id === item.id) {
    //       this.form.image = i.image;
    //     }
    //   }
    //   console.log(item);
    // }
  }
};
</script>

<style lang="scss">
.series-base-info-system {
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
