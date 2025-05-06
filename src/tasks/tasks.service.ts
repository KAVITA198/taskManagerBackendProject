import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dto';
import { Task } from 'generated/prisma';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService,
        private notificationService: NotificationsService,
    ) {}
    
      // Create Task
      async createTask(data: CreateTaskDto, creatorId: number) {
        const task = await this.prisma.task.create({
          data: {
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            priority: data.priority,
            status: data.status,
            created_by_id: creatorId,
            assigned_by_id: data.assigned_by_id,
          },
        });
    
        // Create notification for assignee
        await this.notificationService.createNotification(
          data.assigned_by_id,
          task.id,
          `You have been assigned a new task: ${data.title}`,
        );
    
        return task;
      }

      async getAssignedTasksToId() {
        try {
            const query = `SELECT u.id as value , u.name as label 
            FROM User u` ;
            const result = await this.prisma.$queryRawUnsafe(query);
            return result;
        } catch (error) {
            throw new ConflictException(error)
        }
      }

      async getHighPriorityTasks( higyPrioryTask: string){
        try {
            let priorityWise ;
            switch (higyPrioryTask) {
                case 'LOW':
                    priorityWise = 'LOW';
                    break;
                case 'MEDIUM':
                    priorityWise = 'MEDIUM';
                    break;
                case 'HIGH':
                    priorityWise = 'HIGH';
                    break;
                default:
                    priorityWise = 'LOW';
                    break;
            }
            const query = `SELECT 
            t.id as id ,
            t.title as title,
            t.description as description,
            t.due_date as dueDate,
            t.priority as priority,
            t.status as status,
            t.created_at as createdAt,
            t.updated_at as updatedAt,
            au.name as assignedBy,
            cu.name as createdBy 
            
            FROM Task t  
            LEFT JOIN User au ON t.assigned_by_id = au.id 
            LEFT JOIN User cu ON t.created_by_id = cu.id 
            WHERE  t.priority = '${priorityWise}' 
            ORDER BY t.created_at DESC
            `;
            const result = await this.prisma.$queryRawUnsafe(query);
            return result;
        } catch (error) {
            throw new ConflictException(error)
            
        }
      }

      async getAllTasks() {
        try {
            const query = `SELECT 
            t.id as id ,
            t.title as title,
            t.description as description,
            t.due_date as dueDate,
            t.priority as priority,
            t.status as status,
            t.created_at as createdAt,
            t.updated_at as updatedAt,
            au.name as assignedBy,
            cu.name as createdBy 
            
            FROM Task t  
            LEFT JOIN User au ON t.assigned_by_id = au.id 
            LEFT JOIN User cu ON t.created_by_id = cu.id 
            ORDER BY t.created_at DESC
            `;
            const result = await this.prisma.$queryRawUnsafe(query);
        return result;
        } catch (error) {
            throw new ConflictException(error)
            
        }
      }

      async getCreatedTasks(userId: number){
        try {
            const query = `SELECT 
            t.id as id ,
            t.title as title,
            t.description as description,
            t.due_date as dueDate,
            t.priority as priority,
            t.status as status,
            t.created_at as createdAt,
            t.updated_at as updatedAt,
            au.name as assignedBy,
            cu.name as createdBy 
            
            FROM Task t  
            LEFT JOIN User au ON t.assigned_by_id = au.id 
            LEFT JOIN User cu ON t.created_by_id = cu.id 
            
            WHERE t.created_by_id  = ${userId} 
            ORDER BY t.created_at DESC`;
            const result = await this.prisma.$queryRawUnsafe(query);
        return result;
        } catch (error) {
            throw new ConflictException(error)
        }
      }

      async getAllMyTasks(userId: number){
        try {
            const query = `SELECT 
            t.id as id ,
            t.title as title,
            t.description as description,
            t.due_date as dueDate,
            t.priority as priority,
            t.status as status,
            t.created_at as createdAt,
            t.updated_at as updatedAt,
            au.name as assignedBy,
            cu.name as createdBy 
            
            FROM Task t  
            LEFT JOIN User au ON t.assigned_by_id = au.id 
            LEFT JOIN User cu ON t.created_by_id = cu.id 
            
            WHERE t.assigned_by_id = ${userId} 
            ORDER BY t.created_at DESC`;
            const result = await this.prisma.$queryRawUnsafe(query);
        return result;
        } catch (error) {
            throw new ConflictException(error)
        }
      }

      async getOverdueTasks(userId: number){
       try {
        const query = `SELECT 
        t.id as id ,
        t.title as title,
        t.description as description,
        t.due_date as dueDate,
        t.priority as priority,
        t.status as status,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        au.name as assignedBy,
        cu.name as createdBy 
        
        FROM Task t  
        LEFT JOIN User au ON t.assigned_by_id = au.id 
        LEFT JOIN User cu ON t.created_by_id = cu.id 
        
        WHERE t.assigned_by_id = ${userId} and t.due_date < NOW() and t.status != 'DONE'`;
        const result = await this.prisma.$queryRawUnsafe(query);
    return result;
       } catch (error) {
        throw new ConflictException(error)
        
       }
      }

      async getTaskDetailsByTaskId(taskId: number){
        try {
            const getData = await this.prisma.task.findUnique({
                where:{id:taskId },
                include:{
                    created_by:{select:{id:true,name:true}},
                    assigned_to:{select:{id:true,name:true}},
                }
            })
            return getData;
        } catch (error) {
            console.log(error)
            throw new ConflictException(error)
        }

            
      }
    
      // Get All Tasks (Created by or Assigned to User)
      async getTasks(userId: number): Promise<Task[]> {
        return await this.prisma.task.findMany({
          where: {
            OR: [
              { created_by_id: userId },
              { assigned_by_id: userId },
            ],
          },
        });
      }
    
      // Update Task
      async updateTask(taskId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        return await this.prisma.task.update({
          where: { id: taskId },
          data: updateTaskDto,
        });
      }
    
      // Delete Task
      async deleteTask(taskId: number): Promise<Task> {
        return await this.prisma.task.delete({
          where: { id: taskId },
        });
      }
}
