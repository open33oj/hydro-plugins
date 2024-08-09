# HydroOJ Countdown

适用于 [HydroOJ](//hydro.js.org) 的倒计时插件。

## Installation

1. 安装命令：

```bash
yarn global add hydrooj-countdown
hydrooj addon add hydrooj-countdown
```

2. 重启 HydroOJ。

3. 进入 HydroOJ 控制面板 - hydrooj - 主页，将下方配置信息粘贴到适当位置。

```
  countdown:
    title: 咕咕倒计时
    max_dates: 3
    dates:
      - name: NOI Online 2022
        date: 2022-03-26
      - name: NOI 2022 省选 / NGOI
        date: 2022-04-04
      - name: NOI 2022
        date: 2022-07-23
      - name: IOI 2022
        date: 2022-08-07
      - name: CSP 2022 一轮
        date: 2022-09-18
      - name: CSP 2022 二轮
        date: 2022-10-22
      - name: NOIP 2022
        date: 2022-11-19
```

然后应该就能用了，其他见上面配置。

## License

AGPL v3