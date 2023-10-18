import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const prismaAdapter = PrismaAdapter(db);

const googleAuthAvailable = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const credentialsAuthAvailable = () => process.env.NODE_ENV !== "production";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
*
* @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // removing this made everything work...
    // session: ({ session, user, token }) => {
    //   return {
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: user.id || token.sub,
    //   },
    // }
    // },
    // jwt: async ({ token, user, account, profile }) => {
    //   console.log("jwt", token, user, account, profile)
    //   if (account?.provider === "google") {
    //     token.email = profile!.email;
    //   }
    //   if (user?.id) {
    //     token.sub = user.id;
    //   }
    //   return token;
    // }
  },
  adapter: {
    ...prismaAdapter,
    async createUser(user) {
      if (!user.name) {
        throw new Error("Missing name");
      }
      return db.user.create({
        data: {
          ...user,
          name: user.name,
          player: {
            connectOrCreate: {
              create: {
                email: user.email,
              },
              where: {
                email: user.email,
              },
            },
          },
        },
      });
    },
  },
  providers: [
    ... googleAuthAvailable() ? [GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      },
    })] : [],
    ... credentialsAuthAvailable() ? [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "text",
          },
        },
        async authorize(credentials) {
          if (!credentials) {
            return null;
          }
          const user = await db.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (!user) {
            return null;
          }
          return user;
        },
      })
    ] : []
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
