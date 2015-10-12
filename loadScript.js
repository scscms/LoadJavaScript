function loadScript(jsUrl, callBack) {
    "use strict";
    /*
     * 加载单个script并回调函数
     * jsUrl : js地址字符串
     * callBack:function(state,node) 回调函数（可选）state = ok|no;node为script节点
     * 原创：348736477@qq.com
     * 作用：加载本地或者网络多个文本文件（除vbscript）大小不限并判断成功与否
     * 如有问题或者改进请通知，谢谢
     * */
    var _doc = document,
        script = _doc.createElement("script"),
        head = _doc.head || _doc.getElementsByTagName("head")[0] || _doc.documentElement;
    'function' != typeof callBack && (callBack = function(){});//确保有回调函数
    if ("onload" in script) {
        //非IE和IE9及以上支持onload、onerror事件
        script.type = "text/javascript";
        script.onload = function () {
            callBack.call(null,"ok",this);
        };
        script.onerror = function () {
            callBack.call(null,"no",this);
        };
    } else {
        var baseElement = head.getElementsByTagName("base")[0],_err = 0;
        script.language = "vbscript";
        //IE8及以下先把js当vbscript文件引入，如果触发window.onerror说明js有效。假如您的脚本也使用了window.onerror请使用监听方法替换以免冲突
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
                            callBack.call(null, "ok", script);
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
    script.src = jsUrl;//必须先赋值后生成，否则影响readyState值
    head.appendChild(script);
}