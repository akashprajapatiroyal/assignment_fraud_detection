import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient
import * as XLSX from 'xlsx'; // Import xlsx for Excel generation
import { saveAs } from 'file-saver'; // Import file-saver for downloading
import { MatButtonModule } from '@angular/material/button';

export interface ReportElement {
  id: number;
  file1: string;
  file2: string;
  similarity: number;
}

// const ELEMENT_DATA: ReportElement[] = [
//   {
//     no: 1,
//     rollno: 'CB.SC.P2CSE24012',
//     filename: 'CB.SC.P2CSE24012_submission.pdf',
//     plagiarism: 70,
//   },
//   {
//     no: 2,
//     rollno: 'CB.SC.P2CSE24013',
//     filename: 'CB.SC.P2CSE24013_submission.pdf',
//     plagiarism: 40,
//   },
//   {
//     no: 3,
//     rollno: 'CB.SC.P2CSE24014',
//     filename: 'CB.SC.P2CSE24014_submission.pdf',
//     plagiarism: 45,
//   },
//   {
//     no: 4,
//     rollno: 'CB.SC.P2CSE24015',
//     filename: 'CB.SC.P2CSE24015_submission.pdf',
//     plagiarism: 35,
//   },
//   {
//     no: 5,
//     rollno: 'CB.SC.P2CSE24016',
//     filename: 'CB.SC.P2CSE24016_submission.pdf',
//     plagiarism: 30,
//   },
//   {
//     no: 6,
//     rollno: 'CB.SC.P2CSE24017',
//     filename: 'CB.SC.P2CSE24017_submission.pdf',
//     plagiarism: 80,
//   },
//   {
//     no: 7,
//     rollno: 'CB.SC.P2CSE24018',
//     filename: 'CB.SC.P2CSE24018_submission.pdf',
//     plagiarism: 4,
//   },
//   {
//     no: 8,
//     rollno: 'CB.SC.P2CSE24019',
//     filename: 'CB.SC.P2CSE24019_submission.pdf',
//     plagiarism: 20,
//   },
//   {
//     no: 9,
//     rollno: 'CB.SC.P2CSE24020',
//     filename: 'CB.SC.P2CSE24020_submission.pdf',
//     plagiarism: 52,
//   },
//   {
//     no: 10,
//     rollno: 'CB.SC.P2CSE24021',
//     filename: 'CB.SC.P2CSE24021_submission.pdf',
//     plagiarism: 5,
//   },
//   {
//     no: 11,
//     rollno: 'CB.SC.P2CSE24022',
//     filename: 'CB.SC.P2CSE24022_submission.pdf',
//     plagiarism: 20,
//   },
//   {
//     no: 12,
//     rollno: 'CB.SC.P2CSE24023',
//     filename: 'CB.SC.P2CSE24023_submission.pdf',
//     plagiarism: 30,
//   },
// ];

@Component({
  selector: 'app-report',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'file1', 'file2', 'similarity'];
  dataSource: MatTableDataSource<ReportElement> = new MatTableDataSource<ReportElement>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {
    // Assign the data to the data source for the table to render
    this.fetchResults(); // Fetch data on component initialization
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    // Reset to the first page after applying a filter
    if (!filterValue) {
      this.paginator.pageIndex = 0; // Reset to first page
}
}

// Fetch data from the backend
fetchResults() {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  this.http.get<any>('http://localhost:5000/get_results', { headers }).subscribe({
    next: (res) => {
      if (res.success) {
        this.dataSource.data = res.results; // Populate the table with fetched data
      } else {
        console.error('Failed to fetch results:', res.error);
      }
    },
    error: (err) => {
      console.error('Error fetching results:', err);
    }
  });
}

// Method to export table data to Excel
exportToExcel() {
  // Prepare the data for Excel (map the dataSource.data to an array of objects)
  const excelData = this.dataSource.data.map(row => ({
    'Sr. No.': row.id,
    'Assigment File': row.file1,
    'Compared To': row.file2,
    'Plagiarism (%)': row.similarity
  }));

  // Create a worksheet from the data
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

  // Create a workbook and append the worksheet
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Plagiarism Report': worksheet },
    SheetNames: ['Plagiarism Report']
  };

  // Generate Excel file buffer
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Save the file
  const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, 'Plagiarism_Report_' + new Date().toISOString().slice(0, 10) + '.xlsx');
}

}
