import {
  Component,
  Input,
  OnInit,
  Inject,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TaskModel } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task: TaskModel;
  @Input() sectionId: number;
  @Output() tasksOutput = new EventEmitter<TaskModel[]>();

  constructor(private dialog: MatDialog, private taskService: TaskService) {}

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTaskComponent, {
      data: {
        heading: this.task.heading,
        description: this.task.description,
        start_date: this.task.start_date,
        target_date: this.task.target_date,
        user: this.task.user,
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((formData) => {
      // update api
      if (formData == 'delete') {
        //make api task delete call
        this.taskService
          .deleteTask(this.task.id, this.sectionId)
          .subscribe((tasks) => {
            this.outputTasks(tasks);
            console.log(tasks);
          });
        console.log('DELETED TASK');
      } else if (formData != undefined) {
        this.taskService
          .updateTask(this.task.id, formData, this.sectionId)
          .subscribe((tasks) => {
            this.outputTasks(tasks);
            console.log(tasks);
          });
      }
    });
  }

  outputTasks(tasks: TaskModel[]) {
    this.tasksOutput.emit(tasks);
  }
}
