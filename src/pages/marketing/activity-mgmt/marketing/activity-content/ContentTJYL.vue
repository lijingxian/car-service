<template>
  <biz-grid class="content-tjyl">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operate"
                     v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules"
             ref="form"
             :model="content"
             label-width="100px"
             size="small"
             :disabled="!isEdit"
             v-loading="loading">
      <!-- <el-form-item label="链接地址" prop="product">
        <el-input disabled v-model="url"></el-input>
      </el-form-item> -->
      <el-form-item label="会员等级">
        <rank-item :rankData="rankData" ref="rank"></rank-item>
      </el-form-item>
      <el-form-item label="奖励限制"
                    prop="maxAwardTimes">
        <el-input-number :min="min"
                         placeholder="请输入奖励限制"
                         v-model="content.maxAwardTimes"></el-input-number>
      </el-form-item>
      <el-form-item label="活动规则">
        <el-input placeholder="请填写活动规则"
                  type="textarea"
                  :rows="2"
                  v-model="content.desc"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/activity-mgmt/marketing/activity-content/activityContent';
import BizSaveButton from '@/components/BizSaveButton';
import RankItem from './RankItem';

export default {
  name: 'ContentTJYL',
  data() {
    return {
      min: 1,
      loading: false,
      dialogVisible: false,
      activity: {},
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ],
      rankData: {
        memberRankList: this.memberRankList,
        publishTarget: '0',
        memberRanks: [],
        members: []
      },
      content: {
        id: '',
        type: '5',
        path: '',
        maxAwardTimes: '',
        memberRanks: [],
        desc: ''
      },
      rules: {
        maxAwardTimes: [
          { required: true, message: '请输入奖励限制', trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    memberRankList: {
      type: Array,
      default() {
        return [];
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created() {},
  computed: {
    url() {
      return (
        window.location.origin +
        '/resources/admin/ecStatic/index.html#/eve_recommend/' +
        this.content.id
      );
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
          for (const iterator of this.content.memberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    }
  },
  components: {
    BizGrid,
    RankItem,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    vipChange(val) {
      if (val.checked) {
        this.content.memberRanks.forEach((element, index) => {
          if (element.id === val.id) {
            this.content.memberRanks.splice(index, 1);
          }
        });
      } else {
        this.content.memberRanks.push({ id: val.id });
      }
    },
    refresh(activity) {
      this.activity = activity;
      let params = {
        id: this.activity.id
      };
      Service.getActivityContent(
        params,
        data => {
          this.content.id = data.activity.id;
          this.content.type = data.activity.type;
          this.content.path = data.activity.path;
          this.content.maxAwardTimes = data.activity.maxAwardTimes;
          this.content.memberRanks = data.activity.memberRanks || [];
          this.content.desc = data.activity.desc;
          this.rankData.publishTarget = data.activity.publishTarget;
          this.rankData.memberRanks = data.activity.memberRanks ? data.activity.memberRanks : [];
          this.rankData.members = data.activity.members ? data.activity.members : [];
          if (this.rankData.publishTarget === '0') {
            this.$refs.rank.getVipCount();
          }
          if (this.rankData.memberRanks.length) {
            this.$refs.rank.memberRankHandle();
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;
        this.$refs.rank.clearData();
        let params = {
          type: this.content.type,
          id: this.content.id,
          maxAwardTimes: this.content.maxAwardTimes,
          desc: this.content.desc,
          publishTarget: this.rankData.publishTarget,
          memberRanks: this.rankData.memberRanks,
          members: this.rankData.members
        };
        Service.updateActivityContent(
          params,
          data => {
            this.$message.success('更新成功');
            this.loading = false;
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$notify({
              title: '警告',
              message: ErrorData.errorMessage,
              type: 'warning',
              duration: 1500
            });
          }
        );
      });
    }
  }
};
</script>

<style lang="scss">
.content-tjyl {
  .biz-save-button {
    margin-top: 10px;
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .vip-level {
      .vip-container {
        display: flex;
        flex-wrap: wrap;
        .vip {
          min-width: 110px;
        }
      }
    }
  }
}
</style>
