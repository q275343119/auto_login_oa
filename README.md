# 背景
本人做为人力外包在甲方场地工作，需要遵守甲方工作纪律，集中有一下就是下班必须关闭电脑。

这就导致了一个问题，每天早上开机都需要登录OA系统，登录后会自动启动云桌面，这样才能开始第一天的工作。

然后OA系统没有记住账号和密码的功能，同时登录后还需要输入手机验证码。就很烦，想解放双手。

## 解决思路

1. 通过chrome插件的方式可以解决自动填写账号密码并登录的步骤
2. 验证码通过IPhone的快捷指令将短信解析并发送到服务器
3. 再通过插件从服务器取出验证码填入并登录

## 工具和技能要求

### 工具
1. 接受验证码的手机必须为iPhone，安卓应该也可以解析，但手边没有机体无法实现
2. 有一个域名，并且有SSL证书（如果OA系统不是Https 则不需要）
3. 有一台服务器，用于启动验证码接收服务

### 技能
1. 能够使用linux服务器
2. 能够使用Nginx（主要是反向代理和跨域问题解决）
3. 能够使用docker
4. 可以在js中选中界面元素
5. 稍微了解一些正则表达式
6. 以上都不太了解的话，善用百度和google也可以

## 项目目录
```lua

├─auto_login_plug   # chrome 插件
├─pic   # README.md 中的图片
├─quick_instructions    # 快捷指令
└─verification_code_store   # 后端服务

```

## 运行
1. 服务器部署服务
2. Nginx反向代理
3. 手机中创建快捷指令
4. chrome中安装插件

### 服务器部署服务
可以现将`verification_code_store`整个拷贝到服务器上面

然后构建docker
```bash
docker build -t verification_code_store .
```
构建后后去image_id
```bash
docker images # 找到名为verification_code_store的镜像，记下他的 imageid
```

运行image
```bash
docker run --name verification_code_store -p <选个你喜欢的端口>:8000 -d <上一步的image_id>
```

当然也可以通过别的方式运行，这里就不赘述了。


### Nginx反向代理
我是用宝塔面板同的图形化界面操作的，如果没有面板的话，得手动部署Nginx并且配置，这块可以百度

此处有一个坑，Nginx也要解决跨域问题,将下面这段加载默认的location / 中去：
```ini
location / { 
    ...
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }
} 
```

### 手机中创建快捷指令
目前不知道如何导出手机中的指令，暂时通过截图的方式展现（我的系统语言为繁体，将就的看一下)：
![step1.jpg](quick_instructions%2Fstep1.jpg)

假设收到的验证码如下：

`【公司】【云桌面】验证码为：123456，xxxxxxxxxxxxxxx`

那么我们在`何时`这里的出发条件为：当我们收到包含`【公司】【云桌面】验证码为：`的讯息时,并选择立即执行
![step2.jpg](quick_instructions%2Fstep2.jpg)
接下来就是解析短信中的验证码：`\d{6}`这是一个正则表达式，意思是找到6位数字，不同的验证码短信解析方式可能不同，这块需要对正则有些了解

之后再获取本机的名称，其实是想获取手机号的，但是没找到方法

有了本机名称和验证码就可以想后端发送消息了

这里采用的方式是拼接一个url：https://xxx.domain/set/code?phone=手机名称&project_name=项目名称(写死的)&code=验证码

然后登录服务器调通过 curl的方式调用api（如果没有服务器，可以通过浏览器打开）

![step3.jpg](quick_instructions%2Fstep3.jpg)

![step4.jpg](quick_instructions%2Fstep4.jpg)

这样指令就配置完成了

### chrome中安装插件
首先修改`auto_login_plug`中每个文件需要修改替换的地方，有些地方需要根据实际情况做适当的调整

之后在chrome地址栏中输入`chrome://extensions/`,然后选择`加载已解压的拓展程序`:
![img.png](pic%2Fimg.png)

选中项目中的`auto_login_plug`即可