<template>
  <biz-grid class="member-card-template-list" v-loading="loading">
    <div slot="top">
      <div class="member-mgmt-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange" v-if="isEdit">
        </biz-header>
        <biz-header :filters="filters" @filterDataChange="filterDataChange" v-if="!isEdit">
        </biz-header>
      </div>
    </div>
    <div class="content">
      <div class="promise-list-card">
        <a class="promise-item" v-for="(item, index) in cardList" :key="index" @click="handleClick(item, $event)">
          <div class="center-content">
            <div class="title-class">
              <span class="title-name">{{item.name}} </span><span class="font" v-if="item.isDefault==='1'">默认</span>
            </div>
            <el-switch v-if="item.unionConfig.editable === '1' && isEdit || getUser.roleLevel !== 'shop'" v-model="item.state"
               active-color="#87d068" inactive-color="#d9d9d9" active-value="1" inactive-value="0" :active-text="item.state==='1'?'已打开':'已关闭'"
              @change="stateChange(item)"></el-switch>
          </div>
          <div class="content">
            <div class="shop-name">{{item.shop.name}}</div>
          </div>
          <div class="content">
            <div class="count" :title="item.description">{{item.description}}</div>
          </div>
          <div class="contenttext">
            有效期：{{item.beginDate.split(' ')[0]}}——{{item.endDate.split(' ')[0]}}
          </div>
          <!-- <img :src="item.icon" /> -->
          <div class="close" v-if="item.unionConfig.editable === '1' && hasAuthDel  || getUser.roleLevel !== 'shop'"
            @click.stop="handleClose(item, $event)">
            <i class="el-icon-close"></i>
          </div>
        </a>
        <div v-if="cardList.length === 0" :style="styleObject"></div>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="基本信息" name="first">
          <base-info ref="baseInfo" :itemId="itemId" @operationSuccess="operationSuccess" :isEdit="flag">
          </base-info>
        </el-tab-pane>
        <el-tab-pane label="等级" name="second" v-if="show">
          <member-card-grade-info ref="gradeInfo" :itemId="itemId" @operationSuccess="operationSuccess" :isEdit="flag">
          </member-card-grade-info>
        </el-tab-pane>
        <el-tab-pane label="奖励设置" name="third" v-if="show">
          <member-awards ref="awardsInfo" :itemId="itemId" @operationSuccess="operationSuccess" :isEdit="flag">
          </member-awards>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openSetting" @close="openSetting=false" v-model="settingName">
        <el-tab-pane label="通用奖励设置" name="setting">
          <general-awards-setting ref="generalAwardsInfo" @closeSettingTab="closeSettingTab" @operationSuccess="operationSuccess">
          </general-awards-setting>
        </el-tab-pane>
    </biz-popup-tabs>
    </div>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import http from '@/common/http';
