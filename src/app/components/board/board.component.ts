import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../task'
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  tasks: Task[] = [];

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  openDialog() {
    this.dialog.open(AddTaskComponent, {
      width: '500px'
    });
  }

  editTask(task: Task) {
  this.dialog.open(AddTaskComponent, {
    width: '500px',
    data: task
  });
  }

  getTasks(status: string) {
    return this.tasks.filter(task => task.status === status);
  }

}