import { HomeHandler } from 'hydrooj/src/handler/home'

async function getCountdown(payload) {
    const content = [];
    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);
    const todayTime = dateToday.getTime(); // 提前计算dateToday的时间戳

    payload.dates.forEach((val) => {
        if (content.length >= payload['max_dates']) return; // 如果已达到最大日期数量，退出循环

        const valDate = new Date(val.date);
        valDate.setHours(0, 0, 0, 0);
        const valTime = valDate.getTime();

        if (valTime >= todayTime) {
            const diffTime = Math.ceil((valTime - todayTime) / (1000 * 60 * 60 * 24));
            content.push({
                name: val.name,
                diff: diffTime
            });
        }
    });

    payload.dates = content;
    return payload;
}

HomeHandler.prototype.getCountdown = async (domainId, payload) => {
    return await getCountdown(payload);
};
