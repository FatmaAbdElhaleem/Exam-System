 import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ExamListComponent } from './components/exams/exam-list/exam-list.component';
import { ExamTakeComponent } from './components/exams/exam-take/exam-take.component';
import { ExamResultComponent } from './components/exams/exam-result/exam-result.component';
import { ExamManageComponent } from './components/admin/exam-manage/exam-manage.component';
import { QuestionManageComponent } from './components/admin/question-manage/question-manage.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'exams', component: ExamListComponent },
  { path: 'exams/:id/take', component: ExamTakeComponent },
  { path: 'exams/:id/result', component: ExamResultComponent },
  { path: 'admin', component: ExamManageComponent },
  { path: 'admin/questions/:examId', component: QuestionManageComponent },
];