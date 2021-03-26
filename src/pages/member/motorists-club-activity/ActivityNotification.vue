<template>
  <biz-grid class="motorists-club-activity__activity-notification" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :model="formModel" :rules="rules" size="small" label-width="110px">
      <el-form-item label="发送给" prop="noticeTarget">
        <el-radio-group v-model="formModel.noticeTarget" @change="onTypeChange">
          <el-radio label="ToStore">所有会员</el-radio>
          <el-radio label="ToMemberrank">指定等级会员</el-radio>
          <el-radio label="ToMember">指定会员</el-radio>
        </el-radio-group>
        <div v-if="formModel.noticeTarget==='ToStore'">
          <span>已选中会员{{total}}人</span>
        </div>
        <div v-else-if="formModel.noticeTarget==='ToMemberrank'">
          <el-button type="primary" class="btn-style" @click="selectRank">选择</el-button>
          <span>已选中会员{{rankTotal}}人</span>
          <div v-for="item in selVips" :key="item.name">{{item.name + ' (' + item.curSel + ')'}}</div>
        </div>
        <div v-else>
          <el-button type="primary" @click="showPeoplePicker" class="btn-style">选择</el-button>
          <span>已选中会员{{formModel.noticeMembers.length}}人</span>
          <div :class="isShow?'nick-name-container-show':'nick-name-container'">
            <div v-for="item in formModel.noticeMembers" :key="item.id" class="nick-name-title">{{item.name||item.nickname}}</div>
          </div>
          <div class="color" v-if="formModel.noticeMembers.length>6&&!isShow" @click="view">查看全部</div>
        </div>
      </el-form-item>
      <el-form-item label="通知方式" prop="notifyType">
        <div>
          <div v-popover:codePop>
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <span>输入框内支持自定义编辑</span>
          </div>
          <el-popover ref="codePop" placement="right-end" width="300" trigger="hover">
            <div>
              <p>APP通知，发送后安装了V服爱车APP且登录的会员将在APP收到此消息</p>
              <p>微信通知，发送后关注了微信公众号且登录的会员将在微信上收到此消息</p>
              <p>短信通知，发送后将通过短信通知到会员</p>
              <p>注意：用户没有登录APP/没有关注公众号/关注公众号但没有登录将存在收不到消息的情况。消息发送后可能因为运营商原因存在延迟收到的情况，请知悉</p>
            </div>
          </el-popover>
        </div>
        <div class="notify-type">
          <div class="item">
            <el-checkbox v-model="formModel.isAppNotice">App消息</el-checkbox>
            <div class="preview-content" v-show="formModel.isAppNotice">
              <el-input v-model="formModel.content" placeholder="请输入通知内容，不超过100字符" type="textarea" :maxlength="100"></el-input>
            </div>
          </div>
          <div class="item">
            <el-checkbox v-model="formModel.isWechatNotice">微信消息</el-checkbox>
            <div class="preview-content" v-show="formModel.isWechatNotice">
              <el-input type="textarea" v-model="formModel.wechatTitle" :rows="1" :maxlength="100" placeholder="请输入通知内容，不超过100字符"></el-input>
              <div>活动名：
                <span class="custom-c">{{formModel.fleetActivity.title}}</span>
              </div>
              <div>报名人数：限额{{formModel.fleetActivity.limitNumber}}人</div>
              <el-input type="textarea" v-model="formModel.wechatRemark" placeholder="请输入通知内容，不超过100字符" :maxlength="100"></el-input>
            </div>
          </div>
          <div class="item">
            <el-checkbox v-model="formModel.isSmsNotice">短信消息</el-checkbox>
            <div class="preview-content" v-show="formModel.isSmsNotice">
              【V服平台】亲爱的会员，为感恩长期以来大家对
              <span class="custom-c">{{formModel.fleetActivity.fleet.name}}</span>
              的支持，本车友会将举办
              <span class="custom-c">{{formModel.fleetActivity.title}}</span>
              活动，活动地址
              <span class="custom-c">{{formModel.fleetActivity.address}}</span>
              ，名额有限。退订回N
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <biz-dialog-selector slot="float" title="选择会员" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @open="opened" @operate="dialogOperate" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange" @selectionChange="selectionChange">
      <el-table-column prop="name" label="用户名">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期">
      </el-table-column>
      <el-table-column prop="enableState" label="状态" :formatter="getStatus">
      </el-table-column>
      <el-table-column label="店铺名称">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginIp" label="最后登录地址">
      </el-table-column>
      <el-table-column prop="lastLoginDate" label="最后登录时间">
      </el-table-column>
    </biz-dialog-selector>
    <el-dialog title="选择等级" :visible.sync="showRankDialog" :appendToBody="true" center custom-class="rank-dialog">
      <div class="content">
        <div class="memberRank" v-for="memberRank of vipRankList" :key="memberRank.id">
          <div class="vip-name">{{memberRank.name}}</div>
          <div class="vip-container">
            <div class="vip" v-for="rank of memberRank.ranks" :key="rank.id">
              <el-checkbox :value="rank.checked" @change="vipChange(rank)">{{rank.name}}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRankDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRankConfirmed">确认选择</el-button>
      </span>
    </el-dialog>
    <el-dialog title="通知结果" :visible.sync="showResultDialog" :appendToBody="true" custom-class="promotion-dialog" center>
      <div>共通知会员{{memberCount}}位，其中送达App{{appCount}}位，送达微信{{wechatCount}}位，送达短信{{smsCount}}位，可能因为运营商原因存在延迟收到的情况，请勿重复发送。</div>
      <div class="container">
        <biz-flex-table :pagination="dialogResultPagination" :tableData="sendResultList" :loading="resultLoading" :checkable="false"
          @size-change="dialogResultPageSizeChange" @current-change="dialogResultCurrentPageChange" class="tabel-style">
          <el-table-column prop="type" label="通知方式">
          </el-table-column>
          <el-table-column prop="member" label="通知对象">
          </el-table-column>
          <el-table-column prop="result" label="结果">
          </el-table-column>
        </biz-flex-table>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import ActivityNotificationService from '@/service/motorists-club-activity/ActivityNotification';
