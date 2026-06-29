import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'));
  tasks = this.tasksSubject.asObservable();

  constructor() {}

  addTask(task: Task) {
    const tasks = [...this.tasksSubject.value, task];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  updateTask(updatedTask: Task) {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}