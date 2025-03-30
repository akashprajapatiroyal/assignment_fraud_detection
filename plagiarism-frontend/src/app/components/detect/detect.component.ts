import { NgFor, NgIf, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

interface PlagiarismDetail {
  compared_to: string;
  score: number;
}

interface PlagiarismResult {
  file_id: number;
  filename: string;
  average_similarity: number;
  details: PlagiarismDetail[];
}

@Component({
  selector: 'app-detect',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './detect.component.html',
  styleUrl: './detect.component.scss'
})
export class DetectComponent {
  selectedFiles: File[] = [];
results: any;
isLoading = false;
showDetails: { [key: number]: boolean } = {};
uploadedFileIds: number[] = [];
  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = Array.from(input.files || []);
  }

  // Upload files to Flask backend
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      alert('Please select files first.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.http.post<any>('http://localhost:5000/upload', formData).subscribe({
      next: (res) => {
        alert('Files uploaded successfully!');
        // Store the uploaded file IDs
        this.uploadedFileIds = res.file_ids; // You'll need to return these from backend
      },
      error: (err) => alert(`Upload failed: ${err.message}`)
    });
  }

  detectPlagiarism(): void {
    if (this.uploadedFileIds.length < 2) {
      alert('Please upload at least 2 files first.');
      return;
    }
    this.isLoading = true;
    // Add proper headers
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
    this.http.post<any>('http://localhost:5000/check_plagiarism', 
      {
        file_ids: this.uploadedFileIds
      }, { headers: headers }).subscribe({
      next: (res) => {
        if (res.success) {
          this.results = res.results;
        } else {
          alert(res.error || 'Unknown error occurred');
        }
        this.isLoading = false;
      },
      error: (err) => {
        alert(`Detection failed: ${err.error?.error || err.message}`);
        this.isLoading = false;
      }
    });
  }

  toggleDetails(fileId: number): void {
    this.showDetails[fileId] = !this.showDetails[fileId];
  }

  getSeverityClass(score: number): string {
    if (score >= 0.7) return 'high-severity';
    if (score >= 0.4) return 'medium-severity';
    return 'low-severity';
  }

  formatPercent(value: number): string {
    return (value * 100).toFixed(1) + '%';
  }

}
