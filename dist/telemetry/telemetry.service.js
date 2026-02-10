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
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../database/entities");
let TelemetryService = class TelemetryService {
    vehicleHistoryRepo;
    meterHistoryRepo;
    vehicleLiveRepo;
    meterLiveRepo;
    constructor(vehicleHistoryRepo, meterHistoryRepo, vehicleLiveRepo, meterLiveRepo) {
        this.vehicleHistoryRepo = vehicleHistoryRepo;
        this.meterHistoryRepo = meterHistoryRepo;
        this.vehicleLiveRepo = vehicleLiveRepo;
        this.meterLiveRepo = meterLiveRepo;
    }
    async ingestVehicle(data) {
        const timestamp = new Date(data.timestamp);
        await this.vehicleHistoryRepo.insert({
            vehicleId: data.vehicleId,
            kwhDeliveredDc: data.kwhDeliveredDc,
            batteryTemp: data.batteryTemp,
            soc: data.soc,
            timestamp,
        });
        await this.vehicleLiveRepo.upsert({
            vehicleId: data.vehicleId,
            soc: data.soc,
            batteryTemp: data.batteryTemp,
            lastKwhDeliveredDc: data.kwhDeliveredDc,
            updatedAt: new Date(),
        }, ['vehicleId']);
        return { status: 'vehicle telemetry ingested' };
    }
    async ingestMeter(data) {
        const timestamp = new Date(data.timestamp);
        await this.meterHistoryRepo.insert({
            meterId: data.meterId,
            kwhConsumedAc: data.kwhConsumedAc,
            voltage: data.voltage,
            timestamp,
        });
        await this.meterLiveRepo.upsert({
            meterId: data.meterId,
            voltage: data.voltage,
            lastKwhConsumedAc: data.kwhConsumedAc,
            updatedAt: new Date(),
        }, ['meterId']);
        return { status: 'meter telemetry ingested' };
    }
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.VehicleTelemetryHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MeterTelemetryHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.VehicleLiveStatus)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.MeterLiveStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map