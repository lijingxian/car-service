<template>
  <el-dialog title="V豆使用量详情" :visible.sync="dialogVisible" :append-to-body="true" center custom-class="usedList">
    <biz-list ref="table" :tableData="rowData">
      <el-table-column prop="templateName" label="会员卡体系"></el-table-column>
      <el-table-column prop="name" label="会员卡等级"></el-table-column>
      <el-table-column prop="incomeBean" label="V豆获取量">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="getBean(scope.row)">
            {{scope.row.incomeBean}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="usedBean" label="V豆使用量">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="useBean(scope.row)">
            {{scope.row.usedBean}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="bean" label="V豆余额">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="balanceBean(scope.row)">
            {{scope.row.bean}}
          </el-button>
        </template>
      </el-table-column>
    </biz-list>
    <!-- <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination> -->
    <el-dialog title="V豆使用量>V豆获取量详情" :visible.sync="visibleGet" append-to-body custom-class="usedListInfo">
      <biz-header :operations="operations" @operate="operate" :filters="filtersInfo" @filterDataChange="filterDataChange"
        @cascader-change="cascaderChange">
      </biz-header>
      <biz-list ref="table" :tableData="tableDataGet">
        <el-table-column prop="typeName" label="来源"></el-table-column>
        <el-table-column prop="beanCount" label="V豆获取量"></el-table-column>
        <el-table-column prop="member" label="会员">
          <template slot-scope="scope">
            <div class="customer-info">
              <img v-if="scope.row.member.head" :src="scope.row.member.head" />
              <img v-else src="../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="title">{{scope.row.member.name}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member.mobile}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="happenData" label="日期"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </biz-list>
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </biz-pagination>
    </el-dialog>
    <el-dialog title="V豆使用量>V豆使用详情" :visible.sync="visibleUse" append-to-body custom-class="usedListInfo">
      <biz-header :operations="operations" @operate="operate" :filters="filtersInfo" @filterDataChange="filterDataChange"
        @cascader-change="cascaderChange">
      </biz-header>
      <biz-list ref="table" :tableData="tableDataUse">
        <el-table-column prop="typeName" label="来源"></el-table-column>
        <el-table-column prop="beanCount" label="V豆使用量"></el-table-column>
        <el-table-column prop="member" label="会员">
          <template slot-scope="scope">
            <div class="customer-info">
              <img v-if="scope.row.member.head" :src="scope.row.member.head" />
              <img v-else src="../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="title">{{scope.row.member.name}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member.mobile}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="happenData" label="日期"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </biz-list>
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </biz-pagination>
    </el-dialog>
    <el-dialog title="V豆使用量>V豆余额详情" :visible.sync="visibleBalance" append-to-body custom-class="usedListInfo">
      <biz-header :operations="operationsBalance" @operate="operate" :filters="filtersBalanceInfo"
        @filterDataChange="filterDataChange">
      </biz-header>
      <biz-list ref="table" :tableData="tableDataBalance">
        <el-table-column prop="e" label="会员">
          <template slot-scope="scope">
            <div class="customer-info">
              <img v-if="scope.row.member.head" :src="scope.row.member.head" />
              <img v-else src="../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="title">{{scope.row.member.userName}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member.mobile}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bean" label="V豆余额"></el-table-column>
      </biz-list>
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </biz-pagination>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import BizList from '@/components/BizTable/BizList';
import http from '@/common/http';
import { systemSetting } from '@/common/urls';
import { mapGetters } from 'vuex';
// 组合tag，两个纯函数
const getOption = function(ary) {
  let options = [];
  for (const iterator of ary) {
    let obj = {
      value: { name: iterator.name, id: iterator.id },
      label: iterator.name
    };
    if (iterator.children.length > 0) {
      obj.children = getOption(iterator.children);
    }
    if (iterator.tags && iterator.tags.length > 0) {
      if (!obj.hasOwnProperty('children')) {
        obj.children = [];
      }
      obj.children = obj.children.concat([{ label: '全部', value: '' }]);
      let tags = getTags(iterator.tags);
      for (const tag of tags) {
        obj.children.push(tag);
      }
    }
    if (iterator.children.length === 0 && !iterator.tags) {
      obj.disabled = true;
    }
    options.push(obj);
  }
  return options;
};
const getTags = function(array) {
  let tags = [];
  for (const iterator of array) {
    tags.push({
      label: iterator.name,
      value: { name: iterator.name, id: iterator.id }
    });
  }
  return tags;
};
export default {
  data() {
    return {
      tableData: [{ a: '1', b: '2', c: '3', d: '4', e: '5' }],
      tableDataGet: [],
      tableDataUse: [],
      tableDataBalance: [],
      curTagName: '',
      visibleGet: false,
      visibleUse: false,
      visibleBalance: false,
      usedType: '',
      usedId: '',
      row: {},
      operations: [
        {
          label: '导出',
          name: 'export',
          type: ''
        }
      ],
      operationsBalance: [
        {
          label: '导出',
          name: 'exportBalance',
          type: ''
        }
      ],
      filters: [
        {
          type: 'daterange',
          label: '日期',
          name: 'publishDate',
          value: []
        }
      ],
      filtersBalanceInfo: [
        {
          type: 'input',
          label: '会员',
          placeholder: '请输入姓名/手机号码',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      filtersInfo: [
        {
          type: 'cascader',
          label: '来源',
          name: 'memberTag',
          changeOnSelect: false,
          filterable: false,
          value: [''],
          options: []
        },
        {
          type: 'input',
          label: '会员',
          placeholder: '请输入姓名/手机号码',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    beginDate: {
      type: String,
      default() {
        return '';
      }
    },
    endDate: {
      type: String,
      default() {
        return '';
      }
    },
    rowData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    BizPagination,
    BizList,
    BizHeader
  },
  created() {
    this.getTagClassList();
  },

  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    getTagClassList() {
      let url;
      let param = {
        categoryType: 'V豆标签',
        isIncludeTag: '1'
      };
      if (this.getUser().roleLevel === 'platform') {
        url = systemSetting.platformTagcategories;
      } else if (this.getUser().roleLevel === 'shop') {
        url = systemSetting.storeTagcategories;
        param.shopId = window.top.SHOP_ID || '';
      }
      http
        .get(url, param)
        .then(data => {
          let ary = data.content;
          let options = [
            {
              label: '全部',
              value: ''
            }
          ];
          options = options.concat(getOption(ary));
          this.filtersInfo[0].options = options;
          this.filtersInfo[0].value = [''];
        })
        .catch(error => {
          if (error.errorMessage !== '店铺不存在') {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    cascaderChange(val) {
      this.pagination.currentPage = 1;
      this.curTagName = val[val.length - 1].id;
      if (val.length > 1 && !this.curTagName) {
        let tagCategoryId = val[val.length - 2].id;
        http
          .get('/admin/tag/storeTags.jhtml', { tagCategoryId: tagCategoryId })
          .then(data => {
            let temp = [];
            data.content.map(item => {
              temp.push(item.id);
            });
            this.curTagName = temp.join(',');
            this.refresh();
          })
          .catch(error => {
            if (error.errorMessage !== '店铺不存在') {
              this.$message.warning(error.errorMessage);
            }
          })
          .finally(() => {});
      } else {
        this.refresh();
      }
    },
    refresh() {
      if (this.row.isIncome === '1') {
        this.getBean(this.row, 'flag');
      } else if (this.row.isIncome === '0') {
        this.useBean(this.row, 'flag');
      } else {
        this.balanceBean(this.row, 'flag');
      }
    },
    getBean(row, flag) {
      this.row = Object.assign({}, row, { isIncome: '1' });
      if (!flag) {
        this.filtersInfo[0].value = [''];
        this.filtersInfo[1].value = '';
        this.curTagName = '';
        this.pagination.currentPage = 1;
      }
      this.loading = true;
      let params = {
        type: row.type,
        id: row.id,
        templateId: row.templateId,
        isIncome: '1',
        beginDate: this.beginDate,
        endDate: this.endDate,
        tag: this.curTagName,
        searchValue: this.filtersInfo[1].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/bean/expendList.jhtml', params)
        .then(data => {
          this.tableDataGet = data.dataList;
          this.pagination.total = Number(data.total);
          this.visibleGet = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    useBean(row, flag) {
      this.row = Object.assign({}, row, { isIncome: '0' });
      if (!flag) {
        this.filtersInfo[0].value = [''];
        this.filtersInfo[1].value = '';
        this.curTagName = '';
        this.pagination.currentPage = 1;
      }
      this.loading = true;
      let params = {
        type: row.type,
        id: row.id,
        templateId: row.templateId,
        isIncome: '0',
        beginDate: this.beginDate,
        endDate: this.endDate,
        tag: this.curTagName,
        searchValue: this.filtersInfo[1].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/bean/expendList.jhtml', params)
        .then(data => {
          this.tableDataUse = data.dataList;
          this.pagination.total = Number(data.total);
          this.visibleUse = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    balanceBean(row, flag) {
      this.row = Object.assign({}, row, { isIncome: '' });
      if (!flag) {
        this.filtersBalanceInfo[0].value = '';
        this.curTagName = '';
        this.pagination.currentPage = 1;
      }
      this.loading = true;
      let params = {
        type: row.type,
        rankId: row.id,
        templateId: row.templateId,
        beginDate: this.beginDate,
        endDate: this.endDate,
        // tag: this.curTagName,
        searchValue: this.filtersBalanceInfo[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/memberCard/memberCards.jhtml', params)
        .then(data => {
          this.tableDataBalance = data.content;
          this.pagination.total = Number(data.total);
          this.visibleBalance = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    export() {
      let params = {
        type: this.row.type,
        id: this.row.id,
        templateId: this.row.templateId,
        beginDate: this.beginDate,
        endDate: this.endDate,
        isIncome: this.row.isIncome,
        searchValue: this.filtersInfo[1].value || '',
        tag: this.curTagName,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/bean/expendList/export.jhtml', params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = '/admin/bean/expendList/export.jhtml?' + paramsArr.join('&');
              // 异步弹出窗口会被Chrome拦截
              window.open(linkedUrl);
              // location.href = linkedUrl;
            } else {
              if (data === '没有符合条件的数据') {
                this.$message.warning('没有符合条件的数据');
              } else {
                this.$message.warning(data.errorMessage);
                console.log('ERR_EXPORT: ', data);
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
          }
        );
    },
    exportBalance() {
      console.log(this.row);
      let params = {
        dataType: this.row.type,
        templateId: this.row.templateId,
        rankId: this.row.id,
        beginDate: this.beginDate,
        endDate: this.endDate,
        isShortMode: '1',
        searchValue: this.filtersInfo[1].value || '',
        tag: this.curTagName,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/memberCard/exportMemberCards.jhtml', params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = '/admin/memberCard/exportMemberCards.jhtml?' + paramsArr.join('&');
              // 异步弹出窗口会被Chrome拦截
              window.open(linkedUrl);
              // location.href = linkedUrl;
            } else {
              if (data === '没有符合条件的数据') {
                this.$message.warning('没有符合条件的数据');
              } else {
                this.$message.warning(data.errorMessage);
                console.log('ERR_EXPORT: ', data);
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
          }
        );
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>
<style lang="scss">
.usedListInfo {
  width: 80%;
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      height: 45px;
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
