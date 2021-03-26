<template>
  <biz-grid class="potential-customer-mgmt__callback-record" v-loading="loading">
    <biz-header slot="top" :operations="operations" @operate="handleOperate" style="float:left">
    </biz-header>
    <el-table :data="tableData" style="width: 100%" height="400" @row-click="handleRowClick" size="small">
      <el-table-column prop="visitDate" label="回访日期" :formatter="dateConverter1"></el-table-column>
      <el-table-column prop="visitResult" label="回访内容"></el-table-column>
      <el-table-column prop="nextVisitDate" label="下次回访日期" :formatter="dateConverter"></el-table-column>
      <biz-empty-table-tab slot="empty"></biz-empty-table-tab>
    </el-table>

    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="550px">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-radio-group v-model="level" @change="levelChange" :disabled="!!this.formModel.id" style="padding:10px">
          <el-radio label="1">核心H
            <el-button v-if="this.depH!==''" type="text" size="mini" v-popover:codePopH>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePopH" placement="top-start" trigger="hover">
              {{this.depH}}
            </el-popover>
          </el-radio>
          <el-radio label="2">重要A
            <el-button v-if="this.depA!==''" type="text" size="mini" v-popover:codePop2>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop2" placement="top-start" trigger="hover">
              {{this.depA}}
            </el-popover>
          </el-radio>
          <el-radio label="3">意向B
            <el-button v-if="this.depB!==''" type="text" size="mini" v-popover:codePop3>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop3" placement="top-start" trigger="hover">
              {{this.depB}}
            </el-popover>
          </el-radio>
          <el-radio label="4">一般C
            <el-button v-if="this.depC!==''" type="text" size="mini" v-popover:codePop4>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop4" placement="top-start" trigger="hover">
              {{this.depC}}
            </el-popover>
          </el-radio>
          <el-radio label="0">签约O
            <el-button v-if="this.depO!==''" type="text" size="mini" v-popover:codePop5>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop5" placement="top-start" trigger="hover">
              {{this.depO}}
            </el-popover>
          </el-radio>
          <el-radio label="5">战败F
            <el-button v-if="this.depF!==''" type="text" size="mini" v-popover:codePop6>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop6" placement="top-start" trigger="hover">
              {{this.depF}}
            </el-popover>
          </el-radio>
          <el-radio label="6">交车D
            <el-button v-if="this.depD!==''" type="text" size="mini" v-popover:codePop7>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop7" placement="top-start" trigger="hover">
              {{this.depD}}
            </el-popover>
          </el-radio>
          <el-radio label="7">无意向N
            <el-button v-if="this.depN!==''" type="text" size="mini" v-popover:codePop8>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop8" placement="top-start" trigger="hover">
              {{this.depN}}
            </el-popover>
          </el-radio>
        </el-radio-group>
        <el-form-item label="下次回访日期" prop="nextVisitDate">
          <el-date-picker type="date" placeholder="请选择下次回访日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd hh:mm:ss" v-model="formModel.nextVisitDate"
            :clearable="false" :disabled="!!this.formModel.id" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="交车日期" prop="deliveryDate" v-if="level==='6'">
          <el-date-picker type="date" placeholder="请选择交车日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd hh:mm:ss" v-model="formModel.deliveryDate"
            :clearable="false" :disabled="!!this.formModel.id"></el-date-picker>
        </el-form-item>
        <el-form-item label="回访内容" prop="visitResult">
          <el-input v-model="formModel.visitResult" style="width:220px" maxlength="100" :disabled="!!this.formModel.id" placeholder="请输入回访内容"></el-input>
        </el-form-item>
        <el-form-item label="订单号" v-if="level==='0'">
          <el-input v-model="formModel.orderSn" readonly :disabled="true" style="width:220px">
            <div slot="append" class="input-operation">
              <el-button type="text" @click="handleListClick">
                <i class="iconfont biz-icon-liebiaoshitu"></i>
              </el-button>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" v-if="level==='0'">
          <el-select v-model="formModel.brand" placeholder="请选择品牌" @change="handleBrandChange" :disabled="!!this.formModel.id" style="width:220px">
            <el-option v-for="(item,index) in brandList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列" prop="series" v-if="level==='0'">
          <el-select v-model="formModel.series" placeholder="请选择系列" @change="handleSeriesChange" :disabled="!!this.formModel.id" style="width:220px">
            <el-option v-for="(item,index) in seriesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="product" v-if="level==='0'">
          <el-select v-model="formModel.product" placeholder="请选择车型" :disabled="!!this.formModel.id" style="width:220px">
            <el-option v-for="(item,index) in modeList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="战败原因" prop="failureReason" v-if="level==='5'">
          <el-select v-model="formModel.failureReason" placeholder="请选择战败原因" :disabled="!!this.formModel.id" style="width:220px">
            <el-option v-for="item in reasonList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;" v-if="!this.formModel.id">
      </biz-save-button>
    </el-dialog>
    <!-- <a id="anchor-bottom" href="#anchor-bottom"></a> -->
    <pc-order-picker ref="orderPicker" :itemId="itemId" :memberId="memberId" @input="handleOrderSelected"></pc-order-picker>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import BizEmptyTableTab from '@/components/BizTable/BizEmptyTableTab.vue';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import PcOrderPicker from '../Components/PcOrderPicker';
