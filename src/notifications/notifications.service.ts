import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService/prismaService.service';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async createNotification(userId: number, taskId: number, message: string) {
        return this.prisma.notification.create({
          data: {
            user_id: userId,
            task_id: taskId,
            message,
          },
        });
      }
    
      async getUserNotifications(userId: number) {
        return this.prisma.notification.findMany({
          where: { user_id: userId },
          orderBy: { created_at: 'desc' },
        });
      }
    
      async markAsRead(notificationId: number) {
        return this.prisma.notification.update({
          where: { id: notificationId },
          data: { read: true },
        });
      }
}
