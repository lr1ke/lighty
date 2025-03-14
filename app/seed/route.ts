// import bcrypt from 'bcrypt';
import postgres from 'postgres';
const bcrypt = require('bcryptjs');

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,  
  wallet_address VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user',
  last_login TIMESTAMP,
  auth_provider VARCHAR(50) CHECK (auth_provider IN ('privy_email', 'privy_wallet', 'wallet')) -- Define valid auth methods
);
  `;
}
// ✅ Now, auth_provider clearly differentiates how the user logged in. eamil via Privy, wallet via wallet, or wallet via wallet
// ✅ If a user has both an email & a wallet, we’ll store both, but auth_provider will track which login method was used.



async function seedEntries() {
  await sql`CREATE EXTENSION IF NOT EXISTS postgis;`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,              
      theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
      thread_id UUID REFERENCES threads(id) ON DELETE SET NULL,
      content VARCHAR(500) NOT NULL,
      location GEOGRAPHY(Point, 4326),      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`CREATE INDEX idx_entries_theme_id ON entries(theme_id);`;
  await sql`CREATE INDEX idx_entries_thread_id ON entries(thread_id);`;
  await sql`CREATE INDEX idx_entries_theme_created ON entries(theme_id, created_at);`;
  await sql`CREATE INDEX idx_entries_location ON entries USING GIST (location);`;
}

// ✅ Now, every entry MUST have a theme but does NOT need to be part of a thread.
// ✅ If a thread is deleted, the reference in entries becomes NULL (but the entry stays).



async function seedThemes() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; 
  await sql`
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;
}

async function seedThreads() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; 
  await sql`
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,         
  description TEXT,                      
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;
}

async function seedUserPermissions() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; 
  await sql`
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,                
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,                  
  UNIQUE (thread_id, user_id) -- Prevent duplicate permissions
);

  `;
}

export async function GET() {
  try {
    console.log("Starting database setup...");
    
    await seedUsers();        // ✅ Users first (other tables depend on it)
    await seedThemes();       // ✅ Themes second (entries depend on it)
    await seedThreads();      // ✅ Threads third (entries and permissions depend on it)
    await seedEntries();      // ✅ Entries fourth (depends on users, themes, threads)
    await seedUserPermissions(); // ✅ Permissions last (depends on threads and users)

    console.log("Database setup completed successfully.");
    return Response.json({ message: "Database setup completed successfully" });
  } catch (error) {
    console.error("Database setup error:", error.message, error.stack);
    return Response.json({ error: `Database setup failed: ${error.message}` }, { status: 500 });
  }
}





// async function dropTables() {
//   await sql`DROP TABLE IF EXISTS entries CASCADE;`;
//   await sql`DROP TABLE IF EXISTS customers CASCADE;`;
//   await sql`DROP TABLE IF EXISTS users CASCADE;`;
// }

// export async function GET() {
//   try {
//     console.log("Dropping existing tables...");
//     await dropTables();

//     return Response.json({ message: 'All tables dropped successfully' });
//   } catch (error) {
//     console.error("Dropping tables error:", error); // Log the error for debugging

//     // Check if error has a message property
//     const errorMessage = (error instanceof Error) ? error.message : 'Failed to drop tables';
    
//     return Response.json({ error: errorMessage }, { status: 500 });
//   }
// }

// async function seedUsers() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS users (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL
//     );
//   `;

//   const insertedUsers = await Promise.all(
//     users.map(async (user) => {
//       const hashedPassword = await bcrypt.hash(user.password, 10);
//       return sql`
//         INSERT INTO users (id, name, email, password)
//         VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );

//   return insertedUsers;
// }



// async function seedEntries() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS entries (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       title VARCHAR(255),
//       content TEXT NOT NULL,
//       owner UUID NOT NULL,
//       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       location VARCHAR(255),
//       lon FLOAT, -- Longitude
//       lat FLOAT, -- Latitude
//       token1 TEXT,
//       token2 TEXT,
//       token3 TEXT,
//       customer_id UUID REFERENCES customers(id) ON DELETE CASCADE -- Foreign key to link to customers
//     );
//   `;
//   const insertedEntries = await Promise.all(
//     entries.map(
//       (entry) => sql`
//         INSERT INTO entries (id, title, content, owner, timestamp, location, lon, lat, token1, token2, token3, customer_id)
//         VALUES (${entry.id}, ${entry.title}, ${entry.content}, ${entry.owner}, ${entry.timestamp}, ${entry.location}, ${entry.lon}, ${entry.lat}, ${entry.token1}, ${entry.token2}, ${entry.token3}, ${entry.customer_id})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedEntries;
// }



// async function seedCustomers() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//   await sql`
//     CREATE TABLE IF NOT EXISTS customers (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL
//     );
//   `;

//   const insertedCustomers = await Promise.all(
//     customers.map(
//       (customer) => sql`
//         INSERT INTO customers (id, name, email)
//         VALUES (${customer.id}, ${customer.name}, ${customer.email})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedCustomers;
// }
