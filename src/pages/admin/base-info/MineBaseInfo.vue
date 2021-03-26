<template>
  <biz-grid class="mine__base-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate"></biz-header>
    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :xs="20" :sm="18" :md="18" :lg="18" :xl="18">
        <el-card>
          <div class="title">账号信息</div>
          <el-row :gutter="20">
            <el-col>
              <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
                <el-form-item label="用户头像">
                  <BizAvatarUploaderNew v-model="formModel.head" @uploadSuccess="uploadSuccess"></BizAvatarUploaderNew>
                </el-form-item>
                <el-form-item label="用户名">
                  <span style="color: #606266;">{{formModel.userName}}</span>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formModel.name"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="formModel.mobile"></el-input>
                </el-form-item>
                <el-form-item label="默认店铺" prop="defaultShop" v-if="formModel.shop && formModel.shop.name">
                  <el-radio-group v-model="formModel.shop.id" @change="shopChange">
                    <el-radio-button v-for="(manageShop,index) in formModel.manageShops" :key="index" :label="manageShop.id">
                      {{manageShop.name}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="20" :sm="18" :md="18" :lg="18" :xl="18">
        <el-card>
          <div class="title">店内信息</div>
          <el-row :gutter="20">
            <el-col>
              <el-form size="small" label-width="110px" :model="formModel">
                <el-form-item label="角色">
                  <span v-for="role in formModel.roleDatas" :key="role.id"
                    style="margin-right: 20px; color: #606266;">{{role.name}}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{formModel.isEnabled === '1' ? '启用' : '停用'}}</span>
                </el-form-item>
                <el-form-item label="所属运营商">
                  <span v-for="(name, index) in formModel.companyName" :key="index"
                    style="margin-right: 20px; color: #606266;">{{name}}</span>
                </el-form-item>
                <el-form-item label="所属店铺" v-if="formModel.shop && formModel.shop.name">
                  <span style="color: #606266;">{{formModel.shop.name}}</span>
                </el-form-item>
                <el-form-item label="功能权限">
                  <el-tabs type="border-card" v-model="activeTab">
                    <el-tab-pane class="role-pane" v-for="(list, index) in authorityList" :key="list.id" :label="list.name"
                      :name="String(index)">
                      <el-tree ref="tree" node-key="id" :props="treeProps" :data="list.children"></el-tree>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { mineBaseInfo as service } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const listData = {
  treeProps: {
    label: 'name',
    children: 'children'
  },
  activeTab: '0',
  authorityList: [],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ]
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    shop: {},
    head: '/resources/admin/images/Avatar.png'
  };
};
// 表单相关信息
const formData = {
  data: {
    defaultAvatar: '/resources/admin/images/Avatar.png',
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    query() {
      http
        .get(service.baseInfo.profile, {})
        .then(data => {
          this.loading = true;
          this.formModel = data.content;
          this.formModel.head = data.content.head || this.defaultAvatar;
          // let selectedSubAuthority = [];
          for (let i = 0; i < data.content.manageShops.length; i++) {
            if (data.content.shop.id === data.content.manageShops[i].id) {
              this.authorityList = this.formatAuthList(data.content.manageShops[i].authorityTree);
              this.authorityList.forEach((list, index) => {
                let child = [];
                if (list.children) {
                  list.children.forEach((subList, subindex) => {
                    for (const selected of data.content.manageShops[i].authorities) {
                      if (subList.id === selected.id) {
                        child.push(subList);
                      }
                    }
                    if (subList.children) {
                      let subChild = [];
                      subList.children.forEach((subsubList, subsubindex) => {
                        for (const selected of data.content.manageShops[i].authorities) {
                          if (subsubList.id === selected.id) {
                            subChild.push(subsubList);
                          }
                        }
                        if (subsubList.children) {
                          let subsubChild = [];
                          subsubList.children.forEach((subsubsubList, subsubsubindex) => {
                            for (const selected of data.content.manageShops[i].authorities) {
                              if (subsubsubList.id === selected.id) {
                                subsubChild.push(subsubsubList);
                              }
                            }
                          });
                          subsubList.children = subsubChild;
                        }
                      });
                      subList.children = subChild;
                    }
                  });
                  list.children = child;
                }
              });
            }
          }
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatAuthList(authList) {
      let listCopy = authList.concat();
      const formatList = listArr => {
        listArr.forEach(list => {
          if (!list.keyword) {
            // 非权限id格式修改, 方式与权限id重复
            // list.id = `${list.id}`;
          }
          let children = [];
          let childArr = ['child', 'authorities', 'subAuthority'];
          for (let index in childArr) {
            if (list[childArr[index]]) {
              children = children.concat(list[childArr[index]]);
              delete list[childArr[index]];
            }
          }
          if (children.length) {
            list.children = children;
            formatList(list.children);
          }
        });
      };
      formatList(authList);
      console.log(authList);
      return listCopy;
    },
    getAuthList(list) {},
    uploadSuccess(url) {
      this.$set(this.formModel, 'head', url);
    },
    shopChange(shopId) {
      this.formModel.manageShops.map(item => {
        if (item.id === shopId) {
          this.formModel.roleDatas = item.roles;
          this.activeTab = '0';
          this.authorityList = this.formatAuthList(item.authorityTree);
          this.authorityList.forEach((list, index) => {
            if (list.children) {
              let child = [];
              list.children.forEach((subList, subindex) => {
                for (const selected of item.authorities) {
                  if (subList.id === selected.id) {
                    child.push(subList);
                  }
                }
                if (subList.children) {
                  let subChild = [];
                  subList.children.forEach((subsubList, subsubindex) => {
                    for (const selected of item.authorities) {
                      if (subsubList.id === selected.id) {
                        subChild.push(subsubList);
                      }
                    }
                    if (subsubList.children) {
                      let subsubChild = [];
                      subsubList.children.forEach((subsubsubList, subsubsubindex) => {
                        for (const selected of item.authorities) {
                          if (subsubsubList.id === selected.id) {
                            subsubChild.push(subsubsubList);
                          }
                        }
                      });
                      subsubList.children = subsubChild;
                    }
                  });
                  subList.children = subChild;
                }
              });
              list.children = child;
            }
          });
        }
      });
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      let obj = this.formModel;
      obj.roleIds = obj.roleDatas.map(item => {
        return item.id;
      });
      return Object.assign({}, obj);
      // return {
      //   id: this.formModel.id,
      //   name: this.formModel.name,
      //   mobile: this.formModel.mobile
      // };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          http
            .put(service.baseInfo.profile, this.getSaveParams())
            .then(data => {
              this.$message.success('保存成功');
              // window.location.reload();
            })
            .catch(errData => {
              this.loading = false;
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};

export default {
  name: 'MineBaseInfo',
  components: {
    BizGrid,
    BizHeader,
    BizAvatarUploaderNew
  },
  data() {
    return {
      ...listData,
      ...formData.data,

      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        defaultShop: [
          {
            required: true,
            validator: (rule, rules, callback) => {
              if (this.formModel.shop.id) {
                callback();
              } else {
                callback(new Error('请选择默认店铺'));
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
.mine__base-info {
  .title {
    font-size: 16px;
    color: #606266;
    border-left: 3px solid #ff7300;
    margin-left: 20px;
    padding-left: 15px;
    margin-top: 30px;
    margin-bottom: 25px;
  }
}
</style>
