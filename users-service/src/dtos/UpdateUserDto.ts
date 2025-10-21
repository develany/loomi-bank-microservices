export interface UpdateUserDto {
    name?: string;
    email?: string;
    address?: string;
    bankingDetails?: {
        agency: string;
        account: string;
    };
}