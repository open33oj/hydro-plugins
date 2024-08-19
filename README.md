# hydro-plugins

基于 [Hydro](https://github.com/hydro-dev/Hydro) 框架部署的 [33OJ](https://oj.33dai.cn) 使用到的一些插件。

- 交流反馈 QQ 群：515497602
- 网络友好的 Gitee 镜像库：https://gitee.com/wood3_admin/hydro-plugins

## 已有/计划中的项目

- `frontend-33oj`：33OJ 的前端修改
- `badge-33oj`：徽章管理插件
- `realname-33oj`：简单实名插件
- `checkin-33oj`：打卡及每日运势
- `pastebin-33oj`：剪贴板插件，基于官方例子与 [liyanqwq/hydrooj-pastebin-plus](https://github.com/liyanqwq/hydrooj-pastebin-plus)
- `coin-33oj`：简单硬币插件（重写中）
- `countdown`：倒计时插件，基于 [liyanqwq/hydrooj-countdown](https://github.com/liyanqwq/hydrooj-countdown)
- `group-plus-33oj`：更友好的小组管理（计划中）

## frontend-33oj

33OJ 的一些前端修改

### 安装

1. 添加插件：`hydrooj addon add /path/to/frontend-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 样式修改

- `public/`：33OJ 的一些 logo，注意替换
- `templates/ranking.html`：去掉了个人简介的部分
- `templates/layout/html5.html`：添加圆角样式
- `templates/partials/footer.html`：按个人喜好去掉了一些内容，添加了修改声明
- `templates/partials/problem_default.md`：将默认题目模板替换成了 [题型测试：输出测试](https://oj.33dai.cn/p/D0008)
- `templates/partials/homepage/recent_problems.html`：去掉了最近题目的时间

### 功能添加

- `templates/partials/scoreboard.html`：成绩表中显示分组名
- `templates/partials/homepage/sidebar_nav.html`：添加了一个可以在控制面板设置的边栏导航。
  - 使用：进入 `控制面板`、`系统设置`、`hydrooj`、`首页`，如下配置好需要展示的链接
    ```
      sidebar_nav:
        - title: 常用功能
          urls:
          - name: "33 NAV"
            url: https://www.33dai.cn
          - name: 云剪贴板
            url: /paste/manage
          - name: 查看徽章
            url: /badge
        - title: 常用 OJ
          urls:
          - name: HydroOJ
            url: https://hydro.ac/
          - name: 洛谷
            url: https://www.luogu.com.cn/
          - name: AtCoder
            url: https://atcoder.jp/
          - name: CodeForces
            url: https://codeforces.com/
    ```

## badge-33oj

徽章管理插件

### 安装

1. 添加插件：`hydrooj addon add /path/to/badge-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 配置

- 入口：`baseurl/badge`，找个地方把这个入口丢一下就好了。
- 权限配置：默认是所有用户可以查看，`PRIV.PRIV_CREATE_DOMAIN` 用户可以管理。


## realname-33oj

简单实名插件，重载了 `UserModel.getListForRender` 来在榜单中展示用户名。默认有三个角色 `0/1/2` 分别对应 `未分配/学生/老师`

### 安装

1. 添加插件：`hydrooj addon add /path/to/realname-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 配置

- 入口：
  - `baseurl/realname/show`：查看所有实名用户。
  - `baseurl/realname/set`：设置实名。
- 权限配置：
  - 所有人可以看到老师/学生的小 logo
  - `perm.PERM_VIEW_DISPLAYNAME`（显示域中用户的显示名）：可以查看到域中用户的实名
  - `PRIV.PRIV_CREATE_DOMAIN`（创建域）：可以管理（设置实名、查看所有实名）。

## checkin-33oj

打卡及每日运势

### 安装

1. 添加插件：`hydrooj addon add /path/to/checkin-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 配置

进入 `控制面板`、`系统设置`、`hydrooj`、`首页`，如下配置好。

```
  checkin:
    luck_type:
      - text: "大吉"
        color: "#ED5A65"
      - text: "吉"
        color: "#ED5A65"
      - text: "小吉"
        color: "#ED5A65"
      - text: "平"
        color: "#161823"
      - text: "小凶"
        color: "#161823"
      - text: "小凶"
        color: "#161823"
      - text: "大凶"
        color: "#161823"
    luck_vip:
      - 2
      - 3 
```

默认打卡后得到 $0\sim 6$ 中的一个运势结果。如果 `uid` 在 `luck_vip` 中则显示 `天天大吉`（颜色为 `luck_type[0]`）。

## pastebin-33oj

基于官方例子与 [liyanqwq/hydrooj-pastebin-plus](https://github.com/liyanqwq/hydrooj-pastebin-plus) 实现的剪贴板。

### 安装

1. 添加插件：`hydrooj addon add /path/to/pastebin-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 配置

- 入口：`baseurl/paste/manage`，找个地方把这个入口丢一下就好了。

## countdown

在 https://github.com/liyanqwq/hydrooj-countdown 的基础上进行了一些修改。

### 安装

1. 安装依赖：运行 `cd /path/to/countdown` 进入倒计时插件的文件夹，然后 `yarn` 
2. 添加插件：`hydrooj addon add /path/to/countdown`

### 配置

在 `控制面板`、`系统设置`、`hydrooj`、`首页` 中添加类似下面这样的配置项

```
  countdown:
    title: 倒计时-不计头尾
    max_dates: 5
    dates:
      - name: NOI 2024 报到
        date: 2024-07-16
      - name: NOI 2024 Day1
        date: 2024-07-18
      - name: NOI 2024 Day2
        date: 2024-07-20
      - name: CSP-J/S 2024 第一轮
        date: 2024-09-21
      - name: CSP-J/S 2024 第二轮
        date: 2024-10-26
```

然后重启程序：`pm2 restart hydrooj`
