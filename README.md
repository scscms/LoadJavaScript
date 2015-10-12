# perfect-load-javascript
## ��������javascript�����ص�����
script��ǩ��IE8������û��onload��onerror�¼�����onreadystatechange�¼��������Ƿ���سɹ��Իᰴ��Ӱ�죺
0 "uninitialized" δ��ʼ��
1 "loading" ������
2 "loaded" ��������Ѿ����յ�ȫ����Ӧ����
3 "interactive" ���ڽ�����Ӧ����
4 "completed" ��Ӧ���ݽ������

###ʹ�÷���
```Html
<script type="text/javascript" scr="loadScript.js"></script>
```
```JavaScript
//���ص���script���ص�����
loadScript("http://www.scscms.com/1/test.js?a=" + Math.random(),
    function (state,node) {
        alert("ok" == state ? "�ɹ�":"ʧ��");
    }
);
```

```Html
<script type="text/javascript" scr="loadScripts.js"></script>
```
```JavaScript
//���ض��script���ص�����
loadScripts(["http://www.scscms.com/1/test.js","http://www.scscms.com/1/jquery-easyui.js","http://www.scscms.com/1/jquerd.js"],
    function (state,node) {
        if("no" == state){
            alert(node.src+"�ļ�����ʧ�ܣ�");
        }else{
            alert("�ɹ���");
        }
    }
);
```
����ϸ����[�������](http://www.scscms.com/html/article/20150808-2177120.html)