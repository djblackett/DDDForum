"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adapter_prisma_1 = require("@snaplet/seed/adapter-prisma");
var config_1 = require("@snaplet/seed/config");
var client_1 = require("@prisma/client");
exports.default = (0, config_1.defineConfig)({
    adapter: function () {
        var client = new client_1.PrismaClient();
        return new adapter_prisma_1.SeedPrisma(client);
    },
    select: ["!*_prisma_migrations"],
});
