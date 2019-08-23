export class EnrollmentDto {
  enrollmentId: string;
  participantId: string;
  childParticipantId: string;
  eventId: string;
  status: string;
  createDate: Date;
  hasCancelationFee: boolean;
  cancelationFee: number;
  cancelationFeeCurrency: string;
  isPaid: boolean;
  price: number;
  totalPrice: number;
  discountType: string;
  registrationNumber: number;
  invoiceNumber: string;
  invoiceDate: Date;
  discountInfo: string;
  couponId: string;
  courseName: string;
  courseGroup: string;
  courseAge: string;
  childFullName: string;
  language: string;
}
