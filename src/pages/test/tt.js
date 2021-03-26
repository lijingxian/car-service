class Tree {
  constructor(tree, childKey = 'subAuthority') {
    this.tree = tree.concat();
    this.childKey = childKey;
    this.fontSize = 14;
    this.width = 1200;
    this.height = 500;
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.lineWidth = 2;
    this.ctx.font = `${this.fontSize}px 微软雅黑`;
    this.depth = this.getDepth();
    this.leftNameList = ['运营', '店铺', '客服', '个人', '系统'];
    this.rightNameList = ['营销', '会员', '消息', '销售', '售后', '订单'];
    // 这里创建的数组中每一项都是指向同一地址的空数组, 会同时变化
    this.leftTree = new Array(this.depth + 1).fill([]);
    this.rightTree = new Array(this.depth + 1).fill([]);
    this.columnPositionArr = [];
    this.expandTree();
    this.createSideTree();
    this.formatNodes();
  }

  // 设置canvas样式
  setCanvas(style = {}) {
    // 设置canvas宽高后样式会重置
    const { canvas, ctx, width, height, fontSize } = this;
    canvas.width = style.width || width;
    canvas.height = style.height || height;
    ctx.lineWidth = style.lineWidth || 2;
    ctx.font = style.font || `${fontSize}px 微软雅黑`;
  }

  // 首字母大写
  toCapitalize(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
  }

  // 从root开始遍历
  mapTree(fun) {
    const { childKey } = this;
    const map = tree => {
      tree.forEach(child => {
        fun(child, tree);
        if (child[childKey]) {
          map(child[childKey]);
        }
      });
    };
    map(this.tree);
  }

  // 获取树的深度
  getDepth() {
    const { childKey } = this;
    let depthArr = [];
    const getDepth = (target, currentDepth) => {
      target.forEach(item => {
        if (item[childKey] && item[childKey].length) {
          getDepth(item[childKey], currentDepth + 1);
        }
        item.layer = currentDepth;
        depthArr.push(currentDepth);
      });
    };
    getDepth(this.tree, 0);
    console.log('depth: ', Math.max(...depthArr));
    return Math.max(...depthArr);
  }

  // 扩展树
  expandTree() {
    const { childKey } = this;
    // 把tree所有叶子扩展到depth层
    // 分割左右
    const { leftNameList, rightNameList } = this;
    this.tree.forEach(item => {
      if (leftNameList.includes(item.name)) {
        // 属于左侧树
        item.partOf = 'left';
      } else if (rightNameList.includes(item.name)) {
        // 属于右侧
        item.partOf = 'right';
      } else {
        console.error('ERR_UNSORTED: ', item);
      }
    });
    // 扩展层数
    const expand = (children, parent) => {
      children.forEach(item => {
        if (!item.partOf) {
          item.partOf = parent.partOf || '';
        }
        if (item.layer < this.depth) {
          if (!item[childKey] || !item[childKey].length) {
            item[childKey] = [{ name: '', layer: item.layer + 1, partOf: item.partOf }];
          }
          expand(item[childKey], item);
        }
      });
    };
    expand(this.tree);
    console.log('expanded: ', this.tree);
  }

  // 创建左侧 / 右侧树
  createSideTree() {
    const { fontSize, height, depth } = this;
    const makeTree = tree => {
      if (tree.partOf === 'left') {
        this.leftTree[tree.layer] = this.leftTree[tree.layer].concat(tree);
      } else if (tree.partOf === 'right') {
        this.rightTree[tree.layer] = this.rightTree[tree.layer].concat(tree);
      }
    };
    this.mapTree(makeTree);
    this.leftTree[depth].forEach((item, index) => {
      item.total = this.leftTree[depth].length;
      item.index = index;
    });
    this.rightTree[depth].forEach((item, index) => {
      item.total = this.rightTree[depth].length;
      item.index = index;
    });
    const minHeight = Math.max(...[this.leftTree[depth].length, this.rightTree[depth].length]) * (fontSize + 4);
    console.log('canvasHeight: ', minHeight);
    if (height < minHeight) {
      this.setCanvas({ height: minHeight });
      this.height = minHeight;
    }
    console.log('leftArr: ', this.leftTree);
    console.log('rightArr: ', this.rightTree);
  }

  // 格式化节点
  formatNodes() {
    // 格式化各节点数据
    const { ctx, depth, height, childKey } = this;
    const format = node => {
      let textBlockWidth = Math.ceil(ctx.measureText(node.name).width + 6);
      if (node.layer === 0) {
        node.width = textBlockWidth + 10;
      } else {
        node.width = textBlockWidth;
      }
    };
    // 设置节点位置, 在确定列位置之后执行
    const setPosition = (node, index) => {
      // (总显示区域 - 边框) / ((深度 + 1 ) * 2 + 中间列 + 1)
      let positionX = this.columnPositionArr[index];
      let positionY = 0;
      if (node.layer === depth) {
        // 是最后一级
        positionY = (height / (node.total + 1)) * (node.index + 1);
      } else {
        const sub = node[childKey];
        // 第一个子节点的y + 最后一个子节点的y / 2
        positionY = (sub[sub.length - 1].position.y + sub[0].position.y) / 2;
      }
      let position = {};
      position.x = positionX;
      position.y = positionY;
      node.position = position;
    };
    // 从叶节点开始遍历树
    for (let i = this.depth; i > -1; i--) {
      this.leftTree[i].forEach(item => {
        format(item);
      });
      this.rightTree[i].forEach(item => {
        format(item);
      });
    }
    // 设置每一列的位置
    const leftWidthArr = this.leftTree.map(tree => {
      // 每列两边留出20px的空白
      return Math.max(...tree.map(node => node.width)) + 40;
    });
    const rightWidthArr = this.rightTree.map(tree => {
      return Math.max(...tree.map(node => node.width)) + 40;
    });
    const centerWidth = Math.ceil(ctx.measureText('V服').width + 6 + 20) + 40;
    // 每一项是每一列的宽度
    // 每边的tree数组是从0-depth层
    const widthArr = [...leftWidthArr.reverse(), centerWidth, ...rightWidthArr];
    let totalWidth = 0;
    widthArr.forEach(width => {
      totalWidth += width;
    });
    this.setCanvas({ width: totalWidth });
    console.log('canvasWidth: ', totalWidth);
    // 每一项是每一列的中线位置
    this.columnPositionArr = widthArr.map((wid, index) => {
      let offsetLeft = 0;
      for (let i = 0; i < index; i++) {
        offsetLeft += widthArr[i];
      }
      offsetLeft = offsetLeft + wid / 2;
      return offsetLeft;
    });
    console.log('widthArr: ', widthArr);
    console.log('columnPositionArr: ', this.columnPositionArr);
    for (let i = this.depth; i > -1; i--) {
      this.leftTree[i].forEach(item => {
        setPosition(item, depth - item.layer);
      });
      this.rightTree[i].forEach(item => {
        setPosition(item, item.layer + this.leftTree.length + 1);
      });
    }
  }

  // 画线
  // 起点, 终点, 拐点x坐标
  drawLine(from, to, inflectionX) {
    const { ctx } = this;
    if (!to.name) return;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(Math.floor(from.x), Math.floor(from.y));
    ctx.lineTo(Math.floor(inflectionX) || Math.floor((to.x + from.x) / 2), Math.floor(from.y));
    ctx.lineTo(Math.floor(inflectionX) || Math.floor((to.x + from.x) / 2), Math.floor(to.y));
    ctx.lineTo(Math.floor(to.x), Math.floor(to.y));
    ctx.stroke();
  }

  // 渲染
  // role角色:  platform, operator, shop
  render(role = '') {
    const { fontSize, ctx, depth, childKey, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    const renderNode = node => {
      if (node.layer === 0) {
        ctx.strokeStyle = '#000000';
        // ctx.strokeRect(起点x, 起点y, 宽度, 高度)
        ctx.strokeRect(node.position.x - node.width / 2, node.position.y - fontSize / 2 - 3 - 1, node.width, fontSize + 3 + 3);
      }
      if (node[`is${this.toCapitalize(role)}`] === 1) {
        ctx.fillStyle = '#ff7300';
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.fillText(node.name || '--', node.position.x, node.position.y);
    };
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 从叶节点开始遍历树
    for (let i = depth; i > -1; i--) {
      this.leftTree[i].forEach(node => {
        renderNode(node);
        node[childKey] &&
          node[childKey].forEach(sub => {
            const subWidthArr = node[childKey].map(sub => {
              return sub.width;
            });
            // 子节点最大宽度
            const maxSubWidth = Math.max(...subWidthArr);
            this.drawLine(
              { name: node.name, x: node.position.x - node.width / 2, y: node.position.y },
              { name: sub.name, x: sub.position.x + sub.width / 2, y: sub.position.y },
              (sub.position.x + maxSubWidth / 2 + node.position.x - node.width / 2) / 2
            );
          });
      });
      this.rightTree[i].forEach(node => {
        renderNode(node);
        node[childKey] &&
          node[childKey].forEach(sub => {
            const subWidthArr = node[childKey].map(sub => {
              return sub.width;
            });
            const maxSubWidth = Math.max(...subWidthArr);
            this.drawLine(
              { name: node.name, x: node.position.x + node.width / 2, y: node.position.y },
              { name: sub.name, x: sub.position.x - sub.width / 2, y: sub.position.y },
              (sub.position.x - maxSubWidth / 2 + node.position.x + node.width / 2) / 2
            );
          });
      });
    }
    // 画最中间的节点
    const centerNode = {
      name: 'V服',
      position: { x: this.columnPositionArr[Math.floor(this.columnPositionArr.length / 2)], y: this.height / 2 },
      layer: 0,
      width: Math.ceil(ctx.measureText('V服').width + 6 + 20),
      subAuthority: [...this.leftTree[0], ...this.rightTree[0]]
    };
    const renderCenterNode = node => {
      renderNode(node);
      const leftMaxSubWidth = Math.max(...node[childKey].filter(sub => sub.partOf === 'left').map(sub => sub.width));
      const rightMaxSubWidth = Math.max(...node[childKey].filter(sub => sub.partOf === 'right').map(sub => sub.width));
      node[childKey].forEach(sub => {
        if (sub.partOf === 'left') {
          this.drawLine(
            { name: node.name, x: node.position.x - node.width / 2, y: node.position.y },
            { name: sub.name, x: sub.position.x + sub.width / 2, y: sub.position.y },
            (sub.position.x + leftMaxSubWidth / 2 + node.position.x - node.width / 2) / 2
          );
        } else {
          this.drawLine(
            { name: node.name, x: node.position.x + node.width / 2, y: node.position.y },
            { name: sub.name, x: sub.position.x - sub.width / 2, y: sub.position.y },
            (sub.position.x - rightMaxSubWidth / 2 + node.position.x + node.width / 2) / 2
          );
        }
      });
    };
    renderCenterNode(centerNode);
  }
}

export default Tree;
