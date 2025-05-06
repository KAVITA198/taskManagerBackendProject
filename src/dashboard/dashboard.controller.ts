import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboadService: DashboardService) {}

    @Get(':userId')
  getUserDashboard(@Param('userId') userId: string) {
    return this.dashboadService.getUserDashboard(Number(userId));
  }
}
