import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

async function createAdminUser() {
  try {
    // Check for required environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.error('Error: Missing required environment variables.');
      console.log('Please ensure you have set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in your .env file');
      process.exit(1);
    }

    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    console.log('Admin user created successfully:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 