"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const get_config_1 = require("./config/get-config");
exports.logger = {
    log: (message, ...args) => {
        if (!(0, get_config_1.getConfig)().silence) {
            console.log(`\x1b[32m${message}\x1b[0m`, ...args);
        }
    },
    warn: (message, ...args) => {
        console.warn(`\x1b[33m${message}\x1b[0m`, ...args);
    },
    error: (message, ...args) => {
        console.error(`\x1b[31m${message}\x1b[0m`, ...args);
    },
};
