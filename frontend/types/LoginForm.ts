type Maybe<T> = T | null | undefined;

export interface LoginForm 
{
    phoneNumber: string;
    password: string;
    email?:  Maybe<string>;
    pin: string[];
}