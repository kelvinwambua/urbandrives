import  { BookingList } from '~/components/ui/BookingList';

const mockBookings = [
  {
    id: "1",
    item: "Tesla Model 3",
    status: "confirmed",
    bookedAt: new Date().toISOString(),
    userName: "Alice Smith",
  },
  {
    id: "2",
    item: "BMW X5",
    status: "pending",
    bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    userName: "John Doe",
  },
];

export default function BookingsPage() {
  return <BookingList bookings={mockBookings} />;
}
