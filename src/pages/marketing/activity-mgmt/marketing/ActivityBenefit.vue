<template>
  <div class="activity-benefit">
    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column prop="name" label="指标"></el-table-column>
      <el-table-column prop="value" label="指标值"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import http from '@/common/http';

export default {
  name: 'activity-benefit',
  data() {
    return {
      infoData: {},
      tableData: []
    };
  },
  props: {
    info: {
      type: Object
    },
    actType: {
      type: String,
      default() {
        return 'marketing';
      }
    }
  },
  components: {},
  computed: {},
  watch: {
    info(val) {
      if (val && this.actType === 'promotion') {
        this.getInfo();
      }
    }
  },
  methods: {
    getInfo() {
      let url;
      let param = {};
      if (this.actType === 'promotion') {
        url = '/admin/promotion/statistics.jhtml';
        param.id = this.info.id;
      } else {
        url = '/admin/marketing/statistics.jhtml';
        param.activityId = this.info.id;
      }
      http
        .get(url, param)
        .then(data => {
          console.log(data);
          this.infoData = data;
          if (this.actType === 'marketing' && this.info !== '9') {
            this.tableData = [
              {
                name: '分享次数', value: data.shareSum + '次'
              },
              {
                name: '参与人次', value: data.attendSum + '人次'
              },
              {
                name: '拉新数', value: data.newSum + '人'
              },
              {
                name: '转化收益', value: data.incomeSum + '元'
              }
            ];
          } else if (this.actType === 'marketing' && this.info === '9') {
            this.tableData = [
              {
                name: '分享次数', value: data.shareSum + '次'
              },
              {
                name: '参与人次', value: data.attendSum + '人次'
              },
              {
                name: '拉新数', value: data.newSum + '人'
              }
            ];
          } else if (this.actType === 'promotion') {
            this.tableData = [
              {
                name: '分享次数', value: data.shareSum + '次'
              },
              {
                name: '参与人次', value: data.attendSum + '人次'
              },
              {
                name: '订单数量', value: data.totalOrderCount + '个'
              },
              {
                name: '订单总金额', value: data.totalOrderCount + '元'
              }
            ];
          }
        })
        .catch();
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style lang="scss">
.activity-benefit {
  color: #606266;
  padding: 40px;
  font-size: 14px;
  .label{
    position: relative;
    width: 50%;
    margin: 20px;
    .count{
      position: absolute;
      display: block;
      right: 0;
      top: 0;
    }
  }
}
</style>
