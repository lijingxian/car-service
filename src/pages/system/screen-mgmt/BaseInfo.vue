<template>
  <biz-grid class="base-info-screen">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="130px" size="small" v-loading="loading">
      <el-form-item label="投屏名称" prop="name">
        <el-input placeholder="智能到店售后展示" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="type">
        <el-radio label="0" v-model="form.type">智能到店</el-radio>
      </el-form-item>
      <el-form-item label="播报内容" prop="content">
        <el-input v-model="form.content" placeholder="<车牌号><会员等级>车主到店，请<顾问姓名>顾问前往接待" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="播放页面时间" prop="duration">
        <div slot="label" style="float:right">
          播放页面时间
          <el-button type="text" size="small" v-popover:time>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="time" placement="bottom-start" width="300" trigger="hover">
            客户车辆到店后，电视播放页面停留时间
          </el-popover>
        </div>
        <el-input v-model="form.duration">
          <template slot="append">秒</template>
        </el-input>
      </el-form-item>
      <el-form-item label="空闲播放视频" prop="videos">
        <div slot="label" style="float:right">
          空闲播放视频
          <el-button type="text" size="small" v-popover:videos>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="videos" placement="bottom-start" width="300" trigger="hover">
            无客户到店时，电视屏幕轮播的视频内容
          </el-popover>
        </div>
        <BizVideoUploadName v-model="form.videos" @handleSuccess="handleSuccess"></BizVideoUploadName>
      </el-form-item>
      <el-form-item label="电视投屏" prop="url" v-if="id">
        <div slot="label" style="float:right">
          电视投屏
          <el-button type="text" size="small" v-popover:UnionType>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="UnionType" placement="bottom-start" width="300" trigger="hover">
            将当前屏幕展示内容分屏至电视屏幕上
          </el-popover>
        </div>
        <el-button type="primary" size="mini" @click="play">全屏播放</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="" :visible.sync="dialogVisibleScreen" @close="closed" append-to-body :fullscreen="true"
      custom-class="fullScreen-dialog">
      <full-screen :video="form.videos" :itemId="form.id" :duration="form.duration" :content="form.content" :open="dialogVisibleScreen" ref="fullscreen">
      </full-screen>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import FullScreen from './FullScreen';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import BizVideoUploadName from '@/components/BizForm/BizVideoUploadName';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      dialogVisibleScreen: false,
      open: false,
      list: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        store: '',
        id: '',
        type: '0',
        name: '',
        content: '',
        duration: '',
        videos: []
      },
      rules: {
        name: [{ required: true, message: '请输入投屏名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类别', trigger: 'blur' }],
        content: [{ required: true, message: '请输入播报内容', trigger: 'blur' }],
        duration: [
          { required: true, message: '请输入播放页面时间', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '时间格式错误', trigger: 'blur' }
        ],
        videos: [
          { required: true, message: '请上传空闲播放视频', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.form.videos.length > 0) {
                callback();
              } else {
                callback(new Error('请上传空闲播放视频'));
              }
            }
          }
        ]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BizVideoUploadName, FullScreen },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        this.form = this.getDefaultModel();
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
    handleSuccess() {
      this.$refs.form.clearValidate('videos');
    },
    getDefaultModel() {
      return {
        store: this.getUser.shop.id,
        id: '',
        type: '0',
        name: '',
        content: '',
        duration: '',
        videos: []
      };
    },
    closed() {
      this.dialogVisibleScreen = false;
    },
    play() {
      if (this.form.videos.length > 0) {
        this.dialogVisibleScreen = true;
      } else {
        this.$message.warning('请上传视频');
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.store = this.getUser.shop.id;
          if (!this.id) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        id: this.id
      };
      http
        .get('/admin/advertising/advertising.jhtml', params)
        .then(data => {
          this.form = Object.assign(this.getDefaultModel(), data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    create() {
      http
        .post('/admin/advertising/advertising.jhtml', this.form)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      http
        .put('/admin/advertising/advertising.jhtml', this.form)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.fullScreen-dialog {
  .el-dialog__header {
    position: relative;
    z-index: 1;
  }
}
.base-info-screen {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 60%;
  }
  .el-select {
    width: 100%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
