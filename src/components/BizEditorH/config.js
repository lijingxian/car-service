export const ueConfig = {
  toolbars: [[]],
  initialFrameWidth: null,
  initialFrameHeight: 400,
  scaleEnabled: true
};

export const toolbar = [
  [
    {
      name: 'bold',
      title: '加粗',
      type: 'toolbtn',
      status: 'checked'
    },
    {
      name: 'italic',
      title: '斜体',
      type: 'toolbtn',
      status: 'checked'
    },
    {
      name: 'underline',
      title: '下划线',
      type: 'toolbtn',
      status: ''
    },
    {
      name: 'simpleupload',
      title: '图片上传',
      type: 'toolbtn',
      status: ''
    }
  ]
];

export const selectOptions = {
  // 段前后距
  rowspacing: [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '20', value: '20' },
    { label: '25', value: '25' }
  ],
  // 行间距
  lineheight: [
    { label: '1', value: '1' },
    { label: '1.5', value: '1.5' },
    { label: '1.75', value: '1.75' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
  ],
  orderedlist: [
    { label: '1,2,3...', value: 'decimal' },
    { label: 'a,b,c...', value: 'lower-alpha' },
    { label: 'i,ii,iii...', value: 'lower-roman' },
    { label: 'A,B,C...', value: 'upper-alpha' },
    { label: 'Ⅰ,Ⅱ,Ⅲ...', value: 'upper-roman' }
  ],
  unorderedlist: [
    { label: '○ 大圆圈', value: 'circle' },
    { label: '● 小圆点', value: 'disc' },
    { label: '■ 小方块', value: 'square' }
  ],
  fontsize: [
    { label: '10px', value: 10 },
    { label: '11px', value: 11 },
    { label: '12px', value: 12 },
    { label: '14px', value: 14 },
    { label: '16px', value: 16 },
    { label: '18px', value: 18 },
    { label: '20px', value: 20 },
    { label: '24px', value: 24 },
    { label: '36px', value: 36 }
  ]
};

export const getToolBar = function(type) {
  let defaultToolbar = [
    [
      {
        name: 'fontsize',
        title: '字号',
        type: 'toolinput',
        value: '16px'
      },
      {
        name: 'bold',
        title: '加粗',
        type: 'toolbtn',
        status: 0
      },
      {
        name: 'italic',
        title: '斜体',
        type: 'toolbtn',
        status: 0
      },
      {
        name: 'underline',
        title: '下划线',
        type: 'toolbtn',
        status: 0
      },
      {
        name: 'forecolor',
        title: '字体颜色',
        type: 'toolcolorpicker',
        value: '#000000'
      },
      {
        name: 'backcolor',
        title: '背景色',
        type: 'toolcolorpicker',
        value: ''
      },
      {
        name: 'simpleupload',
        title: '图片上传',
        type: 'toolbtn',
        status: ''
      },
      {
        name: 'insertvideo',
        title: '视频',
        type: 'toolbtn',
        status: ''
      }
    ],
    [
      {
        name: 'indent',
        title: '首行缩进',
        type: 'toolbtn',
        status: 'checked',
        value: ''
      },
      {
        type: 'separator'
      },
      {
        name: 'justify',
        title: '居左对齐',
        type: 'toolbtn',
        value: 'left',
        status: 'checked'
      },
      {
        name: 'justify',
        title: '居中对齐',
        type: 'toolbtn',
        value: 'center',
        status: 'checked'
      },
      {
        name: 'justify',
        title: '居右对齐',
        type: 'toolbtn',
        value: 'right',
        status: 'checked'
      },
      {
        name: 'justify',
        title: '两端对齐',
        type: 'toolbtn',
        value: 'justify',
        status: 'checked'
      },
      {
        name: 'lineheight',
        title: '行间距',
        type: 'toolselect',
        value: ''
      }
    ]
  ];
  switch (type) {
    case 'default':
      return defaultToolbar;

    default:
      break;
  }

  return [];
};
