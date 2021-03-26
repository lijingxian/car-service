<template>
  <div class="wechat-list-mgmt">
    <biz-flex-table ref="table" v-loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :filters="filters"
      :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="name" label="微信公众号">
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tag size="mini" v-if="scope.row.isDefault==='true'">默认</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="qrCodePath" label="二维码">
        <template slot-scope="scope">
          <img :src="scope.row.qrCodePath" width="60">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="deleteRow(scope.row.id)" size="mini">解绑</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs v-model="tabName" :open="openPopup" @close="openPopup = false;">
      <el-tab-pane label="基本信息" name="baseinfo">
        <BaseInfo ref="baseinfo" :open="openPopup" :id="itemId" @created="refresh">
        </BaseInfo>
      </el-tab-pane>
      <el-tab-pane label="菜单配置" name="menusetting" v-if="isCreated">
        <MenuSetting ref="menusetting" :open="openPopup" :id="itemId" @created="refresh">
        </MenuSetting>
      </el-tab-pane>
      <el-tab-pane label="关注回复" name="focusreplay">
        <FocusReplay ref="focusreplay" :open="openPopup" :id="itemId" @created="refresh">
        </FocusReplay>
      </el-tab-pane>
      <el-tab-pane label="消息回复" name="nessagereplay" v-if="isCreated">
        <MessageReplay ref="nessagereplay" :open="openPopup" :id="itemId" @created="refresh">
        </MessageReplay>
      </el-tab-pane>
      <el-tab-pane label="关键词回复" name="keywordreplay" v-if="isCreated">
        <KeywordReplay ref="keywordreplay" :open="openPopup" :id="itemId" @created="refresh">
        </KeywordReplay>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { systemSetting } from '@/common/urls';
import http from '@/common/http';
import BaseInfo from './wechat/BaseInfo';
import MenuSetting from './wechat/MenuSetting';
import FocusReplay from './wechat/FocusReplay';
import MessageReplay from './wechat/MessageReplay';
import KeywordReplay from './wechat/KeywordReplay';
export default {
  name: 'WechatUrlMgmt',
  data() {
    return {
      loading: false,
      openPopup: false,
      isCreated: false,
      itemId: '',
      tabName: 'baseinfo',
      multipleSelection: [],
      filters: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '解绑',
          name: 'deleteList',
          type: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizFlexTable,
    BaseInfo,
    BizPopupTabs,
    MenuSetting,
    FocusReplay,
    MessageReplay,
    KeywordReplay
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.openPopup = false;
      this.itemId = '';
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(systemSetting.getWechatMenu, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    deleteList() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      this.delete(ids);
    },
    // 快捷操作-删除
    deleteRow(id) {
      let ids = [];
      ids.push(id);
      this.delete(ids);
    },
    // 删除
    delete(ids) {
      this.$confirm(
        '修改公众号会导致已关注该公众号的用户无法登录及接收您的消息，建议您点击新建公众号并在用户关注新公众号后删除旧的公众号，确定要继续解绑吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let params = {
            ids: ids
          };
          http
            .delete(systemSetting.getWechatMenu, params)
            .then(data => {
              this.$message.success('解绑成功');
              this.getList();
            })
            .catch(ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            });
        })
        .catch(() => {});
    },
    // 添加推荐
    add() {
      this.itemId = '';
      this.tabName = 'baseinfo';
      this.openPopup = true;
      this.isCreated = false;
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
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
      this.openPopup = true;
      this.isCreated = true;
      this.$nextTick(() => {
        this.itemId = row.id;
      });
    },
    closePopup() {
      this.openPopup = false;
      this.itemId = '';
    },
    addSuccess(id) {
      this.itemId = id;
    }
  }
};
</script>

<style lang="scss">
.wechat-list-mgmt {
  .biz-popup .popup-content {
    width: 750px;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
