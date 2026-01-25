import api from "@/services/api"

export interface DrivingLicenseData {
    id: string
    id_prob: string
    name: string
    name_prob: string
    dob: string
    dob_prob: string
    nation: string
    nation_prob: string
    class: string
    class_prob: string
    date: string
    date_prob: string
    doe: string
    doe_prob: string
    address: string
    address_prob: string
    place_issue: string
    place_issue_prob: string
}

export interface VerifyLicenseResponse {
    success: boolean
    data: {
        extracted: DrivingLicenseData
        user: any
    }
}

export const verificationService = {
    verifyLicense: async (file: File) => {
        const formData = new FormData()
        formData.append("image", file)
        
        const response = await api.post<VerifyLicenseResponse>("/verification/driving-license", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response as any
    }
}
