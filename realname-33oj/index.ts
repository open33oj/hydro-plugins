import {
    _, db, UserModel, SettingModel, DomainModel, Handler, param, PRIV, Types, query, NotFoundError
} from 'hydrooj';

// 修复 `getListForRender` 函数，给前端传递更多内容
export const coll: Collection<Udoc> = db.collection('user');
export const collV: Collection<VUdoc> = db.collection('vuser');
export const collGroup: Collection<GDoc> = db.collection('user.group');
UserModel.getListForRender = async function (domainId: string, uids: number[]) {
    const [udocs, vudocs, dudocs] = await Promise.all([
        UserModel.getMulti({ _id: { $in: uids } }, ['_id', 'uname', 'mail', 'avatar', 'school', 'studentId', 'realname_flag', 'realname_name']).toArray(),
        collV.find({ _id: { $in: uids } }).toArray(),
        DomainModel.getDomainUserMulti(domainId, uids).project({ uid: true, displayName: true }).toArray(),
    ]);
    const udict = {};
    for (const udoc of udocs) udict[udoc._id] = udoc;
    for (const udoc of vudocs) udict[udoc._id] = udoc;
    for (const dudoc of dudocs) udict[dudoc.uid].displayName = dudoc.displayName;
    for (const uid of uids) udict[uid] ||= { ...UserModel.defaultUser };
    for (const key in udict) {
        udict[key].school ||= '';
        udict[key].studentId ||= '';
        udict[key].displayName ||= udict[key].uname;
        udict[key].avatar ||= `gravatar:${udict[key].mail}`;
    }
    return udict as BaseUserDict;
};

//实名设置
class RealnameSetHandler extends Handler {
    async get() {
        this.response.template = 'realname_set.html'; // 返回此页面
    }
    @param('uidOrName', Types.UidOrName)
    @param('flag', Types.number)
    @param('name', Types.string)
    async post(domainId: string, uidOrName: string, flag: number, name: string) {
        // 检查输入
        flag = parseInt(flag);
        let udoc = await UserModel.getById(domainId, +uidOrName)
                || await UserModel.getByUname(domainId, uidOrName)
                || await UserModel.getByEmail(domainId, uidOrName);
        if (!udoc)
            throw new NotFoundError(uidOrName);
        // 构建徽章代码并更新
        await UserModel.setById(udoc._id, { realname_flag: flag, realname_name: name });
        // 将用户重定向到创建完成的url
        this.response.redirect = "/realname/show";
    }
}

//展示实名用户
class RealnameShowHandler extends Handler {
    @query('page', Types.PositiveInt, true)
    async get(domainId: string, page = 1) {
        const [dudocs, upcount, ucount] = await this.ctx.db.paginate(
            UserModel.getMulti({ realname_flag: { $exists: true } }).sort({ realname_flag: -1, _id: -1 }),
            page,
            50,
        );
        const udict = await UserModel.getList("system", dudocs.map((x) => x._id));
        const udocs = dudocs.map((x) => udict[x._id]);
        this.response.template = 'realname_show.html'; // 返回此页面
        this.response.body = { udocs, upcount, ucount, page, udict };
    }
}

// 配置项及路由
export async function apply(ctx: Context) {
    ctx.inject(['setting'], (c) => {
        c.setting.AccountSetting(
            SettingModel.Setting('setting_33oj', 'realname_flag', 0, 'number', 'realname_flag', null, 3),
            SettingModel.Setting('setting_33oj', 'realname_name', '', 'text', 'realname_name', null, 3)
        );
        ctx.Route('realname_set', '/realname/set', RealnameSetHandler, PRIV.PRIV_CREATE_DOMAIN);
        ctx.Route('realname_show', '/realname/show', RealnameShowHandler, PRIV.PRIV_CREATE_DOMAIN);
    });
}
