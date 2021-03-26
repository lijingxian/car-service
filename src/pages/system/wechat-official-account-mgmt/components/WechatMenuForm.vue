<template>
  <div class="wechat-menu-form">
    <el-form ref='wechatMenu' size="small" label-position="right" label-width="150px">
      <el-form-item>
        <el-button type="primary" @click.stop="addMenu" :disabled="wechatMenuList.length != 0">{{ menuPosition === 0 ? "添加左侧一级菜单" : menuPosition === 1 ? "添加中间一级菜单" : "添加右侧一级菜单" }}</el-button>
      </el-form-item>
      <div v-for="item in wechatMenuList" :key="item.number">
        <el-form-item label="菜单内容" required>
          <el-radio v-model="item.type" label="0">跳转网页</el-radio>
          <el-radio v-model="item.type" label="1">跳转小程序</el-radio>
        </el-form-item>
        <el-form-item :label="getNameLable(item.number)" required>
          <el-input placeholder="请输入" v-model="item.name" style="width: 240px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="小程序appid" required v-if="item.type==='1'">
          <el-input placeholder="请输入" v-model="item.appid" style="width: 240px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="小程序页面路径" required v-if="item.type==='1'">
          <el-input placeholder="请输入" v-model="item.pagepath" style="width: 240px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="备用页面路径" required v-if="item.type==='1'">
          <el-input placeholder="请输入" v-model="item.url" style="width: 240px;" clearable></el-input>
        </el-form-item>
        <el-form-item :label="getUrlLable(item.number)" required  v-if="item.type==='0'">
          <el-input placeholder="请输入" v-model="item.url" style="width: 240px;" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="item.useOpenAuth" :true-label="'true'" :false-label="'false'">是否使用OAuth2.0授权</el-checkbox>
          <el-button type="danger" icon="el-icon-delete" @click.stop="deleteMenu(item.number)" size="mini" round></el-button>
        </el-form-item>
        <el-form-item v-if="item.number == '0'">
          <el-button type="primary" @click.stop="addMenu">添加二级菜单</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'WechatMenuForm',
  components: {},
  props: {
    menuPosition: {
      type: Number,
      default() {
        return 0;
      }
    },
    wechatMenuList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      console.log('测试Debug');
    },
    deleteMenu(number) {
      this.$emit('deleteMenu', number);
    },
    addMenu() {
      // 存在一级菜单的情况下添加二级菜单，需要清空一级菜单的url
      if (
        this.wechatMenuList.length !== 1 ||
        this.wechatMenuList[0].url === ''
      ) {
        this.$emit('addMenu');
      } else {
        this.$confirm(
          '添加二级菜单后需要清空一级菜单url，否则可能导致公众号更新或者修改失败，确定要继续吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.$emit('addMenu');
          })
          .catch(() => {});
      }
    },
    getNameLable(number) {
      if (number === '0') {
        if (this.menuPosition === 0) {
          return '左侧一级菜单：';
        } else if (this.menuPosition === 1) {
          return '中间一级菜单：';
        } else if (this.menuPosition === 2) {
          return '右侧一级菜单：';
        } else {
          return '左侧一级菜单：';
        }
      } else {
        return '二级菜单：';
      }
    },
    getUrlLable(number) {
      if (number === '0') {
        return '一级菜单url：';
      } else {
        return '二级菜单url：';
      }
    }
  }
};
</script>

<style lang="scss">
.wechat-menu-form {
  .el-button {
    margin-left: 20px;
  }
}
</style>
