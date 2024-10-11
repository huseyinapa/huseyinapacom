export interface Service {
  name: string;
  url: string;
  statusApi?: string;
  category: string;
}

export interface ServiceStatus extends Service {
  isOnline: boolean;
  details?: any;
}
