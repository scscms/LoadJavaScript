function loadScripts(jsArray,callBack) {
    "use strict";
    /*
     * 按序加载多个script并回调函数
     * jsArray : 单个js地址字符串或者是js文件地址数组
     * callBack:function(state,node) 回调函数（可选）state = ok|no;node为script节点
     * 原创：348736477@qq.com
     * 作用：加载本地或者网络多个文本文件（除vbscript）大小不限并判断成功与否
     * 如有问题或者改进请通知，谢谢
     * */
    var _doc = document,
        script,
        head = _doc.head || _doc.getElementsByTagName("head")[0] || _doc.documentElement,
        baseElement = head.getElementsByTagName("base")[0];
    function loadJs() {
        if(0 == jsArray.length){
            callBack.call(null,"ok",script);
            return;
        }
        var jsUrl = jsArray.shift(),_err = 0;
        script = _doc.createElement("script");
        if ("onload" in script) {
            script.type = "text/javascript";
            script.onload = function () {
                loadJs();
            };
            script.onerror = function () {
                callBack.call(null,"no",this);
            };
        } else {
            script.language = "vbscript";
            //IE8及以下先把js当vbscript文件引入，如果触发window.onerror说明js有效
            //假如您的脚本也使用了window.onerror请使用监听方法替换以免冲突
            window.onerror = function(){
                _err = 1;
                return true;//忽略错误
            };
            script.attachEvent("onreadystatechange",function(){
                //vbscript成功载入将会先触发window.onerror
                if (/loaded|complete/i.test(script.readyState)) {
                    window.onerror = null;//清理监听事件
                    if(_err){
                        script.parentNode.removeChild(script);//移除vbscript节点
                        script = document.createElement("script");//再生成script节点并插入文档
                        script.attachEvent("onreadystatechange",function(){
                            if (/loaded|complete/i.test(script.readyState)) {
                                loadJs();
                            }
                        });
                        script.type = "text/javascript";
                        script.src = jsUrl;
                        //IE6下script必须插入到base前，以防引起bug
                        baseElement ? head.insertBefore(script, baseElement) : head.appendChild(script);
                    }else{
                        callBack.call(null,"no",script);
                    }
                }
            });
        }
        script.src = jsUrl;
        head.appendChild(script);
    }
    '[object Array]' != Object.prototype.toString.call(jsArray) && (jsArray = [jsArray]);//确保参数为数组
    'function' != typeof callBack && (callBack = function(){});//确保有回调函数
    loadJs();
}
//调用
loadScripts(["http://www.scscms.com/1/test.js","http://www.scscms.com/1/jquery-easyui.js","http://www.scscms.com/1/jquerd.js"],
    function (state,node) {
        if("no" == state){
            alert(node.src+"文件加载失败！");
        }else{
            alert("成功！");
        }
    }
);