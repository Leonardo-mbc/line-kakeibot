import { paymentsRef } from "../utilities/firebase-app";

interface movePaymentParam {
  currentGroupId: string;
  targetGroupId: string;
  currentMonth: string;
  paymentId: string;
}

export async function movePaymentAction({
  currentGroupId,
  targetGroupId,
  currentMonth,
  paymentId
}: movePaymentParam) {
  try {
    const paymentPath = paymentsRef.child(
      `${currentGroupId}/${currentMonth}/${paymentId}`
    );
    const paymentNode = await paymentPath.once("value");
    const paymentValue = paymentNode.val();

    const targetPath = paymentsRef.child(
      `${targetGroupId}/${currentMonth}/${paymentId}`
    );
    await targetPath.set(paymentValue);
    await paymentPath.remove();
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
