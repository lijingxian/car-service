<template>
  <biz-grid class="wechat-official-account-mgmt" v-loading="loading">
    <div slot="top">
      <div class="wechat-official-account-mgmt-top">
        <biz-header :operations="operations" @operate="operate">
        </biz-header>
      </div>
    </div>
    <div class="wechatOpen">
      <el-form ref='wechatOpen' size="small" :model="wechatOpenData" :rules="wechatOpenRules" label-position="right" label-width="150px">
        <el-row type="flex">
          <el-col>
            <el-form-item label="店铺名称：">
              <el-select v-model="shopId" placeholder="请选择店铺" @change="changeShopId" style="width: 200px;">
                <el-option v-for="item of shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="微信公众号：" v-if="wechatOpenData.id != ''">
              <el-select v-model="wechatOpenData.id" filterable placeholder="请选择名称" @change="changeWechatOpen" v-if="!edit" style="width: 240px;">
                <el-option v-for="item of wechatOpenDataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-input placeholder="请输入名称" v-model="wechatOpenName" v-if="edit" style="width: 240px;" clearable></el-input>
              <el-button type="primary" @click.stop="editName">{{ edit ? "确定" : "编辑"}}</el-button>
            </el-form-item>
            <el-form-item label="微信公众号：" v-if="wechatOpenData.id == ''">
              <el-input placeholder="请输入名称" v-model="wechatOpenName" style="width: 240px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="微信公众号ID：" prop="showId">
              <el-input placeholder="请输入公众号ID" v-model="wechatOpenData.showId" style="width: 240px;" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="微信原始ID：" prop="wecharId">
              <el-input placeholder="请输入原始ID" v-model="wechatOpenData.wecharId" style="width: 200px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="微信AppID：" prop="appId">
              <el-input placeholder="请输入AppID" v-model="wechatOpenData.appId" style="width: 240px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="微信AppSecret：" prop="appSecret">
              <el-input placeholder="请输入AppSecret" v-model="wechatOpenData.appSecret" style="width: 240px;" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="商户号：" prop="wechatPay.mchId">
              <el-input placeholder="请输入商户号" v-model="wechatOpenData.wechatPay.mchId" style="width: 200px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="API密钥：" prop="wechatPay.apikey">
              <el-input placeholder="请输入API密钥" v-model="wechatOpenData.wechatPay.apiKey" style="width: 240px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="API证书：" prop="wechatPay.apiclientCert">
              <BizAvatarUploaderNew v-model="wechatOpenData.wechatPay.apiclientCert" :fileType="'3'">
              </BizAvatarUploaderNew>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="上传二维码：" prop="qrCodePath">
              <BizAvatarUploaderNew v-model="wechatOpenData.qrCodePath" title="请上传小于64k的以gif,jpeg,jpg,png结尾的图片文件">
              </BizAvatarUploaderNew>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label=" ">
              <el-checkbox v-model="wechatOpenData.isDefault" :true-label="'true'" :false-label="'false'">是否设为默认公众号</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="" prop="">
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content" style="width:900px;margin:0 auto;">
      <div id="app-menu">
        <!-- 预览窗 -->
        <div class="weixin-preview">
          <div class="weixin-hd">
            <div class="weixin-title">{{weixinTitle}}</div>
          </div>
          <div class="weixin-bd">
            <ul class="weixin-menu" id="weixin-menu">
              <li v-for="(btn,i) in menu.button" :key="i" class="menu-item" :class="{current:selectedMenuIndex===i&&selectedMenuLevel()==1}"
                @click="selectedMenu(i,$event)">
                <div class="menu-item-title">
                  <i class="icon_menu_dot"></i>
                  <span>{{ btn.name }}</span>
                </div>
                <ul class="weixin-sub-menu" v-show="selectedMenuIndex===i">
                  <li v-for="(sub,i2) in btn.subMenus" :key="i2" class="menu-sub-item" :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2}"
                    @click.stop="selectedSubMenu(i2,$event)">
                    <div class="menu-item-title">
                      <span>{{sub.name}}</span>
                    </div>
                  </li>
                  <li v-if="btn.subMenus&&btn.subMenus.length<5" class="menu-sub-item" @click.stop="addMenuHandler(2)">
                    <div class="menu-item-title">
                      <i class="icon14_menu_add"></i>
                    </div>
                  </li>
                  <i class="menu-arrow arrow_out"></i>
                  <i class="menu-arrow arrow_in"></i>
                </ul>
              </li>
              <li class="menu-item" v-if="menu.button&&menu.button.length<3" @click="addMenuHandler(1)"> <i class="icon14_menu_add"></i></li>
            </ul>
          </div>
        </div>
        <!-- 主菜单 -->
        <div class="weixin-menu-detail" v-if="selectedMenuLevel()==1">
          <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
            <div class="menu-name">{{menu.button[selectedMenuIndex].name}}</div>
            <div class="menu-del" @click="delMenu">删除菜单</div>
          </div>
          <el-form ref='wechatMenu' size="small" label-position="right" label-width="150px">
            <el-form-item label="菜单名称" required>
              <!-- <el-select v-model="menu.button[selectedMenuIndex].name" allow-create filterable placeholder="请选择" size="small"
                @change="menuSelect(selectedMenuIndex,menu.button[selectedMenuIndex].name)">
                <el-option v-for="item in wechatMenus" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select> -->
              <el-input v-model="menu.button[selectedMenuIndex].name"></el-input>
              <el-button type="primary" size="mini" @click="dialog=true">选择</el-button>
            </el-form-item>
            <el-form-item label="" required>
              <el-checkbox v-model="menu.button[selectedMenuIndex].useOpenAuth" :true-label="'true'" :false-label="'false'">是否使用OAuth2.0授权</el-checkbox>
            </el-form-item>
            <template v-if="menu.button[selectedMenuIndex].subMenus.length==0">
              <el-form-item label="菜单内容" required>
                <el-radio v-model="menu.button[selectedMenuIndex].type" label="0">跳转网页</el-radio>
                <el-radio v-model="menu.button[selectedMenuIndex].type" label="1">跳转小程序</el-radio>
              </el-form-item>
              <el-form-item label="页面地址" required v-if="selectedMenuType()==0">
                <el-input v-model="menu.button[selectedMenuIndex].url" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="小程序APPID" required v-if="selectedMenuType()==1">
                <el-input v-model="menu.button[selectedMenuIndex].appid" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="小程序路径" required v-if="selectedMenuType()==1">
                <el-input v-model="menu.button[selectedMenuIndex].pagepath" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="备用网页" required v-if="selectedMenuType()==1">
                <el-input v-model="menu.button[selectedMenuIndex].url" placeholder=""></el-input>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <!-- 子菜单 -->
        <div class="weixin-menu-detail" v-if="selectedMenuLevel()==2">
          <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
            <div class="menu-name">{{menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].name}}</div>
            <div class="menu-del" @click="delMenu">删除子菜单</div>
          </div>
          <el-form ref='wechatMenu' size="small" label-position="right" label-width="150px">
            <el-form-item label="菜单名称" required>
              <el-select v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].name" allow-create filterable
                placeholder="请选择" size="small" @change="subMenuSelect(selectedMenuIndex,selectedSubMenuIndex,menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].name)">
                <el-option v-for="item in wechatMenus" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" required>
              <el-checkbox v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].useOpenAuth" :true-label="'true'"
                :false-label="'false'">是否使用OAuth2.0授权</el-checkbox>
            </el-form-item>
            <el-form-item label="菜单内容" required>
              <el-radio v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].type" label="0">跳转网页</el-radio>
              <el-radio v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].type" label="1">跳转小程序</el-radio>
            </el-form-item>
            <el-form-item label="页面地址" required v-if="selectedMenuType()==0">
              <el-input v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].url" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="小程序APPID" required v-if="selectedMenuType()==1">
              <el-input v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].appid" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="小程序路径" required v-if="selectedMenuType()==1">
              <el-input v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].pagepath" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="备用网页" required v-if="selectedMenuType()==1">
              <el-input v-model="menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].url" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <biz-dialog-selector
      title="选择菜单"
      :visibility.sync="dialog"
      :appendToBody="true"
      :tableData="wechatMenus"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      @confirmed="handleConfirmed"
      @filterDataChange="filterDataChange"
      @pageSizeChange="pageSizeChange"
      @currentPageChange="currentPageChange"
      class="supplierDialog"
    >
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="type" label="类别">
        <template slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.type==='0'?'网页':'小程序'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="链接">
      </el-table-column>
      <el-table-column prop="modifyDate" label="更新时间">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import BizDialogSelector from '@/components/BizDialogSelector';
