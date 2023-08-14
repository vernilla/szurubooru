"use strict";

const events = require("../events.js");

const defaultSettings = {
    listPosts: {
        safe: true,
        sketchy: false,
        unsafe: false,
    },
    upscaleSmallPosts: false,
    endlessScroll: true,
    keyboardShortcuts: true,
    transparencyGrid: false,
    fitMode: "fit-both",
    tagSuggestions: true,
    autoplayVideos: false,
    postsPerPage: 42,
    tagUnderscoresAsSpaces: false,
    darkTheme: true,
    postFlow: true,
};

class Settings extends events.EventTarget {
    constructor() {
        super();
        this.cache = this._getFromLocalStorage();
    }

    _getFromLocalStorage() {
        let ret = Object.assign({}, defaultSettings);
        try {
            Object.assign(ret, JSON.parse(localStorage.getItem("settings")));
        } catch (e) {
            // continue regardless of error
        }
        return ret;
    }

    save(newSettings, silent) {
        newSettings = Object.assign(this.cache, newSettings);
        localStorage.setItem("settings", JSON.stringify(newSettings));
        this.cache = this._getFromLocalStorage();
        if (silent !== true) {
            this.dispatchEvent(
                new CustomEvent("change", {
                    detail: {
                        settings: this.cache,
                    },
                })
            );
        }
    }

    get() {
        return this.cache;
    }
}

module.exports = new Settings();
