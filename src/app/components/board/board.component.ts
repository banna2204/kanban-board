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
  todoTasks: Task[] = [];
  inProgressTask: Task[] = [];
  completeTasks: Task[] = [];
  filterTodoTasks: Task[] = [];
  filterInProgressTask: Task[] = [];
  filterCompleteTasks: Task[] = [];
  lastMove = { id: 0, fromStatus: '', toStatus: '', fromIndex: 0, toIndex: 0 };
  redoMove = { id: 0, fromStatus: '', toStatus: '', fromIndex: 0, toIndex: 0 };
  newDate = new Date().toLocaleDateString();

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.taskService.tasks.subscribe((data:any) => {
      // const priorityOrder = {
      // high : 1,
      // medium : 2,
      // low : 3
      // }
      this.todoTasks = this.filterTodoTasks = data.todo;
      // this.filterTodoTasks.sort((a,b)=> priorityOrder[a.priority] - priorityOrder[b.priority])
      this.inProgressTask = this.filterInProgressTask = data.inProgress;
      // this.filterInProgressTask.sort((a,b)=> priorityOrder[a.priority] - priorityOrder[b.priority])
      this.completeTasks = this.filterCompleteTasks = data.completed;
      // this.filterCompleteTasks.sort((a,b)=> priorityOrder[a.priority] - priorityOrder[b.priority])
    });
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

  deleteTask(task: Task){
    this.taskService.deleteTask(task);
  }

  getData(status: string, parse:any) {
    switch (status) {
      case 'todo': return parse.todo;
      case 'inProgress': return parse.inProgress;
      case 'completed': return parse.completed;
      default:
        return [];
    }
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    const parse = JSON.parse(localStorage.getItem('masterArray') || '{}');
    this.lastMove = {
        id: event.previousContainer.data[event.previousIndex].id,
        fromStatus: event.previousContainer.data[event.previousIndex].status,
        toStatus: status,
        fromIndex: event.previousIndex,
        toIndex: event.currentIndex,
      };
    if (event.previousContainer === event.container) {
      moveItemInArray(this.getData(status,parse), event.previousIndex, event.currentIndex);
    } else {
      const source = this.getData(event.previousContainer.id,parse); 
      const destination = this.getData(status,parse);
      transferArrayItem(source,destination,event.previousIndex,event.currentIndex,);
      destination[event.currentIndex]['status'] = status as | 'todo' | 'inProgress' | 'completed';
      destination[event.currentIndex].date = Date.now();
    }
    this.taskService.saveData(parse);
  }

  undoClick() {
    if(this.lastMove.id == 0) return;
    const parse = JSON.parse(localStorage.getItem('masterArray') || '{}');
    const source = this.getData(this.lastMove.toStatus, parse);
    const destination = this.getData(this.lastMove.fromStatus, parse);
    transferArrayItem(source,destination,this.lastMove.toIndex,this.lastMove.fromIndex,);
    const movedTask = destination[this.lastMove.fromIndex];
    if (movedTask) {
      movedTask.status = this.lastMove.fromStatus as | 'todo' | 'inProgress' | 'completed'}
    this.taskService.saveData(parse);
    this.redoMove = this.lastMove;
    this.lastMove = { id: 0, fromStatus: '', toStatus: '', fromIndex: 0, toIndex: 0 };
  }

  redoClick() {
    if(this.redoMove.id == 0) return;
    const parse = JSON.parse(localStorage.getItem('masterArray') || '{}');
    const source = this.getData(this.redoMove.fromStatus, parse);
    const destination = this.getData(this.redoMove.toStatus, parse);
    transferArrayItem(source,destination,this.redoMove.fromIndex,this.redoMove.toIndex,);
    const movedTask = destination.find((task: Task) => task.id === this.redoMove.id,);
    if (movedTask) movedTask.status = this.redoMove.toStatus as | 'todo' | 'inProgress'| 'completed'; 
    this.redoMove = { id: 0, fromStatus: '', toStatus: '', fromIndex: 0, toIndex: 0 };
    this.taskService.saveData(parse);
  }

  onInput(event:Event){
    let inputData = (event.target as HTMLInputElement).value.trim().toLowerCase()
    this.filterTodoTasks = this.todoTasks.filter((task:Task)=> task.priority.includes
    (inputData) || task.title.includes(inputData));
    this.filterInProgressTask = this.inProgressTask.filter((task:Task)=> task.priority.includes(inputData) || task.title.includes(inputData));
    this.filterCompleteTasks = this.completeTasks.filter((task:Task)=> task.priority.includes(inputData) || task.title.includes(inputData));
  }
}
