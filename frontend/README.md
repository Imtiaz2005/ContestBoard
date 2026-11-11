# 🏆 ContestBoard

**ContestBoard** is a unified platform to discover, participate, and manage hackathons, case competitions, and technical events in Bangladesh. It bridges the gap between students, organizers, and administrators through a seamless, role-based dashboard system.

---

## ✨ Key Features by Role

### 🎓 For Students
*   **Discover Contests:** Browse upcoming events with advanced filters (Category, Fee, Event Mode).
*   **Auto-Generated Portfolio:** Automatically generates a professional portfolio based on verified contest achievements and placements.
*   **Student Dashboard:** Track participation history, contest statistics, and upcoming events.
*   **Save & Register:** Bookmark favorite contests and register with a single click.

### 🏢 For Organizers (Clubs, Universities, Organizations)
*   **Contest Management:** Create, publish, and manage contests.
*   **Public Profile:** Dedicated organization profiles displaying past and upcoming contests.
*   **Result Publishing:** Officially verify and publish contest results (which directly updates student portfolios).

### 🛡️ For Administrators
*   **Platform Dashboard:** Monitor total users, active contests, and pending approvals.
*   **Contest Review:** Approve or reject contests submitted by organizers.
*   **User Management:** Suspend, activate, or permanently remove user accounts.
*   **Organization Control:** Block or unblock organizations from posting new contests.

---

## 📸 Screenshots

Here is a glimpse of the ContestBoard interface:

### 1. Discover Page (Home)
Browse all approved contests with dynamic banner images and filtering options.
![Discover Page](./screenshots/discover.png)
*(Replace `./screenshots/discover.png` with your actual image path)*

### 2. Contest Details
View detailed schedules, rules, prizes, and organizer information.
![Contest Details](./screenshots/contest-details.png)

### 3. Student Dashboard & Portfolio
Track progress and download auto-generated portfolios.
![Student Dashboard](./screenshots/student-dashboard.png)

### 4. Admin Dashboard
Complete control over users, organizations, and contest approvals.
![Admin Dashboard](./screenshots/admin-dashboard.png)

---

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), Tailwind CSS, React Router DOM
*   **Backend:** PHP (PDO), RESTful APIs
*   **Database:** MySQL
*   **Authentication:** Session-based Auth & Context API

---

## 🚀 How to Run the Project Locally

Follow these steps to set up the project on your local machine:

### 1. Database Setup
1. Install [XAMPP](https://www.apachefriends.org/index.html) or any local server.
2. Open phpMyAdmin and create a database named `contestboard_db`.
3. Import the provided `.sql` file into this database.

### 2. Backend Setup
1. Navigate to the `htdocs` folder in XAMPP (e.g., `C:\xampp\htdocs\`).
2. Create a folder named `ContestBoard` and paste the backend PHP files inside it.
3. Update your database credentials in `config/database.php` if necessary.

### 3. Frontend Setup
1. Open your terminal and navigate to the frontend directory.
2. Install the required dependencies:
   ```bash
   npm install