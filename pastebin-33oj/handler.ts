// @noErrors
// @module: esnext
// @filename: index.ts
import {
    db, definePlugin, Handler, NotFoundError, param, PermissionError, PRIV, Types,
} from 'hydrooj';

const coll = db.collection('paste');

interface Paste {
    _id: string;
    title: string;
    owner: number;
    content: string;
    isprivate: boolean;
}

declare module 'hydrooj' {
    interface Model {
        pastebin: typeof pastebinModel;
    }
    interface Collections {
        paste: Paste; // 声明数据表类型
    }
}

async function add(userId: number, title: string, content: string, isprivate: boolean): Promise<string> {
    const pasteId = String.random(16); // Hydro 提供了此方法，创建一个长度为16的随机字符串
    // 使用 mongodb 为数据库驱动，相关操作参照其文档
    const result = await coll.insertOne({
        _id: pasteId,
        title: title,
        owner: userId,
        content,
        isprivate,
    });
    return result.insertedId; // 返回插入的文档ID
}

async function edit(pasteId: string, userId: number, title: string, content: string, isprivate: boolean): Promise<string> {
    const result = await coll.updateOne({
        _id: pasteId
    }, {
        $set: {
            title: title,
            owner: userId,
            content: content,
            isprivate: isprivate,
        }
    });
}

async function get(pasteId: string): Promise<Paste> {
    return await coll.findOne({ _id: pasteId });
}

async function getUserPaste(userId: number): Promise<Paste> {
    return await coll.find({ "owner": userId }).sort({ time: -1 }).toArray();
}

async function del(pasteId: string): Promise<Paste> {
    return await coll.deleteOne({ _id: pasteId });
}

// 暴露这些接口，使得 cli 也能够正常调用这些函数；
const pastebinModel = { add, edit, get, getUserPaste, del };
global.Hydro.model.pastebin = pastebinModel;

class PasteCreateHandler extends Handler {
    async get() {
        this.response.template = 'paste_create.html'; // 返回此页面
    }
    @param('title', Types.Title)
    @param('content', Types.Content)
    @param('isprivate', Types.Boolean)
    async post(domainId: string, title: string, content: string, isprivate = false) {
        const pasteid = await pastebinModel.add(this.user._id, title, content, !!isprivate);
        this.response.redirect = this.url('paste_show', { id: pasteid });
    }
}

class PasteEditHandler extends Handler {
    @param('id', Types.String)
    async get(domainId: string, id: string) {
        const doc = await pastebinModel.get(id);
        if (!doc) throw new NotFoundError(id);
        if (this.user._id !== doc.owner) {
            throw new PermissionError();
        }
        this.response.body = { doc };
        this.response.template = 'paste_edit.html';
    }
    @param('pasteId', Types.String)
    @param('title', Types.Title)
    @param('content', Types.Content)
    @param('isprivate', Types.Boolean)
    async post(domainId: string, pasteId: string, title: string, content: string, isprivate = false) {
        const doc = await pastebinModel.get(pasteId);
        if (!doc) throw new NotFoundError(pasteId);
        if (this.user._id !== doc.owner) {
            throw new PermissionError();
        }
        await pastebinModel.edit(pasteId, this.user._id, title, content, !!isprivate);
        this.response.redirect = this.url('paste_show', { id: pasteId });
    }
}

class PasteShowHandler extends Handler {
    @param('id', Types.String)
    async get(domainId: string, id: string) {
        const doc = await pastebinModel.get(id);
        if (!doc) throw new NotFoundError(id);
        if (doc.isprivate && this.user._id !== doc.owner) {
            throw new PermissionError();
        }
        this.response.body = { doc };
        this.response.template = 'paste_show.html';
    }
}

class PasteDeleteHandler extends Handler {
    @param('id', Types.String)
    async get(domainId: string, id: string) {
        const doc = await pastebinModel.get(id);
        if (!doc) throw new NotFoundError(id);
        if (this.user._id !== doc.owner) {
            throw new PermissionError();
        }
        this.response.body = { doc };
        this.response.template = 'paste_delete.html';
    }
    @param('pasteId', Types.String)
    async post(domainId: string, pasteId: string) {
        const doc = await pastebinModel.get(pasteId);
        if (!doc) throw new NotFoundError(pasteId);
        if (this.user._id !== doc.owner) {
            throw new PermissionError();
        }
        await pastebinModel.del(pasteId);
        this.response.redirect = this.url('paste_manage');
    }
}

class PasteManageHandler extends Handler {
    async get(domainId: string) {
        const doc = await pastebinModel.getUserPaste(this.user._id);
        this.response.body = { doc };
        this.response.template = 'paste_manage.html';
    }
}

export async function apply(ctx: Context) {
    ctx.Route('paste_create', '/paste/create', PasteCreateHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_manage', '/paste/manage', PasteManageHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_show', '/paste/show/:id', PasteShowHandler);
    ctx.Route('paste_edit', '/paste/show/:id/edit', PasteEditHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_delete', '/paste/show/:id/delete', PasteDeleteHandler, PRIV.PRIV_USER_PROFILE);
    ctx.injectUI('UserDropdown', 'paste_manage', (h) => ({ icon: 'book', displayName: 'Pastebin'}), PRIV.PRIV_USER_PROFILE);
    ctx.i18n.load('zh', {
        Pastebin: '剪切板',
        blog_main: '剪切板',
    });
    ctx.i18n.load('en', {
        blog_main: 'Pastebin',
    });
}

