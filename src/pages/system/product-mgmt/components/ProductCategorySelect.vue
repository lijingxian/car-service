<template>
  <div class="product-category-select">
    <el-form label-width="130px" size="small">
      <!-- <el-form-item label="商品分类：" :required="true">
        <el-select :value="categoryId" placeholder="分类" @change="categoryChange" style="width: 80%;">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="品牌：">
        <el-select :value="brandId" placeholder="请输入品牌" @change="brandChange" style="width: 80%;">
          <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列：">
        <el-select :value="seriesId" placeholder="请输入系列" @change="seriesChange" style="width: 80%;">
          <el-option v-for="item in seriesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" :required="true">
        <el-autocomplete :value="name" :fetch-suggestions="querySearchAsync" placeholder="请输入名称" @input="onInputName" @select="selectName"></el-autocomplete>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'ProductCategorySelect',
  data() {
    return {
      brandOptions: [],
      seriesOptions: [],
      restaurants: []
    };
  },
  props: {
    initializing: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: String,
      default: ''
    },
    brandId: {
      type: String,
      default: ''
    },
    seriesId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {},
  created() {},
  watch: {
    categoryId(categoryId) {
      if (categoryId) {
        this.getBrands();
      }
      if (!this.initializing) {
        this.$emit('update:brandId', '');
      }
    },
    brandId(brandId) {
      if (!brandId) {
        this.seriesOptions = [];
        this.$emit('update:seriesId', '');
        return;
      }
      if (!this.initializing) {
        this.$emit('update:seriesId', '');
      }
      this.getSeries();
    },
    seriesId(seriesId) {
      if (!seriesId) {
        this.restaurants = [];
        this.$emit('update:name', '');
        return;
      }
      if (!this.initializing) {
        this.$emit('update:name', '');
      }
      this.getName();
    }
  },
  mounted() {},
  methods: {
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 300 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return true;
      };
    },
    getBrands() {
      if (this.categoryId === '') {
        return;
      }
      let params = {
        categoryId: this.categoryId
      };
      http.get(urls.commodity.getBrands, params).then(data => {
        this.brandOptions = data.brands;
        // this.$emit('update:brandId', '');
      });
    },
    getSeries() {
      if (this.brandId === '') {
        return;
      }
      let params = {
        shopBrandId: this.brandId
      };
      http.get(urls.commodity.getSeries, params).then(data => {
        this.seriesOptions = data.series;
        // this.$emit('update:seriesId', '');
      });
    },
    getName() {
      if (this.seriesId === '') {
        return;
      }
      let params = {
        shopBrandId: this.brandId,
        shopSeriesId: this.seriesId
      };
      http.get(urls.commodity.getName, params).then(data => {
        this.restaurants = data.Type.map(item => {
          return { value: item, id: item };
        });
      });
    },
    categoryChange(categoryId) {
      this.$emit('update:categoryId', categoryId);
    },
    brandChange(brandId) {
      this.$emit('update:brandId', brandId);
    },
    seriesChange(seriesId) {
      this.$emit('update:seriesId', seriesId);
    },
    onInputName(name) {
      this.$emit('update:name', name);
    },
    selectName(obj) {
      this.$emit('update:name', obj.value);
    }
  }
};
</script>

<style lang="scss">
.product-category-select {
  display: flex;
  flex-direction: column;
  .el-autocomplete {
    width: 80%;
  }
}
</style>
