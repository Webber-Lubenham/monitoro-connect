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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthHeaders = exports.authStorage = exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var storage_ts_1 = require("./storage.ts"); // Already correct
var fetch_utils_ts_1 = require("./fetch-utils.ts");
var config_ts_1 = require("./config.ts");
// Configuração para Vite
var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rsvjnndhbyyxktbczlnk.supabase.co';
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDk3NzksImV4cCI6MjA1ODk4NTc3OX0.AlM_iSptGQ7G5qrJFHU9OECu1wqH6AXQP1zOU70L0T4';
// Verificação de segurança
if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && import.meta.env.MODE === 'production') {
    throw new Error('Supabase configuration is required in production');
}
// Singleton pattern implementation
var SupabaseClientSingleton = /** @class */ (function () {
    function SupabaseClientSingleton() {
    }
    SupabaseClientSingleton.initialize = function () {
        var urlParams = new URLSearchParams(window.location.search);
        var useSessionStorage = urlParams.has('use_session_storage') || false;
        this._storageApi = new storage_ts_1.CustomStorageAPI(useSessionStorage);
        this._instance = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                storage: this._storageApi,
                storageKey: config_ts_1.STORAGE_KEY,
                detectSessionInUrl: true
            },
            global: {
                headers: {
                    'X-Client-Info': 'monitore-app/1.0.0'
                },
                fetch: function (input, init) {
                    if (typeof input === 'string') {
                        return (0, fetch_utils_ts_1.retryFetch)(input, init || {}, 4, 300);
                    }
                    return (0, fetch_utils_ts_1.retryFetch)(input.toString(), init || {}, 4, 300);
                }
            }
        });
        console.log("Supabase client initialized with URL: ".concat(SUPABASE_URL.substring(0, 15), "..."));
    };
    SupabaseClientSingleton.getInstance = function () {
        if (!this._instance) {
            this.initialize();
        }
        return this._instance;
    };
    SupabaseClientSingleton.getStorage = function () {
        if (!this._storageApi) {
            this.initialize();
        }
        return this._storageApi;
    };
    return SupabaseClientSingleton;
}());
// Export singleton instance
exports.supabase = SupabaseClientSingleton.getInstance();
// Export storage API
exports.authStorage = SupabaseClientSingleton.getStorage();
// Helper function for auth headers
var getAuthHeaders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, headers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, exports.supabase.auth.getSession()];
            case 1:
                data = (_a.sent()).data;
                session = data === null || data === void 0 ? void 0 : data.session;
                headers = {
                    'Content-Type': 'application/json',
                    'X-Client-Info': 'monitore-app/1.0.0'
                };
                if (session === null || session === void 0 ? void 0 : session.access_token) {
                    headers['Authorization'] = "Bearer ".concat(session.access_token);
                }
                return [2 /*return*/, headers];
            case 2:
                error_1 = _a.sent();
                console.error('Error getting auth headers:', error_1);
                return [2 /*return*/, {
                        'Content-Type': 'application/json',
                        'X-Client-Info': 'monitore-app/1.0.0'
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAuthHeaders = getAuthHeaders;
