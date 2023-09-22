import NextAuth from "next-auth";

import { ApiCompany } from "@/modules/navigation/types";

declare module "next-auth" {
  interface Session extends Record<string, unknown> {
    expires?: string;
    accessToken?: unknown;
  }
}
