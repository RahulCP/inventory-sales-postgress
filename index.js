const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const app = express();
const port = 5005;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "illolam",
  host: "localhost",
  database: "inventory_sales",
  password: "illolam84",
  port: 5432,
});

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

// Get filtered and sorted pending sales
app.get("/api/salespending", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales WHERE sales_status = 'SP' ORDER BY shipment_date DESC"
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
      upiIdLastFour: row.upi_transaction_id
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
      upiIdLastFour: row.upi_transaction_id
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
    upiLastFour
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO sales (name, items, sales_date, price, buyer_details, phone_number, sales_status, system_date, give_away, shipment_date, shipment_price, shipment_method, tracking_id, pincode, state, coupon, additionaldiscount,extradiscount,shipment,email,extradiscountdescription,upi_transaction_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,$19,$20,$21) RETURNING *",
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
        extraDiscountDescription
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
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
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE sales SET name = $1, items = $2, sales_date = $3, price = $4, buyer_details = $5, phone_number = $6, sales_status = $7, system_date = $8, give_away = $9, shipment_date = $10, shipment_price = $11, shipment_method = $12, tracking_id = $13 , pincode = $15, state = $16, coupon = $17, additionaldiscount=$18, extradiscount=$19, shipment=$20, email=$21, extradiscountdescription=$22  WHERE id = $14 RETURNING *",
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
        id,
        pincode,
        state,
        coupon,
        additionalDiscount,
        extraDiscount,
        shipment,
        email,
        extraDiscountDescription,
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
      ["SP", id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a sale
app.delete("/api/sales/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sales WHERE id = $1", [id]);
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error(err.message);
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
  const { id: salesid, items } = req.body; // Extract salesid and items from the request body

  try {
    const queries = []; // Array to hold multiple insert queries

    // Loop over items and create an INSERT query for each item
    for (const inventoryid in items) {
      const quantity = items[inventoryid][0]; // Extract quantity (first element of the array)

      const query = `INSERT INTO itemsalesrecord (salesid, inventoryid, quantity) VALUES ($1, $2, $3)`;
      const values = [salesid, inventoryid, quantity];
      queries.push(pool.query(query, values)); // Push each query to the array
    }

    await Promise.all(queries); // Execute all insert queries in parallel

    res.status(200).json({ message: "Sales records inserted successfully" });
  } catch (error) {
    console.error("Error inserting sales records:", error);
    res.status(500).json({ error: "Failed to insert sales records" });
  }
});

// Delete all records for a specific salesid
app.delete("/api/itemsalesrecord/salesid/:salesid", async (req, res) => {
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
      message: `All records for salesid ${salesid} deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting records for salesid:", err);
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
