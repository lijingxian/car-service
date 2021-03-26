<template>
  <biz-grid class="review-static-detail-base-info">
    <el-form ref="form" :rules="rules" :model="recordInfo" label-width="100px" size="small" disabled v-loading="loading" :inline-message="true">
      <el-form-item label="机器人" prop="robotData.name">
        <el-input placeholder v-model="recordInfo.robotData.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="memberData.mobile">
        <el-input placeholder v-model="recordInfo.memberData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="会员姓名" prop="memberData.name">
        <el-input placeholder v-model="recordInfo.memberData.name"></el-input>
      </el-form-item>
      <el-form-item label="服务满意度" prop="serviceAttitude">
        <div v-if="recordInfo.serviceAttitude==='0'||recordInfo.serviceAttitude===''"></div>
        <div style="font-size:18px" v-if="recordInfo.serviceAttitude==='1'">
          <i class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceAttitude==='2'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceAttitude==='3'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceAttitude==='4'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceAttitude==='5'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
      </el-form-item>
      <el-form-item label="任务达成" prop="professional">
        <div v-if="recordInfo.professional==='0'||recordInfo.professional===''"></div>
        <div style="font-size:18px" v-if="recordInfo.professional==='1'">
          <i class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.professional==='2'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.professional==='3'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.professional==='4'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.professional==='5'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
      </el-form-item>
      <el-form-item label="响应速度" prop="serviceSpeed">
        <div v-if="recordInfo.serviceSpeed==='0'||recordInfo.serviceSpeed===''"></div>
        <div style="font-size:18px" v-if="recordInfo.serviceSpeed==='1'">
          <i class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceSpeed==='2'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceSpeed==='3'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceSpeed==='4'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
        <div style="font-size:18px" v-if="recordInfo.serviceSpeed==='5'">
          <i class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
          <i style="padding-left:5px" class="el-icon-star-off"></i>
        </div>
      </el-form-item>
      <el-form-item label="描述" prop="content">
        <el-input style="width:200px" type="textarea" placeholder v-model="recordInfo.content"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'ReviewStaticDetailBaseInfo',
  data() {
    return {
      loading: false,
      rules: {}
    };
  },
  components: {
    BizGrid
  },
  props: {
    recordInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {},
  created() {},
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
</style>
