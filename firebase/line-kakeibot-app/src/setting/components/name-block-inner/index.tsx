import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { postName } from '../../api/profile';
import styles from './style.css';
import { userIdState } from '../../../common/states/users';
import { profileState } from '../../states/profile';

export function NameBlockInner() {
  const profile = useRecoilValue(profileState);
  const userId = useRecoilValue(userIdState);
  const [inputName, setInputName] = useState(profile.name);
  const [isLoading, setIsLoading] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputName(e.target.value);
  }

  async function changeName() {
    if (inputName) {
      setIsLoading(true);
      const newName = await postName({ userId, name: inputName });
      setInputName(newName.name);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setInputName(profile.name);
  }, [profile.name]);

  return (
    <div className={styles.conainter}>
      <input type="text" defaultValue={profile.name} onChange={handleInput} />
      <button className={clsx({ [styles.loading]: isLoading })} onClick={changeName}>
        変更
      </button>
    </div>
  );
}
