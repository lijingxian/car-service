<template>
  <biz-grid class="fedration-mgmt-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="店铺名称" prop="name">
        <el-input placeholder="请输入店铺名称" v-model="form.name" maxlength="20" minlength="1"></el-input>
        <el-button @click="showStorePicker" v-if="!itemId" type="primary">选择店铺</el-button>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <biz-map-pointer v-model="point" :address="form.address" @addressChange="handleAddressChange">
        </biz-map-pointer>
      </el-form-item>
      <el-form-item label="销售电话" prop="phone">
        <el-input v-model="form.phone" maxlength="13" placeholder="请输入销售电话"></el-input>
      </el-form-item>
      <el-form-item label="售后电话" prop="serviceMobile">
        <el-input v-model="form.serviceMobile" maxlength="13" placeholder="请输入售后电话"></el-input>
      </el-form-item>
      <el-form-item label="客服电话" prop="customerMobile">
        <el-input v-model="form.customerMobile" maxlength="13" placeholder="请输入客服电话"></el-input>
      </el-form-item>
      <el-form-item label="救援电话" prop="rescueMobile">
        <el-input v-model="form.rescueMobile" maxlength="13" placeholder="请输入救援电话"></el-input>
      </el-form-item>
      <el-form-item label="店铺logo" prop="head">
        <BizAvatarUploaderNew v-model="form.head"  @uploadSuccess="uploadSuccessLogo">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="店铺封面" prop="image">
        <BizAvatarUploaderNew v-model="form.image" @uploadSuccess="uploadSuccess">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="所属运营商">
        <label>{{form.operatorName}}</label>
      </el-form-item>
      <el-form-item label="所属上级">
        <label>{{form.parentName}}</label>
      </el-form-item>
      <el-form-item label="状态" prop="isEnabled">
        <el-radio-group v-model="form.isEnabled">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领域" prop="domains" v-if="!itemId">
        <el-checkbox-group v-model="form.domains" :disabled="!!itemId">
          <el-checkbox v-for="item in domainList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="" prop="isAllowCreateFleet">
        <el-checkbox label="允许会员创建车友会" v-model="form.isAllowCreateFleet"></el-checkbox>
      </el-form-item> -->
      <!-- <el-form-item label="" prop="communitySilent">
        <el-checkbox label="社区动态禁言" true-label='1' false-label="0" v-model="form.communitySilent"></el-checkbox>
      </el-form-item> -->
      <el-form-item label="父子店铺关系" v-show="showUnionType">
        <div slot="label">
          父子店铺关系
          <el-button type="text" size="small" v-popover:UnionType>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="UnionType" placement="bottom-start" width="300" trigger="hover">
            <p>父子店铺可选择以下几种关系：</p>
            <p>● 独立 — 不共享任何资源，两个店铺之间没有建立起任何信任关系；</p>
            <p>● 合作联盟 — 共享商品和营销活动，店铺之间具有良好稳定的合作关系；</p>
            <p>● 品牌加盟 — 人事和财务独立，协商共享其他资源，常见于总店和子店之间，或者加盟品牌。</p>
            ● 直营连锁 — 人事、财务和资源统一管理，常见于总店和分店之间，或者直营店。
          </el-popover>
        </div>
        <el-select v-model="form.unionType" placeholder="请选择" @change="unionTypeChange">
          <el-option label="独立" value="0"></el-option>
          <el-option label="合作联盟" value="1"></el-option>
          <el-option label="品牌加盟" value="2"></el-option>
          <el-option label="直营连锁" value="3"></el-option>
          <el-option label="园区联盟" value="4"></el-option>
        </el-select>
        <el-button type="primary" @click="isShow(dialogTableVisible)" v-show="showConfig">详细配置</el-button>
      </el-form-item>
      <el-form-item label="店铺二维码" prop="qrCodePath">
        <div slot="label">
          店铺二维码
          <el-button type="text" size="small" v-popover:codePop>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover"
            content="我们将为您创建一个专属的店铺二维码，您的用户可通过扫描该二维码关注快速您的店铺，并成为您店铺的会员哦。">
          </el-popover>
        </div>
        <img :src="form.qrCodePath" width="100px" v-if="form.qrCodePath" />
        <el-button @click="print" type="primary" v-if="itemId">打印</el-button>
        <el-button @click="view" type="primary" v-if="itemId">查看</el-button>
      </el-form-item>
    </el-form>
    <biz-dialog-selector title="选择店铺" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :selectionMode="'single'" :filters="dialogFilters" @confirmed="handleConfirmed" @open="opened" @operate="dialogOperate"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="name" label="店铺名称">
        <div slot-scope="scope">
          <div class="biz-two-column">
            <img :src="scope.row.head||DefaultAvatar" />
            <div class="biz-two-row">
              <div style="margin-left: 10px">{{scope.row.name}}</div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="operatorName" label="所属运营商">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </biz-dialog-selector>
    <el-dialog title="父子店铺关系配置" center :visible.sync="dialogTableVisible" custom-class="configList" width="90%" append-to-body>
      <el-select v-model="form.unionType" placeholder="请选择" size="small" @change="unionTypeChange">
        <el-option label="独立" value="0"></el-option>
        <el-option label="合作联盟" value="1"></el-option>
        <el-option label="品牌加盟" value="2"></el-option>
        <el-option label="直营连锁" value="3"></el-option>
        <el-option label="园区联盟" value="4"></el-option>
      </el-select>
      <el-radio-group v-model="relationship" size="small" @change="relationshipChange">
        <el-radio-button label="0">父→子</el-radio-button>
        <el-radio-button label="1">子→父</el-radio-button>
      </el-radio-group>
      <el-table :data="form.configList" v-show="isFather">
        <el-table-column label="资源" prop="name">
          <template slot-scope="scope">
            <div v-html="getType(scope.row.type)"></div>
          </template>
        </el-table-column>
        <el-table-column label="查看">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toFatherConfig.share" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="share(scope.row.toFatherConfig)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toFatherConfig.edit" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="edit(scope.row.toFatherConfig)" :disabled="scope.row.type==='0'||scope.row.type==='1'"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toFatherConfig.auditShare" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="auditShare(scope.row.toFatherConfig)" :disabled="!(scope.row.type=='3'||scope.row.type=='2')"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="复制">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toFatherConfig.copyShare" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="copyShare(scope.row.toFatherConfig)" :disabled="scope.row.type!=='9'"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="form.configList" v-show="isSon">
        <el-table-column label="资源" prop="name">
          <template slot-scope="scope">
            <div v-html="getType(scope.row.type)"></div>
          </template>
        </el-table-column>
        <el-table-column label="查看">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toSonConfig.share" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="share(scope.row.toSonConfig)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toSonConfig.edit" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              :disabled="scope.row.type==='0'||scope.row.type==='1'" @change="edit(scope.row.toSonConfig)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toSonConfig.auditShare" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="auditShare(scope.row.toSonConfig)" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="复制">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.toSonConfig.copyShare" active-value='1' inactive-value='0' inactive-color="#d9d9d9"
              @change="copyShare(scope.row.toSonConfig)" :disabled="scope.row.type!=='9'"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible=false" size="mini">保存</el-button>
        <el-button type="primary" @click="dialogTableVisible=false" size="mini">取消</el-button>
      </span>
    </el-dialog>
    <VueCropper :open="open" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizMapPointer } from '@/components/BizMapPointer';
