"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../database/entities");
let AnalyticsService = class AnalyticsService {
    vehicleRepo;
    meterRepo;
    constructor(vehicleRepo, meterRepo) {
        this.vehicleRepo = vehicleRepo;
        this.meterRepo = meterRepo;
    }
    async getPerformance(vehicleId) {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dc = await this.vehicleRepo
            .createQueryBuilder('v')
            .select('SUM(v.kwhDeliveredDc)', 'totalDc')
            .addSelect('AVG(v.batteryTemp)', 'avgTemp')
            .where('v.vehicleId = :vehicleId', { vehicleId })
            .andWhere('v.timestamp >= :since', { since })
            .getRawOne();
        const ac = await this.meterRepo
            .createQueryBuilder('m')
            .select('SUM(m.kwhConsumedAc)', 'totalAc')
            .andWhere('m.timestamp >= :since', { since })
            .getRawOne();
        return {
            totalAc: Number(ac.totalAc || 0),
            totalDc: Number(dc.totalDc || 0),
            efficiency: ac.totalAc && dc.totalDc ? dc.totalDc / ac.totalAc : null,
            avgBatteryTemp: Number(dc.avgTemp || 0),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.VehicleTelemetryHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MeterTelemetryHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map