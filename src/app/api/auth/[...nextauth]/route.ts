// import { auth as authConfig } from "@/lib/auth-config";
// import NextAuth from "next-auth";

// const handler = NextAuth(authConfig);

// export { handler as GET, handler as POST };

import { handlers } from '@/auth'

export const { GET, POST } = handlers
