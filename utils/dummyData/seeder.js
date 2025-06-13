const fs = require('fs'); // File System Module
require('colors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const Product = require('../../models/productModel'); // Sequelize model
const db = require('../../config/database'); // Sequelize instance

dotenv.config({ path: '../../.env' });

// ************** ALTER TABLE products AUTO_INCREMENT = 1

// Load product data
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

// Insert data into DB
const insertData = async () => {
  try {
    await db.sync(); // ensure tables exist
    await Product.bulkCreate(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete all products from DB
const destroyData = async () => {
  try {
    await db.sync();
    await Product.destroy({ where: {},  force: true  });

    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
console.log('DB name from env:', process.env.DATABASE_NAME);


// node seeder.js -i  or  -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
