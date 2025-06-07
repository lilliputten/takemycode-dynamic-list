"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
console.log(`Starting a server on port ${PORT}...`);
app.get('/', (_req, res) => {
    res.send('Express + TypeScript on Vercel');
});
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
exports.default = app;
