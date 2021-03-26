<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="scss">
#app {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: 100%;
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #dcdfe6;
  }
  .el-form {
    .el-input {
      width: 200px;
    }
    .el-input-number--small {
      width: 200px;
    }
  }
  .el-table__empty-text {
    position: static;
  }
  .el-select .el-input__inner {
    font-size: 12px;
  }
  .biz-table-filter .filter-label {
    font-size: 12px;
  }
  .biz-grid {
    padding: 5px 35px 5px 15px;
  }
  .el-tabs .biz-grid {
    padding: 10px;
  }
  .biz-header {
    padding: 10px 0px;
  }
  .biz-grid__bottom {
    padding-top: 10px;
  }
  .el-pagination {
    color: #606266;
    font-weight: normal;
    .el-pager li.btn-quickprev,
    .el-pager li.btn-quicknext {
      color: #606266;
    }
    .el-pager li {
      min-width: 28px;
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      margin: 0px 4px;
    }
    .el-pager li.active {
      color: #fff;
      background: #ff7300;
    }
    .el-pagination__jump {
      margin-left: 0px;
    }
    .el-pagination__sizes {
      margin: 0 10px 0 10px;
    }
    button {
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      min-width: 28px;
    }
    .btn-prev {
      padding-right: 6px;
      margin-right: 5px;
    }
    .btn-next {
      padding-left: 6px;
      margin-left: 5px;
    }
  }
}
.el-select-dropdown .el-select-dropdown__item,
.el-cascader-menu__item,
.el-cascader__label {
  font-size: 12px;
}
// el-message位置下移
.el-message {
  top: 120px !important;
}
</style>
