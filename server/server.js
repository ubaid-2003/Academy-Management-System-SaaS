require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, UserAcademy, UserPermission } = require('./src/models'); // Adjust path if needed
const authRoutes = require('./src/routes/auth');       
const academyRoutes = require("./src/routes/academyRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000', // your frontend
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);           
app.use('/api/academies', academyRoutes);  

// Health check route
app.get('/', (req, res) => res.send('API is running'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// =====================
// Create SuperAdmin if not exists
// =====================
const createSuperAdmin = async () => {
  try {
    const adminEmail = 'ubaidaltaf070@gmail.com';
    const adminPassword = 'Ubaid2003';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const superAdmin = await User.create({
        fullName: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SuperAdmin", // correct role
      });

      console.log("SuperAdmin created:", superAdmin.email);
    } else {
      console.log("SuperAdmin already exists:", adminEmail);
    }
  } catch (err) {
    console.error("Error creating SuperAdmin:", err);
  }
};

// =====================
// Start server after syncing DB
// =====================
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Database synced successfully');
    await createSuperAdmin(); // create admin on server start
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

