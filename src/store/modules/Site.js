import http from '@/common/http';
import urls from '@/common/urls';
import { BrickF } from '@/pages/sites/model';
import uuid from '@/utils/uuid';

// state
const state = {
  activityId: '',
  selectedBrickId: '',
  selectedComId: '',
  selectedType: '',
  comMenuId: '10',
  bricks: []
  // bricks: [
  //   {
  //     id: '6760572698889306126',
  //     name: 'XrMdl',
  //     parent: 'meta',
  //     children: [
  //       {
  //         type: 'simple-text',
  //         id: '87dcstexttel',
  //         parentId: '6760572698889306126',
  //         content: '我是文本内容Test123',
  //         color: '#333',
  //         link: { url: '', scheme: '' },
  //         fontFamily: '',
  //         fontSize: 22,
  //         fontStyle: [],
  //         letterSpacing: 0,
  //         lineHeight: 1.5,
  //         textAlign: 'left',
  //         x: 97.5,
  //         y: 100,
  //         width: 180,
  //         height: 33
  //       },
  //       {
  //         type: 'tel',
  //         id: 'vus2342sdfsd',
  //         parentId: '6760572698889306126',
  //         label: '拨打电话',
  //         content: '15512345678',
  //         color: '#ffffff',
  //         fontSize: 16,
  //         backgroundColor: 'rgba(39, 198, 147, 1)',
  //         borderRadius: 21,
  //         x: 78.5,
  //         y: 10,
  //         width: 184,
  //         height: 42,
  //         version: 1,
  //         bgType: 'color'
  //       }
  //     ],
  //     bgType: 'image',
  //     bgColor: 'rgba(39, 198, 147, 1)',
  //     bgImage: {
  //       src:
  //         'https://p9-tt.byteimg.com/img/ad-tetris-site/file/1577671496425/0de42913933fd4a58f8fb88714103648~noop.png',
  //       icId: '',
  //       width: 0,
  //       height: 0,
  //       size: 0,
  //       format: 'jpg'
  //     },
  //     bgMaskColor: { color: 'rgba(255, 255, 255, 0)' },
  //     x: 0,
  //     y: 0,
  //     width: 375,
  //     height: 575,
  //     float: 'none',
  //     version: 2,
  //     mdlTabIndex: ''
  //   },
  //   {
  //     id: '6760572698889289735',
  //     name: 'XrMdl',
  //     parent: 'meta',
  //     children: [
  //       {
  //         type: 'image',
  //         parentId: '6760572698889289735',
  //         id: 'ssdaasut7327676',
  //         src: {
  //           width: 430,
  //           height: 430,
  //           url:
  //             'https://p9-tt.byteimg.com/img/ad-tetris-site/file/1577671496425/0de42913933fd4a58f8fb88714103648~noop.png'
  //         },
  //         x: 0,
  //         y: 400,
  //         width: 375,
  //         height: 375
  //       },
  //       {
  //         type: 'form',
  //         parentId: '6760572698889289735',
  //         id: 'sdamhbjy576mn',
  //         formData: {
  //           submitText: '立即提交',
  //           elements: [
  //             { required: true, type: 'text', label: '姓名', keyType: '姓名', value: '', key: 'name' },
  //             { required: true, type: 'number', label: '电话', keyType: '电话', value: '', key: 'mobile' },
  //             { required: true, type: 'text', label: '意向车型', keyType: '意向车型', value: '', key: 'productName' }
  //           ]
  //         },
  //         backgroundType: 'color',
  //         backgroundColor: 'rgba(255, 255, 255, 1)',
  //         successTip: '提交成功',
  //         buttonBackColor: 'rgba(237, 163, 18, 1)',
  //         buttonForeColor: 'rgba(247, 247, 247, 1)',
  //         buttonBorderRadius: 1,
  //         x: 0,
  //         y: 20,
  //         width: 375,
  //         height: 325,
  //         version: 1
  //       }
  //     ],
  //     bgType: 'color',
  //     bgColor: 'rgba(134, 231, 200, 1)',
  //     bgImage: {
  //       src:
  //         'https://p9-tt.byteimg.com/img/ad-tetris-site/file/1577671496425/0de42913933fd4a58f8fb88714103648~noop.png',
  //       icId: '',
  //       width: 0,
  //       height: 0,
  //       size: 0,
  //       format: 'jpg'
  //     },
  //     bgMaskColor: { color: 'rgba(255, 255, 255, 0)' },
  //     x: 0,
  //     y: 0,
  //     width: 375,
  //     height: 865,
  //     float: 'none',
  //     version: 1,
  //     mdlTabIndex: ''
  //   }
  // ]
};

