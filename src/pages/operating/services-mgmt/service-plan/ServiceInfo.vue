<template>
  <biz-grid class="services-mgmt__service-info">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <!-- <el-form ref="form" size="small" label-width="120px">
      <div class="form" style="display:flex;">
        <el-form-item label="规格"></el-form-item>
        <el-form-item label="价格"></el-form-item>
        <el-form-item label="折扣" style="margin-left:10px;"></el-form-item>
      </div>
      <div class="period" style="display:flex;width: 420px;margin-left: 20px;" v-for="item in productDatas.specifications" :key="item.sId">
        <div>{{item.period}}{{categoryType === '0'?'个月':'条'}}</div>
        <div>{{item.price}}</div>
        <el-select v-model="item.discount" placeholder="无">
          <el-option v-for="option in discountList" :key="option.value" :value="option.value" :label="option.label">
          </el-option>
        </el-select>
      </div>
    </el-form> -->
    <el-table :data="productDatas" height="600px" size="small" highlight-current-row tooltip-effect="dark" stripe>
      <el-table-column label="规格" prop="period">
        <template slot-scope="scope">
          {{formatter(scope.row.period)}}
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="price" width="150px"></el-table-column>
      <!-- <el-table-column label="折扣" prop="memo">
        <template slot-scope="scope">
          <el-select v-model="scope.row.discount" placeholder="无">
            <el-option v-for="option in discountList" :key="option.value" :value="option.value" :label="option.label">
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
    </el-table>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
export default {
  name: 'ServiceInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      productDatas: [],
      specificationsData: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      discountList: [
        {
          label: '无',
          value: '1'
        },
        {
          label: '9折',
          value: '0.9'
        },
        {
          label: '8.5折',
          value: '0.85'
        },
        {
          label: '8折',
          value: '0.8'
        },
        {
          label: '7.5折',
          value: '0.75'
        },
        {
          label: '7折',
          value: '0.7'
        },
        {
          label: '6折',
          value: '0.6'
        }
      ]
    };
  },
  computed: {},
  props: {
    id: {
      type: String,
      default: ''
    },
    categoryType: {
      type: String,
      default: '0'
    },
    tabSelection: {
      type: String
    }
  },
  created() {},
  methods: {
    operateHandler(name) {
      this[name]();
    },
    formatter(val) {
      if (this.categoryType === '0') {
        if (val > 11) {
          return val / 12 + '年';
        } else {
          return val + '个月';
        }
      } else {
        return val + '条';
      }
    },
    query() {
      this.isCreated = true;
      this.isSetting = true;
      http
        .get('/admin/solution/solution.jhtml', {
          shopId: window.top.SHOP_ID || '',
          categoryType: '0',
          id: this.id
        })
        .then(data => {
          this.productDatas = data.content.specifications;
          this.$nextTick(() => {
            this.isCreated = false;
            this.isSetting = false;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    querySms() {
      this.isCreated = true;
      this.isSetting = true;
      http
        .get('/admin/solution/solution.jhtml', {
          shopId: window.top.SHOP_ID || '',
          categoryType: '1',
          id: this.id
        })
        .then(data => {
          this.productDatas = data.content.BusinessSpecifications;
          this.$nextTick(() => {
            this.isCreated = false;
            this.isSetting = false;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      let params = {
        id: this.id,
        specifications: this.productDatas
      };
      http
        .put('/admin/solution/solution.jhtml', params)
        .then(data => {
          if (this.categoryType === '1') {
            this.querySms();
          } else {
            this.query();
          }
          this.$message.success('更新成功');
          // this.$emit('operationSuccess');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    }
  },
  watch: {
    tabSelection(val) {
      if (val === 'second') {
        if (this.id !== '') {
          if (this.categoryType === '1') {
            this.querySms();
          } else {
            this.query();
          }
        }
      }
    }
  }
};
</script>

<style lang="scss">
.services-mgmt__service-info {
  padding-top: 20px;
  .biz-save-button {
    margin-bottom: 0px;
    justify-content: flex-start;
    .el-button--small {
      margin-left: 20px;
    }
  }
  .biz-scroller {
    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
