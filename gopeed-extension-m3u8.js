// ==GopeedExtension==
// @name        m3u8 视频下载
// @version     1.0.0
// @author      Gopeed
// @description 自动识别 m3u8 视频链接，一键调用 Gopeed 合并下载为 MP4
// @homepage    https://github.com/monkeyWie/gopeed
// @match       *://*/*
// @grant       GM_download
// @grant       GM_notification
// @grant       GM_registerMenuCommand
// ==/GopeedExtension==

(function () {
  'use strict';

  /**
   * 匹配 m3u8 链接规则
   */
  const M3U8_REGEX = /\.m3u8(\?.*)?$/i;

  /**
   * 解析链接是否为 m3u8
   */
  function isM3u8Url(url) {
    return M3U8_REGEX.test(url);
  }

  /**
   * 发送 m3u8 任务到 Gopeed
   */
  function downloadM3u8(url) {
    if (!url || !isM3u8Url(url)) {
      GM_notification({
        title: 'm3u8 下载',
        text: '不是有效的 m3u8 链接',
        timeout: 2000
      });
      return;
    }

    // 调用 Gopeed 下载 API
    GM_download({
      url: url,
      name: `视频_${new Date().getTime()}.mp4`,
      extra: {
        // 关键：告诉 Gopeed 使用 m3u8 解析器
        parser: 'm3u8'
      },
      onSuccess: () => {
        GM_notification({
          title: 'm3u8 下载',
          text: '已添加到 Gopeed 下载队列',
          timeout: 2000
        });
      },
      onError: (err) => {
        GM_notification({
          title: 'm3u8 下载',
          text: `添加失败：${err.message}`,
          timeout: 3000
        });
      }
    });
  }

  /**
   * 手动输入 m3u8 链接下载
   */
  function manualDownload() {
    const url = prompt('请输入 m3u8 链接：');
    if (url) {
      downloadM3u8(url.trim());
    }
  }

  /**
   * 监听页面链接点击
   */
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (target && target.href) {
      const url = target.href;
      if (isM3u8Url(url)) {
        // 阻止默认跳转
        e.preventDefault();
        // 直接下载
        downloadM3u8(url);
      }
    }
  }, true);

  // 注册扩展菜单
  GM_registerMenuCommand('📥 手动输入 m3u8 链接下载', manualDownload);

  console.log('✅ Gopeed m3u8 扩展已加载');
})();
