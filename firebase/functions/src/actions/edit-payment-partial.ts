import { Receipt } from '../interfaces/receipt';
import { paymentsRef } from '../utilities/firebase-app';

interface EditPaymentPartial {
  userId: string;
  groupId: string;
  currentMonth: string;
  paymentId: string;
  paymentPartial: Partial<Receipt>;
}

export async function editPaymentPartial({
  userId,
  groupId,
  currentMonth,
  paymentId,
  paymentPartial,
}: EditPaymentPartial) {
  try {
    const paymentPath = paymentsRef.child(`${groupId}/${currentMonth}/${paymentId}`);
    const paymentNode = await paymentPath.once('value');
    const paymentValue = paymentNode.val() as Receipt;

    if (paymentValue && paymentValue.who === userId) {
      const newValue = {
        ...paymentValue,
        ...paymentPartial,
      };
      await paymentPath.set(newValue);
      return newValue;
    } else {
      return null;
    }
  } catch ({ status, message }) {
    console.error('%%%% Error in editPaymentPartial', message);
    throw {
      message,
      status,
    };
  }
}
