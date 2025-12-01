import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../../ports/password-hasher.interface';
import { ITokenGenerator } from '../../ports/token-generator.interface';
import { Email } from '../../../domain/value-objects/email.vo';
import { LoginUserDto, LoginUserResponseDto } from './login-user.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ITokenGenerator)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginUserResponseDto> {
    let email: Email;
    try {
      email = Email.create(dto.email);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified()) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox for the verification link.',
      );
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.getPassword().getValue(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenGenerator.generate({
      userId: user.getId(),
      email: user.getEmail().getValue(),
    });

    return {
      accessToken,
      userId: user.getId(),
      email: user.getEmail().getValue(),
    };
  }
}
