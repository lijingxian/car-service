<template>
  <div class="goods__category-picker">
    <div class="category">
      <div class="specify-groups text_dark" v-for="(group, index) in specList" :key="group.id">
        <div class="group-name">{{group.name}}</div>
        <div class="group-values">
          <span class="item" v-for="spec in group.sub" :key="spec.id" :class="{ active: selectedSpecArr.includes(spec.id), disabled: spec.disabled }"
            @click="handleSpecClick(spec, index)">
            {{ spec.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';

// 规格选择
const specSelect = {
  data: {
    selectedSpecArr: []
  },
  computed: {
    // 规格列表
    specList() {
      const { specifications, specificationValues, specificationGroups } = this.product;
      if (!specifications || !specificationValues || !specificationGroups) return [];
      // 已选中分类id数组
      const { selectedSpecArr } = this;
      // 创建分类列表
      let specList = [];
      specList = specifications.map((specGroupName, index) => {
        // e.g. 颜色分类下的颜色类别(R, G, B)
        let specs = specificationValues.filter(val => val.specificationId === specGroupName.id);
        return {
          id: specGroupName.id,
          name: specGroupName.name,
          sub: specs
        };
      });
      // disabled start
      if (!selectedSpecArr.length) {
        // 未选中任意规格时, 遍历所有规格
        specList.forEach(spec => {
          spec.sub.forEach(s => {
            // 查找有当前规格且没有库存的商品, !(商品库存 > 0);
            s.disabled = !(
              specificationGroups.find(prod => prod.specificationValue.find(val => val.id === s.id)).productStock > 0
            );
          });
        });
      } else {
        // 遍历规格列表
        specList.forEach((spec, index) => {
          // 如果当前层是规格列表最后一层则直接返回
          if (index === specList.length - 1) return;
          // 下一层的规格, 遍历
          specList[index + 1].sub.forEach(s => {
            // 查找符合到当前层规格, 且库存 > 0的商品
            const eligibleProds = specificationGroups.filter(
              prod =>
                selectedSpecArr.slice(0, index + 1).every(selectId => prod.specificationValue.find(val => val.id === selectId)) &&
                prod.productStock > 0
            );
            if (eligibleProds.length) {
              s.disabled = !eligibleProds.find(prod => prod.specificationValue.find(val => val.id === s.id));
            } else {
              s.disabled = true;
            }
          });
        });
      }
      // disabled end
      console.log('specList: ', specList);
      return specList;
    },
    // 符合选中规格的商品(取第一个或当前商品id)
    currentProductId() {
      const { specificationGroups } = this.product;
      const { selectedSpecArr } = this;
      if (!specificationGroups || !selectedSpecArr.length) return this.product.id;
      const currentProduct = specificationGroups.find(i =>
        selectedSpecArr.every(specId => i.specificationValue.find(val => val.id === specId))
      );
      if (currentProduct) return currentProduct.productId;
      return this.product.id;
    }
  },
  watch: {
    product(newVal, oldVal) {
      this.makeProduct(newVal);
      if (!this.selectedSpecArr.length) {
        this.setDefaultSelected();
      }
    },
    currentProductId(newVal, oldVal) {
      console.log('selectedChange: ', this.currentProductId);
      this.$emit('selecedId', this.currentProductId);
      if (newVal !== oldVal) {
        this.query({ item: { productId: newVal } });
      }
    }
  },
  methods: {
    handleSpecClick(spec, index) {
      // 如果为disabled或者已选中则直接返回
      if (spec.disabled || this.selectedSpecArr.includes(spec.id)) return;
      this.$set(this.selectedSpecArr, index, spec.id);
      this.selectedSpecArr.length = index + 1;
      let selecedName = [];
      // 修改当前选中规格下层的规格
      for (let i = index + 1; i < this.specList.length; i++) {
        const setNewDefault = this.specList[i].sub.find(spec => !spec.disabled);
        if (!setNewDefault) {
          break;
        }
        this.selectedSpecArr[i] = setNewDefault.id;
      }
      console.log('selectedArr: ', this.selectedSpecArr);
      this.product.specificationValues.map(item => {
        if (this.selectedSpecArr.includes(item.id)) {
          selecedName.push(item.name);
        }
      });
      this.$emit('selecedName', selecedName);
    },
    // 设置默认选项
    setDefaultSelected() {
      const { specificationGroups } = this.product;
      // 选择>当前页面商品<的规格id
      const currentProd = specificationGroups.find(prod => prod.productId === this.product.id);
      // 保证选中规格列表的id顺序
      this.selectedSpecArr = this.specList.map(spec => {
        return currentProd.specificationValue.find(val => val.specificationId === spec.id).id;
      });
      let selecedName = this.specList.map(spec => {
        return currentProd.specificationValue.find(val => val.specificationId === spec.id).name;
      });
      this.$emit('selecedName', selecedName);
      console.log('defaultSelected: ', this.selectedSpecArr);
    }
  }
};

// 商品分类相关
const specifyData = {
  data: {
    // 可选择的分类, item.list是分类下可选的具体项
    // 如：[ { 颜色 - [ 红, 黄, 蓝 ] }, { 材质 - [ 布艺, 真皮 ] } ]
    specifyList: [],
    // 当前选中项的集合，有点击的先后顺序，先点击的在前面
    selectedTags: [],
    // 可选项集合
    selectable: []
  },
  methods: {
    // 加载失败，替换为默认图片
    // imgError() {
    //   // debugger;
    //   this.$refs.img.src = this.defaultFailImg;
    // },
    dealWithSpecification(product) {
      // 获取分类的id与该分类的Map
      this.specifyMap = this.getSpecifyMap(product.specifications);
      // 设置相关的tag
      this.relativeMap = this.getRelativeMap(product.specificationGroups);
      // 设置tag的id与该tag的Map
      this.tagMap = this.getTagMap(product.specificationValues);
      // 设置需要显示的规格tag
      this.specifyList = this.setSpecificationList(product);

      // 设置默认选项
      // this.setDefaultSpecify(product);
      // this.setDefaultSelected();
    },
    setDefaultSpecify(product) {
      let arr = [];
      for (let i = 0; i < product.specificationGroups.length; i++) {
        if (product.specificationGroups[i].productId === product.id) {
          arr = product.specificationGroups[i].specificationValue;
        }
      }
      let index = 0;
      this.selectedTags = arr.map(item => {
        let obj = {
          index: index,
          tag: item
        };
        index++;
        return obj;
      });
    },
    getRelativeMap(list) {
      let map = new Map();
      list.forEach(item => {
        let ids = [];
        item.specificationValue.forEach(tag => {
          ids.push(tag.id);
        });
        // 用于获取可选的tag ID集合
        map.set(item.productId, ids);
        // 用于根据可选值获取对应的产品id
        map.set(ids.join(':'), item.productId);

        item.specificationValue.forEach(tag => {
          map.set(tag.id, map.get(item.productId));
        });
      });

      return map;
    },
    getTagMap(list) {
      let map = new Map();
      list.forEach(item => {
        map.set(item.id, item);
        // 将该tag添加到对应的分类下面
        this.specifyMap.get(item.specificationId).list.push(item);
      });

      return map;
    },
    getSpecifyMap(list) {
      let map = new Map();
      list.forEach(item => {
        // 该分类下的tag集合
        item.list = [];
        map.set(item.id, item);
      });

      return map;
    },
    setSpecificationList(product) {
      return product.specifications.map(item => {
        let arr = [];
        product.specificationValues.forEach(tag => {
          if (tag.specificationId === item.id) arr.push(tag);
        });
        item.list = arr;
        return item;
      });
    },
    isDisabled(index, id) {
      return this.selectable[index] && this.selectable[index].length > 0 && !this.selectable[index].includes(id);
    },
    getSelectedIndex(index) {
      for (let i = 0; i < this.selectedTags.length; i++) {
        if (this.selectedTags[i].index === index) return i;
      }

      return -1;
    },

    filterTags(tags) {
      // 没有值，则表示都可以选中
      // 有值，则按照顺序进行筛选
      if (tags.length === 0) {
        this.selectable = this.specifyList.map(element => {
          return element.list.map(item => item.id);
        });
      } else {
        let resultList = new Array(this.specifyList.length);
        let resultTemp = [];
        let groups = this.innerProduct.specificationGroups;

        tags.forEach((item, itemIndex) => {
          let index = item.index;
          let tag = item.tag;

          // 如果不是第一个，则根据上一个的结果生成可选项的集合
          // 如果是第一个，则需要插入全部可选值
          if (itemIndex > 0) {
            let result = [];
            resultTemp.forEach(prod => {
              let specfiy = prod.specificationValue[index];
              if (!result.includes(specfiy.id)) {
                result.push(specfiy.id);
              }
            });
            resultList[index] = result;
          } else {
            resultList[index] = this.specifyList[index].list.map(item => item.id);
          }

          resultTemp = groups.filter(item => {
            if (item.specificationValue[index].id === tag.id) return item;
          });
          groups = resultTemp;
        });

        // 如果有未选中，则需要根据现有条件进行显示
        for (let i = 0; i < resultList.length; i++) {
          if (!resultList[i] || resultList[i].length === 0) {
            let result = [];
            resultTemp.forEach(prod => {
              let specfiy = prod.specificationValue[i];
              if (!result.includes(specfiy.id)) {
                result.push(specfiy.id);
              }
            });
            resultList[i] = result;
          }
        }
        this.selectable = resultList;

        if (groups.length === 1 && resultList.length === this.specifyList.length) {
          this.query({ item: groups[0] });
        }
      }
    }
  },
  events: {
    handleTagClick(index, tag, e) {
      let position = this.getSelectedIndex(index);
      // 没有则直接添加
      if (position < 0) {
        this.selectedTags.push({
          index,
          tag
        });
      } else {
        // 如果存在，则删除
        // 如果存在同级别的，则替换，并删除其他选项
        if (this.selectedTags[position].tag.id === tag.id) {
          this.selectedTags.splice(position, 1);
        } else {
          this.selectedTags.splice(position, 1, {
            index,
            tag
          });

          position++;
          while (this.selectedTags[position]) {
            this.selectedTags.splice(position, 1);
            position++;
          }
        }
      }
    }
  }
};

export default {
  name: 'CategoryPicker',
  components: {},
  props: {
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    product: {
      type: Object,
      default() {
        return {};
      }
    },

    // 0-选择规格 1-加入购物车 2-立即购买(支付订金?) 3-预约 4-购买套餐
    operateType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      innerProduct: {},
      count: 1,

      ...specifyData.data,
      ...specSelect.data
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...specSelect.computed,
    // 预览图片
    // computedImage () {
    //   return this.innerProduct.image ? (this.host + this.innerProduct.image) : defaultImg;
    // },

    // 是否是套餐商品
    isPackage() {
      return String(this.operateType) === '4';
    },
    activeTags() {
      let arr = [];
      for (let i = 0; i < this.selectedTags.length; i++) {
        arr.push(this.selectedTags[i].tag.id);
      }
      return arr;
    },
    activeTagsString() {
      return this.activeTags.join(':');
    },
    buttonText() {
      if (this.innerProduct.productType === '1') {
        return '立即兑换';
      }
      let con = '';

      // 0-选择规格 1-加入购物车 2-立即购买(支付订金?) 3-预约 4-购买套餐
      if (this.operateType === '0') {
        con = '选择规格';
      } else if (this.operateType === '1') {
        con = '加入购物车';
      } else if (this.operateType === '2') {
        // isSubscription '0':'立即购买' '1': '支付订金'
        if (this.innerProduct.isSubscription === '0') {
          con = '立即购买';
        } else {
          con = '支付订金';
        }
      } else if (this.operateType === '3') {
        con = '预约';
      } else if (this.operateType === '4') {
        con = '购买套餐';
      } else {
        con = '确定';
      }

      return con;
    },
    priceShow() {
      if (this.innerProduct.productType === '1') {
        return `${this.innerProduct.bean} V豆`;
      }
      return `￥${this.innerProduct.price || '0'}`;
    }
  },
  watch: {
    ...specSelect.watch,
    activeTagsString(val, old) {
      this.filterTags(this.selectedTags);

      // 如果都选择了，则进行查询
      // if (this.selectedTags.length === this.specifyList.length) {
      //   this.
      // }
    }
  },
  methods: {
    ...specifyData.methods,
    ...specifyData.events,
    ...specSelect.methods,

    handleHide(show) {
      this.$emit('update:open', show);
    },
    handleSubmit(e, type) {
      // 校验
      if (!/^[1-9]\d*$/.test(String(this.count))) {
        this.showToast('请输入合法数量');
        this.count = 1;
        return;
      }

      if (Number(this.count) <= Number(this.innerProduct.stock)) {
        // emit
        this.emitResult(type);
      } else {
        if (this.operateType === '1') {
          this.showToast('已超出库存数量，无法加入购物车');
        } else if (this.operateType === '2') {
          if (this.innerProduct.isSubscription === '0') {
            this.showToast('已超出库存数量，无法立即购买');
          } else {
            this.showToast('已超出库存数量，无法支付订金');
          }
        }
      }
    },

    /* 数据处理 */
    makeProduct(product) {
      let p = product || this.product;
      let _p = {};
      // _p.image = (p.image && this.host + p.image) || defaultImg;
      _p.stock = p.stock;
      _p.quantity = 1;
      // 套餐商品
      if (this.isPackage) {
        _p.amount = this.promotion.coupon.amount;
        let cartObj = {
          packageId: this.promotion.id,
          isMatch: '1',
          quantity: 1,
          product: {}
        };
        _p.cartItems = [];
        this.promotion.product.forEach(item => {
          _p.cartItems.push(
            Object.assign({}, cartObj, {
              product: {
                id: item.id
              }
            })
          );
        });
      } else {
        // 普通商品
        _p.amount = p.price;

        this.dealWithSpecification(p);
      }
      this.innerProduct = Object.assign({}, p, _p);
    },
    // 获取新的产品信息
    query({ item }) {
      let params = this.getSearchParams(item);

      http
        .get(urls.hypermarketMgmt.product, params)
        .then(data => {
          this.makeProduct(data.product);
        })
        .catch(() => {});
    },
    getSearchParams(item) {
      return {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,

        productId: item.productId
      };
    },
    // 传递事件给上层对象
    emitResult(type) {
      // 返回数据(订单需要的数据)给外层
      // 规格变化需要将整个产品传回外层
      this.$emit('result', {
        product: this.innerProduct,
        productId: this.innerProduct.id,
        amount: this.innerProduct.amount,
        quantity: this.count,
        categoryText: this.activeTagsString,
        type: type
      });
    },

    showToast(msg, type) {
      let option = {
        txt: msg,
        type: 'warn',
        time: 1000
      };
      this.$createToast(option).show();
    }
  }
};
</script>

<style lang="scss">
.goods__category-picker {
  .cube-picker-panel {
    height: auto;
  }

  .header {
    background: #fff;
    display: block;
    text-align: left;
    border-bottom: 1px solid #e1e1e1;
    padding: 0 10px;

    .image {
      float: left;
      margin-top: -40px;
      width: 120px;
      height: 100px;
      padding: 5px;
      background: #fff;
      border-radius: 5px;
      overflow: hidden;

      img {
        width: 100%;
        border-radius: 3px;
      }
    }

    .content {
      display: inline-block;
      padding: 20px;

      .price {
        font-size: 16px;
        color: red;
        margin-bottom: 5px;
      }

      .stock {
        margin-bottom: 5px;
        color: #666;
        font-size: 12px;
      }
    }
  }

  .category {
    .specify-groups {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid #e1e1e1;

      .group-name {
        padding-bottom: 10px;
        text-align: left;
        font-size: 12px;
      }
      .group-values {
        display: flex;
        flex-direction: row;

        .item {
          font-size: 12px;
          padding: 10px 10px;
          margin-right: 10px;

          &.active {
            background: #ff7300;
            color: #fff;
          }
          &.disabled {
            color: #bbb;
          }

          img {
            display: inline-block;
            vertical-align: middle;
            object-fit: cover;
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }

  .count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  .footer {
    display: flex;

    .cube-btn {
      flex-grow: 1;
      border-radius: 0;
    }
  }
}
</style>
