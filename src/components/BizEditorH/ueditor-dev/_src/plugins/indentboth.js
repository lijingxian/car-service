/**
 * 设置行内间距
 * @file
 * @since 1.2.6.1
 */
UE.plugins['indentboth'] = function(){
  var me = this;
  me.setOpt({'indentboth':['0', '8','16','32', '48']});

  me.commands['indentboth'] =  {
      execCommand : function( cmdName,value ) {
          this.execCommand('paragraph','p',{style:'margin-left:'+ value + ';' + 'margin-right:'+ value + ';' });
          return true;
      },
      queryCommandValue : function() {
          var pN = domUtils.filterNodeList(this.selection.getStartElementPath(),function(node){return domUtils.isBlockElm(node)});
          if(pN){
              var value = domUtils.getComputedStyle(pN,'margin-left');
              return value;
          }
      }
  };
};
