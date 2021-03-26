<template>
  <biz-grid class="motorists-club-activity__activity-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="置顶">
        <el-switch v-model="formModel.isTop" active-value="1" inactive-color="#d9d9d9"  active-color="#87d068" inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="车友会名称" prop="fleetId">
        <el-select v-model="formModel.fleetId" placeholder="请选择" style="width: 100%;" :disabled="!!formModel.id">
          <el-option v-for="item in clubList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动封面" prop="cover">
        <biz-avatar-uploader-new v-model="formModel.cover" @uploadSuccess="uploadSuccess">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入活动标题"></el-input>
      </el-form-item>
      <el-form-item label="活动地点" prop="lngBaidu" :value="formModel.lngBaidu">
        <biz-map-pointer v-model="point" :address="formModel.address" @addressChange="handleAddressChange">
        </biz-map-pointer>
      </el-form-item>
      <!-- <el-form-item label="活动时间" prop="endDate" :value="formModel.endDate">
        <el-date-picker v-model="dateRange" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择活动时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="活动开始时间" prop="beginDate">
        <el-date-picker v-model="formModel.beginDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择活动开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间" prop="endDate">
        <el-date-picker v-model="formModel.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择活动结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名截止时间" prop="deadline">
        <el-date-picker type="datetime" placeholder="请选择报名截止时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          v-model="formModel.deadline" style="width: 100%;">
        </el-date-picker>
        <!-- <el-date-picker type="datetime" placeholder="XXXX" value-format="yyyy-MM-dd HH:mm" v-model="formModel.deadline"></el-date-picker> -->
      </el-form-item>
      <el-form-item label="活动类型" prop="type">
        <el-radio-group v-model="formModel.type">
          <el-radio label="0">免费</el-radio>
          <el-radio label="1">收费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动金额" v-show="formModel.type === '1'" prop="amount">
        <el-input placeholder="请输入活动金额" v-model="formModel.amount" type="number" :min="0">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="限制人数" prop="limitNumber">
        <el-input placeholder="请输入内容" v-model="formModel.limitNumber" type="number" min="0">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item label="表单必填" prop="options" :value="formModel.options">
        <tag-manager v-model="formModel.options" :removeHandler="removeHandler"></tag-manager>
      </el-form-item>
      <el-form-item label="活动详情" prop="content" :value="formModel.content">
        <biz-editor ref="editor" v-model="formModel.content" width="330px" :hasVideo="true"></biz-editor>
      </el-form-item>
    </el-form>
    <el-dialog slot="float" append-to-body title="预览" width="450px" class="activity-info__preview" :visible="previewDialogOpen"
      @close="closePreviewDialog">
      <div class="bg" :style="{ background: background}">
        <div class="cpreview">
          <div class="pcontent">
            <div class="pre-logo">
              <img :src="formModel.cover" />
            </div>
            <div class="pre-title">
              {{formModel.title}}
            </div>
            <div class="pre-info">
              <div class="pre-info__item">
                <i class="iconfont biz-icon-shijian1"></i>
                <div>
                  活动日期：
                  <span>{{dateTimeConverter(formModel.beginDate) + ' ~ ' + dateTimeConverter(formModel.endDate)}}</span>
                </div>
              </div>
              <div class="pre-info__item">
                <i class="iconfont biz-icon-shijian"></i>
                <div>
                  报名截止日期：
                  <span>{{dateTimeConverter(formModel.deadline)}}</span>
                </div>
              </div>
              <!-- <div class="pre-info__item">
                <i class="iconfont icon-kongxinxihuan"></i>
                报名费用：
                <span>¥{{formModel}}</span>
              </div> -->
              <div class="pre-info__item">
                <i class="iconfont biz-icon-feiyong"></i>
                <div>
                  活动金额：
                  <span>￥{{formModel.amount > 0 ? formModel.amount : 0}}</span>
                </div>
              </div>
              <div class="pre-info__item">
                <i class="iconfont biz-icon-dingwei"></i>
                <div>
                  活动地址
                  <span>{{formModel.address}}</span>
                </div>
              </div>
              <div class="pre-info__item">
                <i class="iconfont biz-icon-guanyudianpu"></i>
                <div>
                  主办方：
                  <span>{{formModel.fleet ? formModel.fleet.name : ''}}</span>
                </div>
              </div>
            </div>
            <div class="pre-attend">
              已报名
              <strong>{{ formModel.attendNumber || '0' }}</strong>人/限额{{formModel.limitNumber}}人
            </div>
            <div class="pre-content" v-html="formModel.content">
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizMapPointer } from '@/components/BizMapPointer';
import { BizGrid } from '@/components/BizGrid';
import { TagManager } from '@/components/BizTagManager';
import ActivityInfoService from '@/service/motorists-club-activity/ActivityInfo';
import date from '@/utils/date';
import phoneB from '@/assets/images/iphone-b.png';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizEditor } from '@/components/BizEditorH';

