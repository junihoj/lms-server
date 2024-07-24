export interface IRegistrationRequest {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface IActivationMailReplacement {
    name: string;
    activationCode: string;
}

export interface IActivateUserRequest {
    activationToken: string;
    activationCode: string;
}

export interface IActivationData {
    user: any;
    activationCode: string;
}

export interface ILoginDto {
    email: string;
    password: string;
}

