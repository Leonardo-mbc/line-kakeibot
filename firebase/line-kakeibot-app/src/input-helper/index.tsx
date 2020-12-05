import React from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import liff from '@line/liff';
import './root.css';

import { InputForm } from './components/input-form';
import { SubmitButton } from './components/submit-button';

liff.init({ liffId: '1629647599-EA2RxkgW' });

render(
  <RecoilRoot>
    <InputForm />
    <SubmitButton />
  </RecoilRoot>,
  document.getElementById('app')
);
