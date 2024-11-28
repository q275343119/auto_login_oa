chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set(
    { username: '$替换为你的账号$', password: '$替换为你的密码$' },
    function () {
      console.log('Username and password set.')
    }
  )
})
