# Payment Gateway Service

A robust and scalable payment aggregation service built with **Bun**, **Express**, and **TypeScript**. This service provides a unified interface for merchants to process payments, featuring a modular provider pattern currently integrated with **GlobalPay**.

## 🚀 Features

- **High Performance:** Powered by [Bun](https://bun.sh/), a fast JavaScript runtime.
- **Modular Provider Pattern:** Interface-based architecture (`IGatewayProvider`) allowing easy addition of new payment gateways.
- **Merchant Authentication:** Secure middleware ensures only authorized merchants can initiate transactions.
- **Automated Webhooks:** 
    -   Verifies signatures from upstream gateways (e.g., GlobalPay).
    -   Updates local transaction status.
    -   **Merchant Notification:** Automatically sends a POST request to the merchant's registered `callback_url` upon transaction completion.
- **Admin Dashboard:** Basic UI for gateway configuration and debugging.
- **Proxy Support:** Built-in configuration for gateways requiring upstream proxies.

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
├── constants/      # Static constants (PaymentGateway, PaymentStatus enums)
├── controllers/    # Request handlers for Admin, Payment, and Webhooks
├── middlewares/    # Express middlewares (Auth)
├── models/         # Mongoose schemas (Merchant, GatewayConfig, Transaction)
├── routers/        # API route definitions
├── services/       # Core Business Logic
│   ├── providers/  # Gateway implementations (GlobalPayProvider)
│   ├── payment.service.ts # Payment creation orchestration
│   └── webhook.service.ts # Async notification handling
└── utils/          # Utility functions
```

## ⚙️ Configuration

1.  **Environment Variables:**
    Create a `.env` file in the root directory.

    ```env
    PORT=3000
    MONGO_URI="mongodb://localhost:27017/payment_aggregator"
    ```

2.  **Database Connection:**
    Ensure your MongoDB instance is running and accessible at the `MONGO_URI`.

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

3.  **Seed the Database:**
    Populate initial data (merchants, gateway configs):
    ```bash
    bun run seed
    ```

## 🏃‍♂️ Running the Application

-   **Development Mode (hot reload):**
    ```bash
    bun run dev
    ```

-   **Production Build:**
    ```bash
    bun start
    ```

## 🔌 API Endpoints

### Merchant Payment API (`/api/merchant/payment`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/create` | Initiate a payment. Generates a unique `trade_id`. Returns the upstream `payment_url`. | Yes |
| `GET` | `/status` | Check status using `trade_id` or `merchant_transaction_id`. | Yes |

**Note:** The service currently defaults to `http://localhost:3000/webhook/payment/globalpay` as the upstream callback URL. Ensure this is reachable by the gateway or updated in `src/services/payment.service.ts` for production.

### Webhooks (`/webhook`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/payment/:gateway_name` | Receives updates from gateways. Verifies signatures and updates transaction status. |

### Admin Dashboard (`/admin`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/gateway/switch` | UI to view and switch active gateways. |
| `POST` | `/debug/globalpay/sign` | Utility to debug GlobalPay MD5 signatures. |

## 🛡️ Payment Providers

### GlobalPay
-   **Implementation:** `src/services/providers/globalpay.provider.ts`
-   **Security:** Validates MD5 signatures on all incoming webhooks.
-   **Mapping:** Maps `payment_cl_id` from the gateway to the local `merchant_transaction_id`.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.
