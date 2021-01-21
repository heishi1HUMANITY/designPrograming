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
var faceapi = require('face-api.js');
var canvas = require('canvas');
var fs = require('fs');
var path = require('path');
var express = require('express');
var multer = require('multer');
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, 'tmp.jpg');
        }
    })
});
var app = express();
var getParam = function () { return __awaiter(void 0, void 0, void 0, function () {
    var c, ctx, img, d;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                c = canvas.createCanvas(160, 120);
                ctx = c.getContext('2d');
                return [4 /*yield*/, canvas.loadImage(path.join(__dirname, 'uploads', 'tmp.jpg'))];
            case 1:
                img = _a.sent();
                ctx.drawImage(img, 0, 0, 160, 120);
                return [4 /*yield*/, faceapi.detectSingleFace(c).withFaceExpressions()];
            case 2:
                d = _a.sent();
                return [2 /*return*/, d];
        }
    });
}); };
var max = function (obj) {
    var max = ['', -Infinity];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (max[1] <= value)
            max = [key, value];
    }
    console.log(max);
    return max;
};
app.post('/api/dp/', upload.any(), function (req, res) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getParam()];
                case 1:
                    p = _a.sent();
                    if (p !== null)
                        res.send(max(p.expressions)[0]);
                    else
                        res.end();
                    return [2 /*return*/];
            }
        });
    }); })()
        .catch(function (err) {
        res.status(418);
        res.send(err);
    });
});
app.listen(3000, function () { return console.log('server is working at localhost:3000'); });
(function () {
    var Canvas = canvas.Canvas, Image = canvas.Image, ImageData = canvas.ImageData;
    faceapi.env.monkeyPatch({ Canvas: Canvas, Image: Image, ImageData: ImageData });
    Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'weights')),
        faceapi.nets.faceExpressionNet.loadFromDisk(path.join(__dirname, 'weights'))
    ]);
    console.log('faceapi is ready');
})();
