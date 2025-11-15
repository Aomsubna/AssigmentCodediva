export interface RegisterForm
{
    firstName: string
    lastName : string
    phoneNumber: string
    dateOfBirth: string
    email: string
    gender: string
    pin: string[];
    pinVerify: string[];
    acceptTerms: boolean
}