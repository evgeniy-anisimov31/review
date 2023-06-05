import React from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { Tag } from '@consta/uikit/Tag';
import { IconSelect } from '@consta/uikit/IconSelect';
import { IconClose } from '@consta/uikit/IconClose';

import { setSelectedSections } from '../../smb_frontend/src/store/drilling/drillingSlice';
import { TKey } from '../../smb_frontend/src/types/drillingTypes';
import { TSelector } from '../SectionSelector';
import styles from './Selector.module.scss';

export const Selector: React.FC<TSelector<TKey>> = ({ items, visible, setVisible }) => {
  const dispatch = useDispatch();

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisible(false);
    if (items.length > 0) {
      dispatch(setSelectedSections([]));
    }
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.preventDefault();
    setVisible((flag) => !flag);
  };

  const handleRemove = (sId: TKey) => {
    const filteredItems = items.filter(({ id }) => id !== sId);
    setVisible(false);
    dispatch(setSelectedSections(filteredItems));
  };

  return (
    <div className={cn(styles.container, styles.sizeS)}>
      <div className={cn(styles.control, { [styles.focused]: visible })}>
        <div className={styles.controlInner} onClick={handleToggle}>
          {items.length === 0 && (
            <span className={styles.placeHolder} title='placeholder'>
              Выберите секции для выбранных скважин
            </span>
          )}
          <div className={styles.controlList}>
            {items.map((item) => (
              <div onClick={(e) => e.stopPropagation()} key={item.id} className={styles.tagContainer}>
                <Tag
                  key={item.id}
                  mode='cancel'
                  size='xs'
                  onCancel={() => handleRemove(item.id)}
                  label={item?.tagCaption || item.caption}
                  className={styles.tag}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.indicators}>
          <button className={cn(styles.clearBtn, 'MixFocus')} onClick={handleReset}>
            <IconClose size='xs' />
          </button>
          <span className={styles.delimeter}></span>
          <button className={cn(styles.dropdownBtn)} onClick={handleToggle}>
            <IconSelect size='xs' className={cn({ [styles.contract]: visible })} />
          </button>
        </div>
      </div>
    </div>
  );
};
