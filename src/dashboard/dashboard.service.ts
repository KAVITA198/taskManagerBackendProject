import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService/prismaService.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserDashboard(userId: number) {
        const now = new Date();
    
        const [assignedTasks, createdTasks, overdueTasks] = await Promise.all([
          this.prisma.task.findMany({
            where: { assigned_by_id: userId },
            include: { created_by: true },
            orderBy: { due_date: 'asc' },
          }),
          this.prisma.task.findMany({
            where: { created_by_id: userId },
            include: { assigned_to: true },
            orderBy: { created_at: 'desc' },
          }),
          this.prisma.task.findMany({
            where: {
              assigned_by_id: userId,
              due_date: { lt: now },
              status: { not: 'DONE' },
            },
            orderBy: { due_date: 'asc' },
          }),
        ]);
    
        return {
          assignedTasks,
          createdTasks,
          overdueTasks,
        };
      }
}
