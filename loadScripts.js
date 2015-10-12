function loadScripts(jsArray,callBack) {
    "use strict";
    /*
     * ������ض��script���ص�����
     * jsArray : ����js��ַ�ַ���������js�ļ���ַ����
     * callBack:function(state,node) �ص���������ѡ��state = ok|no;nodeΪscript�ڵ�
     * ԭ����348736477@qq.com
     * ���ã����ر��ػ����������ı��ļ�����vbscript����С���޲��жϳɹ����
     * ����������߸Ľ���֪ͨ��лл
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
            //IE8�������Ȱ�js��vbscript�ļ����룬�������window.onerror˵��js��Ч
            //�������Ľű�Ҳʹ����window.onerror��ʹ�ü��������滻�����ͻ
            window.onerror = function(){
                _err = 1;
                return true;//���Դ���
            };
            script.attachEvent("onreadystatechange",function(){
                //vbscript�ɹ����뽫���ȴ���window.onerror
                if (/loaded|complete/i.test(script.readyState)) {
                    window.onerror = null;//��������¼�
                    if(_err){
                        script.parentNode.removeChild(script);//�Ƴ�vbscript�ڵ�
                        script = document.createElement("script");//������script�ڵ㲢�����ĵ�
                        script.attachEvent("onreadystatechange",function(){
                            if (/loaded|complete/i.test(script.readyState)) {
                                loadJs();
                            }
                        });
                        script.type = "text/javascript";
                        script.src = jsUrl;
                        //IE6��script������뵽baseǰ���Է�����bug
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
    '[object Array]' != Object.prototype.toString.call(jsArray) && (jsArray = [jsArray]);//ȷ������Ϊ����
    'function' != typeof callBack && (callBack = function(){});//ȷ���лص�����
    loadJs();
}
//����
loadScripts(["http://www.scscms.com/1/test.js","http://www.scscms.com/1/jquery-easyui.js","http://www.scscms.com/1/jquerd.js"],
    function (state,node) {
        if("no" == state){
            alert(node.src+"�ļ�����ʧ�ܣ�");
        }else{
            alert("�ɹ���");
        }
    }
);