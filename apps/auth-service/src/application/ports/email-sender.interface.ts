export interface IEmailSender {
  sendVerificationEmail(to: string, token: string): Promise<void>;
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
}

export const IEmailSender = Symbol('IEmailSender');
