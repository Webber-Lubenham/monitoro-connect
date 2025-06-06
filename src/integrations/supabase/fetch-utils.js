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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryFetch = void 0;
/**
 * Helper function for retrying fetch requests
 */
var retryFetch = function (url_1, options_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([url_1, options_1], args_1, true), void 0, function (url, options, maxRetries, retryDelay) {
        var lastError, _loop_1, retries, state_1;
        if (maxRetries === void 0) { maxRetries = 3; }
        if (retryDelay === void 0) { retryDelay = 300; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastError = null;
                    _loop_1 = function (retries) {
                        var urlString, response, delay_1, delay_2, err_1, delay_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 6, , 10]);
                                    urlString = typeof url === 'string' ? url : url.toString();
                                    return [4 /*yield*/, fetch(urlString, options)];
                                case 1:
                                    response = _b.sent();
                                    if (!!response.ok) return [3 /*break*/, 5];
                                    if (!(response.status === 429 && retries < maxRetries)) return [3 /*break*/, 3];
                                    delay_1 = retryDelay * Math.pow(2, retries) + Math.random() * 100;
                                    console.warn("Rate limited (429). Waiting ".concat(delay_1, "ms before retry ").concat(retries + 1, "/").concat(maxRetries));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/, "continue"];
                                case 3:
                                    if (!(response.status !== 401 && retries < maxRetries)) return [3 /*break*/, 5];
                                    delay_2 = retryDelay * Math.pow(2, retries);
                                    console.warn("Fetch error (status ".concat(response.status, "): ").concat(response.statusText, ". Retrying in ").concat(delay_2, "ms..."));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_2); })];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/, "continue"];
                                case 5: return [2 /*return*/, { value: response }];
                                case 6:
                                    err_1 = _b.sent();
                                    lastError = err_1;
                                    if (!(retries < maxRetries)) return [3 /*break*/, 8];
                                    delay_3 = retryDelay * Math.pow(2, retries);
                                    console.warn("Network error (attempt ".concat(retries + 1, "/").concat(maxRetries, "):"), err_1);
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_3); })];
                                case 7:
                                    _b.sent();
                                    return [3 /*break*/, 9];
                                case 8:
                                    console.error('Max retries reached for fetch:', err_1);
                                    _b.label = 9;
                                case 9: return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    };
                    retries = 0;
                    _a.label = 1;
                case 1:
                    if (!(retries <= maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(retries)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    retries++;
                    return [3 /*break*/, 1];
                case 4: throw lastError || new Error('Failed after max retries');
            }
        });
    });
};
exports.retryFetch = retryFetch;
