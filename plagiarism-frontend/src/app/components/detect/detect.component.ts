import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-detect',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './detect.component.html',
  styleUrl: './detect.component.scss'
})
export class DetectComponent {
  selectedFiles: File[] = [];
results: any;
  

  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  // Upload files to Flask backend
  uploadFiles() {
    if (this.selectedFiles.length === 0) {
      alert('Please select files first.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.http.post('http://127.0.0.1:5000/upload', formData).subscribe(
      (response: any) => {
        console.log('Upload successful', response);
        alert('Files uploaded successfully!');
      },
      (error) => {
        console.error('Upload failed', error);
        alert('File upload failed. Please try again.');
      }
    );
  }
}
