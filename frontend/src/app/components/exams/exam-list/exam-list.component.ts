import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css'],
})
export class ExamListComponent implements OnInit {
  exams: any[] = [];

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
}