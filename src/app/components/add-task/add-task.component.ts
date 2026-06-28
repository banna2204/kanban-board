import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  constructor(
    private fb: FormBuilder,
   private dialogRef: MatDialogRef<AddTaskComponent>,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {}

  taskForm = this.fb.group({
    title:['',Validators.required],
    description:['',Validators.required]
  });

  ngOnInit() {
    if (this.data) {
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description
      });
    }
  }

  saveTask() {
    if (this.taskForm.invalid) {
      return;
    }
  if (this.data) {
    this.taskService.updateTask({
      id: this.data.id,
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description!,
      status: this.data.status
    });
  }
  else {
    this.taskService.addTask({
      id: Date.now(),
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description!,
      status: 'todo'
    });
  }
  this.dialogRef.close();
}
}