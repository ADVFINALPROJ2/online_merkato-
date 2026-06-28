import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('summary')
  async getSummary() {
    return this.adminService.getVerificationSummary();
  }

  @Get('drivers/pending')
  async getPendingDrivers() {
    return this.adminService.getPendingDrivers();
  }

  @Get('drivers/approved')
  async getApprovedDrivers() {
    return this.adminService.getApprovedDrivers();
  }

  @Patch('drivers/:id/status')
  async updateDriverStatus(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.adminService.updateDriverStatus(id, status);
  }

  @Get('sellers/pending')
  async getPendingSellers() {
    return this.adminService.getPendingSellers();
  }

  @Patch('sellers/:id/status')
  async updateSellerStatus(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.adminService.updateSellerStatus(id, status);
  }

  @Get('orders/unassigned')
  async getUnassignedOrders() {
    return this.adminService.getUnassignedOrders();
  }

  @Patch('orders/:id/assign')
  async assignDriverToOrder(
    @Param('id') id: string,
    @Body('driverUserId') driverUserId: string,
  ) {
    return this.adminService.assignDriverToOrder(id, driverUserId);
  }
}
