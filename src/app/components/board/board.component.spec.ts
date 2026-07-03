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
    component.todoTasks = [
      { id: 2, title: 'Git', status: 'todo', description: 'git', date: 1 },
      { id: 3, title: 'HTML', status: 'todo', description: 'html', date: 1 },
      { id: 1, title: 'Angular', status: 'todo', description: 'abcd', date: 1 },
    ];

    const mockMasterArray = {
      todo: [
        { id: 1, title: 'Angular', status: 'todo', description: 'abcd', date: 1 },
        { id: 2, title: 'Git', status: 'todo', description: 'git', date: 1 },
        { id: 3, title: 'HTML', status: 'todo', description: 'html', date: 1 },
      ]
    };

    const container = {
      data: component.todoTasks,
    } as CdkDropList<Task[]>;

    const event = {
      previousContainer: container,
      container: container,
      previousIndex: 0,
      currentIndex: 2,
    } as CdkDragDrop<Task[]>;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockMasterArray));

    component.drop(event, 'todo');
    expect(service.saveData).toHaveBeenCalled();
    expect(component.todoTasks[2].id).toBe(1);
  });

  it('should tasks in diffrent container', () => {
    component.todoTasks = [
      { id: 3, title: 'HTML', status: 'todo', description: 'html', date: 1 },
      { id: 1, title: 'Angular', status: 'todo', description: 'abcd', date: 1 },
    ];

    component.inProgressTask = [
      { id: 2, title: 'Git', status: 'todo', description: 'git', date: 1 },
      { id: 4, title: 'Github', status: 'todo', description: 'git', date: 1 },
    ];

    const mockMasterArray = {
      todo: [
        { id: 1, title: 'Angular', status: 'todo', description: 'abcd', date: 1 },
        { id: 3, title: 'HTML', status: 'todo', description: 'html', date: 1 },
      ],
      inProgress: [
        { id: 2, title: 'Git', status: 'todo', description: 'git', date: 1 },
        { id: 4, title: 'Github', status: 'todo', description: 'git', date: 1 },
      ]
    };

    const previousContainer = {
      data: component.todoTasks,
    } as CdkDropList<Task[]>;

    const container = {
      data: component.inProgressTask
    } as CdkDropList<Task[]>

    const event = {
      previousContainer: previousContainer,
      container: container,
      previousIndex: 1,
      currentIndex: 1,
    } as CdkDragDrop<Task[]>

    spyOn(localStorage,'setItem')
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockMasterArray));
    component.drop(event, 'inProgress');

    expect(service.saveData).toHaveBeenCalled();
  })

  it('should get data is execute', () => {
    const parse = {
      todo: [
        { id: 1, title: 'Angular', status: 'todo', description: 'abcd', date: 1 },
        { id: 3, title: 'HTML', status: 'todo', description: 'html', date: 1 },
      ],
      completed: [
        { id: 2, title: 'Git', status: 'completed', description: 'git', date: 1 },
        { id: 4, title: 'Github', status: 'completed', description: 'git', date: 1 },
      ]
    };

    const mockData = {
      completed: [
        { id: 2, title: 'Git', status: 'completed', description: 'git', date: 1 },
        { id: 4, title: 'Github', status: 'completed', description: 'git', date: 1 },
      ]
    }
    const result = component.getData('completed',parse);
    expect(result).toEqual(mockData.completed)
  })

  // it('should initial function execute', () => {
  //   const mockMasterArray = {
  //     todo: [
  //       { id: 1, title: 'Angular', status:'todo', description: 'abcd', date: 1 },
  //     ],
  //     inProgress: [
  //       { id: 2, title: 'Git', status: 'inProgress', description: 'git', date: 1 },
  //       { id: 4, title: 'Github', status: 'inProgress', description: 'git', date: 1 },
  //     ],
  //     completed: [
  //       { id: 2, title: 'Git', status: 'completed', description: 'git', date: 1 },
  //       { id: 4, title: 'Github', status: 'completed', description: 'git', date: 1 },
  //     ]
  //   };

  //   spyOn(localStorage,'setItem');
  //   spyOn(localStorage,'getItem').and.returnValue(JSON.stringify(mockMasterArray));

  //   service.saveData(mockMasterArray);
  //   expect(service.saveData).toHaveBeenCalled()
  //   expect(mockMasterArray.todo).toEqual(component.todoTasks)
  // })

  // it('should undo button execute', () => {
  //   const mockMasterArray = {
  //     todo: [
  //       { id: 1, title: 'Angular', status:'todo', description: 'abcd', date: 1 },
  //     ],
  //     inProgress: [
  //       { id: 2, title: 'Git', status: 'inProgress', description: 'git', date: 1 },
  //       { id: 4, title: 'Github', status: 'inProgress', description: 'git', date: 1 },
  //     ],
  //     completed: [
  //       { id: 2, title: 'Git', status: 'completed', description: 'git', date: 1 },
  //       { id: 4, title: 'Github', status: 'completed', description: 'git', date: 1 },
  //     ]
  //   };

  //   component.lastMove = {
  //       id: 1,
  //       fromStatus: 'todo',
  //       toStatus: 'completed',
  //       fromIndex: 0,
  //       toIndex: 0,
  //     };

  //   component.undoClick();
  //   // expect(service.saveData).toHaveBeenCalled()
  // })
}); 