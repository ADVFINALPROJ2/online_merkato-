import { PartialType } from '@nestjs/mapped-types';
import { RegisterDriverDto } from './register-driver.dto';

export class UpdateDriverDto extends PartialType(RegisterDriverDto) {}
