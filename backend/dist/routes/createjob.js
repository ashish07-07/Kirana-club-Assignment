"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const __1 = require("..");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/submit', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            console.log(body);
            if (body.count != body.visits.length) {
                return res.status(400).json({
                    error: "Please give the visits matching with count "
                });
            }
            const job = yield db_1.default.job.create({
                data: {
                    count: body.count,
                    status: 'ongoing',
                }
            });
            console.log(`created job with id ${job.id}`);
            const visitPromises = body.visits.map((visit) => db_1.default.visit.create({
                data: {
                    store_id: visit.store_id,
                    image_url: visit.image_url,
                    visit_time: visit.visit_time,
                    jobId: job.id,
                },
            }));
            yield Promise.all(visitPromises);
            yield __1.jobqueue.add("imagejob", { jobid: job.id, url: "httplocalhost/3000" });
            return res.status(201).json({
                job_id: job.id
            });
        }
        catch (e) {
            console.log(e);
            console.log(`error creating a jon and the error is ${e}`);
            return res.status(400).json({
                error: e
            });
        }
    });
});
exports.default = router;
