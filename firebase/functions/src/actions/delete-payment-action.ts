import { paymentsRef } from "../utilities/firebase-app";

interface DeletePaymentParam {
  userId: string;
  groupId: string;
  currentMonth: string;
  paymentId: string;
}

export async function deletePaymentAction({
  userId,
  groupId,
  currentMonth,
  paymentId
}: DeletePaymentParam) {
  try {
    const paymentPath = paymentsRef.child(
      `${groupId}/${currentMonth}/${paymentId}`
    );
    const paymentNode = await paymentPath.once("value");
    const paymentValue = paymentNode.val();

    if (paymentValue && paymentValue.who === userId) {
      await paymentPath.remove();
      return true;
    } else {
      return false;
    }
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
