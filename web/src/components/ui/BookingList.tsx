"use client";

type Booking = {
  id: string;
  item: string;
  status: string;
  bookedAt: string; 
  userName: string;
};

export const BookingList = ({ bookings }: { bookings: Booking[] }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{b.item}</h2>
            <p>Status: <span className="font-medium">{b.status}</span></p>
            <p>Booked by: {b.userName}</p>
            <p className="text-sm text-gray-500">Booked at: {new Date(b.bookedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

