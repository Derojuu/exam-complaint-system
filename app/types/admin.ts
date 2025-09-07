export interface ComplaintType {
  id: string
  referenceNumber: string
  student: string
  examName: string
  course: string
  createdAt: string
  type: string
  status: string
}

export interface StatsCardsProps {
  total: number;
  pending: number;
  review: number;
  resolved: number;
}

export interface ComplaintComponentProps {
  complaints: ComplaintType[];
  getStatusBadge: (status: string) => React.ReactNode;
}
