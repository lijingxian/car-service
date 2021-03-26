<template>
  <div class="cs-manhour-mgmt">
    <div class="title">工作时间：</div>
    <div class="week">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="星期一"></el-checkbox>
        <el-checkbox label="星期二"></el-checkbox>
        <el-checkbox label="星期三"></el-checkbox>
        <el-checkbox label="星期四"></el-checkbox>
        <el-checkbox label="星期五"></el-checkbox>
        <el-checkbox label="星期六"></el-checkbox>
        <el-checkbox label="星期日"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="time">
      <el-time-picker ref="picker"
                      size="small"
                      format="HH:mm"
                      is-range
                      v-model="time"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间">
      </el-time-picker>
    </div>
    <div class="operate">
      <el-button size="small"
                 @click="save"
                 type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
import csService from '@/service/customer-service/csMgmt';

export default {
  name: 'ManhourMgmt',
  data() {
    return {
      checkList: [],
      time: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 17, 0)]
    };
  },
  created() {
    this.refresh();
  },
  mounted() {
    this.$message({
      showClose: true,
      message: '设置店铺客服的工作时间',
      type: 'info'
    });
  },
  components: { },
  computed: {
    from() {
      return this.fix(this.time[0].getHours(), 2).toString() + ':' + this.fix(this.time[0].getMinutes(), 2).toString();
    },
    to() {
      return this.fix(this.time[1].getHours(), 2).toString() + ':' + this.fix(this.time[1].getMinutes(), 2).toString();
    },
    workDays() {
      let workDays = [];
      for (const iterator of this.checkList) {
        switch (iterator) {
          case '星期一':
            workDays.push('1');
            break;
          case '星期二':
            workDays.push('2');
            break;
          case '星期三':
            workDays.push('3');
            break;
          case '星期四':
            workDays.push('4');
            break;
          case '星期五':
            workDays.push('5');
            break;
          case '星期六':
            workDays.push('6');
            break;
          case '星期日':
            workDays.push('7');
            break;
          default:
            break;
        }
      }
      return workDays.sort();
    }
  },
  methods: {
    refresh() {
      this.getManhour();
    },
    fix(num, length) {
      return ('' + num).length < length ? (new Array(length + 1).join('0') + num).slice(-length) : '' + num;
    },
    save() {
      let params = {
        from: this.from,
        to: this.to,
        workDays: this.workDays
      };
      csService.updateManhour(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.getManhour();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getManhour() {
      csService.getManhour(
        {},
        data => {
          let from = new Date();
          let to = new Date();
          from.setHours(Number(data.data.from.slice(0, 2)));
          from.setMinutes(Number(data.data.from.slice(3, 5)));
          to.setHours(Number(data.data.to.slice(0, 2)));
          to.setMinutes(Number(data.data.to.slice(3, 5)));
          this.time = [from, to];

          let workDays = [];
          for (const iterator of data.data.workDays) {
            switch (iterator) {
              case '1':
                workDays.push('星期一');
                break;
              case '2':
                workDays.push('星期二');
                break;
              case '3':
                workDays.push('星期三');
                break;
              case '4':
                workDays.push('星期四');
                break;
              case '5':
                workDays.push('星期五');
                break;
              case '6':
                workDays.push('星期六');
                break;
              case '7':
                workDays.push('星期日');
                break;
              default:
                break;
            }
          }
          this.checkList = workDays;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.cs-manhour-mgmt {
  padding: 50px;
  .title {
    font-size: 20px;
    margin: 10px 0;
  }
  .week {
    margin: 30px 0;
  }
  .time {
    margin: 30px 0;
    .el-range-separator {
      padding: 0;
    }
  }
  .operate {
    margin: 10px 0;
  }
}
</style>
