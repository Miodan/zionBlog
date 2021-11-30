module.exports = {
  "title": "fengqignblog",
  "description": "枫情博客",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  plugins: [
    [
      "vuepress-plugin-cursor-effects",
      {
        size: 2,                    // size of the particle, default: 2
        shape: 'circle',  // shape of the particle, default: 'star'
        zIndex: 999999999           // z-index property of the canvas, default: 999999999
      }
    ],
    // 趣味动态表
    [
      "dynamic-title",
      {
        showIcon: "/favicon.ico",
        showText: "Hello ~",
        hideIcon: "/favicon.ico",
        hideText: "ByeBye ~",
        recoverTime: 2000
      }
    ],
    // 复制弹窗插件
    ["vuepress-plugin-nuggets-style-copy", {
      copyText: "复制代码",
      tip: {
          content: "复制成功!"
      }
    }],
    // 根据目录自动生成文件侧边栏
    ["vuepress-plugin-auto-sidebar", {}],
    [
      "permalink-pinyin",
      {
        lowercase: true, // Converted into lowercase, default: true
        separator: "-", // Separator of the slug, default: '-'
      },
    ],
    ["meting", {
      meting: {
        // 歌单地址-> 如果输入可忽略server|type|mid
        // 但是不知道为什么不写上这三个会报错, 所以我都写上了
        auto: 'https://music.163.com/#/song?id=1892295825',
        // 当前服务为netease -> 网易
        server: "netease",
        // 类型为歌单
        type: "playlist",
        // 歌单id
        mid: "5312894314",
      },
      aplayer: {
        // 歌单为随机
        order: 'random',
        // 0为不显示歌词
        lrcType: 0,
        // 音量
        volume: 0.15,
        // 开启迷你模式
        mini: true,
        // 自动播放
        autoplay: true
      }
    }]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "GitHub",
        "link": "https://github.com/recoluan",
        "icon": "reco-github"
      }
    ],
    "sidebar": {
      "/docs/theme-reco/": [
        "",
        "theme",
        "plugin",
        "api"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "枫情",
    "authorAvatar": "/avatar.png",
    "record": "xxxx",
    "startYear": "2017",
    "subSidebar": 'auto', // 自动形成侧边导航
  },
  "markdown": {
    "lineNumbers": true
  }
}