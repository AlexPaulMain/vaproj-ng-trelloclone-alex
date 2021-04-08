import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskModel } from 'src/app/models/task.model';
import { AlertService } from 'src/app/services/alert.service';
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

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {}

  /**
   * Open task dialog and input required data.
   * Update task information or delete task depending on dialog output
   * data on close
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTaskComponent, {
      data: {
        id: this.task.id,
        heading: this.task.heading,
        description: this.task.description,
        start_date: this.task.start_date,
        target_date: this.task.target_date,
        user: this.task.user,
      },
      width: '400px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((formData) => {
      // update api
      if (formData === 'delete') {
        // make api task delete call
        this.taskService
          .deleteTask(this.task.id, this.sectionId)
          .subscribe((tasks) => {
            this.outputTasks(tasks);
            console.log('Updated tasks from api:', tasks);
            this.alertService.addAlert('delete', 'Task Deleted', 'Close');
          });
      } else if (formData !== undefined) {
        // update task in database
        this.taskService
          .updateTask(this.task.id, formData, this.sectionId)
          .subscribe((tasks) => {
            this.outputTasks(tasks);
            console.log('Updated tasks from api:', tasks);
            this.alertService.addAlert('success', 'Task Updated', 'Close');
          });
      }
    });
  }

  /**
   * Output given tasks array to parent component
   * @param tasks tasks array of type TaskModel[]
   */
  outputTasks(tasks: TaskModel[]): void {
    this.tasksOutput.emit(tasks);
  }
}
