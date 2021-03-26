<template>
  <biz-grid class="membership-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :disabled="!isEdit" ::inline-message="true">
      <el-form-item label="情感状态" prop="emotionalState">
        <el-select v-model="formModel.emotionalState" clearable>
          <el-option v-for="item in emotionalStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="家庭身份" prop="familialIdentity">
        <el-select v-model="formModel.familialIdentity" clearable>
          <el-option v-for="item in familialIdentityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="社会身份" prop="socialIdentity">
        <el-select v-model="formModel.socialIdentity" clearable>
          <el-option v-for="item in socialIdentityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="formModel.education" clearable>
          <el-option v-for="item in educationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收入状况" prop="incomeState">
        <el-select v-model="formModel.incomeState" clearable>
          <el-option v-for="item in incomeStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
// import BizAreaSelect from '@/components/BizAreaSelect';
import vehicleBaseInfo from '@/service/vehicle-mgmt/VehicleBaseInfo';
import urls, { membershipMgmt as service } from '@/common/urls';
import http from '@/common/http';
// import urlUtil from '@/utils/url';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const initData = {
  data: {
    activeTab: ['baseInfo'],
    /** 情感状态：0单身贵族、1热恋期、2有家室。（前两个对应未婚，第三个对应已婚） */
    emotionalStateList: [
      { value: '0', label: '单身贵族' },
      { value: '1', label: '热恋期' },
      { value: '2', label: '有家室' }
    ],
    /** 家庭身份：0宝妈、1宝爸、2我还是个宝宝（前两个为已育，第三个为未育） */
    familialIdentityList: [
      { value: '0', label: '宝妈' },
      { value: '1', label: '宝爸' },
      { value: '2', label: '我还是个宝宝' }
    ],
    /** 社会身份：0白领、1蓝领、2在校学生、3自由职业、4创业者、5农民、6无业游民 */
    socialIdentityList: [
      { value: '0', label: '白领' },
      { value: '1', label: '蓝领' },
      { value: '2', label: '在校学生' },
      { value: '3', label: '自由职业' },
      { value: '4', label: '创业者' },
      { value: '5', label: '农民' },
      { value: '6', label: '无业游民' }
    ],
    /** 学历：0高中及以下、1专科、2本科、3研究生、4博士生 */
    educationList: [
      { value: '0', label: '高中及以下' },
      { value: '1', label: '专科' },
      { value: '2', label: '本科' },
      { value: '3', label: '研究生' },
      { value: '4', label: '博士生' }
    ],
    /** 收入状况：0入不敷出、1收支平衡、2小康家庭、3富裕家庭、4财务自由 */
    incomeStateList: [
      { value: '0', label: '入不敷出' },
      { value: '1', label: '收支平衡' },
      { value: '2', label: '小康家庭' },
      { value: '3', label: '富裕家庭' },
      { value: '4', label: '财务自由' }
    ],
    filters: [
      {
        type: 'input',
        label: '',
        placeholder: '请输入标签名称',
        value: ''
      }
    ],
    tagClass: [],
    memberTags: [],
    showSelecTags: false,
    showNewTag: false,
    typeList: [
      { label: '文本型', value: '文本型' },
      { label: '数值型', value: '数值型' },
      { label: '浮点型', value: '浮点型' }
    ],
    operationsTag: [
      {
        label: '取消',
        name: 'cancelTag',
        type: ''
      },
      {
        label: '保存',
        name: 'saveTag',
        type: 'primary'
      }
    ],
    formTag: {
      name: '',
      type: '',
      description: ''
    },
    rulesTag: {
      name: [{ required: true, message: '请输入标签名称', trigger: 'change' }]
    },
    brandList: [],
    seriesList: [],
    modeList: [],
    tagTypeOptions: [],
    tagOptions: [],
    selectTag: [
      {
        id: '',
        name: ''
      }
    ],
    showMore: false,
    arryList: [],
    tagOperations: [
      { label: '取消', name: 'cancel' },
      { label: '确认选择', name: 'confirm', type: 'primary' }
    ],
    operations: [
      {
        label: '保存',
        name: 'save',
        type: 'primary'
      }
    ],
    consultant: [],
    areaId: '1568',
    areas: [],
    options: [],
    cityList: [],
    sourceList: [
      { value: '0', label: '推荐注册' },
      { value: '1', label: '潜客转化' },
      { value: '2', label: '正常注册' },
      { value: '3', label: '后台创建' },
      { value: '4', label: '其他' }
    ]
  },
  events: {
    handleOperate(name) {
      this[name]();
    },
    tagOperate(name) {
      this[name]();
    }
  },
  methods: {}
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    gender: '2',
    enableState: '1',
    password: '123456',
    area: { id: '1568' },
    consultant: { id: '' },
    areaId: '1568',
    shopTags: [],
    memberType: '0',
    enterpriseName: '',
    enterprise: '',
    contactPerson: '',
    contactMobile: '',
    defaultCarInfo: {
      plateNumber: '',
      brand: '',
      series: '',
      type: '',
      vin: ''
    },
    moveCarCode: '',
    emotionalState: '',
    familialIdentity: '',
    socialIdentity: '',
    education: '',
    incomeState: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel(),
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    }
  },
  events: {
    handleAreaChanged(areaId) {
      console.log(222);
      this.formModel.area.id = areaId;
    },
    filterDataChange(val) {
      if (this.filters[0].value === '') {
        this.tagTypeChange(['']);
      } else {
        let url;
        let params = {
          tagCategoryId: this.tagClass[0] !== '' ? this.tagClass[0] : '226',
          searchValue: this.filters[0].value
        };
        if (this.getUser.roleLevel === 'platform') {
          url = urls.systemSetting.getPlatformTags;
        } else if (this.getUser.roleLevel === 'shop') {
          url = urls.systemSetting.storeTags;
          params.shopId = window.top.SHOP_ID || '';
        }
        http
          .get(url, params)
          .then(data => {
            this.tagOptions = [];
            for (const iterator of data.content) {
              this.tagOptions.push({
                id: iterator.id,
                name: iterator.name,
                hierarchy: iterator.hierarchy
              });
            }
            this.arryList = data.content;
            console.log(data);
          })
          .catch(errorData => {
            console.warn(errorData);
          });
      }
    }
  },
  methods: {
    getDefaultFormTagData() {
      return {
        name: '',
        type: '',
        description: ''
      };
    },
    addNewTag(tag) {
      for (const iterator of this.selectTag) {
        if (iterator.name === tag.name) {
          this.$message.warning(tag.name + '标签已存在，请重新添加');
          return;
        }
      }
      this.selectTag.push(tag);
    },
    cancelTag() {
      this.showNewTag = false;
    },
    mobileBlur() {
      if (!this.formModel.id && !this.formModel.nickname) {
        this.$set(this.formModel, 'nickname', this.formModel.mobile);
      }
      if (!this.formModel.id && !this.formModel.userName) {
        this.$set(this.formModel, 'userName', this.formModel.mobile);
      }
      this.$refs.form.clearValidate();
    },
    handleDeleteClick(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete('/admin/member/relateShop.jhtml', { shopId: row.id, id: this.itemId.id })
          .then(data => {
            this.formModel.shops.splice(this.formModel.shops.indexOf(row), 1);
            this.$message.success('删除成功');
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.formModel.defaultCarInfo.series = '';
      this.formModel.defaultCarInfo.type = '';
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.formModel.defaultCarInfo.type = '';
    },
    querySeriesList(val) {
      vehicleBaseInfo.querySeriesList(
        { brand: val },
        data => {
          this.seriesList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryBrandList() {
      vehicleBaseInfo.queryBrandList(
        {},
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(val) {
      vehicleBaseInfo.queryTypeList(
        { series: val, brand: this.formModel.defaultCarInfo.brand },
        data => {
          this.modeList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    cancel() {
      this.showSelecTags = false;
    },
    addTags() {
      this.formTag = this.getDefaultFormTagData();
      this.showNewTag = true;
    },
    operateHandlerTag(name) {
      this[name]();
    },
    saveTag() {
      this.$refs.formTag.validate(valid => {
        if (valid) {
          let tagCategoryId;
          if (this.tagClass.length <= 1) {
            tagCategoryId = { id: '228' };
          } else {
            tagCategoryId = { id: this.tagClass[1] };
          }
          let param = {
            name: this.formTag.name,
            type: this.getType,
            description: this.formTag.description,
            shopId: this.getUser.shop.id || '',
            tagCategory: tagCategoryId,
            hierarchy: this.getUser.roleLevel === 'platform' ? '0' : '1'
          };

          http
            .post(urls.systemSetting.deleteTag, param)
            .then(data => {
              this.loading = false;
              this.$message.success('操作成功');
              this.tagOptions.push(data.data);
              this.showNewTag = false;
            })
            .catch(error => {
              this.loading = false;
              this.$message.warning(error.errorMessage);
            });
        }
      });
    },
    confirm() {
      console.log(this.selectTag);
      if (this.selectTag.length) {
        // this.formModel.shopTags = [];
        // this.tagOptions.map(item => {
        //   this.selectTag.map(tag => {
        //     if (item.id === tag.id) {
        //       this.formModel.shopTags.push({ id: item.id, name: item.name, hierarchy: item.hierarchy, tagCategory: { fullName: item.fullName, description: item.description } });
        //     }
        //   });
        // });
        this.formModel.shopTags = this.selectTag;
      } else {
        this.formModel.shopTags = [];
      }
      this.showSelecTags = false;
    },
    onClickHandle() {
      this.showSelecTags = true;
      this.selectTag = [];
      this.tagClass = [''];
      if (this.formModel.shopTags && this.formModel.shopTags.length > 0) {
        this.formModel.shopTags.forEach((item, index) => {
          this.selectTag.push({
            id: item.id,
            name: item.name,
            deletable: item.deletable,
            description: item.description,
            hierarchy: item.hierarchy,
            tagCategory: item.tagCategory
          });
        });
      } else {
        this.selectTag = [];
      }
      this.tagTypeChange(this.tagClass);
    },
    initModel(model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
        this.$set(this.formModel, 'password', '');
        this.areaId = this.formModel.area.id || '1568';
        this.areas = [];
      } else {
        this.resetModel();
      }
    },
    handleChange(val) {},
    getAreas() {
      http
        .get('/admin/area/cityList.jhtml', {})
        .then(data => {
          this.options = data.areas;
          for (const item of data.areas) {
            item.label = item.name;
            item.value = item.id;
            if (item.children) {
              for (const child of item.children) {
                child.label = child.name;
                child.value = child.id;
              }
            }
          }
          this.areas = [];
          for (const item of data.areas) {
            if (item.children) {
              for (const child of item.children) {
                if (child.id === this.formModel.area.id) {
                  this.areas = [item.id, this.formModel.area.id];
                }
              }
            }
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
      this.areaId = '1568';
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    query(id) {
      this.loading = true;
      let memberId = this.itemId.id;
      if (id) {
        memberId = id;
      }
      http
        .get(service.baseInfo.query, { id: memberId, shopId: window.top.SHOP_ID || '' })
        .then(data => {
          // 设置相关列表
          this.initModel(data.memberData);
          this.getAreas();
          this.checkIfAdmin();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage !== '店铺不存在') this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 检测表单中的专属顾问是否在专属顾问列表中
    checkIfAdmin() {
      console.log(this.consultant);
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['afterSaleAdmin', 'afterSale']
        })
        .then(data => {
          this.consultant = data.dataList;
          if (this.formModel.consultant.id) {
            let flag = true;
            for (let i = 0; i < this.consultant.length; i++) {
              if (this.consultant[i].id === String(this.formModel.consultant.id)) {
                flag = false;
              }
            }
            if (flag) {
              this.consultant.unshift({
                id: this.formModel.consultant.id,
                name: this.formModel.consultant.name
              });
            }
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getConsultant() {
      this.loading = true;
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['afterSaleAdmin', 'afterSale']
        })
        .then(data => {
          this.consultant = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getSaveParams() {
      return {
        token: '',
        shopId: window.top.SHOP_ID || '',
        consultant: { id: this.formModel.consultant.id },
        id: this.formModel.id,
        area: { id: this.formModel.area.id },
        userName: this.formModel.userName,
        mobile: this.formModel.mobile,
        password: this.formModel.password,
        realName: this.formModel.realName,
        nickname: this.formModel.nickname,
        gender: this.formModel.gender,
        birth: dateUtil.dateConverter(this.formModel.birth),
        // zipCode: this.formModel.zipCode,
        enableState: this.formModel.enableState,
        userSource: this.formModel.userSource,
        shopTags: this.formModel.shopTags,
        defaultCarInfo: {
          plateNumber: this.formModel.defaultCarInfo.plateNumber,
          brand: this.formModel.defaultCarInfo.brand,
          series: this.formModel.defaultCarInfo.series,
          type: this.formModel.defaultCarInfo.type,
          vin: this.formModel.defaultCarInfo.vin
        },
        emotionalState: this.formModel.emotionalState,
        familialIdentity: this.formModel.familialIdentity,
        socialIdentity: this.formModel.socialIdentity,
        education: this.formModel.education,
        incomeState: this.formModel.incomeState
      };
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');
            if (!this.formModel.id) {
              this.formModel = this.getDefaultModel();
            }
            this.$emit('operationSuccess');
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            this.$message.warning(errData.errorMessage);
            if (errData.resultCode === '450' || errData.resultCode === '1121') {
              this.query(errData.memberId);
            }
          };
          const final = data => {
            this.loading = false;
          };

          let params = this.getSaveParams();
          if (this.formModel.id) {
            http
              .put(service.baseInfo.update, params)
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post(service.baseInfo.create, params)
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          // this.$message.warning('表单验证失败');
          return false;
        }
      });
    },
    getTagClassList() {
      let url;
      let param = {
        categoryType: '会员标签',
        isIncludeTag: '1'
      };
      if (this.getUser.roleLevel === 'platform') {
        url = urls.systemSetting.platformTagcategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = urls.systemSetting.storeTagcategories;
        param.shopId = window.top.SHOP_ID || '';
      }
      http
        .get(url, param)
        .then(data => {
          let ary = data.content;
          let obj;
          this.tagTypeOptions = [];
          obj = {};
          obj.label = '全部';
          obj.value = '';
          this.tagTypeOptions.push(obj);
          ary.forEach(element => {
            if (element.name !== '流失特征' && element.name !== '消费特征') {
              obj = {};
              obj.label = element.name;
              obj.value = element.id;
              obj.tags = element.tags;
              obj.description = element.description;
              obj.hierarchy = element.hierarchy;
              obj.fullName = '会员标签/' + element.name;
              this.tagTypeOptions.push(obj);
              if (element.children && element.children.length) {
                obj.children = [];
                element.children.forEach(elementOne => {
                  let objOne = {};
                  objOne.label = elementOne.name;
                  objOne.value = elementOne.id;
                  objOne.tags = elementOne.tags;
                  objOne.description = elementOne.description;
                  objOne.hierarchy = elementOne.hierarchy;
                  objOne.fullName = '会员标签/' + element.name + '/' + elementOne.name;
                  obj.children.push(objOne);

                  if (elementOne.children && elementOne.children.length) {
                    objOne.children = [];
                    elementOne.children.forEach(elementTwo => {
                      let objTwo = {};
                      objTwo.label = elementTwo.name;
                      objTwo.value = elementTwo.id;
                      objTwo.tags = elementTwo.tags;
                      objTwo.description = elementTwo.description;
                      objTwo.hierarchy = elementTwo.hierarchy;
                      objTwo.fullName = '会员标签/' + element.name + '/' + elementOne.name + '/' + elementTwo.name;
                      objOne.children.push(objTwo);

                      if (elementTwo.children && elementTwo.children.length) {
                        objTwo.children = [];
                        elementTwo.children.forEach(elementThree => {
                          let objThree = {};
                          objThree.label = elementThree.name;
                          objThree.value = elementThree.id;
                          objThree.tags = elementThree.tags || [];
                          objThree.description = elementThree.description;
                          objThree.hierarchy = elementThree.hierarchy;
                          objThree.fullName =
                            '会员标签/' + element.name + '/' + elementOne.name + '/' + elementTwo.name + '/' + elementThree.name;
                          objTwo.children.push(objThree);
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        })
        .catch(error => {
          if (error.errorMessage !== '店铺不存在') {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    onClose(tag) {
      let ary = this.formModel.shopTags;
      let len = ary.length;
      for (let i = 0; i < len; i++) {
        if (ary[i] === tag) {
          ary.splice(i, 1);
          break;
        }
      }
    },
    tagChange(tag) {},
    onCloseTag(tag, index) {
      this.selectTag.splice(index, 1);
    },
    tagTypeChange(tagTypeArray) {
      let url;
      let tagType = tagTypeArray[tagTypeArray.length - 1];
      if (tagType === '') {
        this.tagOptions = [];
        this.tagTypeOptions.map((tag, index) => {
          if (index > 0) {
            if (tag.tags && tag.tags.length) {
              for (const item of tag.tags) {
                this.tagOptions.push({
                  id: item.id,
                  name: item.name,
                  hierarchy: tag.hierarchy,
                  description: item.description || '',
                  tagCategory: { fullName: tag.fullName }
                });
              }
            }
            if (tag.children && tag.children.length) {
              tag.children.map(elementOne => {
                if (elementOne.tags && elementOne.tags.length) {
                  for (const itemO of elementOne.tags) {
                    this.tagOptions.push({
                      id: itemO.id,
                      name: itemO.name,
                      hierarchy: elementOne.hierarchy,
                      description: itemO.description || '',
                      tagCategory: { fullName: elementOne.fullName }
                    });
                  }
                }
                if (elementOne.children && elementOne.children.length) {
                  elementOne.children.map(elementTwo => {
                    if (elementTwo.tags && elementTwo.tags.length) {
                      for (const itemT of elementTwo.tags) {
                        this.tagOptions.push({
                          id: itemT.id,
                          name: itemT.name,
                          hierarchy: elementTwo.hierarchy,
                          description: itemT.description || '',
                          tagCategory: { fullName: elementTwo.fullName }
                        });
                      }
                    }
                    if (elementTwo.children && elementTwo.children.length) {
                      elementTwo.children.map(elementThree => {
                        if (elementThree.tags && elementThree.tags.length) {
                          for (const itemH of elementThree.tags) {
                            this.tagOptions.push({
                              id: itemH.id,
                              name: itemH.name,
                              hierarchy: elementThree.hierarchy,
                              description: itemH.description || '',
                              tagCategory: { fullName: elementThree.fullName }
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
        this.arryList = this.tagOptions;
      } else {
        let params = {
          tagCategoryId: tagType,
          searchValue: this.filters[0].value
        };
        if (this.getUser.roleLevel === 'platform') {
          url = urls.systemSetting.getPlatformTags;
        } else if (this.getUser.roleLevel === 'shop') {
          url = urls.systemSetting.storeTags;
          params.shopId = window.top.SHOP_ID || '';
        }
        http
          .get(url, params)
          .then(data => {
            this.tagOptions = [];
            for (const iterator of data.content) {
              this.tagOptions.push({
                id: iterator.id,
                name: iterator.name,
                hierarchy: iterator.hierarchy
              });
            }
            this.arryList = data.content;
            console.log(data);
          })
          .catch(errorData => {
            console.warn(errorData);
          });
      }
    }
  }
};

export default {
  name: 'MembershipMgmtBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...initData.data,
      ...formData.data,

      rules: {
        userName: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '用户名只能为数字或字母', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '请输入手机号' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        nickname: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
        realName: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        zipCode: [
          { len: 6, message: '邮编位数错误', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '邮编格式错误', trigger: 'blur' }
        ],
        enableState: [{ required: true, trigger: 'blur', message: '请选择是否启用' }],
        password: [{ required: true, trigger: 'blur', min: 6, max: 16, message: '长度在6-16个字符' }],
        rePassword: [
          { required: false, trigger: 'blur', message: '请再次输入密码' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.password === this.formModel.rePassword) {
                callback();
              } else {
                callback(new Error('两次输入密码不一致'));
              }
            }
          }
        ],
        userSource: [{ required: true, trigger: 'blur', message: '请选择用户来源' }]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  methods: {
    ...formData.methods,
    ...formData.events,

    ...initData.methods,
    ...initData.events
  },
  mounted() {
    console.log(111);
    this.initModel();
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.$el.scrollTop = 0;
      this.$refs.form.clearValidate();
      this.activeTab = ['baseInfo'];
      this.getAreas();
      if (nVal.id) {
        if (nVal.id !== oVal.id) {
          this.getConsultant();
          this.query();
        }
      } else {
        this.getConsultant();
        this.initModel();
      }
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    dateRange: {
      get() {
        return [this.formModel.beginDate, this.formModel.endDate];
      },
      set(newValue) {
        if (newValue) {
          this.formModel.beginDate = newValue[0];
          this.formModel.endDate = newValue[1];
        } else {
          this.formModel.beginDate = '';
          this.formModel.endDate = '';
        }
      }
    },
    getType() {
      let type = '';
      this.typeList.forEach((item, index) => {
        if (item.value === this.formTag.type) {
          type = index.toString();
        }
      });
      return type;
    }
  },
  created() {
    this.getTagClassList();
    this.queryBrandList();
  }
};
</script>

<style lang="scss">
.member-ship-info {
  .el-dialog__title {
    display: block;
    text-align: center;
  }
  .el-input--suffix .el-input__inner {
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }
  .el-select .el-input .el-select__caret {
    line-height: 32px;
  }
  .el-dialog__body {
    min-height: 220px;
    .member-ship-select-tag {
      display: flex;
      justify-content: space-around;
      .handel-name {
        margin-left: 5px;
        margin-bottom: 10px;
      }
      .el-cascader {
        width: 220px;
      }
    }
  }
  .tag-group {
    width: calc(100% - 85px);
    padding-right: 5px;
    .el-tag {
      margin: 5px;
    }
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    .recommend-group {
      width: 100%;
      margin: 0 10px 10px 0;
      padding: 7px 12px;
      border: 1px solid #f4f2f2;
      border-radius: 4px;
      .el-tag {
        max-width: 180px;
        text-overflow: ellipsis;
        line-height: 32px;
        height: 32px;
        margin: 5px;
      }
    }
  }
}
.membership-mgmt__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
  }
  .tag-container {
    .member-tag {
      margin: 0 5px 5px 0;
    }
  }
  .biz-scroller {
    .form-static {
      color: #606266;
    }
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
