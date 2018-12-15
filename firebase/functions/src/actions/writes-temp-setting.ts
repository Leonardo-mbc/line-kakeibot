import { tempSettingsRef } from "../utilities/firebase-app";
import { TempSetting } from "../interfaces/temp-setting";

export async function writesTempSetting(
  loginId: string,
  tempSetting: Partial<TempSetting>
) {
  const currentTempSettingNode = await tempSettingsRef
    .child(loginId)
    .once("value");
  const currentTempSettingValue = currentTempSettingNode.val() || {};
  const newTempSetting = {
    ...currentTempSettingValue,
    ...tempSetting
  };

  console.log("asdf", newTempSetting);
}
