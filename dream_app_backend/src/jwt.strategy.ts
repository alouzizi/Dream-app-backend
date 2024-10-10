import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: jwtConstants.secret, // Secret to validate the token signature
    });
  }

  // Validate and return the user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
