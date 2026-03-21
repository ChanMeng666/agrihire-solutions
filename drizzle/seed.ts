import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding database...");

  // Reset sequences and clear data
  await sql`TRUNCATE "user", store, category, product, machine, booking, booking_item, hire_record, cart, cart_item, payment, promotion, promo_product, message, notifications, news, service, setting, store_hour, staff, customer, reset_tokens CASCADE`;

  // ============================================================
  // Users (password for all: Agri2024!)
  // bcrypt hash of 'Agri2024!'
  // ============================================================
  const passwordHash = "$2b$12$jKWd4lQLw1V8fpEf5fmkVOxEzTtXRdzmpaz4EEmW3W/V0cy6/nVZq";

  await sql`INSERT INTO "user" (user_id, email, password, role, is_active) VALUES
    (1, 'cust1@email.com', ${passwordHash}, 'customer', 1),
    (2, 'cust2@email.com', ${passwordHash}, 'customer', 1),
    (3, 'cust3@email.com', ${passwordHash}, 'customer', 1),
    (4, 'cust4@email.com', ${passwordHash}, 'customer', 1),
    (5, 'cust5@email.com', ${passwordHash}, 'customer', 1),
    (6, 'staff1@agrihire.nz', ${passwordHash}, 'staff', 1),
    (7, 'staff2@agrihire.nz', ${passwordHash}, 'staff', 1),
    (8, 'staff3@agrihire.nz', ${passwordHash}, 'staff', 1),
    (9, 'staff4@agrihire.nz', ${passwordHash}, 'staff', 1),
    (10, 'staff5@agrihire.nz', ${passwordHash}, 'staff', 1),
    (11, 'staff6@agrihire.nz', ${passwordHash}, 'staff', 1),
    (12, 'lmanager1@agrihire.nz', ${passwordHash}, 'lmgr', 1),
    (13, 'lmanager2@agrihire.nz', ${passwordHash}, 'lmgr', 1),
    (14, 'lmanager3@agrihire.nz', ${passwordHash}, 'lmgr', 1),
    (15, 'nmanager1@agrihire.nz', ${passwordHash}, 'nmgr', 1),
    (16, 'admin1@agrihire.nz', ${passwordHash}, 'admin', 1)`;

  await sql`SELECT setval(pg_get_serial_sequence('"user"', 'user_id'), 20)`;

  // ============================================================
  // Stores
  // ============================================================
  await sql`INSERT INTO store (store_id, store_name, phone, email, address_line1, address_line2, suburb, city, post_code, lng, lat, status, manager_id) VALUES
    (1, 'AgriHire Auckland', '09-123-4567', 'auckland@agrihire.nz', '100 Queen Street', '', 'CBD', 'Auckland', '1010', 174.763336, -36.848460, 1, NULL),
    (11, 'AgriHire Christchurch', '03-123-4567', 'christchurch@agrihire.nz', '200 Colombo Street', '', 'CBD', 'Christchurch', '8011', 172.636225, -43.531637, 1, NULL),
    (13, 'AgriHire Wellington', '04-123-4567', 'wellington@agrihire.nz', '50 Lambton Quay', '', 'CBD', 'Wellington', '6011', 174.776230, -41.286460, 1, NULL)`;

  await sql`SELECT setval(pg_get_serial_sequence('store', 'store_id'), 20)`;

  // ============================================================
  // Staff
  // ============================================================
  await sql`INSERT INTO staff (staff_id, user_id, store_id, first_name, last_name, position, phone) VALUES
    (1, 6, 1, 'Tom', 'Wilson', 'Store Assistant', '021-111-1111'),
    (2, 7, 1, 'Sarah', 'Taylor', 'Store Assistant', '021-222-2222'),
    (3, 8, 11, 'James', 'Davis', 'Store Assistant', '021-333-3333'),
    (4, 9, 11, 'Emma', 'White', 'Store Assistant', '021-444-4444'),
    (5, 10, 13, 'Oliver', 'Harris', 'Store Assistant', '021-555-5555'),
    (6, 11, 13, 'Charlotte', 'Martin', 'Store Assistant', '021-666-6666'),
    (7, 12, 1, 'David', 'Thompson', 'Store Manager', '021-777-7777'),
    (8, 13, 11, 'Sophie', 'Robinson', 'Store Manager', '021-888-8888'),
    (9, 14, 13, 'Daniel', 'Clark', 'Store Manager', '021-999-9999'),
    (10, 15, 1, 'Grace', 'Lewis', 'Network Manager', '021-000-0000'),
    (11, 16, 1, 'Admin', 'User', 'System Administrator', '021-111-0000')`;

  await sql`SELECT setval(pg_get_serial_sequence('staff', 'staff_id'), 20)`;

  // Update store managers
  await sql`UPDATE store SET manager_id = 7 WHERE store_id = 1`;
  await sql`UPDATE store SET manager_id = 8 WHERE store_id = 11`;
  await sql`UPDATE store SET manager_id = 9 WHERE store_id = 13`;

  // ============================================================
  // Customers
  // ============================================================
  await sql`INSERT INTO customer (customer_id, user_id, first_name, last_name, phone, address_line1, address_line2, suburb, city, post_code, my_store) VALUES
    (1, 1, 'John', 'Doe', '023-456-7890', '123 Main St', '', 'Albany', 'Auckland', '0632', 1),
    (2, 2, 'Alice', 'Smith', '098-765-4321', '456 Elm St', '', 'Wigram', 'Christchurch', '8052', 11),
    (3, 3, 'Rob', 'Johnson', '012-233-4455', '789 Oak St', '', 'Hornby', 'Christchurch', '8042', 11),
    (4, 4, 'Emily', 'Brown', '044-996-6330', '101 Pine St', '', 'Manukau', 'Auckland', '2104', 1),
    (5, 5, 'Michael', 'Anderson', '077-788-8999', '789 Walnut St', '', 'Alicetown', 'Wellington', '5010', 13)`;

  await sql`SELECT setval(pg_get_serial_sequence('customer', 'customer_id'), 10)`;

  // ============================================================
  // Store Hours
  // ============================================================
  for (const storeId of [1, 11, 13]) {
    for (let day = 1; day <= 5; day++) {
      await sql`INSERT INTO store_hour (store_id, week_day, open_time, close_time) VALUES (${storeId}, ${day}, '06:00', '17:00')`;
    }
    await sql`INSERT INTO store_hour (store_id, week_day, open_time, close_time) VALUES (${storeId}, 6, '07:00', '12:00')`;
  }

  // ============================================================
  // Categories
  // ============================================================
  await sql`INSERT INTO category (category_code, name, status) VALUES
    ('CHAIN', 'Chainsaws', 1),
    ('CMIX', 'Concrete Mixers', 1),
    ('EXCV', 'Excavators', 1),
    ('LAWN', 'Lawn Mowers', 1),
    ('POSTHD', 'Post Hole Diggers', 1),
    ('SPRA', 'Sprayers', 1),
    ('TELEH', 'Telehandlers', 1),
    ('TRAC', 'Tractors', 1)`;

  // ============================================================
  // Products
  // ============================================================
  await sql`INSERT INTO product (product_code, category_code, name, description, specs, price_a, qty_break_a, price_b, qty_break_b, price_c, qty_break_c, min_hire, max_hire, image, status) VALUES
    ('CHAIN-40HYD', 'CHAIN', '40cc Chainsaw Hydraulic', 'Professional hydraulic chainsaw for heavy-duty cutting. Ideal for farm clearing and firewood.', 'Engine: 40cc 2-stroke\nBar length: 16 inch\nWeight: 5.2kg', 180.00, 0, 150.00, 168, 120.00, 600, 1, 30, NULL, 1),
    ('CHAIN-40PTR', 'CHAIN', '40cc Chainsaw Petrol', 'Reliable petrol chainsaw for general purpose cutting tasks around the farm.', 'Engine: 40cc 2-stroke\nBar length: 14 inch\nWeight: 4.8kg', 25.00, 0, 20.00, 168, 15.00, 600, 1, 30, NULL, 1),
    ('CMIX-PTR01', 'CMIX', 'Concrete Mixer Petrol', 'Portable concrete mixer powered by petrol engine. Great for fence posts and small builds.', 'Drum capacity: 120L\nEngine: 5.5HP\nWeight: 85kg', 18.00, 0, 15.00, 168, 12.00, 600, 1, 14, NULL, 1),
    ('EXCV-MINI01', 'EXCV', 'Mini Excavator 1.7T', 'Compact mini excavator perfect for tight spaces. Includes standard bucket.', 'Operating weight: 1.7T\nDig depth: 2.2m\nBucket capacity: 0.04m3', 500.00, 0, 420.00, 168, 350.00, 600, 1, 60, NULL, 1),
    ('LAWN-PUSH01', 'LAWN', 'Push Lawn Mower 18"', 'Self-propelled push mower suitable for small to medium lawns.', 'Cutting width: 18 inch\nEngine: 173cc\nSelf-propelled', 30.00, 0, 25.00, 168, 20.00, 600, 1, 7, NULL, 1),
    ('LAWN-RIDE01', 'LAWN', 'Ride-on Mower 42"', 'Comfortable ride-on mower for large properties and paddocks.', 'Cutting width: 42 inch\nEngine: 547cc\nTransmission: Hydrostatic', 90.00, 0, 75.00, 168, 60.00, 600, 1, 30, NULL, 1),
    ('POSTHD-GAS01', 'POSTHD', 'Post Hole Digger Gas', 'Two-person gas-powered post hole digger with auger bit.', 'Engine: 63cc\nAuger size: 150mm-300mm\nWeight: 12kg', 20.00, 0, 17.00, 168, 14.00, 600, 1, 14, NULL, 1),
    ('SPRA-BOOM01', 'SPRA', 'Boom Sprayer 200L', 'Tow-behind boom sprayer for paddock spraying applications.', 'Tank: 200L\nBoom width: 6m\n12V pump\nAdjustable nozzles', 100.00, 0, 85.00, 168, 70.00, 600, 1, 30, NULL, 1),
    ('TELEH-2500', 'TELEH', 'Telehandler 2.5T', 'Versatile telehandler for lifting and material handling on farm.', 'Lift capacity: 2.5T\nMax height: 6m\nEngine: Diesel', 180.00, 0, 150.00, 168, 120.00, 600, 1, 60, NULL, 1),
    ('TRAC-25HP', 'TRAC', 'Compact Tractor 25HP', 'Compact utility tractor suitable for small farms and lifestyle blocks.', 'Engine: 25HP Diesel\n4WD\nPTO: 540rpm\nWeight: 1200kg', 100.00, 0, 85.00, 168, 70.00, 600, 1, 60, NULL, 1)`;

  // ============================================================
  // Machines (5 per product per store = 150 machines)
  // ============================================================
  const products = [
    'CHAIN-40HYD', 'CHAIN-40PTR', 'CMIX-PTR01', 'EXCV-MINI01', 'LAWN-PUSH01',
    'LAWN-RIDE01', 'POSTHD-GAS01', 'SPRA-BOOM01', 'TELEH-2500', 'TRAC-25HP'
  ];
  const stores = [1, 11, 13];
  let machineId = 1000;

  for (const pc of products) {
    for (const sid of stores) {
      for (let i = 1; i <= 5; i++) {
        const sn = `${pc}-S${sid}-${String(i).padStart(2, '0')}`;
        const purchaseDate = `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
        const cost = (Math.random() * 800 + 200).toFixed(2);
        await sql`INSERT INTO machine (machine_id, sn, product_code, store_id, purchase_date, cost, photo, note, status)
          VALUES (${machineId}, ${sn}, ${pc}, ${sid}, ${purchaseDate}, ${cost}, NULL, NULL, 1)`;
        machineId++;
      }
    }
  }

  await sql`SELECT setval(pg_get_serial_sequence('machine', 'machine_id'), ${machineId + 1})`;

  // ============================================================
  // Carts for customers
  // ============================================================
  for (let i = 1; i <= 5; i++) {
    await sql`INSERT INTO cart (cart_id, customer_id, promo_code) VALUES (${i}, ${i}, NULL)`;
  }
  await sql`SELECT setval(pg_get_serial_sequence('cart', 'cart_id'), 10)`;

  // ============================================================
  // Bookings (sample: 20 bookings across stores)
  // ============================================================
  const bookingData = [];
  for (let i = 0; i < 20; i++) {
    const custId = (i % 5) + 1;
    const stId = stores[i % 3];
    const month = String(Math.floor(i / 5) + 1).padStart(2, '0');
    const day = String((i % 28) + 1).padStart(2, '0');
    const total = [180, 25, 18, 500, 30, 90, 20, 100, 180, 100][i % 10];
    bookingData.push({ id: 1001 + i, custId, stId, month, day, total });
  }

  for (const b of bookingData) {
    await sql`INSERT INTO booking (booking_id, customer_id, store_id, create_date, total, note, status)
      VALUES (${b.id}, ${b.custId}, ${b.stId}, ${`2024-${b.month}-${b.day} 09:10:00`}, ${b.total}, NULL, 1)`;
  }
  await sql`SELECT setval(pg_get_serial_sequence('booking', 'booking_id'), 1100)`;

  // Booking items (1 per booking, assign machines sequentially)
  for (let i = 0; i < 20; i++) {
    const bookingId = 1001 + i;
    const machineOff = 1000 + i * 3;
    const rate = bookingData[i].total;
    const month = bookingData[i].month;
    const day = bookingData[i].day;
    const dayNum = Number(day);
    const nextDay = String(Math.min(dayNum + 1, 28)).padStart(2, '0');

    await sql`INSERT INTO booking_item (booking_item_id, booking_id, machine_id, line_num, hire_rate, hire_from, hire_to, status)
      VALUES (${100101 + i}, ${bookingId}, ${machineOff}, 1, ${rate}, ${`2024-${month}-${day} 09:00:00`}, ${`2024-${month}-${nextDay} 09:00:00`}, 1)`;
  }
  await sql`SELECT setval(pg_get_serial_sequence('booking_item', 'booking_item_id'), 100200)`;

  // Hire records
  for (let i = 0; i < 20; i++) {
    await sql`INSERT INTO hire_record (record_id, booking_item_id, checkout_time, checkout_staff, return_time, return_staff, note)
      VALUES (${i + 1}, ${100101 + i}, NULL, NULL, NULL, NULL, NULL)`;
  }
  await sql`SELECT setval(pg_get_serial_sequence('hire_record', 'record_id'), 100)`;

  // Payments
  for (let i = 0; i < 20; i++) {
    const b = bookingData[i];
    await sql`INSERT INTO payment (payment_id, booking_id, create_date, amount)
      VALUES (${i + 1}, ${b.id}, ${`2024-${b.month}-${b.day} 09:10:00`}, ${b.total})`;
  }
  await sql`SELECT setval(pg_get_serial_sequence('payment', 'payment_id'), 100)`;

  // ============================================================
  // Promotions
  // ============================================================
  await sql`INSERT INTO promotion (promo_code, store_id, disc_rate, start_date, end_date, name, description, note, status) VALUES
    ('SPRING25', 1, 25.00, '2024-09-01', '2027-11-30', 'Spring Sale 2025', 'Get 25% off selected equipment this spring!', NULL, 1),
    ('WINTER10', 11, 10.00, '2024-06-01', '2027-08-31', 'Winter Warmup', '10% discount on chainsaws during winter.', NULL, 1),
    ('NEWCUST15', 13, 15.00, '2024-01-01', '2027-12-31', 'New Customer Discount', '15% off your first hire at Wellington store.', NULL, 1)`;

  await sql`INSERT INTO promo_product (promo_code, product_code) VALUES
    ('SPRING25', 'LAWN-PUSH01'), ('SPRING25', 'LAWN-RIDE01'), ('SPRING25', 'SPRA-BOOM01'),
    ('WINTER10', 'CHAIN-40HYD'), ('WINTER10', 'CHAIN-40PTR'),
    ('NEWCUST15', 'TRAC-25HP'), ('NEWCUST15', 'EXCV-MINI01')`;

  // ============================================================
  // News
  // ============================================================
  await sql`INSERT INTO news (news_id, store_id, title, content, create_date, status) VALUES
    (1, 1, 'New Excavator Fleet Arrives', 'We are excited to announce the arrival of 5 brand new mini excavators at our Auckland store. These 1.7T units are perfect for residential and small commercial projects.', '2024-03-15 10:00:00', 1),
    (2, 11, 'Extended Summer Hours', 'Our Christchurch store will be open extended hours during the summer season. Monday to Friday 6am-7pm, Saturday 7am-3pm.', '2024-01-10 09:00:00', 1),
    (3, 13, 'Safety Workshop - Free Entry', 'Join us for a free chainsaw safety workshop at our Wellington store on March 30th. Covers proper handling, maintenance, and PPE requirements.', '2024-03-01 11:00:00', 1)`;

  await sql`SELECT setval(pg_get_serial_sequence('news', 'news_id'), 10)`;

  // ============================================================
  // Messages
  // ============================================================
  await sql`INSERT INTO message (message_id, customer_id, store_id, subject, content, reply, status, create_date, reply_date) VALUES
    (1, 1, 1, 'Equipment availability', 'Hi, do you have any mini excavators available next week?', 'Yes, we have 3 units available. Would you like to make a booking?', 1, '2024-03-10 14:00:00', '2024-03-10 15:30:00'),
    (2, 2, 11, 'Delivery options', 'Can you deliver equipment to Rangiora?', NULL, 1, '2024-03-12 10:00:00', NULL),
    (3, 3, 11, 'Booking extension', 'I need to extend my chainsaw hire for 3 more days.', 'No problem! We have extended your booking. The additional charges will be applied at the current rate.', 1, '2024-03-14 09:00:00', '2024-03-14 11:00:00')`;

  await sql`SELECT setval(pg_get_serial_sequence('message', 'message_id'), 10)`;

  // Notifications
  await sql`INSERT INTO notifications (notifications_id, message_id, store_id, is_read, create_date) VALUES
    (1, 1, 1, true, '2024-03-10 14:00:00'),
    (2, 2, 11, false, '2024-03-12 10:00:00'),
    (3, 3, 11, true, '2024-03-14 09:00:00')`;

  await sql`SELECT setval(pg_get_serial_sequence('notifications', 'notifications_id'), 10)`;

  // ============================================================
  // Service Records
  // ============================================================
  await sql`INSERT INTO service (service_id, machine_id, service_date, service_name, note) VALUES
    (1, 1000, '2024-01-15', 'Chain sharpening', 'Regular chain maintenance'),
    (2, 1000, '2024-03-10', 'Full service', 'Air filter, spark plug, chain oil'),
    (3, 1015, '2024-02-20', 'Bar replacement', 'Replaced worn guide bar'),
    (4, 1030, '2024-01-05', 'Drum cleaning', 'Cleaned and lubricated drum bearings'),
    (5, 1045, '2024-03-01', 'Track tension', 'Adjusted track tension and greased pins')`;

  await sql`SELECT setval(pg_get_serial_sequence('service', 'service_id'), 10)`;

  console.log("✓ Seeding complete!");
  console.log("  Users: 16 (password: original bcrypt hash)");
  console.log("  Stores: 3 (Auckland, Christchurch, Wellington)");
  console.log("  Staff: 11");
  console.log("  Customers: 5");
  console.log("  Categories: 8");
  console.log("  Products: 10");
  console.log("  Machines: 150");
  console.log("  Bookings: 20 with items, hire records, and payments");
  console.log("  Promotions: 3 with linked products");
  console.log("  News: 3 articles");
  console.log("  Messages: 3");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
