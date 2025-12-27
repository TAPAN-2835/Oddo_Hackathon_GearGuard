# GearGuard – Smart Maintenance Management System

🔗 **Live Demo:**
[https://oddo-hackathon-gear-guard.vercel.app/](https://oddo-hackathon-gear-guard.vercel.app/)

---

## Overview

**GearGuard** is a web-based Maintenance Management System designed to help organizations efficiently track equipment, manage maintenance workflows, and reduce operational downtime.

The project was built as a **hackathon MVP**, focusing on:

* Clean UI and UX
* Clear workflow visualization
* Practical business logic
* Fast execution and scalability potential

The application simulates a real-world maintenance tracking system similar to platforms like **Odoo Maintenance** or **ServiceNow**, but in a simplified and intuitive form.

---

## Problem Statement

Many organizations still rely on:

* Manual tracking of equipment
* Spreadsheets for maintenance logs
* Poor visibility into repair status
* No structured preventive maintenance system

This leads to:

* Equipment downtime
* Delayed repairs
* Poor accountability
* Inefficient maintenance operations

---

## Solution

GearGuard provides a centralized system to manage:

* Equipment inventory
* Maintenance teams
* Repair and service requests
* Preventive maintenance schedules

The system connects all these elements through a **visual workflow**, allowing users to easily track what is broken, who is responsible, and what stage the work is in.

---

## Key Features

### 1. Equipment Management

* View all equipment in one place
* Each equipment has:

  * Name
  * Category
  * Location
  * Status
  * Assigned maintenance team
* Direct access to related maintenance requests

---

### 2. Maintenance Requests

Supports two types of maintenance:

#### Corrective Maintenance

* For unexpected breakdowns
* Created when an issue occurs

#### Preventive Maintenance

* Scheduled in advance
* Displayed in calendar view

Each request includes:

* Subject
* Equipment reference
* Auto-assigned team
* Status tracking
* Scheduled date
* Work duration

---

### 3. Kanban Board (Core Feature)

The Kanban board is the heart of the application.

#### Workflow Columns:

* New
* In Progress
* Repaired
* Scrap

#### Features:

* Drag-and-drop movement
* Visual status indication
* Smooth UI transitions
* Clear lifecycle of each request
* Scrap state disables equipment usage

This provides a **real-world maintenance workflow visualization**.

---

### 4. Preventive Maintenance Calendar

* Monthly calendar view
* Displays scheduled maintenance tasks
* Click on a date to plan maintenance
* Helps prevent missed servicing

This feature adds strong real-world value and planning capability.

---

### 5. Smart Logic & Automation

* Equipment automatically assigns its maintenance team
* Status updates based on Kanban movement
* Scrap status disables equipment
* Visual indicators for task state
* Request counts shown per equipment

These automations make the system feel intelligent and production-ready.

---

## Tech Stack

### Frontend

* **React.js**
* **Tailwind CSS**
* **JavaScript (ES6)**
* **Drag & Drop library**
* Component-based architecture

### Backend

* **Supabase**

  * PostgreSQL database
  * REST APIs
  * Authentication support (optional)

### Deployment

* **Vercel** (Frontend)
* **Supabase** (Backend & Database)

---

---

## Why This Project Stands Out

* Real-world problem statement
* Clean and understandable UI
* Workflow-based design
* Enterprise-style interface
* Visual Kanban system
* Preventive maintenance support
* Easy to extend into a full product

---

## Future Enhancements

* Role-based access (Admin / Technician)
* Analytics dashboard
* Maintenance cost tracking
* Notification system
* IoT integration for live equipment data
* AI-based maintenance prediction

---

## Conclusion

GearGuard demonstrates how a well-structured UI combined with smart workflows can significantly improve maintenance management.

The project focuses on:

* Practical usability
* Clean design
* Logical flow
* Hackathon-ready execution

It is designed to be both **demo-friendly** and **scalable for real-world use**.


Just tell me what you want next.
