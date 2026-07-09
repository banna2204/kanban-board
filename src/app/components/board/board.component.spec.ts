import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { DragDropModule,CdkDragDrop,CdkDropList,} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Task } from 'src/app/task';
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from 'src/app/capitalize.pipe';
import { MatSelectModule } from '@angular/material/select';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let service: TaskService;
  const dialogSpy = jasmine.createSpyObj('MatDialog',['open'])
  interface MasterArray {
    todo: Task[];
    inProgress: Task[];
  }

  beforeEach(() => {
    localStorage.clear()
    TestBed.configureTestingModule({
      imports: [DragDropModule, MatDialogModule, MatFormFieldModule,MatInputModule,MatSelectModule,BrowserAnimationsModule,MatIconModule],
      declarations: [BoardComponent,CapitalizePipe],
      providers: [ { provide: MatDialog, useValue: dialogSpy },TaskService],
    });
    
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should tasks in same container', () => {
    component.todoTasks = [
      {id: 2,title: 'Git',status: 'todo',description: 'git',date: 1,priority: 'high',},
      {id: 3,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
      {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high',},
    ];

    const mockMasterArray = {
      todo: [
        {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high',},
        { id: 2, title: 'Git', status: 'todo', description: 'git', date: 1,priority: 'high', },
        { id: 3, title: 'HTML', status: 'todo', description: 'html', date: 1,priority: 'high', },
      ],
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

    localStorage.setItem('masterArray',JSON.stringify(mockMasterArray));

    component.drop(event, 'todo');
    expect(component.todoTasks[2].id).toBe(1);
  });

  it('should tasks in diffrent container', () => {
    component.todoTasks = [
      {id: 3,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
      {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high',},
    ];

    component.inProgressTask = [
      {id: 2,title: 'Git',status: 'todo',description: 'git',date: 1,priority: 'high',},
      {id: 4,title: 'Github',status: 'todo',description: 'git',date: 1,priority: 'high',},
    ];

    const mockMasterArray = {
      todo: [
        {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high',},
        {id: 3,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
      ],
      inProgress: [
        {id: 2,title: 'Git',status: 'todo',description: 'git',date: 1,priority: 'high',},
        {id: 4,title: 'Github',status: 'todo',description: 'git',date: 1,priority: 'high',},
      ],
    };

    const previousContainer = {
      data: component.todoTasks,
      id: 'todo'
    } as CdkDropList<Task[]>;

    const container = {
      data: component.inProgressTask,
    } as CdkDropList<Task[]>;

    const event = {
      previousContainer: previousContainer,
      container: container,
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<Task[]>;

    localStorage.setItem('masterArray',JSON.stringify(mockMasterArray));
    component.drop(event, 'inProgress');
    expect(component.todoTasks.length).toBe(1);
  });

  it('should get data is execute', () => {
    const parse = {
      todo: [
        {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high',},
        {id: 3,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
      ],
      completed: [
        {id: 2,title: 'Git',status: 'completed',description: 'git',date: 1,priority: 'high',},
        {id: 4,title: 'Github',status: 'completed',description: 'git',date: 1,priority: 'high',},
      ],
    };

    const mockData = {
      completed: [
        {id: 2,title: 'Git',status: 'completed',description: 'git',date: 1,priority: 'high',},
        {id: 4,title: 'Github',status: 'completed',description: 'git',date: 1,priority: 'high',},
      ],
    };
    const result = component.getData('completed', parse);
    expect(result).toEqual(mockData.completed);
  });

  it('should initial function execute', () => {
    const mockMasterArray = {
      todo: [
        { id: 1, title: 'Angular', status:'todo', description: 'abcd', date: 1 },
      ],
      inProgress: [
        { id: 2, title: 'Git', status: 'inProgress', description: 'git', date: 1 },
        { id: 4, title: 'Github', status: 'inProgress', description: 'git', date: 1 },
      ],
      completed: [
        { id: 2, title: 'Git', status: 'completed', description: 'git', date: 1 },
        { id: 4, title: 'Github', status: 'completed', description: 'git', date: 1 },
      ]
    };

    localStorage.setItem('masterArray',JSON.stringify(mockMasterArray));
    service.saveData(mockMasterArray);
    expect(mockMasterArray.todo).toEqual(component.todoTasks)
  })

  it('should undo button execute', () => {
    const mockMasterArray = {
      todo: [
        {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,},
      ],
      inProgress: [
        {id: 2,title: 'Git',status: 'inProgress',description: 'git',date: 1,},
        {id: 4,title: 'Github',status: 'inProgress',description: 'git',date: 1,},
      ],
      completed: [
        {id: 3,title: 'Git',status: 'completed',description: 'git',date: 1,},
        {id: 5,title: 'Github',status: 'completed',description: 'git',date: 1,},
      ],
    };

    component.lastMove = {id: 1,fromStatus: 'todo',toStatus: 'completed',fromIndex: 0,toIndex: 1,};
    localStorage.setItem('masterArray',JSON.stringify(mockMasterArray));
    component.undoClick();
    expect(component.todoTasks.length).toBe(2)
  });

  it('should redo button execute', () => {
    const mockMasterArray = {
      todo: [
        {id: 1,title: 'Angular',status: 'todo',description: 'abcd', date: 1,},
      ],
      inProgress: [
        {id: 2,title: 'Git',status: 'inProgress',description: 'git',date: 1,},
        {id: 4,title: 'Github',status: 'inProgress',description: 'git',date: 1,},
      ],
      completed: [
        {id: 3,title: 'Git',status: 'completed', description: 'git', date: 1,},
        {id: 5,title: 'Github',status: 'completed',description: 'git', date: 1,},
      ],
    };

    component.redoMove = {id: 1,fromStatus: 'todo',toStatus: 'completed',fromIndex: 0,toIndex: 1,};
    localStorage.setItem('masterArray',JSON.stringify(mockMasterArray));
    component.redoClick();
    expect(component.completeTasks.length).toBe(3);
  });

  it('should task delete',() => {
    const mockMasterArray:MasterArray = {
      todo: [
        { id: 1, title: 'Angular', status:'todo', description: 'abcd', date: 1,priority: 'high' },
      ],
      inProgress: [
        { id: 2, title: 'Git', status: 'inProgress', description: 'git', date: 1,priority: 'high' },
        { id: 4, title: 'Github', status: 'inProgress', description: 'git', date: 1,priority: 'high' },
      ],
    };
    
    localStorage.setItem('masterArray',JSON.stringify(mockMasterArray));
    component.deleteTask(mockMasterArray.inProgress[0])
    expect(component.inProgressTask.length).toBe(1)
  })

  it('should open AddTaskComponent dialog', () => {
  component.openDialog();
  expect(dialogSpy.open).toHaveBeenCalledWith(AddTaskComponent, {
    width: '500px',
  });
});

  it('should edit dialog open', () => {
  const mockTask: Task = {id: 1,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'high'};

  component.editTask(mockTask);
  expect(dialogSpy.open).toHaveBeenCalledWith(AddTaskComponent, {
    width: '500px',
    data: mockTask
  });
});

  it('should get inputdata to filter array',()=> {
    component.todoTasks =  [
      {id: 1,title: 'c',status: 'todo',description: 'abcd',date: 1,priority: 'low',},
      {id: 2,title: 'ng',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ]
    component.inProgressTask =  [
      {id: 3,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'low',},
      {id: 4,title: 'ng',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ]
    component.completeTasks =  [
      {id: 5,title: 'py',status: 'todo',description: 'abcd',date: 1,priority: 'low',},
      {id: 6,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
      {id: 7,title: 'js',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ]    

    const event = {
      target : {
        value : 'ng'
      } 
    } as unknown as Event;

    component.onInput(event);
    expect(component.filterTodoTasks.length).toEqual(1)
    expect(component.filterInProgressTask.length).toEqual(2)
    expect(component.filterCompleteTasks.length).toEqual(0)
  })

  it('should filter data using priority', () => {
    component.todoTasks =  [
      {id: 1,title: 'c',status: 'todo',description: 'abcd',date: 1,priority: 'low',},
      {id: 2,title: 'ng',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ]
    component.inProgressTask =  [
      {id: 3,title: 'Angular',status: 'todo',description: 'abcd',date: 1,priority: 'low',},
      {id: 4,title: 'ng',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ]
    component.completeTasks =  [
      {id: 5,title: 'py',status: 'todo',description: 'abcd',date: 1,priority: 'low',},
      {id: 6,title: 'HTML',status: 'todo',description: 'html',date: 1,priority: 'high',},
      {id: 7,title: 'js',status: 'todo',description: 'html',date: 1,priority: 'high',},
    ]    
    
    component.getFilterData('high');
    expect(component.filterTodoTasks.length).toEqual(1)
    expect(component.filterInProgressTask.length).toEqual(1)
    expect(component.filterCompleteTasks.length).toEqual(2)
  })
});