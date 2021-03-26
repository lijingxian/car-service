<template>
  <biz-grid class="potential-customer-mgmt__intention" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="客户意向级别" prop="level">
        <el-select v-model="formModel.level" placeholder="请在添加回访记录时选择" style="width: 100%;" disabled>
          <el-option v-for="item in intentionLevelList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="下次回访日">
        <el-date-picker
          type="date"
          placeholder="选择下次回访日"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="formModel.nextVisitTime"
          :picker-options="pickerOptions"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item label="购买意向" prop="type">
        <!-- <el-input :disabled="true">
          <el-button slot="append" icon="el-icon-plus" @click="addProduct"></el-button>
        </el-input> -->
        <el-button type="primary" size="mini" @click="addProduct">新增</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-table :data="handleTableData" style="width: 100%" class="p-table" size="small">
          <el-table-column prop="productName" label="意向商品">
            <div slot-scope="scope">
              <div class="biz-customcol" v-if="scope.row.productName">
                {{ scope.row.productName }}
              </div>
              <div class="biz-customcol" v-else>
                {{ scope.row.seriesName }}
              </div>
            </div>
          </el-table-column>
          <el-table-column prop="memo" label="描述">
          </el-table-column>
          <el-table-column label="操作" width="50px">
            <div slot-scope="scope">
              <el-button type="text" size="mini" @click="deleteHandler(scope.row)">
                删除
              </el-button>
              <el-button type="text" size="mini" v-if="scope.row.isDisabled&&scope.row.isDisabled===true" @click="moreHandler(scope.row)">
                更多
              </el-button>
            </div>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="意向规格">
        <el-input v-model="formModel.carColor" maxlength="20" placeholder="请输入颜色/尺寸"></el-input>
      </el-form-item>
      <el-form-item label="购买侧重点">
        <div class="item-content">
          <div class="tag-list">
            <div class="tag-group">
              <el-tag v-for="(tag ,index) of formModel.emphasiss" :key="index" closable size="mini" @close="removeEmphasisTag(index)">
                {{ tag }}</el-tag>
            </div>
            <div class="toggle-btn" @click="showEmphasisRecommend = !showEmphasisRecommend">
              <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showEmphasisRecommend }"></div>
              {{ toggleEmphasisRecommendTxt }}
            </div>
            <div class="recommend-group" v-show="showEmphasisRecommend">
              <el-tag v-for="(tag,index) of emphasisList.slice(0,7)" :key="index" type="info" size="mini"
                @click="addEmphasisTag(tag)">{{ tag }}</el-tag>
              <el-tag v-show="emphasisList&&emphasisList.length > 7" type="info" size="mini"
                @click="moreClick" style="background-color: white;border:none;" :style="showMore===true?'display:none':'display:inline-block'">
                更多
                <i class="el-icon-d-arrow-right"></i>
              </el-tag>
              <el-tag v-show="showMore===true" v-for="(tag,index) of emphasisList.slice(7,10)" :key="index" type="info" size="mini"
                @click="addEmphasisTag(tag)">{{ tag }}</el-tag>
              <span v-show="emphasisList&&!emphasisList.length" style="color: #bbbbbb;">暂无推荐</span>
            </div>
          </div>
          <div class="add-tag">
            <el-input v-model="newEmphasisTagName" :maxlength="18" placeholder="请输入自定义标签"></el-input>
            <el-button @click="addEmphasisTagByButton" type="primary">添加</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="购买目的">
        <div class="item-content">
          <div class="tag-list">
            <div class="tag-group">
              <el-tag v-for="(tag ,index) of formModel.purposes" :key="index" closable size="mini" @close="removeMarketTag(index)">
                {{ tag }}</el-tag>
            </div>
            <div class="toggle-btn" @click="showPurposeRecommend = !showPurposeRecommend">
              <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showPurposeRecommend }"></div>
              {{ togglePurposeRecommendTxt }}
            </div>
            <div class="recommend-group" v-show="showPurposeRecommend">
              <el-tag v-for="(tag,index) of purposeList.slice(0,10)" :key="index" type="info" size="mini"
                @click="addPurposeTag(tag)">{{ tag }}</el-tag>
              <!-- <el-tag v-show="purposeList&&purposeList.length > 10" type="info" size="mini"
                @click="dialogVisibility=true" style="background-color: white;border:none;">
                更多
                <i class="el-icon-d-arrow-right"></i>
              </el-tag> -->
              <span v-show="purposeList&&!purposeList.length" style="color: #bbbbbb;">暂无推荐</span>
            </div>
          </div>
          <div class="add-tag">
            <el-input v-model="newPurposeTagName" :maxlength="18" placeholder="请输入自定义标签"></el-input>
            <el-button @click="addPurposeTagByButton" type="primary">添加</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="预计购买日期">
        <el-date-picker type="date" placeholder="选择预计购买日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="formModel.purchaseDate"
          :picker-options="pickerOptions" style="width: 200px;"></el-date-picker>
      </el-form-item>
      <el-form-item label="客户特征">
        <el-input v-model="formModel.feature" maxlength="50" placeholder="请输入客户特征"></el-input>
      </el-form-item>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="付款意向">
          <el-form-item label="付款方式">
            <el-select v-model="formModel.paymentMethod" placeholder="请选择付款方式" style="width: 100%;">
              <el-option v-for="item in paymentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预算">
            <el-input-number v-model="formModel.budget" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="购买方式">
            <el-select v-model="formModel.purchaseMode" placeholder="请选择购买方式" style="width: 100%;">
              <el-option v-for="item in purchaseModeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原使用商品">
            <el-select v-model="formModel.originalBrand" placeholder="请选择原使用商品" filterable style="width: 100%;">
              <el-option v-for="(item, index) in brandList" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="2" title="竞品画像">
          <el-form-item label="竞品商品">
            <el-input v-model="formModel.competingCar" maxlength="50" placeholder="请输入竞品商品/竞品商品"></el-input>
          </el-form-item>
          <el-form-item label="关注因素">
            <el-input v-model="formModel.concernedfactors" maxlength="50" placeholder="请输入关注因素/关注因素"></el-input>
          </el-form-item>
          <!-- <el-form-item label="竞品商品2">
            <el-input v-model="formModel.competingCar2" maxlength="50" placeholder="请输入竞品商品"></el-input>
          </el-form-item>
          <el-form-item label="关注因素">
            <el-input v-model="formModel.concernedfactors2" maxlength="50" placeholder="请输入关注因素"></el-input>
          </el-form-item> -->
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-dialog title="意向商品" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
      <el-form ref="dialogForm" size="small" label-width="110px" :model="dialogForm" :rules="dialogRules" :inline-message="true">
        <el-form-item label="品牌" prop="brandId">
          <el-select v-model="dialogForm.brandId" placeholder="请选择品牌" style="width: 100%;" @change="handleBrandChange">
            <el-option v-for="(item, index) in brandList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列" prop="seriesId">
          <el-select v-model="dialogForm.seriesId" placeholder="请选择系列" style="width: 100%;" @change="handleSeriesChange">
            <el-option v-for="(item, index) in seriesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="productId">
          <el-select v-model="dialogForm.productId" placeholder="请选择车型" style="width: 100%;" @change="handleTypeChange">
            <el-option v-for="(item, index) in modeList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="memo">
          <el-input v-model="dialogForm.memo" placeholder="请输入描述" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="意向商品" :visible.sync="moreVisible" width="40%" :append-to-body="true">
      <el-button type="primary" size="mini" @click="addProduct" style="margin-bottom:10px">新增</el-button>
      <el-table :data="tableData" style="width: 100%" class="p-table" size="small">
        <el-table-column prop="productName" label="意向商品">
          <div slot-scope="scope">
            <div class="biz-customcol" v-if="scope.row.productName">
              {{ scope.row.productName }}
            </div>
            <div class="biz-customcol" v-else>
              {{ scope.row.seriesName }}
            </div>
          </div>
        </el-table-column>
        <el-table-column prop="memo" label="描述">
        </el-table-column>
        <el-table-column label="操作" width="50px">
          <div slot-scope="scope">
            <el-button type="text" size="mini" @click="deleteHandler(scope.row)">
                删除
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/order-mgmt/orderMgmt';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import { mapGetters, mapMutations } from 'vuex';

