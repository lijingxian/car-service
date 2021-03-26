<template>
  <el-select :value="value" @input="handleInput" placeholder="请选择" style="width: 100%;" :disabled="disabled">
    <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import { mapGetters } from 'vuex';
export default {
  name: 'BizShopPicker',
  components: {},
  props: {
    value: {
      default() {
        return '';
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    operatorId: {
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      shopList: []
    };
  },
  methods: {
    ...mapGetters(['currentUser']),
    queryShop() {
      axios
        .get('/admin/admin/json/queryShops.jhtml', {
          params: {
            companyId: this.operatorId
          }
        })
        .then(
          responseHandle(
            data => {
              this.shopList = data.shopDatas;
              if (this.shopList.length === 0) {
                this.shopList.push(this.currentUser().shop);
              }
            },
            errData => {
              console.log(errData);
              console.log('code错误');
            }
          )
        )
        .catch(error => {
          console.error(error);
        });
    },

    handleInput(val) {
      this.$emit('input', val);
    }
  },
  watch: {
    operatorId(val) {
      this.queryShop();
    }
  },
  created() {
    this.queryShop();
  }
};
</script>

<style lang="scss">
</style>
