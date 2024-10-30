import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(params.cabinId),
      getBookedDatesByCabinId(params.cabinId),
    ]);

    return Response.json({ status: "success", data: { cabin, bookedDates } });
  } catch (err) {
    return Response.json({ status: "fail", message: "Cabin not found!" });
  }
}
