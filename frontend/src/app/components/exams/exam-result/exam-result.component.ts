import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css'],
})
export class ExamResultComponent {
  result = history.state.result as { score: number; total: number };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/exams']);
  }
}