const extension = {
  name: "m3u8 视频下载",
  mount: (api) => {
    // 监听解析任务
    api.on("resolve", async (ctx) => {
      const req = ctx.req;
      if (req.url.includes(".m3u8")) {
        ctx.res = {
          name: `video_${Date.now()}.mp4`,
          parser: "m3u8"
        };
      }
    });
  }
};

export default extension;
