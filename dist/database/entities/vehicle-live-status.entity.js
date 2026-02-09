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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleLiveStatus = void 0;
const typeorm_1 = require("typeorm");
let VehicleLiveStatus = class VehicleLiveStatus {
    vehicleId;
    soc;
    batteryTemp;
    lastKwhDeliveredDc;
    updatedAt;
};
exports.VehicleLiveStatus = VehicleLiveStatus;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], VehicleLiveStatus.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: false }),
    __metadata("design:type", Number)
], VehicleLiveStatus.prototype, "soc", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { nullable: false }),
    __metadata("design:type", Number)
], VehicleLiveStatus.prototype, "batteryTemp", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { nullable: false }),
    __metadata("design:type", Number)
], VehicleLiveStatus.prototype, "lastKwhDeliveredDc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: false }),
    __metadata("design:type", Date)
], VehicleLiveStatus.prototype, "updatedAt", void 0);
exports.VehicleLiveStatus = VehicleLiveStatus = __decorate([
    (0, typeorm_1.Entity)('vehicle_live_status'),
    (0, typeorm_1.Check)(`"soc" >= 0 AND "soc" <= 100`),
    (0, typeorm_1.Check)(`"lastKwhDeliveredDc" >= 0`)
], VehicleLiveStatus);
//# sourceMappingURL=vehicle-live-status.entity.js.map