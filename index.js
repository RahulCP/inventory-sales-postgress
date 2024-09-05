const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const app = express();
const port = 5005;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'illolam',
  host: 'localhost',
  database: 'inventory_sales',
  password: 'illolam84',
  port: 5432,
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Endpoint to handle file upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send({ filePath: `/uploads/${req.file.filename}` });
});


// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items  ORDER BY inventoryid DESC;');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/next-seq', async (req, res) => {
  try {
    const result = await pool.query('SELECT nextval(\'items_id_seq\')');
    const nextSeqNum = result.rows[0].nextval;
    res.json({ nextSeqNum });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new item
app.post('/api/items', async (req, res) => {
  const { code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, inventoryid, purchaseDate, subcategory, parent } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, inventoryid, purchaseDate, subcategory, parent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, inventoryid, purchaseDate, subcategory, parent]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, purchaseDate ,subcategory, parent} = req.body;
  try {
    const result = await pool.query(
      'UPDATE items SET code = $1, category = $2, sellingprice = $3, price = $4, quantity = $5, image = $6, publish = $7, publishedurl = $8, boxno = $9, systemdate = $10, purchaseDate = $11, subcategory = $12 , parent = $13 WHERE inventoryid = $14 RETURNING *',
      [code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, purchaseDate, subcategory, parent, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message); 
    res.status(500).send('Server Error');
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items WHERE inventoryid = $1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get filtered and sorted pending sales
app.get('/api/salespending', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales WHERE sales_status = 'SP' ORDER BY shipment_date DESC"
    );

    const mappedResult = result.rows.map(row => ({
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
      trackingId: row.tracking_id
    }));

    res.json(mappedResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get filtered and sorted completed sales
app.get('/api/salescomplete', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales WHERE sales_status = 'SD' ORDER BY sales_date DESC"
    );

    const mappedResult = result.rows.map(row => ({
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
      trackingId: row.tracking_id
    }));

    res.json(mappedResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales ORDER BY sales_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
 
// Add a new sale
app.post('/api/sales', async (req, res) => {
  const { name, items, salesDate, price, buyerDetails, phoneNumber, salesStatus, systemDate, giveAway, shipmentDate, shipmentPrice, shipmentMethod, trackingId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sales (name, items, sales_date, price, buyer_details, phone_number, sales_status, system_date, give_away, shipment_date, shipment_price, shipment_method, tracking_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [name, items, salesDate, price, buyerDetails, phoneNumber, salesStatus, systemDate, giveAway, shipmentDate, shipmentPrice, shipmentMethod, trackingId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a sale
app.put('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { name, items, salesDate, price, buyerDetails, phoneNumber, salesStatus, systemDate, giveAway, shipmentDate, shipmentPrice, shipmentMethod, trackingId } = req.body;
  try {
    const result = await pool.query(
      'UPDATE sales SET name = $1, items = $2, sales_date = $3, price = $4, buyer_details = $5, phone_number = $6, sales_status = $7, system_date = $8, give_away = $9, shipment_date = $10, shipment_price = $11, shipment_method = $12, tracking_id = $13 WHERE id = $14 RETURNING *',
      [name, items, salesDate, price, buyerDetails, phoneNumber, salesStatus, systemDate, giveAway, shipmentDate, shipmentPrice, shipmentMethod, trackingId, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update shipment details and sales status to 'SD'
app.put('/api/sales/:id/shipment', async (req, res) => {
  const { id } = req.params;
  const { shipmentDate, shipmentPrice, shipmentMethod, trackingId } = req.body;

  try {
    const result = await pool.query(
      'UPDATE sales SET shipment_date = $1, shipment_price = $2, shipment_method = $3, tracking_id = $4, sales_status = $5 WHERE id = $6 RETURNING *',
      [shipmentDate, shipmentPrice, shipmentMethod, trackingId, 'SD', id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update sales status to 'SP'
app.put('/api/sales/:id/status', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE sales SET sales_status = $1 WHERE id = $2 RETURNING *',
      ['SP', id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a sale
app.delete('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sales WHERE id = $1', [id]);
    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
