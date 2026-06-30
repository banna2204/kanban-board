import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../task'
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTask: Task[] = [];
  completeTasks: Task[] = [];
  latestOrder: number = -1;
  latestStatus: string = '';
  task: Task = { id: 0, title: '', description: '', date: Date.now(), status: '' as "todo" | "inProgress" | "completed" }
  targetIndex: number = -1;
  originalIndex: number = -1;
  redoStatus:string=''


  constructor(
    private dialog: MatDialog,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskService.tasks.subscribe(tasks => {
      this.tasks = tasks;
      this.todoTasks = this.tasks.filter(task => task.status === 'todo')
      this.inProgressTask = this.tasks.filter(task => task.status === 'inProgress')
      this.completeTasks = this.tasks.filter(task => task.status === 'completed')
    });
  }

  openDialog() {
    this.dialog.open(AddTaskComponent, {
      width: '500px'
    })
  }

  editTask(task: Task) {
    this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: task
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    if (event.previousContainer === event.container) {
      let currTask = event.container.data;
      let movedtask = currTask[event.previousIndex];
      this.latestStatus = movedtask.status
      this.originalIndex = this.tasks.findIndex((task) => task.id == movedtask.id)
      let neighbore = currTask[event.currentIndex]
      if (neighbore) {
        this.targetIndex = this.tasks.findIndex(item => item.id === neighbore.id);
      } else {
        this.targetIndex = this.tasks.length;
      }
      moveItemInArray(this.tasks, this.originalIndex, this.targetIndex)
      this.taskService.saveData(this.tasks)

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
      let task = event.container.data[event.currentIndex];
      this.latestStatus = task.status;
      task.status = status as "todo" | "inProgress" | "completed";
      this.taskService.updateTask(task);
      task.date = Date.now();
    }
    this.task = event.container.data[event.currentIndex];
  }

  undoClick() {
    if (this.latestStatus == '') return;
    if (this.originalIndex !== -1) {
      let data = this.tasks[this.originalIndex]
      this.tasks[this.originalIndex] = this.tasks[this.targetIndex];
      this.tasks[this.targetIndex] = data;
    }
    this.redoStatus = this.task.status;
    this.task.status = this.latestStatus as "todo" | "inProgress" | "completed";
    this.taskService.updateTask(this.task);
    this.latestStatus=''
  }

  redoClick() {
    if (this.redoStatus == '') return;
    if (this.originalIndex !== -1) {
      let data = this.tasks[this.originalIndex]
      this.tasks[this.originalIndex] = this.tasks[this.targetIndex];
      this.tasks[this.targetIndex] = data;
    }
    this.task.status = this.redoStatus as "todo" | "inProgress" | "completed";
    this.taskService.updateTask(this.task);
    this.redoStatus = ''
  }
}