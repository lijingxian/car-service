<template>
  <biz-grid class="tag-class-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="130px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="群组名称" prop="name">
        <el-input v-model="formModel.name"></el-input>
      </el-form-item>
      <el-form-item label="当前群组已有成员">
        <el-checkbox-group v-model="formModel.accountIds">
          <el-checkbox-button v-for="item in excutiveList" :label="item.id" :key="item.id"
            v-show="formModel.accountIds.indexOf(item.id) >= 0">
            <i class="el-icon-circle-close" style="position:absolute;top:0;right:0" v-show="item.id===showId" @mouseout="showId=''"></i>
            <div class="customer-info">
              <img v-if="item.head" :src="item.head"  @mouseover="hoverHandle(item)"/>
              <img v-else :src="defaultAvatar"  @mouseover="hoverHandle(item)"/>
              <div class="wrapper">
                <div class="title">{{item.name}}</div>
                <div class="gender">
                  <span>{{item.roleDatas&&item.roleDatas.length>0?item.roleDatas[0].name:''}}</span>
                </div>
              </div>
            </div>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="可添加成员">
        <el-checkbox-group v-model="formModel.accountIds">
          <el-checkbox-button v-for="item in excutiveList" v-show="formModel.accountIds.indexOf(item.id) < 0" :label="item.id"
            :key="item.id">
            <i class="el-icon-circle-plus" style="position:absolute;top:0;right:0" v-show="item.id===showId" @mouseout="showId=''"></i>
            <div class="customer-info">
              <img v-if="item.head" :src="item.head"  @mouseover="hoverHandle(item)"/>
              <img v-else :src="defaultAvatar"  @mouseover="hoverHandle(item)"/>
              <div class="wrapper">
                <div class="title">{{item.name}}</div>
                <div class="gender">
                  <span>{{item.roleDatas&&item.roleDatas.length>0?item.roleDatas[0].name:''}}</span>
                </div>
              </div>
            </div>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import defaultAvatar from '@/assets/images/default_user.png';
import { mapGetters } from 'vuex';
import service from '@/service/customer-service/group-mgmt/groupBaseInfo';

export default {
  name: 'GroupBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      showId: '',
      defaultAvatar: defaultAvatar,
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:group.edit']
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入群组名称', trigger: 'blur' },
          { max: 20, message: '分组名称不超过20字', trigger: 'blur' }
        ]
      },
      formModel: this.getDefaultModel(),

      excutiveList: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    hoverHandle(item) {
      console.log(12);
      this.showId = item.id;
    },
    query() {
      this.loading = true;
      service.query(
        {
          isInit: this.itemId.id ? '0' : '1',
          id: this.itemId.id
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.data);
          this.formModel = obj;
          this.excutiveList = this.formModel.members.concat(this.formModel.otherMembers);
          this.formModel.members.map(item => {
            this.formModel.accountIds.push(item.id);
          });
          this.$refs.form.resetFields();

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.loading = false;
        }
      );
    },
    getSaveParams() {
      let arr = [];
      this.formModel.accountIds.forEach(item => {
        arr.push({ id: item });
      });
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        members: arr
      };
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        accountIds: []
      };
    },

    operateHandler(name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleUploadSuccess(url) {
      this.formModel.cover = url;
    },
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
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
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
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
    }
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal && nVal.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
.tag-class-mgmt__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        margin-top: 15px;
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
  .biz-scroller {
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;

      .el-checkbox-button {
        margin-right: 10px;

        .el-checkbox-button__inner {
          display: inline-block;
          border: none;
          text-align: center;
          padding: 10px;

          img {
            display: block;
            margin: 0 auto 10px;
            width: 48px;
            height: 48px;
          }

          p {
            margin: 0;
            width: 60px;
            word-break: break-word;
            white-space: normal;
          }
        }

        &.is-checked {
          .el-checkbox-button__inner {
            background: #fff;
            color: #606266;
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
