# Rocket Space Planet

一个面向移动端的沉浸式太空旅程网页原型。页面由多个场景组成：每个场景先展示一张静态图片，用户点击按钮后播放对应视频，视频播放完成后自动进入下一个场景。

当前场景流程：

1. 待发射的火箭
2. 舷窗之外
3. 月面回望

第三个场景播放完成后，会自动回到第一个场景，形成循环体验。

## 运行方式

这个项目不需要安装依赖，也不需要构建。

直接用浏览器打开：

```text
codes/index.html
```

如果浏览器限制本地视频播放，也可以在项目根目录启动一个静态文件服务，例如：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000/codes/
```

## 项目结构

```text
.
├── codes/
│   ├── index.html      # 页面结构
│   ├── styles.css      # 移动端沉浸式视觉样式
│   └── app.js          # 场景配置和播放逻辑
├── images/
│   ├── earth/
│   └── rocket/
└── videos/
    ├── earth/
    └── rocket/
```

## 场景配置

所有场景都配置在 `codes/app.js` 的 `scenes` 数组里。

每个场景包含：

```js
{
  id: "rocket-launch",
  kicker: "Mission 01",
  title: "待发射的火箭",
  description: "发射塔进入最终锁定。\n按下点火按钮后，旅程会从地表推入轨道。",
  image: "../images/rocket/rocket-xiaoda.png",
  video: "../videos/rocket/rocket-launch.mp4",
  action: "点火发射",
}
```

字段说明：

- `id`：场景标识，用于样式或调试
- `kicker`：标题上方的小标签
- `title`：场景标题
- `description`：场景文案，支持 `\n` 换行
- `image`：进入场景时显示的静态图片
- `video`：点击按钮后播放的视频
- `action`：按钮文案

## 添加新场景

1. 把图片放到 `images/` 下合适的目录。
2. 把视频放到 `videos/` 下合适的目录。
3. 在 `codes/app.js` 的 `scenes` 数组末尾追加一个场景对象。

视频播放结束后，页面会自动进入数组里的下一个场景；最后一个场景结束后会回到第一个场景。

## 当前素材

```text
images/rocket/rocket-xiaoda.png
images/earth/earth-from-space-station.png
images/earth/earth-from-moon.png

videos/rocket/rocket-launch.mp4
videos/earth/earth-from-space-station.mp4
videos/earth/earth-from-moon.mp4
```

## 交互说明

- 页面优先适配移动端竖屏。
- 初始状态显示静态图片、标题、文案和按钮。
- 用户点击按钮后开始播放视频。
- 视频开始播放后，标题、文案、按钮、遮罩和扫描线会隐藏，让视频成为完整画面。
- 视频播放完成后自动切换到下一个场景。
