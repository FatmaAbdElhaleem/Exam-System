import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getExams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getExam(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createExam(exam: { title: string; description?: string }): Observable<any> {
    return this.http.post(this.apiUrl, exam, { headers: this.getHeaders() });
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addQuestion(examId: string, question: { text: string; options: { text: string; isCorrect: boolean }[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${examId}/questions`, question, { headers: this.getHeaders() });
  }

  deleteQuestion(examId: string, questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/questions/${questionId}`, { headers: this.getHeaders() });
  }

  submitExam(examId: string, answers: { [questionId: string]: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${examId}/submit`, { answers }, { headers: this.getHeaders() });
  }
}