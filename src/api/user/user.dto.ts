export interface IRegistrationRequest{
    name:string;
    email:string;
    password:string;
    avatar?:string;
}

export interface IActivationMailReplacement{
    name:string;
    activationCode:string;
}
