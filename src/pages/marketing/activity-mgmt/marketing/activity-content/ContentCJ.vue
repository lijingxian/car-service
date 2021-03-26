<template>
  <biz-grid class="content-cj">
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
      <el-form-item label="发送给" prop="noticeTarget">
        <rank-item :rankData="rankData" ref="rank"></rank-item>
      </el-form-item>
      <el-form-item label="活动周期">
        <el-select v-model="content.repeat">
          <el-option label="本活动"
                     value="0"></el-option>
          <el-option label="每日"
                     value="1"></el-option>
          <el-option label="每周"
                     value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="允许次数" prop="maxAttendTimes">
        <el-input-number :min="min"
                         placeholder="请输入允许次数"
                         v-model="content.maxAttendTimes"></el-input-number>
      </el-form-item>
      <el-form-item label="单次消耗v豆"
                    prop="beans">
        <el-input-number :min="0"
                         v-model="content.beans"></el-input-number>
      </el-form-item>
      <el-form-item label="转盘类型">
        <el-select v-model="content.shape">
          <el-option label="圆形"
                     value="0"></el-option>
          <el-option label="方形"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="每次分享可获抽奖机会" prop="shareRewardTime">
        <el-input-number :min="0"
                         placeholder="请输入可获抽奖机会数"
                         v-model="content.shareRewardTime"></el-input-number>
      </el-form-item>
      <el-form-item label="分享获得福利上限" prop="maxAwardTimes">
        <el-input-number :min="0"
                         placeholder="请输入获得福利上限"
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
import BizSaveButton from '@/components/BizSaveButton';
import Service from '@/service/activity-mgmt/marketing/activity-content/activityContent';
import { mapGetters } from 'vuex';
import RankItem from './RankItem';

export default {
  name: 'ContentCJ',
  data() {
    const activityPriceValid = (rule, rules, callback) => {
      if (this.content.activityPrice > 0) {
        callback();
      } else {
        callback(new Error('请输入大于0的数'));
      }
    };
    return {
      min: 1,
      vipActiveNames: '1',
      loading: false,
      activity: {},
      rankData: {
        memberRankList: this.memberRankList,
        publishTarget: '0',
        memberRanks: [],
        members: []
      },
      content: {
        memberRanks: [],
        type: '',
        id: '',
        shape: '0',
        maxAttendTimes: '0',
        repeat: '',
        isBean: '0',
        shareRewardTime: '1',
        maxAwardTimes: '1',
        beans: '0',
        desc: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ],
      rules: {
        product: [{ required: true, message: '请选择商品', trigger: 'blur' }],
        productCount: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        activityPrice: [
          { required: true, message: '请输入活动价格', trigger: 'blur' },
          {
            validator: activityPriceValid,
            trigger: 'blur'
          }
        ],
        luckPersonCount: [
          { required: true, message: '请输入中奖人数', trigger: 'blur' }
        ],
        maxPersonCount: [
          { required: true, message: '请输入活动人数', trigger: 'blur' }
        ],
        beans: [
          { required: false, message: '请输入单次消耗v豆数', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        maxAttendTimes: [
          { required: false, message: '请输入允许次数', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        shareRewardTime: [
          { required: false, message: '请输入分享增加次数', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        maxAwardTimes: [
          { required: false, message: '请输入分享获得福利上限', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ]
      }
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    RankItem
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
    ...mapGetters(['getUser'])
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
          this.content.shape = data.activity.shape || '0';
          this.content.maxAttendTimes = data.activity.maxAttendTimes;
          this.content.repeat = data.activity.repeat;
          this.content.isBean = data.activity.isBean;
          this.content.beans = data.activity.beans;
          this.content.desc = data.activity.desc;
          this.content.memberRanks = data.activity.memberRanks || [];
          this.content.shareRewardTime = data.activity.shareRewardTime;
          this.content.maxAwardTimes = data.activity.maxAwardTimes;
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
          shape: this.content.shape,
          maxAttendTimes: String(this.content.maxAttendTimes),
          repeat: this.content.repeat,
          isBean: this.content.isBean,
          beans: String(this.content.beans),
          shareRewardTime: String(this.content.shareRewardTime),
          maxAwardTimes: String(this.content.maxAwardTimes),
          desc: this.content.desc,
          publishTarget: this.rankData.publishTarget,
          memberRanks: this.rankData.memberRanks,
          members: this.rankData.members
        };
        this.loading = true;
        Service.updateActivityContent(
          params,
          data => {
            this.$message.success('更新成功');
            this.loading = false;
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    }
  }
};
</script>

<style lang="scss">
.content-cj {
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
