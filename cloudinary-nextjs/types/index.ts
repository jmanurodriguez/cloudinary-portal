export interface CloudinaryFolder {
  name: string;
  path: string;
}

export interface CloudinaryFile {
  public_id: string;
  filename: string;
  format: string;
  resource_type: string;
  bytes: number;
  url: string;
  secure_url: string;
  created_at: string;
  width?: number;
  height?: number;
  folder?: string;
  type?: string;
}

export interface UploadResponse {
  success: boolean;
  file?: CloudinaryFile;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadState {
  isUploading: boolean;
  progress: UploadProgress;
  result: {
    success: boolean;
    public_id?: string;
    secure_url?: string;
    error?: string;
  } | null;
}
