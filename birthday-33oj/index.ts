import {
    _, db, UserModel, Handler, param, PRIV, Types, Context
} from 'hydrooj';

// 创建一个名为 birthday 的集合
const coll = db.collection('birthday');

interface Birthday {
    _id: string;
    userId: number;
    date: string;      // 完整日期: YYYY-MM-DD
    monthDay: string;  // 月日: MM-DD (用于快速查询当天的寿星)
}

declare module 'hydrooj' {
    interface Collections {
        birthday: Birthday;
    }
}

async function setBirthday(userId: number, date: string) {
    const parts = date.split('-');
    if (parts.length !== 3) return;
    const monthDay = `${parts[1]}-${parts[2]}`; // 提取 MM-DD
    
    await coll.updateOne(
        { userId },
        { $set: { userId, date, monthDay } },
        { upsert: true } // 如果没有则插入，如果有则更新
    );
}

async function getTodayBirthdays() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const monthDay = `${mm}-${dd}`;

    return await coll.find({ monthDay }).toArray();
}

class BirthdaySetHandler extends Handler {
    async get() {
        this.response.template = 'birthday_set.html'; // 返回设置页面
    }

    @param('uidOrName', Types.UidOrName)
    @param('date', Types.String)
    async post(domainId: string, uidOrName: string,  date: string) {
        // 简单的正则表达式校验 YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new Error('日期格式错误，请使用 YYYY-MM-DD 格式');
        }
        let udoc = await UserModel.getById(domainId, +uidOrName)
                || await UserModel.getByUname(domainId, uidOrName)
                || await UserModel.getByEmail(domainId, uidOrName);
        if (!udoc)
            throw new NotFoundError(uidOrName);        
        await setBirthday(udoc._id, date);
        // 设置成功后，重定向到展示页
        this.response.redirect = this.url('birthday_show');
    }
}

class BirthdayShowHandler extends Handler {
    async get(domainId: string) {
        const records = await getTodayBirthdays();
        const userIds = records.map((r) => r.userId);
        
        // 批量获取这些用户的详细信息 (用户名、头像等)
        const udict = await UserModel.getList("system", userIds);
        const udocs = userIds.map((id) => udict[id]).filter(u => u); // 过滤掉可能注销的用户

        this.response.template = 'birthday_show.html'; // 返回展示页面
        this.response.body = { udocs, records };
    }
}

export async function apply(ctx: Context) {
    ctx.Route('birthday_set', '/birthday/set', BirthdaySetHandler, PRIV.PRIV_MOD_BADGE);
    ctx.Route('birthday_show', '/birthday', BirthdayShowHandler);
}
