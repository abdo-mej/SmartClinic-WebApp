# Design corrections

- Patient and doctor IDs are never typed by users. Forms use searchable/selectable patient and doctor names.
- RBAC separates each workspace:
  - Admin: system/users/reports/config
  - Doctor: clinical records, consultations, prescriptions, lab requests
  - Nurse: vitals and nursing care, no prescribing
  - Secretary: appointments, registration, payments
  - Pharmacist: prescription dispensing and stock
  - Lab: lab requests and results
  - Patient: own appointments and prescriptions only

Modules were inspired by common clinic/HMS capabilities: appointment scheduling, EMR, billing, lab, pharmacy, prescriptions, inventory and role-based access.
