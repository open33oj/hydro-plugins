import { Context, Time } from 'hydrooj';

interface CountdownData {
    title: string;
    max_dates: number;
    dates: Array<{ name: string, date: Date }>;
}

export function apply(ctx: Context) {
    ctx.withHandlerClass('HomeHandler', (h) => {
        h.prototype['getCountdown'] = async (domainId: string, data: CountdownData) => ({
            title: data.title,
            dates: data.dates
                .filter((item) => item.date > new Date())
                .map((item) => ({ ...item, remaining: Math.ceil((item.date.getTime() - Date.now()) / Time.day) }))
                .slice(0, data.max_dates),
        });
    });
}
