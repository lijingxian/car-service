<template>
  <biz-grid class="maintenance-order-settings">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :rules="rules" size="small" :model="form" label-position="left" label-width="110px" :inline-message="true">
      <el-form-item label="预约类型" prop="type">
        <el-checkbox-group :min="1" v-model="form.type">
          <el-checkbox label='0'>保养</el-checkbox>
          <el-checkbox label="1">维修</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="营业日期">
        <el-input suffix-icon="el-icon-date" @focus="showCalendar = true;" placeholder="请设置休息日，以确定营业时间" v-model="form.holiday"></el-input>
        <calendar v-if="showCalendar===true" v-model="dateArray" @pick="confirmHoliday"></calendar>
      </el-form-item>
      <el-form-item label="每日总接待人数" prop="totalQuantity">
        <el-input-number v-model="form.totalQuantity" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="营业时间" :error="timePickerErr">
        <el-select v-model="form.serviceTimeType">
          <el-option label="正常营业时间" value="0"></el-option>
          <el-option label="延长型营业时间" value="1"></el-option>
        </el-select>
        <el-time-picker is-range value-format="HH:mm:ss" v-model="serviceTime[0]" range-separator="至" start-placeholder="开始时间"
          end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
        <el-time-picker is-range value-format="HH:mm:ss" v-model="serviceTime[1]" range-separator="至" start-placeholder="开始时间"
          end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
      </el-form-item>
      <el-form-item label="每时段接待人数" prop="intervalQuantity">
        <el-input-number v-model="form.intervalQuantity" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="间隔时间">
        <el-select v-model="form.intervalTimeType">
          <el-option label="15分钟" value="0"></el-option>
          <el-option label="30分钟" value="1"></el-option>
          <el-option label="45分钟" value="2"></el-option>
          <el-option label="60分钟" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="hint">
        <el-checkbox slot="label" v-model="form.hintFlag" true-label="1" false-label="0">预约提示</el-checkbox>
        <el-input class="hint-area" type="textarea" v-model="form.hint" placeholder="请输入预约提示内容,限制200字"
          v-if="form.hintFlag === '1'"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import OrderMgmt from '@/service/maintenance/orderMgmt';
import Calendar from './components/Calendar';
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

