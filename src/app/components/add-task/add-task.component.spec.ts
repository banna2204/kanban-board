import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Task } from 'src/app/task';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddTaskComponent>>;
  const mockTask: Task = {
  id: 1,
  title: 'Angular',
  description: 'Testing',
  status: 'todo',
  date: 1,
  priority: 'high'
};

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [MatDialogModule,MatFormFieldModule,MatSelectModule,MatInputModule,FormsModule,ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [AddTaskComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close'])
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: null
        }
      ]
    });

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;

    dialogRef = TestBed.inject(
      MatDialogRef
    ) as jasmine.SpyObj<MatDialogRef<AddTaskComponent>>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form', () => {
    const form = component.taskForm;
    expect(form).toBeTruthy();

    form.get('title')?.setValue('');
    expect(form.get('title')?.valid).toBeFalse();

    form.get('description')?.setValue('     ');
    expect(form.get('description')?.valid).toBeFalse();

    form.get('title')?.setValue('Angular');
    expect(form.get('title')?.valid).toBeTrue();
  });

  it('should close dialog when form is empty', () => {
    component.taskForm.patchValue({
      title: '',
      description: ''
    });

    component.cancelTask();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog when user confirms', () => {
    component.data = null as any;
    component.taskForm.patchValue({
      title: 'Angular',
      description: 'Testing'
    });

    spyOn(window, 'confirm').and.returnValue(true);
    component.cancelTask();

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel?');
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not close dialog when user cancels confirmation', () => {
    component.data = null as any;
    component.taskForm.patchValue({
      title: 'Angular',
      description: 'Testing'
    });

    spyOn(window, 'confirm').and.returnValue(false);
    component.cancelTask();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog when edit data is unchanged', () => {
    component.data = mockTask

    component.taskForm.patchValue({
      title: 'Angular',
      description: 'Testing'
    });

    component.cancelTask();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog when edit data changed and user confirms', () => {
    component.data = mockTask

    component.taskForm.patchValue({
      title: 'React',
      description: 'Testing'
    });

    spyOn(window, 'confirm').and.returnValue(true);
    component.cancelTask();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not close dialog when edit data changed and user cancels', () => {
    component.data =mockTask

    component.taskForm.patchValue({
      title: 'React',
      description: 'Testing'
    });

    spyOn(window, 'confirm').and.returnValue(false);
    component.cancelTask();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should priority asign', () => {
    component.priorityTask('high');
    expect(component.priority).toEqual('high')
  })
});