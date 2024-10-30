"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookedDatesByCabinId, getBookings } from "./data-service";
import { redirect } from "next/navigation";
import { isAlreadyBooked } from "./util";

export async function updateGuest(formData) {
  // 1) User authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Get FormData and data validation
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const regex = /^[a-zA-Z0-9]{6,12}$/;
  if (!regex.test(nationalID))
    throw new Error("Please provide a valid national ID");

  // 3) Data submission via PATCH request
  const updateData = { nationality, countryFlag, nationalID };
  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.id);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createReservation(bookingData, formData) {
  // 1) User authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Get FormData
  const newBooking = {
    ...bookingData,
    guestId: session.user.id,
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  // 3) Prevent users from submitting without selecting dates
  if (!bookingData?.startDate || !bookingData?.endDate)
    throw new Error("You must select a date");

  // 4) Prevent malicious users from selecting already booked dates by removing the 'disabled' attribute
  const bookedDates = await getBookedDatesByCabinId(bookingData.cabinId);
  const range = { from: bookingData?.startDate, to: bookingData?.endDate };

  if (isAlreadyBooked(range, bookedDates))
    throw new Error(
      "The selected dates are already booked. Please select available dates."
    );

  // 5) Data submission via POST request
  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateReservation(formData) {
  // 1) User authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Get FormData
  const numGuests = +formData.get("numGuests");
  const observations = formData.get("observations").slice(0, 1000);
  const bookingId = +formData.get("bookingId");

  // 3) Prevent malicious users from updating other bookings in database with copy as cURL cmd or from URL
  const guestBookings = await getBookings(session.user.id);
  const guestBookingsIds = guestBookings.map((bookings) => bookings.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 4) Data submission via PATCH request
  const updateData = { numGuests, observations };
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  revalidatePath("/account/reservations", "layout");
  redirect("/account/reservations");
}

export async function deleteReservation(bookingId) {
  // 1) User authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Prevent malicious users from deleting other bookings in database with copy as cURL cmd
  const guestBookings = await getBookings(session.user.id);
  const guestBookingsIds = guestBookings.map((bookings) => bookings.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  // 3) Data submission via DELETE request
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  // const providers = await fetch("http://localhost:3000/api/auth/providers");
  // console.log("List of providers => ", await providers.json());
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
