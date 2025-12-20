# Payment Gateway Service

A robust and scalable payment aggregation service built with **Bun**, **Express**, and **TypeScript**. This service provides a unified interface for merchants to process payments, currently featuring integration with **GlobalPay**.

## 🚀 Features

- **High Performance:** Powered by [Bun](https://bun.sh/), a fast JavaScript runtime.
- **Modular Architecture:** Designed with scalability in mind using the Provider pattern for easy addition of new payment gateways.
- **MongoDB Integration:** Uses Mongoose for strongly-typed database interactions.
- **Proxy Support:** Built-in support for proxy configurations (useful for specific gateway requirements).
- **Admin Interface:** Basic EJS-based admin dashboard for configuration management.

## 🛠 Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Templating:** [EJS](https://ejs.co/) (for Admin views)

## 📂 Project Structure

```bash
src/
├── config/         # Database and app configuration
├── constants/      # Static constants (e.g., Payment Gateway enums)
├── controllers/    # Request handlers for Admin, Payment, and Webhooks
├── middlewares/    # Express middlewares (e.g., Auth)
├── models/         # Mongoose schemas (Merchant, GatewayConfig, Transaction)
├── routers/        # API route definitions
├── services/       # Business logic and Gateway Providers (GlobalPay)
└── utils/          # Utility functions
```

## ⚙️ Configuration

1.  **Environment Variables:**
    Create a `.env` file in the root directory. You can reference `.env.example` (if available) or use the following template:

    ```env
    PORT=3000
    MONGO_URI="mongodb://localhost:27017/payment_aggregator"
    ```

2.  **Database Connection:**
    Ensure your MongoDB instance is running and accessible at the `MONGO_URI` specified.

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Seed the Database (Optional):**
    To populate the database with initial data (like default merchants or configs):
    ```bash
    bun run seed
    ```

## 🏃‍♂️ Running the Application

-   **Development Mode (with hot reload):**
    ```bash
    bun run dev
    ```

-   **Production Build:**
    ```bash
    bun start
    ```

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/merchant/payment` | Initiate a payment request |
| `POST` | `/webhook` | Handle async payment notifications |
| `GET` | `/admin` | Access the Admin Dashboard |
| `GET` | `/health-check` | Service health status |

## 🛡️ Payment Providers

Currently, the service supports the following providers:

-   **GlobalPay:**
    -   Implements MD5 signature generation and verification.
    -   Supports upstream proxy tunneling.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
