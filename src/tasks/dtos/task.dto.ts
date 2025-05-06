// create-task.dto.ts

import { IsNotEmpty, IsString, IsDateString, IsEnum, IsInt } from 'class-validator';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  due_date: string;

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNotEmpty()
  @IsInt()
  assigned_by_id: number;
}

  
  // update-task.dto.ts
  
  export class UpdateTaskDto {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: string;
    status?: string;
    assigned_by_id?: number;
  }