import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../task'
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { timestamp } from 'rxjs';

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

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskService.tasks.subscribe(tasks => {
      this.tasks = tasks;
    });

    this.todoTasks = this.tasks.filter(task => task.status === 'todo');
    this.inProgressTask = this.tasks.filter(task => task.status === 'inProgress')
    this.completeTasks = this.tasks.filter(task => task.status === 'completed');
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px'
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  getData() {
    this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

    this.todoTasks = this.tasks.filter(task => task.status === 'todo');
    this.inProgressTask = this.tasks.filter(task => task.status === 'inProgress')
    this.completeTasks = this.tasks.filter(task => task.status === 'completed');
  }


  editTask(task: Task) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: task
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
    let task = event.container.data[event.currentIndex];
    task.status = status as "todo" | "inProgress" | "completed";
    task.id = Date.now();
    this.taskService.updateTask(task);
  }
}