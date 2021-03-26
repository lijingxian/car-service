<template>
  <biz-grid class="reception-mgmt-leave-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :model="form" ref="form" label-width="125px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item prop="isAutoLeave">
        <template slot="label">
          自动离店
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" style="width: 300px;">选中自动离店，则客户离店时道闸自动开启</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <el-radio-group v-model="form.isAutoLeave" @change="isAutoLeaveChange">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="放行人员" prop="plateNumber">
        <el-input v-model="releaseAdmin" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">放行备注</span>
        <div class="item-content">
          <div class="tag-list">
            <div class="tag-group">
              <!-- <el-tag v-for="(tag ,index) of tags" :key="index" closable size="mini" @close="removeMarketTag(tag.id)">
                {{ tag.name }}</el-tag> -->
              <el-input type="textarea" v-model="remarks"></el-input>
            </div>
            <div class="toggle-btn" @click="showMarketRecommend = !showMarketRecommend">
              <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showMarketRecommend }"></div>
              {{ toggleMarketRecommendTxt }}
            </div>
            <div class="recommend-group" v-show="showMarketRecommend">
              <el-tag v-for="tag of recommendMarketTags.slice(0,10)" :key="tag.id" type="info" size="mini"
                @click="addRecommendMarketTag(tag)">{{ tag.name }}</el-tag>
              <el-tag v-show="recommendMarketTags&&recommendMarketTags.length > 10" type="info" size="mini"
                @click="dialogVisibility=true" style="background-color: white;border:none;">更多<i
                  class="el-icon-d-arrow-right"></i></el-tag>
              <span v-show="recommendMarketTags&&!recommendMarketTags.length" style="color: #bbbbbb;">暂无推荐</span>
            </div>
          </div>
          <!-- <div class="add-tag">
            <el-input v-model="newMarketTagName" :maxlength="18" placeholder="请输入自定义标签"></el-input>
            <el-button @click="addRecommendMarketTagByButton" type="primary">添加</el-button>
          </div> -->
        </div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'ReceptionMgmtLeaveInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      loading: false,
      id: '',
      releaseAdmin: '',
      remarks: '',
      operations: [{ label: '保存', name: 'save', type: 'primary', auth: ['admin:reception.edit'] }],
      form: this.resetForm(),
      // 营销标签
      tags: [],
      newMarketTagName: '',
      recommendMarketTags: [],
      showMarketRecommend: false,
      tagGroup: [],
      showRecommend: false,
      recommendTagGroup: [],
      // 营销标签Id，用于上传
      recommendMarketTagId: '',
      newTagName: ''
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  computed: {
    ...mapGetters(['getUser']),
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起推荐';
      }
      return '展开推荐';
    },
    toggleMarketRecommendTxt() {
      const { showMarketRecommend } = this;
      if (showMarketRecommend) {
        return '收起推荐';
      }
      return '展开推荐';
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    isAutoLeaveChange(value) {
      if (value) {
        if (!this.releaseAdmin) {
          this.releaseAdmin = this.getUser.name;
        }
      }
    },
    addRecommendTag(tag) {
      if (this.tagGroup.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
        return;
      }
      this.tagGroup = [...new Set(this.tagGroup.concat(tag))];
    },
    addNewTag() {
      const tag = String(this.newTagName).trim();
      if (!tag) return;
      if (this.tagGroup.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
      } else {
        this.tagGroup = [...new Set(this.tagGroup.concat(tag))];
      }
      this.newTagName = '';
    },
    removeTag(index) {
      this.tagGroup = this.tagGroup.slice(0, index).concat(this.tagGroup.slice(index + 1));
      console.log('tagGroup: ', index, this.tagGroup);
    },
    getRecommendTag() {
      const url = '/admin/common/keywords.jhtml';
      const { name } = this.productDataModel;
      const params = {
        content: name
      };
      http
        .get(url, params)
        .then(data => {
          this.recommendTagGroup = [...new Set(data.keywords)];
        })
        .catch(err => {
          console.log('ERR_GET_RECOMMEND_TAGS: ', err);
        });
    },
    // Tag
    handleClose(tag) {
      this.productDataModel.reputations.splice(this.productDataModel.reputations.indexOf(tag), 1);
    },
    getRecommendMarketTags() {
      let params = {
        isIncludeParent: '1',
        isIncludeTag: '1',
        shopId: window.top.SHOP_ID || '',
        categoryType: '智能到店/离店/离店备注'
      };
      http.get('/admin/tag/storeTagcategories.jhtml', params).then(data => {
        this.recommendMarketTags = data.content[0].tags || [];
        this.recommendMarketTagId = data.content[0].id;
      });
    },
    addRecommendMarketTag(tag) {
      if (!this.recommendMarketTagId) {
        this.$message.warning('请新建离店标签');
        return;
      }
      tag = tag.id ? tag : { name: this.newMarketTagName, id: 'temp' + Math.random().toString(36).substr(-10) };
      for (const iterator of this.tags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      if (this.remarks) {
        this.remarks = this.remarks + '、' + tag.name;
      } else {
        this.remarks = tag.name;
      }
      this.newMarketTagName = '';
    },
    addRecommendMarketTagByButton(tag) {
      if (this.newMarketTagName === '') {
        this.$message.warning('请输入自定义标签');
        return;
      }
      tag = tag.id ? tag : { name: this.newMarketTagName, id: 'temp' + Math.random().toString(36).substr(-10) };
      for (const iterator of this.tags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    removeMarketTag(id) {
      let index = 0;
      for (; index < this.tags.length; index++) {
        const element = this.tags[index];
        if (element.id === id) {
          break;
        }
      }
      this.tags = this.tags.slice(0, index).concat(this.tags.slice(index + 1));
    },
    saveRecommendMarketTags() {
      let newTags = this.tags.filter(tag => {
        return tag.id.indexOf('temp') !== -1;
      });
      let promiseList = [];
      for (const tag of newTags) {
        let params = {
          name: tag.name,
          type: '0',
          description: '',
          hierarchy: '1',
          shopId: window.top.SHOP_ID || '',
          tagCategory: {
            id: this.recommendMarketTagId
          }
        };
        promiseList.push(http.post(urls.shopRate.TagGroupTags_tag, params));
      }
      return Promise.all(promiseList);
    },
    selectedTag(tags) {
      this.tags = tags;
    },
    resetForm() {
      return {
        isAutoLeave: false
      };
    },
    // 清空
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    // 点击'保存'按钮
    async save() {
      let resList = await this.saveRecommendMarketTags();
      let newTags = this.tags.filter(tag => {
        return tag.id.indexOf('temp') !== -1;
      });
      for (const tag of newTags) {
        for (const res of resList) {
          if (res.data.name === tag.name) {
            tag.id = res.data.id.toString();
          }
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      if (!this.itemId.id) {
        this.itemId.id = this.id;
      }
      let params = Object.assign({}, this.form, this.itemId, { remarks: this.remarks });
      this.loading = true;
      http
        .put(urls.customerService.ReceptionMgmt.baseInfo.updateAutoLeave, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('update');
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh(id) {
      this.loading = true;
      this.getRecommendMarketTags();
      let params = this.itemId.id || id;
      http
        .get(urls.customerService.ReceptionMgmt.baseInfo.query, { id: params })
        .then(data => {
          this.loading = false;
          this.form.isAutoLeave = data.data.isAutoLeave;
          this.remarks = data.data.remarks;
          this.releaseAdmin = data.data.releaseAdmin && data.data.releaseAdmin.name ? data.data.releaseAdmin.name : '';
          this.tags = data.data.shopTags || [];
          if (this.tagGroup && this.tagGroup.length) {
            this.showRecommend = false;
          } else {
            this.showRecommend = true;
          }
          if (this.tags && this.tags.length > 0) {
            this.showMarketRecommend = false;
          } else {
            this.showMarketRecommend = true;
          }
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.el-icon-question:before {
  color: #ff7300;
}
.reception-mgmt-leave-info {
  img {
    margin-top: 10px;
    max-width: 100%;
  }
  .biz-save-button {
    float: left;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
  .el-radio {
    width: 70px;
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
      .tag-group {
        width: 100%;
        padding-right: 5px;
      }
      .toggle-btn {
        display: flex;
        align-items: flex-end;
        width: 85px;
        cursor: pointer;
        user-select: none;
        .rotate-180 {
          transform: rotate(180deg);
        }
      }
      .recommend-group {
        width: 100%;
        margin: 0 10px 10px 0;
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
