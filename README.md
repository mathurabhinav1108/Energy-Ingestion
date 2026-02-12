# High-Scale Energy Ingestion Engine

## Overview

This project implements the **core ingestion and analytics layer** for a high-scale Fleet Energy Platform. The system ingests telemetry from **10,000+ smart meters and EVs**, processes **two independent data streams every 60 seconds**, correlates them, and exposes fast analytical insights around **energy efficiency and vehicle performance**.

The solution is built using **NestJS (TypeScript)** with **PostgreSQL** and is designed to comfortably handle **~14.4 million telemetry records per day**.

---

## Domain Model & Data Correlation

### Hardware Perspective

The system ingests telemetry from two physically distinct but logically related sources:

1. **Smart Meter (Grid Side)**

   * Measures AC power drawn from the utility grid
   * Reports `kwhConsumedAc` (billable energy)

2. **Vehicle & Charger (Device Side)**

   * Charger converts AC → DC for battery storage
   * Vehicle reports:

     * `kwhDeliveredDc` (actual energy stored)
     * `SoC` (battery percentage)
     * `batteryTemp`

### Correlation Logic

* AC energy is always **greater than DC energy** due to conversion losses
* Charging efficiency is calculated as:

```
Efficiency = Total DC Delivered / Total AC Consumed
```

A sustained efficiency drop (e.g. < 85%) indicates:

* Charger inefficiency
* Hardware faults
* Energy leakage

Correlation is performed **at query time** using indexed historical data rather than at ingestion time, ensuring ingestion remains lightweight and scalable.

---

## Architecture & Data Strategy

### Why Separate Hot & Cold Data Stores?

At this scale, a **single-table approach does not scale well** for both ingestion and analytics. The system intentionally separates data based on access patterns.

### 1. Cold Store (Historical Telemetry)

**Purpose:**

* Long-term audit trail
* Analytics and reporting

**Characteristics:**

* Append-only (INSERT only)
* Optimized for write throughput
* Billions of rows over time

**Tables:**

* `vehicle_telemetry_history`
* `meter_telemetry_history`

Each heartbeat is persisted without mutation, ensuring:

* Full traceability
* Accurate time-series analysis

---

### 2. Hot Store (Live State)

**Purpose:**

* Real-time dashboards
* Current vehicle status

**Characteristics:**

* One row per entity
* Constant-size tables
* Updated via UPSERT

**Tables:**

* `vehicle_live_status`
* `meter_live_status`

This avoids expensive queries like:

```
SELECT * FROM history ORDER BY timestamp DESC LIMIT 1
```

which would be infeasible at scale.

---

## Ingestion Flow (High Throughput)

1. Devices send telemetry every **60 seconds**
2. A single polymorphic endpoint accepts both streams
3. Payloads are validated via DTOs
4. Writes are split into two paths:

   * **History Path:** INSERT (cold store)
   * **Live Path:** UPSERT (hot store)

This design ensures:

* Minimal write contention
* Predictable performance
* Horizontal scalability

---

## Handling 14.4 Million Records per Day

### Write Volume Calculation

* 10,000 devices
* 2 telemetry streams
* Every 60 seconds

```
10,000 × 2 × 60 × 24 = 14,400,000 records/day
```

### Design Decisions That Enable This Scale

#### 1. Append-Only Writes

* No updates or deletes on historical tables
* Sequential inserts are highly optimized in PostgreSQL

#### 2. Indexed Access Patterns

Indexes are created on:

* `(vehicle_id, timestamp)`
* `(meter_id, timestamp)`

This ensures:

* Analytics queries only scan relevant 24-hour windows
* No full table scans

#### 3. Hot Table Isolation

* Dashboards never touch historical data
* Live tables remain small and fast

#### 4. Lightweight Ingestion Logic

* No joins during ingestion
* No cross-stream blocking
* Correlation deferred to analytics

---

## Analytics Design

### Endpoint

```
GET /v1/analytics/performance/:vehicleId
```

### Query Strategy

* Aggregates **last 24 hours** of data
* Uses indexed time-range scans
* Computes:

  * Total AC consumed
  * Total DC delivered
  * Efficiency ratio
  * Average battery temperature

### Performance Guarantee

* No full-table scans
* Query cost grows with **time window**, not total data volume

---

## Validation & Data Integrity

### API-Level Validation

* DTO-based validation using `class-validator`
* Enforces:

  * Valid ranges (SoC 0–100)
  * Positive energy values
  * Required identifiers

### Database-Level Guarantees

* NOT NULL constraints
* CHECK constraints for numeric ranges
* Unique constraints on live tables for safe UPSERTs

---

## Technology Stack

* **Backend:** NestJS (TypeScript)
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Validation:** class-validator
* **Deployment:** Docker / docker-compose

---

## Summary

This system is intentionally designed to:

* Sustain **millions of writes per day**
* Provide **real-time visibility** without expensive queries
* Enable **accurate energy efficiency analytics**
* Remain simple, observable, and extensible

By separating hot and cold data paths, deferring correlation to analytics, and optimizing for predictable access patterns, the architecture scales linearly with fleet growth while keeping operational complexity low.

---

✅ This design directly addresses the assignment goals of high-scale ingestion, efficient correlation, and fast analytical insights.
