import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-take',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './exam-take.component.html',
  styleUrls: ['./exam-take.component.css'],
})
export class ExamTakeComponent implements OnInit {
  exam: any = null;
  answers: { [questionId: string]: number } = {};

  constructor(private examService: ExamService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      this.examService.getExam(examId).subscribe({
        next: (exam) => {
          this.exam = exam;
        },
        error: (err) => {
          console.error('Error fetching exam', err);
        },
      });
    }
  }

  submitExam() {
    if (this.exam) {
      this.examService.submitExam(this.exam._id, this.answers).subscribe({
        next: (result) => {
          this.router.navigate(['/exams', this.exam._id, 'result'], { state: { result } });
        },
        error: (err) => {
          console.error('Error submitting exam', err);
        },
      });
    }
  }
}