import { mapGetters } from 'vuex';
// 基础内容
const dataBase = {
  data: {
    loading: false,
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() < Date.now();
      }
    },
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary',
        auth: ['admin:potential.edit']
      }
    ]
  },
  methods: {
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        potentialConsumerId: this.itemId.id,
        viewMode: this.viewMode,
        pageSize: 100,
        pageNumber: 1
      };
    },
    query() {
      this.loading = true;

      http
        .get(potentialCustomerMgmt.callbackRecord.list, this.getQueryParams())
        .then(data => {
          this.tableData = data.content;
          this.showForm = false;
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
    getCallbackInfo(row) {
      http
        .get(potentialCustomerMgmt.callbackRecord.updateCallbackRecord, {
          visitRecordId: row.id
        })
        .then(data => {
          this.formModel.id = data.visitRecord.id;
          this.formModel.nextVisitDate = data.visitRecord.nextVisitDate || '';
          this.formModel.visitResult = data.visitRecord.visitResult || '';
          this.level = data.visitRecord.level || '';
          if (data.visitRecord.sign) {
            this.formModel.brand = data.visitRecord.sign.brandId;
            this.querySeriesList(data.visitRecord.sign.brandId);
            this.formModel.series = data.visitRecord.sign.seriesId;
            this.queryTypeList(data.visitRecord.sign.seriesId);
            this.formModel.product = data.visitRecord.sign.productId;
            this.formModel.orderSn = data.visitRecord.sign.orderSn;
          } else if (data.visitRecord.delivery) {
            this.formModel.deliveryDate =
              data.visitRecord.delivery.deliveryDate || '';
          } else {
            this.formModel.brand = '';
            this.formModel.series = '';
            this.formModel.product = '';
            this.formModel.orderSn = '';
          }
          if (data.visitRecord.defeat) {
            this.formModel.failureReason = data.visitRecord.defeat.reason;
          } else {
            this.formModel.failureReason = '';
          }
          this.showForm = true;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getVisitSettings() {
      http
        .get(potentialCustomerMgmt.callbackSetting.callbackSetting, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          this.visitSettings = data.dataList;
          data.dataList.forEach(item => {
            if (item.level === 'H' && this.level === '1') {
              this.formModel.nextVisitDate = item.nextVisitTime;
              this.depH = item.depict;
            }
            if (item.level === 'A') {
              this.depA = item.depict;
            }
            if (item.level === 'B') {
              this.depB = item.depict;
            }
            if (item.level === 'C') {
              this.depC = item.depict;
            }
            if (item.level === 'D') {
              this.depD = item.depict;
            }
            if (item.level === 'O') {
              this.depO = item.depict;
            }
            if (item.level === 'N') {
              this.depN = item.depict;
            }
            if (item.level === 'F') {
              this.depF = item.depict;
            }
          });
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    add() {
      this.formModel.id = '';
      this.formModel.visitResult = '';
      this.level = '1';
      this.showForm = true;
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  }
};

// Table相关
const dataTable = {
  data: {
    tableData: [],
    selections: []
  },
  methods: {
    dateConverter(row) {
      if (row.nextVisitDate) {
        row.nextVisitDate = row.nextVisitDate.replace(/-/g, '/');
        let date = new Date(row.nextVisitDate);
        return dateUtil.dateConverter(date);
      } else {
        return '--';
      }
    },
    dateConverter1(row) {
      if (row.visitDate) {
        row.visitDate = row.visitDate.replace(/-/g, '/');
        let date = new Date(row.visitDate);
        return dateUtil.dateConverter(date);
      } else {
        return '--';
      }
    },
    typeConverter(row) {
      let map = {
        alarm: '提醒回访',
        sale: '交车回访',
        insurance: '首保回访',
        failure: '战败'
      };

      return map[row.reasonType];
    },
    modeConverter(row) {
      let map = {
        call: '电话',
        inshop: '到店'
      };

      return map[row.mode];
    },

    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = { ids: ids };
        http
          .delete(potentialCustomerMgmt.callbackRecord.delete, params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  },
  events: {
    rowDeleteClickHandler(e, row) {
      e.stopPropagation();

      this.deleteItem([row.id]);
    },
    handleRowClick(row) {
      this.getCallbackInfo(row);
      this.$refs.form.clearValidate();
    },
    handleSelectionChange(val) {
      this.selections = val;
    }
  }
};

// 表单相关
const getDefaultFormModel = () => {
  return {
    visitResult: '',
    nextVisitDate: ''
  };
};
const dataForm = {
  data: {
    showForm: false,
    brandList: [],
    seriesList: [],
    modeList: [],
    reasonList: [],
    visitSettings: [],
    nextVisitTime: '',
    memberId: { id: '' },
    level: '1',
    formModel: getDefaultFormModel(),
    depH: '',
    depA: '',
    depB: '',
    depC: '',
    depO: '',
    depD: '',
    depN: '',
    depF: '',
    rules: {
      visitResult: [
        {
          required: true,
          message: '回访内容不少于5个字符',
          trigger: 'blur',
          min: 5
        }
        // {
        //   pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
        //   message: '请输入文字',
        //   trigger: 'blur'
        // }
      ],
      deliveryDate: [
        {
          required: true,
          message: '请输入交车日期',
          trigger: ['blur', 'change']
        }
      ],
      brand: [
        {
          required: true,
          message: '请选择品牌',
          trigger: ['blur', 'change']
        }
      ],
      series: [
        {
          required: true,
          message: '请选择系列',
          trigger: ['blur', 'change']
        }
      ],
      product: [
        {
          required: true,
          message: '请选择车型',
          trigger: ['blur', 'change']
        }
      ],
      failureReason: [
        {
          required: true,
          message: '请选择战败原因',
          trigger: ['blur', 'change']
        }
      ]
    },
    formOperations: [
      {
        label: '取消',
        name: 'cancelForm'
      },
      {
        label: '保存',
        name: 'saveForm',
        type: 'primary'
      }
    ]
  },
  methods: {
    initForm(model) {
      this.showForm = true;
      let defaultModel = getDefaultFormModel();
      this.formModel = model
        ? Object.assign(defaultModel, model)
        : defaultModel;

      if (this.$refs.form) this.$refs.form.resetFields();
    },
    levelChange() {
      this.formModel = getDefaultFormModel();
      this.$refs.form.clearValidate();
      this.visitSettings.forEach(item => {
        if (item.level === 'H' && this.level === '1') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'A' && this.level === '2') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'B' && this.level === '3') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'C' && this.level === '4') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'O' && this.level === '0') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'F' && this.level === '5') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'D' && this.level === '6') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        } else if (item.level === 'N' && this.level === '7') {
          this.formModel.nextVisitDate = item.nextVisitTime;
        }
      });
    },
    queryBrandList() {
      http
        .get(potentialCustomerMgmt.failure.queryBrandList, {
          brandId: '',
          seriesId: ''
        })
        .then(data => {
          this.brandList = data.dataList;
        })
        .catch(errData => {
          this.brandList = errData;
        });
    },
    querySeriesList(val) {
      http
        .get(potentialCustomerMgmt.failure.querySeriesList, { brandId: val })
        .then(data => {
          this.seriesList = data.dataList;
        })
        .catch(errData => {
          this.seriesList = errData;
        });
    },
    queryTypeList(val) {
      http
        .get(potentialCustomerMgmt.failure.queryModeList, {
          brandId: this.formModel.failureBrandId,
          seriesId: val
        })
        .then(data => {
          this.modeList = data.dataList;
        })
        .catch(errData => {
          this.modeList = errData;
        });
    },
    handleListClick(e) {
      if (this.consumerInfo.potentialConsumer.member) {
        this.memberId = this.consumerInfo.potentialConsumer.member;
      }
      this.$refs.orderPicker.showDialog = true;
    },
    handleOrderSelected(val) {
      this.$set(this.formModel, 'orderSn', val.sn);
      this.$set(this.formModel, 'orderId', val.id);
      this.$set(this.formModel, 'brand', val.products[0].brandId);
      this.querySeriesList(val.products[0].brandId);
      this.$set(this.formModel, 'series', val.products[0].seriesId);
      this.queryTypeList(val.products[0].seriesId);
      this.$set(this.formModel, 'product', val.products[0].id);
    },
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.$set(this.formModel, 'series', '');
      this.$set(this.formModel, 'product', '');
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.$set(this.formModel, 'product', '');
    },
    cancelForm() {
      this.showForm = false;
    },
    getSaveParams() {
      return {
        token: '',
        id: this.formModel.id,
        nextVisitDate: this.formModel.nextVisitDate,
        mode: this.formModel.mode,
        visitResult: this.formModel.visitResult,
        delivery: { deliveryDate: this.formModel.deliveryDate },
        level: this.level,
        sign: {
          orderId: this.formModel.orderId,
          brandId: this.formModel.brand,
          seriesId: this.formModel.series,
          productId: this.formModel.product
        },
        defeat: {
          reason: this.formModel.failureReason
        },
        alarmRecordId: this.formModel.alarmRecordId,
        potentialConsumerId: this.itemId.id,
        viewMode: this.viewMode,
        shopId: window.top.SHOP_ID || ''
      };
    },
    saveForm() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (!this.formModel.visitResult) {
            return false;
          }
          this.loading = true;
          let params = this.getSaveParams();
          !this.formModel.id &&
            http
              .post(potentialCustomerMgmt.callbackRecord.add, params)
              .then(data => {
                this.query();
                this.$message.success('添加成功');
                this.$emit('operationSuccess');
                this.showForm = false;
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) {
                  this.$message.warning(errData.errorMessage);
                }
              })
              .finally(data => {
                this.loading = false;
              });

          this.formModel.id &&
            http
              .put(potentialCustomerMgmt.callbackRecord.update, params)
              .then(data => {
                this.query();
                this.$message.success('更新成功');
                this.$emit('operationSuccess');
                this.showForm = false;
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) {
                  this.$message.warning(errData.errorMessage);
                }
              })
              .finally(data => {
                this.loading = false;
              });
        } else {
          return false;
        }
      });
    }
  },
  events: {}
};

