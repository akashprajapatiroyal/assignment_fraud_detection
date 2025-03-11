import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


export interface ReportElement {
  no: number;
  rollno: string;
  filename: string;
  plagiarism: number;
}

const ELEMENT_DATA: ReportElement[] = [
  {
    no: 1,
    rollno: 'CB.SC.P2CSE24012',
    filename: 'CB.SC.P2CSE24012_submission.pdf',
    plagiarism: 70,
  },
  {
    no: 2,
    rollno: 'CB.SC.P2CSE24013',
    filename: 'CB.SC.P2CSE24013_submission.pdf',
    plagiarism: 40,
  },
  {
    no: 3,
    rollno: 'CB.SC.P2CSE24014',
    filename: 'CB.SC.P2CSE24014_submission.pdf',
    plagiarism: 45,
  },
  {
    no: 4,
    rollno: 'CB.SC.P2CSE24015',
    filename: 'CB.SC.P2CSE24015_submission.pdf',
    plagiarism: 35,
  },
  {
    no: 5,
    rollno: 'CB.SC.P2CSE24016',
    filename: 'CB.SC.P2CSE24016_submission.pdf',
    plagiarism: 30,
  },
  {
    no: 6,
    rollno: 'CB.SC.P2CSE24017',
    filename: 'CB.SC.P2CSE24017_submission.pdf',
    plagiarism: 80,
  },
  {
    no: 7,
    rollno: 'CB.SC.P2CSE24018',
    filename: 'CB.SC.P2CSE24018_submission.pdf',
    plagiarism: 4,
  },
  {
    no: 8,
    rollno: 'CB.SC.P2CSE24019',
    filename: 'CB.SC.P2CSE24019_submission.pdf',
    plagiarism: 20,
  },
  {
    no: 9,
    rollno: 'CB.SC.P2CSE24020',
    filename: 'CB.SC.P2CSE24020_submission.pdf',
    plagiarism: 52,
  },
  {
    no: 10,
    rollno: 'CB.SC.P2CSE24021',
    filename: 'CB.SC.P2CSE24021_submission.pdf',
    plagiarism: 5,
  },
  {
    no: 11,
    rollno: 'CB.SC.P2CSE24022',
    filename: 'CB.SC.P2CSE24022_submission.pdf',
    plagiarism: 20,
  },
  {
    no: 12,
    rollno: 'CB.SC.P2CSE24023',
    filename: 'CB.SC.P2CSE24023_submission.pdf',
    plagiarism: 30,
  },
];

@Component({
  selector: 'app-report',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements AfterViewInit {
  displayedColumns: string[] = ['no', 'rollno', 'filename', 'plagiarism'];
  dataSource: MatTableDataSource<ReportElement>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
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

}
