

---

# Multi-Role Supply Chain Management of Fresh Flowers

A full-stack web application for a multi-role e-commerce platform focused on the supply chain management of fresh flowers. The platform supports **Admin**, **Supplier**, **Seller**,**Customer** and **Grower**  roles, providing role-based dashboards, analytics, order management, inventory tracking, and real-time updates.



---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Learn more](#Learn-More)
- [UserRole Login Credintionals ](#user-login-credintionals)
- [Special Notes](#Special-notes)

---

## Features

- **Secure Authentication**: JWT-based login with role-based access control using `jwt-decode`.
- **Role-Based Dashboards**: Custom interfaces for Admin, Supplier, Seller, Customer and Grower.
- **Order Management**: View, filter, update, and track orders with real-time updates via `socket.io`.
- **Inventory Management**: Add, edit, and delete flower products with image uploads using Multer.
- **Analytics & Reports**: Interactive charts for revenue, orders, and user metrics using `chart.js` and `recharts`.
- **Payment Integration**: Secure transactions via Stripe.
- **Real-Time Notifications**: Live updates for orders and system events.
- **Responsive UI**: Mobile-friendly design with React, Material-UI, and SCSS.
- **Persistent Login**: Seamless user experience with `redux-persist` and LocalStorage.
- **Geolocation Support**: Location-based features for supply chain tracking using `@react-google-maps/api`.

---

## Tech Stack

### Frontend
- **React** (`react`, `react-dom`): Dynamic UI components
- **Redux Toolkit** (`@reduxjs/toolkit`, `react-redux`): State management
- **Chart.js** (`chart.js`, `react-chartjs-2`): Data visualization
- **Recharts**: Advanced charting for analytics
- **Axios**: HTTP requests
- **Material-UI** (`@mui/material`, `@mui/icons-material`): UI components and icons
- **SCSS** (`sass`): Styling
- **React Router** (`react-router-dom`): Client-side routing
- **Socket.io Client** (`socket.io-client`): Real-time communication
- **React Icons** (`react-icons`): Icon library
- **Redux Persist** (`redux-persist`): Persistent state storage
- **JWT Decode** (`jwt-decode`): Token parsing
- **Google Maps API** (`@react-google-maps/api`): Location-based features
- **UUID** (`uuid`): Unique identifier generation

### Backend
- **Node.js & Express**: Server framework
- **MongoDB** (with Mongoose): Database with schema modeling
- **JWT** (`jsonwebtoken`): Authentication
- **Multer & Multer-GridFS**: File uploads
- **Socket.io**: Real-time communication
- **Stripe**: Payment processing
- **Nodemailer**: Email notifications
- **Bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **WS**: WebSocket support
- **UUID**: Unique identifier generation
- **Dotenv**: Environment variable management

### Development Tools
- **React Scripts**: Build and development tools
- **Jest** (`@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`): Testing framework
- **ESLint**: Code linting
- **Web Vitals** (`web-vitals`): Performance monitoring

---

## Project Structure

```
Final-Project/
├── client/                     # React frontend
│   ├── public/                 # Static assets (index.html, favicon)
│   ├── src/                    # Source files
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── redux/              # Redux store and slices
│   │   ├── styles/             # SCSS styles
│   │   └── assets/             # Images, fonts, etc.
│   ├── package.json            # Frontend dependencies
│   └── package-lock.json       # Dependency lock file
├── server/                     # Node.js backend
│   ├── models/                 # Mongoose schemas (e.g., User, Order)
│   ├── routes/                 # API routes (e.g., /api/users)
│   ├── middleware/             # Custom middleware (e.g., auth)
│   ├── uploads/                # Storage for uploaded images
│   ├── index.js                # Server entry point
│   ├── package.json            # Backend dependencies
│   └── package-lock.json       # Dependency lock file
├── .env                        # Environment variables (not tracked)
├── .uploads                 # Git ignore file
├── README.md                   # Project documentation
└── package.json                # Root project metadata
└──package-lock.json
└──.gitignore  
└──.gitattributes
└──socketHandler.js

---

## Getting Started

### Prerequisites

- **Node.js**: v16 or higher ([download](https://nodejs.org/))
- **npm**: v8 or higher (included with Node.js)
- **MongoDB**: Local instance or cloud (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**: For cloning the repository ([download](https://git-scm.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HDRanasingha/Final-Project.git
   cd Final-Project

   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```
   This will install the following backend dependencies:
   - `express`
   - `mongoose`
   - `cors`
   - `dotenv`
   - `multer`
   - `multer-gridfs`
   - `jsonwebtoken`
   - `bcryptjs`
   - `nodemailer`
   - `socket.io`
   - `stripe`
   - `uuid`
   - `ws`
   Or, you can install them individually with:
   ```bash
   npm install express mongoose cors dotenv multer multer-gridfs jsonwebtoken bcryptjs nodemailer socket.io stripe uuid ws
   ```

3. **Install client dependencies**:
   ```bash
   cd ../client
   npm install
   ```
   This will install the following frontend dependencies:
   - `react`
   - `react-dom`
   - `react-router-dom`
   - `@reduxjs/toolkit`
   - `react-redux`
   - `redux-persist`
   - `axios`
   - `chart.js`
   - `react-chartjs-2`
   - `recharts`
   - `sass`
   - `socket.io-client`
   - `uuid`
   - `@mui/material`
   - `@mui/icons-material`
   - `@emotion/react`
   - `@emotion/styled`
   - `react-icons`
   - `jwt-decode`
   - `@react-google-maps/api`
   - `@testing-library/jest-dom`
   - `@testing-library/react`
   - `@testing-library/user-event`
   - `web-vitals`

   OR 

   npm install react react-dom react-router-dom @reduxjs/toolkit react-redux redux-persist axios chart.js react-chartjs-2 recharts sass socket.io-client uuid @mui/material @mui/icons-material @emotion/react @emotion/styled react-icons jwt-decode @react-google-maps/api @testing-library/jest-dom @testing-library/react @testing-library/user-event web-vitals

4. **Set up environment variables**:
   Create a `.env` file in the `server/` directory with the following:
   ```
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_app_password
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   PORT=3001
   ```
   Replace placeholders with your credentials. Ensure `.env` is added to `.gitignore` to prevent committing sensitive data.

### Running the Application

1. **Start the backend server**:
   ```bash
   cd server
   npm run dev
   ```
   The server runs on `http://localhost:3001` (or the `PORT` specified in `.env`).

2. **Start the frontend development server**:
   ```bash
   cd ../client
   npm start
   ```
   The React app runs on `http://localhost:3000`.

3. **Access the application**:
   Open `http://localhost:3000` in your browser.

---

## Available Scripts

### Client (React)
- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `build/` folder.
- `npm test`: Launches the test runner.
- `npm run eject`: Ejects from `react-scripts` (one-way operation).

### Server (Node.js)
- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server with Nodemon for auto-reloading.

---

## Environment Variables

The backend requires the following environment variables in `server/.env`:

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `MONGO_URL`           | MongoDB connection string (e.g., MongoDB Atlas)  |
| `JWT_SECRET`          | Secret key for JWT authentication                |
| `STRIPE_SECRET_KEY`   | Stripe API secret key for payments               |
| `EMAIL_USER`          | Email address for sending notifications          |
| `EMAIL_PASS`          | App-specific password for email service          |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key for location features        |
| `PORT`                | Port for the backend server (default: 3001)      |

Ensure these are set to avoid runtime errors.

---

## API Endpoints

The backend exposes RESTful API endpoints for core functionalities:

- **Authentication**: `/api/auth` (e.g., login, logout)
- **User Management**: `/api/users` (e.g., register, update profile)
- **Order Management**: `/api/orders` (e.g., create, update, fetch orders)
- **Item Management**: `/api/items` (e.g., add, edit, delete products)


Refer to the `server/routes/` directory or use [Postman](https://www.postman.com/) for detailed endpoint documentation.

---



## Learn More

- **React**: [reactjs.org](https://reactjs.org/)
- **Redux Toolkit**: [redux-toolkit.js.org](https://redux-toolkit.js.org/)
- **Node.js**: [nodejs.org](https://nodejs.org/)
- **MongoDB**: [mongodb.com/docs](https://www.mongodb.com/docs/)
- **Express**: [expressjs.com](https://expressjs.com/)
- **Socket.io**: [socket.io](https://socket.io/)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs/)
- **Material-UI**: [mui.com](https://mui.com/)
- **Chart.js**: [chartjs.org](https://www.chartjs.org/)
- **Recharts**: [recharts.org](https://recharts.org/)
- **Google Maps API**: [developers.google.com/maps](https://developers.google.com/maps)


---

## User Login Credintionals

1.Admin
Email:hasinidilhara2001@gmail.com
Password:2001

2.Grower
Email:growers@gmail.com
Password:2001

3.Seller
Email:seller@gmail.com
Password:2001

4.Supplier
Email:supplier@gmail.com
Password:2001

5.Customers
They can do all activities without login.

## Special Notes

- Use this email and password to access the admin.
       Email:hasinidilhara2001@gmail.com
       Password:2001

- If Stripe has stopped working, use a new Stripe secret key. Since they are free, they may expire.

- If the chatbot is no longer working, enter a new GEMINI API KEY for env and its new GEMINI API URL for chatbot.js, as they are free and may expire.

- If you have difficulty sending an email for low stock, please enter the email and the app password that is associated with it. The reason is that if the email contained in it changes the password associated with it, the app password will not be valid. An email cannot be sent then.

- use test card for stripe card payment
example:
card number: visa card number 4242 4242 4242 4242
you can add any date and cvc