import BizDialogSelector from './components/BizDialogSelector';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/federation-mgmt/federationMgmt';
import http from '@/common/http';
import DefaultAvatar from '@/assets/images/default_user.png';
import cityCode from '@/utils/cityCode';
import { mapGetters } from 'vuex';
import { VueCropper } from '@/components/BizForm';
export default {
  name: 'FederationMgmtInfo',
  props: {
    itemId: {
      type: String
    },
    type: {
      type: String,
      default: ''
    },
    parent: {
      type: String,
      default: ''
    },
    parentType: {
      type: String,
      default: ''
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector,
    BizMapPointer,
    BizAvatarUploaderNew,
    VueCropper
  },
  computed: {
    ...mapGetters(['getUser']),
    point: {
      get() {
        return {
          lng: this.form.lngBaidu,
          lat: this.form.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.form.lngBaidu = nVal.lng;
          this.form.latBaidu = nVal.lat;
        }
      }
    },
    showConfig() {
      if (this.getUser.roleLevel === 'shop') {
        return this.type === 'store' && this.itemId !== this.getUser.shop.id;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      open: false,
      typeH: '0',
      showSetting: false,
      showUnionType: false,
      loading: false,
      dialogTableVisible: false,
      selectionKeys: [],
      relationship: '0',
      picUrl: '',
      isSon: true,
      DefaultAvatar: DefaultAvatar,
      isFather: false,
      defaultShopLogo: '/resources/admin/images/shop-logo.png',
      rules: {
        name: [
          {
            message: '请输入店铺名称',
            trigger: 'blur',
            required: true
          },
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9.()-]+$/, message: '店铺名称不能包含除.()-以外的其他字符', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请选择地区', trigger: 'blur' }],
        phone: [
          {
            required: true,
            message: '销售电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        serviceMobile: [
          {
            required: false,
            message: '售后电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        customerMobile: [
          {
            required: false,
            message: '客服电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        rescueMobile: [
          {
            required: false,
            message: '救援电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      // 用户信息
      form: {
        id: '',
        name: '',
        address: '',
        cityCode: '',
        phone: '',
        serviceMobile: '',
        customerMobile: '',
        rescueMobile: '',
        parent: '',
        parentType: '',
        head: this.defaultShopLogo,
        image: '',
        communitySilent: false,
        selectionKeys: [],
        domains: [],
        companyId: '',
        isEnabled: '1',
        lngBaidu: '',
        latBaidu: '',
        unionType: '0',
        configList: [
          {
            // 会员
            toFather: '0',
            toSon: '1',
            type: '5',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 会员卡
            toFather: '0',
            toSon: '1',
            type: '6',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 车友会
            toFather: '0',
            toSon: '1',
            type: '8',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 活动
            toFather: '0',
            toSon: '1',
            type: '3',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 订单
            toFather: '0',
            toSon: '1',
            type: '4',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存采购订单
            toFather: '0',
            toSon: '1',
            type: '13',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存销售订单
            toFather: '0',
            toSon: '1',
            type: '14',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 财务
            toFather: '0',
            toSon: '1',
            type: '1',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 车队
            toFather: '0',
            toSon: '1',
            type: '7',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 商品
            toFather: '0',
            toSon: '1',
            type: '2',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存商品
            toFather: '0',
            toSon: '1',
            type: '12',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 员工
            toFather: '0',
            toSon: '1',
            type: '0',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 智能到店
            toFather: '0',
            toSon: '0',
            type: '9',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 到店设置
            toFather: '0',
            toSon: '0',
            type: '10',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 设备
            toFather: '0',
            toSon: '0',
            type: '11',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 仓库
            toFather: '0',
            toSon: '0',
            type: '15',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          }
        ],
        operatorName: '',
        parentName: ''
      },
      resetForm: {
        id: '',
        name: '',
        address: '',
        phone: '',
        serviceMobile: '',
        customerMobile: '',
        rescueMobile: '',
        parent: '',
        parentType: '',
        head: this.defaultShopLogo,
        image: '',
        communitySilent: false,
        selectionKeys: [],
        domains: [],
        companyId: '',
        isEnabled: '1',
        lngBaidu: '',
        latBaidu: '',
        unionType: '0',
        configList: [
          {
            // 会员
            toFather: '0',
            toSon: '1',
            type: '5',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 会员卡
            toFather: '0',
            toSon: '1',
            type: '6',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 车友会
            toFather: '0',
            toSon: '1',
            type: '8',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 活动
            toFather: '0',
            toSon: '1',
            type: '3',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 订单
            toFather: '0',
            toSon: '1',
            type: '4',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存采购订单
            toFather: '0',
            toSon: '1',
            type: '13',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存销售订单
            toFather: '0',
            toSon: '1',
            type: '14',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 财务
            toFather: '0',
            toSon: '1',
            type: '1',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 车队
            toFather: '0',
            toSon: '1',
            type: '7',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 商品
            toFather: '0',
            toSon: '1',
            type: '2',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存商品
            toFather: '0',
            toSon: '1',
            type: '12',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 员工
            toFather: '0',
            toSon: '1',
            type: '0',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 智能到店
            toFather: '0',
            toSon: '0',
            type: '9',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 到店设置
            toFather: '0',
            toSon: '0',
            type: '10',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 设备
            toFather: '0',
            toSon: '0',
            type: '11',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 仓库
            toFather: '0',
            toSon: '0',
            type: '15',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          }
        ],
        operatorName: '',
        parentName: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:union.manage.edit']
        }
      ],
      dialogLoading: true,
      dialogTableData: [],
      domainList: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入店铺名称',
          name: 'searchValue',
          value: ''
        }
      ],
      showDialog: false,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: ''
    };
  },
  created() {
    if (!this.itemId && this.parentType === 'store') {
      this.showUnionType = true;
    } else {
      this.showUnionType = false;
    }
    if (this.itemId && this.type === 'store') {
      this.queryStoreOrOperator();
    }
    this.getDefaultImg();
    this.getDomains();
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.clearValidate();
      this.$refs.form.$el.scrollTop = 0;
      this.parentCompanyAndStore();
      if (this.itemId && this.type === 'store') {
        this.queryStoreOrOperator();
      } else {
        this.form = this.defaultMOdel();
      }
    },
    parent(nVal, oVal) {
      this.form = this.defaultMOdel();
      this.parentCompanyAndStore();
    }
  },

  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.typeH = '1';
      this.picUrl = url;
      this.open = true;
    },
    uploadSuccessLogo(url) {
      console.log('uploadSuccess');
      this.typeH = '0';
      this.picUrl = url;
      this.open = true;
    },
    handelSuccess(url) {
      if (this.typeH === '0') {
        this.form.logo = url;
      } else {
        this.form.image = url;
      }
    },
    close() {
      this.open = false;
    },
    getDomains() {
      http.get('/rest/businessServiceDomain/domainList.jhtml', {})
        .then(data => {
          this.domainList = data.content;
        })
        .catch();
    },
    getDefaultImg() {
      let params = {
        type: 'displaySetting'
      };
      http
        .get('/admin/settings/settings.jhtml', params)
        .then(data => {
          if (data.settingList.defaultStoreLogoImage) {
            this.defaultShopLogo = data.settingList.defaultStoreLogoImage;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    relationshipChange(val) {
      if (val === '0') {
        this.isSon = true;
        this.isFather = false;
      } else {
        this.isSon = false;
        this.isFather = true;
      }
    },
    share(row) {
      // if (row.share === '1' && row.auditShare === '1') {
      //   row.auditShare = '0';
      // } else if (row.share === '0' && row.edit === '1') {
      //   this.$message.warning('编辑权限需要选中查看');
      //   row.share = '1';
      // }
    },
    edit(row) {
      // if (row.edit === '1' && row.share === '0' && row.auditShare === '0') {
      //   row.share = '1';
      // } else if (row.edit === '0' && row.copyShare === '1') {
      //   // this.$message.warning('复制权限需要查看与编辑共同选中');
      //   // row.edit = '1';
      // } else if (row.edit === '1' && row.share === '0' && row.auditShare === '1') {
      //   this.$message.warning('编辑权限需要选中查看');
      //   row.edit = '0';
      // }
    },
    auditShare(row) {
      // if (row.auditShare === '1' && row.copyShare === '1') {
      //   this.$message.warning('复制权限下暂不支持审核');
      //   row.auditShare = '0';
      // } else if (row.auditShare === '1' && row.copyShare === '0' && row.edit === '0') {
      //   row.share = '0';
      //   row.copyShare = '0';
      // } else if (row.auditShare === '1' && row.copyShare === '0' && row.edit === '1') {
      //   this.$message.warning('审核权限不可选中查看');
      //   row.auditShare = '0';
      // }
    },
    copyShare(row) {
      // if (row.copyShare === '1') {
      //   row.share = '1';
      //   row.edit = '1';
      //   row.auditShare = '0';
      // }
    },
    defaultMOdel() {
      return {
        id: '',
        name: '',
        address: '',
        phone: '',
        serviceMobile: '',
        customerMobile: '',
        rescueMobile: '',
        parent: '',
        parentType: '',
        head: this.defaultShopLogo,
        image: '',
        communitySilent: false,
        selectionKeys: [],
        domains: [],
        companyId: '',
        isEnabled: '1',
        lngBaidu: '',
        latBaidu: '',
        unionType: '0',
        configList: [
          {
            // 会员
            toFather: '0',
            toSon: '1',
            type: '5',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 会员卡
            toFather: '0',
            toSon: '1',
            type: '6',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 车友会
            toFather: '0',
            toSon: '1',
            type: '8',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 活动
            toFather: '0',
            toSon: '1',
            type: '3',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 订单
            toFather: '0',
            toSon: '1',
            type: '4',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存采购订单
            toFather: '0',
            toSon: '1',
            type: '13',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存销售订单
            toFather: '0',
            toSon: '1',
            type: '14',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 财务
            toFather: '0',
            toSon: '1',
            type: '1',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 车队
            toFather: '0',
            toSon: '1',
            type: '7',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 商品
            toFather: '0',
            toSon: '1',
            type: '2',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 进销存商品
            toFather: '0',
            toSon: '1',
            type: '12',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 员工
            toFather: '0',
            toSon: '1',
            type: '0',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 智能到店
            toFather: '0',
            toSon: '0',
            type: '9',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 到店设置
            toFather: '0',
            toSon: '0',
            type: '10',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 设备
            toFather: '0',
            toSon: '0',
            type: '11',
            toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
          },
          {
            // 仓库
            toFather: '0',
            toSon: '0',
            type: '15',
            toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
            toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
          }
        ],
        operatorName: '',
        parentName: ''
      };
    },
    handleConfirmed(selectionKeys, selections) {
      this.form = selections[0];
      // this.itemId = selections[0].id;
      this.$set(this.form, 'selectionKeys', selectionKeys);
      this.form.configList = [
        {
          // 会员
          toFather: '0',
          toSon: '1',
          type: '5',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 会员卡
          toFather: '0',
          toSon: '1',
          type: '6',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 车友会
          toFather: '0',
          toSon: '1',
          type: '8',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 活动
          toFather: '0',
          toSon: '1',
          type: '3',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 订单
          toFather: '0',
          toSon: '1',
          type: '4',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 进销存采购订单
          toFather: '0',
          toSon: '1',
          type: '13',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 进销存销售订单
          toFather: '0',
          toSon: '1',
          type: '14',
          toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 财务
          toFather: '0',
          toSon: '1',
          type: '1',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 车队
          toFather: '0',
          toSon: '1',
          type: '7',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 商品
          toFather: '0',
          toSon: '1',
          type: '2',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 进销存商品
          toFather: '0',
          toSon: '1',
          type: '12',
          toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 员工
          toFather: '0',
          toSon: '1',
          type: '0',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 智能到店
          toFather: '0',
          toSon: '0',
          type: '9',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 到店设置
          toFather: '0',
          toSon: '0',
          type: '10',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 设备
          toFather: '0',
          toSon: '0',
          type: '11',
          toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
        },
        {
          // 仓库
          toFather: '0',
          toSon: '0',
          type: '15',
          toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
          toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
        }
      ];
      this.form.unionType = '0';
      this.$refs.form.clearValidate('name');
      this.$refs.form.clearValidate('address');
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    parentCompanyAndStore() {
      service.parentCompanyAndStore(
        {
          id: this.parent || '',
          type: this.parentType || ''
        },
        data => {
          this.form.parentName = data.parentName;
          this.form.operatorName = data.operatorName;
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    unionTypeChange(value) {
      switch (value) {
        case '0':
          this.form.configList = [
            {
              // 会员
              toFather: '0',
              toSon: '1',
              type: '5',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 会员卡
              toFather: '0',
              toSon: '1',
              type: '6',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 车友会
              toFather: '0',
              toSon: '1',
              type: '8',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 活动
              toFather: '0',
              toSon: '1',
              type: '3',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 订单
              toFather: '0',
              toSon: '1',
              type: '4',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存采购订单
              toFather: '0',
              toSon: '1',
              type: '13',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存销售订单
              toFather: '0',
              toSon: '1',
              type: '14',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 财务
              toFather: '0',
              toSon: '1',
              type: '1',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 车队
              toFather: '0',
              toSon: '1',
              type: '7',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 商品
              toFather: '0',
              toSon: '1',
              type: '2',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存商品
              toFather: '0',
              toSon: '1',
              type: '12',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 员工
              toFather: '0',
              toSon: '1',
              type: '0',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 智能到店
              toFather: '0',
              toSon: '0',
              type: '9',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 到店设置
              toFather: '0',
              toSon: '0',
              type: '10',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 设备
              toFather: '0',
              toSon: '0',
              type: '11',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 仓库
              toFather: '0',
              toSon: '0',
              type: '15',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            }
          ];
          break;
        case '1':
          this.form.configList = [
            {
              toFather: '0',
              toSon: '1',
              type: '5',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '6',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '8',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '3',
              toFatherConfig: { share: '0', auditShare: '1', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '4',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存采购订单
              toFather: '0',
              toSon: '1',
              type: '13',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存销售订单
              toFather: '0',
              toSon: '1',
              type: '14',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '1',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存商品
              toFather: '0',
              toSon: '1',
              type: '12',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '7',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '2',
              toFatherConfig: { share: '0', auditShare: '1', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '0',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '9',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '10',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '11',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 仓库
              toFather: '0',
              toSon: '0',
              type: '15',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            }
          ];
          break;
        case '2':
          this.form.configList = [
            {
              toFather: '0',
              toSon: '1',
              type: '5',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '6',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '8',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '3',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '4',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存采购订单
              toFather: '0',
              toSon: '1',
              type: '13',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存销售订单
              toFather: '0',
              toSon: '1',
              type: '14',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '1',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存商品
              toFather: '0',
              toSon: '1',
              type: '12',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '7',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '2',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '0',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '9',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '10',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '11',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 仓库
              toFather: '0',
              toSon: '0',
              type: '15',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            }
          ];
          break;
        case '3':
          this.form.configList = [
            {
              toFather: '0',
              toSon: '1',
              type: '5',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '6',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '8',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '3',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '4',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存采购订单
              toFather: '0',
              toSon: '1',
              type: '13',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存销售订单
              toFather: '0',
              toSon: '1',
              type: '14',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '1',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存商品
              toFather: '0',
              toSon: '1',
              type: '12',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '7',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '2',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '0',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '9',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '10',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '11',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 仓库
              toFather: '0',
              toSon: '0',
              type: '15',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            }
          ];
          break;
        case '4':
          this.form.configList = [
            {
              toFather: '0',
              toSon: '1',
              type: '5',
              toFatherConfig: { share: '1', auditShare: '0', edit: '1', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '6',
              toFatherConfig: { share: '1', auditShare: '0', edit: '1', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '8',
              toFatherConfig: { share: '1', auditShare: '0', edit: '1', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '3',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '4',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存采购订单
              toFather: '0',
              toSon: '1',
              type: '13',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存销售订单
              toFather: '0',
              toSon: '1',
              type: '14',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '1',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 进销存商品
              toFather: '0',
              toSon: '1',
              type: '12',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '7',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '2',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '1',
              type: '0',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '9',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '1' },
              toSonConfig: { share: '1', auditShare: '0', edit: '1', copyShare: '1' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '10',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              toFather: '0',
              toSon: '0',
              type: '11',
              toFatherConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '0', auditShare: '0', edit: '0', copyShare: '0' }
            },
            {
              // 仓库
              toFather: '0',
              toSon: '0',
              type: '15',
              toFatherConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' },
              toSonConfig: { share: '1', auditShare: '0', edit: '0', copyShare: '0' }
            }
          ];
          break;
      }
    },
    queryStoreOrOperator() {
      this.loading = true;
      this.itemId &&
        service.query(
          {
            id: this.itemId || '',
            type: this.type || ''
          },
          data => {
            this.form = Object.assign(this.defaultMOdel(), data.content);
            if (data.content.configList && data.content.configList.length > 0) {
              this.showUnionType = true;
            } else {
              this.showUnionType = false;
            }
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.itemId || this.form.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.$emit('operationSuccess', {
                  id: this.parent,
                  userType: this.parentType
                });
                this.$nextTick(() => {
                  if (!this.parent) {
                    this.$emit('operationSuccess', {
                      id: this.itemId,
                      userType: this.type
                    });
                  }
                });
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            if (this.form.address === '') {
              this.$message.warning('请填写地址');
              this.loading = false;
              return false;
            }
            this.loading = true;
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.$emit('operationSuccess', {
                  id: this.parent,
                  userType: this.parentType
                });
                this.$nextTick(() => {
                  if (!this.parent) {
                    this.$emit('operationSuccess', {
                      id: this.itemId,
                      userType: this.type
                    });
                  }
                });
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          }
        }
      });
    },
    getSaveParams() {
      return {
        id: this.itemId ? this.itemId : this.form.id,
        name: this.form.name,
        cityCode: this.form.cityCode,
        parent: this.itemId ? this.form.parent : this.parent,
        parentType: this.itemId ? this.form.parentType : this.parentType,
        address: this.form.address,
        latBaidu: this.form.latBaidu,
        lngBaidu: this.form.lngBaidu,
        phone: this.form.phone,
        serviceMobile: this.form.serviceMobile,
        customerMobile: this.form.customerMobile,
        rescueMobile: this.form.rescueMobile,
        head: this.form.head,
        image: this.form.image,
        isEnabled: this.form.isEnabled,
        domains: this.form.domains,
        communitySilent: this.form.communitySilent,
        unionType: this.parentType === 'store' || this.form.parentType === 'store' ? this.form.unionType : '',
        configList: this.parentType === 'store' || this.form.parentType === 'store' ? this.form.configList : []
      };
    },
    isShow(dialogTableVisible) {
      this.dialogTableVisible = !dialogTableVisible;
    },
    showStorePicker(e) {
      this.showDialog = true;
    },
    queryStoreList(params) {
      service.listAdditiveStore(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleAddressChange(val, city) {
      this.$set(this.form, 'address', val);
      this.$refs.form.clearValidate('address');
      this.form.cityCode = cityCode[city];
    },
    handleUploadSuccess(url) {
      this.$set(this.form, 'head', url);
    },
    opened() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryStoreList(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        parentType: this.parentType,
        parentId: this.parent
      };
    },
    getType(value) {
      switch (value) {
        case '0':
          return '员工' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 员工信息';
        case '1':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '    |- 财务信息';
        case '2':
          return '商品' + '&nbsp;&nbsp;&nbsp;&nbsp' + '|- 商品信息' + '&nbsp;&nbsp;&nbsp;&nbsp' + '|- 电商商品';
        case '12':
          return (
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
            '|- 进销存商品'
          );
        case '3':
          return '营销' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 营销活动';
        case '4':
          return '订单' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 会员订单';
        case '13':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 进销存采购订单';
        case '14':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 进销存销售订单';
        case '5':
          return '会员' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 会员信息';
        case '6':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '    |- 会员卡';
        case '7':
          return '车辆' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 车队';
        case '8':
          return (
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            '    |-车友会' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            '|- 车友信息'
          );
        case '9':
          return '设备' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 智能到店';
        case '10':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '    |- 到店设置';
        case '11':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '    |- 设备管理';
        case '15':
          return '仓库' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '|- 仓库信息';
      }
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryStoreList(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryStoreList(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryStoreList(this.getDialogQueryParams());
    },
    print() {
      window.open(
        document.location.protocol +
          '//' +
          window.location.host +
          '/#/qrcode-print?img=' +
          this.form.qrCodePath +
          '&shopName=' +
          this.form.name
      );
    },
    view() {
      window.open(document.location.protocol + '//' + window.location.host + this.form.qrCodePath);
    },
    dialogOperate(name) {}
  }
};
</script>

<style lang="scss">
.biz-store-dialog-selector {
  .biz-two-column {
    display: flex;
    img {
      width: 60px;
      height: 60px;
    }
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.configList {
  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border: none;
  }
  .el-checkbox-button,
  .el-checkbox-button__inner {
    padding: 0px 10px;
  }
  .el-checkbox-button__inner {
    border: none;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #fff;
    border-color: #fff;
    box-shadow: -1px 0 0 0 #fff;
    color: #ff7300;
  }
}
.fedration-mgmt-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-col .el-input {
    width: 80%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
