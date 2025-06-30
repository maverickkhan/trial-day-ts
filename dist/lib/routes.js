"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const issues_1 = __importDefault(require("./api/issues"));
const discovery_1 = __importDefault(require("./api/discovery"));
const health_1 = __importDefault(require("./api/health"));
const token_1 = __importDefault(require("./api/token"));
const router = new koa_router_1.default();
// Public
router.get('/health', health_1.default);
router.get('/discovery', discovery_1.default);
router.get('/token', token_1.default.generateToken);
// Issues
router.get('/issues', issues_1.default.get);
router.post('/issues', issues_1.default.create);
router.get('/issues/:id', issues_1.default.getOne);
router.patch('/issues/:id', issues_1.default.update);
router.delete('/issues/:id', issues_1.default.delete);
router.get('/issues/:id/revisions', issues_1.default.getRevisions);
router.get('/issues/:id/compare', issues_1.default.compare);
exports.default = router;
