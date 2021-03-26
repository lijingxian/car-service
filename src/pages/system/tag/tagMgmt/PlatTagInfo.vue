<template>
  <biz-grid class="plat-tag-info" v-loading="loading">
    <div class="top-container">
      <el-button type="primary" size="small" @click="onAdd" v-if="getAddBtnShow">新增</el-button>
      <el-input class="search-input" placeholder="请输入标签名称" size="small" suffix-icon="el-icon-search"  v-model="serchValue" @change="onChange">
      </el-input>
    </div>
    <div class="tag-container">
      <div v-if="tagList.length===0&&!showSetting" class="empty" :style="styleObject"></div>
      <div class="tag" v-for="tag in tagList" :key="tag.name">
        <el-tag :closable="!(getUser.roleLevel==='shop'&&typeStr==='platform')"  @click="showSet($event, tag)" @close="handleClose(tag)">{{tag.name}}</el-tag>
      </div>
    </div>
    <el-dialog :visible.sync="showSetting" center append-to-body custom-class="set-container" width="500px">
      <el-form ref="form" size="small" label-width="80px" :model="form" :rules="rules" :disabled="getUser.roleLevel==='shop'&&typeStr==='platform'">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="form.type" placeholder="默认无">
            <el-option v-for="(item, index) of typeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签说明" prop="description">
          <el-input v-model="form.description" placeholder="请输入该标签的意义，比如评定标准等" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="operations" @operate="operateHandler" v-if="formBtnShow">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'plat-tag-info',
  data() {
    return {
      serchValue: '',
      loading: false,
      showSetting: false,
      curTagId: '',
      formBtnShow: true,
      typeList: [
        { label: '文本型', value: '文本型' },
        { label: '数值型', value: '数值型' },
        { label: '浮点型', value: '浮点型' }
      ],
      operations: [
        {
          label: '取消',
          name: 'cancel',
          type: ''
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: '',
        type: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'change' }
        ]
      },
      tagList: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    typeStr: {
      type: String
    }
  },
  components: { BizGrid, BizSaveButton },
  computed: {
    ...mapGetters(['getUser']),
    styleObject() {
      return {
        position: 'absolute',
        top: '65px',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 50% no-repeat'
      };
    },
    getAddBtnShow() {
      if (this.getUser.roleLevel === 'platform') {
        // 平台运营角色
        if (this.typeStr === 'platform') {
          return true;
        } else if (this.typeStr === 'shop') {
          return false;
        } else if (this.typeStr === 'member') {
          return false;
        }
      } else if (this.getUser.roleLevel === 'shop') {
        // 店铺运营角色
        if (this.typeStr === 'platform') {
          return false;
        } else if (this.typeStr === 'shop') {
          return true;
        } else if (this.typeStr === 'member') {
          return false;
        }
      }
      return false;
    },
    getType() {
      let type = '';
      this.typeList.forEach((item, index) => {
        if (item.value === this.form.type) {
          type = index.toString();
        }
      });
      return type;
    }
  },
  watch: {
    itemId(newValue) {
      if (newValue.id) {
        this.getTagList();
      }
    },
    typeStr(newValue) {
      if (newValue) {
        this.getTagList();
      }
    }
  },
  methods: {
    getDefaultFormData() {
      return {
        name: '',
        type: '',
        description: ''
      };
    },
    clearForm() {
      // this.$refs.form.resetFields();
      this.showSetting = false;
    },
    onChange() {
      this.getTagList();
    },
    setFormBtnShow() {
      if (this.getUser.roleLevel === 'platform') {
        // 平台运营角色
        if (this.typeStr === 'platform') {
          this.operations[1].label = '保存';
          this.operations[1].name = 'save';
        } else if (this.typeStr === 'shop') {
          this.operations[1].label = '转化为平台标签';
          this.operations[1].name = 'tansformPlatTag';
        } else if (this.typeStr === 'member') {
          this.operations[1].label = '转化为平台标签';
          this.operations[1].name = 'tansformPlatTag';
        }
        this.formBtnShow = true;
      } else if (this.getUser.roleLevel === 'shop') {
        // 店铺运营角色
        if (this.typeStr === 'platform') {
          this.operations[1].label = '保存';
          this.operations[1].name = 'save';
          this.formBtnShow = false;
        } else if (this.typeStr === 'shop') {
          this.operations[1].label = '保存';
          this.operations[1].name = 'save';
          this.formBtnShow = true;
        } else if (this.typeStr === 'member') {
          this.operations[1].label = '转化为店铺标签';
          this.operations[1].name = 'tansformShopTag';
          this.formBtnShow = true;
        }
      }
    },
    cancel() {
      this.showSetting = false;
    },
    showSet(e, tag) {
      console.log('123');
      this.curTagId = tag.id;
      // this.$refs.form.resetFields();
      this.form = this.getDefaultFormData();
      this.getInfo();
      this.showSetting = true;
    },
    onAdd() {
      this.curTagId = '';
      // this.$refs.form.resetFields();
      this.form = this.getDefaultFormData();
      this.showSetting = true;
    },
    operateHandler(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.curTagId) {
            this.updateTag();
          } else {
            this.addTag();
          }
        }
      });
    },
    handleClose(tag) {
      this.deleteTag(tag);
    },
    tansformPlatTag() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.showSetting = false;
          this.transfromToPlatform();
        }
      });
    },
    tansformShopTag() {

    },
    transfromToPlatform() {
      this.loading = true;
      let param = {
        id: this.curTagId,
        name: this.form.name,
        type: this.form.type,
        description: this.form.description,
        tagCategory: {
          id: this.itemId.id
        }
      };

      http
        .post(urls.systemSetting.transfromToPlatform, param)
        .then(data => {
          console.log(data);
          this.loading = false;
          this.$message.success('操作成功');
          this.getTagList();
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    getInfo() {
      this.loading = true;
      let param = {
        id: this.curTagId
      };

      http
        .get(urls.systemSetting.deleteTag, param)
        .then(data => {
          console.log('获取标签信息', data);
          this.loading = false;
          this.form.name = data.data.name;
          this.form.type = data.data.type ? this.typeList[parseInt(data.data.type)].value : '';
          this.form.description = data.data.description;
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    updateTag() {
      this.loading = true;
      let param = {
        id: this.curTagId,
        name: this.form.name,
        type: this.getType,
        description: this.form.description
      };

      http
        .put(urls.systemSetting.deleteTag, param)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('operationSuccess');
          this.getTagList();
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    addTag() {
      this.loading = true;
      let param = {
        name: this.form.name,
        type: this.getType,
        description: this.form.description,
        hierarchy: this.getHierarchy(),
        shopId: this.getUser.shop.id || '',
        tagCategory: {
          id: this.itemId.id
        }
      };

      http
        .post(urls.systemSetting.deleteTag, param)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('operationSuccess');
          this.getTagList();
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    deleteTag(tag) {
      this.loading = true;
      let param = {
        ids: [tag.id]
      };

      http
        .delete(urls.systemSetting.deleteTag, param)
        .then(data => {
          this.loading = false;
          console.log(data);
          this.$message.success('操作成功');
          this.$emit('operationSuccess');
          this.getTagList();
        })
        .catch(error => {
          this.loading = false;
          this.$message(error.errorMessage);
        });
    },
    getHierarchy() {
      switch (this.typeStr) {
        case 'platform':
          return '0';
        case 'shop':
          return '1';
        case 'member':
          return '4';
        default:
          return '0';
      }
    },
    getTagList() {
      this.loading = true;
      this.showSetting = false;
      this.tagList = [];
      let param = {
        tagCategoryId: this.itemId.id,
        searchValue: this.serchValue,
        hierarchy: this.getHierarchy(),
        shopId: window.top.SHOP_ID || ''
      };

      http
        .get(urls.systemSetting.tagList, param)
        .then(data => {
          console.log('标签分类下标签列表', data);
          this.loading = false;
          this.tagList = data.content;
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    }
  },
  created() {
    this.setFormBtnShow();
  }
};
</script>

<style lang="scss">
.plat-tag-info {
  padding: 20px;
  .top-container{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-input{
      width: 60%;
    }
  }

  .tag-container{
    width: 100%;
    margin: 20px 0;
    display: inline-block;
    height: 230px;
    overflow-y: auto;
    position: relative;
    .tag{
      margin: 0 5px 5px 0;
      cursor: pointer;
      float: left;
    }

    .empty{
      margin: 50px;
      text-align: center;
      font-size: 15px;
      color: #929292;
    }
  }
}
</style>
