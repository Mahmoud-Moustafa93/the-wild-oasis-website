"use client";

import { useOptimistic } from "react";
import { deleteReservation } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

// Re-fetch the page data every second
// export const revalidate = 0;

function ReservationList({ bookings }) {
  const initialState = bookings;
  const stateUpdate = (curBookings, bookingId) =>
    curBookings.filter((booking) => booking.id !== bookingId);

  const [optimisticBookings, optimisticDelete] = useOptimistic(
    initialState,
    stateUpdate
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
