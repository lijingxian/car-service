<template>
  <div class="motor-club-member-signup">
    <biz-flex-table :checkable="false" :operations="operations" @operate="operate" :filters="filters" :loading="loading"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @sort-change="handleSortChange">
      <!-- 表格内容 -->
      <el-table-column label="会员" min-width="150">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.userHead" :src="scope.row.userHead" />
            <img v-else :src="avatar" />
            <div class="wrapper">
              <div class="title"  :title="scope.row.name">{{scope.row.name}}</div>
              <!-- <el-button class="title" type="text">{{scope.row.name}}</el-button> -->
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="签到地址" prop="memberPosition"></el-table-column>
      <el-table-column label="签到时间" prop="signTime" sortable="custom" min-width="100"></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

// import date from '@/utils/date';
import { motorClubMemberMgmt as service } from '@/common/urls';
import http from '@/common/http';
import avatar from '@/assets/images/default_user.png';
import axios from 'axios';
export default {
  name: 'MotorClubMemberSignUp',
  data() {
    return {
      orderProperty: '',
      orderDirection: '',
      loading: false,
      avatar: avatar,
      operations: [{ label: '导出', name: 'export', type: '', auth: ['admin:fleet.edit'] }],
      filters: [
        // { type: 'select', label: '成员', value: '', options: [] }
        // { type: 'daterange', label: '日期区间', value: [date.lastMonthDate(), date.nowDate()] }
        {
          type: 'input',
          label: '',
          placeholder: '请输入会员姓名/手机号',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  components: {
    BizFlexTable
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.filters = val;
      this.refresh();
    },
    // 导出
    // export() {
    //   let params = {
    //     // beginDateStr: this.filters[1].value[0] || '',
    //     // endDateStr: this.filters[1].value[1] || '',
    //     fleetId: this.itemId.id || ''
    //   };
    //   http
    //     .get(service.signUp.export, params)
    //     .then()
    //     .catch(data => {
    //       if (!data.errorMessage && data !== '没有符合条件的数据') {
    //         let paramsArr = [];
    //         for (let name in params) {
    //           paramsArr.push(`${name}=${params[name]}`);
    //         }
    //         let linkedUrl = `${service.signUp.export}?` + paramsArr.join('&');
    //         // 异步弹出窗口会被Chrome拦截
    //         window.open(linkedUrl);
    //         // location.href = linkedUrl;
    //       } else {
    //         if (data === '没有符合条件的数据') {
    //           this.$message.warning('没有符合条件的数据');
    //         } else {
    //           this.$message.warning(data.errorMessage);
    //           console.log('ERR_EXPORT: ', data);
    //         }
    //       }
    //     });
    // },
    async export() {
      let params = {
        // beginDateStr: this.filters[1].value[0] || '',
        // endDateStr: this.filters[1].value[1] || '',
        fleetId: this.itemId.id || '',
        memberId: this.filters[0].value || ''
      };
      try {
        let response = await axios.post(service.signUp.export, params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
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
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 排序
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    // 查询
    refresh() {
      let params = {
        // beginDateStr: this.filters[1].value[0] || '',
        // endDateStr: this.filters[1].value[1] || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        fleetId: this.itemId.id || '',
        searchValue: this.filters[0].value || '',
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      this.loading = true;
      http
        .get(service.signUp.query, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        });
    },
    queryInfo() {
      http
        .get(service.signUp.queryInfo, { fleetId: this.itemId.id })
        .then(data => {
          this.showMessage(`今日新增签到${data.count}条，您可按时间删选后导出记录进行签到管理统计哦`, 'info');
        })
        .catch();
    },
    // 查询用户列表
    queryMemberList() {
      let params = {
        fleetId: this.itemId.id,
        pageSize: 1000
      };
      http
        .get(service.listPage.list, params)
        .then(data => {
          // let tmp = [{ value: '', label: '全部' }];
          // data.memberList.map(member => {
          //   tmp.push({ value: member.id, label: member.nickname });
          // });
          // this.filters[0].options = tmp;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.queryInfo();
    // this.queryMemberList();
    this.refresh();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        if (nVal.id !== oVal.id) {
          this.queryInfo();
          // this.queryMemberList();
          this.refresh();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.motor-club-member-signup {
  height: 100%;
  .biz-input {
    width: 280px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }

  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .title {
        width: 175px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
