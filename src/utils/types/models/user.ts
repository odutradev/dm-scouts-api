export interface UserModelType {
    _id: string;
    id: string;
    order?: number;
    name: string;
    role: "normal" | "admin" | "leadership";
    status: "loggedIn" | "registered" | "blocked";
    createAt?: Date;
    lastUpdate?: Date;
    firstSignup?: Date;
    lastGetUser?: Date;
    description?: string;
    password?: string;
    email?: string;
    group?: string;
};