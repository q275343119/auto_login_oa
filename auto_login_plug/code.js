function getCode() {
  return fetch('$替换为你的域名$/get/code?phone=YiPhone&project_name=cms', {
      method: 'GET',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var userid = JSON.parse(data);
      console.log(userid);
      return userid;
    })
}



chrome.storage.sync.get([], function () {
  console.log("脚本启动")
  setTimeout(async () => {
    
    const code = await getCode()

    // console.log(response)
    // const { code } = response.text();
    console.log("验证码：",code)
    // 下面是验证码的输入框和登录按钮的获取，具体情况具体分析
    document.getElementById("svpn_inputsms").value = code;
    loginDom = document.getElementsByName("Submit")

    if (loginDom) {
      console.log('loginDom', loginDom)
      loginDom[0].click()
    }
  }, 15000)
  // document.getElementById('logButton').click()
})
