<template>
  <div class="biz-area-select">
    <el-select v-model="provinceId" placeholder="省" :disabled="disabled">
      <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="cityId" placeholder="市" :disabled="disabled">
      <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="areaId" @change="updateValue" placeholder="区" v-if="areaOptions.length != 0" :disabled="disabled">
      <el-option v-for="item in areaOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from 'axios';
import urls from '@/common/urls';

export default {
  name: 'AreaSelect',
  data() {
    return {
      isInitValue: false,
      cityIdTemp: '',
      cityId: '',
      provinceId: '',
      provinceOptions: [],
      cityOptions: [],
      areaOptions: []
    };
  },
  props: {
    areaId: {
      type: String,
      required: true,
      default: '1568'
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  created() {
    this.init();
  },
  watch: {
    provinceId: async function(provinceId) {
      // this.isInitValue = false;
      await this.getCities();
    },
    cityId: function(cityId) {
      this.getAreas();
    },
    areaId: async function(areaId) {
      console.log(22);
      this.isInitValue = true;
      // 两级
      if (this.areaOptions.length === 0) {
        for (const area of this.cityOptions) {
          if (areaId === area.id) {
            this.isInitValue = false;
            this.cityId = areaId;
          }
        }
        // 三级
      } else {
        for (const area of this.areaOptions) {
          if (areaId === area.id) {
            this.isInitValue = false;
          }
        }
      }

      // areaId不在现有的表中
      if (this.isInitValue) {
        await this.getParent();
      }
    }
  },
  methods: {
    init() {
      // 初始有值
      if (this.areaId === '') {
        this.getProvince();
      } else {
        this.getParent();
      }
    },
    getProvince() {
      axios
        .get(urls.merchantsMgmt.areaList)
        .then(response => {
          this.provinceOptions = response.data.areaDatas;
          this.provinceId = this.provinceOptions[0].id;
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    getCities: async function() {
      let params = {
        parentId: this.provinceId
      };
      try {
        let response = await axios.get(urls.merchantsMgmt.areaList, {
          params: params
        });
        this.cityOptions = response.data.areaDatas;
        console.log('city');
        if (this.isInitValue) {
          this.cityId = this.cityIdTemp;
        } else {
          this.cityId = this.cityOptions[0].id;
        }
      } catch (error) {
        console.error(error);
      }
    },
    getAreas: async function() {
      let params = {
        parentId: this.cityId
      };
      let response = await axios.get(urls.merchantsMgmt.areaList, {
        params: params
      });

      if (response.data.areaDatas.length === 0) {
        this.areaOptions = [];
        this.$emit('areaChanged', this.cityId, this.provinceId);
      } else {
        if (this.isInitValue) {
          this.areaOptions = response.data.areaDatas;
          this.areaId = this.areaOptions[0].id;
          this.isInitValue = false;
        } else {
          this.areaOptions = response.data.areaDatas;
          this.areaId = this.areaOptions[0].id;
          this.$emit('areaChanged', this.areaOptions[0].id, this.cityId, this.provinceId);
        }
      }
    },
    getParent: async function() {
      // 判断是否有初始areaId
      if (this.provinceOptions.length === 0) {
        let response = await axios.get(urls.merchantsMgmt.areaList);
        this.provinceOptions = response.data.areaDatas;
      }

      let params = {
        areaId: this.areaId
      };
      console.log(1231);
      let isTwoLevel = false;
      try {
        let response1 = await axios.get(urls.merchantsMgmt.areaParent, {
          params: params
        });
        for (const province of this.provinceOptions) {
          if (response1.data.areaData.id === province.id) {
            // 二级
            isTwoLevel = true;
          }
        }
        if (isTwoLevel) {
          this.cityIdTemp = this.areaId;
          this.provinceId = response1.data.areaData.id;
          this.areaOptions = [];
          console.log(123);
        } else {
          let isSameProvince = false;
          for (const city of this.cityOptions) {
            if (city.id === response1.data.areaData.id) {
              isSameProvince = true;
            }
          }

          if (isSameProvince) {
            this.cityId = response1.data.areaData.id;
          } else {
            params.areaId = response1.data.areaData.id;
            let response2 = await axios.get(urls.merchantsMgmt.areaParent, {
              params: params
            });
            this.isInitValue = true;
            this.cityIdTemp = response1.data.areaData.id;
            this.provinceId = response2.data.areaData.id;
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateValue(value) {
      console.log(1);
      this.$emit('areaChanged', value, this.cityId, this.provinceId);
    }
  }
};
</script>

<style lang="scss">
.biz-area-select {
  display: flex;
  flex-direction: column;
  .el-select {
    margin: 3px 0;
  }
}
</style>
