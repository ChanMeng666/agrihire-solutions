import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "./db";
import { customer } from "../../drizzle/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Auto-create customer profile for new signups
          const nameParts = (user.name || "").split(" ");
          const firstName = nameParts[0] || null;
          const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "User";

          try {
            await db.insert(customer).values({
              userId: Number(user.id),
              firstName,
              lastName,
            });
          } catch (e) {
            // Customer record may already exist (e.g. staff-created users)
            console.error("Failed to create customer profile:", e);
          }
        },
      },
    },
  },
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
