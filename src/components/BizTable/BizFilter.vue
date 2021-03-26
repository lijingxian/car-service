<template>
  <div class="biz-table-filter">
    <div v-for="(filter,index) of filters" :key="index" class="filter-wrap" :class="filter.type==='checkBox'?'checkBox-width':''">
      <label class="filter-label" :class="filter.class">{{filter.label}}</label>
      <!-- 选择器 -->
      <div v-if="filter.type==='select'" class="biz-select" :class="filter.class">
        <el-select size="mini" v-model="filter.value" :filterable="filter.filterable" :multiple="filter.multiple" :collapse-tags="filter.collapseTags" :disabled="filter.disabled || false">
          <el-option v-for="item in filter.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <!-- 级联(运营商) -->
      <div v-if="filter.type === 'cascader'" class="biz-cascader" :class="filter.class">
        <el-cascader
          :filterable="filter.filterable"
          :change-on-select="filter.changeOnSelect?filter.changeOnSelect:false"
          placeholder="全部"
          size="mini"
          :show-all-levels="filter.showAllLevels?filter.showAllLevels:false"
          :props="cascaderProps"
          :value="filter.value"
          :options="filter.options"
          :clearable="true"
          @change="handleCascaderChange"
          @active-item-change="activeItemChange"
        ></el-cascader>
      </div>
      <!-- 开关 -->
      <div v-if="filter.type==='switch'" class="biz-switch" :class="filter.class">
        <el-switch
          size="mini"
          v-model="filter.value"
          :active-text="filter.activeText"
          :active-value="filter.activeValue"
          :inactive-text="filter.inactiveText"
          :inactive-value="filter.inactiveValue"
        ></el-switch>
      </div>
      <!-- 输入框(搜索) -->
      <div v-if="filter.type==='input'" class="biz-input" :class="filter.class">
        <el-input size="mini" :placeholder="filter.placeholder" v-model="filter.value"  @keyup.enter.native="inputSearch">
          <el-select @change="inputOptionChange" v-for="select in filter.select" :key="select.index" v-model="select.value" slot="prepend">
            <el-option v-for="item in select.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="inputSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 输入框-->
      <div v-if="filter.type==='inputValue'" class="biz-input" :class="filter.class">
        <el-input size="mini" :placeholder="filter.placeholder" v-model="filter.value">
        </el-input>
      </div>
      <!-- 年份选择 -->
      <div v-if="filter.type==='year'" class="biz-year" :class="filter.class">
        <el-date-picker
          @change="dateChanged($event, filter)"
          size="mini"
          v-model="filter.value"
          align="right"
          type="year"
          :clearable="filter.clearable !== false"
          value-format="yyyy"
          placeholder="选择年"
        ></el-date-picker>
      </div>
      <!-- 日期选择 -->
      <div v-if="filter.type==='date'" class="biz-date" :class="filter.class">
        <el-date-picker
          @change="dateChanged($event, filter)"
          unlink-panels
          :start-placeholder="filter.startPlaceholder"
          :end-placeholder="filter.endPlaceholder"
          :clearable="filter.clearable !== false"
          size="mini"
          v-model="filter.value"
          value-format="yyyy-MM-dd"
          type="date"
          range-separator="至"
        ></el-date-picker>
      </div>
      <!-- 日期范围 -->
      <div v-if="filter.type==='daterange'" class="biz-date-range" :class="filter.class">
        <el-date-picker
          @change="dateRangeChanged($event, filter)"
          unlink-panels
          :start-placeholder="filter.startPlaceholder"
          :end-placeholder="filter.endPlaceholder"
          :clearable="filter.clearable !== false"
          size="mini"
          v-model="filter.value"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
        ></el-date-picker>
      </div>
      <div v-if="filter.type==='datetimerange'" class="biz-date-time-range" :class="filter.class">
        <el-date-picker
          @change="dateRangeChanged($event, filter)"
          v-model="filter.value"
          :start-placeholder="filter.startPlaceholder"
          :end-placeholder="filter.endPlaceholder"
          :clearable="filter.clearable !== false"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          size="mini"
          range-separator="至"
        ></el-date-picker>
      </div>
      <div v-if="filter.type==='timerange'" class="biz-time-range" :class="filter.class">
        <el-time-picker
          @change="dateRangeChanged($event, filter)"
          is-range
          v-model="filter.value"
          :start-placeholder="filter.startPlaceholder"
          :end-placeholder="filter.endPlaceholder"
          :clearable="filter.clearable !== false"
          placeholder="选择时间范围"
          value-format="HH:mm:ss"
          size="mini"
        ></el-time-picker>
      </div>
      <!-- 输入框区间选择 -->
      <div v-if="filter.type==='inputrange'" class="biz-input-range" :class="filter.class">
        <el-input placeholder v-model.number="filter.value1" class="input-with-select" size="mini">
          <el-select v-model="filter.selectValue" slot="prepend" placeholder="请选择">
            <el-option v-for="item in filter.selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <div slot="append" class="last-slot">
            <span class="range">-</span>
            <el-input v-model.number="filter.value2" placeholder controls-position="right"></el-input>
          </div>
        </el-input>
      </div>
      <!--单选框选择-->
      <div v-if="filter.type==='single'" :class="filter.class">
        <el-radio-group @change="indicatorChanged($event, filter)" v-model="filter.value" size="mini">
          <el-radio-button v-for="indicator in filter.options" :key="indicator.value" :label="indicator.value">{{indicator.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <!--单选框选择按钮-->
      <div v-if="filter.type==='radio'" :class="filter.class">
        <el-radio-group @change="indicatorChanged($event, filter)" v-model="filter.value" size="mini">
          <el-radio v-for="indicator in filter.options" :key="indicator.value" :label="indicator.value">{{indicator.label}}</el-radio>
        </el-radio-group>
      </div>
      <!--复选框选择按钮-->
      <div v-if="filter.type==='checkBox'" :class="filter.class" ref="checkbox">
        <div class="indicators-search">
          <el-checkbox-button v-model="filter.checkAll" :indeterminate="filter.isIndeterminate" @change="handleCheckAll(filter)">全部
          </el-checkbox-button>
          <el-checkbox-group v-model="filter.value" @change="handleCheck(filter)">
            <el-checkbox-button v-for="(item,index) in filter.options" :label="item.value" :key="index" size="mini">{{item.label}}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="more" v-if="filter.showMore"><el-button type="text" size="mini" @click="more(filter)">更多...</el-button></div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible">
      <!-- <el-input size="mini" placeholder="请输入关键字检索" v-model="keyWord"  @keyup.enter.native="search(filter)">
        <el-button @click="search(filter)" slot="append" icon="el-icon-search"></el-button>
      </el-input> -->
       <div class="indicators-search" style="height:auto">
          <el-checkbox-button v-model="filter.checkAll" :indeterminate="filter.isIndeterminate" @change="handleCheckAll(filter)">全部
          </el-checkbox-button>
          <el-checkbox-group v-model="filter.value" @change="handleCheck(filter)">
            <el-checkbox-button v-for="(item,index) in filter.options" :label="item.value" :key="index" size="mini">{{item.label}}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm(filter)" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BizFilter',
  data() {
    return {
      // 去除clear按钮
      daterange: { Clearable: false },
      dialogVisible: false,
      keyWord: '',
      filter: {},
      // cascader => 当前级别为label, 下一级别为children
      cascaderProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      }
    };
  },
  props: {
    filters: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    // 把需要监听的数据放入,目前除了input搜索的其它都需要监听
    watchFilters: function() {
      let filters = [];
      for (const filter of this.filters) {
        if (
          filter.type !== 'input' &&
          ['year', 'date', 'daterange', 'datetimerange', 'timerange', 'cascader'].indexOf(filter.type) === -1
        ) {
          if (filter.type === 'select' || filter.type === 'single' || filter.type === 'checkBox') {
            filters.push({
              value: filter.value
            });
          } else {
            filters.push(filter);
          }
        }
      }
      return filters;
    }
  },
  watch: {
    watchFilters: {
      handler: function() {
        // 此处屏蔽了input的输入变化
        this.filters.map(filter => {});
        this.$emit('filterDataChange', this.filters);
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
    setTimeout(() => {
      console.log(document.querySelectorAll('.indicators-search'));
    }, 1000);
  },
  methods: {
    more(filter) {
      this.filter = filter;
      this.dialogVisible = true;
    },
    search(filter) {
      console.log(this.keyWord);
      let temp = this.filter.options.filter(item => {
        console.log(item.label.indexOf(this.keyWord));
        return item.label.indexOf(this.keyWord) !== -1;
      });
      this.filter.options = temp;
    },
    confirm(filter) {
      let arr = filter.options.filter(item => {
        return filter.value.indexOf(item.value) !== -1;
      });
      let brr = filter.options.filter(item => {
        return filter.value.indexOf(item.value) === -1;
      });
      filter = { options: arr.concat(brr), label: filter.label };
      console.log(filter);
      this.dialogVisible = false;
      this.$emit('closeDialogFilter', filter);
    },
    handleCheckAll(filter) {
      console.log(filter);
      filter.value = filter.checkAll
        ? filter.options.map(item => {
          return item.value.toString();
        })
        : [];
    },
    handleCheck(filter) {
      let checkedCount = filter.value.length;
      filter.checkAll = checkedCount === filter.options.length;
      filter.isIndeterminate = checkedCount > 0 && checkedCount < filter.options.length;
    },
    // cascader加载下一级菜单
    handleCascaderChange(value) {
      this.$emit('cascader-change', value);
    },
    activeItemChange(value) {
      this.$emit('active-item-change', value);
    },
    inputOptionChange(value) {
      this.$emit('input-option-change', this.filters);
    },
    inputSearch() {
      this.$emit('filterDataChange', this.filters);
    },
    indicatorChanged(val, filter) {
      this.$emit('indicatorDataChange', this.filters);
    },
    dateRangeChanged(val, filter) {
      if (val === null) {
        this.$nextTick(() => {
          // 这里不能重置为['', ''], 会让时间变为1970年一月一日
          // filter.value = ['', ''];
          filter.value = [];
          this.$emit('filterDataChange', this.filters);
        });
      } else {
        this.$emit('filterDataChange', this.filters);
      }
    },
    dateChanged(val, filter) {
      if (val === null) {
        this.$nextTick(() => {
          filter.value = '';
          this.$emit('filterDataChange', this.filters);
        });
      } else {
        this.$emit('filterDataChange', this.filters);
      }
    }
  }
};
</script>

<style lang="scss">
.biz-table-filter {
  display: flex;
  flex-wrap: wrap;
  .more {
    font-size: 12px;
    line-height: 56px;
  }
  .show {
    display: flex;
  }
  .indicators-search {
    display: flex;
    height: 56px;
    overflow: hidden;
    .el-checkbox-button {
      padding: 15px;
    }
    .el-checkbox-button__inner {
      padding: 10px;
      font-size: 12px;
      border: none;
    }
    .el-checkbox-button:first-child .el-checkbox-button__inner {
      border: none;
      border-radius: 15px;
    }
    .el-checkbox-button:last-child .el-checkbox-button__inner {
      border-radius: 15px;
    }
    .el-checkbox-button,
    .el-checkbox-button__inner {
      border-radius: 15px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner {
      background-color: #fff;
      border-color: #fff;
      box-shadow: -1px 0 0 0 #fff;
      color: #ff7300;
    }
    .title {
      padding: 20px 10px;
      font-size: 12px;
      width: 130px;
    }
    .hardGroup {
      display: flex;
      width: calc(100% - 90px);
    }
    .hardSeriesGroup {
      display: flex;
      width: calc(100% - 90px);
    }
  }
  .filter-label {
    // 防止label变成多行
    white-space: nowrap;
    margin-right: 5px;
    font-size: 14px;
    color: #606266;
  }
  .checkBox-width {
    width: 100%!important;
  }
  .filter-wrap:first-child {
    margin-left: 10px!important;
  }
  .filter-wrap {
    margin-left: 10px;
    display: flex;
    align-items: center;
    .show {
      display: '';
    }
    .hidden {
      display: none!important;
    }
    &:first-child {
      margin-left: 0;
    }
    .biz-select {
      .el-select {
        width: 100px;
      }
    }
    .biz-input {
      // 解决输入框有前置部分且为选择框时样式错误的问题
      .el-input-group--prepend {
        float: left;
      }
      .el-input-group__prepend {
        padding: 0;
        .el-select {
          margin: -10px 0;
        }
        .el-input {
          width: 100px;
        }
      }
      .el-input-group__append {
        padding: 5px 10px;

        &:hover {
          color: #ff8d00;
          background-color: #fdf3e5;
        }
      }
    }
    .biz-year {
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 105px;
      }
      input {
        width: 100px;
      }
    }
    .biz-date-range,
    .biz-date-time-range,
    .biz-time-range {
      .el-date-editor--daterange.el-input__inner,
      .el-date-editor--timerange.el-input__inner {
        width: 220px;
      }
      span {
        padding: 0;
        width: 15px;
      }
    }
    .biz-input-range {
      display: inline-flex;
      .el-input__inner {
        width: 60px;
      }
      .el-input-group__prepend {
        .el-select {
          .el-input__inner {
            width: 105px;
          }
        }
      }
      .el-input-group__append {
        background: #ffffff;
        border: none;
      }
      .last-slot {
        margin-left: -10px;
        .range {
          margin-right: 10px;
        }
      }
    }
    .biz-switch {
      .el-switch__label--left {
        margin-right: 5px;
      }
      .el-switch__label--right {
        margin-left: 5px;
      }
    }
  }
}
</style>
