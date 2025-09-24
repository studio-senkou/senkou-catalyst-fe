import { tokenManager } from "@/lib/axios";

export const apiOAuth = {
  // Redirect ke backend OAuth
  initiateGoogleAuth(): void {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${baseURL}/auth/google`;
  },

  // Handle callback
  async handleGoogleAuthCallback(): Promise<{ success: boolean; error?: string; loginData?: any }> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedToken = urlParams.get("token");
      const error = urlParams.get("error");

      if (error) {
        window.history.replaceState({}, document.title, window.location.pathname);
        return { success: false, error: decodeURIComponent(error) };
      }

      if (!encryptedToken) {
        return { success: false, error: "No authentication token received" };
      }

      const decryptedData = await this.decryptToken(encryptedToken);

      if (!decryptedData.token || !decryptedData.refresh_token) {
        return { success: false, error: "Invalid token data received" };
      }

      tokenManager.saveTokens(
        decryptedData.token,
        decryptedData.refresh_token,
        "", // expiry bisa diisi kalau ada
        ""
      );

      window.history.replaceState({}, document.title, window.location.pathname);

      return {
        success: true,
        loginData: {
          access_token: decryptedData.token,
          refresh_token: decryptedData.refresh_token,
        },
      };
    } catch (error: any) {
      window.history.replaceState({}, document.title, window.location.pathname);
      return { success: false, error: error.message || "Failed to process authentication response" };
    }
  },

  // Decrypt v1.local
    async decryptToken(encryptedToken: string): Promise<any> {
        try {
            const appKey = import.meta.env.VITE_DECODE_TOKEN;
            if (!appKey) {
            throw new Error("Decode token key not configured");
            }

            const { V1 } = require("paseto");

            // Key harus 32 bytes
            const keyBuffer = Buffer.from(appKey, "hex");
            if (keyBuffer.length !== 32) {
            throw new Error("Invalid key length: expected 32 bytes");
            }

            // Gunakan V1.decrypt untuk v1.local
            const decryptedPayload = await V1.decrypt(encryptedToken, keyBuffer);

            // Tidak perlu JSON.parse, sudah object
            return decryptedPayload;
        } catch (error: any) {
            console.error("Token decryption error:", error);
            throw new Error(`Failed to decrypt authentication token: ${error.message}`);
        }
    }

};
