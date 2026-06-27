export class RegisterDriverDto {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  vehicleType: string; // Changed to string to stop Prisma compilation crash
  licensePlate?: string;
  idImageUrl: string;
  licenseImageUrl?: string;
}
