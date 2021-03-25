import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SectionModel } from '../../models/section.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialogs/dialog-delete/dialog-delete.component';
import { SectionService } from 'src/app/services/section.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskModel } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  @Input() section: SectionModel;
  @Input() projectId: number;
  edit: boolean = false;
  editSectionForm: FormGroup;
  @Output() sectionsOutput = new EventEmitter<SectionModel[]>();
  addTask: boolean = false;
  addTaskForm: FormGroup;
  tasks: TaskModel[];
  userId: number = JSON.parse(localStorage.getItem('userSession')).id;

  constructor(
    private dialog: MatDialog,
    private sectionService: SectionService,
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.editSectionForm = this.formBuilder.group({
      heading: [this.section.heading, Validators.required],
      description: [this.section.description, Validators.required],
    });
    this.addTaskForm = this.formBuilder.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
      start_date: [''],
      target_date: [''],
      user: [this.userId],
    });
    //populate tasks array with tasks from api
    this.taskService
      .getTasks(this.section.id)
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.sectionService.storeTasks({ [this.section.id]: tasks });
      });
  }

  onEditClick() {
    this.edit = true;
  }

  onCancelClick() {
    this.edit = false;
    this.editSectionForm.reset(this.section);
  }

  onSaveClick(formData: SectionModel) {
    // api update call
    this.sectionService
      .updateSection(this.section.id, formData, this.projectId)
      .subscribe((sections) => {
        this.outputSections(sections);
      });
    this.edit = false;
  }

  onDeleteClick() {
    let dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { deleteType: 'Section', projectName: this.section.heading },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'true') {
        console.log('SECTION DELETED');
        //call api section delete
        this.sectionService
          .deleteSection(this.section.id, this.projectId)
          .subscribe((sections) => {
            console.log(sections);
            //output sections to parent
            this.outputSections(sections);
          });
      }
    });
  }

  onAddTaskClick() {
    this.addTask = true;
  }

  onCancelTaskClick() {
    this.addTask = false;
    this.addTaskForm.reset({ user: this.userId });
  }

  onSaveTaskClick(formData: TaskModel) {
    console.log('Form data from new task', formData);
    this.taskService
      .addTask(formData, this.section.id)
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
      });
    this.addTask = false;
    this.addTaskForm.reset({ user: this.userId });
  }

  outputSections(sections: SectionModel[]) {
    this.sectionsOutput.emit(sections);
  }

  updateTasks(tasks) {
    this.tasks = tasks;
  }

  reorderTasks(event: CdkDragDrop<TaskModel[]>) {
    console.log(event.previousContainer.id);
    console.log(event.previousIndex, event.currentIndex);

    let tasksCopy: TaskModel[] = [...this.tasks];
    let prevContainerTasksCopy = [
      ...this.sectionService.tasks[event.previousContainer.id],
    ];
    let followsId: number;

    //local drag and drop updates
    if (this.section.id.toString() == event.previousContainer.id) {
      console.log('same container');
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
      this.sectionService.tasks[this.section.id] = this.tasks;

      /* if statement to determine which task the moved task should follow
      (same list movement) */
      if (event.currentIndex > event.previousIndex) {
        followsId = tasksCopy[event.currentIndex].id;
      } else {
        if (event.currentIndex == 0) {
          console.log('should stay at 0');
          followsId = 0;
        } else {
          followsId = tasksCopy[event.currentIndex - 1].id;
        }
      }
    } else {
      console.log('different container');
      console.log(this.sectionService.tasks);
      transferArrayItem(
        this.sectionService.tasks[event.previousContainer.id],
        this.tasks,
        event.previousIndex,
        event.currentIndex
      );

      /* if statement to determine which task the moved task should follow
      (different list movement) */
      if (event.currentIndex == 0) {
        console.log('should stay at 0');
        followsId = 0;
      } else {
        followsId = tasksCopy[event.currentIndex - 1].id;
      }
    }

    // makes api call to update task positions
    this.taskService
      .moveTask(
        this.section.id,
        prevContainerTasksCopy[event.previousIndex].id,
        followsId,
        prevContainerTasksCopy[event.previousIndex]
      )
      .subscribe((task) => {
        console.log(task);
      });
  }
}
