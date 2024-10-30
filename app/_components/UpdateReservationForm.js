import { updateReservation } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function UpdateReservationForm({
  reservationId,
  numGuests,
  observations,
  maxCapacity,
}) {
  return (
    <form
      action={updateReservation}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          defaultValue={numGuests}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          required
        >
          <option value="" key="">
            Select number of guests...
          </option>
          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
            <option value={x} key={x}>
              {x} {x === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="observations">
          Anything we should know about your stay?
        </label>
        <textarea
          name="observations"
          defaultValue={observations}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          maxLength={1000}
        />
      </div>
      <input name="bookingId" value={reservationId} type="hidden" />

      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLabel="Updating...">
          Update reservation
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateReservationForm;
