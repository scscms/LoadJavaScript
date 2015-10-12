# perfect-load-javascript
## 完美加载javascript并做回调函数
script标签在IE8及以下没有onload、onerror事件，且onreadystatechange事件不区分是否加载成功仍会按序影响：
0 "uninitialized" 未初始化
1 "loading" 载入中
2 "loaded" 载入完成已经接收到全部响应内容
3 "interactive" 正在解析响应内容
4 "completed" 响应内容解析完成

###使用方法
```Html
<script type="text/javascript" scr="loadScript.js"></script>
```
```JavaScript
//加载单个script并回调函数
loadScript("http://www.scscms.com/1/test.js?a=" + Math.random(),
    function (state,node) {
        alert("ok" == state ? "成功":"失败");
    }
);
```

```Html
<script type="text/javascript" scr="loadScripts.js"></script>
```
```JavaScript
//加载多个script并回调函数
loadScripts(["http://www.scscms.com/1/test.js","http://www.scscms.com/1/jquery-easyui.js","http://www.scscms.com/1/jquerd.js"],
    function (state,node) {
        if("no" == state){
            alert(node.src+"文件加载失败！");
        }else{
            alert("成功！");
        }
    }
);
```
更详细介绍[点击这里](http://www.scscms.com/html/article/20150808-2177120.html)