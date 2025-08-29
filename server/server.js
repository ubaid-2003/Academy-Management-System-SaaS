require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const { sequelize, User } = require('./src/models'); // Adjust paths
const authRoutes = require('./src/routes/auth');
const academyRoutes = require('./src/routes/academyRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const { authMiddleware, adminAuth } = require('./src/middleware/authMiddleware');

const app = express();

// =====================
// Middleware
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000', // change to your frontend
  credentials: true,
}));

// =====================
// Health check
// =====================
app.get('/', (req, res) => res.send('API is running'));

// =====================
// Routes
// =====================

// Auth routes (login/register)
app.use('/api/auth', authRoutes);

// Academy routes (admin only)
app.use('/api/academies', authMiddleware, adminAuth, academyRoutes);

// Student routes (admin only)
app.use('/api/students', authMiddleware, adminAuth, studentRoutes);

// Teacher routes (admin only)
app.use('/api/teachers', authMiddleware, adminAuth, teacherRoutes);

// =====================
// Global error handler
// =====================
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
        role: "SuperAdmin",
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
