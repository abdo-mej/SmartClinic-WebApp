<<<<<<< HEAD
# SmartClinic Enterprise Upgrade

SmartClinic Enterprise is an upgraded clinic management application with a professional React frontend, Laravel API blueprint, PostgreSQL/MySQL-ready database model and Python AI service.

## What changed

### Frontend Pro
- Modern responsive dashboard.
- Clean collapsible sidebar.
- Role-based workspaces: Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab, Patient.
- Pages: Patients, Medical Records, Doctors, Nurses, Appointments, Consultations, Prescriptions, Laboratory, Pharmacy, Billing, Reports, AI Assistant, Users and Audit.
- Search, filters, clean tables and edit actions.
- Modern modal forms, no manual patient IDs or doctor IDs.
- Print/PDF-ready prescription and invoice templates.
- Local persistence using `localStorage` for demo and Vercel deployment.

### Backend Real API Blueprint
Folder: `backend_laravel_blueprint`
- Laravel Sanctum/JWT-style login contract.
- REST routes for patients and core clinic entities.
- Migration blueprint for patients, doctors, appointments, consultations, prescriptions, invoices and pharmacy.
- AI proxy controller for Python AI service.

### Business features
- Patient management.
- Medical records and medical history.
- Appointment scheduling with doctor/patient name selection.
- Consultation workflow.
- Prescriptions with print/PDF.
- Invoices and payments.
- Laboratory requests and results.
- Pharmacy stock and low stock alerts.
- Statistics and audit log.

### Medical AI
Folder: `ai_service`
- Flask API with `/chat` and `/symptoms` endpoints.
- Safe answers limited to clinical orientation and clinic workflow.
- Clear warning: AI is not a final diagnosis.

## Run frontend locally

```bash
cd frontend
npm install
npm run dev
```

Open: `http://127.0.0.1:5173`

## Build for Vercel

Vercel settings:

- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

## Demo accounts

All accounts use password: `password`

- `admin@smartclinic.test`
- `doctor@smartclinic.test`
- `nurse@smartclinic.test`
- `reception@smartclinic.test`
- `pharmacy@smartclinic.test`
- `lab@smartclinic.test`
- `patient@smartclinic.test`

## Important production note

This is an academic/prototype upgrade. Before real clinic production use, the application needs legal compliance, secure hosting, encrypted storage, audit trails, professional medical validation, and data protection review.
=======
# 🧠 SmartClinic — Intelligent Medical Management System

<p align="center">
  <a href="https://smart-clinic-web-app.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel" />
  </a>
</p>

---

## 🚀 Overview

SmartClinic est une application web intelligente dédiée à la gestion des cabinets médicaux.  
Elle permet de centraliser les données patients, les consultations et d’intégrer une logique d’aide médicale.

---

## 🌐 Live Application

👉 https://smart-clinic-web-app.vercel.app/

---

## ✨ Key Features

- 👨‍⚕️ Gestion des patients
- 📅 Rendez-vous & planning
- 📋 Consultations médicales
- 🧾 Ordonnances
- 📊 Dashboard & statistiques
- 🤖 Assistant IA (prototype)

---

## 📸 Preview
### 🔐 Connexion
![login](assets/screenshots/login.png)
### 📊 Tableau de bord
![Dashboard](assets/screenshots/tableau-de-bord.png)
### 👤 Gestion des utilisateurs
![users](assets/screenshots/users.png)
### 🧑‍🤝‍🧑 Gestion des patients
![Patients](assets/screenshots/patients.png)
### 👨‍⚕️ Gestion des médecins
![doctors](assets/screenshots/doctors.png)
### 🤖 Assistant IA
![ai](assets/screenshots/ai.png)
### 📈 Rapports & Statistiques
![reports](assets/screenshots/reports.png)

---

## 🧱 Architecture

- Frontend : React + Vite
- Backend : Laravel API
- IA : Python (logique médicale)
- Database : PostgreSQL

---

## 🎯 Objective

Ce projet vise à reproduire une solution complète utilisée dans les environnements médicaux modernes.

---

## 🔒 Source Code

Le code source est privé.  
Disponible sur demande pour évaluation technique.

---
>>>>>>> 291de5c746f80e4fa7e94c3bbb7968583239a79e
