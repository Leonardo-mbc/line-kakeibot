import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import liff from "@line/liff";
import "./root.css";

import { InputForm } from "./components/input-form";
import { SubmitButton } from "./components/submit-button";

liff.init({ liffId: "1629647599-EA2RxkgW" });

const root = createRoot(document.getElementById("app")!);
root.render(
  <RecoilRoot>
    <InputForm />
    <SubmitButton />
  </RecoilRoot>
);
