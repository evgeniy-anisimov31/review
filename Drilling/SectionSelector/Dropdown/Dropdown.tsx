import React, { useMemo } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from '@consta/uikit/Checkbox';
import { Popover } from '@consta/uikit/Popover';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { setSelectedSections } from '../../smb_frontend/src/store/drilling/drillingSlice';
import { flattenAssetTree, getWellSectionTree, getSectionsByWellId } from '../../smb_frontend/src/utils/drilling/wellTree';
import { EAssetTypes, TKey } from '../../smb_frontend/src/types/drillingTypes';
import { TSelector } from '../SectionSelector';
import styles from './Dropdown.module.scss';

type TDropDownProps<T> = TSelector<T> & {
  selectorRef: React.RefObject<HTMLDivElement>;
  groupIds: T[];
};

export const Dropdown: React.FC<TDropDownProps<TKey>> = ({ groupIds, items, selectorRef, setVisible, setItemIds }) => {
  const { depositsData, selectedAssets, selectedSections } = useSelector(selectDrilling);
  const dispatch = useDispatch();
  const assetsList = useMemo(() => flattenAssetTree(depositsData), [depositsData]);

  const itemIds = useMemo(() => items.map(({ id }) => id), [items]);

  const itemGroupsList = useMemo(() => {
    const wellIds = selectedAssets.filter((asset) => asset.type === EAssetTypes.well).map(({ id }) => id);
    return getWellSectionTree([...new Set([...wellIds, ...groupIds])], assetsList);
  }, [selectedAssets, assetsList, groupIds]);

  const handleApply = () => {
    if (itemGroupsList.length > 0 || items.length >= 0) {
      dispatch(setSelectedSections(items));
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    setItemIds(selectedSections.map(({ id }) => id));
  };

  const handleReset = () => {
    setItemIds([]);
  };

  const handleWellSelectM = (id: TKey) => {
    const wellSectionIds = getSectionsByWellId(id, assetsList).map(({ id }) => id);
    const selectedWellSectionIds = itemIds.filter((id) => wellSectionIds.includes(String(id)));
    if (selectedWellSectionIds.length < wellSectionIds.length) {
      setItemIds((prev) => [...new Set([...prev, ...wellSectionIds])]);
    } else {
      setItemIds((prev) => prev.filter((id) => !selectedWellSectionIds.includes(id)));
    }
  };

  const handleChangeCheckboxM = ({ id, checked }: { id: TKey; checked: boolean }) => {
    if (checked) {
      setItemIds((prev) => [...new Set([...prev, id])]);
    } else {
      setItemIds((prev) => prev.filter((sId) => sId !== id));
    }
  };

  return (
    <Popover
      direction='downCenter'
      spareDirection='downStartLeft'
      offset='2xs'
      arrowOffset={0}
      isInteractive={true}
      anchorRef={selectorRef}
      equalAnchorWidth={true}
      className={styles.popover}
    >
      <div className={styles.selectDropdown}>
        <div className={cn(styles.control, styles.controlHeader)}>
          <div onClick={handleReset} className={styles.resetButton}>
            <Text size='s' as='div' view='link'>
              Сбросить
            </Text>
          </div>
        </div>
        <div className={styles.selectDropdownList}>
          <div className={styles.selectDropdownListContainer}>
            {itemGroupsList.length === 0 && (
              <div className={styles.info}>
                <Text size='s' view='secondary'>
                  Необходимо выбрать скважины в дереве объектов
                </Text>
              </div>
            )}
            {itemGroupsList.map((group) => (
              <div key={group.id}>
                <div
                  className={cn(styles.listGroupItem, {
                    [styles.selected]: groupIds.includes(group.id),
                  })}
                  onClick={() => handleWellSelectM(group.id)}
                >
                  <Text size='s' className={styles.title} view='secondary'>
                    {group.title}
                  </Text>
                </div>
                {group.children?.map((s) => (
                  <div key={s.id} className={styles.listItem}>
                    <Checkbox
                      onChange={({ checked }) => handleChangeCheckboxM({ id: s.id, checked })}
                      checked={itemIds?.includes(s.id)}
                    />
                    <Text size='xs' className={styles.title}>
                      {s.title}
                    </Text>
                  </div>
                ))}
                {group?.children?.length === 0 && (
                  <div className={styles.listItem}>
                    <Text size='xs' as='div' view='secondary'>
                      Секции не найдены
                    </Text>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={cn(styles.control, styles.controlFooter)}>
          <Button className={styles.actionButton} size='s' label='Отменить' view='secondary' onClick={handleCancel} />
          <Button className={styles.actionButton} size='s' label='Применить' view='primary' onClick={handleApply} />
        </div>
      </div>
    </Popover>
  );
};
