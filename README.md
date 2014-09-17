
======

# Data.js 



Data.js 是一个以数据为中心的mvvm库。


它用起来非常简单

``` html
<div id="demo">
    {{message}}
    <input d-value="message">
</div>
```

``` js
var demo = D.dataBind({message: 'Hello Data.js!'}, '#demo')
```



## Browser Support
