import UpdateReservationForm from "@/app/_components/UpdateReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export function generateMetadata({ params }) {
  return { title: `Reservation ${params.reservationId}` };
}

export default async function Page({ params }) {
  const { cabinId, numGuests, observations } = await getBooking(
    params.reservationId
  );
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{params.reservationId}
      </h2>

      <UpdateReservationForm
        reservationId={params.reservationId}
        numGuests={numGuests}
        observations={observations}
        maxCapacity={maxCapacity}
      />
    </div>
  );
}
