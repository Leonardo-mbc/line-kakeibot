import { getProfile as getProfileV2 } from "./endpoints/get-profile";
import { postGroup as postGroupV2 } from "./endpoints/post-group";
import { outGroup as outGroupV2 } from "./endpoints/out-group";
import { postName as postNameV2 } from "./endpoints/post-name";
import { linkGroup as linkGroupV2 } from "./endpoints/link-group";
import { postPicture as postPictureV2 } from "./endpoints/post-picture";
import { getReceipts as getReceiptsV2 } from "./endpoints/get-receipts";
import { getReceiptsByGroup as getReceiptsByGroupV2 } from "./endpoints/get-receipts-by-group";
import { deletePayment as deletePaymentV2 } from "./endpoints/delete-payment";
import { editPayment as editPaymentV2 } from "./endpoints/edit-payment";
import { getGroups as getGroupsV2 } from "./endpoints/get-groups";
import { editGroup as editGroupV2 } from "./endpoints/edit-group";
import { movePayment as movePaymentV2 } from "./endpoints/move-payment";
import { changeBoughtAt } from "./endpoints/change-bought-at";

export {
  getProfileV2,
  postGroupV2,
  outGroupV2,
  postNameV2,
  linkGroupV2,
  postPictureV2,
  getReceiptsV2,
  getReceiptsByGroupV2,
  deletePaymentV2,
  getGroupsV2,
  editGroupV2,
  editPaymentV2,
  movePaymentV2,
  changeBoughtAt,
};