import NoContent from '@/assets/images/emptyGray.png';
import BaseInfo from './BaseInfo';
import MemberAwards from './MemberAwards';
import GeneralAwardsSetting from './GeneralAwardsSetting';
import MemberCardGradeInfo from './MemberCardGradeInfo';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import { membershipMgmt as membership, global } from '@/common/urls';
import { mapGetters } from 'vuex';
export default {
  name: 'MemebrCardList',
  data() {
    return {
      loading: false,
      memberInfo: false,
      isEdit: true,
      show: true,
      flag: true,
      itemId: { id: '' },
      height: '100%',
      isCreated: false,
      dialogTableVisible: false,
      openSetting: false,
      settingName: 'setting',
      popupTabName: 'first',
      memberName: 'memberInfo',
      openPopup: false,
      editShopIds: [],
      cardList: [],
      multipleSelection: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary',
          auth: ['admin:memberCardTemplate.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '通用奖励设置',
          name: 'setting',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '所属店铺',
          name: 'shopName',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '0',
              label: '停用'
            },
            {
              value: '1',
              label: '启用'
            }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入会员卡名称',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizHeader,
    BizPagination,
    BizPopupTabs,
    BaseInfo,
    MemberAwards,
    MemberCardGradeInfo,
    GeneralAwardsSetting
  },
  created() {
    this.getList();
    this.listAuthority();
    this.queryShopList();
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:memberCardTemplate.delete');
    },
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 20% no-repeat'
      };
    }
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    closeSettingTab() {
      this.openSetting = false;
    },
    refresh() {
      this.getList();
    },
    setting() {
      this.$refs.generalAwardsInfo.getList();
      this.openSetting = true;
    },
    operationSuccess(id) {
      this.getList();
      this.show = true;
      this.$nextTick(function() {
        if (id) this.itemId = { id: id };
      });
    },
    create() {
      this.show = false;
      this.flag = true;
      this.popupTabName = 'first';
      this.itemId = { id: '' };
      this.openPopup = true;
    },
    queryShopList() {
      http
        .get(membership.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '6'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[0], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    stateChange(row) {
      this.loading = true;
      service.updateTemplate(
        {
          id: row.id || '',
          name: row.name,
          description: row.description,
          beginDate: row.beginDate,
          endDate: row.endDate,
          state: row.state,
          isDefault: row.isDefault,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.$message.success('操作成功');
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    },
    listAuthority() {
      service.listAuthority(
        {},
        data => {
          if (data.authorities.indexOf('admin:memberCardTemplate.edit') > 0) {
            this.isEdit = true;
          } else {
            this.isEdit = false;
          }
          this.getEditableStores();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '6'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      let params = {
        state: this.filters[1].value,
        searchShopId: this.filters[0].value,
        searchValue: this.filters[2].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/memberCardTemplate/memberCardTemplates.jhtml', params)
        .then(data => {
          this.cardList = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          console.log('errdata: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleClick(row, event) {
      if (event.target.className === 'el-switch__core') {
        return false;
      }
      this.show = true;
      this.$nextTick(function() {
        if ((row.unionConfig.editable === '1' && this.isEdit) || this.getUser.roleLevel !== 'shop') {
          this.flag = true;
        } else {
          this.flag = false;
        }
        this.itemId = { id: String(row.id) };
        this.popupTabName = 'first';
        this.openPopup = true;
      });
    },
    handleClose(row) {
      let templateIds = [];
      templateIds.push(row.id);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        service.delTemplate(
          {
            templateIds: templateIds,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.$message.success('删除成功');
            this.getList();
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
            console.log('code错误');
          }
        );
      });
    },
    filterDataChange() {
      this.getList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    rowClick(val) {
      this.openPopup = true;
      this.$nextTick(function() {
        this.itemId = { id: String(val.id) };
      });
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.operations[2].disabled = false;
        this.operations[3].disabled = false;
      }
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.member-card-template-list {
  .biz-popup .popup-content {
    width: 600px;
  }
  .motorists-club-activity__kpi {
    top: 45px;
  }
  .biz-input {
    width: 260px;
  }
  $promise-list__item__close-size: 18px;
  .promise-list-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5px;
    padding-top: 20px;
    height: 100%;
    overflow: auto;
    .promise-item-disabled {
      background: #f2f2f2;
    }
    .promise-item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 20px 25px;
      width: 320px;
      height: 188px;
      text-align: center;
      border-radius: 6px;
      border: #fff solid 1px;
      cursor: pointer;

      box-shadow: #bbb 2px 2px 8px;

      img {
        display: block;
        height: 48px;
        width: 48px;
        // margin: 0 auto;
        border-radius: 50%;
        text-align: center;
      }
      .center-content {
        display: flex;
        justify-content: space-between;
        .title-class {
          text-align: left;
          font-size: 14px;
          color: #3b3b3b;
          display: flex;
          font-weight: bold;
          justify-content: space-between;
          .title-name {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .font {
            font-size: 12px;
            color: #aaa;
            font-weight: normal;
            margin: 2px 0px 0px 5px;
          }
          img {
            display: block;
            height: 28px;
            width: 28px;
            // margin: 0 auto;
            border-radius: 50%;
            text-align: center;
          }
        }

        .content {
          margin-left: 10px;
          text-align: left;
        }
      }
      .shop-name {
        font-size: 12px;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
      .count {
        font-size: 12px;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        max-height: 50px;
        text-align: left;
        font-weight: normal;
      }
      .count1 {
        font-size: 12px;
        color: #aaa;
        margin-top: 5px;
      }
      .contenttext {
        font-size: 12px;
        color: #aaa;
        display: flex;
        justify-content: space-between;
      }

      .close {
        position: absolute;
        display: none;
        right: 5px;
        top: 5px;
        width: $promise-list__item__close-size;
        height: $promise-list__item__close-size;
        border-radius: 50%;
        background: #333;
        color: #fff;
        font-size: $promise-list__item__close-size / 4 * 3;
        line-height: $promise-list__item__close-size;
        text-align: center;
        opacity: 0.7;
        z-index: 2;

        &:hover {
          opacity: 1;
        }
      }

      &:hover {
        .close {
          display: block;
        }

        border: #ff7300 solid 1px;
      }
    }
  }
  .customer-info {
    img {
      float: left;
      width: 48px;
      height: 48px;
    }

    .wrapper {
      margin-left: 56px;

      .gender {
        .iconfont {
          font-size: 12px;
        }

        .male {
          color: blue;
        }
        .female {
          color: #df537b;
        }
      }
    }
  }
}
</style>