export default {
  name: 'ActivityInfo',
  components: {
    BizSaveButton,
    BizGrid,
    TagManager,
    BizEditor,
    BizMapPointer,
    BizAvatarUploaderNew
  },
  data() {
    const lengthValidation = (rule, value, callback) => {
      if (value.length > 0) callback();
      else callback(new Error('请输入表单必填项'));
    };

    const amountValidation = (rule, value, callback) => {
      if (this.formModel.type === '0') {
        callback();
      } else {
        if (value > 0) callback();
        else callback(new Error('请输入正确的活动金额'));
      }
    };

    const coverValidation = (rule, value, callback) => {
      if (this.formModel.cover !== '') {
        callback();
      } else {
        if (value) callback();
        else callback(new Error('请输入活动封面'));
      }
    };
    return {
      isSetting: false,
      loading: false,

      removeHandler: tag => {
        if (tag.isAttend === '1') {
          this.$message.warning('该字段已经有人报名使用，无法删除');
          return false;
        } else {
          return true;
        }
      },
      clubList: [],
      formModel: this.getDefaultModel(),
      previewDialogOpen: false,
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      editorStyle: {
        height: '300px'
      },
      operations: [
        {
          label: '发布',
          name: 'publish',
          type: 'primary'
        },
        {
          label: '预览',
          name: 'preview',
          type: ''
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      fileData: {
        type: '0'
      },
      rules: {
        fleetId: [
          {
            required: true,
            message: '请选择车友会',
            trigger: ['blur', 'change']
          }
        ],
        cover: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: coverValidation
          }
        ],
        title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
        lngBaidu: [{ required: true, message: '请输入正确的地址', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择活动开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择活动结束时间', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择报名截止时间', trigger: 'blur' }],
        content: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
        type: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
        amount: [{ required: true, trigger: 'blur', validator: amountValidation }],
        limitNumber: [
          { required: true, message: '请输入限制人数', trigger: 'blur' },
          { pattern: /^\d+$/, message: '格式错误', trigger: 'blur' }
        ],
        options: [{ required: true, trigger: 'blur', validator: lengthValidation }]
      }
    };
  },
  props: {
    cardId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  created() {
    this.queryClubList();
  },
  methods: {
    uploadSuccess() {
      this.$refs.form.clearValidate(['cover']);
    },
    dateTimeConverter(val) {
      return date.dateTimeConverter(val);
    },
    queryClubList() {
      ActivityInfoService.queryClubList(
        {},
        data => {
          this.clubList = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },

    areaChanged(areaId) {
      this.formModel.area.id = areaId;
    },
    operate(name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.$set(this.formModel, 'address', val);
      if (!val) {
        this.$set(this.formModel, 'latBaidu', '');
        this.$set(this.formModel, 'lngBaidu', '');
      } else {
        this.$refs.form.clearValidate(['lngBaidu']);
      }
    },
    getDefaultModel() {
      return {
        isTop: false,
        cover: '',
        type: '0',
        beginDate: '',
        endDate: '',
        deadline: '',
        content: '',
        options: [{ content: '姓名' }, { content: '电话' }, { content: '人数' }]
      };
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    closePreviewDialog() {
      this.previewDialogOpen = false;
    },
    checkVideo(msg) {
      this.$message.warning(msg);
    },
    // 预览车友会动态
    preview() {
      this.previewDialogOpen = true;
    },
    compareTime(a, b) {
      let arr = a.split(' ');
      let arr1 = arr[0].split('-');
      let arr2 = arr[1].split(':');
      let start = new Date(arr1[0], (arr1[1] - 1), arr1[2], arr2[0], arr2[1], arr2[2]);
      let starts = start.getTime();
      let arrs = b.split(' ');
      let arrs1 = arrs[0].split('-');
      let arrs2 = arrs[1].split(':');
      let end = new Date(arrs1[0], (arrs1[1] - 1), arrs1[2], arrs2[0], arrs2[1], arrs2[2]);
      let ends = end.getTime();
      if (starts >= ends) {
        return true; // 开始时间晚于结束时间
      } else {
        return false; // 开始时间早于结束时间
      }
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.compareTime(this.formModel.beginDate, this.formModel.endDate)) {
            this.$message.warning('活动开始时间不能晚于活动结束时间');
            return;
          }
          if (this.compareTime(this.formModel.deadline, this.formModel.endDate)) {
            this.$message.warning('报名截止时间不能晚于活动结束时间');
            return;
          }
          let params = {
            id: this.formModel.id,
            title: this.formModel.title,
            cover: this.formModel.cover,
            // area: this.formModel.area,
            areaStr: '地区测试',
            address: this.formModel.address,
            beginDate: this.dateTimeConverter(this.formModel.beginDate),
            endDate: this.dateTimeConverter(this.formModel.endDate),
            deadline: this.dateTimeConverter(this.formModel.deadline),
            content: this.formModel.content,
            state: this.formModel.state,
            type: this.formModel.type,
            amount: this.formModel.amount,
            limitNumber: this.formModel.limitNumber,
            options: this.formModel.options,
            isTop: this.formModel.isTop,
            isPublication: this.formModel.isPublication,
            fleet: {
              id: this.formModel.fleetId
            },
            lngBaidu: String(this.formModel.lngBaidu),
            latBaidu: String(this.formModel.latBaidu)
          };

          if (this.formModel.id) {
            ActivityInfoService.update(
              params,
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            ActivityInfoService.add(
              params,
              data => {
                if (this.publishing) {
                  this.publishing = false;
                  this.formModel.id = data.id;
                  this.publish();
                } else {
                  this.$message.success('保存成功');

                  this.$emit('operationSuccess');
                }
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    publish() {
      if (this.formModel.id) {
        ActivityInfoService.publish(
          {
            activityId: this.formModel.id
          },
          data => {
            this.$message.success('发布成功');

            this.$emit('operationSuccess');
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      } else {
        this.publishing = true;
        this.save();
      }
    }
  },
  computed: {
    // dateRange: {
    //   get() {
    //     if (this.formModel.beginDate && this.formModel.endDate) {
    //       return [this.formModel.beginDate, this.formModel.endDate];
    //     } else {
    //       return [];
    //     }
    //   },
    //   set(newValue) {
    //     if (newValue) {
    //       this.formModel.beginDate = newValue[0];
    //       this.formModel.endDate = newValue[1];
    //     } else {
    //       this.formModel.beginDate = '';
    //       this.formModel.endDate = '';
    //     }
    //   }
    // },
    point: {
      get() {
        return {
          lng: this.formModel.lngBaidu,
          lat: this.formModel.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.formModel.lngBaidu = nVal.lng;
          this.formModel.latBaidu = nVal.lat;
        }
      }
    }
  },
  watch: {
    'formModel.options': function(newVal, oldVal) {
      if (newVal) {
        this.$refs.form.clearValidate('options');
      }
    },
    cardId(nVal, oVal) {
      this.operations = [
        {
          label: '发布',
          name: 'publish',
          type: 'primary'
        },
        {
          label: '预览',
          name: 'preview',
          type: 'primary'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ];
      if (nVal.id) {
        this.loading = true;
        ActivityInfoService.query(
          {
            activityId: nVal.id
          },
          data => {
            this.isSetting = true;
            // console.log(data);
            this.formModel = data.fleetActivity;
            this.$set(this.formModel, 'fleetId', this.formModel.fleet.id);

            this.$refs.form.resetFields();

            // 根据当前活动是否是创建状态，来判断是否显示“发布”按钮
            if (this.formModel.state !== 'created') {
              this.operations.shift({
                label: '发布',
                name: 'publish',
                type: 'primary'
              });
            }

            this.loading = false;
            setTimeout(() => {
              let el = this.$refs.form.$el.querySelector('input');
              el.focus();
              el.blur();
            }, 500);
            this.$nextTick(() => {
              this.isSetting = false;
            });
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      } else {
        this.isSetting = true;
        this.resetModel();
        this.$nextTick(() => {
          this.isSetting = false;
        });
        this.$refs.form.resetFields();
      }

      this.publishing = false;
    }
  }
};
</script>

<style lang="scss">
.motorists-club-activity__activity-info {
  padding-top: 20px;
  .biz-save-button {
    float: left;
  }
  .biz-scroller {
  }
}

.activity-info__preview {
  .el-dialog {
    margin-top: 6% !important;
    .el-dialog__body{
      width: 100%;
      .review{
        width: 100%;
        img{
          width: 100%;
        }
      }
    }
  }
  .bg {
    margin: 0 auto;
    position: relative;
    width: 390px;
    height: 653px;

    .cpreview {
      overflow: auto;
      position: absolute;
      width: 354px;
      height: 500px;
      top: 76px;
      left: 18px;
      outline: none;
      background-color: #f8f8f8;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        // background-color: red;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #c2c2c2;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
      .pcontent {
        word-wrap: break-word;
        color: #202020;

        .pre-logo img {
          display: block;
          width: 100%;
          max-height: 400px;
          overflow: hidden;
        }

        .pre-title {
          padding: 0 10px;
          font-weight: bold;
        }

        .pre-info {
          font-size: 12px;
          padding: 0 15px;
          line-height: 1.2;

          .pre-info__item {
            position: relative;
            padding: 8px 0;

            i {
              float: left;
              display: block;
              width: 22px;
              height: 22px;
              text-align: center;
              margin-top: -2px;
              color: #ff7300;
            }

            div {
              margin-left: 30px;
            }
          }
        }

        .pre-attend {
          font-size: 10px;
          margin: 5px 0;
          padding: 10px;
          background: #fff;
          color: #a0a0a0;

          strong {
            font-size: 15px;
            color: #ff7300;
            margin: 0 7px;
          }
        }

        .pre-content {
          font-size: 12px;

          p {
            margin: 0 0 5px;
            line-height: 1.2;
          }
        }
      }
    }
  }
}
</style>
