chrome.storage.sync.get(['username', 'password'], function (data) {

  // 这里是获取 账号输入框，密码输入框，协议统一勾选框 以及登录按钮  这些元素的获取要具体情况具体分析
  document.getElementById('svpn_name').value = data.username
  document.getElementById('input_pwd').value = data.password
  document.getElementById('checkbox').checked = true

  const loginDom = document.getElementById('logButton')
  setTimeout(() => {
    if (loginDom) {
      console.log('loginDom', loginDom)
      loginDom.click()
    }
  }, 1000)
  // document.getElementById('logButton').click()
})
