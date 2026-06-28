import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'));
  tasks$ = this.tasksSubject.asObservable();

  constructor() {}

  private saveTasks(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  // getTasks() {
  //   return this.tasksSubject.value;
  // }

  addTask(task: Task) {
    const tasks = [...this.tasksSubject.value, task];
    this.saveTasks(tasks);
  }

  updateTask(updatedTask: Task) {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    this.saveTasks(tasks);
  }
}
