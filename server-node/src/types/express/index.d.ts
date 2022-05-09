interface User {
    id: number;
    username: string;
    password: string;
    token: string;
}

declare namespace Express {
    interface Request {
        user: User;
    }
}
