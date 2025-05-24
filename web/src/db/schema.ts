import { mysqlTable, varchar, text, timestamp, boolean, int, decimal } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
					id: varchar('id', { length: 36 }).primaryKey(),
					name: text('name').notNull(),
 email: varchar('email', { length: 255 }).notNull().unique(),
 emailVerified: boolean('email_verified').notNull(),
 image: text('image'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
				});

export const session = mysqlTable("session", {
					id: varchar('id', { length: 36 }).primaryKey(),
					expiresAt: timestamp('expires_at').notNull(),
 token: varchar('token', { length: 255 }).notNull().unique(),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const account = mysqlTable("account", {
					id: varchar('id', { length: 36 }).primaryKey(),
					accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
				});

export const verification = mysqlTable("verification", {
					id: varchar('id', { length: 36 }).primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 createdAt: timestamp('created_at'),
 updatedAt: timestamp('updated_at')
				});

export const jwks = mysqlTable("jwks", {
					id: varchar('id', { length: 36 }).primaryKey(),
					publicKey: text('public_key').notNull(),
 privateKey: text('private_key').notNull(),
 createdAt: timestamp('created_at').notNull()
				});

export const payment = mysqlTable("payment", {
  paymentId: int("payment_id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  bookingId: varchar("booking_id", { length: 36 }).notNull(),
  carId: varchar("car_id", { length: 36 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow()
  });

  export const image = mysqlTable("image", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url", {length: 1024 } ).notNull(), 
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  });