import { Logger } from '@nestjs/common';
export declare class TrotterLogger extends Logger {
    gettime(): string;
    error(message: string, trace: string): void;
}