import service from '@/service/system-setting/wechat-official-account-mgmt/wechatOfficialAccountMgmt';
export default {
  name: 'WechatOfficialAccountMgmt',
  components: {
    BizGrid,
    BizHeader,
    BizAvatarUploaderNew,
    BizDialogSelector
  },
  props: {},
  data() {
    return {
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialog: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          disabled: false
        },
        {
          label: '解绑',
          name: 'unbind',
          type: '',
          disabled: true
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ],
      weixinTitle: '微信公众号菜单',
      menu: { button: [] }, // 当前菜单
      selectedMenuIndex: '', // 当前选中菜单索引
      selectedSubMenuIndex: '', // 当前选中子菜单索引
      menuNameBounds: false, // 菜单长度是否过长
      material: {
        title: '',
        url: '',
        thumb_url: ''
      },
      loading: false,
      wechatOpenRules: {
        showId: [{ required: true, message: '请输入公众号ID', trigger: 'blur' }],
        wecharId: [{ required: true, message: '请输入原始ID', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入AppID', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入AppSecret', trigger: 'blur' }],
        qrCodePath: [{ required: true, message: '请上传二维码', trigger: 'blur' }]
      },
      edit: false,
      shopId: window.top.SHOP_ID || '',
      shopList: [],
      wechatOpenName: '',
      wechatOpenDataList: [],
      wechatOpenData: this.getDefaultData(),
      wechatMenusLeft: [],
      wechatMenusCenter: [],
      wechatMenusRight: [],
      wechatMenus: []
    };
  },
  computed: {},
  created() {
    this.refresh();
    this.getWechatMenu();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    handleConfirmed() {

    },
    currentPageChange() {

    },
    pageSizeChange() {

    },
    filterDataChange() {

    },
    refresh() {
      this.getList();
    },
    getList() {
      this.loading = true;
      let params = {
        shopId: this.shopId,
        id: this.wechatOpenData.id
      };
      service.queryWechatOpen(
        params,
        data => {
          this.shopList = data.shopList;
          this.wechatOpenDataList = data.wechatOpenList;
          this.wechatOpenData = data.data.id ? data.data : this.getDefaultData();
          this.weixinTitle = data.data.name ? data.data.name : '微信公众号菜单';
          this.menu.button = data.data.menus ? data.data.menus : [];
          if (this.shopId === '') {
            this.shopId = this.wechatOpenData.shop;
          }
          this.wechatOpenName = this.wechatOpenData.showName;
          if (this.wechatOpenData.id !== '') {
            this.operations[1].disabled = false;
          }
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          if (ErrorData.errorMessage !== '') {
            // this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取公众号列表失败', params);
        }
      );
    },
    getWechatMenu() {
      service.menus(
        { shopId: window.top.SHOP_ID || '' },
        data => {
          this.wechatMenus = data.dataList;
          this.dialogPagination.total = data.total;
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
        }
      );
    },
    // 新建
    add() {
      this.operations[1].disabled = true;
      this.wechatOpenData = this.getDefaultData();
      this.menu.button = [];
      this.weixinTitle = '微信公众号菜单';
      this.wechatOpenName = this.wechatOpenData.showName;
    },
    // 删除
    unbind() {
      this.$confirm(
        '修改公众号会导致已关注该公众号的用户无法登录及接收您的消息，建议您点击新建公众号并在用户关注新公众号后删除旧的公众号，确定要继续解绑吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true;
          let params = {
            shopId: this.wechatOpenData.shop,
            wechatOpenId: this.wechatOpenData.id
          };
          service.unbindWechatOpen(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '解绑成功!'
              });
              this.wechatOpenData = this.getDefaultData();
              this.wechatOpenName = this.wechatOpenData.showName;
              this.refresh();
              this.loading = false;
            },
            ErrorData => {
              this.loading = false;
              if (ErrorData.errorMessage !== '') {
                this.$message.warning(ErrorData.errorMessage);
              }
              console.log('解绑公众号失败', params);
            }
          );
        })
        .catch(() => {});
    },
    // 保存
    save() {
      console.log('save:', this.wechatOpenData);
      console.log('menus:', this.menu);
      this.$refs.wechatOpen.validate(valid => {
        if (valid) {
          let params = this.getSaveParams();

          if (params.showName === '') {
            this.$message.warning('公众号名称不能为空');
            return false;
          }

          if (this.hasSameName(params)) {
            this.$message.warning('公众号名称已存在');
            return false;
          }
          this.loading = true;
          if (this.wechatOpenData.id) {
            service.updateWechatOpen(
              params,
              data => {
                this.$message.success('更新微信公众号成功');
                this.refresh();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                if (ErrorData.errorMessage !== '') {
                  this.$message.warning(ErrorData.errorMessage);
                }
                console.log('更新微信公众号失败', params);
              }
            );
          } else {
            service.saveWechatOpen(
              params,
              data => {
                this.$message.success('添加微信公众号成功');
                this.wechatOpenData.id = data.id;
                this.refresh();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                if (ErrorData.errorMessage !== '') {
                  this.$message.warning(ErrorData.errorMessage);
                }
                console.log('添加微信公众号失败', params);
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    checkWechatMenus(wechatMenus) {},
    getSaveParams() {
      return {
        appId: this.wechatOpenData.appId,
        appSecret: this.wechatOpenData.appSecret,
        wecharId: this.wechatOpenData.wecharId,
        shop: this.wechatOpenData.id === '' ? this.shopId : this.wechatOpenData.shop,
        isDefault: this.wechatOpenData.isDefault,
        showId: this.wechatOpenData.showId,
        showName: this.wechatOpenName,
        qrCodePath: this.wechatOpenData.qrCodePath,
        wechatPay: {
          mchId: this.wechatOpenData.wechatPay.mchId,
          apiKey: this.wechatOpenData.wechatPay.apiKey,
          apiclientCert: this.wechatOpenData.wechatPay.apiclientCert
        },
        wechatMenues: this.menu.button,
        id: this.wechatOpenData.id,
        appid: this.wechatOpenData.appid,
        pagepath: this.wechatOpenData.pagepath,
        type: this.wechatOpenData.type
      };
    },
    hasSameName(params) {
      let index = this.wechatOpenDataList.findIndex(item => item.showName === params.showName);

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (this.wechatOpenDataList[index].id === params.id) {
        return false;
      }

      return true;
    },
    editName() {
      if (this.edit) {
        let params = this.getSaveParams();

        if (params.showName === '') {
          this.$message.warning('公众号名称不能为空');
          return false;
        }

        if (this.hasSameName(params)) {
          this.$message.warning('公众号名称已存在');
          return false;
        }

        this.loading = true;
        service.updateWechatOpenName(
          params,
          data => {
            this.edit = false;
            this.operations[0].disabled = false;
            this.operations[1].disabled = false;
            this.operations[2].disabled = false;
            this.$message.success('更新微信公众号名称成功');
            this.refresh();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            if (ErrorData.errorMessage !== '') {
              this.$message.warning(ErrorData.errorMessage);
            }
            console.log('更新微信公众号名称失败', params);
          }
        );
      } else {
        this.edit = true;
        this.operations[0].disabled = true;
        this.operations[1].disabled = true;
        this.operations[2].disabled = true;
      }
    },
    changeShopId(val) {
      this.operations[1].disabled = true;
      this.wechatOpenData = this.getDefaultData();
      this.wechatOpenName = this.wechatOpenData.showName;
      this.refresh();
    },
    changeWechatOpen(val) {
      this.operations[1].disabled = true;
      this.refresh();
    },
    getMenus(position) {
      let menus = [];
      if (this.wechatOpenData && this.wechatOpenData.wechatMenues && this.wechatOpenData.wechatMenues.length !== 0) {
        menus = this.wechatOpenData.wechatMenues.filter(item => item.position === position);
      }
      menus.sort(function(a, b) {
        return a.number - b.number;
      });
      return menus;
    },
    addMenu(position, num) {
      return {
        name: '',
        number: String(num),
        position: position,
        url: '',
        useOpenAuth: 'true',
        wechatOpen: this.wechatOpenData.id,
        id: '',
        appid: '',
        pagepath: '',
        type: '0'
      };
    },
    getDefaultData() {
      return {
        appId: '',
        appSecret: '',
        wecharId: '',
        shop: '',
        isDefault: '',
        showId: '',
        showName: '',
        qrCodePath: '',
        wechatPay: {
          mchId: '',
          apiKey: '',
          apiclientCert: ''
        },
        wechatMenues: [],
        id: ''
      };
    },
    menuSelect(selectedMenuIndex, val) {
      this.wechatMenus.forEach(item => {
        if (item.name === val) {
          this.menu.button[selectedMenuIndex].url = item.url;
        }
      });
    },
    subMenuSelect(selectedMenuIndex, selectedSubMenuIndex, val) {
      this.wechatMenus.forEach(item => {
        if (item.name === val) {
          this.menu.button[selectedMenuIndex].subMenus[selectedSubMenuIndex].url = item.url;
        }
      });
    },
    // 选中主菜单
    selectedMenu: function(i, event) {
      this.selectedSubMenuIndex = '';
      this.selectedMenuIndex = i;
      let selectedMenu = this.menu.button[this.selectedMenuIndex];
      // 清空选中media_id 防止再次请求
      if (selectedMenu.media_id !== undefined && selectedMenu.media_id !== '' && this.selectedMenuType() === 1) {
        this.getMaterial(selectedMenu.media_id);
      }
      // 检查名称长度
      // this.checkMenuName(selectedMenu.name);
    },
    // 选中子菜单
    selectedSubMenu: function(i, event) {
      this.selectedSubMenuIndex = i;
      let selectedSubMenu = this.menu.button[this.selectedMenuIndex].subMenus[this.selectedSubMenuIndex];
      if (selectedSubMenu.media_id !== undefined && selectedSubMenu !== '' && this.selectedMenuType() === 1) {
        this.getMaterial(selectedSubMenu.media_id);
      }
      // this.checkMenuName(selectedSubMenu.name);
    },
    // 选中菜单级别
    selectedMenuLevel: function() {
      if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex === '') {
        // 主菜单
        return 1;
      } else if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex !== '') {
        // 子菜单
        return 2;
      } else {
        // 未选中任何菜单
        return 0;
      }
    },
    // 获取菜单类型 1. view网页类型，2.miniprogram表示小程序类型
    selectedMenuType: function() {
      if (this.selectedMenuLevel() === 1 && this.menu.button[this.selectedMenuIndex].subMenus.length === 0) {
        // 主菜单
        return this.menu.button[this.selectedMenuIndex].type;
      } else if (this.selectedMenuLevel() === 2) {
        // 子菜单
        return this.menu.button[this.selectedMenuIndex].subMenus[this.selectedSubMenuIndex].type;
      } else {
        return 0;
      }
    },
    // 添加菜单
    addMenuHandler: function(level) {
      if (level === 1 && this.menu.button.length < 3) {
        this.menu.button.push({
          type: '0',
          name: '菜单名称',
          subMenus: [],
          url: '',
          useOpenAuth: 'true',
          number: '0'
        });
        this.selectedMenuIndex = this.menu.button.length - 1;
        this.selectedSubMenuIndex = '';
      }
      if (level === 2 && this.menu.button[this.selectedMenuIndex].subMenus.length < 5) {
        this.$confirm('添加二级菜单，一级菜单链接会被清空', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.menu.button[this.selectedMenuIndex].url = '';
          this.menu.button[this.selectedMenuIndex].subMenus.push({
            type: '0',
            name: '子菜单名称',
            useOpenAuth: 'true',
            url: '',
            number: this.menu.button[this.selectedMenuIndex].subMenus.length
          });
          this.selectedSubMenuIndex = this.menu.button[this.selectedMenuIndex].subMenus.length - 1;
        });
      }
    },
    // 删除菜单
    delMenu: function() {
      this.$confirm('删除后菜单下设置的内容将被删除，确定要继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.selectedMenuLevel() === 1) {
            if (this.selectedMenuIndex === 0) {
              this.menu.button.splice(this.selectedMenuIndex, 1);
              this.selectedMenuIndex = 0;
            } else {
              this.menu.button.splice(this.selectedMenuIndex, 1);
              this.selectedMenuIndex -= 1;
            }
            if (this.menu.button.length === 0) {
              this.selectedMenuIndex = '';
            }
          } else if (this.selectedMenuLevel() === 2) {
            if (this.selectedSubMenuIndex === 0) {
              this.menu.button[this.selectedMenuIndex].subMenus.splice(this.selectedSubMenuIndex, 1);
              this.selectedSubMenuIndex = 0;
            } else {
              this.menu.button[this.selectedMenuIndex].subMenus.splice(this.selectedSubMenuIndex, 1);
              this.selectedSubMenuIndex -= 1;
            }
            if (this.menu.button[this.selectedMenuIndex].subMenus.length === 0) {
              this.selectedSubMenuIndex = '';
            }
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.wechat-official-account-mgmt {
  .biz-grid__top {
    margin-top: 10px;
    margin-left: 27px;
  }
  .biz-grid__content {
    margin-top: 10px;
  }
  #app-menu {
    overflow: hidden;
    width: 950px;
    font-size: 14px;
    color: #606266;
  }
  li {
    list-style: none;
  }
  .weixin-preview {
    position: relative;
    width: 320px;
    height: 540px;
    float: left;
    margin-right: 10px;
    border: 1px solid #e7e7eb;
  }
  .weixin-preview a {
    text-decoration: none;
    color: #616161;
  }
  .weixin-preview .weixin-hd {
    color: #fff;
    text-align: center;
    position: relative;
    top: 0px;
    left: 0px;
    width: 320px;
    height: 64px;
    background: transparent url('~@/assets/images/wechat/menu_head.png') no-repeat 0 0;
    background-position: 0 0;
  }
  .weixin-preview .weixin-hd .weixin-title {
    color: #fff;
    font-size: 15px;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 33px;
    left: 0px;
  }

  .weixin-preview .weixin-bd {
  }
  .weixin-preview .weixin-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e7e7e7;
    background: transparent url('~@/assets/images/wechat/menu_foot.png') no-repeat 0 0;
    background-position: 0 0;
    background-repeat: no-repeat;
    padding-left: 43px;
    margin-bottom: 0px;
  }
  /*一级*/
  .weixin-preview .weixin-menu .menu-item {
    position: relative;
    float: left;
    line-height: 50px;
    height: 50px;
    text-align: center;
    width: 33.33%;
    border-left: 1px solid #e7e7e7;
    cursor: pointer;
    color: #616161;
  }
  .weixin-preview .weixin-menu .menu-item:first-child {
    /*border-left-width:0px;*/
  }

  /*二级*/
  .weixin-preview .weixin-sub-menu {
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    border-top: 1px solid #d0d0d0;
    margin-bottom: 0px;
    background: #fafafa;
    display: block;
    padding: 0;
  }
  .weixin-preview .weixin-sub-menu .menu-sub-item {
    line-height: 50px;
    height: 50px;
    text-align: center;
    width: 100%;
    border: 1px solid #d0d0d0;
    border-top-width: 0px;
    cursor: pointer;
    position: relative;
    color: #616161;
  }
  .weixin-preview .menu-arrow {
    position: absolute;
    left: 50%;
    margin-left: -6px;
  }
  .weixin-preview .arrow_in {
    bottom: -4px;
    display: inline-block;
    width: 0px;
    height: 0px;
    border-width: 6px 6px 0px;
    border-style: solid dashed dashed;
    border-color: #fafafa transparent transparent;
  }
  .weixin-preview .arrow_out {
    bottom: -5px;
    display: inline-block;
    width: 0px;
    height: 0px;
    border-width: 6px 6px 0px;
    border-style: solid dashed dashed;
    border-color: #d0d0d0 transparent transparent;
  }

  .weixin-preview .menu-item .menu-item-title,
  .weixin-preview .menu-sub-item .menu-item-title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .weixin-preview .menu-item.current,
  .weixin-preview .menu-sub-item.current {
    border: 1px solid #44b549;
    background: #fff;
    color: #44b549;
  }
  .weixin-preview .weixin-sub-menu.show {
    display: block;
  }
  .weixin-preview .icon_menu_dot {
    background: url('~@/assets/images/wechat/index_z354723.png') 0px -36px no-repeat;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 2px;
    margin-top: -2px;
  }
  .weixin-preview .icon14_menu_add {
    background: url('~@/assets/images/wechat/index_z354723.png') 0px 0px no-repeat;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -2px;
  }
  .weixin-preview li:hover .icon14_menu_add {
    background: url('~@/assets/images/wechat/index_z354723.png') 0px -18px no-repeat;
  }

  .weixin-preview .menu-item:hover {
    color: #000;
  }
  .weixin-preview .menu-sub-item:hover {
    background: #eee;
  }

  .weixin-preview li.current:hover {
    background: #fff;
    color: #44b549;
  }

  /*菜单内容*/
  .weixin-menu-detail {
    width: 600px;
    padding: 0px 20px 5px;
    background-color: #f4f5f9;
    border: 1px solid #e7e7eb;
    float: left;
    min-height: 540px;
  }
  .weixin-menu-detail .menu-name {
    float: left;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
  }
  .weixin-menu-detail .menu-del {
    float: right;
    height: 40px;
    line-height: 40px;
    color: #459ae9;
    cursor: pointer;
  }
  .weixin-menu-detail .menu-input-group {
    width: 540px;
    margin: 10px 0 30px 0;
    overflow: hidden;
  }
  .weixin-menu-detail .menu-label {
    float: left;
    height: 30px;
    line-height: 30px;
    width: 80px;
    text-align: right;
  }
  .weixin-menu-detail .menu-input {
    float: left;
    width: 380px;
  }
  .weixin-menu-detail .menu-input-text {
    border: 0px;
    outline: 0px;
    background: #fff;
    width: 300px;
    padding: 5px 0px 5px 0px;
    margin-left: 10px;
    text-indent: 10px;
    height: 35px;
    border-radius: 2px;
  }
  .weixin-menu-detail .menu-tips {
    color: #8d8d8d;
    padding-top: 4px;
    margin: 0;
  }
  .weixin-menu-detail .menu-tips.cursor {
    color: #459ae9;
    cursor: pointer;
  }

  .weixin-menu-detail .menu-input .menu-tips {
    margin: 0 0 0 10px;
  }
  .weixin-menu-detail .menu-content {
    padding: 16px 20px;
    border: 1px solid #e7e7eb;
    background-color: #fff;
  }
  .weixin-menu-detail .menu-content .menu-input-group {
    margin: 0px 0 10px 0;
  }
  .weixin-menu-detail .menu-content .menu-label {
    text-align: left;
    width: 100px;
  }
  .weixin-menu-detail .menu-content .menu-input-text {
    border: 1px solid #e7e7eb;
  }
  .weixin-menu-detail .menu-content .menu-tips {
    padding-bottom: 10px;
  }

  .weixin-menu-detail .menu-msg-content {
    padding: 0;
    border: 1px solid #e7e7eb;
    background-color: #fff;
  }
  .weixin-menu-detail .menu-msg-content .menu-msg-head {
    overflow: hidden;
    border-bottom: 1px solid #e7e7eb;
    line-height: 38px;
    height: 38px;
    padding: 0 20px;
  }
  .weixin-menu-detail .menu-msg-content .menu-msg-panel {
    padding: 30px 50px;
  }
  .weixin-menu-detail .menu-msg-content .menu-msg-select {
    padding: 40px 20px;
    border: 2px dotted #d9dadc;
    text-align: center;
  }
  .weixin-menu-detail .menu-msg-content .menu-msg-select:hover {
    border-color: #b3b3b3;
  }
  .weixin-menu-detail .menu-msg-content strong {
    display: block;
    padding-top: 3px;
    font-weight: 400;
    font-style: normal;
  }
  .weixin-menu-detail .menu-msg-content .menu-msg-title {
    float: left;
    width: 310px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon36_common {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    display: inline-block;
  }
  .icon36_common.add_gray {
    background: url('~@/assets/images/wechat/base_z381ecd.png') 0 -2548px no-repeat;
  }
  .icon_msg_sender {
    margin-right: 3px;
    margin-top: -2px;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    display: inline-block;
    background: url('~@/assets/images/wechat/msg_tab_z25df2d.png') 0 -270px no-repeat;
  }

  .weixin-btn-group {
    text-align: center;
    width: 950px;
    margin: 30px 0px;
    overflow: hidden;
  }
  .weixin-btn-group .btn {
    width: 100px;
    border-radius: 0px;
  }

  #material-list {
    padding: 20px;
    overflow-y: scroll;
    height: 558px;
  }
  #news-list {
    padding: 20px;
    overflow-y: scroll;
    height: 558px;
  }
  #material-list table {
    width: 100%;
  }
}
</style>
