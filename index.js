require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const crypto = require("crypto");
const axios = require("axios");
const path = require("path");
const sha256 = require("sha256");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const PHONEPE_BASE_AUTH_URL = process.env.PHONEPE_BASE_AUTH_URL;
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL;
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const PHONEPE_CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION;

// ✅ Set Webhook Credentials (Same as in PhonePe Dashboard)
const AUTH_USER = process.env.WEBHOOK_USER_NAME; // Set this same as PhonePe Dashboard
const AUTH_PASS = process.env.WEBHOOK_USER_PWD; // Set this same as PhonePe Dashboard

const EMAIL_PASS = process.env.EMAIL_PASS; // Set this same as PhonePe Dashboard

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const WHATSAPP_TOKEN =
  "EAAWdZCqDWgIEBO2YcO2XpntBpDmlf9UZADdDdTfONNbbLKVfJAySiiemuabwptdtXCObddBZAi8PRM876mdySXfE3WR1WBurunHogHZBGYhtVoYHEVqkIcD6R7yLxkF17nCtm1ZCHZBRbXs11wD83ljIkyoFLLfbRNm8LZA7bcK1vTZBZAPTeejN2J0n8v5yHYUi9caBlN2fRxH98qrK1vZBvsNWnFqzZClnFZBeYFhgNqJz49MZD"; // Get this from Meta Developer Portal
const WHATSAPP_PHONE_NUMBER_ID = "576866705515779"; // From Meta WhatsApp Settings
const RECIPIENT_PHONE_NUMBER = "+919074594237"; // Format: "+919876543210"

const sendWhatsAppMessage = async (orderId, customerPhone) => {
  try {
    const messageData = {
      messaging_product: "whatsapp",
      to: customerPhone,
      type: "template",
      template: {
        name: "order_confirmation", // Pre-approved template name from Meta
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: orderId }],
          },
        ],
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📲 WhatsApp Message Sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Error Sending WhatsApp Message:",
      error.response?.data || error.message
    );
  }
};
// ✅ Function to Send Email to Customer
const sendOrderEmail = async (name, customerEmail, orderId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP settings
      auth: {
        user: "illolam.anjana@gmail.com", // Change to your email
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "illolam.anjana@gmail.com",
      to: customerEmail,
      bcc: ["rcp.rahul@gmail.com", "ammujgd@gmail.com"],
      replyTo: "illolam.anjana@gmail.com",
      subject: "Order Confirmation - Illolam",
      text: `Hi ${name},\n\nThank you for your purchase!\nYour order (${orderId}) has been successfully placed.\nWe will notify you once it is shipped.\n\nThank you for shopping with Illolam Jewels!`,
      html: `
        <p>Hi <strong>${name}</strong>,</p>
        <h2>Thank you for your purchase!</h2>
        <p>Your order has been successfully placed.</p>
        <p><strong>Order Number:</strong> ${orderId}</p>
        <p>We will notify you once your order is shipped.</p>
        <p>Thank you for shopping with Illolam!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${customerEmail} for order ${orderId}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// ❌ Function to Send Failed Order Email
const sendFailedOrderEmail = async (name, customerEmail, orderId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "illolam.anjana@gmail.com",
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "illolam.anjana@gmail.com",
      to: customerEmail,
      bcc: ["rcp.rahul@gmail.com", "ammujgd@gmail.com"],
      replyTo: "illolam.anjana@gmail.com",
      subject: "Payment Failed - Illolam",
      text: `Hi ${name},\n\nOops! Something went wrong with your order (Order ID: ${orderId}).\nPlease try again or contact us for help.\n\nThank you for choosing Illolam!`,
      html: `
        <p>Hi <strong>${name}</strong>,</p>
        <h2>Oops! Something went wrong with your order.</h2>
        <p>Unfortunately, your payment attempt has failed.</p>
        <p><strong>Order Number:</strong> ${orderId}</p>
        <p>Please try again or contact us if you need help.</p>
        <p>Thank you for choosing Illolam!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `📧 Failure email sent to ${customerEmail} for order ${orderId}`
    );
  } catch (error) {
    console.error("❌ Failed order email sending failed:", error);
  }
};

