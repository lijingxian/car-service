<template>
  <biz-grid class="commodity-mgmt-attribute">
    <biz-save-button slot="top" :operations="operations" @operate="operate"  v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="120px" :disabled="!isEdit">
      <el-form-item v-for="item in attributeDatas" :key="item.id" :label="item.name+'：'" :value="item.id">
        <el-select v-model="item.value" placeholder="请选择属性值" style="width: 80%;" clearable >
          <el-option v-for="option in item.options" :key="option" :label="option" :value="option">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="attributeDatas.length === 0" :style="styleObject"></div>
  </biz-grid>
</template>
<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/commodity/commodity-mgmt/attribute';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'CommodityMgmtAttribute',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:product.edit']
        }
      ],
      attributeDatas: []
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
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  watch: {
    tabSelection(val) {
      if (val === 'attribute') {
        if (this.id !== '') {
          this.query();
        }
      }
    },
    open(val) {
      if (!val) {
        this.attributeDatas = [];
      }
    }
  },
  created() {},
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    query() {
      let params = {
        id: this.id
      };
      service.getAttributeGroups(
        params,
        data => {
          this.attributeDatas = data.attributeDatas;
          console.log('获取商品属性成功');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取商品属性失败', this.id);
        }
      );
    },
    save() {
      let params = {
        id: this.id,
        attributeDatas: this.attributeDatas
      };
      service.updateAttributeGroups(
        params,
        data => {
          this.query();
          this.$message.success('更新商品属性成功');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('更新商品属性失败', this.id);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.commodity-mgmt-attribute {
  .el-form {
    width: 70%;
  }
  .biz-save-button {
    margin-top: 5px;
  }
}
</style>
