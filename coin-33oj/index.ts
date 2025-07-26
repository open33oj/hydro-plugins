import {
    _, db, UserModel, SettingModel, DomainModel, Handler, param, PRIV, Types, query, NotFoundError
} from 'hydrooj';
import { getUser, userBillCount } from './model';

const coll = db.collection('coin');


interface Bill {
    _id: string;
    userId: number;
    rootId: number;
    amount: number;
    text: string;
}

declare module 'hydrooj' {
    interface Model {
        coin: typeof coinModel;
    }
    interface Collections {
        bill: Bill;
    }
}
async function inc(userId: number, rootId: number, amount: number, text: string) {
    await coll.insertOne({ userId, rootId, amount, text });
    // 发放
    await UserModel.inc(userId, 'coin_now', amount);
    if (amount > 0)
        await UserModel.inc(userId, 'coin_all', amount);
}

async function billCount() {
    return await coll.count();
}

async function getAll(ll: number, ss: number) {
    return await coll.find().limit(ll).skip((ss - 1) * ll).sort({ _id: -1 }).toArray();
}


async function userBillCount(userId: number) {
    return await coll.count({ "userId": userId });
}


async function getUser(userId: number, ll: number, ss: number) {
    return await coll.find({ "userId": userId }).limit(ll).skip((ss - 1) * ll).sort({ _id: -1 }).toArray();
}

const coinModel = { inc, billCount, getAll, userBillCount, getUser };
global.Hydro.model.coin = coinModel;

//展示所有 
class CoinShowHandler extends Handler {
    @query('page', Types.PositiveInt, true)
    async get(domainId: string, page = 1) {
        const [dudocs, upcount, ucount] = await this.ctx.db.paginate(
            UserModel.getMulti({ coin_all: { $exists: true } }).sort({ coin_now: -1 }),
            page,
            50,
        );
        const udict = await UserModel.getList("system", dudocs.map((x) => x._id));
        const udocs = dudocs.map((x) => udict[x._id]);
        this.response.template = 'coin_show.html'; // 返回此页面
        this.response.body = { udocs, upcount, ucount, page, udict };
    }
}

//增加
class CoinIncHandler extends Handler {
    async get() {
        this.response.template = 'coin_inc.html'; // 返回此页面
    }

    @param('uidOrName', Types.UidOrName)
    @param('amount', Types.Int)
    @param('text', Types.String)
    async post(domainId: string, uidOrName: string, amount: number, text: string) {
        let udoc = await UserModel.getById(domainId, +uidOrName)
                || await UserModel.getByUname(domainId, uidOrName)
                || await UserModel.getByEmail(domainId, uidOrName);
        if (!udoc)
            throw new NotFoundError(uidOrName);
        amount = parseInt(amount);
        // 记录
        await coinModel.inc(udoc._id, this.user._id, amount, text);
        // 将用户重定向到增加完成的url
        this.response.redirect = this.url('coin_bill', { uid: udoc._id });
    }
}

//账单
class CoinBillHandler extends Handler {
    @param('uid', Types.Int)
    @query('page', Types.PositiveInt, true)
    async get(domainId: string, uid: number, page = 1) {
        //管理员能看所有，其他人只能看自己的
        if (uid != this.user._id)
            this.checkPriv(PRIV.PRIV_CREATE_DOMAIN);
        //id 为 0 即查看所有人
        if (uid == 0) {
            let ucount = await coinModel.billCount();
            let upcount = parseInt((ucount + 49) / 50);
            const bills = await coinModel.getAll(50, page);
            this.response.template = 'coin_bill.html'; // 返回此页面
            this.response.body = { uid, bills, upcount, ucount, page };
        }
        else {
            let ucount = await coinModel.userBillCount(uid);
            let upcount = parseInt((ucount + 49) / 50);
            const bills = await coinModel.getUser(uid, 50, page);
            this.response.template = 'coin_bill.html'; // 返回此页面
            this.response.body = { uid, bills, upcount, ucount, page };
        }
    }
}

// 配置项及路由
export async function apply(ctx: Context) {
    ctx.inject(['setting'], (c) => {
        c.setting.AccountSetting(
            SettingModel.Setting('setting_33oj', 'coin_now', 0, 'number', 'coin_now', null, 3),
            SettingModel.Setting('setting_33oj', 'coin_all', 0, 'number', 'coin_all', null, 3)
        );
        ctx.Route('coin_inc', '/coin/inc', CoinIncHandler, PRIV.PRIV_CREATE_DOMAIN);
        ctx.Route('coin_show', '/coin/show', CoinShowHandler, PRIV.PRIV_USER_PROFILE);
        ctx.Route('coin_bill', '/coin/bill/:uid', CoinBillHandler, PRIV.PRIV_USER_PROFILE);
    });
}
