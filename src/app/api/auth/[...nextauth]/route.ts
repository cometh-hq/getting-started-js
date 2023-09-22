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
      clientId: "Ya5mvk2SVzkKX36jmyyWsrUp673409qe",
      clientSecret:
        "3DnCBXh1ZVyNMJ6IZF9bK4oZzMN58-gs7DhxIpIOk_XGxx_P4cEjJitl3IlPkjCB",
      issuer: "https://cometh-demo.eu.auth0.com",
    }),
  ],
});

export { handler as GET, handler as POST };
