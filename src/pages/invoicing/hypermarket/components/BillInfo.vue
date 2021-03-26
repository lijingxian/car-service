<template>
  <biz-grid class="bill-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-card v-for="receiver in receiverList" :key="receiver.id">
      <div @click="selectItem(receiver)">
        <div class="top">
          <span>{{receiver.consignee}}</span>
          <span>{{receiver.phone}}</span>
        </div>
        <div class="content">
          <span>{{receiver.areaName + receiver.address}}</span>
        </div>
      </div>
      <div class="bottom">
        <el-checkbox v-model="receiver.isDefault" true-label="1" false-label="0" size="mini" @change="setDefault(receiver)">设为默认</el-checkbox>
        <div class="handler">
          <i class="el-icon-edit-outline" @click="editForm(receiver)">编辑</i>
          <i class="el-icon-delete" @click="deleteForm(receiver.id)">删除</i>
        </div>
      </div>
    </el-card>
    <div v-if="receiverList.length === 0" :style="styleObject"></div>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-show="showForm" :inline-message="true">
      <el-form-item label="收货人姓名" prop="consignee">
        <el-input type="text" v-model="form.consignee"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input type="text" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="省市">
        <biz-area-select :areaId="form.area.id" @areaChanged="handleAreaChanged"></biz-area-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input type="area" v-model="form.address" maxlength="100"></el-input>
      </el-form-item>
      <biz-save-button :operations="formOperations" @operate="operate"></biz-save-button>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters, mapMutations } from 'vuex';
import BizAreaSelect from '@/components/BizAreaSelect';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  components: {
    BizSaveButton,
    BizAreaSelect,
    BizGrid
  },
  data() {
    return {
      receiverList: [],
      showForm: false,
      operations: [{ label: '新增', name: 'add', type: 'primary' }],
      formOperations: [{ label: '保存', name: 'save', type: 'primary' }, { label: '取消', name: 'cancel', type: 'primary' }],
      rules: {
        consignee: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ]
      },
      form: this.getDetaultModel()
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '300px',
        width: '300px',
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 0% / 300px no-repeat'
      };
    }
  },
  created() {
    this.query();
  },
  methods: {
    ...mapMutations('Order', ['updateSelAddress']),
    operate(name) {
      this[name]();
    },
    getDetaultModel() {
      return {
        consignee: '',
        phone: '',
        address: '',
        area: {
          id: '1568'
        },
        areaName: '',
        isDefault: '1'
      };
    },
    add() {
      this.showForm = true;
      this.form = this.getDetaultModel();
    },
    cancel() {
      this.showForm = false;
    },
    editForm(row) {
      this.form = Object.assign(this.getDetaultModel(), row);
      this.showForm = true;
    },
    selectItem(receiver) {
      this.updateSelAddress(receiver);
      this.$emit('selectedItem');
    },
    deleteForm(id) {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        ids: [id]
      };
      this.$confirm('是否确认删除收货地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete(urls.hypermarketMgmt.receiver, params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(ErrorData => {
            this.$message({
              message: ErrorData.errorMessage,
              type: 'warning'
            });
            console.log('ERR_REFRESH: ', ErrorData);
          })
          .finally(data => {});
      });
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.form.areaId = this.form.area.id;
          if (this.form.id) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    create() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        receiver: this.form
      };
      http
        .post(urls.hypermarketMgmt.receiver, params)
        .then(data => {
          this.updateSelAddress(data.receivers[0]);
          this.$message.success('添加成功');
          this.query();
          this.showForm = false;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    setDefault(row) {
      this.form = Object.assign(this.getDetaultModel(), row);
      this.update();
    },
    update() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        receiver: this.form
      };
      http
        .put(urls.hypermarketMgmt.receiver, params)
        .then(data => {
          this.$message.success('更新成功');
          this.query();
          this.showForm = false;
          if (this.form.isDefault === '1') {
            this.updateSelAddress(this.form);
          }
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    handleAreaChanged(areaId) {
      this.form.area.id = areaId;
    },
    query() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.receiverList, params)
        .then(data => {
          this.receiverList = data.receivers || [];
          if (this.receiverList.length === 0) {
            this.updateSelAddress({});
          }
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    }
  }
};
</script>
<style lang="scss">
.bill-info {
  font-size: 12px;
  padding: 20px;
  min-height: 500px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    position: relative;
    z-index: 10;
    background: #fff;
    width: 80%;
  }
  .top {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .content {
    border-bottom: 1px dotted #e1e1e1;
    padding: 10px 0px;
    color: #666666;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    color: #666666;
    padding: 10px 0px 0px 0px;
    .handler {
      width: 100px;
      justify-content: space-around;
      display: flex;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .el-form {
    padding: 10px;
  }
}
</style>
