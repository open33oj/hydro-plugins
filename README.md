# hydro-plugins

基于 [Hydro](https://github.com/hydro-dev/Hydro) 框架部署的 [33OJ](https://oj.33dai.cn) 使用到的一些插件。

写得都非常粗糙，很多错误，谨慎使用。目前适配 Hydro 版本 `4.19.1`。

- 交流反馈 QQ 群：515497602
- 网络友好的 Gitee 镜像库：https://gitee.com/wood3_admin/hydro-plugins

## 注意

`/path/to/xxx` 指的是 `xxx` 这个文件夹在服务器上的完整路径。

## 已有/计划中的项目

- `frontend-33oj`：33OJ 的前端修改
- `badge-33oj`：徽章管理插件
- `realname-33oj`：简单实名插件
- `checkin-33oj`：打卡及每日运势
- `pastebin-33oj`：剪贴板插件
- `coin-33oj`：简单硬币插件
- `countdown-33oj`：倒计时插件
- `group-plus-33oj`：更友好的小组管理（计划中）
- 参考项目：
  - 官方插件例子
  - [liyanqwq/hydrooj-countdown](https://github.com/liyanqwq/hydrooj-countdown)
  - [liyanqwq/hydrooj-pastebin-plus](https://github.com/liyanqwq/hydrooj-pastebin-plus)

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
- `templates/user_detail.html`：依赖 coin 插件与 realname 插件。在个人页面展示硬币数量、实名信息、并隐藏掉个人简介
- `templates/training_main.html`、`templates/partials/training_list.html`：把训练列表改成了类似于题库的形式

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
- `/paste/all`：拥有 `PRIV_CREATE_DOMAIN` 权限的人可以管理所有剪贴板。

## coin-33oj

简单硬币插件，实际上就是一个账单和一个记录当前硬币数量的字段。

### 安装

1. 添加插件：`hydrooj addon add /path/to/coin-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 配置

- 入口：
  - `baseurl/coin/show`：查看所有人的硬币数量
  - `baseurl/coin/inc`：增加某位用户的硬币
  - `baseurl/coin/bill`：查看账单
    - `baseurl/coin/bill/0`：查看所有人
    - `baseurl/coin/bill/uid`：查看 uid 用户
- 权限配置：
  - `PRIV.PRIV_CREATE_DOMAIN`：可以发硬币以及看所有硬币发放记录
  - 所有人可以看到硬币榜单和自己的账单

### TODO

- [ ] 类似于导入用户的批量发硬币
- [ ] 更人性化的 UI
- [ ] 简单的商城系统

## countdown-33oj

在 https://github.com/liyanqwq/hydrooj-countdown 的基础上进行了一些修改。

### 安装

1. 添加插件：`hydrooj addon add /path/to/countdown-33oj`
2. 重启程序：`pm2 restart hydrooj`

### 配置

在 `控制面板`、`系统设置`、`hydrooj`、`首页` 中添加类似下面这样的配置项

```
  countdown:
    title: 倒计时
    max_dates: 5
    dates:
      - name: APIO 2025
        date: 2025-05-15
      - name: NOI 2025
        date: 2025-07-12
      - name: IOI 2025
        date: 2025-07-27
      - name: CSP-J/S 2025 第一轮
        date: 2025-09-20
      - name: CSP-J/S 2025 第二轮
        date: 2025-11-01
      - name: NOIP 2025
        date: 2025-11-29
```

然后重启程序：`pm2 restart hydrooj`
