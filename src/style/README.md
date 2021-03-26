# Style

这里存放着项目所需要的所有公共样式文件，以.scss文件为主。

## 结构说明

下方为Style文件夹的总体概览：

```console
style/
├── src/
│   ├── element-ui/
│   ├── mixins/
│   ├── utilities/
│   ├── _element-ui.scss
│   ├── _mixins.scss
│   ├── _style.scss
│   └── _utilities.scss
├── var/
│   └── _variables.scss
├── README.md
└── style.scss
```

说明：

* **src**: 具体的样式文件都在该文件夹下。原则上以控件或者功能进行模块划分，每一个模块为一个scss文件，以_开头
  * **element-ui**: Element UI的扩展样式文件都在该文件夹下
  * **mixins**: Sass的mixin方法都放在该文件夹下
  * **utilities**: 辅助工具类型的CSS class放在该文件夹下
  * **_element-ui.scss**: element-ui文件夹下的文件会先整合到该文件中
  * **_mixins.scss**: mixins文件夹下的文件会先整合到该文件中
  * **_style.scss**: src下的文件会整合到该文件夹中，包括src下各个文件夹的整合文件（详见下方）
  * **_utilities.scss**: utilities文件夹下的文件会先整合到该文件中
* **var**: 所有的变量信息都在该文件夹下。原则上以控件或者功能进行模块划分，每一个模块为一个scss文件，以_开头
  * **_variables.scss**: var文件夹下的所有变量信息都会整合到该文件中。

_style.scss文件示例:

```scss
// Core mixins
@import "mixins";

// Components
// ...

// Utility classes
@import "utilities";

// Extentions
@import "element-ui";
```

## 编码规则

### 文件命名

#### 文件以“_”（下划线）开头

除了入口文件style/style.scss以外，其他文件都需要以下划线开头。

#### 引用文件时，不需要写文件前面的下划线

如前面的_style.scss文件中代码中所示：

```scss
@import "mixins";
```

> Sass也是脚本语言，顺序执行，所以在使用变量或mixin的时候一定要注意文件的引用顺序。

### 变量命名

#### 基础变量

如颜色、边框宽度、边框圆角等比较通用的变量，直接以用途名字命名即可。

```scss
$gray-dark:                 #373a3c !default;
$gray:                      #55595c !default;
$gray-light:                #818a91 !default;
$gray-lighter:              #eceeef !default;
$gray-lightest:             #f7f7f9 !default;

$brand-primary:             #ff7300 !default;
$brand-success:             #5cb85c !default;
$brand-info:                #5bc0de !default;
$brand-warning:             #f0ad4e !default;
$brand-danger:              #d9534f !default;
$brand-inverse:             $gray-dark !default;
```

#### 控件变量

控件变量要以“控件名-变量-用途”的方式进行命名。

```scss
$table-border-width:  3px;
$btn-bg-hover:        3px;
$el-table__header-bg: #rgb(245, 245, 245);
```

### class命名

#### 控件中的子模块

控件中的各个子模块命名，要以双下划线“__”跟控件进行连接

```scss
.el-table {
  .el-table__header {
    // ...
  }

  .el-table__body {
    // ...
  }
}
```

#### 控件不同形态的命名

控件的不同形态(或扩展功能)的命名，要以双中划线“--”跟控件进行连接

```scss
.el-table {
  // ...
}

.el-table--striped {
  // ...
}
```
