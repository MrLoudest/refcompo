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

// Advanced shared types for formatting/metadata
export type CitationStyle = 'apa7' | 'harvard' | 'mla' | 'chicago';

export type SourceType =
  | 'book'
  | 'journal'
  | 'website'
  | 'conference'
  | 'report'
  | 'thesis'
  | 'chapter'
  | 'video'
  | 'podcast';

export type Author = {
  family: string; // Last name
  given?: string; // First names/initials
  organization?: boolean; // true when the "author" is an organization name stored in family
};

export type ReferenceWarningCode =
  | 'MISSING_YEAR'
  | 'MISSING_TITLE'
  | 'MISSING_PUBLISHER'
  | 'MISSING_JOURNAL'
  | 'INVALID_DOI'
  | 'SUSPICIOUS_URL';

export interface ReferenceWarning {
  code: ReferenceWarningCode;
  message: string;
}

export interface ReferenceMetadata {
  sourceType: SourceType;
  title: string;
  authors: Author[];
  year?: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  accessed?: string;
  // optional extra fields for media
  conferenceName?: string;
  thesisType?: 'phd' | 'masters' | 'bachelor';
  seriesTitle?: string;
  videoChannel?: string;
  podcastName?: string;
}

export interface FormatReferenceRequest {
  style: CitationStyle;
  metadata: ReferenceMetadata;
  inText?: {
    firstMention?: boolean; // default true
    page?: string; // optional page/paragraph indicator
  };
}

export interface FormattedReference {
  reference: string;
  inTextFirst?: string;
  inTextSubsequent?: string;
}

export interface FormatReferenceResponse {
  formatted: FormattedReference;
  warnings: ReferenceWarning[];
}

export type Confidence = 'high' | 'medium' | 'low';

export interface NormalizedLookupResult {
  confidence: Confidence;
  metadata: ReferenceMetadata;
}


