
======

# Data.js 



Data.js 是一个以数据为中心的mvvm库。


它用起来非常简单

``` html
<div id="demo">
    <span d-text="message"></span>
    <input d-value="message">
</div>
```

``` js
var demo = D.dataBind({message: 'Hello Data.js!'}, '#demo')
```



## 更多demo 请访问<a href="http://sdemos.duapp.com/">SDemo</a>(<a href="http://sdemos.duapp.com/">www.sdemo.cn</a>)
