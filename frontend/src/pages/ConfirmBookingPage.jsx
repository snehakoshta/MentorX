// ConfirmBookingPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ConfirmBookingPage() {
  const { bookingId } = useParams();

  useEffect(() => {
    // Call backend to confirm booking if needed
    console.log("Booking confirmed:", bookingId);
    alert("Slots booked successfully!");
  }, [bookingId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Booking Confirmed!</h2>
      <p>Your slot has been booked successfully.</p>
    </div>
  );
}
