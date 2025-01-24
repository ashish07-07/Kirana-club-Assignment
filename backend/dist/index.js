"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobqueue = void 0;
const express_1 = __importDefault(require("express"));
const createjob_1 = __importDefault(require("./routes/createjob"));
const getjobdetails_1 = __importDefault(require("./routes/getjobdetails"));
const bullmq_1 = require("bullmq");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
let connection = 45;
exports.jobqueue = new bullmq_1.Queue("jobQueue");
app.use('/api', createjob_1.default);
app.use('/jobapi', getjobdetails_1.default);
app.listen(PORT, function () {
    console.log(` server listening on port ${PORT}`);
});
