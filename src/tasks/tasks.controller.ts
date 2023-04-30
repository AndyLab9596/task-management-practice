import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTasks(@Query() getTaskFilterDto: GetTasksFilterDto) {
    if (Object.keys(getTaskFilterDto).length > 0) {
      return this.tasksService.getTaskByFilter(getTaskFilterDto);
    }
    return this.tasksService.getAllTasks();
  }

  @Get('/:taskId')
  async getTaskById(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:taskId/status')
  async UpdateTaskStatusDto(
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const updatedTask = await this.tasksService.updateTaskStatus(
      taskId,
      updateTaskStatusDto,
    );
    return updatedTask;
  }

  @Delete('/:taskId')
  async deleteTask(@Param('taskId') taskId: string) {
    await this.tasksService.deleteTask(taskId);
  }
}
