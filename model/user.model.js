const db = require("../utils/db");

/**=======================user model start =====================================*/
module.exports = {
    userRegister: async (userData) => {
        return db.query("insert into users set ?", [userData]);
    },
    is_visiable_status_change: async (user_id, activity_id, is_visiable) => {
        return db.query(
            `Update rent_price SET isVisiable=? where id=? AND userId=? `,
            [is_visiable, activity_id, user_id]
        );
    },
    findExistsUserOtpUpdate: async (obj) => {
        return db.query(
            `Update user_register SET otp=? where mobileNumber=? `,
            [obj.otp, obj.mobileNumber]
        );
    },
    update_isUser_online_offline: async (is_online, id) => {
        return db.query(
            `Update user_register SET isOnline=? where id=? `,
            [is_online, id]
        );
    },
    findExistsUserFcm_token: async (fcm_token, mobileNumber) => {
        return db.query(
            `Update user_register SET fcm_token=? where mobileNumber=? `,
            [fcm_token, mobileNumber]
        );
    },
    fetchUserByMobileNumber: async (mobileNumber) => {
        return db.query(`select * from user_register where mobileNumber = '${mobileNumber}'`);
    }

}