import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function resetDatabase() {
//     console.log("🗑️ Cleaning up old sample data...");
  
//     await sql`DELETE FROM user_permissions;`;
//     await sql`DELETE FROM entries;`;
//     await sql`DELETE FROM threads;`;
//     await sql`DELETE FROM themes;`;
//     await sql`DELETE FROM users;`;
  
//     console.log("✅ Old sample data deleted.");
//   }

//   export async function GET() {
//         try {
//           console.log("Starting resetting database ...");
          
//           await resetDatabase();  
      
//           console.log("Database reset successfully.");
//           return Response.json({ message: "Database reset successfully" });
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//           console.error("Database reset error:", error.message, error.stack);
//           return Response.json({ error: `Database reset failed: ${error.message}` }, { status: 500 });
//         } else {
//           console.error("Database reset error:", error);
//           return Response.json({ error: "Database reset failed due to an unknown error" }, { status: 500 });
//         }
//       }
//   }

//  






export async function seedSampleData() {
    try {
      console.log("Seeding sample data...");
  
      // ✅ Insert 3 sample users
      const users = await sql`
        INSERT INTO users (email, wallet_address, phone_number, auth_provider, role)
        VALUES 
        ('streetmusician@example.com', '0x1111111111111111', '+1234567890', 'privy_email', 'user'),
        ('networkstate@example.com', '0x2222222222222222', '+1987654321', 'privy_wallet', 'user'),
        ('generaluser@example.com', '0x3333333333333333', '+1456789012', 'privy_wallet', 'user')
        RETURNING id;
      `;
  
      const [user1_id, user2_id, user3_id] = users.map((user) => user.id);
  
      // ✅ Insert themes
      const themes = await sql`
        INSERT INTO themes (name) 
        VALUES 
        ('morning'),
        ('evening'),
        ('weekly'),
        ('kiez'),
        ('revelation'),
        ('story')
        RETURNING id;
      `;
  
      const themeIds = themes.map((theme) => theme.id);
  
      // ✅ Insert threads with correct descriptions
      const threads = await sql`
        INSERT INTO threads (title, description)
        VALUES 
        ('streetmusician', 'A space dedicated for street musicians.'),
        ('networkstate', 'A space dedicated for members of network states.')
        RETURNING id;
      `;
  
      const [thread1_id, thread2_id] = threads.map((thread) => thread.id);
  
      // ✅ Assign users to threads based on your requirements
      await sql`
        INSERT INTO user_permissions (thread_id, user_id)
        VALUES 
        (${thread1_id}, ${user1_id}),  -- User 1 has access to "streetmusician"
        (${thread2_id}, ${user2_id});  -- User 2 has access to "networkstate"
      `;
  
      // ✅ Sample entry contents for different users
      const entryContents = {
        streetmusician: [
          "Played violin at the subway today. People actually stopped to listen. A woman even dropped a flower in my case.",
          "The rain soaked my guitar, but the moment a kid danced to my music made it worth it.",
          "Experimented with looping today. Got some nods of appreciation from passersby.",
          "Met an old jazz musician who gave me tips on improvisation. Felt like a secret knowledge transfer!",
          "A drunk guy sang along to my performance today. Not sure if it was great or terrible, but it was definitely memorable!"
        ],
        networkstate: [
          "Had a deep discussion about DAOs today. Feels like governance is finally evolving beyond rigid nation-states.",
          "Tried to explain the concept of a network state to my friends. They were skeptical but intrigued.",
          "We’re experimenting with a local crypto-driven economy in our community. Excited about what’s next!",
          "How do we balance decentralization and efficiency? Some governance needs speed, but we want to avoid centralization.",
          "Met someone today who is setting up a network state IRL. Could this be the future?"
        ],
        general: [
          "Watched the sunrise from my rooftop. The sky was painted in gold and pink, and I felt completely at peace.",
          "Got lost in my neighborhood today and found a cozy bookstore I’d never seen before.",
          "A stranger smiled at me on the train, and somehow, it made my whole day better.",
          "Had coffee at my usual spot, but today the barista wrote a quote on my cup: 'Every day is a fresh start.'",
          "Tonight, I walked under the city lights, and for the first time in a while, I felt like I belonged."
        ]
      };
  
      // ✅ Insert entries for each user
    //   const sampleEntries = [];


    const sampleEntries: { 
        user_id: string; 
        theme_id: string; 
        thread_id: string | null; 
        content: string; 
        location: string; 
      }[] = [];
      

      const locations = [
        'POINT(48.8566 2.3522)', // Paris
        'POINT(40.7128 -74.0060)', // NYC
        'POINT(51.5074 -0.1278)', // London
        'POINT(34.0522 -118.2437)', // LA
        'POINT(35.6895 139.6917)' // Tokyo
      ];
  
      // 🔹 Entries for User 1 (Street Musician)
      entryContents.streetmusician.forEach((content, index) => {
        sampleEntries.push({
            user_id: user1_id,
            theme_id: themeIds[Math.floor(Math.random() * themeIds.length)], 
            thread_id: thread1_id,
            content,
            location: locations[index % locations.length]
      });
      });
  
      // 🔹 Entries for User 2 (Network State)
      entryContents.networkstate.forEach((content, index) => {
        sampleEntries.push({
            user_id: user2_id,
            theme_id: themeIds[Math.floor(Math.random() * themeIds.length)], 
            thread_id: thread2_id,
            content,
            location: locations[index % locations.length]
      });
      });
  
      // 🔹 Entries for User 3 (General User, No Thread)
      entryContents.general.forEach((content, index) => {
        sampleEntries.push({
            user_id: user3_id,
            theme_id: themeIds[Math.floor(Math.random() * themeIds.length)], 
            thread_id: null,
            content,
            location: locations[index % locations.length]
      });
      });
  
      console.log(`📝 Preparing ${sampleEntries.length} entries for insertion...`);
      console.log(sampleEntries); // Debugging step to check generated entries
  
      // ✅ Insert all entries in a single batch
      await sql`
      INSERT INTO entries ${sql(sampleEntries)};
    `;
    
  
      console.log("✅ Sample data inserted successfully!");
    } catch (error) {
      console.error("❌ Error seeding sample data:", error instanceof Error ? error.message : error);
    }
  }
  
  export async function GET() {
    try {
      console.log("Starting seeding database ...");
      
      await seedSampleData();  
  
      console.log("Database seeded successfully.");
      return Response.json({ message: "Database seeded successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
      console.error("Database seed error:", error.message, error.stack);
      return Response.json({ error: `Database seed failed: ${error.message}` }, { status: 500 });
    } else {
      console.error("Database seed error:", error);
      return Response.json({ error: "Database seed failed due to an unknown error" }, { status: 500 });
    }
  }
}