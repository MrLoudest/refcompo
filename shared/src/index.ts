export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export interface Health {
  status: 'ok';
  timestamp: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
}

export interface CrossrefWork {
  DOI: string;
  title: string[];
  author?: { given: string; family: string }[];
}


