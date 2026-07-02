import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(JSON.parse(localStorage.getItem('masterArray') || '[[]]'));
  tasks = this.tasksSubject.asObservable();

  constructor() {
    if (!localStorage.getItem('masterArray')) {
      localStorage.setItem('masterArray', JSON.stringify({
        todo: [],
        progress: [],
        complete: []
      }));
    }
  }

  addTask(task: any) {
    let parse = JSON.parse(localStorage.getItem('masterArray') || '[[]]');
    if (task.status === 'todo') {
      parse.todo.push(task);
    }
    else if(task.status === 'inProgress') {
      parse.progress.push(task);
    }
    else if(task.status === 'completed') {
      parse.complete.push(task);
    }
    this.saveData(parse)
  }

  saveData(parse:Task[]){
    localStorage.setItem('masterArray', JSON.stringify(parse));
    this.tasksSubject.next(parse);
  }

  updateTask(updatedTask: Task) {
    const parse = JSON.parse(localStorage.getItem('masterArray') || '[[]]')
    let data;
    if(updatedTask.status == 'todo')  data = parse.todo;
    else if(updatedTask.status == 'completed') data = parse.completed;
    else if(updatedTask.status == 'inProgress') data = parse.inProgress;

    const updateTask = data.find((task:Task) =>
      task.id === updatedTask.id 
    );
    updateTask.title = updatedTask.title;
    updateTask.description = updatedTask.description;
    this.saveData(parse)
  }
}