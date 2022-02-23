module.exports = {
  "title": "zionBlog",
  "description": "前端博客",
  "base": '/zionBlog/',
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
      "@vuepress-reco/vuepress-plugin-bgm-player",{
        audios: [
          // 本地文件示例
          // {
          //   name: '장가갈 수 있을까',
          //   artist: '咖啡少年',
          //   url: '/bgm/1.mp3',
          //   cover: '/bgm/1.jpg'
          // },
          {
            name: '孤勇者',
            artist: '祖娅纳惜',
            url: 'https://m801.music.126.net/20220101211622/c6961a51fdeb9f8a41c4de26c998aca7/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/11981159467/a3d1/61c1/aeed/1ac8e9cc1dbb95461bf6cc2396805908.m4a',
            cover: 'http://p1.music.126.net/Z25vG8gwiYPpwttD9mD1ag==/109951166705090906.jpg?param=130y130'
          },
        ]  
      }
    ],
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
    "logo": "/avatar.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "Zion",
    "authorAvatar": "/avatar.jpg",
    "record": "zzy672385981",
    "startYear": "2021",
    "subSidebar": 'auto', // 自动形成侧边导航
  },
  "markdown": {
    "lineNumbers": true
  }
}