export interface UserSpaceType {
    entryAt?: Date;
    role: string;
    name: string;
    id: string;
};

export interface UserClassType {
    entryAt?: Date;
    name: string;
    id: string;
};

export interface UserModelType {
    _id: string;
    id: string;
    order?: number;
    name: string;
    role: "normal" | "admin";
    status: "loggedIn" | "registered" | "blocked";
    createAt?: Date;
    lastUpdate?: Date;
    firstSignup?: Date;
    lastGetUser?: Date;
    spaces?: UserSpaceType[];
    classes?: UserClassType[];
    description?: string;
    images?: {
        profile?: string;
    };
    badges?: any[];
    coins: number;
    password?: string;
    email?: string;
    keys: {
        slots: number;
        specialSlots: number;
        favoriteSlots: number;
    };
};