export interface Trip {
    title?: string;
    startDate?: Date;
    endDate?: Date;
    dateImages?: Map<string,UploadedImage[]>;
    dateDescriptions?: Map<string,string>;
    _id: string;
}

export interface TripData {
  title?: string;
  startDate?: string;
  endDate?: string;
  dateImages?: Object;
  dateDescriptions?: Object;
  _id?: string;
}


export interface UploadedImage {
    file: File;
    preview: string;
    takenAt?: Date | null;
  }

export interface MonthYear {
    month: number; // 0 = January, 11 = December
    year: number;
  }