import { ManagerEntity } from 'src/manager/manager.entity';
export declare class Admin {
    id: number;
    username: string;
    email: string;
    password: string;
    address: string;
    managers: ManagerEntity[];
}
