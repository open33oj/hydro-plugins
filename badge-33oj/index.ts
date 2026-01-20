import {
    db, definePlugin, UserModel, Handler, UserNotFoundError, NotFoundError, param, PermissionError, PRIV, Types,
} from 'hydrooj';

class BadgeShowHandler extends Handler {
    async get() {
        const udocs = await UserModel.getMulti({ badge: { $exists: true, $ne: "" } }).toArray();
        this.response.template = 'badge_show.html'; // 返回此页面
        this.response.body = { udocs };
    }
}

class BadgeCreateHandler extends Handler {
    async get() {
        this.response.template = 'badge_create.html'; // 返回此页面
    }
    @param('uidOrName', Types.UidOrName)
    @param('text', Types.String)
    @param('color', Types.String)
    @param('textColor', Types.String)
    async post(domainId: string, uidOrName: string, text: string, color: string, textColor: string) {
        // 检查输入
        let udoc = await UserModel.getById(domainId, +uidOrName)
                || await UserModel.getByUname(domainId, uidOrName)
                || await UserModel.getByEmail(domainId, uidOrName);
        if (!udoc)
            throw new NotFoundError(uidOrName);
        text = text.replace('\'', '').replace('\"', '');
        if (!text)
            throw new NotFoundError('text');
        if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color) ||
            !/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(textColor))
            throw new NotFoundError('color');
        // 构建徽章代码并更新
        await UserModel.setById(udoc._id, { badge: text + color + textColor });
        // 将用户重定向到创建完成的url
        this.response.redirect = "/manage/badge";
    }
}

class BadgeManageHandler extends Handler {
    async get() {
        // this.checkPriv(PRIV.PRIV_USER_PROFILE);
        const udocs = await UserModel.getMulti({ badge: { $exists: true, $ne: "" } }).toArray();
        this.response.template = 'badge_manage.html'; // 返回此页面
        this.response.body = { udocs };
    }
}

class BadgeDelHandler extends Handler {
    @param('uid', Types.Int)
    async get(domainId: string, uid: number) {
        await UserModel.setById(uid, { badge: "" });
        this.response.redirect = "/manage/badge";
    }
}

export async function apply(ctx: Context) {
    ctx.Route('badge_show', '/badge', BadgeShowHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('badge_create', '/manage/badge/create', BadgeCreateHandler, PRIV.PRIV_CREATE_DOMAIN);
    ctx.Route('badge_manage', '/manage/badge', BadgeManageHandler, PRIV.PRIV_CREATE_DOMAIN);
    ctx.Route('badge_del', '/manage/badge/:uid/del', BadgeDelHandler, PRIV.PRIV_CREATE_DOMAIN);
    ctx.injectUI('ControlPanel', 'badge_manage');
}