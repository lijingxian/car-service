<template>
  <div class="type-range">
    <el-radio-group v-model="viewType" @change="queryType(viewType)" size="mini">
      <el-radio-button label="day">按日</el-radio-button>
      <el-radio-button label="week">按周</el-radio-button>
      <el-radio-button label="month">按月</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
import dateTime from '@/utils/dateTime';
import date from '@/utils/date';
export default {
  name: 'type-range',
  data() {
    return {
      viewType: 'month',
      defaultDate: this.getFormatDate()
    };
  },
  methods: {
    getFormatDate() {
      return [dateTime.getMonthStartDate(), date.nowDate()];
    },
    queryType(type) {
      switch (type) {
        case 'day':
          this.viewType = 'day';
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: 'day'
          });
          break;
        case 'week':
          this.viewType = 'week';
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: 'week'
          });
          break;
        case 'month':
          this.viewType = 'month';
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: 'month'
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss">
</style>
