<template>
  <div class="commodity-mgmt-parameter">
    <div class="des" style="font-size:12px">不同分类的商品需要填写的参数不同，如您需要修改/新增当前商品的分类参数请至商品分类功能 <el-button type="text" style="font-size:12px" @click="editCategory">去编辑>></el-button></div>
    <el-form ref="form" size="small" label-width="120px" :disabled="!isEdit">
      <div v-for="item in parameterGroups" :key="item.id">
        <el-form-item :label="item.name+'：'" style="font-weight: bold">
        </el-form-item>
        <el-form-item v-for="parameter in item.parameters" :key="parameter.id" :label="parameter.name+'：'" :value="parameter.id">
          <el-select v-model="parameter.value" v-if="parameter.type === '1'" clearable style="width: 80%;">
            <el-option v-for="option in configureOptions" :key="option.id" :label="option.name" :value="option.value">
            </el-option>
          </el-select>
          <el-select v-model="parameter.value" v-else-if="parameter.type === '2'" filterable allow-create clearable style="width: 80%;">
            <el-option v-for="option in assembleOptions"  :key="option.id" :label="option.name" :value="option.value">
            </el-option>
          </el-select>
          <el-input v-model="parameter.value" placeholder="请输入参数" v-else style="width: 80%;"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
// import { BizGrid } from '@/components/BizGrid';
import service from '@/service/commodity/commodity-mgmt/parameter';

export default {
  name: 'CommodityMgmtParameter',
  components: {
    BizSaveButton
  },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:product.edit']
        },
        {
          label: '取消',
          name: 'cancel',
          type: ''
        }
      ],
      // 配置值（0：無、1：標配、2：選配）
      configureOptions: [
        { id: '0', name: '-', value: '-' },
        { id: '1', name: '●', value: '●' },
        { id: '2', name: '○', value: '○' }
      ],
      // 組合值，即前兩種值的組合（解析前:前,1;后,0 解析后：前● / 后-）
      assembleOptions: [
        { id: '0', name: '主-/副-', value: '主-/副-' },
        { id: '1', name: '主-/副●', value: '主-/副●' },
        { id: '2', name: '主-/副○', value: '主-/副○' },
        { id: '3', name: '主●/副-', value: '主●/副-' },
        { id: '4', name: '主●/副●', value: '主●/副●' },
        { id: '5', name: '主●/副○', value: '主●/副○' },
        { id: '6', name: '主○/副-', value: '主○/副-' },
        { id: '7', name: '主○/副●', value: '主○/副●' },
        { id: '8', name: '主○/副○', value: '主○/副○' },
        { id: '9', name: '前-/后-', value: '前-/后-' },
        { id: '10', name: '前-/后●', value: '前-/后●' },
        { id: '11', name: '前-/后○', value: '前-/后○' },
        { id: '12', name: '前●/后-', value: '前●/后-' },
        { id: '13', name: '前●/后●', value: '前●/后●' },
        { id: '14', name: '前●/后○', value: '前●/后○' },
        { id: '15', name: '前○/后-', value: '前○/后-' },
        { id: '16', name: '前○/后●', value: '前○/后●' },
        { id: '17', name: '前○/后○', value: '前○/后○' },
        { id: '18', name: '自动-', value: '自动-' },
        { id: '19', name: '自动●', value: '自动●' },
        { id: '20', name: '自动○', value: '自动○' },
        { id: '21', name: '手动-', value: '手动-' },
        { id: '22', name: '手动●', value: '手动●' },
        { id: '23', name: '手动○', value: '手动○' }
      ],
      parameterGroups: [],
      previewDialogOpen: false
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    tabSelection: {
      type: String
    },
    open: {
      type: Boolean
    },
    baseInfo: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    categoryId: {
      type: String,
      default: ''
    }
  },
  watch: {},
  created() {
    this.query();
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    cancel() {
      this.$emit('cancel');
    },
    editCategory() {
      this.$router.push({ path: '/operating/commodity-mgmt/category', query: { id: this.categoryId, from: 'parameter' } });
    },
    query() {
      let params = {
        id: this.id
      };
      service.getParameterGroups(
        params,
        data => {
          this.parameterGroups = data.parameterGroups;
          console.log('获取商品参数成功');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取商品参数失败', this.id);
        }
      );
    },
    save() {
      let params = {
        id: this.id,
        parameterGroups: this.parameterGroups
      };
      service.updateParameterGroups(
        params,
        data => {
          this.query();
          this.$message.success('更新商品参数成功');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('更新商品参数失败', this.id);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.commodity-mgmt-parameter {
  .el-form {
    width: 70%;
  }
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-end;
  }
}
</style>
