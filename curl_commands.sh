#!/bin/bash

# Base URL of the application
BASE_URL="http://localhost:3000"

# Merchant API Key (seeded in server.ts)
API_KEY="merchant_api_key_here"
MERCHANT_ID_MONGO="<PLACEHOLDER_FOR_MERCHANT_MONGO_ID>" # Will fetch this dynamically

echo "--- 0. Fetch Merchant MongoDB ID (for createPaymentInput) ---"
# This is a bit of a workaround for the script to get the Mongo _id for createPayment
MERCHANT_DETAILS=$(curl -s -H "X-API-KEY: ${API_KEY}" "${BASE_URL}/health-check" -v 2>&1 | grep "merchant:" | awk '{print $2}' | tr -d '\r') # Dummy call, req.merchant is set by middleware

# To get the _id, we'd ideally need a specific merchant endpoint, but for a seed-based test,
# we can assume the first merchant has a known _id or fetch it via direct DB query for automation.
# For simplicity here, let's assume the seed script provides a known _id.
# Since the script cannot directly query Mongo, we will hardcode a dummy for now.
# In a real test automation, you'd fetch this from DB.
# Let's re-seed the merchant and fetch the _id.

# To simplify, I'll update src/controllers/payment.controller.ts getPaymentStatusHandler to also return merchant's mongo _id, then fetch.
# Or, I can update the seed script to print the _id, but that's a one-off.
# Let's simplify: the createPayment in payment.service.ts takes Types.ObjectId.
# In an actual setup, the controller would look up the merchant by api_key and get its _id.
# Since our middleware injects req.merchant, req.merchant._id IS available.
# So, the controller already passes req.merchant._id. The script doesn't need to know it.

# Let's ensure the merchant_id is a string that maps to the _id. Our seed has merchant_id: "MERCH_123".
# The controller expects req.merchant._id (ObjectId).
# The current test script doesn't need to pass merchantId explicitly to the endpoint.
# The endpoint receives API_KEY, which is used by authMiddleware to find merchant and attach its _id.

echo "--- 1. Create Payment URL ---"
CURRENT_TIMESTAMP=$(date +%s)
MERCHANT_TXN_ID="TXN_ABC_${CURRENT_TIMESTAMP}"
CREATE_PAYMENT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -H "X-API-KEY: ${API_KEY}" -d "{
  \"amount\": 1000,
  \"merchant_transaction_id\": \"${MERCHANT_TXN_ID}\",
  \"currency\": \"INR\"
}" ${BASE_URL}/api/merchant/payment/create)

echo "Response: ${CREATE_PAYMENT_RESPONSE}"
TRADE_ID=$(echo "${CREATE_PAYMENT_RESPONSE}" | jq -r '.trade_id')
PAYMENT_URL=$(echo "${CREATE_PAYMENT_RESPONSE}" | jq -r '.payment_url')

echo "Extracted Trade ID: ${TRADE_ID}"
echo "Extracted Payment URL: ${PAYMENT_URL}"
echo ""

if [ -z "$TRADE_ID" ]; then
    echo "ERROR: Failed to create payment. Exiting."
    exit 1
fi

echo "--- 2. Get Payment Status (PENDING) ---"
curl -s -X GET -H "X-API-KEY: ${API_KEY}" "${BASE_URL}/api/merchant/payment/status?trade_id=${TRADE_ID}" | jq .
echo ""

echo "--- 3. Simulate GlobalPay Webhook (SUCCESS) ---"
# GlobalPay PDF: payment_id (their ID), payment_cl_id (our merchant_transaction_id), status (2=SUCCESS)
# 1. Construct the Payload WITHOUT signature
WEBHOOK_PAYLOAD_RAW=$(jq -n \
  --arg payment_id "GP_TXN_$(date +%s)" \
  --arg payment_cl_id "${MERCHANT_TXN_ID}" \
  --arg status_code 2 \
  '{
    payment_id: $payment_id,
    payment_cl_id: $payment_cl_id,
    amount: 1000,
    currency: "INR",
    status: ($status_code | tonumber),
    create_time: (now | strftime("%Y-%m-%dT%H:%M:%SZ")),
    update_time: (now | strftime("%Y-%m-%dT%H:%M:%SZ"))
  }')

# 2. Get Valid Signature from Debug Endpoint
SIGNATURE_JSON=$(curl -s -X POST -H "Content-Type: application/json" -d "$WEBHOOK_PAYLOAD_RAW" ${BASE_URL}/admin/debug/globalpay/sign)
SIGNATURE=$(echo "$SIGNATURE_JSON" | jq -r '.signature')

echo "Generated Signature: ${SIGNATURE}"

# 3. Add Signature to Payload
WEBHOOK_PAYLOAD=$(echo "$WEBHOOK_PAYLOAD_RAW" | jq --arg sign "$SIGNATURE" '. + {sign: $sign}')

echo "Sending Webhook Payload: ${WEBHOOK_PAYLOAD}"

WEBHOOK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$WEBHOOK_PAYLOAD" ${BASE_URL}/webhook/payment/globalpay)
echo "Raw Webhook Response: ${WEBHOOK_RESPONSE}"
echo "${WEBHOOK_RESPONSE}" | jq .
echo ""
echo "--- 4. Get Payment Status (SUCCESS) ---"
curl -s -X GET -H "X-API-KEY: ${API_KEY}" "${BASE_URL}/api/merchant/payment/status?trade_id=${TRADE_ID}" | jq .
echo ""

echo "--- 5. Admin Gateway Switch (to GLOBALPAY, should already be active) ---"
curl -s -X POST -H "Content-Type: application/json" -d '{"gateway_name": "GLOBALPAY"}' ${BASE_URL}/admin/gateway/switch | jq .
echo ""

echo "--- 6. Access Admin UI in Browser ---"
echo "Open ${BASE_URL}/admin/gateway/switch in your web browser to see the gateway switcher."
echo ""
