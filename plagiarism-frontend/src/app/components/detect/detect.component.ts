import { NgFor, NgIf, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx'; // Import xlsx library
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
  imports: [NgFor, NgIf, NgClass, MatProgressSpinnerModule],
  templateUrl: './detect.component.html',
  styleUrl: './detect.component.scss'
})
export class DetectComponent {
  selectedFiles: File[] = [];
results: PlagiarismResult[] = [];
isLoading = false;
isupload = true;
showDetails: { [key: number]: boolean } = {};
uploadedFileIds: number[] = [];
progressPercentage = 0;
private progressInterval: any;
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
        this.isupload = false;
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
    this.progressPercentage = 0;

    // Simulate progress (replace this with real backend updates if available)
    this.progressInterval = setInterval(() => {
      if (this.progressPercentage < 90) { // Stop at 90% until response
        this.progressPercentage += 10;
      }
    }, 500); // Update every 500ms

    // Add proper headers
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
    this.http.post<any>('http://localhost:5000/check_plagiarism', 
      {
        file_ids: this.uploadedFileIds
      }, { headers: headers }).subscribe({
        next: (res) => {
          clearInterval(this.progressInterval); // Stop simulation
          this.progressPercentage = 100; // Complete progress
          setTimeout(() => { // Brief delay to show 100%
            if (res.success) {
              this.results = res.results;
              const resultsToSave: {
                file1: any; file2: any; // Use file_id of the compared file if available
                similarity: any;
              }[] = [];
          console.log("result", this.results);
          res.results.forEach((result: { details: any[]; file_id: any; filename:any; }) => {
            result.details.forEach(detail => {
              resultsToSave.push({
                file1: result.filename,
                file2: detail.compared_to, // Use file_id of the compared file if available
                similarity: detail.score
              });
            });
          });
          
          // Send results to backend to save in the database
          this.http.post<any>('http://localhost:5000/save_results', 
            { results: resultsToSave }, 
            { headers: headers }
          ).subscribe({
            next: (saveRes) => {
              if (saveRes.success) {
                console.log('Results saved successfully');
              } else {
                alert('Failed to save results: ' + (saveRes.error || 'Unknown error'));
              }
            },
            error: (saveErr) => {
              alert('Failed to save results: ' + (saveErr.error?.error || saveErr.message));
            }
          });
            } else {
              alert(res.error || 'Unknown error occurred');
            }
            this.isLoading = false;
            this.progressPercentage = 0; // Reset for next run
          }, 300);
        },
        error: (err) => {
          clearInterval(this.progressInterval);
          alert(`Detection failed: ${err.error?.error || err.message}`);
          this.isLoading = false;
          this.progressPercentage = 0;
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

  // New method to download report as Excel
  downloadReport(): void {
    // Prepare data for Excel
    const reportData: any[] = [];

    this.results.forEach(result => {
      // Add main result row
      reportData.push({
        'File Name': result.filename,
        'Average Similarity': this.formatPercent(result.average_similarity),
        ' ': '' // Empty column for spacing
      });

      // Add detailed comparisons
      result.details.forEach(detail => {
        reportData.push({
          'File Name': '',
          'Compared To': detail.compared_to,
          'Similarity Score': this.formatPercent(detail.score)
        });
      });

      // Add empty row for separation
      reportData.push({ 'File Name': '', 'Average Similarity': '', ' ': '' });
    });

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // File Name
      { wch: 20 }, // Average Similarity / Compared To
      { wch: 20 }  // Similarity Score
    ];

    // Create workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plagiarism Report');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `Plagiarism_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

}
