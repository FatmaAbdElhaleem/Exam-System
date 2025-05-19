import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-manage',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './question-manage.component.html',
  styleUrls: ['./question-manage.component.css'],
})
export class QuestionManageComponent implements OnInit {
  exam: any = null;
  newQuestion = { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] };

  constructor(private examService: ExamService, private route: ActivatedRoute) {}

  ngOnInit() {
    const examId = this.route.snapshot.paramMap.get('examId');
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

  addQuestion() {
    if (this.exam) {
      this.examService.addQuestion(this.exam._id, this.newQuestion).subscribe({
        next: (question) => {
          this.exam.questions.push(question);
          this.newQuestion = { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] };
        },
        error: (err) => {
          console.error('Error adding question', err);
        },
      });
    }
  }

  deleteQuestion(questionId: string) {
    if (this.exam) {
      this.examService.deleteQuestion(this.exam._id, questionId).subscribe({
        next: () => {
          this.exam.questions = this.exam.questions.filter((q: any) => q._id !== questionId);
        },
        error: (err) => {
          console.error('Error deleting question', err);
        },
      });
    }
  }
}