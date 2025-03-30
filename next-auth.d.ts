import "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in User type to include custom fields.
   */
  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string; // Add accessToken
  }

  /**
   * Extend the built-in Session type to include the accessToken.
   */
  interface Session {
    user: User; // Include the custom User type
    expires: string; // Ensure expires is included
  }

  /**
   * Extend the built-in JWT type to include custom fields.
   */
  interface JWT {
    id: string;
    accessToken: string;
  }
}