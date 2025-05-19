import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-manage',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './exam-manage.component.html',
  styleUrls: ['./exam-manage.component.css'],
})
export class ExamManageComponent implements OnInit {
  exams: any[] = [];
  newExam = { title: '', description: '' };

  constructor(private examService: ExamService) {}

  ngOnInit() {
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams;
      },
      error: (err) => {
        console.error('Error fetching exams', err);
      },
    });
  }

  createExam() {
    this.examService.createExam(this.newExam).subscribe({
      next: (exam) => {
        this.exams.push(exam);
        this.newExam = { title: '', description: '' };
      },
      error: (err) => {
        console.error('Error creating exam', err);
      },
    });
  }

  deleteExam(id: string) {
    this.examService.deleteExam(id).subscribe({
      next: () => {
        this.exams = this.exams.filter((exam) => exam._id !== id);
      },
      error: (err) => {
        console.error('Error deleting exam', err);
      },
    });
  }
}