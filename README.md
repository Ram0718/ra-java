# Java Mastery – Online Java Learning & Coding Platform

A production-grade, enterprise educational learning and competitive coding ecosystem built specifically for engineering students and freshers preparing for Java developer roles.

---

## 1. System Architecture & Tech Stack

### Backend
- **Language / Runtime:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.5
- **Security:** Spring Security 6 with stateless JWT authentication
- **ORM & Data:** Spring Data JPA, Hibernate ORM
- **Database:** PostgreSQL (with dev profile H2 PostgreSQL mode)
- **Build System:** Apache Maven 3.9+
- **Payment Gateway:** Razorpay Java SDK 1.4.7 with HMAC-SHA256 verification
- **Code Execution:** Isolated worker subprocess sandbox / Judge0 API integration

### Frontend
- **Framework:** React 19 / TypeScript 5+
- **Build Tool:** Vite 8
- **Design System:** Uber-inspired Minimalist Black & White palette (`#000000`, `#FFFFFF`, `#F5F5F5`, `#222222`)
- **Styling:** Tailwind CSS 3.4
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **State Management:** Zustand
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios with JWT & session-invalidation interceptors

---

## 2. Core Architectural Highlights

### 1. Single Active Session Policy
To prevent account sharing and enforce one individual account per student:
- Every login creates an active record in `user_sessions`.
- When a new device or browser logs in, all prior active sessions for that `user_id` are automatically marked `is_active = false` and revoked.
- The `JwtAuthFilter` checks both token cryptographic validity and session active status. Revoked sessions receive HTTP 401 with `SESSION_TERMINATED_ON_ANOTHER_DEVICE`.
- The frontend Axios interceptor detects this status and displays the `SessionAlertModal` explaining the policy.

### 2. ₹99 Lifetime Course Access (Razorpay Gateway)
- **Backend Order Creation:** `POST /api/v1/payments/order`
- **Cryptographic Signature Verification:** `POST /api/v1/payments/verify` computes `HMAC_SHA256(order_id + "|" + payment_id, secret)`.
- **Zero Frontend Faking:** Course access (`course_access = true`) is only activated inside the database transaction when the computed HMAC matches the signature.
- **Idempotency:** Duplicate callbacks or repeated calls return the existing verified receipt.

### 3. Integrated Monaco Online Java Compiler
- **Sandbox Execution:** Untrusted student code is compiled and executed in a dedicated, isolated subprocess with strict memory limits (256MB) and execution timeouts (5s).
- **Automated Test Evaluation:**
  - Evaluates both public sample and hidden test cases.
  - Compares normalized standard output with expected output.
  - **Security Rule:** Hidden test-case inputs and outputs are never sent to the client; students only see passed/failed counts and execution metrics.
  - If all test cases pass: status is `ACCEPTED`, student coding accuracy and question progress are updated dynamically in the database.

### 4. Real-Time Dynamic Progress Engine
- Progress is never hardcoded.
- A topic is completed only when:
  1. Learning materials are read (`materialRead = true`).
  2. All 3 coding problems (Easy, Medium, Hard) are solved (`exercisesCompleted = true`).
  3. The topic assessment test is passed (`assessmentPassed = true`).
- Learning streaks are dynamically computed from consecutive calendar days in `student_activity`.

---

## 3. 12-Module Placement Roadmap & 3 Difficulty Levels

Every topic contains exactly three unique coding challenges (Easy, Medium, Hard):