// getters
const getters = {
  activityId(state) {
    return state.activityId;
  },
  activityModelId(state) {
    return state.activityModelId;
  },
  selectedType(state) {
    return state.selectedType;
  },
  selectedBrickId(state) {
    return state.selectedBrickId;
  },
  selectedComId(state) {
    return state.selectedComId;
  },
  bricks(state) {
    return state.bricks;
  },
  templateData(state) {
    return state.templateData;
  },
  selectedBrick(state) {
    return state.bricks.find(item => item.id === state.selectedBrickId);
  },
  selectedBrickIsFirst(state) {
    return state.bricks.findIndex(item => item.id === state.selectedBrickId) === 0;
  },
  selectedBrickIsLast(state) {
    return state.bricks.findIndex(item => item.id === state.selectedBrickId) === state.bricks.length - 1;
  },
  selectedCom(state) {
    return state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId);
  },
  comMenuId() {
    return state.comMenuId;
  }
};

// mutations
const mutations = {
  updateActivityId(state, activityId) {
    state.activityId = activityId;
  },
  updateActivityModelId(state, activityModelId) {
    state.activityModelId = activityModelId;
  },
  updateBricks(state, bricks) {
    state.bricks = bricks;
  },
  updateTemplateData(state, templateData) {
    state.templateData = templateData;
  },
  updateselectedBrickId(state, id) {
    state.selectedBrickId = id;
  },
  updateselectedComId(state, { brickId, comId }) {
    state.selectedBrickId = brickId;
    state.selectedComId = comId;
  },
  updateSelectedType(state, type) {
    state.selectedType = type;
  },
  updateBrickBgType(state, bgType) {
    state.bricks.find(item => item.id === state.selectedBrickId).bgType = bgType;
  },
  updateBrickBgColor(state, bgColor) {
    state.bricks.find(item => item.id === state.selectedBrickId).bgColor = bgColor;
  },
  updateBrickBgImage(state, bgImage) {
    state.bricks.find(item => item.id === state.selectedBrickId).bgImage = bgImage;
  },
  updateBrickHight(state, height) {
    state.bricks.find(item => item.id === state.selectedBrickId).height = height;
  },
  addBrickChild(state, child) {
    if (state.selectedBrickId) {
      state.bricks.find(item => item.id === state.selectedBrickId).children.push(child);
    }
  },
  updateSimpleTextContent(state, content) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).content = content;
  },
  updateComLabel(state, label) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).label = label;
  },
  updateSimpleTextHeight(state, height) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).height = height;
  },
  updateSimpleTextColor(state, color) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).color = color;
  },
  updateSimpleTextFontSize(state, fontSize) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).fontSize = fontSize;
  },
  updateSimpleTextFontStyle(state, fontStyle) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).fontStyle = fontStyle;
  },
  updateSimpleTextLetterSpacing(state, letterSpacing) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).letterSpacing = letterSpacing;
  },
  updateSimpleTextLineHeight(state, lineHeight) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).lineHeight = lineHeight;
  },
  updateComWidth(state, { width, direction = 'right' }) {
    let com = state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId);
    if (direction === 'left') {
      com.x = com.x - (width - com.width);
    }
    com.width = width;
  },
  updateComHeight(state, { height }) {
    let com = state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId);
    com.height = height;
  },
  updateComImageSrc(state, { url, width, height }) {
    let com = state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId);
    com.src.height = height;
    com.src.width = width;
    com.src.url = url;
    com.width = 375;
    com.height = Math.round((375 * height) / width);
  },
  updateComX(state, x) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).x = x;
  },
  updateComBackgroundColor(state, backgroundColor) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).backgroundColor = backgroundColor;
  },
  updateComBorderRadius(state, borderRadius) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).borderRadius = borderRadius;
  },
  updateComY(state, y) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).y = y;
  },
  updateComFormLabel(state, { index, label }) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).formData.elements[index].label = label;
  },
  updateComFormValue(state, { index, value }) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).formData.elements[index].value = value;
  },
  updateComFormSubmitText(state, submitText) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).formData.submitText = submitText;
  },
  updateComFormSuccessTip(state, successTip) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).successTip = successTip;
  },
  updateComFormButtonForceColor(state, color) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).buttonForeColor = color;
  },
  updateComFormButtonBackColor(state, color) {
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.find(item => item.id === state.selectedComId).buttonBackColor = color;
  },
  addBrick(state, { isFront, brick }) {
    let index = state.bricks.findIndex(item => item.id === state.selectedBrickId);
    index = isFront ? index : index + 1;
    state.bricks.splice(index, 0, brick);
  },
  moveBrick(state, isUp) {
    let index = state.bricks.findIndex(item => item.id === state.selectedBrickId);
    index = isUp ? index : index + 1;
    state.bricks[index - 1] = state.bricks.splice(index, 1, state.bricks[index - 1])[0];
  },
  updateComMenuId(state, comMenuId) {
    state.comMenuId = comMenuId;
  },
  deleteCom(state) {
    state.selectedType = '';
    let selectedComId = state.selectedComId;
    state.selectedComId = '';
    state.bricks
      .find(item => item.id === state.selectedBrickId)
      .children.splice(
        state.bricks
          .find(item => item.id === state.selectedBrickId)
          .children.findIndex(item => item.id === selectedComId),
        1
      );
    state.selectedBrickId = '';
  },
  deleteBrick(state) {
    state.selectedType = '';
    state.selectedComId = '';
    let selectedBrickId = state.selectedBrickId;
    state.selectedBrickId = '';
    state.bricks.splice(
      state.bricks.findIndex(item => item.id === selectedBrickId),
      1
    );
  }
};

