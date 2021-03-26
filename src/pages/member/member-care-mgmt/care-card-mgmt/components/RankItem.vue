<template>
  <biz-grid class="rank-item">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form size="small">
      <el-form-item>
        <el-radio-group v-model="rankData.target" @change="onTypeChange">
          <el-radio label="0">所有会员</el-radio>
          <el-radio label="1">指定等级会员</el-radio>
          <el-radio label="2">指定会员</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div v-if="rankData.target==='0'">
      <span>已选中会员{{total}}人</span>
    </div>
    <div v-else-if="rankData.target==='1'">
      <el-button type="primary" class="btn-style" @click="selectRank" size="mini">选择</el-button>
      <span>已选中会员{{rankTotal}}人</span>
      <div v-for="item in selVips" :key="item.name">{{item.name + ' (' + item.curSel + ')'}}</div>
    </div>
    <div v-else>
      <el-button type="primary" @click="showPeoplePicker" class="btn-style" size="mini">选择</el-button>
      <span>已选中会员{{rankData.members.length}}人</span>
      <div :class="isShow?'nick-name-container-show':'nick-name-container'">
        <div v-for="item in rankData.members" :key="item.id" class="nick-name-title">{{item.name||item.nickname}}</div>
      </div>
      <div class="color" v-if="rankData.members.length>6" @click="view">查看全部</div>
    </div>
    <biz-dialog-selector title="选择会员" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :loading="dialogLoading" :tableData="dialogTableDataHandle" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange" @selectionChange="selectionChange"
      class="rank-dialog-selector" @cascaderChange="cascaderChange">
      <el-table-column prop="name" label="会员信息" width="200">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="@/assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
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
      <el-table-column prop="enableState" label="状态" :formatter="getStatus">
      </el-table-column>
      <el-table-column prop="shop.name" label="所属店铺">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shopTags" label="会员标签" width="210">
        <template slot-scope="scope">
          <div>
            <div class="platform-tags" v-for="(item, index) in scope.row.shopTags" :key="index">{{item.name}}</div>
          </div>
        </template>
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
        <el-button size="mini" @click="showRankDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleRankConfirmed">确认选择</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';
