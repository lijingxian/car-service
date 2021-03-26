<template>
  <biz-grid class="commodity-mgmt-attribute">
    <biz-save-button slot="top" :operations="operations" @operate="operate"  v-if="isEdit">
    </biz-save-button>
    <el-table :data="attributeDatas" style="width: 100%" size="small">
      <el-table-column label="属性分类" prop="attributeCategory"></el-table-column>
      <el-table-column label="属性名称" prop="name">
      </el-table-column>
      <el-table-column label="是否必输" prop="isNecessary">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isNecessary" active-value="1" active-color="#87d068" inactive-value="0" inactive-color="#d9d9d9"></el-switch>
        </template>
      </el-table-column>
    </el-table>
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
          type: 'primary'
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
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
}
</style>