// actions
const actions = {
  getActivityContent({ commit, state }) {
    let params = {
      id: state.activityId.indexOf('_') > 0 ? state.activityId.split('_')[0] : state.activityId
    };
    http
      .get(state.activityId.indexOf('_') > 0 ? (state.activityId.split('_')[1] === 'template' ? urls.activityMgmt.getActivityModel : (state.activityId.split('_')[1] === 'memberCareTemplate' ? '/admin/memberCareTemplate/template.jhtml' : '/admin/memberCare/manage/memberCare.jhtml')) : urls.activityMgmt.ActivityContent, params)
      .then(data => {
        // console.log(data);
        let brick = BrickF();
        brick.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        let content = '{}';
        if (state.activityId.indexOf('_') > 0) {
          content = JSON.parse(data.data.content || '{}');
          commit('updateTemplateData', data.data);
        } else {
          content = JSON.parse(data.activity.content || '{}');
        }
        // let content = JSON.parse(
        //   '{"bricks":[{"type":"brick","children":[{"type":"simple-text","content":"请添加文本内容aaa啊啊啊","color":"rgba(51, 51, 51, 1)","fontFamily":"","fontSize":22,"fontStyle":[],"letterSpacing":0,"lineHeight":1.5,"textAlign":"left","x":97.5,"y":15,"width":180,"height":33,"id":"a077ee0ca6bf311e","parentId":"aad2d722a908a5c8"}],"bgType":"color","bgColor":"rgba(255, 255, 255, 1)","bgImage":{"src":""},"bgMaskColor":{"color":"rgba(255, 255, 255, 0)"},"width":375,"height":375,"id":"aad2d722a908a5c8"}]}'
        // );
        // console.log(content);
        if (!content.bricks) {
          content.bricks = [brick];
        }
        commit('updateBricks', content.bricks);
      })
      .catch(error => {
        console.error(error);
      });
  },
  getSiteContent({ commit, state }) {
    let params = {
      id: state.activityId.indexOf('_') > 0 ? state.activityId.split('_')[0] : state.activityId
    };
    http
      .get(state.activityId.indexOf('_') > 0 ? (state.activityId.split('_')[1] === 'memberCare' ? '/admin/memberCare/manage/memberCare.jhtml' : '/admin/memberCareTemplate/template.jhtml') : urls.activityMgmt.SiteContent, params)
      .then(data => {
        let brick = BrickF();
        brick.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        let content = JSON.parse(data.data.content || '{}');
        if (!content.bricks) {
          content.bricks = [brick];
        }
        commit('updateBricks', content.bricks);
      })
      .catch(error => {
        console.error(error);
      });
  },
  saveActivityContent({ state }, cb) {
    let params = {
      id: state.activityId.indexOf('_') > 0 ? state.activityId.split('_')[0] : state.activityId,
      marketingType: state.templateData ? state.templateData.marketingType : '',
      name: state.templateData ? state.templateData.name : '',
      shape: state.templateData ? state.templateData.shape : '',
      templateType: state.templateData ? state.templateData.templateType : '',
      uuid: state.templateData ? state.templateData.uuid : '',
      content: JSON.stringify({
        bricks: state.bricks
      })
    };
    http
      .put(state.activityId.indexOf('_') > 0 ? (state.activityId.split('_')[1] === 'template' ? urls.activityMgmt.updateActivityModel : ((state.activityId.split('_')[1] === 'memberCareTemplate' ? '/admin/memberCareTemplate/template.jhtml' : '/admin/memberCare/manage/memberCare.jhtml'))) : urls.activityMgmt.ActivityContent, params)
      .then(data => {
        console.log(data);
        cb();
        // commit('updateBricks', data.activity.content.bricks || []);
      })
      .catch(error => {
        console.error(error);
      });
  },
  // 设置平台模版为活动内容模版
  setTemplateToContent({ commit, state }, cb) {
    let params = {
      id: state.activityModelId
    };
    http
      .get(urls.activityMgmt.getActivityModel, params)
      .then(data => {
        // console.log(data);
        let brick = BrickF();
        brick.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        let content = JSON.parse(data.data.content || '{}');
        if (!content.bricks) {
          content.bricks = [brick];
        }
        commit('updateBricks', content.bricks);
        let params = {
          id: state.activityId,
          content: JSON.stringify({
            bricks: state.bricks
          })
        };
        http
          .put(urls.activityMgmt.ActivityContent, params)
          .then(data => {
            console.log(data);
            cb();
            // commit('updateBricks', data.activity.content.bricks || []);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
