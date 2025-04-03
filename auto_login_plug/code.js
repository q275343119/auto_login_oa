async function getCode() {
    let code = null;
    const timeout = 60000; // 设置超时时间为60秒
    const startTime = Date.now(); // 获取开始时间

    // 轮询获取验证码，直到验证码不为空或超时
    while (!code) {
        // 判断是否超过了超时时间
        if (Date.now() - startTime > timeout) {
            console.log("超时未获取到验证码，退出轮询");
            return null; // 超时返回 null
        }

        // 请求验证码
        await fetch('https://$替换为你的域名$/get/code?phone=YiPhone&project_name=cms', {
            method: 'GET',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                code = data.toString();
                console.log("当前验证码：", code);
            })
            .catch(function (error) {
                console.error("获取验证码失败", error);
            });

        // 如果没有得到验证码，等待一段时间后继续轮询
        if (!code) {
            console.log("验证码为空，继续轮询...");
            await new Promise(resolve => setTimeout(resolve, 2000)); // 每2秒重新尝试一次
        }
    }

    return code;
}

chrome.storage.sync.get([], function () {
    console.log("脚本启动");
    setTimeout(async () => {
        // 获取验证码
        const code = await getCode();

        // 如果未获取到验证码（超时或其他原因）
        if (code === null) {
            console.log("未能获取到验证码，脚本终止");
            return; // 退出脚本
        }

        // 输出验证码
        console.log("获取的验证码：", code);

        // 填入输入框
        document.getElementById("svpn_inputsms").value = code;

        // 找到提交按钮并点击
        const loginDom = document.getElementsByName("Submit");
        if (loginDom.length > 0) {
            console.log('点击登录按钮');
            loginDom[0].click();
        }
    }, 5000); // 等待5秒后执行（可以根据需要调整时间）
});