# Hospital Booking System Backend

The **Hospital Booking System Backend** is a **Node.js** application built with **Express**, **TypeScript**, and **Prisma**. It provides a robust API for hospital appointment management, user authentication, and notifications.

## Features
- **User Authentication**: JWT-based authentication
- **Database ORM**: Prisma with PostgreSQL support
- **File Uploads**: Cloudinary integration via Multer
- **Logging**: Winston & MongoDB logging
- **Email & SMS Notifications**: Nodemailer & Twilio
- **Security**: Bcrypt for password hashing
- **Error Handling**: Express-Async-Errors

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/hospital_booking_system.git
cd hospital_booking_system
yarn install  # or npm install
```

## ⚡ Usage

### Development
```bash
yarn dev  # or npm run dev
```
Runs the development server with **Nodemon** and **TS-Node**.

### Build & Production
```bash
yarn build  # or npm run build
yarn start  # or npm run start
```
Compiles TypeScript and runs the production server.

### Linting
```bash
yarn lint  # or npm run lint
```
Runs ESLint for code quality checks.

## 📜 Environment Variables
Create a `.env` file in the root directory and configure the following:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
EMAIL_HOST=your_email_host
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

## 🎨 Tech Stack
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT & Bcrypt
- **Storage**: Cloudinary
- **Logging**: Winston & MongoDB
- **Notifications**: Twilio & Nodemailer

## 📜 License
This project is licensed under the [ISC License](LICENSE).

## 🙌 Contributing
Pull requests are welcome! Please open an issue first to discuss any changes.

---
Developed with ❤️ by Mathias Kabango.

