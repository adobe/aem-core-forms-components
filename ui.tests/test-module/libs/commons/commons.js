/*
 *  Copyright 2021 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var paramMap = {};
var commons = {
    loadI18nParams : function (obj, locale, formPage) {
        var previousLocale = formPage.getLocale();
        formPage.setLocale(locale);
        // load i18n as param
        for (var key in obj) {
            var value = obj[key];
            if (formPage.isPlainObject(value)) {
                this.param('i18n_' + key, formPage.i18n(value.text, value.vars, value.hint));
            } else {
                this.param('i18n_' + key, formPage.i18n(value));
            }
        }
        formPage.setLocale(previousLocale);
    },

    param : function (key, value) {
        if (value != null) {
            paramMap[key] = value;
        } else {
            return paramMap[key];
        }
    },

    getUserInfo : function (formPage) {
        return formPage.evalUrl("/libs/cq/security/userinfo.json");
    },

    getCSRFToken : function (formPage) {
        var TOKEN_SERVLET = '/libs/granite/csrf/token.json';
        return formPage.evalUrl(TOKEN_SERVLET).token;
    },

    addCSRFTokenParam : function (params, formPage) {
        params[':cq_csrf_token'] = this.getCSRFToken(formPage);
    },

    postWithCSRFToken : function (url, params, formPage) {
        this.addCSRFTokenParam(params, formPage);
        return formPage.postUrl(url, params);
    },

    setPreferences : function (preferences, formPage) {
        var url = formPage.contextPath + commons.param("user_home") + '/preferences';
        this.postWithCSRFToken(url, preferences, formPage);
    },

    setLanguage : function(formPage, lan){
        var preferences = {
            language : lan ? lan : commons.param("locale")
        };
        this.setPreferences(preferences, formPage);
    },

    resetLanguage : function(formPage){
        var preferences = {
            language : commons.param("user_language")
        };
        this.setPreferences(preferences, formPage);
    },

    /*
     * Disable some tutorials by setting the user preferences
     */
    disableTutorials : function(formPage) {
        var preferences = {
            'cq.authoring.editor.page.showTour62' : false,
            'cq.authoring.editor.page.showOnboarding62' : false,
            'cq.authoring.editor.template.showTour' : false,
            'cq.authoring.editor.template.showOnboarding' : false,
            'granite.shell.showonboarding620' : false,
            'cq.authoring.editor.theme.showTour' : false,
            'cq.authoring.ruleeditor.showTour' : false,
            'cq.authoring.editor.form.showTour' : false
        };
        this.setPreferences(preferences, formPage);
    },

    resetTutorials : function(formPage) {
        var preferences = {
            'cq.authoring.editor.page.showTour62@Delete' : true,
            'cq.authoring.editor.page.showOnboarding62@Delete' : true,
            'cq.authoring.editor.template.showTour@Delete' : true,
            'cq.authoring.editor.template.showOnboarding@Delete' : true,
            'granite.shell.showonboarding620@Delete' : true,
            'cq.authoring.editor.theme.showTour@Delete' : true,
            'cq.authoring.ruleeditor.showTour@Delete' : true,
            'cq.authoring.editor.form.showTour@Delete' : true
        };
        this.setPreferences(preferences, formPage);
    },

    setDefaultUserPreferences : function(formPage){
        var userInfo = commons.getUserInfo(formPage);
        commons.param("user_home", userInfo.home);
        commons.setLanguage(formPage);
        commons.disableTutorials(formPage);
        formPage.initCommonsI18n();
    },

    resetDefaultUserPreferences : function(formPage) {
        commons.resetTutorials(formPage);
        commons.resetLanguage(formPage);
    },

    getAuthorInstanceUrl : function() {
        var QUICKSTART_AUTHOR_HOST = process.env.QUICKSTART_AUTHOR_HOST ? process.env.QUICKSTART_AUTHOR_HOST : "localhost";
        var QUICKSTART_AUTHOR_PORT = process.env.QUICKSTART_AUTHOR_PORT ? process.env.QUICKSTART_AUTHOR_PORT : "4502";
        var QUICKSTART_AUTHOR_CP = process.env.QUICKSTART_AUTHOR_CP ? process.env.QUICKSTART_AUTHOR_CP : "";
        return "http://" + QUICKSTART_AUTHOR_HOST + ":" + QUICKSTART_AUTHOR_PORT + QUICKSTART_AUTHOR_CP;
    }
};


commons.param("locale", "en");
commons.param("user_language", "en");
// set context path here
commons.param("context_path", "");

module.exports = commons;