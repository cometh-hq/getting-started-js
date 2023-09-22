import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const handler = NextAuth({
  debug: true,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER_BASE_URL || "",
    }),
  ],
});

export { handler as GET, handler as POST };
