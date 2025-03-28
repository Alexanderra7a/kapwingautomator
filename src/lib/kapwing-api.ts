/**
 * Kapwing API integration for account creation, verification, and video processing
 */

export interface KapwingApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface KapwingAccountResponse extends KapwingApiResponse {
  data?: {
    userId: string;
    email: string;
    verificationSent: boolean;
  };
}

export interface KapwingVerificationResponse extends KapwingApiResponse {
  data?: {
    verified: boolean;
    accountType: string;
    credits: number;
    maxCredits: number;
    memberSince: string;
  };
}

/**
 * Helper function to handle API requests
 */
async function kapwingRequest(endpoint: string, method: string, body?: object) {
  try {
    const response = await fetch(`https://api.kapwing.com/v1/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Kapwing API request failed");
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Kapwing API error [${endpoint}]:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new Kapwing account and send a verification email
 */
export async function createKapwingAccount(
  fullName: string,
  email: string,
  password: string
): Promise<KapwingAccountResponse> {
  if (!fullName || !email || !password) {
    return { success: false, error: "Missing required fields" };
  }

  const result = await kapwingRequest("auth/signup", "POST", { fullName, email, password });

  if (result.success) {
    return {
      success: true,
      data: {
        userId: result.data.userId,
        email: result.data.email,
        verificationSent: true,
      },
    };
  }

  return result;
}

/**
 * Verify a Kapwing account with a verification code
 */
export async function verifyKapwingCode(
  email: string,
  code: string
): Promise<KapwingVerificationResponse> {
  if (!email || !code) {
    return { success: false, error: "Missing email or verification code" };
  }

  // Simulated verification for demo mode
  if (/^\d{6}$/.test(code)) {
    return {
      success: true,
      data: {
        verified: true,
        accountType: "free",
        credits: 5,
        maxCredits: 10,
        memberSince: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      },
      message: "Account verified successfully (demo mode)",
    };
  }

  return kapwingRequest("auth/verify", "POST", { email, code });
}
