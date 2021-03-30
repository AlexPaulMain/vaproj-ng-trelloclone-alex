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
  edit = false;
  editSectionForm: FormGroup;
  @Output() sectionsOutput = new EventEmitter<SectionModel[]>();
  addTask = false;
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
    // initialises editSectionForm using FormBuilder
    this.editSectionForm = this.formBuilder.group({
      heading: [this.section.heading, Validators.required],
      description: [this.section.description, Validators.required],
    });
    // initialises addTaskForm using FormBuilder
    this.addTaskForm = this.formBuilder.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
      start_date: [''],
      target_date: [''],
      user: [this.userId],
    });
    // populates tasks array with tasks from api
    this.taskService
      .getTasks(this.section.id)
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.sectionService.storeTasks({ [this.section.id]: tasks });
      });
  }

  /**
   * Sets edit variable to true
   */
  onEditClick(): void {
    this.edit = true;
  }

  /**
   * Sets edit variable to false and resets form to previous values
   */
  onCancelClick(): void {
    this.edit = false;
    this.editSectionForm.reset(this.section);
  }

  /**
   * Makes call to update section data and sets edit to false
   * @param formData form data of type SectionModel
   */
  onSaveClick(formData: SectionModel): void {
    // api update call
    this.sectionService
      .updateSection(this.section.id, formData, this.projectId)
      .subscribe((sections) => {
        this.outputSections(sections);
      });
    this.edit = false;
  }

  /**
   * Open delete dialog and delete current section if dialog close value is true
   */
  onDeleteClick(): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { deleteType: 'Section', projectName: this.section.heading },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'true') {
        console.log('SECTION DELETED');
        // call api section delete
        this.sectionService
          .deleteSection(this.section.id, this.projectId)
          .subscribe((sections) => {
            console.log(sections);
            // output sections to parent
            this.outputSections(sections);
          });
      }
    });
  }

  /**
   * Set addTask variable to true
   */
  onAddTaskClick(): void {
    this.addTask = true;
  }

  /**
   * Set addTask variable to false and reset addTaskForm user field to the
   * current userId
   */
  onCancelTaskClick(): void {
    this.addTask = false;
    this.addTaskForm.reset({ user: this.userId });
  }

  /**
   * Determine new task position in list and make add task api call
   * @param formData form data for new task of type TaskModel
   */
  onSaveTaskClick(formData: TaskModel): void {
    // determine task position in list
    let taskPos: number;
    if (this.tasks.length === 0) {
      taskPos = 0;
    } else {
      taskPos = this.tasks[this.tasks.length - 1].task_order + 1;
    }
    formData = { ...formData, ...{ task_order: taskPos } };
    console.log('Formdata plus position', formData);
    // add new task to api
    this.taskService
      .addTask(formData, this.section.id)
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.sectionService.storeTasks({ [this.section.id]: tasks });
      });
    this.addTask = false;
    this.addTaskForm.reset({ user: this.userId });
  }

  /**
   * Output sections array to parent component
   * @param sections sections array of type SectionModel[]
   */
  outputSections(sections: SectionModel[]): void {
    this.sectionsOutput.emit(sections);
  }

  /**
   * Set tasks array to given array of tasks
   * @param tasks array of tasks
   */
  updateTasks(tasks): void {
    this.tasks = tasks;
  }

  /**
   * Updates task position based on drag event positionings
   * @param event CdkDragDrop of type TaskModel[]
   */
  reorderTasks(event: CdkDragDrop<TaskModel[]>): void {
    console.log(event.previousContainer.id);
    console.log(event.previousIndex, event.currentIndex);

    const tasksCopy: TaskModel[] = [...this.tasks];
    const prevContainerTasksCopy = [
      ...this.sectionService.tasks[event.previousContainer.id],
    ];
    let followsId: number;

    // local drag and drop updates
    if (this.section.id.toString() === event.previousContainer.id) {
      console.log('same container');
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
      this.sectionService.tasks[this.section.id] = this.tasks;

      /* if statement to determine which task the moved task should follow
      (same list movement) */
      if (event.currentIndex > event.previousIndex) {
        followsId = tasksCopy[event.currentIndex].id;
      } else {
        if (event.currentIndex === 0) {
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
      if (event.currentIndex === 0) {
        console.log('should stay at 0');
        followsId = 0;
      } else {
        followsId = tasksCopy[event.currentIndex - 1].id;
      }
    }

    console.log(prevContainerTasksCopy);
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
