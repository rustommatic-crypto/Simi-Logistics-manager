
# AreaLine Neural Bridge: Live WhatsApp API Requirements

This document specifies the technical requirements for integrating the **AreaLine Neural Interface** with the **Meta WhatsApp Business Platform (Cloud API)**. 

## 1. Meta Developer Portal Setup
The integration requires a Meta App configured for WhatsApp.
- **App Type**: Business
- **Product**: WhatsApp
- **API Version**: Latest (v21.0 or higher)
- **Business Manager**: Must be linked to a verified Meta Business Account.

## 2. Webhook Configuration (The Neural Link)
Our frontend application expects messages to be pushed to a specific listener. The developer must configure the following in the Meta Developer Portal:

- **Webhook URL**: `https://api.arealine.com/v1/webhook/wa/[PILOT_ID]`
- **Verification Token**: [Define a unique string for the handshake]
- **Fields to Subscribe**:
  - `messages` (Essential for intercepting incoming orders)
  - `message_deliveries` (Optional for status tracking)

## 3. Authentication
To maintain a persistent connection without session timeouts:
- **Permanent Access Token**: Generate a System User Access Token in the Meta Business Manager with `whatsapp_business_messaging` and `whatsapp_business_management` permissions.
- **WABA ID**: Provide the WhatsApp Business Account ID.
- **Phone Number ID**: Provide the unique ID for the specific number being used.

## 4. Expected Data Payload (JSON)
The AreaLine Neural Engine (Simi) expects the incoming JSON to follow the standard Meta Cloud API schema. Example:

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WABA_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": { "display_phone_number": "...", "phone_number_id": "..." },
        "contacts": [{ "profile": { "name": "Customer Name" }, "wa_id": "2348030000000" }],
        "messages": [{
          "from": "2348030000000",
          "id": "...",
          "timestamp": "...",
          "text": { "body": "Maryland to VI sharp sharp, 4 people, 5k" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```
