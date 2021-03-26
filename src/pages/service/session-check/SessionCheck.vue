<template>
  <div class="cs-session-check">
    <biz-flex-table :filters="filters" @filter-data-change="filterDataChange" :tableData="tableData" :checkable="false" :pagination="pagination"
      @row-click="rowClick" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column prop="" label="客户" min-width="220">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              昵称：{{scope.row.member.nickname}}
            </div>
            <div class="overflow">
              电话：{{scope.row.member.mobile}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="qualityReview.member_score" label="用户评分" min-width="120">
        <template slot-scope="scope">
          {{getScore(scope.row.qualityReview.member_score)}}
        </template>
      </el-table-column>
      <el-table-column prop="qualityReview.manager_score" label="质检评分" min-width="120">
        <template slot-scope="scope">
          {{scope.row.qualityReview.manager_score||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="异常状态" min-width="120">
        <template slot-scope="scope">
          <div>
            <div style="color:red">{{getScore(scope.row.qualityReview.member_score)==='非常不满意'?'用户评分异常':'--'}}</div>
            <div style="color:red">{{dateInterval(scope.row.end, scope.row.start) ? '会话时长异常' : '--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="start" label="会话时间" min-width="200">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.start}}
            </div>
            <div class="overflow">
              {{scope.row.end}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <biz-save-button :operations="operations" @operate="handleOperate" style="margin-top: 10px;justify-content:flex-start;">
        </biz-save-button>
        <div class="score">
          <div class="title">用户评分：{{getScore(clientScore)||'未评分'}}</div>
          <div class="sel">质检评分：
            <el-select size="small" v-model="score" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="chat-record">
          <!-- :isFromClient="isFromClient"
                   :csName="csName"
                   :clientName="clientName" -->
          <chat-item v-for="item of chatList" :key="item.id" :message="item">
          </chat-item>
        </div>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import emoji from '@/utils/emoji';
import BizSaveButton from '@/components/BizSaveButton';
import sessionCheckService from '@/service/customer-service/sessionCheck';
// import ImService from '@/service/customer-service/session-online/imService';
import { BizFlexTable } from '@/components/BizTable';
import ChatItem from './ChatItem';
import date from '@/utils/date';
import { BizPopupTabs } from '@/components/BizPopup';
import dateInterval from '@/utils/gmttime-interval';
export default {
  name: 'SessionCheck',
  data() {
    return {
      dialogVisible: false,
      tabName: 'first',
      open: false,
      filters: [
        {
          type: 'daterange',
          label: '日期范围',
          name: 'publishDate',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          type: 'select',
          label: '用户评分',
          value: '',
          options: [{ value: '', label: '全部' }, { value: '10', label: '非常满意' }, { value: '8', label: '满意' }, { value: '6', label: '一般' }, { value: '4', label: '不满意' }, { value: '2', label: '非常不满意' }, { value: '0', label: '未评分' }]
        },
        {
          type: 'select',
          label: '会话时长',
          value: '',
          options: [{ value: '', label: '全部' }, { value: '<1', label: '小于1min' }, { value: '<10', label: '1-10min' }, { value: '>10', label: '大于10min' }]
        },
        {
          type: 'input',
          placeholder: '请输入客户昵称/手机号',
          name: 'search',
          value: ''
        }
      ],
      chatList: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      operations: [
        {
          label: '保存',
          name: 'scoreOperate',
          type: 'primary'
        }
      ],
      clientScore: '',
      score: '',
      activatedSessionId: '',
      options: [
        // {
        //   value: '',
        //   label: '未打分' //修改21378bug
        // },
        {
          value: '1',
          label: '1分'
        },
        {
          value: '2',
          label: '2分'
        },
        {
          value: '3',
          label: '3分'
        },
        {
          value: '4',
          label: '4分'
        },
        {
          value: '5',
          label: '5分'
        },
        {
          value: '6',
          label: '6分'
        },
        {
          value: '7',
          label: '7分'
        },
        {
          value: '8',
          label: '8分'
        },
        {
          value: '9',
          label: '9分'
        },
        {
          value: '10',
          label: '10分'
        }
      ]
    };
  },
  created() {
    this.refresh();
  },
  mounted() {
    this.$message({
      showClose: true,
      message: '客服主管可对客服的历史会话进行质检并评分，以此考核服务KPI',
      type: 'info'
    });
  },
  components: { BizFlexTable, ChatItem, BizPopupTabs, BizSaveButton },
  methods: {
    refresh() {
      this.getSessionCheckList();
    },
    close() {
      this.open = false;
    },
    handleOperate(name) {
      this[name]();
    },
    dateInterval(val, val1) {
      console.log(dateInterval(val.split(' ')[1], val1.split(' ')[1]));
      if (val && val1) {
        return dateInterval(val.split(' ')[1], val1.split(' ')[1]) < 1;
      }
    },
    getSessionCheckList() {
      let params = {
        strQuality: this.filters[1].value,
        strTime: this.filters[2].value,
        shopId: window.top.SHOP_ID || '',
        beginDate: this.filters[0].value[0],
        endDate: this.filters[0].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[3].value
      };
      sessionCheckService.getSessionCheckList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getScore(score) {
      if (score === '2') {
        return '非常不满意';
      } else if (score === '4') {
        return '不满意';
      } else if (score === '6') {
        return '一般';
      } else if (score === '8') {
        return '满意';
      } else if (score === '10') {
        return '非常满意';
      } else {
        return '未评分';
      }
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
    },
    rowClick(row) {
      // console.log(row);
      this.activatedSessionId = row.id;
      this.getChatList();
      this.getSessionCount();
      this.open = true;
    },
    getChatList() {
      let params = {
        id: this.activatedSessionId
      };
      sessionCheckService.getChatList(
        params,
        data => {
          console.log(data);
          let chatList = [];
          for (let iterator of data.data) {
            if (iterator.body.type === 'txt') {
              iterator.body.msg = emoji.transform(iterator.body.msg);
            }

            chatList.push({
              fromMember: iterator.fromMember,
              body: iterator.body,
              from: {
                id: iterator.fromId,
                name: ''
              },
              id: iterator.id,
              timestamp: iterator.timestamp,
              to: {
                id: iterator.toId,
                name: ''
              }
            });
          }
          this.chatList = chatList;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getSessionCount() {
      let params = {
        sessionId: this.activatedSessionId
      };
      sessionCheckService.getSessionCount(
        params,
        data => {
          this.clientScore = data.content.qualityReview.member_score;
          this.score = data.content.qualityReview.manager_score;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    scoreOperate() {
      if (this.score === '') {
        this.$message({
          type: 'warning',
          message: '请选择质检分数'
        });
        return;
      }
      let params = {
        id: this.activatedSessionId,
        qualityReview: {
          manager_score: this.score
        }
      };
      sessionCheckService.score(
        params,
        data => {
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.refresh();
        },
        ErrorData => {
          this.dialogVisible = false;
          console.log(ErrorData);
        }
      );
    },
    search() {
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.cs-session-check {
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
}

.popup-content {
  .chat-record {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 500px;
    padding: 10px 5px;
    width: 100%;
    border: #f8f8f8 solid 1px;
    border-radius: 5px;
    margin: 10px;
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 5px;
      height: 12px;
    }
    &::-webkit-scrollbar-thumb {
      background: #c3c3c3;
      border-radius: 12px;
    }
  }
  .score {
    align-items: center;
    font-size: 14px;
    .title {
      margin: 0 20px 10px 20px;
    }
    .sel {
      margin: 0 20px;
    }
    .btn {
      margin: 0 20px;
    }
  }
}
</style>
