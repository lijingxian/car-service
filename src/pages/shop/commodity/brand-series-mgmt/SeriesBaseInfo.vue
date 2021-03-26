<template>
  <biz-grid class="series-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="系列名称" prop="name">
        <el-autocomplete placeholder="请输入系列名称" v-model="form.name" :fetch-suggestions="querySearchAsync" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item label="Logo" prop="image">
        <BrandSeriesUploader v-model="form.image" title="建议尺寸3:2" @handleUploadSuccess="handleUploadSuccess">
        </BrandSeriesUploader>
      </el-form-item>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import BrandSeriesUploader from './BrandSeriesUploader';
import seriesBaseInfoService from '@/service/commodity/brand-series-mgmt/baseInfo';
import urls from '@/common/urls';
import axios from 'axios';
import DefaultImg from '@/assets/images/commodity/brand-default.png';
import { VueCropper } from '@/components/BizForm';
export default {
  name: 'SeriesBaseInfo',
  data() {
    return {
      openV: false,
      picUrl: '',
      isCreated: true,
      loading: false,
      list: [],
      DefaultImg: DefaultImg,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:shopBrand.edit']
        }
      ],
      form: {
        id: '',
        name: '',
        image: DefaultImg
      },
      rules: {
        name: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
        image: [{ required: true, message: '请添加系列Logo', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BrandSeriesUploader, VueCropper },
  props: {
    id: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    brandId: {
      type: String,
      default: ''
    },
    refreshSign: Boolean
  },
  watch: {
    id: function(id) {
      if (id === '') {
        this.isCreated = true;
        this.form.name = '';
        this.form.image = DefaultImg;
      }
    },
    refreshSign: function() {
      this.isCreated = false;
      this.$refs.form.clearValidate();
      this.refresh();
    }
  },
  created() {},
  computed: {},
  methods: {
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.form.logo = url;
    },
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
        shopId: window.top.SHOP_ID || ''
      };
      seriesBaseInfoService.queryBySeries(
        params,
        data => {
          this.form.name = data.seriesData.name;
          this.form.image = data.seriesData.image;
          this.brandId = data.brandData.id;
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
      console.log(url);
      this.picUrl = url;
      this.openV = true;
    },
    querySearchAsync: async function(queryString, callback) {
      let params = {
        shopId: window.top.SHOP_ID || '',
        bid: this.brandId
      };
      try {
        let response = await axios.get(urls.commodity.querySeries, {
          params: params
        });
        for (let i of response.data.seriesData) {
          i.value = i.name;
        }
        this.list = response.data.seriesData;
        callback(this.list);
      } catch (error) {
        console.error(error);
      }
    },
    handleSelect(item) {
      for (let i of this.list) {
        if (i.id === item.id) {
          this.form.image = i.image;
        }
      }
      console.log(item);
    },
    clear() {
      this.isCreated = true;
      this.form = {
        id: '',
        name: '',
        image: DefaultImg
      };
    }
  }
};
</script>

<style lang="scss">
.series-base-info {
  .biz-save-button {
    margin-top: 5px;
    float: left;
  }
  .el-autocomplete {
    width: 50%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
