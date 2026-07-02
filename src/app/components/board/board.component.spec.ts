import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/task';
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let service: jasmine.SpyObj<TaskService>;
  const tasksSubject = new BehaviorSubject<Task[]>([]);

  beforeEach(() => {
    service = jasmine.createSpyObj('TaskService', ['saveData', 'updateTask'], {
      tasks: new BehaviorSubject<Task[]>([]).asObservable(),
    });

    TestBed.configureTestingModule({
      imports: [DragDropModule, MatDialogModule],
      declarations: [BoardComponent],
      providers: [
        {
          provide: TaskService,
          useValue: service,
        },
      ],
    });
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should tasks in same container', () => {
    component.tasks = [
      { id: 1, title: 'Angular', status: 'todo' } as Task,
      { id: 2, title: 'Git', status: 'todo' } as Task,
      { id: 3, title: 'HTML', status: 'todo' } as Task,
    ];

    component.todoTasks = [...component.tasks];
    const container = {
      data: component.todoTasks,
    } as CdkDropList<Task[]>;

    const event = {
      previousContainer: container,
      container: container,
      previousIndex: 0,
      currentIndex: 2,
    } as CdkDragDrop<Task[]>;

    component.drop(event, 'todo');
    expect(service.saveData).toHaveBeenCalled();
    expect(component.tasks[2].id).toBe(1);
  });

  it('should update status and call updateTask when moved to another container', () => {
    const task = {
      id: 1,
      title: 'Angular',
      status: 'todo',
    } as Task;

    component.todoTasks = [task];
    component.inProgressTask = [];

    const previousContainer = {
      data: component.todoTasks,
    } as CdkDropList<Task[]>;

    const currentContainer = {
      data: component.inProgressTask,
    } as CdkDropList<Task[]>;

    const event = {
      previousContainer,
      container: currentContainer,
      previousIndex: 0,
      currentIndex: 0,
    } as CdkDragDrop<Task[]>;

    component.drop(event, 'inProgress');
    expect(task.status).toBe('inProgress');
    expect(service.updateTask).toHaveBeenCalledWith(task);
  });

  it('should return if latestStatus is empty', () => {
    component.latestStatus = '';
    component.undoClick();
    expect(service.updateTask).not.toHaveBeenCalled();
  });

  it('should undo task status and swap tasks', () => {
    component.tasks = [
      { id: 1, status: 'todo' } as Task,
      { id: 2, status: 'completed' } as Task,
    ];

    component.originalIndex = 0;
    component.targetIndex = 1;
    component.task = component.tasks[1];
    component.latestStatus = 'todo';
    component.undoClick();

    expect(component.tasks[0].id).toBe(2);
    expect(component.tasks[1].id).toBe(1);
    expect(component.task.status).toBe('todo');
    expect(component.redoStatus).toBe('completed');
    expect(service.updateTask).toHaveBeenCalledWith(component.task);
    expect(component.latestStatus).toBe('');
  });

  it('should return if redoStatus is empty', () => {
    component.redoStatus = '';
    component.redoClick();
    expect(service.updateTask).not.toHaveBeenCalled();
  });

  it('should redo task status', () => {
    component.tasks = [
      { id: 1, status: 'todo' } as Task,
      { id: 2, status: 'completed' } as Task,
    ];

    component.originalIndex = 0;
    component.targetIndex = 1;
    component.task = component.tasks[1];
    component.redoStatus = 'completed';
    component.redoClick();

    expect(component.tasks[0].id).toBe(2);
    expect(component.tasks[1].id).toBe(1);
    expect(component.task.status).toBe('completed');
    expect(service.updateTask).toHaveBeenCalledWith(component.task);
    expect(component.redoStatus).toBe('');
  });
  
  it('should open add task dialog', () => {
  const dialog = TestBed.inject(MatDialog);
  spyOn(dialog, 'open');
  component.openDialog();
  expect(dialog.open).toHaveBeenCalledWith(AddTaskComponent, {
    width: '500px'
  });
});

  it('should open edit dialog with task data', () => {
  const dialog = TestBed.inject(MatDialog);
  spyOn(dialog, 'open');

  const task: Task = {
    id: 1,
    title: 'Angular',
    description: 'Learn',
    status: 'todo',
    date:1
  };

  component.editTask(task);
  expect(dialog.open).toHaveBeenCalledWith(AddTaskComponent, {
    width: '500px',
    data: task
  });

});
});
