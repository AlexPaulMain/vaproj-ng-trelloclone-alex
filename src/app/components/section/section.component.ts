import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SectionModel } from '../../models/section.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialogs/dialog-delete/dialog-delete.component';
import { SectionService } from 'src/app/services/section.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private dialog: MatDialog,
    private sectionService: SectionService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editSectionForm = this.formBuilder.group({
      heading: [this.section.heading, Validators.required],
      description: [this.section.description, Validators.required],
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

  outputSections(sections: SectionModel[]) {
    this.sectionsOutput.emit(sections);
  }
}