import { mapGetters } from 'vuex';
import { BizFlexTable } from '@/components/BizTable';

export default {
  name: 'ActivityNotification',
  components: {
    BizSaveButton,
    BizDialogSelector,
    BizGrid,
    BizFlexTable
  },
  data() {
    return {
      selectionList: [],
      total: 0,
      rankTotal: 0,
      showResultDialog: false,
      resultLoading: false,
      isShow: false,
      selVips: [],
      sendResultList: [],
      allResultList: [],
      showRankDialog: false,
      loading: false,
      vipList: [],
      showDialog: false,
      formModel: this.getDefaultModel(),
      memberRankList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        },
        {
          label: '发送',
          name: 'publish',
          type: 'primary'
        }
      ],
      dialogResultPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      rules: {
        isNeedNotice: [{ required: true, message: '请选择是否通知', trigger: 'blur' }],
        content: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.isNeedNotice === '0' || this.formModel.content) {
                callback();
              } else {
                callback(new Error('请输入通知内容'));
              }
            }
          }
        ],
        noticeTarget: [{ required: true, message: '请选择发送对象', trigger: 'blur' }],
        notifyType: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, rules, callback) => {
              if (this.formModel.isAppNotice || this.formModel.isWechatNotice || this.formModel.isSmsNotice) {
                callback();
              } else {
                callback(new Error('请选择通知方式'));
              }
            }
          }
        ],
        notifyVipList: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.formModel.noticeTarget === 'ToMemberrank' && value.length === 0) {
                callback(new Error('请选择发送对象'));
              } else {
                callback();
              }
            }
          }
        ],
        selectionKeys: [
          {
            validator: (rule, value, callback) => {
              if (this.formModel.noticeTarget === 'ToMember' && value.length === 0) {
                callback(new Error('请选择发送对象'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      dialogLoading: true,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  props: {
    cardId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    selectionKeys() {
      let list = [];
      for (const iterator of this.formModel.noticeMembers) {
        list.push(iterator.id);
      }
      return list;
    },
    memberCount() {
      let count = Math.max(this.appCount, this.wechatCount, this.smsCount);
      return count;
    },
    appCount() {
      let count = 0;
      this.allResultList.forEach(item => {
        if (item.type === 'App通知') {
          count++;
        }
      });
      return count;
    },
    wechatCount() {
      let count = 0;
      this.allResultList.forEach(item => {
        if (item.type === '微信通知') {
          count++;
        }
      });
      return count;
    },
    smsCount() {
      let count = 0;
      this.allResultList.forEach(item => {
        if (item.type === '短信通知') {
          count++;
        }
      });
      return count;
    },
    vipRankList() {
      let memberRankList = this.memberRankList;

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          vip.checked = false;
        }
      }

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          for (const iterator of this.formModel.noticeMemberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }
      return memberRankList;
    }
  },
  created() {
    ActivityNotificationService.queryVIPList(
      {
        shopId: window.top.SHOP_ID
      },
      data => {
        this.vipList = data.memberRanks;
      },
      ErrorData => {
        console.log(ErrorData);
        console.log('code错误');
      }
    );
  },
  methods: {
    operate(name) {
      this[name]();
    },
    view() {
      this.isShow = true;
    },
    addTips() {
      let str;
      let str1;
      let showTip = false;
      if (this.formModel.isAppNotice) {
        str = this.formModel.content.replace(/ /g, '');
        if (!str.length) {
          this.$notify({
            title: '警告',
            message: '请输入通知内容',
            type: 'warning',
            duration: 1500
          });
          showTip = true;
        }
      }
      if (this.formModel.isWechatNotice) {
        str = this.formModel.wechatTitle.replace(/ /g, '');
        str1 = this.formModel.wechatRemark.replace(/ /g, '');
        if (!str.length || !str1.length) {
          this.$notify({
            title: '警告',
            message: '请输入通知内容',
            type: 'warning',
            duration: 1500
          });
          showTip = true;
        }
      }
      return showTip;
    },
    save(callback) {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          let noticeMembers = [];
          this.formModel.notifyVipList.forEach(element => {
            noticeMembers.push({ id: element });
          });
          let noticePersons = [];
          this.formModel.selectionKeys.forEach(element => {
            noticePersons.push({ id: element });
          });
          this.clearMemberData();
          if (this.addTips()) {
            return;
          }
          let params = {
            activityId: this.cardId.id,
            notice: {
              id: this.formModel.id,
              content: this.formModel.content,
              noticeTarget: this.formModel.noticeTarget,
              isNeedNotice: '1',
              noticeMemberRanks: this.formModel.noticeMemberRanks,
              noticeMembers: this.formModel.noticeMembers || [],
              isAppNotice: this.formModel.isAppNotice ? '1' : '0',
              isWechatNotice: this.formModel.isWechatNotice ? '1' : '0',
              isSmsNotice: this.formModel.isSmsNotice ? '1' : '0',
              wechatTitle: this.formModel.wechatTitle,
              wechatRemark: this.formModel.wechatRemark
            }
          };

          ActivityNotificationService.update(
            params,
            data => {
              if (callback && typeof callback === 'function') {
                callback();
              } else {
                this.$message.success('保存成功');
              }
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        } else {
          return false;
        }
      });
    },
    selectRank() {
      this.showRankDialog = true;
    },
    dialogResultPageSizeChange(val) {
      this.dialogResultPagination.pageSize = val;
      this.refreshCurTabel();
    },
    dialogResultCurrentPageChange(val) {
      this.dialogResultPagination.currentPage = val;
      this.refreshCurTabel();
    },
    refreshCurTabel() {
      this.sendResultList = [];
      let i = (this.dialogResultPagination.currentPage - 1) * this.dialogResultPagination.pageSize;
      let count = this.dialogResultPagination.currentPage * this.dialogResultPagination.pageSize - 1;
      for (i; i < count; i++) {
        if (this.allResultList[i]) {
          this.sendResultList.push(this.allResultList[i]);
        }
      }
    },
    vipChange(val) {
      if (val.checked) {
        this.formModel.noticeMemberRanks.forEach((element, index) => {
          if (element.id === val.id) {
            this.formModel.noticeMemberRanks.splice(index, 1);
          }
        });
      } else {
        this.formModel.noticeMemberRanks.push({ id: val.id });
      }
    },
    handleRankConfirmed(selectionKeys, selections) {
      let ary;
      this.showRankDialog = false;
      this.selVipList();
      ary = this.formModel.noticeMemberRanks.map(item => {
        return parseInt(item.id);
      });
      if (ary && ary.length) {
        this.getVipCount(ary);
      }
    },
    selVipList() {
      let curSel;
      this.selVips = [];
      this.vipRankList.forEach(item => {
        curSel = [];
        item.ranks.forEach(element => {
          if (element.checked) {
            curSel.push(element.name);
          }
        });
        if (curSel.length) {
          this.selVips.push({ name: item.name, curSel: curSel.join('、') });
        }
      });
    },
    publish() {
      this.save(() => {
        this.loading = true;
        ActivityNotificationService.publish(
          {
            activityId: this.cardId.id
          },
          data => {
            this.loading = false;
            this.$message.success('发送成功');
            this.allResultList = data.resultData;
            this.dialogResultPagination.currentPage = 1;
            this.dialogResultPagination.pageSize = 20;
            this.refreshCurTabel();
            this.dialogResultPagination.total = this.allResultList.length;
            this.showResultDialog = true;
            let tabelData = this.allResultList;
            this.operations[1].label = '再次发送';
            tabelData.forEach(item => {
              item.result = '已经发送';
              switch (item.type) {
                case '0':
                  item.type = 'App通知';
                  break;
                case '1':
                  item.type = '短信通知';
                  break;
                case '2':
                  item.type = '微信通知';
                  break;
                default:
                  break;
              }
            });
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage || '操作出现错误');
          }
        );
      });
    },
    getDefaultModel() {
      return {
        wechatTitle: '',
        wechatRemark: '',
        id: '',
        content: '',
        noticeTarget: 'ToStore',
        isNeedNotice: '0',
        isWechatNotice: false,
        isAppNotice: false,
        isSmsNotice: false,
        notifyType: ['0'],
        notifyVipList: [],
        notifyMemberList: [],
        selectionKeys: [],
        noticeMembers: [],
        noticeMemberRanks: [],
        fleetActivity: {
          fleet: {}
        }
      };
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    showPeoplePicker(e) {
      this.dialogFilters[0].value = '';
      this.showDialog = true;
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    handleConfirmed(selectionKeys, selections) {
      let list = [];
      for (const iterator of selectionKeys) {
        this.selectionList.forEach(item => {
          if (item.id === iterator) {
            list.push({
              id: iterator,
              name: item.name,
              nickName: item.nickName
            });
          }
        });
      }
      if (this.formModel.noticeMembers.length) {
        list.forEach(item => {
          if (!this.containsItem(this.formModel.noticeMembers, item.id)) {
            this.formModel.noticeMembers.push(item);
          }
        });
      } else {
        this.formModel.noticeMembers = this.formModel.noticeMembers.concat(list);
      }
      this.formModel.noticeMembers = this.formModel.noticeMembers.filter(item => {
        return this.containsItem(selectionKeys, item.id);
      });
    },
    containsItem(ary, id) {
      let contain = false;
      ary.forEach(item => {
        if (item.id) {
          if (item.id === id) {
            contain = true;
            return false;
          }
        } else {
          if (item === id) {
            contain = true;
            return false;
          }
        }
      });
      return contain;
    },
    queryPeople(params) {
      this.dialogLoading = true;

      ActivityNotificationService.queryPeople(
        params,
        data => {
          this.dialogTableData = data.content;
          this.$set(this.dialogPagination, 'total', parseInt(data.total));
          this.dialogLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
    },
    opened() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogOperate(name) {},
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryPeople(this.getDialogQueryParams());
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }

      return '';
    },
    clearMemberData() {
      let memberRankList;
      switch (this.formModel.noticeTarget) {
        case 'ToStore':
          memberRankList = this.memberRankList;
          for (const memberRank of memberRankList) {
            for (const vip of memberRank.ranks) {
              vip.checked = false;
            }
          }
          this.rankTotal = 0;
          this.selVips = [];
          this.formModel.noticeMembers = [];
          this.formModel.noticeMemberRanks = [];
          break;
        case 'ToMemberrank':
          this.total = 0;
          this.formModel.noticeMembers = [];
          break;
        case 'ToMember':
          memberRankList = this.memberRankList;
          for (const memberRank of memberRankList) {
            for (const vip of memberRank.ranks) {
              vip.checked = false;
            }
          }
          this.total = 0;
          this.rankTotal = 0;
          this.selVips = [];
          this.formModel.noticeMemberRanks = [];
          break;
        default:
          break;
      }
    },
    onTypeChange(val) {
      if (val === 'ToStore') {
        this.getVipCount();
      }
    },
    getVipCount(ary) {
      let param = {
        shopId: '',
        memberRankIds: null
      };
      if (this.formModel.noticeTarget === 'ToStore') {
        param.shopId = this.getUser.shop.id;
      } else if (this.formModel.noticeTarget === 'ToMemberrank') {
        if (!ary || !ary.length) {
          return;
        }
        param.memberRankIds = ary.toString();
      }
      http
        .get('admin/member/count.jhtml', param)
        .then(data => {
          console.log(data);
          if (this.formModel.noticeTarget === 'ToStore') {
            this.total = data.total;
          } else if (this.formModel.noticeTarget === 'ToMemberrank') {
            this.rankTotal = data.total;
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    }
  },
  watch: {
    cardId(nVal, oVal) {
      this.$refs.form.resetFields();

      if (nVal.id) {
        ActivityNotificationService.query(
          {
            activityId: nVal.id
          },
          data => {
            let obj = Object.assign(this.getDefaultModel(), data.data);
            obj.notifyVipList = [];
            if (obj.noticeMemberRanks) {
              obj.noticeMemberRanks.forEach(element => {
                obj.notifyVipList.push(element.id);
              });
            }

            obj.notifyType = [];
            if (obj.isAppNotice === '1') obj.notifyType.push('0');
            if (obj.isWechatNotice === '1') obj.notifyType.push('1');
            if (obj.isSmsNotice === '1') obj.notifyType.push('2');
            // 默认选中第一个
            if (obj.notifyType.length === 0) obj.notifyType.push('0');

            obj.selectionKeys = [];
            if (obj.noticeMembers && obj.noticeMembers.length > 0) {
              obj.noticeMembers.forEach(element => {
                obj.selectionKeys.push(element.id);
              });
            }

            obj.fleetActivity = Object.assign(this.getDefaultModel().fleetActivity, data.fleetActivity);

            this.formModel = obj;
            this.formModel.noticeMemberRanks = obj.noticeMemberRanks || [];
            this.formModel.noticeMembers = obj.noticeMembers || [];
            this.formModel.isAppNotice = obj.isAppNotice === '1';
            this.formModel.isWechatNotice = obj.isWechatNotice === '1';
            this.formModel.isSmsNotice = obj.isSmsNotice === '1';
            this.formModel.content = data.data.content
              ? data.data.content
              : this.formModel.fleetActivity.fleet.name + '发布了' + this.formModel.fleetActivity.title + '，快去报名吧！';
            this.formModel.wechatTitle = data.data.wechatTitle ? data.data.wechatTitle : '您关注的店铺发布了新活动';
            this.formModel.wechatRemark = data.data.wechatRemark
              ? data.data.wechatRemark
              : '您可以到V服爱车的近期活动/最新促销查看并参加。';
            this.memberRankList = data.memberRankList;
            this.selVipList();
            let ary = this.formModel.noticeMemberRanks.map(item => {
              return parseInt(item.id);
            });
            this.getVipCount(ary);
            this.operations[1].label = data.data.isNoticed === '1' ? '再次发送' : '发送';
            if (JSON.stringify(data.data) === '{}') {
              this.formModel.noticeTarget = 'ToMember';
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  }
};
</script>

<style lang="scss">
.promotion-dialog {
  width: 800px;
  height: 80%;
  padding: 20px;
  .biz-grid {
    top: 45px;
    height: 85%;
  }
  > .el-dialog__body {
    width: 100%;
    height: 98%;
    position: relative;
    flex-grow: 1;
    padding: 0;
  }
  .container {
    padding: 20px;
    margin: 20px;
    width: 100%;
    height: 100%;
  }
  .el-dialog__header {
    text-align: center;
  }
  .el-pagination {
    margin: 10px 0;
  }
  .dialog-footer {
    display: none;
  }
}
.rank-dialog {
  .content {
    min-height: 300px;
    height: 500px;
    overflow-y: auto;
    .vip-name {
      margin: 10px 0;
    }
    .vip-container {
      display: flex;
      flex-wrap: wrap;
      .vip {
        min-width: 110px;
        padding: 0 20px;
      }
    }
  }
  .el-dialog__footer {
    text-align: right;
  }
}
.motorists-club-activity__activity-notification {
  padding: 20px;
  .biz-save-button {
    float: left;
  }
  .template-select {
    margin-bottom: 5px;
  }
  .el-radio + .el-radio {
    margin-left: 15px;
  }

  .motorists-club-activity__activity-notification__notice-target {
    .el-checkbox {
      margin-right: 30px;

      & + .el-checkbox {
        margin-left: 0;
      }
    }
  }

  p {
    word-break: break-all;
  }
  .preview-content {
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    padding: 5px;
    line-height: 1.5;
    color: #c0c4cc;
    .custom-c {
      color: #606266;
    }
  }
  .nick-name-container {
    max-height: 60px;
    overflow: hidden;
    .nick-name-title {
      float: left;
      width: 100px;
      margin-right: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .color {
    color: #ff7300;
    cursor: pointer;
  }
  .nick-name-container-show {
    .nick-name-title {
      float: left;
      width: 100px;
      margin-right: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .btn-style {
    margin-right: 10px;
  }
}
</style>
