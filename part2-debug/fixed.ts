import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

interface BookingRequest {
  studentId: string;
  teacherId: string;
  slot: string;
  subject: string;
}

export const bookSession = functions.https.onCall(
  async (data: BookingRequest, context) => {

    // Production impact: Without authentication, an unauthenticated
    // client could directly invoke the function and create bookings.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to book a session."
      );
    }

    // Production impact: TypeScript interfaces only provide compile-time
    // information. Client input must be validated at runtime before it
    // is used or stored in the database.
    if (
      typeof data.studentId !== "string" ||
      typeof data.teacherId !== "string" ||
      typeof data.slot !== "string" ||
      typeof data.subject !== "string" ||
      !data.studentId.trim() ||
      !data.teacherId.trim() ||
      !data.slot.trim() ||
      !data.subject.trim()
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid booking data."
      );
    }

    const booking = {
      studentId: data.studentId,
      teacherId: data.teacherId,
      slot: data.slot,
      subject: data.subject,
      status: "confirmed",
      createdAt: new Date(),
    };

    const teacherRef = db.collection("teachers").doc(data.teacherId);

    // Production impact: Firestore queries are asynchronous. Awaiting the
    // query ensures the slot check uses the actual QuerySnapshot rather
    // than a pending Promise.
    const existing = await teacherRef
      .collection("bookings")
      .where("slot", "==", data.slot)
      .get();

    if (existing.docs.length > 0) {
      return { success: false, message: "Slot already booked" };
    }

    // Production impact: Awaiting the database write prevents the function
    // from reporting success before the booking has actually been stored.
    await db.collection("bookings").add(booking);

    return { success: true };
  }
);

