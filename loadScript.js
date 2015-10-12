function loadScript(jsUrl, callBack) {
    "use strict";
    /*
     * ���ص���script���ص�����
     * jsUrl : js��ַ�ַ���
     * callBack:function(state,node) �ص���������ѡ��state = ok|no;nodeΪscript�ڵ�
     * ԭ����348736477@qq.com
     * ���ã����ر��ػ����������ı��ļ�����vbscript����С���޲��жϳɹ����
     * ����������߸Ľ���֪ͨ��лл
     * */
    var _doc = document,
        script = _doc.createElement("script"),
        head = _doc.head || _doc.getElementsByTagName("head")[0] || _doc.documentElement;
    'function' != typeof callBack && (callBack = function(){});//ȷ���лص�����
    if ("onload" in script) {
        //��IE��IE9������֧��onload��onerror�¼�
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
        //IE8�������Ȱ�js��vbscript�ļ����룬�������window.onerror˵��js��Ч���������Ľű�Ҳʹ����window.onerror��ʹ�ü��������滻�����ͻ
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
                            callBack.call(null, "ok", script);
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
    script.src = jsUrl;//�����ȸ�ֵ�����ɣ�����Ӱ��readyStateֵ
    head.appendChild(script);
}