const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB = './data/db.json';
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv.slice(4).join(' ') || 'Hotel Administrator';

if (!email || !password) {
  console.log('Usage: node backend/create-admin.js EMAIL PASSWORD NAME');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB, 'utf8'));

if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
  console.log('A user with this email already exists.');
  process.exit(1);
}

const user = {
  id: Date.now(),
  name,
  email: email.toLowerCase(),
  password: bcrypt.hashSync(password, 10),
  role: 'admin',
  createdAt: new Date().toISOString()
};

db.users.push(user);
fs.writeFileSync(DB, JSON.stringify(db, null, 2));

console.log('Admin account created successfully.');
console.log('Email:', user.email);
