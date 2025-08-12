import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("customer"), // "farmer", "customer", "admin"
  password: varchar("password"), // For email/password authentication
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rwanda location data
export const provinces = pgTable("provinces", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  nameKinyarwanda: varchar("name_kinyarwanda"),
});

export const districts = pgTable("districts", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  nameKinyarwanda: varchar("name_kinyarwanda"),
  provinceId: varchar("province_id").references(() => provinces.id),
});

export const sectors = pgTable("sectors", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  nameKinyarwanda: varchar("name_kinyarwanda"),
  districtId: varchar("district_id").references(() => districts.id),
});

// Farmer profiles
export const farmers = pgTable("farmers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  farmName: varchar("farm_name"),
  description: text("description"),
  provinceId: varchar("province_id").references(() => provinces.id),
  districtId: varchar("district_id").references(() => districts.id),
  sectorId: varchar("sector_id").references(() => sectors.id),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  phone: varchar("phone"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product categories
export const productCategories = pgTable("product_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  nameKinyarwanda: varchar("name_kinyarwanda"),
  description: text("description"),
});

// Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id).notNull(),
  categoryId: varchar("category_id").references(() => productCategories.id),
  name: varchar("name").notNull(),
  nameKinyarwanda: varchar("name_kinyarwanda"),
  description: text("description"),
  unit: varchar("unit").notNull(), // "kg", "piece", "30eggs", etc.
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  availableQuantity: integer("available_quantity").default(0),
  minOrderQuantity: integer("min_order_quantity").default(1),
  isAvailable: boolean("is_available").default(true),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  farmerId: varchar("farmer_id").references(() => farmers.id).notNull(),
  status: varchar("status").notNull().default("pending"), // "pending", "confirmed", "delivered", "cancelled"
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text("delivery_address"),
  deliveryPhone: varchar("delivery_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  farmerId: varchar("farmer_id").references(() => farmers.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ML model predictions
export const demandPredictions = pgTable("demand_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productCategoryId: varchar("product_category_id").references(() => productCategories.id),
  provinceId: varchar("province_id").references(() => provinces.id),
  predictedDemand: decimal("predicted_demand", { precision: 10, scale: 2 }),
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 4 }),
  predictionDate: timestamp("prediction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product recommendations
export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  similarityScore: decimal("similarity_score", { precision: 5, scale: 4 }),
  recommendationType: varchar("recommendation_type"), // "price", "location", "quality"
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertFarmer = typeof farmers.$inferInsert;
export type Farmer = typeof farmers.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type Province = typeof provinces.$inferSelect;
export type District = typeof districts.$inferSelect;
export type Sector = typeof sectors.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type DemandPrediction = typeof demandPredictions.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;

// Insert schemas
export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});
