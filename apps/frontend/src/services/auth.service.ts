import axios from "axios"
import envConfig from "@/config"
import { User } from "@/contexts"
import { UserResponse } from "@utoto/shared"

export interface GoogleLoginPayload {
    email: string
    name: string
    avatar?: string
}

export interface AuthResponse {
    success: boolean
    data: {
        user: UserResponse
        accessToken: string
    }
    message?: string
}

export const loginWithGoogle = async (payload: GoogleLoginPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${envConfig.API_URL}/auth/google/callback`, payload)
    return response.data
}