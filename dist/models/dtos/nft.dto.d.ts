export declare class CreateNftDto {
    file: any;
    readonly network: string;
    readonly name: string;
    readonly author: string;
    readonly type: string;
    readonly about: string;
    readonly editions: number;
    readonly price: number;
    readonly properties: object;
    readonly statement: object;
}
export declare class MigrateNftDto {
    readonly fromNetwork: string;
    readonly toNetwork: string;
    readonly tokenid: number;
    readonly owner: string;
}
export declare class TransferNftDto {
    readonly network: string;
    readonly fee?: number;
}
export declare class MintNftDto {
    readonly network: string;
    readonly fee?: string;
    readonly toAddress: string;
    readonly amount: number;
}
