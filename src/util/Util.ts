export default class Util {
    public static isDevEnv(): boolean {
        return !process || process.env.NODE_ENV === "development";
    }

    public static getApiUrl(): string {
        return this.isDevEnv() && process.env.OFFICIAL === "true" ? `http://${this.getApiDomain()}` : `https://${this.getApiDomain()}`;
    }

    public static getApiDomain(): string {
        return this.isDevEnv() && process.env.OFFICIAL === "true" ? "localhost:3001" : "api.zani.wtf";
    }
}