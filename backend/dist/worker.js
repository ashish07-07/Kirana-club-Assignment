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
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const connection = {
    host: "127.0.0.1",
    port: 6379,
};
function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
        console.log("inside the fetch function");
        return Buffer.from(response.data);
    });
}
function getImageDimensions(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inside the dimensionfunction");
        const { height, width } = yield (0, sharp_1.default)(buffer).metadata();
        if (!height || !width)
            throw new Error("Could not determine image dimensions.");
        return { height, width };
    });
}
function sleepRandom(min, max) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inside the sleeprandom function");
        const delay = Math.random() * (max - min) + min;
        return new Promise((resolve) => setTimeout(resolve, delay * 1000));
    });
}
const bullmq_1 = require("bullmq");
const db_1 = __importDefault(require("./db"));
const worker = new bullmq_1.Worker("jobQueue", function (job) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`the job id which we created are ${job.data.jobid}`);
        console.log(`the url is ${job.data.url}`);
        const visits = yield db_1.default.visit.findMany({
            where: {
                jobId: job.data.jobid
            }
        });
        console.log(visits);
        for (const visit of visits) {
            for (const url of visit.image_url) {
                try {
                    console.log(`now we are downlaoding the iamge baba`);
                    const iamgebuffer = yield fetchImage(url);
                    const { height, width } = yield getImageDimensions(iamgebuffer);
                    const perimeter = 2 * (height * width);
                    console.log(`the image dimensions :height=${height}, width=${width}`);
                    console.log(`the calculated perimeter is  ${perimeter}`);
                    yield sleepRandom(0.1, 0.4);
                    yield db_1.default.imageResult.create({
                        data: {
                            jobId: job.data.jobid,
                            storeId: visit.store_id,
                            imageUrl: url,
                            perimeter,
                            status: "success"
                        }
                    });
                    console.log(`image processed and result stored successfully`);
                }
                catch (error) {
                    console.log(`Failed to process iamge at ${url} `);
                    yield db_1.default.imageResult.create({
                        data: {
                            jobId: job.data.jobid,
                            storeId: visit.store_id,
                            imageUrl: url,
                            status: 'failed',
                            error: "error processsing the image"
                        }
                    });
                }
            }
        }
    });
}, { connection });