export default {
  name: 'PotentialCustomerCallbackRecord',
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizEmptyTableTab,
    PcOrderPicker
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    viewMode: {
      type: String,
      default() {
        return 'merge';
      }
    },
    alertId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  data() {
    return {
      ...dataBase.data,
      ...dataTable.data,
      ...dataForm.data
    };
  },
  methods: {
    ...dataBase.methods,
    ...dataBase.events,

    ...dataTable.methods,
    ...dataTable.events,

    ...dataForm.methods,
    ...dataForm.events
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal.id) {
        this.query();
        this.reasonList = this.potentialInfo.failureReasons;
      }
    },
    alertId(val) {
      if (val.id) {
        // 根据回访提醒获取回访记录的默认值
        this.getCallbackInfo(val);
      }
    }
  },
  computed: {
    ...mapGetters('Sales', ['potentialInfo', 'consumerInfo'])
  },
  created() {
    this.queryBrandList();
    this.getVisitSettings();
    this.reasonList = this.potentialInfo.failureReasons;
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__callback-record {
  .el-radio__label {
    font-size: 12px;
    padding-left: 5px;
  }
  .el-radio {
    margin-left: 5px;
  }
  .el-radio + .el-radio {
    margin-left: 5px;
  }
  .el-radio-group {
    padding-bottom: 10px;
  }
  .el-card__body {
    padding: 10px;
  }
}
</style>
