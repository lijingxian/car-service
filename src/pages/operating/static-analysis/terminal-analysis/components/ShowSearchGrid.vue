<template>
  <div class="search-property">
    <el-radio-group v-model="date" @change="dateSwich(date)" size="mini">
      <el-radio-button label="day">本日</el-radio-button>
      <el-radio-button label="week">本周</el-radio-button>
      <el-radio-button label="month">本月</el-radio-button>
      <el-radio-button label="quarter">本季</el-radio-button>
      <el-radio-button label="year">半年</el-radio-button>
    </el-radio-group>
    <div>
      <span style="font-size:13px;">日期范围</span>
      <el-date-picker
        type="daterange"
        class="biz-date-range"
        v-model="defaultDate"
        size="mini"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="dateChange"
        :clearable="false"
      ></el-date-picker>
    </div>
    <slot name="extraContent"></slot>
    <el-button type="text" size="mini" v-popover:codePop>
      统计说明
      <i class="iconfont el-icon-question"></i>
    </el-button>
    <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover">
      <slot name="description"></slot>
    </el-popover>
    <el-button type="primary" size="mini" @click="exportExcle">导出</el-button>
  </div>
</template>
<script>
import dateTime from '@/utils/dateTime';

export default {
  name: 'date-range',
  data() {
    return {
      date: 'month',
      viewType: 'month',
      beginDate: '',
      endDate: ''
    };
  },
  computed: {
    defaultDate: {
      get() {
        if (this.beginDate && this.endDate) {
          return [this.beginDate, this.endDate];
        } else {
          return this.getFormatDate();
        }
      },
      set(newValue) {
        if (newValue) {
          this.beginDate = newValue[0];
          this.endDate = newValue[1];
        } else {
          this.beginDate = dateTime.getMonthStartDate();
          this.endDate = dateTime.getMonthEndDate();
        }
      }
    }
  },
  methods: {
    getFormatDate() {
      return [dateTime.getMonthStartDate(), dateTime.getMonthEndDate()];
    },
    dateChange(value) {
      this.$emit('refreshData', {
        date: this.defaultDate,
        viewType: this.viewType
      });
    },
    dateSwich(type) {
      switch (type) {
        case 'day':
          this.viewType = 'day';
          this.defaultDate = [dateTime.today(), dateTime.today()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'day';
          break;
        case 'week':
          this.viewType = 'week';
          this.defaultDate = [dateTime.getWeekStartDate(), dateTime.getWeekEndDate()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'week';
          break;
        case 'month':
          this.viewType = 'month';
          this.defaultDate = [dateTime.getMonthStartDate(), dateTime.getMonthEndDate()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'month';
          break;
        case 'quarter':
          this.defaultDate = [dateTime.getQuarterStartDate(), dateTime.getQuarterEndDate()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'quarter';
          break;
        case 'year':
          this.defaultDate = [dateTime.getQuarterHalfYearStart(), dateTime.getQuarterHalfYearEnd()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'year';
          break;
        default:
          break;
      }
    },
    exportExcle() {
      this.$emit('exportExcle');
    }
  }
};
</script>
<style lang="scss">
.search-property {
  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border: none;
    border-radius: 15px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 15px;
  }
  .el-checkbox-button,
  .el-checkbox-button__inner {
    padding: 0px 10px;
    border-radius: 15px;
  }
  .el-checkbox-button__inner {
    border: none;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #f8d6ad;
    border-color: #fff;
    box-shadow: -1px 0 0 0 #fff;
    color: #ff7300;
  }
  .biz-date-range {
    &.el-date-editor--daterange.el-input__inner,
    &.el-date-editor--timerange.el-input__inner {
      width: 220px;
    }
    span {
      padding: 0;
      width: 15px;
    }
  }
}
</style>
