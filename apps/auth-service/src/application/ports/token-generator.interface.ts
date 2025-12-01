export interface ITokenGenerator {
    generate(payload: { userId: string; email: string }): Promise<string>;
    verify(token: string): Promise<{ userId: string; email: string } | null>;
}

export const ITokenGenerator = Symbol('ITokenGenerator');