/*
 * Copyright (c) 2012-2015, b3log.org
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview settings.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @author <a href="http://88250.b3log.org">Liang Ding</a>
 * @version 1.3.2.7, Aug 28, 2015
 */

/**
 * @description Settings function
 * @static
 */
var Settings = {
    /**
     * @description 积分转账
     * @argument {String} csrfToken CSRF token
     */
    pointTransfer: function (csrfToken) {
        if (Validate.goValidate({target: $('#pointTransferTip'),
            data: [{
                    "target": $("#pointTransferUserName"),
                    "type": "string",
                    "max": 256,
                    "msg": Label.invalidUserNameLabel
                }, {
                    "target": $("#pointTransferAmount"),
                    "type": "string",
                    'max': 50,
                    "msg": Label.amountNotEmpty
                }]})) {
            var requestJSONObject = {
                "userName": $("#pointTransferUserName").val(),
                "amount": $("#pointTransferAmount").val()
            };

            $.ajax({
                url: "/point/transfer",
                type: "POST",
                headers: {"csrfToken": csrfToken},
                cache: false,
                data: JSON.stringify(requestJSONObject),
                beforeSend: function () {
                    $("#pointTransferTip").removeClass("succ").removeClass("error").html("");
                },
                success: function (result, textStatus) {
                    if (result.sc) {
                        $("#pointTransferTip").addClass("succ").removeClass("error").html('<ul><li>' + Label.transferSuccLabel + '</li></ul>');
                    } else {
                        $("#pointTransferTip").addClass("error").removeClass("succ").html('<ul><li>' + result.msg + '</li></ul>');
                    }

                    $("#pointTransferTip").show();

                    setTimeout(function () {
                        $("#pointTransferTip").hide();
                    }, 2000);
                }
            });
        }
    },
    /**
     * @description 更新 settings 页面数据.
     * @argument {String} csrfToken CSRF token
     */
    update: function (type, csrfToken) {
        var requestJSONObject = {};

        switch (type) {
            case "profiles":
                requestJSONObject = this._validateProfiles();
                break;
            case "sync/b3":
                requestJSONObject = this._validateSyncB3();
                break;
            case "password":
                requestJSONObject = this._validatePassword();
                break;
            default:
                console.log("update settings has no type");
        }

        if (!requestJSONObject) {
            return false;
        }

        $.ajax({
            url: "/settings/" + type,
            type: "POST",
            headers: {"csrfToken": csrfToken},
            cache: false,
            data: JSON.stringify(requestJSONObject),
            beforeSend: function () {
                $("#" + type.replace(/\//g, "") + "Tip").removeClass("succ").removeClass("error").html("");
            },
            success: function (result, textStatus) {
                if (result.sc) {
                    $("#" + type.replace(/\//g, "") + "Tip").addClass("succ").removeClass("error").html('<ul><li>' + Label.updateSuccLabel + '</li></ul>');
                } else {
                    $("#" + type.replace(/\//g, "") + "Tip").addClass("error").removeClass("succ").html('<ul><li>' + result.msg + '</li></ul>');
                }
                $("#" + type.replace(/\//g, "") + "Tip").show();

                setTimeout(function () {
                    $("#" + type.replace(/\//g, "") + "Tip").hide();
                }, 5000);

            }
        });
    },
    /**
     * @description settings 页面 profiles 数据校验
     * @returns {boolean/obj} 当校验不通过时返回 false，否则返回校验数据值。
     */
    _validateProfiles: function () {
        if (Validate.goValidate({target: $('#profilesTip'),
            data: [{
                    "target": $("#userTags"),
                    "type": "tags",
                    "msg": Label.tagsErrorLabel
                }, {
                    "target": $("#userURL"),
                    "type": "url",
                    "msg": Label.invalidUserURLLabel
                }, {
                    "target": $("#userQQ"),
                    "type": "number",
                    'max': 15,
                    "msg": Label.invalidUserQQLabel
                }, {
                    "target": $("#userIntro"),
                    "type": "string",
                    'max': 255,
                    "msg": Label.invalidUserIntroLabel
                }, {
                    "target": $("#avatarURL"),
                    "type": "imgSrc",
                    "msg": Label.invalidAvatarURLLabel
                }]})) {
            return {
                userTags: $("#userTags").val().replace(/(^\s*)|(\s*$)/g, ""),
                userURL: $("#userURL").val().replace(/(^\s*)|(\s*$)/g, ""),
                userQQ: $("#userQQ").val().replace(/(^\s*)|(\s*$)/g, ""),
                userIntro: $("#userIntro").val().replace(/(^\s*)|(\s*$)/g, ""),
                userAvatarURL: $("#avatarURL").attr("src")
            };
        } else {
            return false;
        }
    },
    /**
     * @description settings 页面 solo 数据同步校验
     * @returns {boolean/obj} 当校验不通过时返回 false，否则返回校验数据值。
     */
    _validateSyncB3: function () {
        if (Validate.goValidate({target: $("#syncb3Tip"),
            data: [{
                    "target": $("#soloKey"),
                    "type": "string",
                    'max': 20,
                    "msg": Label.invalidUserB3KeyLabel
                }, {
                    "target": $("#soloPostURL"),
                    "type": "url",
                    "msg": Label.invalidUserB3ClientURLLabel
                }, {
                    "target": $("#soloUpdateURL"),
                    "type": "url",
                    "msg": Label.invalidUserB3ClientURLLabel
                }, {
                    "target": $("#soloCmtURL"),
                    "type": "url",
                    "msg": Label.invalidUserB3ClientURLLabel
                }]})) {
            return {
                userB3Key: $("#soloKey").val().replace(/(^\s*)|(\s*$)/g, ""),
                userB3ClientAddArticleURL: $("#soloPostURL").val().replace(/(^\s*)|(\s*$)/g, ""),
                userB3ClientUpdateArticleURL: $("#soloUpdateURL").val().replace(/(^\s*)|(\s*$)/g, ""),
                userB3ClientAddCommentURL: $("#soloCmtURL").val().replace(/(^\s*)|(\s*$)/g, "")
            };
        } else {
            return false;
        }
    },
    /**
     * @description settings 页面密码校验
     * @returns {boolean/obj} 当校验不通过时返回 false，否则返回校验数据值。
     */
    _validatePassword: function () {
        var pwdVal = $("#pwdOld").val(),
                newPwdVal = $("#pwdNew").val();
        if (Validate.goValidate({target: $('#passwordTip'),
            data: [{
                    "target": $("#pwdOld"),
                    "type": "password",
                    "msg": Label.invalidPasswordLabel
                }, {
                    "target": $("#pwdNew"),
                    "type": "password",
                    "msg": Label.invalidPasswordLabel
                }, {
                    "target": $("#pwdRepeat"),
                    "type": "password",
                    "oranginal": $('#pwdNew'),
                    "msg": Label.confirmPwdErrorLabel
                }]})) {
            if (newPwdVal !== $("#pwdRepeat").val()) {
                return false;
            }
            var data = {};
            data.userPassword = calcMD5(pwdVal);
            data.userNewPassword = calcMD5(newPwdVal);
            return data;
        }
        return false;
    },
    /**
     * @description 初识化设置页面，回车提交表单
     */
    init: function () {
        $("#userURL, #userQQ").keyup(function (event) {
            if (event.keyCode === 13) {
                Settings.update('profiles');
            }
        });

        $("#userIntro").keyup(function (event) {
            if (event.keyCode === 13 && event.ctrlKey) {
                Settings.update('profiles');
            }
        });

        $("#soloKey, #soloPostURL, , #soloUpdateURL, #soloCmtURL").keyup(function (event) {
            if (event.keyCode === 13) {
                Settings.update('sync/b3');
            }
        });

        $("#pwdOld, #pwdNew, #pwdRepeat").keyup(function (event) {
            if (event.keyCode === 13) {
                Settings.update('password');
            }
        });
    }
};

Settings.init();