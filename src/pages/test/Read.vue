<template>
  <div class="content">
    <el-row>
      <el-col :span="8">
        <img src="../../assets/images/test.png" width="100px" />
      </el-col>
      <el-col :span="16">
        <div class="title">吉林精诚工程检测公司</div>
        <div class="title-f">样品标识卡</div>
        <div class="sn">JSJL-Z26-02-2018 A/0</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">委托编号:</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-input v-model="form.wtsn" size="mini"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">试验编号:</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-input v-model="form.sysn" size="mini"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">委托日期:</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" size="mini">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">样品名称:</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-input v-model="form.name" size="mini"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">样品收样人:</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-input v-model="form.people" size="mini"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">状态标识:</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-input v-model="form.state" size="mini"></el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import axios from 'axios';
export default {
  name: 'Rtc',
  data() {
    return {
      form: {
        wtsn: '2020-09238',
        sysn: 'GJ20-01322',
        name: '钢筋',
        people: '贯小雪',
        state: '留样',
        date: '2020-06-17',
        remark: '地铁6号线16局'
      }
    };
  },
  props: {},
  watch: {},
  mounted() {
    // let url = '/' + this.$route.fullPath.split('?')[1].split('-')[0] + '.xls';
    // console.log(this.$route.fullPath);
    // axios
    //   .get(url, { responseType: 'arraybuffer' })
    //   .then(res => {
    //     let data = new Uint8Array(res.data);
    //     let wb = window.XLSX.read(data, { type: 'array' });
    //     // 9.利用XLSX把wb第一个sheet转换成JSON对象
    //     // wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
    //     // wb.Sheets[Sheet名]获取第一个Sheet的数据
    //     let jdata = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    //     // 10.在终端输出查看结果
    //     console.log(jdata);
    //     this.form.wtsn = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['委托编号'];
    //     this.form.sysn = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['试验编号'];
    //     this.form.date = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['委托日期'];
    //     this.form.name = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['样品名称'];
    //     this.form.people = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['样品收样人'];
    //     this.form.remark = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['状态标识'];
    //     this.form.count = jdata[this.$route.fullPath.split('-')[1].split('=')[0]]['组数'];
    //   })
    //   .catch(err => {
    //     this.err = err;
    //   });
  },
  methods: {}
};
</script>
<style lang="scss">
.content {
  padding: 5px;
  .title {
    font-weight: bold;
    color: #000000;
    font-size: 16px;
    text-align: center;
    margin-top: 15px;
  }
  .title-f {
    color: #000000;
    font-size: 14px;
    text-align: center;
    margin: 15px 0px;
  }
  .sn {
    text-align: right;
    font-size: 12px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .grid-content {
    padding: 5px 0px;
  }
}
</style>
