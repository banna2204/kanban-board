import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/task';

function trimValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value == 'string' && control.value.trim().length == 0) {
      return { trimm: true }
    }
    return null;
  }
}

function sequenceValidator(validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    for (let validator of validators) {
      if (validator(control)) {
        return validator(control);
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  priority:string='low'

  constructor(
    private dialogRef: MatDialogRef<AddTaskComponent>,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) { }

  taskForm = new FormGroup({
    title: new FormControl('', sequenceValidator([Validators.required, trimValidator()])),
    description: new FormControl('', sequenceValidator([Validators.required, trimValidator()]))
  });

  ngOnInit() {
    if (this.data) {
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description,
      });
    }
  }

  saveTask() {
    if (this.data) {
      this.taskService.updateTask({
        id: this.data.id,
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description!,
        status: this.data.status,
        date: Date.now(),
        priority : this.priority as | 'low' | 'medium' | 'high'
      });
    }
    else {
      this.taskService.addTask({
        id: Date.now(),
        title: this.taskForm.value.title?.trim(),
        description: this.taskForm.value.description?.trim(),
        status: 'todo',
        date: Date.now(),
        priority : this.priority
      });
    }
    this.dialogRef.close();
  }

  cancelTask() {
  const title = this.taskForm.get('title')?.value?.trim();
  const description = this.taskForm.get('description')?.value?.trim();
  if (this.data) {
    const isChanged = this.data.title !== title || this.data.description !== description;
    if (isChanged) {
      const userConfirm = confirm('Are you sure you want to cancel?');
      if (userConfirm) {
        this.dialogRef.close();
      }
      return;
    }
    this.dialogRef.close();
    return;
  }
  const hasValue = title || description;
  if (hasValue) {
    const userConfirm = confirm('Are you sure you want to cancel?');
    if (userConfirm) this.dialogRef.close();
    return;
  }
  this.dialogRef.close();
  }

  priorityTask(priority:string){
    this.priority = priority;
  }
}