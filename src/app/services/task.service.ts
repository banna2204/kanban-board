import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../task';

interface MasterArray {
  todo: Task[];
  inProgress: Task[];
  completed: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {
    if (!localStorage.getItem('masterArray')) {
      localStorage.setItem('masterArray',JSON.stringify({
          todo: [],
          inProgress: [],
          completed: [],
        }),
      );
    }
  }
  private tasksSubject = new BehaviorSubject<MasterArray>(
    JSON.parse(localStorage.getItem('masterArray') || JSON.stringify({
          todo: [],
          inProgress: [],
          completed: [],
        }),
    ),
  );

  tasks = this.tasksSubject.asObservable();

  addTask(task: any) {
    let parse = JSON.parse(localStorage.getItem('masterArray') || '[[]]');
    if (task.status === 'todo') {
      parse.todo.push(task);
    }
    this.saveData(parse);
  }

  saveData(parse: any) {
    localStorage.setItem('masterArray', JSON.stringify(parse));
    this.tasksSubject.next(parse);
  }

  updateTask(updatedTask: any) {
    const parse = JSON.parse(localStorage.getItem('masterArray') || '[[]]');
    let data;
    updatedTask.status == 'todo' ? data = parse.todo :
    updatedTask.status == 'completed' ? data = parse.completed : data = parse.inProgress;

    const updateTask = data.find((task: Task) => task.id === updatedTask.id);
    updateTask.title = updatedTask.title;
    updateTask.description = updatedTask.description;
    updateTask.priority = updatedTask.priority
    this.saveData(parse);
  }

  deleteTask(deleteTask : any){
    const parse = JSON.parse(localStorage.getItem('masterArray') || '[[]]');
    let data =
    deleteTask.status == 'todo' ? 'todo' : deleteTask.status == 'completed' ? 'completed'  : 'inProgress';
    parse[data] = parse[data].filter((task:Task) => task.id !== deleteTask.id);
    this.saveData(parse);
  }
}