import ActivityNotificationService from '@/service/motorists-club-activity/ActivityNotification';
import http from '@/common/http';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import { systemSetting } from '@/common/urls';
import BizSaveButton from '@/components/BizSaveButton';
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
  name: 'rank-item',
  data() {
    return {
      selectedRankList: [],
      memberRankList: [],
      total: 0,
      rankTotal: 0,
      selVips: [],
      selectionList: [],
      showDialog: false,
      showRankDialog: false,
      dialogLoading: true,
      isShow: false,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'cascader',
          label: '会员标签',
          name: 'memberTag',
          changeOnSelect: false,
          filterable: false,
          value: [''],
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:member.memberCare.care.edit']
        }
      ],
      curTagName: ''
    };
  },
  props: {
    rankData: {
      type: Object,
      default() {
        return {
          target: '0',
          members: [],
          memberRanks: []
        };
      }
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  watch: {
    showRankDialog(newVal) {
      if (newVal) {
        this.selectedRankList = this.rankData.memberRanks.concat();
      }
    }
  },
  components: {
    BizDialogSelector,
    BizSaveButton,
    BizGrid
  },
  computed: {
    ...mapGetters(['getUser']),
    dialogTableDataHandle() {
      let tabelDate = this.dialogTableData;
      tabelDate.forEach(element => {
        if (element.shopTags) {
          element.shopTagsNew = [];
          element.shopTags.forEach((item, index) => {
            if (index < 3) {
              if (element.shopTags.length > 1) {
                element.shopTagsNew.push(item + '、');
              } else {
                element.shopTagsNew.push(item);
              }
            }
          });
        }
      });
      return tabelDate;
    },
    selectionKeys() {
      let list = [];
      for (const iterator of this.rankData.members) {
        list.push(iterator.id);
      }
      return list;
    },
    vipRankList() {
      let ary = [];
      this.memberRankList.forEach(item => {
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.ranks = [];
        if (item.ranks && item.ranks.length) {
          item.ranks.forEach(element => {
            let rankItem = {};
            rankItem.id = element.id;
            rankItem.name = element.name;
            rankItem.checked = element.checked;
            obj.ranks.push(rankItem);
          });
        }
        ary.push(obj);
      });
      let memberRankList = ary;

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          vip.checked = false;
        }
      }

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          for (const iterator of this.selectedRankList) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    }
  },
  methods: {
    view() {
      this.isShow = true;
    },
    clearData() {
      let memberRankList;
      switch (this.rankData.target) {
        case '0':
          memberRankList = this.memberRankList;
          for (const memberRank of memberRankList) {
            for (const vip of memberRank.ranks) {
              vip.checked = false;
            }
          }
          this.rankTotal = 0;
          this.selVips = [];
          this.rankData.members = [];
          this.rankData.memberRanks = [];
          break;
        case '1':
          this.total = 0;
          this.rankData.members = [];
          break;
        case '2':
          memberRankList = this.memberRankList;
          for (const memberRank of memberRankList) {
            for (const vip of memberRank.ranks) {
              vip.checked = false;
            }
          }
          this.total = 0;
          this.rankTotal = 0;
          this.selVips = [];
          this.rankData.memberRanks = [];
          break;
        default:
          break;
      }
    },
    operate(name) {
      this[name]();
    },
    save() {
      http
        .put('/admin/memberCare/manage/memberCareObject.jhtml', this.rankData)
        .then(data => {
          this.$message.success('操作成功');
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
            console.log(error.errorMessage);
          }
        });
    },
    onTypeChange(val) {
      if (val === '0') {
        this.getVipCount();
      }
    },
    // 获取会员等级
    getMemberRankList() {
      const params = {
        shopId: (this.getUser.shop && this.getUser.shop.id) || window.top.SHOP_ID || ''
      };
      http
        .get('/admin/memberRank/templateAndRanks.jhtml', params)
        .then(data => {
          this.memberRankList = data.templates;
        })
        .catch();
    },
    getVipCount(ary) {
      let param = {
        shopId: '',
        memberRankIds: null
      };
      if (this.rankData.target === '0') {
        param.shopId = this.getUser.shop.id;
      } else if (this.rankData.target === '1') {
        if (!ary || !ary.length) {
          return;
        }
        param.memberRankIds = ary.toString();
      }
      http
        .get('admin/member/count.jhtml', param)
        .then(data => {
          if (this.rankData.target === '0') {
            this.total = data.total;
          } else if (this.rankData.target === '1') {
            this.rankTotal = data.total;
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    showPeoplePicker() {
      this.selectionList = [];
      this.dialogFilters[1].value = '';
      this.showDialog = true;
      this.queryPeople();
    },
    selectRank() {
      this.showRankDialog = true;
    },
    cascaderChange(val) {
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
            this.queryPeople();
          })
          .catch(error => {
            if (error.errorMessage !== '店铺不存在') {
              this.$message.warning(error.errorMessage);
            }
          })
          .finally(() => {});
      } else {
        this.queryPeople();
      }
    },
    queryPeople() {
      this.dialogLoading = true;

      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[1].value,
        tag: this.curTagName
      };

      ActivityNotificationService.queryPeople(
        params,
        data => {
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
          this.dialogLoading = false;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
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
      if (this.rankData.members && this.rankData.members.length) {
        list.forEach(item => {
          if (!this.containsItem(this.rankData.members, item.id)) {
            this.rankData.members.push(item);
          }
        });
      } else {
        this.rankData.members = this.rankData.members.concat(list);
      }
      this.rankData.members = this.rankData.members.filter(item => {
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
    dialogFilterDataChange() {
      this.dialogPagination.currentPage = 1;
      this.queryPeople();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryPeople();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryPeople();
    },
    handleRankConfirmed(selectionKeys, selections) {
      if (!this.selectedRankList.length) {
        this.$message({
          showClose: true,
          message: '请选择等级',
          type: 'warning'
        });
        return;
      }
      this.showRankDialog = false;
      this.memberRankHandle();
    },
    memberRankHandle() {
      let ary;
      this.selVipList();
      this.rankData.memberRanks = this.selectedRankList.concat();
      ary = this.selectedRankList.map(item => {
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
    vipChange(val) {
      if (val.checked) {
        this.selectedRankList.forEach((element, index) => {
          if (element.id === val.id) {
            this.selectedRankList.splice(index, 1);
          }
        });
      } else {
        this.selectedRankList.push({ id: val.id });
      }
    },
    getTagClassList() {
      let param = {
        categoryType: '会员标签',
        shopId: window.top.SHOP_ID || '',
        isIncludeTag: '1'
      };

      http
        .get(systemSetting.storeTagcategories, param)
        .then(data => {
          let ary = data.content;
          let options = [
            {
              label: '全部',
              value: ''
            }
          ];
          options = options.concat(getOption(ary));
          this.dialogFilters[0].options = options;
          this.dialogFilters[0].value = [''];
        })
        .catch(error => {
          if (error.errorMessage !== '店铺不存在') {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    }
  },
  created() {
    this.getMemberRankList();
    this.getVipCount();
    this.getTagClassList();
  }
};
</script>

<style lang="scss">
.rank-dialog-selector {
  .el-dialog {
    width: 80%;
  }
  .el-dialog__header {
    text-align: center;
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
.rank-item {
  font-size: 12px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .platform-tags {
    display: block;
    float: left;
  }
  .show-more {
    color: coral;
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
