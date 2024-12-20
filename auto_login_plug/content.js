chrome.storage.sync.get(['username', 'password'], function (data) {
    // 设置用户名和密码
    document.getElementById('svpn_name').value = data.username;
    document.getElementById('input_pwd').value = data.password;
    document.getElementById('checkbox').checked = true;

    // 查找 img 标签并获取其 base64 编码
    const imgElement = document.getElementById("randcodeImg");
    let base64 = "";
    if (imgElement.src) {
        const image = imgElement;

        // 获取 base64 编码
        image.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);

            // 获取 base64 编码
            base64 = canvas.toDataURL("image/png");
            base64 = base64.replace(/^data:image\/png;base64,/, "");

            // 拼接 URL，并发送 GET 请求
            const url = `https://$替换为你的域名$/verify/code?bs64=${encodeURIComponent(base64)}`;
            fetch(url)
                .then(response => response.text())
                .then(responseText => {

                    console.log("请求返回的字符串：", JSON.parse(responseText));
                    // 在这里处理获取到的字符串（如返回后续逻辑）
                    document.getElementById('randcode').value = JSON.parse(responseText)
                })
                .catch(error => {
                    console.error("请求失败：", error);
                });

            // 完成验证码后执行登录
            loginAndSubmit();
        };
    } else {
        // 如果没有找到图片，则直接执行登录
        loginAndSubmit();
    }

    // 等待1秒后点击登录按钮
    function loginAndSubmit() {
        const loginDom = document.getElementById('logButton');
        setTimeout(() => {
            if (loginDom) {
                console.log('loginDom', loginDom);
                loginDom.click();
            }
        }, 5000);
    }
});