// ==================================
// 🚀 PhonePe Payment AUTH TOKEN
// ==================================
app.post("/api/phonepe/fetch-auth-token", async (req, res) => {
  try {
    // Prepare the payload with the required parameters.
    const payload = {
      client_id: PHONEPE_CLIENT_ID,
      // Use "1" for UAT. For PROD, ensure PHONEPE_CLIENT_VERSION contains the correct value.
      client_version: "1",
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: "client_credentials",
    };

    // Set up axios options for the POST request.
    const options = {
      method: "post",
      url: `${PHONEPE_BASE_AUTH_URL}/v1/oauth/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      data: payload,
    };

    // Call the PhonePe API to fetch the auth token.
    const response = await axios.request(options);
    console.log("Auth token response:", response.data);

    // Return the auth token and expiry info to the caller.
    res.json(response.data);
  } catch (error) {
    console.error(
      "PhonePe Auth Token Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Auth token fetch failed" });
  }
});
// ==================================
// 🚀 PhonePe Payment API Integration
// ==================================
app.post("/api/phonepe/initiate-payment", async (req, res) => {
  try {
    const {
      amount,
      transactionId, // This will be used as the merchantOrderId.
      customerMobile,
      redirectUrl,
      email,
      name,
      accessToken,
    } = req.body;

    console.log("transactionId:", transactionId);
    // Construct the payload according to the new API spec.
    // Note:
    // - merchantOrderId: unique order ID (we're using transactionId).
    // - amount: Transaction amount (in paisa, if that's the standard).
    // - expireAfter: The time (in seconds) after which the payment request expires.
    // - metaInfo: Additional information fields. Here we pass customerMobile and merchantUserId as udf1 and udf2.
    // - paymentFlow: Details for payment initiation.
    const payload = {
      merchantOrderId: transactionId,
      amount: amount * 100, // Fallback to 10000 if amount is not provided.
      expireAfter: 1200, // For example, 1200 seconds expiry.
      metaInfo: {
        udf1: name,
        udf2: email,
        udf3: customerMobile,
        // udf3, udf4, udf5 can be added if needed.
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment message used for collect requests",
        merchantUrls: {
          redirectUrl: redirectUrl || "https://webhook.site/redirect-url",
        },
      },
    };

    console.log("payload:", payload);

    // Retrieve the access token (ensure this token is valid and has been fetched earlier)
    if (!accessToken) {
      return res.status(401).json({ error: "Access token not available" });
    }

    // Set the headers and endpoint based on your environment.
    // For UAT, the URL should be:
    //   https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay
    // For PROD, the URL should be:
    //   https://api.phonepe.com/apis/pg/checkout/v2/pay
    const options = {
      method: "post",
      url: `${PHONEPE_BASE_URL}/checkout/v2/pay`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `O-Bearer ${accessToken}`, // Pass the access token here.
      },
      data: payload,
    };

    // Send the request to PhonePe Payment Initiation API.
    const response = await axios.request(options);
    console.log("Payment initiation response:", response.data);

    // Return the response to the client.
    res.json(response.data);
  } catch (error) {
    console.error(
      "PhonePe Payment Initiation Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// ✅ Webhook Endpoint with Authentication
// ✅ Webhook Endpoint with Authentication
app.post("/api/phonepe/webhook", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("INSIDE MY PERSONAL HOOK", authHeader);
    // Check if Authorization header exists
    //if (!authHeader || !authHeader.startsWith('SHA256 ')) {
    // return res.status(401).json({ success: false, message: 'Unauthorized' });
    //}

    // Extract the received hash
    const receivedHash = authHeader.split(" ")[1];
    console.log("INSIDE MY receivedHash", receivedHash);
    // Compute the SHA256 hash of 'username:password'
    const credentials = `${AUTH_USER}:${AUTH_PASS}`;
    const computedHash = crypto
      .createHash("sha256")
      .update(credentials)
      .digest("hex");
    console.log("INSIDE MY computedHash", computedHash);
    // Validate the hash
    if (authHeader !== computedHash) {
      console.warn("❌ Unauthorized Webhook Access Attempt!");
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    console.log("📩 Valid Webhook Access:", req.body);

    // Process the webhook payload
    const { event, payload } = req.body;
    const upiTransactionId = payload?.merchantOrderId;
    const metaInfo = payload?.metaInfo;
    const name = metaInfo?.udf1 || "N/A"; // Could be phone number, etc.
    const email = metaInfo?.udf2 || "N/A"; // Could be user ID, etc.
    const phone = metaInfo?.udf3 || "N/A"; // Could be user ID, etc.

    if (!upiTransactionId) {
      console.warn("⚠️ Missing UPI Transaction ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid webhook payload" });
    }

    // Determine sales status
    let salesStatus;
    switch (event) {
      case "checkout.order.completed":
        salesStatus = "SC";
        break;
      case "checkout.order.failed":
        salesStatus = "SF";
        break;
      default:
        console.warn("⚠️ Unrecognized Event:", event);
        return res
          .status(400)
          .json({ success: false, message: "Unknown event type" });
    }

    // Update sales status in the database
    const result = await pool.query(
      "UPDATE sales SET sales_status = $1 WHERE upi_transaction_id = $2 RETURNING *",
      [salesStatus, upiTransactionId]
    );

    if (result.rows.length === 0) {
      console.warn(
        "⚠️ No matching sale found for Transaction ID:",
        upiTransactionId
      );
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    // ✅ Send Email Based on Event Type
    if (salesStatus === "SC") {
      await sendOrderEmail(name, email, upiTransactionId); // success
    } else if (salesStatus === "SF") {
      await sendFailedOrderEmail(name, email, upiTransactionId); // failure
    }

    console.log(
      `✅ Sales status updated to "${salesStatus}" for Transaction ID: ${upiTransactionId}`
    );
    res.status(200).json({
      success: true,
      message: "Sales status updated successfully",
      sale: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Webhook Processing Error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ✅ Order Status API
app.get("/api/check-payment-status", async (req, res) => {
  try {
    // ✅ Step 1: Extract Merchant Order ID from query params
    const { merchantOrderId } = req.query;
    if (!merchantOrderId) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant Order ID is required" });
    }

    // ✅ Step 2: Extract Authorization Token from Headers
    const accessToken = req.headers.authorization; // Get 'O-Bearer <token>' from frontend request
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing access token",
      });
    }

    // ✅ Step 3: Construct PhonePe API Endpoint
    const checkStatusUrl = `${PHONEPE_BASE_URL}/checkout/v2/order/${merchantOrderId}/status`;

    // ✅ Step 4: Set Headers (Pass Access Token)
    const headers = {
      "Content-Type": "application/json",
      Authorization: accessToken, // Pass the token received from frontend
    };

    // ✅ Step 5: Make API Request
    const { data } = await axios.get(checkStatusUrl, { headers });

    // ✅ Step 6: Return Response to Frontend
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "❌ Error checking PhonePe payment status:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Error checking payment status",
    });
  }
});

// Endpoint to handle file upload
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send({ filePath: `/uploads/${req.file.filename}` });
});

// Get all items or filter by category
// Get all items or filter by category
app.get("/api/items", async (req, res) => {
  try {
    const { category, webstatus } = req.query; // Extract 'category' and 'webstatus' from query parameters

    let query = "SELECT * FROM items";
    let queryParams = [];

    if (category && category !== "All" && webstatus) {
      // If category is provided and not "All", and webstatus exists
      query +=
        " WHERE category = $1 AND webstatus = $2 AND parent = 1 ORDER BY priority ASC";
      queryParams.push(category, webstatus);
    } else if (category && category === "All" && webstatus) {
      // If category is "All" but webstatus exists
      query += " WHERE webstatus = $1 AND parent = 1 ORDER BY priority ASC";
      queryParams.push(webstatus);
    } else {
      // Default: no filters, order by inventoryid DESC
      query += " ORDER BY inventoryid DESC";
    }

    // Execute the query with the constructed parameters
    const result = await pool.query(query, queryParams);
    res.json(result.rows); // Return the result rows as JSON
  } catch (err) {
    console.error(err.message); // Log the error message for debugging
    res.status(500).send("Server Error"); // Send a 500 status in case of error
  }
});

app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM items 
       WHERE inventoryid = $1 OR parent = $1 
       ORDER BY (CASE WHEN parent = 1 THEN 0 ELSE 1 END)`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/next-seq", async (req, res) => {
  try {
    const result = await pool.query("SELECT nextval('items_id_seq')");
    const nextSeqNum = result.rows[0].nextval;
    res.json({ nextSeqNum });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new item
app.post("/api/items", async (req, res) => {
  const {
    category,
    sellingprice,
    price,
    quantity,
    image,
    boxno,
    systemdate,
    inventoryid,
    subcategory,
    parent,
    label,
    orderdetails,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (category, sellingprice, price, quantity, image,  boxno, systemdate, inventoryid, subcategory, parent, label, orderdetails) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        category,
        sellingprice,
        price,
        quantity,
        image,
        boxno,
        systemdate,
        inventoryid,
        subcategory,
        parent,
        label,
        orderdetails,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update an item
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const {
    category,
    sellingprice,
    price,
    quantity,
    image,
    boxno,
    systemdate,
    subcategory,
    parent,
    label,
    orderdetails,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET  category = $1, sellingprice = $2, price = $3, quantity = $4, image = $5,  boxno = $6, systemdate = $7, subcategory = $8 , parent = $9 , label = $10 ,  orderDetails = $11 WHERE inventoryid = $12 RETURNING *",
      [
        category,
        sellingprice,
        price,
        quantity,
        image,
        boxno,
        systemdate,
        subcategory,
        parent,
        label,
        orderdetails,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/webitems/:id", async (req, res) => {
  const { id } = req.params;
  const { boxno, priority, webstatus, webcategory, discount } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET  boxno = $1, priority = $2, webstatus = $3 , webcategory = $4 , discount = $5 WHERE inventoryid = $6 RETURNING *",
      [boxno, priority, webstatus, webcategory, discount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete an item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM items WHERE inventoryid = $1", [id]);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get filtered by status
app.get("/api/salesbystatus", async (req, res) => {
  try {
    const { sales_status } = req.query; // Get sales_status from query parameters

    if (!sales_status) {
      return res
        .status(400)
        .json({ error: "sales_status query parameter is required." });
    }

    const result = await pool.query(
      "SELECT * FROM sales WHERE sales_status IN ('SC', 'SP', 'SF') ORDER BY sales_date DESC"
    );

    const mappedResult = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      items: row.items,
      salesDate: row.sales_date,
      price: row.price,
      buyerDetails: row.buyer_details,
      phoneNumber: row.phone_number,
      salesStatus: row.sales_status,
      systemDate: row.system_date,
      giveAway: row.give_away,
      shipmentDate: row.shipment_date,
      shipmentPrice: row.shipment_price,
      shipmentMethod: row.shipment_method,
      trackingId: row.tracking_id,
      pincode: row.pincode,
      state: row.state,
      email: row.email,
      coupon: row.coupon,
      extraDiscount: row.extradiscount,
      extraDiscountDescription: row.extradiscountdescription,
      upiIdLastFour: row.upi_transaction_id,
      salesType: row.sales_type,
      createdSource: row.created_souce,
      createdFrom: row.created_from,
    }));

    res.json(mappedResult);
  } catch (err) {
    console.error("❌ Error fetching sales:", err.message);
    res.status(500).send("Server Error");
  }
});

// Get filtered by status from Archive
app.get("/api/salesbystatusfromarchive", async (req, res) => {
  try {
    const { sales_status } = req.query; // Get sales_status from query parameters

    if (!sales_status) {
      return res
        .status(400)
        .json({ error: "sales_status query parameter is required." });
    }

    const result = await pool.query(
      "SELECT * FROM sales_archive WHERE sales_status IN ('SC', 'SP', 'SF') ORDER BY sales_date DESC"
    );

    const mappedResult = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      items: row.items,
      salesDate: row.sales_date,
      price: row.price,
      buyerDetails: row.buyer_details,
      phoneNumber: row.phone_number,
      salesStatus: row.sales_status,
      systemDate: row.system_date,
      giveAway: row.give_away,
      shipmentDate: row.shipment_date,
      shipmentPrice: row.shipment_price,
      shipmentMethod: row.shipment_method,
      trackingId: row.tracking_id,
      pincode: row.pincode,
      state: row.state,
      email: row.email,
      coupon: row.coupon,
      extraDiscount: row.extradiscount,
      extraDiscountDescription: row.extradiscountdescription,
      upiIdLastFour: row.upi_transaction_id,
      salesType: row.sales_type,
      createdSource: row.created_souce,
      createdFrom: row.created_from,
    }));

    res.json(mappedResult);
  } catch (err) {
    console.error("❌ Error fetching sales:", err.message);
    res.status(500).send("Server Error");
  }
});

// Get filtered and sorted pending sales
app.get("/api/salespending", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales WHERE sales_status = 'SP' ORDER BY sales_date DESC"
    );

    const mappedResult = result.rows.map((row) => ({
      id: row.id,
      name: row.name, // Include the name field
      items: row.items,
      salesDate: row.sales_date,
      price: row.price,
      buyerDetails: row.buyer_details,
      phoneNumber: row.phone_number,
      salesStatus: row.sales_status,
      systemDate: row.system_date,
      giveAway: row.give_away,
      shipmentDate: row.shipment_date,
      shipmentPrice: row.shipment_price,
      shipmentMethod: row.shipment_method,
      trackingId: row.tracking_id,
      pincode: row.pincode,
      state: row.state,
      email: row.email,
      coupon: row.coupon,
      extraDiscount: row.extradiscount,
      extraDiscountDescription: row.extradiscountdescription,
      upiIdLastFour: row.upi_transaction_id,
      salesType: row.sales_type,
      createdSource: row.created_souce,
      createdFrom: row.created_from,
    }));

    res.json(mappedResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get filtered and sorted completed sales
app.get("/api/salescomplete", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales WHERE sales_status = 'SD' ORDER BY shipment_date DESC"
    );

    const mappedResult = result.rows.map((row) => ({
      id: row.id,
      name: row.name, // Include the name field
      items: row.items,
      salesDate: row.sales_date,
      price: row.price,
      buyerDetails: row.buyer_details,
      phoneNumber: row.phone_number,
      salesStatus: row.sales_status,
      systemDate: row.system_date,
      giveAway: row.give_away,
      shipmentDate: row.shipment_date,
      shipmentPrice: row.shipment_price,
      shipmentMethod: row.shipment_method,
      trackingId: row.tracking_id,
      pincode: row.pincode,
      state: row.state,
      email: row.email,
      coupon: row.coupon,
      extraDiscount: row.extradiscount,
      extraDiscountDescription: row.extradiscountdescription,
      upiIdLastFour: row.upi_transaction_id,
      salesType: row.sales_type,
      createdSource: row.created_souce,
      createdFrom: row.created_from,
    }));

    res.json(mappedResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all sales
app.get("/api/sales", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales ORDER BY sales_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/sales-status/:upi_transaction_id", async (req, res) => {
  try {
    const { upi_transaction_id } = req.params;

    // Query to get sales status
    const result = await pool.query(
      "SELECT sales_status FROM sales WHERE upi_transaction_id = $1",
      [upi_transaction_id]
    );

    if (result.rows.length > 0) {
      res.json({ salesStatus: result.rows[0].sales_status });
    } else {
      res.status(404).json({ error: "Transaction ID not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new sale
app.post("/api/sales", async (req, res) => {
  const {
    name,
    items,
    salesDate,
    price,
    buyerDetails,
    phoneNumber,
    salesStatus,
    systemDate,
    giveAway,
    shipmentDate,
    shipmentPrice,
    shipmentMethod,
    trackingId,
    pincode,
    state,
    coupon,
    additionalDiscount,
    extraDiscount,
    shipment,
    email,
    extraDiscountDescription,
    upiLastFour,
    createdFrom,
    createdSource,
    salesType,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO sales (name, items, sales_date, price, buyer_details, phone_number, sales_status, system_date, give_away, shipment_date, shipment_price, shipment_method, tracking_id, pincode, state, coupon, additionaldiscount,extradiscount,shipment,email,extradiscountdescription,upi_transaction_id,created_from,created_souce,sales_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,$19,$20,$21,$22,$23,$24,$25) RETURNING *",
      [
        name,
        items,
        salesDate,
        price,
        buyerDetails,
        phoneNumber,
        salesStatus,
        systemDate,
        giveAway,
        shipmentDate,
        shipmentPrice,
        shipmentMethod,
        trackingId,
        pincode,
        state,
        coupon,
        additionalDiscount,
        extraDiscount,
        shipment,
        email,
        extraDiscountDescription,
        upiLastFour,
        createdFrom,
        createdSource,
        salesType,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update sales status by UPI Transaction ID
app.put("/api/sales/status", async (req, res) => {
  const { upiTransactionId, salesStatus } = req.body;

  if (!upiTransactionId || !salesStatus) {
    return res
      .status(400)
      .json({ error: "upiTransactionId and salesStatus are required." });
  }

  try {
    const result = await pool.query(
      "UPDATE sales SET sales_status = $1 WHERE upi_transaction_id = $2 RETURNING *",
      [salesStatus, upiTransactionId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No sale found with the provided UPI Transaction ID." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating sales status:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update a sale
app.put("/api/sales/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    items,
    salesDate,
    price,
    buyerDetails,
    phoneNumber,
    systemDate,
    giveAway,
    shipmentDate,
    shipmentPrice,
    shipmentMethod,
    trackingId,
    pincode,
    state,
    coupon,
    additionalDiscount,
    extraDiscount,
    shipment,
    email,
    extraDiscountDescription,
    salesType,
    salesStatus,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE sales SET 
        name = $1,
        items = $2,
        sales_date = $3,
        price = $4,
        buyer_details = $5,
        phone_number = $6,
        system_date = $7,
        give_away = $8,
        shipment_date = $9,
        shipment_price = $10,
        shipment_method = $11,
        tracking_id = $12,
        pincode = $13,
        state = $14,
        coupon = $15,
        additionaldiscount = $16,
        extradiscount = $17,
        shipment = $18,
        email = $19,
        extradiscountdescription = $20,
        sales_type = $21,
        sales_status= $22
      WHERE id = $23
      RETURNING *`,
      [
        name,
        items,
        salesDate,
        price,
        buyerDetails,
        phoneNumber,
        systemDate,
        giveAway,
        shipmentDate,
        shipmentPrice,
        shipmentMethod,
        trackingId,
        pincode,
        state,
        coupon,
        additionalDiscount,
        extraDiscount,
        shipment,
        email,
        extraDiscountDescription,
        salesType,
        salesStatus,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update shipment details and sales status to 'SD'
app.put("/api/sales/:id/shipment", async (req, res) => {
  const { id } = req.params;
  const { shipmentPrice, shipmentMethod, trackingId } = req.body;

  try {
    const result = await pool.query(
      `UPDATE sales 
       SET shipment_date = NOW(), 
           shipment_price = $1, 
           shipment_method = $2, 
           tracking_id = $3, 
           sales_status = $4 
       WHERE id = $5 
       RETURNING *`,
      [shipmentPrice, shipmentMethod, trackingId, "SD", id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update sales status to 'SP'
app.put("/api/sales/:id/status", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE sales SET sales_status = $1 WHERE id = $2 RETURNING *",
      ["SC", id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Sales: Delete with archiving
app.delete("/api/sales/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction
    await client.query("SET LOCAL my.context = 'archive_enabled'");
    await client.query("DELETE FROM sales WHERE id = $1", [id]);
    await client.query("COMMIT"); // Commit transaction

    res.json({ message: "Sale deleted and archived" });
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back on error
    console.error("Error in sales delete with archive:", err.message);
    res.status(500).send("Server Error");
  } finally {
    client.release(); // Always release the client
  }
});

// ❌ Sales: Delete without archiving
app.delete("/api/sales/:id/raw", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sales WHERE id = $1", [id]);
    res.json({ message: "Sale deleted WITHOUT archiving" });
  } catch (err) {
    console.error("Error in raw sales delete:", err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/categories", async (req, res) => {
  const { value, label } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categories (value, label) VALUES ($1, $2) RETURNING *",
      [value, label]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { value, label } = req.body;
  try {
    const result = await pool.query(
      "UPDATE categories SET value = $1, label = $2 WHERE id = $3 RETURNING *",
      [value, label, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/orderdetails", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orderdetails ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/orderdetails", async (req, res) => {
  const { value, label } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orderdetails (value, label) VALUES ($1, $2) RETURNING *",
      [value, label]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/orderdetails/:id", async (req, res) => {
  const { id } = req.params;
  const { value, label } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orderdetails SET value = $1, label = $2 WHERE id = $3 RETURNING *",
      [value, label, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/orderdetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM orderdetails WHERE id = $1", [id]);
    res.json({ message: "Order details deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Insert a new combo
app.post("/api/combo", async (req, res) => {
  const { items, price, expirationdate, comboname } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO combo (items, price, expirationdate, comboname) VALUES ($1, $2, $3, $4) RETURNING *",
      [items, price, expirationdate, comboname]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert combo" });
  }
});

// Get all combos
app.get("/api/combo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM combo");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch combos" });
  }
});

// Get a specific combo by ID
app.get("/api/combo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM combo WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Combo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch combo" });
  }
});

// Update a combo by ID
app.put("/api/combo/:id", async (req, res) => {
  const { id } = req.params;
  const { items, price, expirationdate, comboname } = req.body;

  try {
    const result = await pool.query(
      "UPDATE combo SET items = $1, price = $2, expirationdate = $3, comboname = $4 WHERE id = $5 RETURNING *",
      [items, price, expirationdate, comboname, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Combo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update combo" });
  }
});

// Delete a combo by ID
app.delete("/api/combo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM combo WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Combo not found" });
    }
    res.status(200).json({ message: "Combo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete combo" });
  }
});

app.post("/api/salesrecord/insert", async (req, res) => {
  const { id: salesid, items, combos = {} } = req.body;

  try {
    const queries = [];

    for (const inventoryid in items) {
      const quantity = items[inventoryid][0];
      const isCombo = items[inventoryid][2] === 1;

      if (isCombo) {
        const matchedCombo = combos[inventoryid]; // Access combo directly by key

        if (matchedCombo && Array.isArray(matchedCombo.items)) {
          for (const comboItem of matchedCombo.items) {
            const comboInventoryId = comboItem.inventoryid;
            const query = `
              INSERT INTO itemsalesrecord (salesid, inventoryid, quantity)
              VALUES ($1, $2, $3)
            `;
            queries.push(
              pool.query(query, [salesid, comboInventoryId, quantity])
            );
          }
        } else {
          console.warn(`⚠️ No matching combo found for comboId ${inventoryid}`);
        }
      } else {
        const query = `
          INSERT INTO itemsalesrecord (salesid, inventoryid, quantity)
          VALUES ($1, $2, $3)
        `;
        queries.push(pool.query(query, [salesid, inventoryid, quantity]));
      }
    }

    await Promise.all(queries);
    res.status(200).json({ message: "Sales records inserted successfully" });
  } catch (error) {
    console.error("❌ Error inserting sales records:", error);
    res.status(500).json({ error: "Failed to insert sales records" });
  }
});

app.post("/api/salesrecord/insertnew", async (req, res) => {
  const { id: salesid, items } = req.body;

  try {
    const queries = [];

    for (const inventoryid in items) {
      const quantity = items[inventoryid][0];
      const isCombo = items[inventoryid][2]; // Combo flag

      if (isCombo === 1) {
        // Fetch combo items from DB
        const comboRes = await pool.query(
          "SELECT items FROM combo WHERE id = $1",
          [inventoryid]
        );

        if (comboRes.rows.length > 0) {
          const comboItems = comboRes.rows[0].items;

          // Iterate and insert each combo item
          for (const comboInventoryId of comboItems) {
            const query = `
              INSERT INTO itemsalesrecord (salesid, inventoryid, quantity)
              VALUES ($1, $2, $3)
            `;
            queries.push(
              pool.query(query, [salesid, comboInventoryId, quantity])
            );
          }
        }
      } else {
        // Regular item, insert directly
        const query = `
          INSERT INTO itemsalesrecord (salesid, inventoryid, quantity)
          VALUES ($1, $2, $3)
        `;
        queries.push(pool.query(query, [salesid, inventoryid, quantity]));
      }
    }

    await Promise.all(queries);

    res.status(200).json({ message: "Sales records inserted successfully" });
  } catch (error) {
    console.error("Error inserting sales records:", error);
    res.status(500).json({ error: "Failed to insert sales records" });
  }
});

app.delete("/api/itemsalesrecord/salesid/:salesid", async (req, res) => {
  const { salesid } = req.params;

  if (!salesid) {
    return res.status(400).json({ error: "Please provide salesid" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // 🔁 Start transaction
    await client.query("SET LOCAL my.context = 'archive_enabled'");

    const query = "DELETE FROM itemsalesrecord WHERE salesid = $1";
    const result = await client.query(query, [salesid]);

    await client.query("COMMIT"); // ✅ Commit if successful

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the provided salesid" });
    }

    return res.status(200).json({
      message: `All records for salesid ${salesid} deleted and archived`,
    });
  } catch (err) {
    await client.query("ROLLBACK"); // ❌ Rollback on error
    console.error("Error deleting records for salesid:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release(); // Always release client
  }
});

app.delete("/api/itemsalesrecord/salesid/:salesid/raw", async (req, res) => {
  const { salesid } = req.params;

  if (!salesid) {
    return res.status(400).json({ error: "Please provide salesid" });
  }

  try {
    const query = "DELETE FROM itemsalesrecord WHERE salesid = $1";
    const result = await pool.query(query, [salesid]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the provided salesid" });
    }

    return res.status(200).json({
      message: `All records for salesid ${salesid} deleted WITHOUT archiving`,
    });
  } catch (err) {
    console.error("Error deleting records for salesid (raw):", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/salesrecords", async (req, res) => {
  try {
    // Query to select all sales records ordered by salesid in descending order
    const result = await pool.query("SELECT * FROM itemsalesrecord");

    // Send the retrieved rows as JSON
    res.json(result.rows);
  } catch (err) {
    // Log and send an error response
    console.error("Error retrieving sales records:", err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/inventory-totals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT inventoryid, SUM(quantity) AS total_quantity
      FROM itemsalesrecord
      GROUP BY inventoryid
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/filtered-items", async (req, res) => {
  try {
    const query = `
    SELECT 
    i.inventoryid,
    i.label,
    i.category,
    i.sellingprice,
    i.image,
    i.subcategory,
    i.parent,
    i.priority,
    i.discount,
    i.webcategory,
    i.webstatus,
    i.quantity AS quantity,
    COALESCE(SUM(isr.quantity), 0) AS total_quantity,
    (i.quantity - COALESCE(SUM(isr.quantity), 0)) AS difference
FROM 
    items i
LEFT JOIN 
    itemsalesrecord isr 
ON 
    i.inventoryid = isr.inventoryid
WHERE 
    i.webstatus = 1
GROUP BY 
    i.inventoryid, i.label, i.category, i.sellingprice, i.image, 
    i.subcategory, i.parent, i.priority, i.discount, i.webcategory, 
    i.webstatus, i.quantity
HAVING 
    i.quantity > COALESCE(SUM(isr.quantity), 0);
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/inventory-items-search", async (req, res) => {
  try {
    const query = `
      SELECT 
        i.inventoryid,
        i.label,
        i.category,
        i.sellingprice,
        i.price,
        i.image,
        i.subcategory,
        i.parent,
        i.priority,
        i.discount,
        i.webcategory,
        i.webstatus,
        i.boxno,
        i.systemdate,
        i.quantity AS quantity,
        COALESCE(SUM(isr.quantity), 0) AS total_quantity,
        (i.quantity - COALESCE(SUM(isr.quantity), 0)) AS difference
      FROM 
        items i
      LEFT JOIN 
        itemsalesrecord isr 
        ON i.inventoryid = isr.inventoryid
      GROUP BY 
        i.inventoryid, i.label, i.category, i.sellingprice, i.image, 
        i.subcategory, i.parent, i.priority, i.discount, i.webcategory, 
        i.webstatus, i.quantity, i.boxno,  i.price, i.systemdate
        ORDER BY 
            i.systemdate DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching filtered items:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/itemview/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        i.inventoryid,
        i.label,
        i.category,
        i.sellingprice,
        i.image,
        i.subcategory,
        i.parent,
        i.priority,
        i.discount,
        i.webcategory,
        i.webstatus,
        i.quantity AS quantity,
        COALESCE(SUM(isr.quantity), 0) AS total_quantity,
        (i.quantity - COALESCE(SUM(isr.quantity), 0)) AS difference
      FROM 
        items i
      LEFT JOIN 
        itemsalesrecord isr 
      ON 
        i.inventoryid = isr.inventoryid
      WHERE 
        (i.inventoryid = $1 OR i.parent = $1)
      GROUP BY 
        i.inventoryid, i.label, i.category, i.sellingprice, i.image, 
        i.subcategory, i.parent, i.priority, i.discount, i.webcategory, 
        i.webstatus, i.quantity
      ORDER BY 
        (CASE WHEN i.parent = 1 THEN 0 ELSE 1 END)
    `;

    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/salesreport", async (req, res) => {
  try {
    const { from, to, status } = req.query; // ✅ Added status parameter

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "Missing 'from' and 'to' query parameters" });
    }

    let query = `
      SELECT 
          s.id AS sales_id,
          s.price AS total_price,
          s.sales_date,
          s.name,
          s.buyer_details,
          s.pincode,
          s.state,
          s.phone_number,
          s.shipment_price,
          s.sales_status,
          isr.quantity AS quantity,
          isr.inventoryid,
          i.label AS item_label,
          i.price AS purchase_price,
          i.sellingprice,
          i.image
      FROM sales s
      JOIN itemsalesrecord isr ON s.id = isr.salesid
      JOIN items i ON isr.inventoryid = i.inventoryid
      WHERE s.sales_date BETWEEN $1 AND $2
    `;

    const values = [from, to];

    // ✅ If `status` is provided (e.g., 'SD'), filter records
    if (status) {
      query += ` AND s.sales_status = $3`;
      values.push(status);
    }

    query += ` ORDER BY s.sales_date DESC;`; // ✅ Latest sales first

    const { rows } = await pool.query(query, values);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching sales data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/salesreportbystatus", async (req, res) => {
  try {
    const query = `
      SELECT 
          s.id AS sales_id,
          s.price AS total_price,
          s.sales_date,
          s.name,
          s.buyer_details,
          s.pincode,
          s.state,
          s.phone_number,
          s.shipment_price,
          s.sales_status,
          isr.quantity AS quantity,
          isr.inventoryid,
          i.label AS item_label,
          i.price AS purchase_price,
          i.sellingprice,
          i.image
      FROM sales s
      JOIN itemsalesrecord isr ON s.id = isr.salesid
      JOIN items i ON isr.inventoryid = i.inventoryid
      WHERE s.sales_status IN ('SC', 'SP')
      ORDER BY s.sales_date DESC;
    `;

    const { rows } = await pool.query(query); // ❌ No parameters required
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sales data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/coupons", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM coupon ORDER BY expirydate DESC"
    );

    const mappedCoupons = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      expirydate: row.expirydate,
      category: row.category,
      rule: row.rule,
      active: row.active,
      applyby: row.applyby,
      applylist: row.applylist || [],
    }));

    res.json(mappedCoupons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// POST
app.post("/api/coupons", async (req, res) => {
  const {
    name,
    expirydate,
    category,
    rule,
    active,
    applyby,
    applylist,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO coupon (name, expirydate, category, rule, active, applyby, applylist)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, expirydate, category, rule, active, applyby, applylist]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT
app.put("/api/coupons/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    expirydate,
    category,
    rule,
    active,
    applyby,
    applylist,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE coupon SET name = $1, expirydate = $2, category = $3, rule = $4, active = $5,
       applyby = $6, applylist = $7 WHERE id = $8 RETURNING *`,
      [name, expirydate, category, rule, active, applyby, applylist, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE
app.delete("/api/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM coupon WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/apply-coupon-options", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name, buyer_details, pincode, state, email, phone_number, sales_status, price, system_date AS created_at
      FROM (
        SELECT name, buyer_details, pincode, state, email, phone_number, sales_status, price, system_date
        FROM sales
        UNION ALL
        SELECT name, buyer_details, pincode, state, email, phone_number, sales_status, price, system_date
        FROM sales_archive
      ) AS combined
      WHERE price IS NOT NULL
    `);

    // Group by phone_last10
    const grouped = {};

    for (const row of result.rows) {
      const phone_last10 = row.phone_number?.slice(-10) || "";
      if (!/^\d{10}$/.test(phone_last10)) continue;

      if (!grouped[phone_last10]) {
        grouped[phone_last10] = {
          phone_last10,
          name: row.name,
          email: row.email,
          pincode: row.pincode,
          state: row.state,
          sales_status: row.sales_status,
          price: 0,
          count: 0,
        };
      }

      grouped[phone_last10].price += Number(row.price || 0);
      grouped[phone_last10].count += 1;
    }

    const output = Object.values(grouped).sort((a, b) =>
      a.phone_last10.localeCompare(b.phone_last10)
    );

    res.json(output);
  } catch (err) {
    console.error("Apply coupon fetch failed", err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/generalcoupons", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM coupon 
       WHERE category = 'GENERAL' 
       AND active = true 
       AND expirydate >= CURRENT_DATE 
       ORDER BY expirydate DESC`
    );

    const mappedCoupons = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      expirydate: row.expirydate,
      category: row.category,
      rule: row.rule,
    }));

    res.json(mappedCoupons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/sales/restore
app.post("/api/sales/restore", async (req, res) => {
  const { id: saleId } = req.body;

  if (!saleId || isNaN(saleId)) {
    return res
      .status(400)
      .json({ error: "Valid 'id' is required in the request body." });
  }

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    // Step 1: Get the archived sale
    const saleRes = await client.query(
      "SELECT * FROM sales_archive WHERE id = $1",
      [saleId]
    );
    if (saleRes.rows.length === 0) {
      return res.status(404).json({ error: "Archived sale not found." });
    }

    const sale = saleRes.rows[0];

    // Destructure values from the sale object
    const {
      id,
      items,
      sales_date,
      price,
      buyer_details,
      phone_number,
      sales_status,
      system_date,
      give_away,
      shipment_date,
      shipment_price,
      shipment_method,
      tracking_id,
      name,
      pincode,
      state,
      coupon,
      email,
      extradiscount,
      additionaldiscount,
      extradiscountdescription,
      shipment,
      upi_transaction_id,
      created_from,
      created_souce,
      sales_type,
    } = sale;

    // Step 2: Insert into sales
    await client.query(
      `INSERT INTO sales (
        id, items, sales_date, price, buyer_details, phone_number,
        sales_status, system_date, give_away, shipment_date, shipment_price,
        shipment_method, tracking_id, name, pincode, state, coupon, email,
        extradiscount, additionaldiscount, extradiscountdescription,
        shipment, upi_transaction_id, created_from, created_souce, sales_type
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21,
        $22, $23, $24, $25, $26
      )`,
      [
        id,
        items,
        sales_date,
        price,
        buyer_details,
        phone_number,
        sales_status,
        system_date,
        give_away,
        shipment_date,
        shipment_price,
        shipment_method,
        tracking_id,
        name,
        pincode,
        state,
        coupon,
        email,
        extradiscount,
        additionaldiscount,
        extradiscountdescription,
        shipment,
        upi_transaction_id,
        created_from,
        created_souce,
        sales_type,
      ]
    );

    // Step 3: Restore itemsalesrecord
    const itemsRes = await client.query(
      "SELECT * FROM itemsalesrecord_archive WHERE salesid = $1",
      [saleId]
    );

    for (const item of itemsRes.rows) {
      const { id, salesid, inventoryid, quantity } = item;
      await client.query(
        `INSERT INTO itemsalesrecord (id, salesid, inventoryid, quantity)
         VALUES ($1, $2, $3, $4)`,
        [id, salesid, inventoryid, quantity]
      );
    }

    // Step 4: Delete from archive tables
    await client.query("DELETE FROM sales_archive WHERE id = $1", [saleId]);
    await client.query(
      "DELETE FROM itemsalesrecord_archive WHERE salesid = $1",
      [saleId]
    );

    await client.query("COMMIT");
    res
      .status(200)
      .json({
        success: true,
        message: `Sale ${saleId} restored successfully.`,
      });
  } catch (err) {
    console.error("Restore failed:", err.message);
    res.status(500).send("Server Error: Restore failed.");
  }
});

// POST /api/sales/delete-archive
app.post("/api/sales/delete-archive", async (req, res) => {
  const { id: saleId } = req.body;

  if (!saleId || isNaN(saleId)) {
    return res.status(400).json({ error: "Valid sale ID required." });
  }

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM itemsalesrecord_archive WHERE salesid = $1",
      [saleId]
    );
    await client.query("DELETE FROM sales_archive WHERE id = $1", [saleId]);

    await client.query("COMMIT");

    res.json({
      success: true,
      message: `Archived sale ${saleId} permanently deleted.`,
    });
  } catch (err) {
    console.error("Permanent delete failed:", err.message);
    res.status(500).send("Server Error: Permanent delete failed.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
