#!/usr/bin/env node 
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var readline = require('readline-sync');
var mongoose = require('mongoose');
var ProgressBar = require('progress');
var fs = require('fs');
var path = require('path');
var parseCsv = require('csv-parse/lib/sync');
var CONNECT_URL = readline.question('Connection URL:  ').trim();
var CSV_PATH = readline.question('Path to CSV:  ').trim();
var collectionName = readline.question('Collection Name:  ').trim();
var overwrite = readline.question('Overwrite Existing? (Y/n):  ');
var identifier;
if (overwrite == 'Y') {
    identifier = readline.question('Unique Column Name:  ').trim();
}
mongoose.connect(CONNECT_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
var DB = mongoose.connection;
DB.on('error', console.error.bind(console, '*** ERROR *** \n'));
DB.once('open', function () {
    console.log('*** CONNECTED *** \n');
    var schema = new mongoose.Schema({ any: {} }, { strict: false });
    var Model = mongoose.model(collectionName, schema);
    var parseFile = function (fileName) {
        var filePath = path.join(__dirname, fileName);
        var data = fs.readFileSync(filePath, 'utf8');
        return parseCsv(data.trim(), { columns: true });
    };
    var rows = parseFile(CSV_PATH);
    var count = 0;
    var bar = new ProgressBar('[:bar] :percent :etas', {
        total: rows.length,
        renderThrottle: 100,
        complete: '\u001b[42m \u001b[0m'
    });
    (function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, rows_1, row, dataToFind;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, rows_1 = rows;
                        _a.label = 1;
                    case 1:
                        if (!(_i < rows_1.length)) return [3 /*break*/, 7];
                        row = rows_1[_i];
                        count = count + 1;
                        if (!(overwrite == 'Y')) return [3 /*break*/, 3];
                        dataToFind = {};
                        dataToFind[identifier] = row[identifier];
                        return [4 /*yield*/, Model.findOneAndUpdate(dataToFind, row, { upsert: true }).exec()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, Model.create(row)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        bar.tick();
                        if (count == rows.length) {
                            console.log('\n *** COMPLETE ***');
                            process.exit(1);
                        }
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    }());
});
