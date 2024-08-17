import {
    _, db, UserModel, SettingModel, DomainModel, moment, Handler, PRIV
} from 'hydrooj';
import { HomeHandler } from 'hydrooj/src/handler/home';

// 每日签到
class CheckinHandler extends Handler {
    async get() {
        const uid = this.user._id;
        const udoc = await UserModel.getById("system", uid);
        let check_luck = udoc["checkin_luck"];
        let checkin_time = udoc["checkin_time"];
        let checkin_cnt_now = udoc["checkin_cnt_now"];
        let checkin_cnt_all = udoc["checkin_cnt_all"];
        const now = moment().format("YYYY-MM-DD");
        if (now != checkin_time) {
            check_luck = Math.floor(Math.random() * 7);
            if (checkin_cnt_all)
                checkin_cnt_all++;
            else
                checkin_cnt_all = 1;
            if (checkin_cnt_now &&
                moment(now).diff(moment(checkin_time), 'days') == 1)
                checkin_cnt_now++;
            else
                checkin_cnt_now = 1;
            checkin_time = now;
            await UserModel.setById(uid, {
                checkin_luck: check_luck,
                checkin_time: checkin_time,
                checkin_cnt_now: checkin_cnt_now,
                checkin_cnt_all: checkin_cnt_all
            });
            this.response.redirect = "/";
        }
        else {
            this.response.redirect = "/";
        }
    }
}

//首页获取当天日期、运势文字、颜色
async function getCheckin(payload) {
    var today = moment().format("YYYY-MM-DD");
    payload.luck_today = today;
    return payload;
}
HomeHandler.prototype.getCheckin = async (domainId, payload) => {
    return await getCheckin(payload);
}


// 配置项及路由
export async function apply(ctx: Context) {
    ctx.inject(['setting'], (c) => {
        c.setting.AccountSetting(
            SettingModel.Setting('setting_33oj', 'checkin_time', '1997-01-11', 'text', 'checkin_time', null, 3),
            SettingModel.Setting('setting_33oj', 'checkin_luck', 0, 'number', 'checkin_luck', null, 3),
            SettingModel.Setting('setting_33oj', 'checkin_cnt_now', 0, 'number', 'checkin_cnt_now', null, 3),
            SettingModel.Setting('setting_33oj', 'checkin_cnt_all', 0, 'number', 'checkin_cnt_all', null, 3)
        );
    });
    ctx.Route('checkin', '/checkin', CheckinHandler, PRIV.PRIV_USER_PROFILE);
}
