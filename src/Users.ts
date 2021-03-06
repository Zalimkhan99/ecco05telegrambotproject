export class Users {
    private static _id: string;
    private static _phone: string;
    private static _auth: boolean;
    private static _balance: string;

    public static get balance(): string {
        return this._balance;
    }
    public static set balance(value: string) {
        this._balance = value;
    }

    public static get auth(): boolean {
        return this._auth;
    }
    public static set auth(value: boolean) {
        this._auth = value;
    }

    public static get id(): string {
        return this._id;
    }
    public static set id(value: string) {
        this._id = value;
    }

    public static get phone(): string {
        return this._phone;
    }
    public static set phone(value: string) {
        this._phone = value;
    }
}
