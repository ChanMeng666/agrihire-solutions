import { relations } from "drizzle-orm";
import {
  user,
  staff,
  customer,
  store,
  storeHour,
  category,
  product,
  machine,
  service,
  booking,
  bookingItem,
  hireRecord,
  payment,
  cart,
  cartItem,
  promotion,
  promoProduct,
  message,
  notifications,
  news,
} from "./schema";

// ============================================================
// User Relations
// ============================================================

export const userRelations = relations(user, ({ one }) => ({
  staff: one(staff, {
    fields: [user.userId],
    references: [staff.userId],
  }),
  customer: one(customer, {
    fields: [user.userId],
    references: [customer.userId],
  }),
}));

// ============================================================
// Store Relations
// ============================================================

export const storeRelations = relations(store, ({ one, many }) => ({
  manager: one(staff, {
    fields: [store.managerId],
    references: [staff.staffId],
  }),
  storeHours: many(storeHour),
  staffMembers: many(staff),
  machines: many(machine),
  bookings: many(booking),
  promotions: many(promotion),
  messages: many(message),
  news: many(news),
  notifications: many(notifications),
}));

export const storeHourRelations = relations(storeHour, ({ one }) => ({
  store: one(store, {
    fields: [storeHour.storeId],
    references: [store.storeId],
  }),
}));

// ============================================================
// Staff & Customer Relations
// ============================================================

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(user, {
    fields: [staff.userId],
    references: [user.userId],
  }),
  store: one(store, {
    fields: [staff.storeId],
    references: [store.storeId],
  }),
}));

export const customerRelations = relations(customer, ({ one, many }) => ({
  user: one(user, {
    fields: [customer.userId],
    references: [user.userId],
  }),
  preferredStore: one(store, {
    fields: [customer.myStore],
    references: [store.storeId],
  }),
  bookings: many(booking),
  carts: many(cart),
  messages: many(message),
}));

// ============================================================
// Product Catalog Relations
// ============================================================

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryCode],
    references: [category.categoryCode],
  }),
  machines: many(machine),
  promoProducts: many(promoProduct),
  cartItems: many(cartItem),
}));

export const machineRelations = relations(machine, ({ one, many }) => ({
  product: one(product, {
    fields: [machine.productCode],
    references: [product.productCode],
  }),
  store: one(store, {
    fields: [machine.storeId],
    references: [store.storeId],
  }),
  bookingItems: many(bookingItem),
  services: many(service),
}));

export const serviceRelations = relations(service, ({ one }) => ({
  machine: one(machine, {
    fields: [service.machineId],
    references: [machine.machineId],
  }),
}));

// ============================================================
// Booking Relations
// ============================================================

export const bookingRelations = relations(booking, ({ one, many }) => ({
  customer: one(customer, {
    fields: [booking.customerId],
    references: [customer.customerId],
  }),
  store: one(store, {
    fields: [booking.storeId],
    references: [store.storeId],
  }),
  items: many(bookingItem),
  payments: many(payment),
}));

export const bookingItemRelations = relations(bookingItem, ({ one }) => ({
  booking: one(booking, {
    fields: [bookingItem.bookingId],
    references: [booking.bookingId],
  }),
  machine: one(machine, {
    fields: [bookingItem.machineId],
    references: [machine.machineId],
  }),
  hireRecord: one(hireRecord, {
    fields: [bookingItem.bookingItemId],
    references: [hireRecord.bookingItemId],
  }),
}));

export const hireRecordRelations = relations(hireRecord, ({ one }) => ({
  bookingItem: one(bookingItem, {
    fields: [hireRecord.bookingItemId],
    references: [bookingItem.bookingItemId],
  }),
  checkoutStaffMember: one(staff, {
    fields: [hireRecord.checkoutStaff],
    references: [staff.staffId],
    relationName: "checkoutStaff",
  }),
  returnStaffMember: one(staff, {
    fields: [hireRecord.returnStaff],
    references: [staff.staffId],
    relationName: "returnStaff",
  }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  booking: one(booking, {
    fields: [payment.bookingId],
    references: [booking.bookingId],
  }),
}));

// ============================================================
// Cart Relations
// ============================================================

export const cartRelations = relations(cart, ({ one, many }) => ({
  customer: one(customer, {
    fields: [cart.customerId],
    references: [customer.customerId],
  }),
  items: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.cartId],
  }),
  product: one(product, {
    fields: [cartItem.productCode],
    references: [product.productCode],
  }),
}));

// ============================================================
// Promotion Relations
// ============================================================

export const promotionRelations = relations(promotion, ({ one, many }) => ({
  store: one(store, {
    fields: [promotion.storeId],
    references: [store.storeId],
  }),
  promoProducts: many(promoProduct),
}));

export const promoProductRelations = relations(promoProduct, ({ one }) => ({
  promotion: one(promotion, {
    fields: [promoProduct.promoCode],
    references: [promotion.promoCode],
  }),
  product: one(product, {
    fields: [promoProduct.productCode],
    references: [product.productCode],
  }),
}));

// ============================================================
// Message & Notification Relations
// ============================================================

export const messageRelations = relations(message, ({ one, many }) => ({
  customer: one(customer, {
    fields: [message.customerId],
    references: [customer.customerId],
  }),
  store: one(store, {
    fields: [message.storeId],
    references: [store.storeId],
  }),
  notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  message: one(message, {
    fields: [notifications.messageId],
    references: [message.messageId],
  }),
  store: one(store, {
    fields: [notifications.storeId],
    references: [store.storeId],
  }),
}));

// ============================================================
// News Relations
// ============================================================

export const newsRelations = relations(news, ({ one }) => ({
  store: one(store, {
    fields: [news.storeId],
    references: [store.storeId],
  }),
}));
