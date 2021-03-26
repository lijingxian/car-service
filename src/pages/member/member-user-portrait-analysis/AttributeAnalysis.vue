<template>
  <div class="attribute-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>年龄：统计期内，现有会员的年龄分布（60后，70后，80后，90后，00后）</p>
          <p>性别：统计期内，会员的性别分布（男，女）</p>
          <p>婚育：统计期内，会员的婚姻状况分布（未婚、已婚）和生育状况分布（未育、已育）</p>
          <p>学历：统计期内，会员的学历分布（高中及以下，专科，本科，硕士，博士）</p>
          <p>收入水平：统计期内，会员的收入水平分布（高、较高、中等、较低、低）</p>
          <p>拥有车辆价格：统计期内，会员拥有的车辆价格分布（10万以下、10-20万、20-50万、50-100万、100万以上）</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideOperator1}" v-if="getUser.roleLevel !== 'shop'">
      <div class="title">运营商：</div>
      <div class="hardOperatorGroup1" :class="{'showHideOperator1' : showHideOperator1}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
        </el-checkbox-button>
        <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
          <el-checkbox-button v-for="(condition,index)  in operatorList" :label="condition.id" :key="index" size="mini">
            {{condition.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichOperator1" v-if="showOperatorSwich1">
      <i :class="classNameOperator1" @click="swichOperator1"></i>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}" v-if="getUser.roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
        <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
          <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichShop1" v-if="showShopSwich1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="indicators-search">
      <div class="title">消费价值</div>
      <el-checkbox-button v-model="checkAllValue" @change="handleCheckAllValue" :indeterminate="isIndeterminateValue">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedValue" @change="valueChange">
        <el-checkbox-button v-for="(condition,index) in conditionData.valueList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="indicators-search">
      <div class="title">活跃行为</div>
      <el-checkbox-button v-model="checkAllAbility" @change="handleCheckAllAbility" :indeterminate="isIndeterminateAbility">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedAbility" @change="abilityChange">
        <el-checkbox-button v-for="(condition,index) in conditionData.abilityList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
          </div>
          <div class="type-range">
            <el-radio-group @change="indicatorChanged" v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px" v-show="radioValue==='0'">
          <div v-for="(list,index) in pieLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}人
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="isShow"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow">
          <el-table-column prop="age" label="年龄" v-if="filters[0].value==='age'"></el-table-column>
          <el-table-column prop="education" label="学历" v-if="filters[0].value==='education'"></el-table-column>
          <el-table-column prop="emotionalState" label="情感状态" v-if="filters[0].value==='emotionalState'"></el-table-column>
          <el-table-column prop="familialIdentity" label="家庭身份" v-if="filters[0].value==='emotionalState'"></el-table-column>
          <el-table-column prop="incomeState" label="收入水平" v-if="filters[0].value==='incomeState'"></el-table-column>
          <el-table-column prop="carPrice" label="拥有车辆价格" v-if="filters[0].value==='carPrice'"><template slot-scope="scope" v-if="scope.row.carPrice!==''">￥{{scope.row.carPrice}}</template></el-table-column>
          <el-table-column prop="gender" label="性别" v-if="filters[0].value==='gender'"></el-table-column>
          <el-table-column prop="mobile" label="手机号码"></el-table-column>
          <el-table-column prop="name" label="会员姓名"></el-table-column>
          <el-table-column prop="shopName" label="所属店铺"></el-table-column>
          <el-table-column prop="memberActive" label="活跃程度"></el-table-column>
          <el-table-column prop="consumeValue" label="消费价值"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="!isShow"></biz-pagination>
        <div align="right" v-if="!isShow">
          <el-button type="primary" size="mini" @click="exportExcle">导出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import ShowSearchGrid from './components/ShowSearchGrid';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'AttributeAnalysis',
  data() {
    return {
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      filters: [
        {
          type: 'single',
          label: '',
          value: 'age',
          options: [
            { value: 'age', label: '年龄' },
            { value: 'gender', label: '性别' },
            { value: 'emotionalState', label: '婚育' },
            { value: 'education', label: '学历' },
            { value: 'incomeState', label: '收入水平' },
            { value: 'carPrice', label: '拥有车辆价格' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      pieLists: [],
      countTotal: 0,
      isShow: 'false',
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      conditionData: {
        shopsList: [],
        abilityList: [],
        valueList: []
      },
      isIndeterminateAbility: true,
      checkAllAbility: true,
      checkedAbility: [],
      isIndeterminateValue: true,
      checkAllValue: true,
      checkedValue: [],
      radioValue: '0',
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      hardGroupOperatorHeight1: 0,
      hardGroupShopHeight1: 0,
      classNameOperator1: 'el-icon-caret-bottom',
      classNameShop1: 'el-icon-caret-bottom',
      showOperatorSwich1: false,
      showShopSwich1: false,
      showHideOperator1: false,
      showHideShop1: false
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    load() {
      this.viewType = this.params.viewType || 'month';
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      this.$refs.search.defaultDate = [dateTime.getPreThreeMonthDay(), dateTime.today()];
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      if (this.getUser.roleLevel !== 'shop') {
        this.operatorList = [];
        this.getCompanyList();
      }
      this.getValueTags();
      this.getAbilityTags();
    },
    indicatorChanged() {
      if (this.radioValue === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    handleCheckAllOperator(val) {
      this.checkedOperator = val
        ? this.operatorList.map(item => {
          return item.id;
        })
        : [];
      this.getShopList();
    },
    operatorChange(val) {
      let checkedCount = val.length;
      this.checkAllOperator = checkedCount === this.operatorList.length;
      this.isIndeterminateOperator = checkedCount > 0 && checkedCount < this.operatorList.length;
      this.getShopList();
    },
    handleCheckAllShops(val) {
      this.checkedShops = val
        ? this.conditionData.shopsList.map(item => {
          return item.id;
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.getGraphData();
      this.getTable();
    },
    handleCheckAllAbility(val) {
      this.checkedAbility = val
        ? this.conditionData.abilityList.map(item => {
          return item.id;
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    abilityChange(val) {
      let checkedCount = val.length;
      this.checkAllAbility = checkedCount === this.conditionData.abilityList.length;
      this.isIndeterminateAbility = checkedCount > 0 && checkedCount < this.conditionData.abilityList.length;
      this.getGraphData();
      this.getTable();
    },
    handleCheckAllValue(val) {
      this.checkedValue = val
        ? this.conditionData.valueList.map(item => {
          return item.id;
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    valueChange(val) {
      let checkedCount = val.length;
      this.checkAllValue = checkedCount === this.conditionData.valueList.length;
      this.isIndeterminateValue = checkedCount > 0 && checkedCount < this.conditionData.valueList.length;
      this.getGraphData();
      this.getTable();
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          this.operatorList = data.content;
          this.checkedOperator = this.operatorList
            ? this.operatorList.map(item => {
              return item.id;
            })
            : [];
          this.$nextTick(() => {
            this.hardGroupOperatorHeight1 = document.getElementsByClassName('hardOperatorGroup1')[0].offsetHeight;
            if (this.hardGroupOperatorHeight1 > 55) {
              this.showOperatorSwich1 = true;
              this.showHideOperator1 = true;
            } else {
              this.showOperatorSwich1 = false;
              this.showHideOperator1 = false;
            }
          });
          this.getShopList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getShopList() {
      let param = {
        companys: this.checkedOperator
      };
      http
        .post('/admin/ecommerce/kpi/condition/json/queryShopsByMultiCompany.jhtml', param)
        .then(data => {
          this.conditionData.shopsList = data.shopDatas;
          this.checkedShops = this.getUser.shop.id ? [this.getUser.shop.id] : this.conditionData.shopsList.map(item => { return item.id; });
          let checkedCount = this.conditionData.shopsList.length;
          this.checkAllShops = checkedCount === this.checkedShops.length;
          this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.checkedShops.length;
          this.$nextTick(() => {
            this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
            if (this.hardGroupShopHeight1 > 55) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
            }
          });
          this.getGraphData();
          this.getTable();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getAbilityTags() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        categoryType: '会员标签/流失特征/流失决策'
      };
      http
        .get(urls.systemSetting.storeTags, params)
        .then(data => {
          this.conditionData.abilityList = data.content;
          this.checkedAbility = this.conditionData.abilityList
            ? this.conditionData.abilityList.map(item => {
              return item.id;
            })
            : [];
          let checkedCount = this.checkedAbility.length;
          this.checkAllAbility = checkedCount === this.conditionData.abilityList.length;
          this.isIndeterminateAbility = checkedCount > 0 && checkedCount < this.conditionData.abilityList.length;
          this.getGraphData();
          this.getTable();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    getValueTags() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        categoryType: '会员标签/消费特征/消费偏好'
      };
      http
        .get(urls.systemSetting.storeTags, params)
        .then(data => {
          this.conditionData.valueList = data.content;
          this.checkedValue = this.conditionData.valueList
            ? this.conditionData.valueList.map(item => {
              return item.id;
            })
            : [];
          let checkedCount = this.checkedValue.length;
          this.checkAllValue = checkedCount === this.conditionData.valueList.length;
          this.isIndeterminateValue = checkedCount > 0 && checkedCount < this.conditionData.valueList.length;
          this.getGraphData();
          this.getTable();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    swichOperator1() {
      this.classNameOperator1 = this.classNameOperator1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideOperator1 = this.classNameOperator1 === 'el-icon-caret-bottom';
      if (!this.showHideOperator1) {
        document.getElementsByClassName('hardOperatorGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardOperatorGroup1')[0].style.height = '55px';
      }
    },
    swichShop1() {
      this.classNameShop1 = this.classNameShop1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop1 = this.classNameShop1 === 'el-icon-caret-bottom';
      if (!this.showHideShop1) {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = '55px';
      }
    },
    getGraphData(state) {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        indicator: this.filters[0].value,
        searchShopIds: this.checkedShops.join('&searchShopIds='),
        activeTagIds: this.checkedAbility.join('&activeTagIds='),
        consumeTagIds: this.checkedValue.join('&consumeTagIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.countTotal = 0;
          this.pieLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartData = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getTable() {
      let params = {
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShops.join('&searchShopIds='),
        activeTagIds: this.checkedAbility.join('&activeTagIds='),
        consumeTagIds: this.checkedValue.join('&consumeTagIds='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/table/member/membersByAttribute.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      let params = {
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShops,
        activeTagIds: this.checkedAbility,
        consumeTagIds: this.checkedValue,
        summaryType: '1',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/export/member/membersByAttribute.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    filterDataChange(val) {
      this.filters = val;
      this.getGraphData();
      this.getTable();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTable();
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphData();
      this.getTable();
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].lable,
          value: data.indicators[i].value
        });
      }
      let chartData = {
        type: 'pie',
        legendVisible: false,
        data: {
          columns: ['type', 'value'],
          rows: tmpData
        },
        settings: {
          radius: [60, 150],
          offsetY: '50%'
        },
        events: {
          mouseover: v => {
            this.pieLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.pieLists.forEach((element, index) => {
              document.getElementsByClassName('list' + index)[0].style.color = 'black';
              document.getElementsByClassName('list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  created() {},
  components: {
    BizChart,
    BizList,
    BizFilter,
    ShowSearchGrid,
    BizPagination
  }
};
</script>

<style lang="scss">
.attribute-analysis {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
    .el-checkbox-button {
      padding: 15px;
    }
    .el-checkbox-button__inner {
      padding: 10px;
      font-size: 12px;
      border: none;
    }
    .el-checkbox-button:first-child .el-checkbox-button__inner {
      border: none;
      border-radius: 15px;
    }
    .el-checkbox-button:last-child .el-checkbox-button__inner {
      border-radius: 15px;
    }
    .el-checkbox-button,
    .el-checkbox-button__inner {
      border-radius: 15px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner {
      background-color: #f8d6ad;
      border-color: #fff;
      box-shadow: -1px 0 0 0 #fff;
      color: #ff7300;
    }
    .title {
      padding: 20px 10px;
      font-size: 12px;
    }
    .hardOperatorGroup1 {
      display: flex;
      width: calc(100% - 90px);
    }
    .hardShopGroup1 {
      display: flex;
      width: calc(100% - 90px);
    }
  }
  .showHide2 {
    height: 55px;
  }
  .swichOperator1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichShop1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideOperator1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .chart-area {
    margin-top: 10px;
    .graph {
      // box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-left: 1px;
      width: 100%;
      height: 100%;
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
      }
      .filterSeach {
        margin-top: 10px;
        .type-range {
          float: right;
        }
      }
    }
  }
  .description-pover {
    max-height: 500px;
    overflow: auto;
  }
  .yellow {
    color: #ff7300;
  }
  .search-property {
    display: flex;
    justify-content: space-between;
    .el-input--prefix .el-input__inner {
      height: 35px;
    }
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
}
</style>