export default {
  name: 'OrderSettings',
  data() {
    return {
      // 是否在刷新
      isRefresh: false,
      // 是否为新建
      isCreate: false,
      // 时间选择器错误信息
      timePickerErr: '',
      // 日历传出来的日期数组
      dateArray: [],
      showCalendar: false,
      rules: {
        totalCustomers: [
          {
            pattern: /^[0-9]\d*$/,
            message: '请输入大于等于零的整数',
            trigger: 'blur'
          }
        ],
        sectionCustomers: [
          {
            pattern: /^[0-9]\d*$/,
            message: '请输入大于等于零的整数',
            trigger: 'blur'
          }
        ],
        totalQuantity: [
          {
            pattern: /^[0-9]\d*$/,
            message: '请输入大于等于零的整数',
            trigger: 'blur'
          }
        ],
        intervalQuantity: [
          {
            pattern: /^[0-9]\d*$/,
            message: '请输入大于等于零的整数',
            trigger: 'blur'
          }
        ],
        hint: [{ max: 200, message: '预约提示不超过200字', trigger: 'blur' }]
      },
      form: this.setOriginForm(),
      serviceTime: [['', ''], ['', '']],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:aftersale.appointment.edit']
        }
      ]
    };
  },
  computed: {},
  methods: {
    setOriginForm() {
      return {
        type: ['0', '1'],
        serviceTimeType: '',
        formatTime: '',
        totalQuantity: '30',
        intervalQuantity: '15',
        intervalTimeType: '3',
        holiday: [],
        hintFlag: '0',
        hint: ''
      };
    },
    operate(name) {
      this[name]();
    },
    save() {
      if (this.timePickerErr !== '') {
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    create() {
      this.form.formatTime = [];
      this.serviceTime.map(data => {
        this.form.formatTime.push(`${data[0]}-${data[1]}`);
      });
      let params = {
        type: this.form.type,
        serviceTimeType: this.form.serviceTimeType,
        totalQuantity: this.form.totalQuantity,
        intervalQuantity: this.form.intervalQuantity,
        intervalTimeType: this.form.intervalTimeType,
        serviceTime: this.form.formatTime,
        holiday: this.form.holiday,
        hintFlag: this.form.hintFlag,
        hint: this.form.hint,
        shopId: window.top.SHOP_ID || ''
      };
      OrderMgmt.createSettings(
        params,
        data => {
          this.$message({
            message: '创建成功',
            type: 'success',
            duration: 500
          });
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        }
      );
    },
    update() {
      this.form.formatTime = [];
      this.serviceTime.map(data => {
        this.form.formatTime.push(`${data[0]}-${data[1]}`);
      });
      let params = {
        id: this.form.id,
        // storeId: window.top.SHOP_ID || this.form.storeId,
        type: this.form.type,
        serviceTimeType: this.form.serviceTimeType,
        totalQuantity: this.form.totalQuantity,
        intervalQuantity: this.form.intervalQuantity,
        intervalTimeType: this.form.intervalTimeType,
        serviceTime: this.form.formatTime,
        holiday: this.form.holiday,
        hintFlag: this.form.hintFlag,
        hint: this.form.hint,
        shopId: window.top.SHOP_ID || ''
      };
      OrderMgmt.updateSettings(
        params,
        data => {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 500
          });
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        }
      );
    },
    back() {
      this.$router.go(-1);
    },
    refresh() {
      this.showCalendar = false;
      let params = {
        type: this.form.type,
        shopId: window.top.SHOP_ID || ''
      };
      OrderMgmt.getSettings(
        params,
        data => {
          if (data.data.id) {
            this.isRefresh = true;
            // this.$refs.form.resetFields();
            this.form = Object.assign(this.setOriginForm(), data.data);
            this.getTime(data.data.serviceTime);
            this.dateArray = this.dateArray.concat(this.form.holiday);
          } else {
            this.isCreate = true;
          }
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        }
      );
    },
    confirmHoliday() {
      this.form.holiday = this.dateArray.concat(this.form.holiday);
      this.$message({
        message: '已设为休息日',
        type: 'success',
        showClose: true,
        duration: 500
      });
      this.showCalendar = false;
    },
    getTime(val) {
      // val = ["09:00:00-12:00:00", "13:00:00-18:00:00"]
      let timeCut = val
        .join()
        .split('-')
        .join(':')
        .split(',')
        .join(':')
        .split(':');
      this.serviceTime = [
        [new Date(2016, 9, 10, timeCut[0], timeCut[1]), new Date(2016, 9, 10, timeCut[3], timeCut[4])],
        [new Date(2016, 9, 10, timeCut[6], timeCut[7]), new Date(2016, 9, 10, timeCut[9], timeCut[10])]
      ];
      let timeArr = val
        .join()
        .split('-')
        .join()
        .split(',');
      this.serviceTime = [[timeArr[0], timeArr[1]], [timeArr[2], timeArr[3]]];
    }
  },
  watch: {
    serviceTime: function() {
      console.log(this.serviceTime);
      if (!this.serviceTime[0] || !this.serviceTime[1]) {
        this.timePickerErr = '营业时间不能为空';
      } else if (this.serviceTime[1][0] < this.serviceTime[0][1]) {
        this.timePickerErr = '第二段时间应迟于第一段时间';
      } else {
        this.timePickerErr = '';
      }
    },
    'form.serviceTimeType': function() {
      if (this.form.serviceTimeType === '0') {
        if (this.isRefresh === false) {
          this.serviceTime = [
            [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 12, 0)],
            [new Date(2016, 9, 10, 13, 0), new Date(2016, 9, 10, 18, 0)]
          ];
          this.serviceTime = [['8:00:00', '12:00:00'], ['13:00:00', '18:00:00']];
        }
      } else if (this.form.serviceTimeType === '1') {
        if (this.isRefresh === false) {
          this.serviceTime = [
            [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 12, 0)],
            [new Date(2016, 9, 10, 13, 0), new Date(2016, 9, 10, 21, 0)]
          ];
          this.serviceTime = [['8:00:00', '12:00:00'], ['13:00:00', '21:00:00']];
        }
      }
      this.isRefresh = false;
    }
  },
  mounted() {
    this.refresh();
  },
  components: {
    BizSaveButton,
    BizGrid,
    Calendar
  }
};
</script>

<style lang="scss">
.maintenance-order-settings {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-date-editor {
    margin-top: 10px;
  }
  .el-textarea {
    margin-bottom: 20px;
  }
}
</style>
