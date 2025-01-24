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
const router = express_1.default.Router();
router.use(express_1.default.json());
router.get('/status', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('insde the getjobdetails function bro');
        try {
            const { jobid } = req.query;
            if (!jobid) {
                return res.status(400).json({
                    message: "invalid or missing jobid parameter"
                });
            }
            const job = yield db_1.default.job.findUnique({
                where: {
                    id: Number(jobid)
                },
                include: {
                    visits: true,
                    imageResults: true
                }
            });
            if (!job) {
                return res.status(404).json({
                    message: "job not found"
                });
            }
            const failedresult = job === null || job === void 0 ? void 0 : job.imageResults.filter(function (result) {
                return result.status === 'failed';
            });
            const completedresults = job === null || job === void 0 ? void 0 : job.imageResults.filter(function (result) {
                return result.status === 'success';
            });
            if (failedresult.length > 0) {
                return res.status(200).json({
                    status: "failed",
                    job_id: job === null || job === void 0 ? void 0 : job.id,
                    error: failedresult.map((result) => ({
                        store_id: result.storeId,
                        error: result.error || "error while processing "
                    }))
                });
            }
            if ((completedresults === null || completedresults === void 0 ? void 0 : completedresults.length) === (job === null || job === void 0 ? void 0 : job.imageResults.length)) {
                return res.status(200).json({
                    status: "comppleted",
                    job_id: job === null || job === void 0 ? void 0 : job.id
                });
            }
            return res.status(200).json({
                status: "ongoing",
                job_id: job.id
            });
        }
        catch (error) {
            console.error("Error fetching job info:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});
exports.default = router;
