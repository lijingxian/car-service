<template>
  <biz-grid class="financial-program-mgmt__base-info" v-loading="loading">
    <biz-save-button
      slot="top"
      :operations="operations"
      @operate="handleOperate"
    >
    </biz-save-button>
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="方案名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入方案名称，如XX贷款方案"></el-input>
      </el-form-item>
      <el-form-item label="最低首付比例" prop="downPayment">
        <el-input v-model="formModel.downPayment" placeholder="请输入最低首付比例">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="还款期限" prop="loanTermRate">
        <el-input v-model="formModel.loanTermRate['1']" placeholder="请输入1年利率">
          <template slot="prepend">1年利率</template>
          <template slot="append">%</template>
        </el-input>
        <el-input v-model="formModel.loanTermRate['2']" placeholder="请输入2年利率">
          <template slot="prepend">2年利率</template>
          <template slot="append">%</template>
        </el-input>
        <el-input v-model="formModel.loanTermRate['3']" placeholder="请输入3年利率">
          <template slot="prepend">3年利率</template>
          <template slot="append">%</template>
        </el-input>
        <el-input v-model="formModel.loanTermRate['4']" placeholder="请输入4年利率">
          <template slot="prepend">4年利率</template>
          <template slot="append">%</template>
        </el-input>
        <el-input v-model="formModel.loanTermRate['5']" placeholder="请输入5年利率">
          <template slot="prepend">5年利率</template>
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="手续费" prop="counterFee">
        <el-input v-model="formModel.counterFee" placeholder="请输入手续费">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="额度下限" prop="minLimit">
        <el-input v-model="formModel.minLimit" placeholder="请输入额度下限">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="额度上限" prop="maxLimit">
        <el-input v-model="formModel.maxLimit" placeholder="请输入额度上限">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="formModel.type"
          placeholder="请选择"
          filterable
          style="width: 100%;"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支持省市" prop="cities">
        <div
          class="golden-cudgel"
          :class="{ 'collapsed': collapsed }"
        >
          <el-checkbox-group v-model="formModel.cities">
            <el-checkbox
              v-for="item in areaList"
              :key="item.id"
              :label="item.id"
            >
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button
          type="text"
          @click="handleCollapseClick"
          size="small"
        >
          {{ collapsed ? '点击展开' : '点击收起' }}
        </el-button>
      </el-form-item>
      <el-form-item label="资质要求">
        <el-input v-model="formModel.qualification" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入车贷资质要求，例如：
        1、借款人是贷款行所在地常住户口居民、具有完全民事行为能力；
        2、借款人具有还款能力，没有不良贷款记录"></el-input>
      </el-form-item>
      <el-form-item label="所需材料">
        <el-input v-model="formModel.documents" type="textarea" :autosize="{ minRows: 6}" placeholder="请输入车贷办理所需材料，例如：
        * 借款人身份证件、婚姻状况证明,户口本；
        * 银行认可的部门出具的借款人职业和经济收入证明；
        * 与银行指定的经销商签订的购车协议或合同；
        * 不低于首期款的存款凭证或首期款收据；
        * 以财产抵押或质押的，应提供抵押物或质押物清单、权属证明及有权处分人（包括财产共有人）同意抵押或质押的证明，有权部门出具的抵押物估价证明；
        * 由第三方提供保证的，应出具保证人同意担保的书面文件，有关资信证明材料及一定比例的保证金；
        * 银行要求提供的其他资料。">
      </el-input>
      </el-form-item>
      <el-form-item label="补充说明">
        <el-input v-model="formModel.desc" type="textarea" placeholder="请输入补充说明"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { finacialProgramMgmt as service } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const listData = {
  typeList: [
    { value: '0', label: '车贷' }
  ],
  areaList: [],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      auth: ['admin:finnancialPlan.edit']
    }
  ]
};
const listMethod = {
  queryAreaList () {
    http.get(service.mainPage.areaList)
      .then(data => {
        this.areaList = data.areaDatas;
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    cities: [],
    loanTermRate: {}
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    handleOperate (name) {
      this[name]();
    }
  },
  methods: {
    initModel (model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    query () {
      this.loading = true;

      http.get(
        service.mainPage.financialPlan,
        { shopId: window.top.SHOP_ID || '', id: this.itemId.id }
      )
        .then(data => {
          // 设置相关列表
          this.initModel(data.content);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return getDefaultModel();
    },

    getSaveParams () {
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        downPayment: this.formModel.downPayment,
        loanTerm: [
          this.formModel.loanTermRate['1'],
          this.formModel.loanTermRate['2'],
          this.formModel.loanTermRate['3'],
          this.formModel.loanTermRate['4'],
          this.formModel.loanTermRate['5']
        ],
        counterFee: this.formModel.counterFee,
        minLimit: this.formModel.minLimit,
        maxLimit: this.formModel.maxLimit,
        type: this.formModel.type,
        cities: this.formModel.cities,
        qualification: this.formModel.qualification,
        documents: this.formModel.documents,
        desc: this.formModel.desc,
        shopId: window.top.SHOP_ID || ''
      };
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');

            this.$emit('operationSuccess');
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          if (this.formModel.id) {
            http.put(
              service.mainPage.financialPlan,
              this.getSaveParams()
            )
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http.post(
              service.mainPage.financialPlan,
              this.getSaveParams()
            )
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          // this.$message.warning('表单验证失败');
          return false;
        }
      });
    }
  }
};

// 收起控件
const callapseData = {
  data: {
    collapsed: true
  },
  events: {
    handleCollapseClick (e) {
      this.collapsed = !this.collapsed;
    }
  }
};

export default {
  name: 'FinacialProgramBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data () {
    return {
      ...listData,
      ...formData.data,
      ...callapseData.data,

      rules: {
        name: [
          { required: true, message: '请输入方案名称', trigger: 'blur' }
        ],
        downPayment: [
          { required: true, message: '请输入首付比例', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                isNaN(Number(this.formModel.downPayment)) ||
                Number(this.formModel.downPayment) < 0
              ) callback(new Error('请输入一个大于等于0的数字'));
              else if (Number(this.formModel.downPayment) > 100) callback(new Error('首付比例不能大于100%'));
              else callback();
            }
          }
        ],
        loanTermRate: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!this.formModel.loanTermRate['1']) callback(new Error('请输入1年利率'));
              else if (isNaN(Number(this.formModel.loanTermRate['1']))) callback(new Error('请输入一个数字(1年利率)'));
              else if (Number(this.formModel.loanTermRate['1']) < 0) callback(new Error('请输入一个大于等于0的数字(1年利率)'));

              if (!this.formModel.loanTermRate['2']) callback(new Error('请输入2年利率'));
              else if (isNaN(Number(this.formModel.loanTermRate['2']))) callback(new Error('请输入一个数字(2年利率)'));
              else if (Number(this.formModel.loanTermRate['2']) < 0) callback(new Error('请输入一个大于等于0的数字(2年利率)'));

              if (!this.formModel.loanTermRate['3']) callback(new Error('请输入3年利率'));
              else if (isNaN(Number(this.formModel.loanTermRate['3']))) callback(new Error('请输入一个数字(3年利率)'));
              else if (Number(this.formModel.loanTermRate['3']) < 0) callback(new Error('请输入一个大于等于0的数字(3年利率)'));

              if (!this.formModel.loanTermRate['4']) callback(new Error('请输入4年利率'));
              else if (isNaN(Number(this.formModel.loanTermRate['4']))) callback(new Error('请输入一个数字(4年利率)'));
              else if (Number(this.formModel.loanTermRate['4']) < 0) callback(new Error('请输入一个大于等于0的数字(4年利率)'));

              if (!this.formModel.loanTermRate['5']) callback(new Error('请输入5年利率'));
              else if (isNaN(Number(this.formModel.loanTermRate['5']))) callback(new Error('请输入一个数字(5年利率)'));
              else if (Number(this.formModel.loanTermRate['5']) < 0) callback(new Error('请输入一个大于等于0的数字(5年利率)'));

              callback();
            }
          }
        ],
        counterFee: [
          { required: true, message: '请输入手续费', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                isNaN(Number(this.formModel.counterFee)) ||
                Number(this.formModel.counterFee) < 0
              ) callback(new Error('请输入一个大于等于0的数字'));
              else callback();
            }
          }
        ],
        minLimit: [
          { required: true, message: '请输入额度下限', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                isNaN(Number(this.formModel.minLimit)) ||
                Number(this.formModel.minLimit) < 0
              ) callback(new Error('请输入一个大于等于0的数字'));
              else callback();
            }
          }
        ],
        maxLimit: [
          { required: true, message: '请输入额度上限', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                isNaN(Number(this.formModel.maxLimit)) ||
                Number(this.formModel.maxLimit) < 0
              ) callback(new Error('请输入一个大于等于0的数字'));
              else if (Number(this.formModel.maxLimit) < Number(this.formModel.minLimit)) callback(new Error('额度上限要大于额度下限'));
              else callback();
            }
          }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: ['blur', 'change'] }
        ],
        cities: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, rules, callback) => {
              if (this.formModel.cities && this.formModel.cities.length > 0) callback();
              else callback(new Error('请选择支持省市'));
            }
          }
        ]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events,

    ...listMethod,

    ...callapseData.events
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  created() {
    this.queryAreaList();

    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.financial-program-mgmt__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    .el-checkbox-group {
      .el-checkbox {
        margin-right: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }

    .golden-cudgel {
      transition: height 0.3s;
      height: 518px;
      overflow: hidden;

      &.collapsed {
        height: 32px;
      }
    }
  }
}
</style>
