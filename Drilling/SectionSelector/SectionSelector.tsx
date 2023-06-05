import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import {
  flattenAssetTree,
  getSectionsByIds,
  getWellBySectionId,
  getWellIdsBySectionIds,
} from '../../smb_frontend/src/utils/drilling/wellTree';
import { EAssetTypes, TAssetData, TKey } from '../../smb_frontend/src/types/drillingTypes';
import { Selector } from './Selector/Selector';
import { Dropdown } from './Dropdown/Dropdown';
import styles from './SectionSelector.module.scss';

type TSelectorItem = {
  tagCaption: string;
  id: string;
  caption: string;
  type: EAssetTypes;
  depositId?: TKey;
  clusterId?: TKey;
  wellId?: TKey;
  sectionId?: TKey;
};

export type TSelector<T> = {
  items: TSelectorItem[] | (TAssetData[] & { tagCaption?: string });
  visible?: boolean;
  setItemIds: React.Dispatch<React.SetStateAction<T[]>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setGroupId?: React.Dispatch<React.SetStateAction<T | undefined>>;
};

export const SectionSelector: React.FC = () => {
  const selectorRef = useRef<HTMLDivElement>(null);
  const { depositsData, selectedSections: actualSelectedSections, selectedClusterId } = useSelector(selectDrilling);
  const [selectedWellIds, setSelectedWellIds] = useState<TKey[]>([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState<TKey[]>([]);
  const [currentSelectedClusterId, setCurrentSelectedClusterId] = useState(() => selectedClusterId);
  const [visible, setVisible] = useState(false);

  const assetsList = useMemo(() => flattenAssetTree(depositsData), [depositsData]);

  useEffect(() => {
    const sections = actualSelectedSections.filter((asset) => asset.type === EAssetTypes.section);
    setSelectedSectionIds(sections.map(({ id }) => id));
    const wellIds = getWellIdsBySectionIds(
      sections.map(({ id }) => id),
      assetsList,
    );

    setSelectedWellIds(wellIds);
  }, [actualSelectedSections, assetsList]);

  useEffect(() => {
    if (currentSelectedClusterId !== selectedClusterId) {
      setSelectedSectionIds(() => []);
      setCurrentSelectedClusterId(selectedClusterId);
    }
  }, [currentSelectedClusterId, selectedClusterId]);

  useEffect(() => {
    const wellIds = getWellIdsBySectionIds(selectedSectionIds, assetsList);
    setSelectedWellIds(wellIds);
  }, [selectedSectionIds, assetsList]);

  const selectedItems = useMemo(() => {
    const sections = getSectionsByIds(selectedSectionIds, assetsList);
    return sections.map((section) => {
      const wellCaption = getWellBySectionId(section.id, assetsList)?.caption ?? '';
      return {
        ...section,
        tagCaption: wellCaption ? `${wellCaption}/${section.caption}` : section.caption,
      };
    });
  }, [selectedSectionIds, assetsList]);

  return (
    <div className={styles.container}>
      <div ref={selectorRef}>
        <Selector
          items={actualSelectedSections}
          visible={visible}
          setItemIds={setSelectedSectionIds}
          setVisible={setVisible}
        />
      </div>
      {visible && (
        <Dropdown
          items={selectedItems}
          groupIds={selectedWellIds}
          visible={visible}
          selectorRef={selectorRef}
          setItemIds={setSelectedSectionIds}
          setVisible={setVisible}
        />
      )}
    </div>
  );
};
