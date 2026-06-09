<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Portfolio Backend Server (Nest.js)

<p align="center">
  <a href="#-한국어">한국어</a> | 
  <a href="#-english">English</a> | 
  <a href="#-日本語">日本語</a>
</p>

---

## 🇰🇷 한국어

### 프로젝트 소개
> **서버리스(Vercel)의 콜드 스타트 문제를 해결하고 아키텍처를 고도화하기 위해, 기존 Next.js 백엔드를 Nest.js 기반의 상시 구동형 독립 API 서버로 전환한 프로젝트입니다.**

기존 `Next.js + Vercel` 풀스택 환경에서 발생하던 **Serverless Cold Start(첫 방문 시 지연 현상)** 문제를 인프라 및 프레임워크 수준에서 근본적으로 해결하고, 향후 관리자(Admin) 백오피스 기능의 확장성을 확보하기 위해 `Nest.js` 독립형 상시 구동 서버로 아키텍처를 마이그레이션했습니다.

### 주요 목표
* **성능 최적화:** 서버리스 환경의 콜드 스타트를 제거하여 API 응답 속도 및 사용자 경험(UX) 최적화
* **아키텍처 고도화:** Next.js API Routes의 단순한 구조에서 Nest.js의 레이어드 아키텍처(Module-Controller-Service) 패턴으로 고도화
* **확장성 확보:** 독립적인 데이터베이스 연동 및 관리자 전용 백오피스 API 기능 확장

---

## 🇺🇸 English

### Project Overview
> **Decoupled Nest.js API server migrated from Next.js (Serverless) to resolve cold start issues, optimize performance, and build a robust architecture with corporate-grade patterns.**

This project focuses on migrating the backend from a `Next.js + Vercel` full-stack environment to a standalone, always-on `Nest.js` server. The goal is to fundamentally eliminate **Serverless Cold Start issues** (initial request delays) at the infrastructure/framework level and ensure scalability for future admin back-office features.

### Key Objectives
* **Performance Optimization:** Eliminate cold starts to minimize API latency and enhance user experience (UX).
* **Architecture Evolution:** Transition from the simple structure of Next.js API Routes to Nest.js's structured Layered Architecture (Module-Controller-Service) pattern.
* **Scalability:** Implement a decoupled database connection and expand dedicated admin back-office APIs.

---

## 🇯🇵 日本語

### プロジェクト概要
> **サーバーレス（Vercel）のコールドスタート問題を解決し、アーキテクチャを高度化するため、従来のNext.jsバックエンドをNest.jsベースの常時稼働型独立APIサーバーに移行したプロジェクトです。**

従来の`Next.js + Vercel`フルスタック環境で発生していた**サーバーレスのコールドスタート（初回アクセス時の遅延現象）** インフラおよびフレームワークレベルで根本的に解決し、今後の管理者（Admin）バックオフィス機能の拡張性を確保するため、`Nest.js`独立型サーバーへのアーキテクチャマイグレーションを実施しました。

### 主な目標
* **パフォーマンスの最適化:** コールドスタートを排除し、APIの応答速度とユーザー体験（UX）を最適化
* **アーキテクチャの高度化:** Next.js API Routesのシンプルな構造から、Nest.jsのレイヤードアーキテクチャ（Module-Controller-Service）パターンへの高度化
* **拡張性の確保:** 独立したデータベース連携および管理者専用バックオフィスAPI機能の拡張

---

## 🛠 Tech Stack
* **Framework:** Nest.js (TypeScript)
* **Package Manager:** pnpm
* **Database:** *(To be updated)*
* **Deployment:** *(To be updated)*

---

## 💻 Project Setup & Run

### Installation
```bash
$ pnpm install