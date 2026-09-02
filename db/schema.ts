import {
  pgTable,
  pgEnum,
  serial,
  text,
  boolean,
  timestamp,
  date,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import type { L } from "@/lib/l10n";
import type { ProductSection, ProductQuote } from "@/lib/content/types";

// ---------- Enums ----------

export const roleEnum = pgEnum("role", ["admin", "editor"]);
export const submissionKindEnum = pgEnum("submission_kind", ["contact", "quote"]);

// ---------- Auth ----------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("editor"),
  // Editör rolü için erişilebilir panel sekmeleri (admin tümüne erişir)
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const sessions = pgTable("sessions", {
  // Cookie'deki ham token'ın sha256 hex hash'i — DB dökümü session çalmaya yetmez
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Site ayarları (key-value) ----------

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Form gönderimleri (iletişim / ürün teklif talebi) ----------

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  kind: submissionKindEnum("kind").notNull().default("contact"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull().default(""),
  // Teklif talebinde ürün adı ve seçilen tüm alanlar burada tutulur
  meta: jsonb("meta").$type<Record<string, string>>(),
  lang: text("lang").notNull().default("tr"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Ürünler (panelden yönetilir) ----------

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  // Türkçe adres (/urunler/pizza-kutusu) ve İngilizce adres (/en/products/pizza-box)
  slug: text("slug").notNull().unique(),
  slugEn: text("slug_en").notNull().unique(),
  title: jsonb("title").$type<L>().notNull(),
  // Ana sayfa kartındaki uzun açıklama
  cardText: jsonb("card_text").$type<L>().notNull().default({ tr: "", en: "" }),
  // Ürünler sayfası kartındaki kısa açıklama
  listText: jsonb("list_text").$type<L>().notNull().default({ tr: "", en: "" }),
  intro: jsonb("intro").$type<L>().notNull().default({ tr: "", en: "" }),
  // İlk görsel ana görsel; en fazla 3 (detay sayfasındaki küçük resimler)
  images: jsonb("images").$type<string[]>().notNull().default([]),
  sections: jsonb("sections").$type<ProductSection[]>().notNull().default([]),
  quote: jsonb("quote")
    .$type<ProductQuote>()
    .notNull()
    .default({ title: { tr: "", en: "" }, fields: [], options: [] }),
  showOnHome: boolean("show_on_home").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Blog yazıları (panelden yönetilir) ----------

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  slugEn: text("slug_en").notNull().unique(),
  title: jsonb("title").$type<L>().notNull(),
  excerpt: jsonb("excerpt").$type<L>().notNull().default({ tr: "", en: "" }),
  body: jsonb("body").$type<L>().notNull().default({ tr: "", en: "" }),
  cover: text("cover"),
  date: date("date", { mode: "string" }).notNull(),
  readMinutes: integer("read_minutes").notNull().default(5),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Galeri görselleri ----------

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  alt: jsonb("alt").$type<L>().notNull().default({ tr: "", en: "" }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
