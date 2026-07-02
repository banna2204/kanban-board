import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../task';
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTask: Task[] = [];
  completeTasks: Task[] = [];
  latestOrder: number = -1;
  latestStatus: string = '';
  task: Task = { id: 0, title: '', description: '', date: Date.now(), status: '' as 'todo' | 'inProgress' | 'completed', };
  targetIndex: number = -1;
  originalIndex: number = -1;
  redoStatus: string = '';
  newDate = new Date().toLocaleDateString()

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.taskService.tasks.subscribe((tasks: any) => {
      this.todoTasks = tasks.todo
    });
    // this.todoTasks = this.tasks.filter((task) => task.status === 'todo');
    // this.inProgressTask = this.tasks.filter((task) => task.status === 'inProgress',);
    // this.completeTasks = this.tasks.filter((task) => task.status === 'completed',);
  }

  openDialog() {
    this.dialog.open(AddTaskComponent, {
      width: '500px',
    });
  }

  editTask(task: Task) {
    this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: task,
    });
  }

  // getNeighboreTask(event: CdkDragDrop<Task[]>) {
  //   let neighbore = event.container.data[event.currentIndex];
  //   if (neighbore) {
  //     this.targetIndex = this.tasks.findIndex((item) => item.id === neighbore.id);
  //   } else {
  //     this.targetIndex = this.tasks.length;
  //   }
  //   return this.targetIndex;
  // }

  // movedTask(event: CdkDragDrop<Task[]>) {
  //   let movedtask = event.container.data[event.previousIndex];
  //   this.latestStatus = movedtask.status;
  //   this.originalIndex = this.tasks.findIndex((task) => task.id == movedtask.id,);
  //   return this.originalIndex;
  // }

  getData(status:string){
    let data;
    const parse = JSON.parse(localStorage.getItem('masterArray') || '[[]]');
    if (status == 'todo') data = parse.todo;
      else if (status == 'completed') data = parse.completed;
      else if (status == 'inProgress') data = parse.inProgress;
      console.log(data)
      return {data,parse};
    }
    
    drop(event: CdkDragDrop<Task[]>, status: string) {
      if (event.previousContainer === event.container) {
      this.latestStatus = event.container.data[event.previousIndex].status
      let data = this.getData(status);
      moveItemInArray(data.data, event.previousIndex, event.currentIndex);
      this.taskService.saveData(data.parse);
    } else {
      let data = this.getData(status);
      console.log(data.data)
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex,);
      // this.task = event.container.data[event.currentIndex];
      // this.latestStatus = this.task.status
      // this.task.status = status as 'todo' | 'inProgress' | 'completed';
      // this.task.date = Date.now();
      // this.taskService.saveData(this.tasks);
    }
    this.task = event.container.data[event.currentIndex];
  }

  undoClick() {
    if (this.latestStatus == '') return;
    if (this.originalIndex !== -1) {
      let data = this.tasks[this.originalIndex];
      this.tasks[this.originalIndex] = this.tasks[this.targetIndex];
      this.tasks[this.targetIndex] = data;
    }
    this.redoStatus = this.task.status;
    this.task.status = this.latestStatus as 'todo' | 'inProgress' | 'completed';
    this.taskService.updateTask(this.task);
    this.latestStatus = '';
  }

  redoClick() {
    if (this.redoStatus == '') return;
    if (this.originalIndex !== -1) {
      let data = this.tasks[this.originalIndex];
      this.tasks[this.originalIndex] = this.tasks[this.targetIndex];
      this.tasks[this.targetIndex] = data;
    }
    this.task.status = this.redoStatus as 'todo' | 'inProgress' | 'completed';
    this.taskService.updateTask(this.task);
    this.redoStatus = '';
  }
}
