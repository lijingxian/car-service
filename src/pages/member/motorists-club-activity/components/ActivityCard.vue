<template>
  <a href="##" class="activity-card" @click="click">
    <biz-card :image="model.cover">
      <div class="activity-card__body">
        <div class="title">{{model.title}}</div>
        <div class="area">{{model.address}}</div>
        <div class="area">{{model.fleet ? model.fleet.name : ''}}</div>
        <div class="time">
          <div class="time-start">开始时间：{{model.beginDate}}</div>
          <div class="time-end">结束时间：{{model.endDate}}</div>
        </div>
        <div class="signup-count">已报名 {{model.attendNumber}} 人</div>
        <div class="close" @click="close" v-if="hasAuthDel"><i class="el-icon-close"></i></div>
        <div class="top" :class="{ 'is-top': model.isTop === '1'}" @click="topClick">顶</div>
      </div>
      <div slot="footer">
        <span class="activity-card__footer" :class="{ 'status-1': model.state === 'continued', 'status-2': model.state === 'ended' }">{{statusText}}</span>
      </div>
    </biz-card>
  </a>
</template>

<script>
import BizCard from '@/components/BizCard';
import { mapGetters } from 'vuex';
export default {
  name: 'ActivityCard',
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  components: {
    BizCard
  },
  methods: {
    click (e) {
      e.preventDefault();

      this.$emit('cardClicked', e, this.model);
    },
    topClick (e) {
      e.preventDefault();
      e.stopPropagation();

      this.$emit('topClicked', e, this.model);
    },
    close (e) {
      e.preventDefault();
      e.stopPropagation();

      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('closed', e, this.model);
      });
    }
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:fleetActivity.delete');
    },
    statusText: function () {
      switch (this.model.state) {
        case 'notStart':
          return '未开始';
        case 'continued':
          return '进行中';
        case 'ended':
          return '已结束';
        case 'created':
          return '已创建 (未发布)';
      }
      return '';
    }
  }
};
</script>

<style lang="scss">
$activity-card-width:           220px;
$activity-card-margin:          0 25px 50px 0;

$activity-card__image-height:   110px;

$activity-card__icon-size:      24px;

$activity-card__top-width:      22px;

.activity-card {
  position: relative;
  display: block;
  text-decoration: none;
  margin: $activity-card-margin;

  > .biz-card {
    position: relative;
    width: $activity-card-width;

    .activity-card__body {

      .title {
        margin-bottom: 10px;
        color: #1a1a1a;
        font-size: 14px;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .area {
        margin-bottom: 5px;
        color: #ff7300;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .time {
        margin-bottom: 5px;
        color: #929292;
        font-size: 12px;

        > .time-start {
          margin-bottom: 5px;
        }
      }

      .signup-count {
        color: #929292;
        font-size: 12px;
      }

      .close {
        position: absolute;
        display: none;
        // left: ($activity-card-width - $activity-card__icon-size / 3 * 2);
        // top: ($activity-card__icon-size / 3 * -1);
        left: ($activity-card-width - $activity-card__icon-size);
        top: 0;
        width: $activity-card__icon-size;
        height: $activity-card__icon-size;
        border-radius: 5px;
        background: #ee0000;
        color: #fff;
        font-size: 18px;
        line-height: $activity-card__icon-size;
        text-align: center;
        opacity: 0.7;
        z-index: 2;

        &:hover {
          opacity: 1;
        }
      }

      .top {
        position: absolute;
        display: none;
        left: 15px;
        top: 0;
        width: $activity-card__top-width;
        background: #f6f6f6;
        color: #929292;
        font-size: 12px;
        line-height: 18px;
        text-align: center;
        z-index: 2;

        &.is-top {
          display: block;
          background: #ff7300;
          color: #fff;

          &:after {
            border-color: transparent #ff7300 transparent #ff7300;
          }
        }

        &:after {
          content: ' ';
          border-color: transparent #f6f6f6 transparent #f6f6f6;
          border-style: solid;
          border-width: 0 ($activity-card__top-width / 2) 8px ($activity-card__top-width / 2);
          position: absolute;
          top: 100%;
          left: 0;
        }
      }
    }

    .activity-card__footer {
      color: #fc9622;
      font-size: 12px;

      &.status-1 {
        color: #666;
      }

      &.status-2 {
        color: #929292;
      }
    }
  }

  &:hover {
    .biz-card {

      &:after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0.3;
      }
    }

    .activity-card__body {
      .close {
        display: block;
      }

      .top {
        display: block;
      }
    }
  }
}
</style>
