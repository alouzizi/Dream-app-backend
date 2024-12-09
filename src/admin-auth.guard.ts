import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      console.log("Checking for token in cookies", request.cookies);
      try {
        const jwtToken = request.cookies['Jwt-tk'];
        if (!jwtToken) {
          // console.log('No JWT token found in cookies');
          return false;
        }
        this.jwtService.verify(jwtToken);
        return true;
      } catch (e) {
        // console.log('JWT token verification failed:', e.message);
        return false;
      }
    }
  }