export interface Item {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
