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
