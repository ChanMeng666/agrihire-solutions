import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  smallint,
  boolean,
  decimal,
  timestamp,
  date,
  time,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ============================================================
// Enums
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "staff",
  "lmgr",
  "nmgr",
  "admin",
]);

// ============================================================
// User & Auth Tables
// ============================================================

export const user = pgTable("user", {
  userId: serial("user_id").primaryKey(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  isActive: smallint("is_active").notNull().default(1),
});

export const resetTokens = pgTable("reset_tokens", {
  token: varchar("token", { length: 32 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  expiryTime: decimal("expiry_time", { precision: 20, scale: 6 }).notNull(),
});

// ============================================================
// Store Tables
// ============================================================

export const store = pgTable("store", {
  storeId: serial("store_id").primaryKey(),
  storeName: varchar("store_name", { length: 50 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 50 }),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  suburb: varchar("suburb", { length: 50 }),
  city: varchar("city", { length: 50 }),
  postCode: varchar("post_code", { length: 10 }),
  lng: decimal("lng", { precision: 9, scale: 6 }),
  lat: decimal("lat", { precision: 8, scale: 6 }),
  status: smallint("status").notNull().default(1),
  managerId: integer("manager_id"),
});

export const storeHour = pgTable(
  "store_hour",
  {
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    weekDay: integer("week_day").notNull(),
    openTime: time("open_time").notNull(),
    closeTime: time("close_time").notNull(),
  },
  (table) => [primaryKey({ columns: [table.storeId, table.weekDay] })]
);

// ============================================================
// Staff & Customer Tables
// ============================================================

export const staff = pgTable("staff", {
  staffId: serial("staff_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  storeId: integer("store_id").references(() => store.storeId, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  position: varchar("position", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
});

export const customer = pgTable("customer", {
  customerId: serial("customer_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  suburb: varchar("suburb", { length: 50 }),
  city: varchar("city", { length: 50 }),
  postCode: varchar("post_code", { length: 10 }),
  myStore: integer("my_store").references(() => store.storeId, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

// ============================================================
// Product Catalog Tables
// ============================================================

export const category = pgTable("category", {
  categoryCode: varchar("category_code", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  status: smallint("status").notNull().default(1),
});

export const product = pgTable(
  "product",
  {
    productCode: varchar("product_code", { length: 20 }).primaryKey(),
    categoryCode: varchar("category_code", { length: 10 })
      .notNull()
      .references(() => category.categoryCode, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    specs: text("specs"),
    priceA: decimal("price_a", { precision: 10, scale: 2 }).notNull(),
    qtyBreakA: integer("qty_break_a").notNull().default(0),
    priceB: decimal("price_b", { precision: 10, scale: 2 }),
    qtyBreakB: integer("qty_break_b").default(168),
    priceC: decimal("price_c", { precision: 10, scale: 2 }),
    qtyBreakC: integer("qty_break_c").default(600),
    minHire: integer("min_hire"),
    maxHire: integer("max_hire"),
    image: varchar("image", { length: 255 }),
    status: smallint("status").notNull().default(1),
  },
  (table) => [index("product_category_idx").on(table.categoryCode)]
);

export const machine = pgTable(
  "machine",
  {
    machineId: serial("machine_id").primaryKey(),
    sn: varchar("sn", { length: 50 }).notNull(),
    productCode: varchar("product_code", { length: 20 })
      .notNull()
      .references(() => product.productCode, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    purchaseDate: date("purchase_date"),
    cost: decimal("cost", { precision: 10, scale: 2 }),
    photo: varchar("photo", { length: 255 }),
    note: varchar("note", { length: 255 }),
    status: smallint("status").notNull().default(1),
  },
  (table) => [
    index("machine_product_idx").on(table.productCode),
    index("machine_store_idx").on(table.storeId),
    index("machine_sn_idx").on(table.sn),
  ]
);

export const service = pgTable(
  "service",
  {
    serviceId: serial("service_id").primaryKey(),
    machineId: integer("machine_id")
      .notNull()
      .references(() => machine.machineId, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    serviceDate: date("service_date").notNull(),
    serviceName: varchar("service_name", { length: 255 }).notNull(),
    note: text("note"),
  },
  (table) => [index("service_machine_idx").on(table.machineId)]
);

// ============================================================
// Booking & Hire Tables
// ============================================================

export const booking = pgTable(
  "booking",
  {
    bookingId: serial("booking_id").primaryKey(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customer.customerId, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createDate: timestamp("create_date").notNull(),
    total: decimal("total", { precision: 10, scale: 2 }),
    note: varchar("note", { length: 255 }),
    status: smallint("status").notNull().default(1),
  },
  (table) => [index("booking_customer_idx").on(table.customerId)]
);

export const bookingItem = pgTable(
  "booking_item",
  {
    bookingItemId: serial("booking_item_id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => booking.bookingId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    machineId: integer("machine_id")
      .notNull()
      .references(() => machine.machineId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    lineNum: integer("line_num").notNull(),
    hireRate: decimal("hire_rate", { precision: 10, scale: 2 }).notNull(),
    hireFrom: timestamp("hire_from").notNull(),
    hireTo: timestamp("hire_to").notNull(),
    status: smallint("status").notNull().default(1),
  },
  (table) => [
    index("booking_item_booking_idx").on(table.bookingId),
    index("booking_item_machine_idx").on(table.machineId),
  ]
);

export const hireRecord = pgTable(
  "hire_record",
  {
    recordId: serial("record_id").primaryKey(),
    bookingItemId: integer("booking_item_id")
      .notNull()
      .references(() => bookingItem.bookingItemId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    checkoutTime: timestamp("checkout_time"),
    checkoutStaff: integer("checkout_staff").references(() => staff.staffId),
    returnTime: timestamp("return_time"),
    returnStaff: integer("return_staff").references(() => staff.staffId),
    note: varchar("note", { length: 255 }),
  },
  (table) => [index("hire_record_booking_item_idx").on(table.bookingItemId)]
);

export const payment = pgTable(
  "payment",
  {
    paymentId: serial("payment_id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => booking.bookingId),
    createDate: timestamp("create_date").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [index("payment_booking_idx").on(table.bookingId)]
);

// ============================================================
// Shopping Cart Tables
// ============================================================

export const cart = pgTable(
  "cart",
  {
    cartId: serial("cart_id").primaryKey(),
    customerId: integer("customer_id").references(() => customer.customerId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    promoCode: varchar("promo_code", { length: 20 }),
  },
  (table) => [index("cart_customer_idx").on(table.customerId)]
);

export const cartItem = pgTable(
  "cart_item",
  {
    cartItemId: serial("cart_item_id").primaryKey(),
    cartId: integer("cart_id")
      .notNull()
      .references(() => cart.cartId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    productCode: varchar("product_code", { length: 20 })
      .notNull()
      .references(() => product.productCode, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    qty: integer("qty").notNull(),
    lineNum: integer("line_num").notNull(),
    hireRate: decimal("hire_rate", { precision: 10, scale: 2 }).notNull(),
    discRate: decimal("disc_rate", { precision: 5, scale: 2 }).default("0.00"),
    hireFrom: timestamp("hire_from").notNull(),
    hireTo: timestamp("hire_to").notNull(),
  },
  (table) => [index("cart_item_cart_idx").on(table.cartId)]
);

// ============================================================
// Promotion Tables
// ============================================================

export const promotion = pgTable(
  "promotion",
  {
    promoCode: varchar("promo_code", { length: 20 }).primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    discRate: decimal("disc_rate", { precision: 5, scale: 2 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    note: text("note"),
    status: smallint("status").notNull().default(1),
  },
  (table) => [index("promotion_store_idx").on(table.storeId)]
);

export const promoProduct = pgTable(
  "promo_product",
  {
    promoCode: varchar("promo_code", { length: 20 })
      .notNull()
      .references(() => promotion.promoCode, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    productCode: varchar("product_code", { length: 20 })
      .notNull()
      .references(() => product.productCode, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.promoCode, table.productCode] })]
);

// ============================================================
// Messaging & Notification Tables
// ============================================================

export const message = pgTable(
  "message",
  {
    messageId: serial("message_id").primaryKey(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customer.customerId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    subject: varchar("subject", { length: 255 }).notNull(),
    content: text("content").notNull(),
    reply: text("reply"),
    status: smallint("status").notNull().default(1),
    createDate: timestamp("create_date").notNull(),
    replyDate: timestamp("reply_date"),
  },
  (table) => [
    index("message_customer_idx").on(table.customerId),
    index("message_store_idx").on(table.storeId),
  ]
);

export const notifications = pgTable(
  "notifications",
  {
    notificationsId: serial("notifications_id").primaryKey(),
    messageId: integer("message_id")
      .notNull()
      .references(() => message.messageId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    isRead: boolean("is_read").notNull(),
    createDate: timestamp("create_date").notNull(),
  },
  (table) => [index("notifications_store_idx").on(table.storeId)]
);

// ============================================================
// News Table
// ============================================================

export const news = pgTable(
  "news",
  {
    newsId: serial("news_id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => store.storeId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    title: varchar("title", { length: 255 }),
    content: text("content"),
    createDate: timestamp("create_date"),
    status: smallint("status").notNull().default(1),
  },
  (table) => [index("news_store_idx").on(table.storeId)]
);

// ============================================================
// Settings Table
// ============================================================

export const setting = pgTable("setting", {
  settingId: serial("setting_id").primaryKey(),
  settingKey: varchar("setting_key", { length: 255 }).notNull().unique(),
  settingValue: varchar("setting_value", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
});
