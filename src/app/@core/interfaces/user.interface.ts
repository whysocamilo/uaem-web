export interface IUser {
    id: string;
    name: string;
    lastname: string;
    email: string;
    registerdate?: string;
    birthday?: string;
    role?: string;
    stripeCustomer?: string;
}
