import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dto';
import { TasksService } from './tasks.service';
import { Task } from 'generated/prisma';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {}
    @Post('new')
  async createTask(@Req() req: Request,@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const user = req['user'];
    return this.taskService.createTask(createTaskDto, user.id);
  }

  @Get('assignedTo')
  async getAssignedTasksToId(){
    return this.taskService.getAssignedTasksToId();
  }

    @Get('allTasks')
    async getAllTasksData() {
        return this.taskService.getAllTasks();
    }

    @Get('high-priority')
    async getHighPriorityTasks(){
        const higyPrioryTask = 'HIGH';
        return this.taskService.getHighPriorityTasks(higyPrioryTask);
    }
    @Get('low-priority')
    async getLowPriorityTasks(){
        const lowPrioryTask = 'LOW';
        return this.taskService.getHighPriorityTasks(lowPrioryTask);
    }
    @Get('medium-priority')
    async getmediumPriorityTasks(){
        const mediumPrioryTask = 'MEDIUM';
        return this.taskService.getHighPriorityTasks(mediumPrioryTask);
    }

    @Get('my-tasks')
    async getAllMyTasks(@Req() req: Request){
        const user = req['user'];
        return this.taskService.getAllMyTasks(user.id);
    }

    @Get('created')
    async getCreatedTasks(@Req() req: Request){
        const user = req['user'];
        return this.taskService.getCreatedTasks(user.id);
    }

    @Get('overdue')
    async getOverdueTasks(@Req() req: Request){
        const user = req['user'];
        return this.taskService.getOverdueTasks(user.id);
    }



  @Get('/:id')
  async getTasksById(@Param('id',ParseIntPipe) id: number) {
    return this.taskService.getTaskDetailsByTaskId(id);
  }

  @Patch('/:id')
  async updateTask(@Param('id',ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id',ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.deleteTask(id);
  }
}