| Module | Title | Easy Problem | Medium Problem | Hard Problem |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Java Fundamentals & JVM | Print Welcome Message | Celsius to Fahrenheit | Check Power of 2 (Bitwise) |
| **02** | Conditional Statements | Check Leap Year | Quadrant of Point | Valid Triangle Type |
| **03** | Loops & Iterations | Print Even Numbers to N | Sum of Digits | Armstrong Numbers in Range |
| **04** | While & Do-While | Count Digits | Reverse & Palindrome | Smallest Digit-Sum Number |
| **05** | Methods & Recursion | Greatest Common Divisor | N-th Fibonacci (Memoized) | Tower of Hanoi Counter |
| **06** | Arrays & Two-Pointers | Array Min & Max | Two Sum in Sorted Array | Maximum Subarray (Kadane) |
| **07** | Strings & String Pool | Valid Anagram Check | Longest Unique Substring | Longest Palindromic Substring |
| **08** | Object-Oriented Programming | Encapsulated Bank Account | Shape Area Interface | Design LRU Cache |
| **09** | Exception Handling | Safe Integer Division | Custom Age Validator | Try-With-Resources Leak Prevention |
| **10** | Collections Framework | Frequency Counter (HashMap) | Kth Largest (PriorityQueue) | Top K Frequent Words |
| **11** | Stream API & Lambdas | Filter & Square Evens | GroupingBy Length | Second Highest Salary Stream |
| **12** | Multithreading & JDBC | Multithreaded Printer | Atomic Counter Sim | Deadlock Cycle Detection |

---

## 4. All 17 Completed Application Pages

1. **Landing Page (`/`):** Hero roadmap, compiler preview, feature highlights, FAQs.
2. **Pricing Page (`/pricing`):** ₹99 lifetime access breakdown and feature matrix.
3. **Login Page (`/login`):** Google OAuth login, single-session explanation, and admin credentials tab.
4. **Checkout Page (`/checkout`):** Razorpay order summary, UPI, Card, NetBanking simulation.
5. **Payment Success Page (`/payment-success`):** Printable tax receipt with HMAC verification details.
6. **Student Dashboard (`/dashboard`):** Real-time calculated progress %, streak counter, recent activity, next topic target.
7. **Course Modules Catalog (`/modules`):** All 12 modules with progression percentages.
8. **Module Topics View (`/modules/:slug`):** Topic list with status tags (Not Started, In Progress, Completed).
9. **Topic Learning Notes (`/topics/:slug`):** Markdown reader, subtopics navigation, reading time tracker.
10. **Coding Practice (`/practice`):** 3-level question selector with solved indicators.
11. **Online Monaco Compiler (`/compiler`):** Split-view editor with custom input, execution time, memory usage, test-case runner, and editorial solution reveal.
12. **Submission Results (`/submissions`):** Test-case verdict cards.
13. **Progress Analytics (`/progress`):** Module-by-module breakdown bars.
14. **PDF Study Materials (`/materials`):** Download center for offline study notes.
15. **Interview Preparation (`/interview`):** Categorized Q&A + 5-question mock interview set.
16. **Topic Assessments (`/assessments`):** 15-minute countdown exam with scoring and explanations.
17. **Student Profile (`/profile`):** Account info, single-device session security status, transaction history.
18. **Admin Management Portal (`/admin`):** Student moderation, revenue analytics, and question publishing.

---

## 5. Getting Started & Running the Application

### Prerequisites
- Java 21 (Oracle JDK / OpenJDK)
- Apache Maven 3.9+
- Node.js 18+ and npm

### 1. Start the Backend Server
```bash
cd backend
mvn clean test-compile
mvn spring-boot:run
```
The Spring Boot server starts at `http://localhost:8080`.
- Automatic database migrations and curriculum seeding execute on startup.
- H2 Web Console is accessible at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/javamasterydb`).
- Default Admin Account: `admin@javamastery.com` / `Admin@JavaMastery2025!`

### 2. Start the Frontend Application
```bash
# In project root
npm install
npm run dev
```
The Vite development server starts at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
cd backend
mvn test
```
All unit and integration tests (Single-Session Concurrency, Payment HMAC Verification, Dynamic Progress Calculations) will execute and report results.

### 4. Build Frontend for Production
```bash
npm run build
```
Creates optimized production bundle in `dist/`.