// 初始化时需要的一些数据
const listData = {
  intentionLevelList: [],
  paymentList: [{ label: '现金', value: 'cash' }, { label: '按揭', value: 'mortgage' }],
  purchaseModeList: [
    { label: '新购', value: 'new_buy' },
    { label: '增购', value: 'add_buy' },
    { label: '换购', value: 'change_buy' }
  ],
  purposeList: ['家庭用车', '商务用车', '生活', '休闲', '上班', '其他'],
  showPurposeRecommend: false,
  newPurposeTagName: '',
  showEmphasisRecommend: false,
  moreVisible: false,
  newEmphasisTagName: '',
  emphasisList: ['外形', '动力', '费用', '舒适', '安全', '操控', '价格', '品牌', '配置', '其他'],
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() < Date.now();
    }
  },
  tableData: [],
  saveTableData: [],
  productId: '',
  products: [],
  seriesId: '',
  series: [],
  dialogVisible: false,
  showMore: false,
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      auth: ['admin:potential.edit']
    }
  ]
};
// 车辆相关
const vehicleData = {
  data: {
    brandList: [],
    seriesList: [],
    modeList: []
  },
  methods: {
    queryBrandList() {
      service.brands(
        {
          category: 'car'
        },
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(val) {
      service.series(
        { brandId: val },
        data => {
          this.seriesList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(val) {
      service.types(
        { seriesId: val, brand: this.dialogForm.brandId },
        data => {
          this.modeList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    }
  },
  events: {
    handleBrandChange(val) {
      this.querySeriesList(val);
      this.productId = '';
      this.seriesId = '';
      this.$set(this.dialogForm, 'seriesId', '');
      this.$set(this.dialogForm, 'productId', '');
      this.$refs.dialogForm.clearValidate('brandId');
    },
    moreHandler(row) {
      this.moreVisible = true;
    },
    moreClick() {
      this.showMore = true;
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);
      this.productId = '';
      this.seriesId = val;
      this.$set(this.dialogForm, 'productId', '');
      this.$refs.dialogForm.clearValidate('seriesId');
    },
    handleTypeChange(val) {
      this.productId = val;
      this.$refs.dialogForm.clearValidate('productId');
    }
  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {};
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel(),
    dialogForm: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    ...mapMutations('Sales', ['updatePotentialInfo', 'updateConsumer']),
    removeMarketTag(index) {
      this.formModel.purposes = this.formModel.purposes.slice(0, index).concat(this.formModel.purposes.slice(index + 1));
    },
    addPurposeTag(tag) {
      if (this.formModel.purposes.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
        return;
      }
      this.formModel.purposes = [...new Set(this.formModel.purposes.concat(tag))];
    },
    addPurposeTagByButton() {
      const tag = String(this.newPurposeTagName).trim();
      if (!tag) return;
      if (this.formModel.purposes.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
      } else {
        this.formModel.purposes = [...new Set(this.formModel.purposes.concat(tag))];
      }
      this.newPurposeTagName = '';
    },
    removeEmphasisTag(index) {
      this.formModel.emphasiss = this.formModel.emphasiss.slice(0, index).concat(this.formModel.emphasiss.slice(index + 1));
    },
    addEmphasisTag(tag) {
      if (this.formModel.emphasiss.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
        return;
      }
      this.formModel.emphasiss = [...new Set(this.formModel.emphasiss.concat(tag))];
    },
    addEmphasisTagByButton() {
      const tag = String(this.newEmphasisTagName).trim();
      if (!tag) return;
      if (this.formModel.emphasiss.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
      } else {
        this.formModel.emphasiss = [...new Set(this.formModel.emphasiss.concat(tag))];
      }
      this.newEmphasisTagName = '';
    },
    queryConsumerInfo() {
      http
        .get(potentialCustomerMgmt.baseInfo.editQuery, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId.id,
          viewMode: this.viewMode
        })
        .then(data => {
          let obj = data.potentialConsumer;
          obj.nextVisitTime = obj.nextVisitTime ? dateUtil.dateConverter(new Date(obj.nextVisitTime)) : undefined;
          obj.purchaseDate = obj.purchaseDate ? dateUtil.dateConverter(new Date(obj.purchaseDate)) : undefined;
          if (!obj.purposes) {
            obj.purposes = [];
          }
          if (!obj.emphasiss) {
            obj.emphasiss = [];
          }
          this.formModel = obj;
          this.tableData = obj.intentionCars;
          if (this.formModel.purposes && this.formModel.purposes.length > 0) {
            this.showPurposeRecommend = false;
          } else {
            this.showPurposeRecommend = true;
          }
          if (this.formModel.emphasiss && this.formModel.emphasiss.length > 0) {
            this.showEmphasisRecommend = false;
          } else {
            this.showEmphasisRecommend = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        })
        .finally(data => {
          this.loading = false;
        });
    },
    addProduct() {
      this.dialogForm = {};
      this.dialogVisible = true;
    },
    confirm() {
      this.$refs.dialogForm.validate((valid, a) => {
        if (valid) {
          this.tableData.map(item => {
            this.products.push(item.productId);
            this.series.push(item.seriesId);
          });
          if (this.productId && this.products.indexOf(this.productId) !== -1) {
            this.$message.warning('已添加此意向车型，不能重复添加');
            return;
          }
          if (!this.productId && this.series.indexOf(this.seriesId) !== -1) {
            this.$message.warning('已添加此意向车型，不能重复添加');
            return;
          }
          let productName = '';
          let seriesName = '';
          this.modeList.map(item => {
            if (item.id === this.productId) {
              productName = item.name;
            }
          });
          this.seriesList.map(item => {
            if (item.id === this.dialogForm.seriesId) {
              seriesName = item.name;
            }
          });
          this.tableData.push({
            brandId: this.dialogForm.brandId,
            seriesId: this.dialogForm.seriesId,
            memo: this.dialogForm.memo,
            productName: productName,
            seriesName: seriesName,
            productId: this.productId
          });
          this.dialogVisible = false;
        }
      });
    },
    deleteHandler(row) {
      this.tableData.splice(this.tableData.indexOf(row), 1);
    },
    deleteRecommend(row) {
      this.tableData.splice(this.tableData.indexOf(row), 1);
      this.products.splice(this.products.indexOf(row.id), 1);
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        token: '',
        id: this.formModel.id,
        level: this.formModel.level,
        nextVisitTime: this.formModel.nextVisitTime,
        carColor: this.formModel.carColor,
        paymentMethod: this.formModel.paymentMethod,
        budget: this.formModel.budget,
        purchaseMode: this.formModel.purchaseMode,
        purchaseDate: this.formModel.purchaseDate,
        purposes: this.formModel.purposes,
        emphasiss: this.formModel.emphasiss,
        carBrand: this.formModel.carBrand,
        competingCar: this.formModel.competingCar,
        concernedfactors: this.formModel.concernedfactors,
        competingCar2: this.formModel.competingCar2,
        concernedfactors2: this.formModel.concernedfactors2,
        feature: this.formModel.feature,
        originalBrand: this.formModel.originalBrand,
        intentionCars: this.tableData,
        viewMode: this.viewMode,
        shopId: window.top.SHOP_ID || ''
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = this.getSaveParams();
          http
            .put(potentialCustomerMgmt.intention.save, params)
            .then(data => {
              this.$message.success('保存成功');
              this.$emit('operationSuccess', this.formModel.id);
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
        } else {
          return false;
        }
      });
    }
  }
};

export default {
  name: 'PotentialCustomerIntention',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...listData,
      ...formData.data,
      ...vehicleData.data,

      rules: {
        // level: [
        //   { required: true, trigger: 'blur', message: '请选择意客户向级别' }
        // ]
      },
      dialogRules: {
        brandId: [{ required: true, trigger: 'blur', message: '请选择品牌' }],
        seriesId: [{ required: true, trigger: 'blur', message: '请选择系列' }]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    viewMode: {
      type: String,
      default() {
        return 'merge';
      }
    },
    activeNames1: {
      type: Array,
      default() {
        return ['1', '2', '3'];
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events,

    ...vehicleData.methods,
    ...vehicleData.events
  },
  computed: {
    ...mapGetters('Sales', ['potentialInfo', 'consumerInfo']),
    consumerState() {
      return this.$store.state.potentialCustomer.consumerState;
    },
    togglePurposeRecommendTxt() {
      const { showPurposeRecommend } = this;
      if (showPurposeRecommend) {
        return '收起推荐';
      }
      return '展开推荐';
    },
    toggleEmphasisRecommendTxt() {
      const { showEmphasisRecommend } = this;
      if (showEmphasisRecommend) {
        return '收起推荐';
      }
      return '展开推荐';
    },
    handleTableData() {
      let table = [];
      if (this.tableData.length > 3) {
        this.tableData.forEach((element, index) => {
          if (index < 3) {
            if (index === 2) {
              element.isDisabled = true;
            }
            table.push(element);
          }
        });
      } else {
        table = this.tableData;
      }
      return table;
    }
  },
  watch: {
    itemId(nVal, oVal) {
      // 设置相关列表
      this.intentionLevelList = this.potentialInfo.intentionLevels;
      if (nVal.id) {
        this.queryConsumerInfo();
      }
    }
  },
  created() {
    this.queryBrandList();
    this.intentionLevelList = this.potentialInfo.intentionLevels;
    console.log('intentionList: ', this.intentionLevelList);
    if (this.itemId.id) this.queryConsumerInfo();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__intention {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-input-number.is-controls-right .el-input__inner {
      text-align: left;
    }
  }
  .el-input-number--small {
    width: 100%;
  }
  .p-table {
    .el-table__empty-block {
      line-height: 60px;
    }
  }
  .item-content {
    display: flex;
    flex-direction: column;
    width: 210px;
    .el-tag + .el-tag {
      margin-left: 0;
    }
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      width: 230px;
      .tag-group {
        padding-right: 5px;
      }
      .toggle-btn {
        display: flex;
        align-items: flex-end;
        width: 65px;
        cursor: pointer;
        user-select: none;
        .rotate-180 {
          transform: rotate(180deg);
        }
      }
      .recommend-group {
        width: 100%;
        margin: 0 0px 10px 0;
        padding: 7px 12px;
        border: 1px solid #f4f2f2;
        border-radius: 4px;
        .el-tag {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .add-tag {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
      .el-input {
        margin-right: 10px;
      }
    }
  }
}
</style>
