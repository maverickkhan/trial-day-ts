"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses = {
    success: (ctx, data) => {
        ctx.status = 200;
        ctx.body = {
            success: true,
            data,
        };
    },
    badRequest: (ctx, errors) => {
        ctx.status = 400;
        ctx.body = {
            success: false,
            errors,
        };
    },
    unauthorized: (ctx, message) => {
        ctx.status = 401;
        ctx.body = { success: false, message };
    },
    notFound: (ctx) => {
        ctx.status = 404;
        ctx.body = {
            success: false,
            message: 'Not Found',
        };
    },
};
exports.default = responses;
