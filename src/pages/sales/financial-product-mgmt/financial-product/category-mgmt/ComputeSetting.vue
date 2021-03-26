<template>
  <biz-grid class="compute-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit"></biz-save-button>
    <el-table :data="computeList" style="width: 100%" @row-click="rowClick" :fit="true" size="small">
      <el-table-column label="计算项" prop="fullName">
        <div slot-scope="scope" style="display:flex">
          <div>
            {{scope.row.refId==='0'?'购置税':scope.row.refId==='1'?'车船税':scope.row.refId==='2'?'上牌费':scope.row.refId==='3'?'交强险':scope.row.refId==='4'?'第三者责任险':
            scope.row.refId==='5'?'车辆损失险':scope.row.refId==='6'?'全车盗抢险':scope.row.refId==='7'?'玻璃单独破碎险':scope.row.refId==='8'?'自燃损失险':scope.row.refId==='9'?'不计免赔特约险':
            scope.row.refId==='10'?'无过责任险':scope.row.refId==='11'?'涉水险':scope.row.refId==='12'?'车上人员责任险':'车身划痕险'}}
          </div>
          <span v-if="scope.row.refValueId">/</span>
          <div v-if="scope.row.refValueId">
            {{scope.row.refValueId==='0'?'1.0L(含)以下':scope.row.refValueId==='1'?'1.0-1.6L(含)':scope.row.refValueId==='2'?'1.6-2.0L(含)':scope.row.refValueId==='3'?'2.0-2.5L(含)':scope.row.refValueId==='4'?'2.5-3.0L(含)':
            scope.row.refValueId==='5'?'3.0-4.0L(含)':scope.row.refValueId==='6'?'4.0L以上':scope.row.refValueId==='7'?'家用6座以下':scope.row.refValueId==='8'?'家用6座以上':scope.row.refValueId==='9'?'5万':
            scope.row.refValueId==='10'?'10万':scope.row.refValueId==='11'?'20万':scope.row.refValueId==='12'?'50万':scope.row.refValueId==='13'?'100万':scope.row.refValueId==='14'?'家用6座以下':
            scope.row.refValueId==='15'?'家用6座以上':scope.row.refValueId==='16'?'国产':scope.row.refValueId==='17'?'进口':scope.row.refValueId==='18'?'2000':scope.row.refValueId==='19'?'5000':
            scope.row.refValueId==='20'?'10000':'20000'}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="计算条件" prop="condition" min-width="150px">
        <div slot-scope="scope" style="display:flex" v-if="scope.row.condition">
          {{Number(scope.row.lt).toFixed(2)}}
          <span style="padding-left:5px;padding-right:5px" v-if="scope.row.lt">≤</span>
          {{scope.row.condition}}
          <span style="padding-left:5px;padding-right:5px" v-if="scope.row.ge">&lt;</span>
          {{Number(scope.row.ge).toFixed(2)}}
        </div>
      </el-table-column>
      <el-table-column label="计算公式" prop="formula"></el-table-column>
      <el-table-column prop="title" label="操作" width="60px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="rowDeleteClickHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showCompute" center append-to-body width="500px">
      <el-form ref="form" size="small" label-width="110px" :model="form" :rules="rules" :inline-message="true">
        <el-form-item label="计算项: " prop="fullName">
          <el-cascader v-model="value" :options="options" @change="handleChange" v-if="this.itemType==='0'"></el-cascader>
          <el-cascader v-model="valueInsurance" :options="optionsInsurance" @change="handleChange" v-if="this.itemType==='1'">
          </el-cascader>
        </el-form-item>
        <el-form-item label="计算条件: " prop="condition">
          <div style="display:flex">
            <el-input v-model="form.lt" :disabled="form.condition==='无'"></el-input>
            <span style="padding-left:5px;padding-right:5px">≤</span>
            <el-select v-model="form.condition" placeholder="请选择" v-if="this.itemType==='0'" @change="conditionChange">
              <el-option value="无" label="无"></el-option>
              <el-option value="商品价格" label="商品价格"></el-option>
            </el-select>
            <el-select v-model="form.condition" placeholder="请选择" v-if="this.itemType==='1'" @change="conditionChange">
              <el-option value="无" label="无"></el-option>
              <el-option value="车辆价格" label="车辆价格"></el-option>
              <el-option value="会员信息" label="会员信息"></el-option>
            </el-select>
            <span style="padding-left:5px;padding-right:5px">&lt;</span>
            <el-input v-model="form.ge" :disabled="form.condition==='无'"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="计算公式: " prop="formula">
          <el-input v-model="form.formula" placeholder="请输入计算公式" @focus="showDialog = true;"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="operationsDiag" @operate="operateHandlerDiag">
      </biz-save-button>
    </el-dialog>
    <el-dialog :visible.sync="showDialog" title="计算公式" width="40%" append-to-body>
      <div class="valid-div">
        <el-form label-width="140px" size="small" ref="formModel" :model="formModel" :rules="rulesModel">
          <el-form-item label="计算公式：" prop="formula">
            <el-input v-model="formModel.formula" :required="true" placeholder="请输入计算公式"></el-input>
          </el-form-item>
          <el-form-item label="参数：" prop="params" v-if="this.itemType==='0'">
            <el-checkbox-group v-model="formModel.params">
              <el-checkbox label="商品价格"></el-checkbox>
              <el-checkbox label="第三方责任险"></el-checkbox>
              <el-checkbox label="车辆损失险"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="参数：" prop="params" v-if="this.itemType==='1'">
            <span>属性</span>
            <el-checkbox-group v-model="formModel.params">
              <el-checkbox label="车辆价格"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmByDialog" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';

const isLtValid = (rule, rules, callback) => {
  if (Number(this.form.lt) >= 0) {
    callback();
  } else {
    callback(new Error('计算条件上限必须为数字值'));
  }
};
const isGeValid = (rule, rules, callback) => {
  if (Number(this.form.ge) >= 0) {
    callback();
  } else {
    callback(new Error('计算条件下限必须为数字值'));
  }
};
export default {
  name: 'ComputeSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ],
      operationsDiag: [
        {
          label: '取消',
          name: 'cancel',
          type: ''
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      showDialog: false,
      rulesModel: {},
      formModel: {
        formula: '',
        params: []
      },
      rules: {
        lt: [
          {
            required: false,
            trigger: 'blur',
            validator: isLtValid
          }
        ],
        ge: [
          {
            required: false,
            trigger: 'blur',
            validator: isGeValid
          }
        ]
      },
      showCompute: false,
      computeList: [],
      options: [
        {
          value: '0',
          label: '购置税'
        },
        {
          value: '1',
          label: '车船税',
          children: [
            {
              value: '0',
              label: '1.0L(含)以下'
            },
            {
              value: '1',
              label: '1.0-1.6L(含)'
            },
            {
              value: '2',
              label: '1.6-2.0L(含)'
            },
            {
              value: '3',
              label: '2.0-2.5L(含)'
            },
            {
              value: '4',
              label: '2.5-3.0L(含)'
            },
            {
              value: '5',
              label: '3.0-4.0L(含)'
            },
            {
              value: '6',
              label: '4.0L以上'
            }
          ]
        },
        {
          value: '2',
          label: '上牌费'
        },
        {
          value: '3',
          label: '交强险',
          children: [
            {
              value: '7',
              label: '家用6座以下'
            },
            {
              value: '8',
              label: '家用6座以上'
            }
          ]
        },
        {
          value: '4',
          label: '第三者责任险',
          children: [
            {
              value: '9',
              label: '5万'
            },
            {
              value: '10',
              label: '10万'
            },
            {
              value: '11',
              label: '20万'
            },
            {
              value: '12',
              label: '50万'
            },
            {
              value: '13',
              label: '100万'
            }
          ]
        },
        {
          value: '5',
          label: '车辆损失险'
        },
        {
          value: '6',
          label: '全车盗抢险',
          children: [
            {
              value: '14',
              label: '家用6座以下'
            },
            {
              value: '15',
              label: '家用6座以上'
            }
          ]
        },
        {
          value: '7',
          label: '玻璃单独破碎险',
          children: [
            {
              value: '16',
              label: '国产'
            },
            {
              value: '17',
              label: '进口'
            }
          ]
        },
        {
          value: '8',
          label: '自燃损失险'
        },
        {
          value: '9',
          label: '不计免赔特约险'
        },
        {
          value: '10',
          label: '无过责任险'
        },
        {
          value: '11',
          label: '涉水险'
        },
        {
          value: '12',
          label: '车上人员责任险'
        },
        {
          value: '13',
          label: '车身划痕险',
          children: [
            {
              value: '18',
              label: '2000'
            },
            {
              value: '19',
              label: '5000'
            },
            {
              value: '20',
              label: '10000'
            },
            {
              value: '21',
              label: '20000'
            }
          ]
        }
      ],
      value: [],
      optionsInsurance: [
        {
          value: '3',
          label: '交强险',
          children: [
            {
              value: '7',
              label: '家用6座以下'
            },
            {
              value: '8',
              label: '家用6座以上'
            }
          ]
        },
        {
          value: '4',
          label: '第三者责任险',
          children: [
            {
              value: '9',
              label: '5万'
            },
            {
              value: '10',
              label: '10万'
            },
            {
              value: '11',
              label: '20万'
            },
            {
              value: '12',
              label: '50万'
            },
            {
              value: '13',
              label: '100万'
            }
          ]
        },
        {
          value: '5',
          label: '车辆损失险'
        },
        {
          value: '6',
          label: '全车盗抢险',
          children: [
            {
              value: '14',
              label: '家用6座以下'
            },
            {
              value: '15',
              label: '家用6座以上'
            }
          ]
        },
        {
          value: '7',
          label: '玻璃单独破碎险',
          children: [
            {
              value: '16',
              label: '国产'
            },
            {
              value: '17',
              label: '进口'
            }
          ]
        },
        {
          value: '13',
          label: '车身划痕险',
          children: [
            {
              value: '18',
              label: '2000'
            },
            {
              value: '19',
              label: '5000'
            },
            {
              value: '20',
              label: '10000'
            },
            {
              value: '21',
              label: '20000'
            }
          ]
        }
      ],
      valueInsurance: [],
      form: this.getDefaultForm(),
      typeList: [],
      separator: '、'
    };
  },
  computed: {},
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    itemType: {
      type: String
    }
  },
  created() {
    this.query();
  },
  methods: {
    cancel() {
      this.showCompute = false;
    },
    handleChange() {},
    confirmByDialog() {
      let params = {
        formula: this.formModel.formula,
        params: this.formModel.params
      };
      http
        .put('/admin/finance/productCategory/caculateItemChect.jhtml', params)
        .then(data => {
          if (this.formModel.params.length > 0) {
            let total = this.formModel.params[0];
            for (let i = 1; i <= this.formModel.params.length - 1; i++) {
              total = total + '+' + this.formModel.params[i];
            }

            this.form.formula = '(' + total + ')' + '*' + this.formModel.formula;
          } else {
            this.form.formula = this.formModel.formula;
          }

          this.showDialog = false;
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getDefaultForm() {
      return {
        id: '',
        productCategoryId: '',
        lt: '',
        ge: '',
        formula: '',
        /** 计算项类型 [0:金融;1:保险] */
        itemType: '',
        /** 计算条件 */
        condition: '无',
        /** 对应对象id 如果类型是金融计算项，此处对应ItemNameType，如果类型是保险计算项，此处对应规格id */
        refId: '',
        /** 对应对象值 如果类型是金融计算项，此处对应ItemNameDetailType，如果类型是保险计算项，此处对应规格值id */
        refValueId: '',
        /** 名称类型 */
        nameType: '',
        /** 名称明细类型 */
        nameDetailType: '',
        /** 全名 */
        fullName: ''
      };
    },
    conditionChange(value) {
      if (value === '无') {
        this.$set(this.form, 'lt', '');
        this.$set(this.form, 'ge', '');
      }
    },
    add() {
      this.form = this.getDefaultForm();
      this.value = [];
      this.valueInsurance = [];
      this.showCompute = true;
    },
    rowClick(row) {
      this.form = Object.assign(this.getDefaultForm(), row);
      if (row.itemType === '0') {
        console.log(row);
        if (row.refValueId) {
          this.value = [row.refId, row.refValueId];
        } else {
          this.value = [row.refId];
        }
      } else {
        this.valueInsurance = [row.refId, row.refValueId];
      }
      this.showCompute = true;
    },
    getSaveParams() {
      return {
        id: this.form.id,
        productCategoryId: this.itemId,
        lt: this.form.lt,
        ge: this.form.ge,
        formula: this.form.formula,
        /** 计算项类型 [0:金融;1:保险] */
        itemType: this.itemType,
        /** 计算条件 */
        condition: this.form.condition === '无' ? '' : this.form.condition,
        /** 对应对象id 如果类型是金融计算项，此处对应ItemNameType，如果类型是保险计算项，此处对应规格id */
        refId: this.itemType === '0' ? this.value[0] : this.valueInsurance[0],
        /** 对应对象值 如果类型是金融计算项，此处对应ItemNameDetailType，如果类型是保险计算项，此处对应规格值id */
        refValueId: this.itemType === '0' ? this.value[1] : this.valueInsurance[1] || '',
        /** 名称类型 */
        nameType: this.form.nameType,
        /** 名称明细类型 */
        nameDetailType: this.form.nameDetailType,
        /** 全名 */
        fullName: this.form.fullName
      };
    },
    createCompute() {
      if (Number(this.form.lt) > Number(this.form.ge)) {
        this.$message.warning('计算条件范围错误');
        return;
      }
      let params = this.getSaveParams();
      http
        .post('/admin/finance/productCategory/caculateItem.jhtml', params)
        .then(data => {
          this.$message.success('添加成功');
          this.form.id = data.id;
          this.query();
          this.showCompute = false;
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    updateCompute() {
      let params = this.getSaveParams();
      if (Number(this.form.lt) > Number(this.form.ge)) {
        this.$message.warning('计算条件范围错误');
        return;
      }
      http
        .put('/admin/finance/productCategory/caculateItem.jhtml', params)
        .then(data => {
          this.$message.success('修改成功');
          this.query();
          this.showCompute = false;
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            this.updateCompute();
          } else {
            this.createCompute();
          }
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        id: this.itemId
      };
      http
        .get('/admin/finance/productCategory/caculateItems.jhtml', params)
        .then(data => {
          this.computeList = data.content;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    operateHandler(name) {
      this[name]();
    },
    operateHandlerDiag(name) {
      this[name]();
    },
    rowDeleteClickHandler(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        let params = {
          ids: ids
        };
        http
          .delete('/admin/finance/productCategory/caculateItems.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
    }
  },
  watch: {
    itemId(Val) {
      this.form = this.getDefaultForm();
      this.query();
    }
  }
};
</script>

<style lang="scss">
.compute-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
