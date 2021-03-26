<template>
  <biz-grid class="terminal-mgmt-class__coding-rule">
    <div v-show="!errorMessage">
      <biz-save-button :operations="operations" @operate="operateHandler" style="margin-right: 0;"></biz-save-button>
      <el-table :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="规则名称"></el-table-column>
        <el-table-column prop="length" label="长度" width="80"></el-table-column>
        <el-table-column prop="title" label="操作" width="100">
          <template v-slot:default="{ row }">
            <el-button type="text" size="mini" @click="rowEditClickHandler(row)">编辑</el-button>
            <el-button type="text" size="mini" @click="rowDeleteClickHandler(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <total-rule :terminal-type-id="itemId.id" :rule-id-object="ruleIdObject" :show.sync="showRule" @updated="query"></total-rule>
    </div>
    <p v-show="errorMessage">{{errorMessage}}</p>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/terminal-mgmt/CodingRule';
import TotalRule from './TotalRule';

export default {
  name: 'CodingRule',
  components: {
    BizSaveButton,
    BizGrid,
    TotalRule
  },
  data() {
    return {
      errorMessage: '',
      operations: [
        {
          label: '新增',
          name: 'addRuleOperate',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'deleteRuleOperate',
          type: '',
          disabled: true
        }
      ],
      tableData: [],
      selections: [],
      // 规则内容
      ruleLoading: false,
      showRule: false,
      ruleIdObject: {}
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  created() {},
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      } else {
        this.tableData = [];
      }
    },
    operateHandler(name) {
      this[name]();
    },
    // 规则
    rowDeleteClickHandler(model) {
      this.deleteRule([model.id]);
    },
    rowEditClickHandler(model) {
      this.ruleIdObject = { id: model.id };
      this.showRule = true;
    },
    selectionChangeHandler(val) {
      console.log(val);
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.selections = val;
    },
    deleteRuleOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个规则进行删除');
      }
    },
    addRuleOperate() {
      this.showRule = true;
      this.ruleIdObject = { id: '' };
    },
    query() {
      service.query(
        {
          terminalTypeId: this.itemId.id
        },
        data => {
          this.tableData = data.content;

          // reset
          this.selections = [];
          this.showRule = false;
          this.showProp = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.resultCode === '800') {
            this.errorMessage = ErrorData.errorMessage;
          } else {
            this.$message.warning(ErrorData.errorMessage);
          }
        }
      );
    },
    deleteRule(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.deleteRule(
          {
            ids: ids
          },
          data => {
            this.$message.success('删除成功');
            this.query();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    }
  },
  computed: {},
  watch: {
    itemId() {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.terminal-mgmt-class__coding-rule {
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .box-card {
      margin-top: 20px;

      .el-card__body {
        padding: 20px 20px;
      }
    }

    .coding-rule__value-table {
      .cell {
        padding-left: 3px;
        padding-right: 3px;
      }
    }
  }
}
</style>
