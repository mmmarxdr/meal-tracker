export class Email {
    private readonly value: string;

    private constructor(email: string) {
        this.value = email;
    }

    static create(email: string): Email {
        if (!email || email.trim().length === 0) {
            throw new Error('Email cannot be empty');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        return new Email(email.toLowerCase().trim());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }
}