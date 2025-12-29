import * as dayjs from "dayjs";
import { paymentsRef } from "../utilities/firebase-app";
import { Receipt } from "../interfaces/receipt";

interface ChangeBoughtAtParam {
  userId: string;
  groupId: string;
  paymentId: string;
  currentMonth: string;
  newBoughtAt: string;
}

export async function changeBoughtAt({
  userId,
  groupId,
  paymentId,
  currentMonth,
  newBoughtAt,
}: ChangeBoughtAtParam) {
  try {
    // 現在のデータを取得
    const currentPath = paymentsRef.child(
      `${groupId}/${currentMonth}/${paymentId}`
    );
    const snapshot = await currentPath.once("value");
    const paymentData = snapshot.val() as Receipt;

    if (!paymentData) {
      throw {
        message: "Payment not found",
        status: 404,
      };
    }

    // 権限チェック: 作成者のみ変更可能
    if (paymentData.who !== userId) {
      throw {
        message: "Unauthorized: You can only edit your own payments",
        status: 403,
      };
    }

    // 元の月と新しい月を計算
    const oldMonth = dayjs(paymentData.boughtAt).format("YYYY-MM");
    const newMonth = dayjs(newBoughtAt).format("YYYY-MM");

    // boughtAtを更新
    const updatedPaymentData = {
      ...paymentData,
      boughtAt: newBoughtAt,
    };

    if (oldMonth !== newMonth) {
      // 月が異なる場合: 移動処理
      const newPath = paymentsRef.child(`${groupId}/${newMonth}/${paymentId}`);

      // トランザクション的に処理
      await newPath.set(updatedPaymentData);
      await currentPath.remove();

      return {
        success: true,
        moved: true,
        oldMonth,
        newMonth,
        boughtAt: newBoughtAt,
      };
    } else {
      // 同月内の変更: boughtAtのみ更新
      await currentPath.update({ boughtAt: newBoughtAt });

      return {
        success: true,
        moved: false,
        oldMonth,
        newMonth,
        boughtAt: newBoughtAt,
      };
    }
  } catch (error) {
    console.error("%%%% Error in changeBoughtAt", error);
    throw {
      message: error.message || error,
      status: error.status || 500,
    };
  }
}

