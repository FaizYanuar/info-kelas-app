# Info Kelas App

[![Visit Website](https://img.shields.io/badge/Website-Visit%20App-black?style=flat-square&logo=vercel)](https://info-kelas.vercel.app)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## 📄 Description

**Info Kelas App** is a modern academic management application designed to help students track class schedules and information efficiently. Built as a Progressive Web App (PWA), it offers offline capabilities and a native-like mobile experience.

## ✨ Features

### 🤖 AI Study Assistant
* **Smart Chatbot:** Built-in chat interface (`/chatpage`) to answer student queries.
* **Academic Support:** (Likely) Provides instant answers about schedules, deadlines, or general study topics.

### 📅 Advanced Scheduling
* **Weekly Schedule:** Interactive view of all weekly classes.
* **Replacement Classes:** Handles "Kelas Pengganti" (Make-up classes) with the `additional_schedules` system.
* **Session Logs:** Tracks history of past classes, including attendance and notes.

### 📝 Academic Tracker
* **Assignment Management:** Track homework, quizzes, and projects with deadlines and submission links.
* **Lecturer Directory:** Database of lecturers with profiles and contact details.
* **Semester Management:** Organize data by active semesters.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **AI Model:** [Google Gemini API](https://ai.google.dev/)
* **Styling:** Tailwind CSS
* **PWA:** next-pwa
* **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### ⚙️ Environment Setup

1. Create a `.env.local` file in the root directory.
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GOOGLE_API_KEY=your_gemini_api_key_here
```
### 🗄️ Database Setup

To run this project, go to the **SQL Editor** in your Supabase Dashboard and run the following query to create the required tables:

```sql
CREATE TABLE additional_schedules (id bigint NOT NULL, note text, status text, time_text text NOT NULL, room text NOT NULL, subject_id bigint, date date NOT NULL, sort_index integer);

CREATE TABLE assignments (submission_link text, id bigint NOT NULL, subject_id bigint, deadline timestamp with time zone NOT NULL, attachments jsonb, created_at timestamp with time zone, status text, title text NOT NULL, description text);

CREATE TABLE lecturers (id bigint NOT NULL, avatar_url text, name text NOT NULL);

CREATE TABLE push_subscriptions (endpoint text NOT NULL, id bigint NOT NULL, created_at timestamp with time zone, keys jsonb NOT NULL);

CREATE TABLE semesters (is_active boolean, id bigint NOT NULL, name text NOT NULL, created_at timestamp with time zone);

CREATE TABLE session_logs (id bigint NOT NULL, weekly_schedule_id bigint, status text, room_override text, date date NOT NULL, time_text_override text, note text);

CREATE TABLE subjects (lecturer_id bigint, name text NOT NULL, id bigint NOT NULL);

CREATE TABLE weekly_schedules (sort_index integer NOT NULL, day_of_week integer NOT NULL, subject_id bigint, id bigint NOT NULL, room text NOT NULL, time_text text NOT NULL, semester_id bigint);
```

### 🤖 Google Gemini API

To enable the chatbot feature:
1.  Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.
2.  Paste the key into the `GOOGLE_API_KEY` variable in your `.env.local` file.
3.  The chatbot at `/chatpage` will now function automatically.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/FaizYanuar/info-kelas-app.git](https://github.com/FaizYanuar/info-kelas-app.git)
    cd info-kelas-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📱 PWA Testing

To test the PWA features (installability and offline mode) locally:

1.  Build the application:
    ```bash
    npm run build
    ```
2.  Start the production server:
    ```bash
    npm start
    ```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features or bug fixes.

## 👤 Author

**Faiz Yanuar**
* GitHub: [@FaizYanuar](https://github.com/FaizYanuar)

## 📝 License

This project is licensed under the [MIT License](LICENSE).
