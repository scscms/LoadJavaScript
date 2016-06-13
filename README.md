# LoadJavaScript<sup>shine</sup>
### 前言
JavaScript文件在前端优化上来说，都是建议多个文件合并压缩加载。但当文件过于庞大时，而且有些文件本身就是次要，或者需要延时执行的我们还是建议分开加载与执行。

### 简单粗暴加载
```JavaScript
document.writeln('<script src="js.js"><\/script>');
document.write('<script src="js.js"><\/script>');
```
直接写入js标签，js挟持就常常使用这种简单粗暴方法。此方法还会造成文档阻塞。

### 优雅加载
```JavaScript
function insertJs(url){
    var _doc = document,
        script = _doc.createElement("script"),
        head = _doc.getElementsByTagName("head")[0],
        baseElement = head.getElementsByTagName("base");
    script.type = "text/javascript";
    script.src = url;
    //IE6下script必须插入到base前，以防引起bug
    baseElement ? head.insertBefore(script, baseElement[0]) : head.appendChild(script);
}
```
此方法是创建script标签再插入head标签里。它并不会阻塞文档渲染。所以适合加载次要js文件。
不过我们需要再改进一下函数，需要知道什么时候已经载完此js文件，好让我们调用回调函数。
而script标签在IE8及以下是不支持onload事件，我们只能使用readystatechange事件。
script元素有一个readyState属性，它的值随着下载外部文件的过程而改变：

* “uninitialized”默认状态
* “loading”下载开始
* “loaded”下载完成
* “interactive”下载完成但尚不可用
* “complete”所有数据已经准备好

而且这些值并不一定全部出现，特别是我们需要的“loaded”和“complete”说不准谁会出现。
```JavaScript
function loadScript(url, callback) {
    var script = document.createElement("script"),
        head = document.getElementsByTagName("head")[0],
        baseElement = document.getElementsByTagName("base");
    script.type = "text/javascript";
    callback = Object.prototype.toString.call(callback) == '[object Function]' ? callback : function(){};
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else { //Others
        script.onload = function () {
            callback();
        }
    }
    script.src = url;
    baseElement ? head.insertBefore(script, baseElement[0]) : head.appendChild(script);
}
```
而且我觉得这函数仍可精简下：
```JavaScript
function loadScript(url, callback) {
    var script = document.createElement("script"),
        head = document.getElementsByTagName("head")[0],
        baseElement = document.getElementsByTagName("base");
    script.type = "text/javascript";
    if(Object.prototype.toString.call(callback) == '[object Function]'){
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                this.onload = this.onreadystatechange = null;
                callback.call(this);
            }
        }
    }
    script.src = url;
    baseElement ? head.insertBefore(script, baseElement[0]) : head.appendChild(script);
}
```
此时应该没什么大问题了，突然一天想到假如要求几个js加载完才回调函数呢？这...
```JavaScript
function loadScripts(urls, callback) {
    urls.splice !== Array.prototype.splice && (urls = [urls]);//确保是数组
    (function(){
        if (0 == urls.length) {
            '[object Function]' == Object.prototype.toString.call(callback) && callback();
        } else {
            var callee = arguments.callee,//如果是严格模式就不要使用匿名函数模式
                script = document.createElement("script"),
                head = document.getElementsByTagName("head")[0],
                baseElement = document.getElementsByTagName("base");
            script.type = "text/javascript";
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    this.onload = this.onreadystatechange = null;
                    callee();
                }
            };
            script.src = urls.shift();
            baseElement ? head.insertBefore(script, baseElement[0]) : head.appendChild(script);
        }
    })();
}
```
此方法仍需要考虑两个问题：

* 1.是js超时加载，如果你项目有要求那么你需要添加超时机制。
* 2.是js失败捕捉，上面脚本一旦遇到某个js加载失败，后继的js将不再加载，也不会触发回调。

### JavaScript加载失败问题
在非IE下，我们是可以使用onerror捕捉js加载失败问题。IE8及以下是没法捕捉失败问题，就算404、500错误readyState值也是正常出现：
```JavaScript
var script = document.createElement("script");
script.type = "text/javascript";
script.onreadystatechange = function() {
    alert(this.readyState);
    //IE7\8正常弹出　loading loaded
};
script.src = "http://www.baidu.com/xxoo.js";
document.getElementsByTagName("head")[0].appendChild(script);
```
满脸的黑线呀！那么应该怎么样获取IE失败问题呢？
我的方法是替换判断，把js文件当vbscript来加载，因为vbscript文件载完会自动执行，如果能捕捉到window.onerror说明文件能正常加载成功。然后再以正常js来载入。
当然如果文档本身是vbscript文件或是一个空文档就会误判：
```JavaScript
function loadScript(jsUrl, callBack) {
        var _doc = document,
                script = _doc.createElement("script"),
                head = _doc.head || _doc.getElementsByTagName("head")[0] || _doc.documentElement;
        '[object Function]' != Object.prototype.toString.call(callBack) && (callBack = function(){});
        if ("onload" in script) {
            //非IE和IE9及以上支持onload、onerror事件
            script.type = "text/javascript";
            script.onload = function () {
                callBack.call(this,"ok");
            };
            script.onerror = function () {
                callBack.call(this,"no");
            };
        } else {
            var baseElement = head.getElementsByTagName("base")[0],_err = 0;
            script.language = "vbscript";
            //假如您的脚本也使用了window.onerror请使用监听方法替换以免冲突
            window.onerror = function(){
                _err = 1;
                return true;
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
                                callBack.call(script, "ok");
                            }
                        });
                        script.type = "text/javascript";
                        script.src = jsUrl;
                        baseElement ? head.insertBefore(script, baseElement) : head.appendChild(script);
                    }else{
                        callBack.call(script,"no");
                    }
                }
            });
        }
        script.src = jsUrl;//必须先赋值后生成，否则影响readyState值
        head.appendChild(script);
    }
    loadScript("http://www.baidu.com/xxoo.js?a=" + Math.random(),
        function (state) {
            alert("ok" == state ? "成功":"失败");
        }
    );
```
此方法唯一处理不够完美的是window.onerror事件，要留意事件冲突。
