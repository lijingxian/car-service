<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-data-steam">
    <div slot="top" class="top">
      <el-button type="primary" size="small" @click="handleClick" v-if="isEdit">{{btnText}}</el-button>
    </div>
    <div>
      <el-form
        ref="form"
        size="small"
        label-width="110px"
        :model="formModel"
        :rules="rules"
        :disabled="!isEdit"
      >
        <el-form-item label="检测设置" prop="option">
          <el-form
            ref="form"
            size="small"
            label-width="55"
            :model="formModel"
            :rules="rules"
            :inline="true"
            class="form-inline"
            style="position: relative; top: -1px;"
          >
            <el-form-item label="时间">
              <el-input v-model="formModel.count" type="number" min="0" max="30">
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
            <el-form-item label="流量">
              <el-input v-model="formModel.limit" type="number" min="0" max="15">
                <template slot="append">MB</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>

      <div class="biz-card-list">
        <div
          v-for="item in formModel.userOptions"
          :key="item.id"
          class="biz-card-list__item"
          :class="{ selected: item.id === selectedOption }"
          @click="handleCardClick(item)"
        >
          <div class="value">{{item.dataType === '1' ? '关闭' : (item.value || 0)}}</div>
          <div class="unit">{{item.unit}}</div>
          <div class="name">{{item.content}}</div>
        </div>
      </div>

      <div class="chart-cover" v-if="selectedOption === ''">
        <span>开始监测后,点击上方检测项,可查看数据趋势图</span>
      </div>
      <chart-view :max="60" :userOptions="formModel.userOptions" :selectedOption="selectedOption" :streamData="streamData"></chart-view>

      <el-form
        size="small"
        label-width="0"
        :model="formModel"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item title="常用" name="1">
            <el-form-item prop="name">
              <el-checkbox-group
                v-model="userOptions"
                class="vehicle-data-steam__checkbox-group"
              >
                <div
                  v-for="item in optionList"
                  :key="item.id"
                  class="checkbox-item"
                  >
                  <el-checkbox
                    :label="item.id"
                    :disabled="(Number(userOptions.length) === 6 && Number(userOptions.indexOf(item.id)) < 0) || (Number(userOptions.length) === 1 && Number(userOptions.indexOf(item.id)) === 0) || checkboxDisable"
                  >
                    {{item.content}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="更多" name="2">
            <el-form-item prop="name">
              <el-checkbox-group
                v-model="userOptions"
                class="vehicle-data-steam__checkbox-group"
              >
                <div
                  v-for="item in optionMoreList"
                  :key="item.id"
                  class="checkbox-item"
                >
                  <el-checkbox
                    :label="item.id"
                    :disabled="(Number(userOptions.length) === 6 && Number(userOptions.indexOf(item.id)) < 0) || (Number(userOptions.length) === 1 && Number(userOptions.indexOf(item.id)) === 0) || checkboxDisable"
                  >
                    {{item.content}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import ChartView from '../component/ChartView';

import service from '@/service/vehicle-mgmt/VehicleDataStream';

const START_TEXT = '开始';

export default {
  name: 'VehicleDataStream',
  components: {
    BizGrid,
    ChartView
  },
  data() {
    return {
      // 前端时间计数器
      startTime: 0,
      // 是否第一次取数据
      flag: true,
      // 计数器
      counter: 0,
      streamData: [],
      count: 0,
      activeNames: '1',
      optionList: [],
      optionMoreList: [],
      userOptions: [],
      selectedOption: '',
      checkboxDisable: false,
      rules: {
        option: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (isNaN(Number(this.formModel.count))) {
                callback(new Error('请输入时间'));
              } else if (Number(isNaN(this.formModel.limit))) {
                callback(new Error('请输入流量'));
              } else {
                callback();
              }
            }
          },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (Number(this.formModel.count) > 30) {
                callback(new Error('不能超过30秒'));
              } else if (Number(this.formModel.count) <= 0) {
                callback(new Error('请输入大于0的正整数'));
              } else if (Number(this.formModel.limit) > 15) {
                callback(new Error('不能超过15MB'));
              } else if (Number(this.formModel.limit) <= 0) {
                callback(new Error('请输入大于0的正整数'));
              } else {
                callback();
              }
            }
          }
        ]
        // count: [
        //   { required: true, trigger: 'blur', message: '请输入时间' },
        //   { trigger: 'blur',
        //     validator: (rule, rules, callback) => {
        //       if (Number(this.formModel.count) > 30) {
        //         callback(new Error('不能超过30秒'));
        //       } else if (Number(this.formModel.count) <= 0) {
        //         callback(new Error('请输入大于0的正整数'));
        //       } else {
        //         callback();
        //       }
        //     } }
        // ],
        // limit: [
        //   { required: true, trigger: 'blur', message: '请输入流量' },
        //   { trigger: 'blur',
        //     validator: (rule, rules, callback) => {
        //       if (Number(this.formModel.limit) > 15) {
        //         callback(new Error('不能超过15MB'));
        //       } else if (Number(this.formModel.limit) <= 0) {
        //         callback(new Error('请输入大于0的正整数'));
        //       } else {
        //         callback();
        //       }
        //     } }
        // ]
      },

      btnText: START_TEXT,

      formModel: this.getDefaultModel()
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    init () {
      if (this.itemId.id) {
        this.query();
      }
    },
    getDefaultModel () {
      return {
        count: '30',
        limit: 15,
        userOptions: []
      };
    },
    // 查询数据
    query(queryType = '1') {
      let params = {
        carId: String(this.itemId.id),
        // carId: '133',
        queryType: queryType
      };
      service.query(
        params,
        data => {
          // 查询常用项目
          if (String(queryType) === '1') {
            this.optionList = [];
            data.dataFlowParams.map(dataFlow => {
              this.optionList.push({ content: dataFlow.name, unit: dataFlow.unit, id: dataFlow.id });
            });
          }
          // 查询全部项目
          if (String(queryType) === '2') {
            this.userOptions = [];
            this.optionMoreList = [];
            data.dataFlowParams.map(dataFlow => {
              this.optionMoreList.push({ content: dataFlow.name, unit: dataFlow.unit, id: dataFlow.id, dataType: dataFlow.dataType });
              if (dataFlow.isSelect === '1') {
                this.userOptions.push(dataFlow.id);
              }
            });
          }
          this.$refs.form.resetFields();

          // 嵌套顺序执行queryType=1,2
          if (queryType === '1') {
            this.query('2');
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('ERR_QUERY', ErrorData);
        }
      );
    },
    setGoonText () {
      this.btnText = '继续 (' + this.count-- + 's)';
    },
    clearInterval (refresh) {
      clearInterval(this.tempInterval);
      if (!refresh) {
        this.flag = true;
        this.btnText = START_TEXT;
        this.count = 0;
        this.checkboxDisable = false;
      }
    },

    handleClick (e) {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          // this.count += Number(this.formModel.count);
          this.count = 30;
          // 禁用checkbox
          this.checkboxDisable = true;
          // 选中第一个卡片
          if (this.userOptions[0] && !this.selectedOption) {
            this.selectedOption = this.formModel.userOptions[0].id;
          }
          // 保存默认项
          this.saveDefault();
          // 触发事件通知开始取数据
          // 数据流控制
          this.dataStreamControl();

          this.clearInterval(true);
        }
      });
    },
    intervalQueryDataStream() {
      // 设置flag,让getDataStream第一次运行时取第一项的时间并保存
      // 开始计时
      // this.getDataStream();
      this.tempInterval = setInterval(() => {
        if (this.counter % 5 === 0) {
          // chartView查询数据流
          this.getDataStream(this.flag);
        }
        this.counter = this.counter + 1;
        this.setGoonText();
        if (this.count < 0) {
          this.checkboxDisable = false;
          clearInterval(this.tempInterval);
          this.btnText = START_TEXT;
          this.count = 0;
          this.counter = 0;
        }
      }, 1000);
    },
    handleCardClick (model) {
      this.selectedOption = model.id;
    },
    // userOptionsChange
    userOptionsChange(value) {
      let arr = [];
      value.forEach(val => {
        this.optionMoreList.map(option => {
          if (option.id === val) {
            arr.push(option);
          }
        });
      });

      this.formModel.userOptions = arr;
      // 默认选中第一个选项卡
      // this.selectedOption = value[0] || '';
      // 默认不选中选项卡
      this.selectedOption = '';
    },
    // 保存默认项目
    saveDefault() {
      let params = {
        carId: String(this.itemId.id),
        ids: this.userOptions.join(',')
      };
      service.saveDefault(
        params,
        data => {},
        ErrorData => {
          console.log('ERR_SAVE_DEFAULT: ', ErrorData);
        }
      );
    },
    // 数据流控制
    dataStreamControl() {
      let params = {
        carId: String(this.itemId.id),
        // carId: '133',
        command: '1',
        duration: this.count + 1,
        values: this.userOptions.join(',')
      };
      service.dataControl(
        params,
        data => {
          this.intervalQueryDataStream();
        },
        ErrorData => {
          this.checkboxDisable = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_DATA_STREAM_CONTROL: ', ErrorData);
        }
      );
    },
    // 通过id从服务器获取数据
    getDataStream(flag) {
      // 查询数据流
      let params = {
        carId: String(this.itemId.id),
        // carId: '133',
        dataFlowSize: String(this.formModel.limit)
      };
      service.queryChartStream(
        params,
        data => {
          let timer = '';
          this.streamData = data.diagnoseData;
          // 设置数据小数点后两位
          this.streamData.map(data => {
            data.datas.map(stream => {
              stream.value = stream.value.slice(0, stream.value.indexOf('.') + 3);
            });
          });
          // 设置时间
          if (flag && this.streamData[0]) {
            // this.startTime = this.streamData[0].dateTime.slice(11, 19) + '.0';
            this.startTime = 0;
            this.flag = false;
            timer = this.startTime;
            this.streamData[0].dateTime = String(timer);
            for (let i = 1; i < this.streamData.length; i++) {
              // this.streamData[i].dateTime = this.addHalfSecond(timer).slice(0, 10);
              this.streamData[i].dateTime = String(timer + 0.5);
              // timer = this.addHalfSecond(timer);
              timer = timer + 0.5;
            }
          } else {
            timer = this.startTime;
            for (let i = 0; i < this.streamData.length; i++) {
              // this.streamData[i].dateTime = this.addHalfSecond(timer).slice(0, 10);
              this.streamData[i].dateTime = String(timer + 0.5);
              // timer = this.addHalfSecond(timer);
              timer = timer + 0.5;
            }
          }
          this.startTime = timer;
          // 获取的数据值推到卡片上
          let optionsArr = this.formModel.userOptions.map(option => {
            return option.id;
          });
          if (this.streamData[this.streamData.length - 1] && this.streamData[this.streamData.length - 1].datas) {
            this.streamData[this.streamData.length - 1].datas.map(data => {
              if (optionsArr.indexOf(data.pid) !== -1) {
                this.$set(this.formModel.userOptions[optionsArr.indexOf(data.pid)], 'value', data.dataType === '1' ? data.text : data.value);
              }
            });
          }
        },
        ErrorData => {
          console.log('ERR_QUERY_STREAM', ErrorData);
        }
      );
    },
    addHalfSecond(str) {
      // str格式: 2018-04-26 13:23:01 或 13:23:01.500
      if (str.length === 19) {
        str = str.slice(11, 19);
      }
      let time = new Date();
      let tmp = '';
      time.setHours(str.slice(0, 2));
      time.setMinutes(str.slice(3, 5));
      time.setSeconds(str.slice(6, 8));
      time.setMilliseconds(str.slice(9, 12) || '000');
      time.setTime(time.getTime() + 500);
      tmp = `${time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}:${time.getMinutes()}:${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}.${time.getMilliseconds() < 10 ? '0' + time.getMilliseconds() : time.getMilliseconds()}`;
      return tmp;
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  computed: {

  },
  watch: {
    itemId (nVal, oVal) {
      this.init();
    },
    userOptions (nVal, oVal) {
      this.userOptionsChange(nVal);
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle__vehicle-data-steam {
  padding-top: 20px;
  .chart-cover {
    width: 400px;
    height: 305px;
    margin: 20px;
    z-index: 999;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .biz-scroller {
    padding: 20px;

    .form-inline {
      .el-form-item {
        width: 49%;
        margin: 0;
      }

      .el-form-item__content {
        width: 105px;

        input {
          padding: 0 0 0 10px;
        }
      }
    }

    .vehicle-data-steam__checkbox-group {

      .checkbox-item {
        display: inline-block;
        width: 50%;

        label {
          position: relative;
          display: block;
          width: 100%;

          .el-checkbox__input {
            float: left;
            margin-top: 3px;
          }
          .el-checkbox__label {
            display: block;
            margin-left: 25px;
            padding: 0 5px 0 0;
            white-space: normal;
          }
        }
      }
    }
  }

  .top {
    text-align: right;
    padding-right: 20px;
    justify-content: flex-start;
  }

  .biz-card-list {
    display: flex;
    flex-wrap: wrap;

    .biz-card-list__item {
      display: inline-block;
      width: 31%;
      text-align: center;
      font-size: 14px;
      color: #606266;
      border: 1px solid #606266;
      margin-bottom: 4px;
      margin-right: 1%;
      margin-left: 1%;
      padding: 10px 5px;
      cursor: pointer;

      .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 7px;
      }

      .value {
        display: inline;
      }

      .unit {
        display: inline;
        margin-left: 5px;
      }

      &.selected {
        background: #ff7300;
        color: #fff;
        border-color: #ff7300;
      }
    }
  }
}
</style>
