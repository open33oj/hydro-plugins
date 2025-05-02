import { HomeHandler } from 'hydrooj/src/handler/home'

async function getCountdown(payload) {
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function calculateDiffDays(targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 清除时间部分，只比较日期
        
        const timeDiff = targetDate.getTime() - today.getTime();
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    }

    var content = new Array();
    var dateToday = formatDate(new Date());
    var dates = new Array(payload.dates);
    dates = dates[0];
    
    dates.forEach(function(val, ind) {
        if (content.length < payload['max_dates']) {
            const targetDate = new Date(val.date);
            targetDate.setHours(0, 0, 0, 0); // 清除时间部分
            
            const targetDateStr = formatDate(targetDate);
            const todayDate = new Date(dateToday);
            todayDate.setHours(0, 0, 0, 0);
            
            if (targetDate >= todayDate) {
                var diffTime = calculateDiffDays(targetDate);
                content.push({
                    name: val.name,
                    diff: diffTime
                });
            }
        }
    });
    
    payload.dates = content;
    return payload;
}
HomeHandler.prototype.getCountdown = async (domainId, payload) => {
    return await getCountdown(payload);
}