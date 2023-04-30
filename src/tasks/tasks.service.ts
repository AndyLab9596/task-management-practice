import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { DeleteResult, Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = this.taskRepository.find();
    return tasks;
  }

  async getTaskByFilter({
    status,
    search,
  }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder();

    if (status) {
      query.andWhere('status = :status', { status });
    }

    if (search) {
      query.andWhere('(title LIKE :search OR description LIKE :search)', {
        search: `%${search}%`,
      });
    }

    const tasks = query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.taskRepository.findOneBy({ id });
    if (!foundTask) throw new NotFoundException();
    return foundTask;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async updateTaskStatus(
    id: string,
    { status }: UpdateTaskStatusDto,
  ): Promise<Task> {
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ status })
      .where('id = :id', { id })
      .execute();
    const updatedTask = this.getTaskById(id);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    const res = await this.taskRepository.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException();
    }
    return res;
  }
}
