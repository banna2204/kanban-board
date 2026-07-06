import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { Task } from '../task';

describe('TaskService', () => {
  let service: TaskService;
  const parse = {
    todo: [
      {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high',},
      {id: 3,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ],
    completed: [
      {id: 2,title: 'Git',status: 'completed',description: 'git',date: 1,priority: 'high',},
      {id: 4,title: 'Github',status: 'completed',description: 'git',date: 1,priority: 'high',},
    ],
    inProgress: [
      {id: 2,title: 'Git',status: 'inProgress',description: 'git',date: 1,priority: 'high',},
      {id: 4,title: 'Github',status: 'inProgress',description: 'git',date: 1,priority: 'high',},
    ],
  };
      
    beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should add task', () => {
    localStorage.setItem('masterArray',JSON.stringify(parse));
    const task = {id: 5,title: 'js',status: 'todo',description: 'html',date: 1,priority: 'high',};

    service.addTask(task)
    const data = JSON.parse(localStorage.getItem('masterArray') || '{}')
    expect(data.todo.length).toEqual(3)
  })

  it('should task delete', () => {
    localStorage.setItem('masterArray',JSON.stringify(parse));
    service.deleteTask(parse.completed[0]);
    service.deleteTask(parse.todo[0]);
    service.deleteTask(parse.inProgress[0]);

    const data = JSON.parse(localStorage.getItem('masterArray') || '{}')
    expect(data.completed.length).toEqual(1);
    expect(data.todo.length).toEqual(1);
    expect(data.inProgress.length).toEqual(1);
  })

  it('should task update', () => {
    localStorage.setItem('masterArray',JSON.stringify(parse));
    const task = {id: 3,title: 'HTML5',status: 'todo',description: 'html5',date: 1,priority: 'high',};    

    service.updateTask(task);
    const data = JSON.parse(localStorage.getItem('masterArray') || '{}')
    expect(data.todo[1].title).toEqual('HTML5')

    const completeTask = {id: 2,title: 'angular',status: 'completed',description: 'git',date: 1,priority: 'high',};
    service.updateTask(completeTask);
    const updatedData = JSON.parse(localStorage.getItem('masterArray') || '{}')
    expect(updatedData.completed[0].title).toEqual('angular')

    const inProgressTask = {id: 2,title:'shubham',status: 'inProgress',description: 'git',date: 1,priority: 'high',};
    service.updateTask(inProgressTask);
    const updatedInProgress = JSON.parse(localStorage.getItem('masterArray') || '{}')
    expect(updatedInProgress.inProgress[0].title).toEqual('shubham')

  })
});
