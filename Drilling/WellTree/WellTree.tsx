import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { default as RcTree, TreeProps as RcTreeProps } from 'rc-tree';
import { rcTreeAdapter } from '@consta/rc-tree-adapter';

import { EAssetTypes, TKey } from '../../smb_frontend/src/types/drillingTypes';
import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import {
  setSelectedAssets,
  setWellTreeSelectedIds,
  setWellTreeCheckedIds,
  setWellTreeExpandedIds,
  setSelectedClusterId,
} from '../../smb_frontend/src/store/drilling/drillingSlice';
import {
  prepareAssetTree,
  flattenAssetTree,
  getAssetTreeKeys,
  getAssetsAndKeysWithinScope,
  getTreeAnalyticsParams,
} from '../../smb_frontend/src/utils/drilling/wellTree';
import { TextFieldPropValue } from '../../smb_frontend/src/ui/types';
import { TTreeValues } from '../../smb_frontend/src/domains/filterData/entity';
import { useLocalTreeSearch } from '../../smb_frontend/src/hooks/useLocalTreeSearch';
import LocalSearchField from '../../smb_frontend/src/components/SearchField/LocalSearchField';
import styles from './WellTree.module.scss';
import './RcTree.scss';
import { useAnalyticsHandle } from '../../smb_frontend/src/hooks/analytics/useAnalyticsHandle';
import { Analytics } from '../../smb_frontend/src/constants/names';

const WellTree: React.FC<{ isLoading: boolean }> = ({ isLoading = false }) => {
  const dispatch = useDispatch();
  const {
    depositsData,
    selectedAssets,
    wellTree: { selectedIds, checkedIds, expandedIds },
  } = useSelector(selectDrilling);
  const flattenAssetsData = useMemo(() => flattenAssetTree(depositsData), [depositsData]);
  const treeData = useMemo(() => prepareAssetTree(depositsData), [depositsData]);
  const analyticsHandle = useAnalyticsHandle();

  const [isExpandParent, setIsExpandParent] = useState(false);

  // Поиск по дереву
  const [searchValue, setSearchValue] = useState<TextFieldPropValue>(null);
  const { light, expandedKeys } = useLocalTreeSearch(treeData, searchValue);
  useEffect(() => {
    if (expandedKeys.length) {
      setIsExpandParent(true);
      dispatch(setWellTreeExpandedIds(expandedKeys));
    }
  }, [expandedKeys]);

  const onCheck: RcTreeProps['onCheck'] = (keys) => {
    const prevKeys = getAssetTreeKeys(selectedAssets);

    if (Array.isArray(keys)) {
      if (keys.length > 0) {
        const [currentKeys, currentAssets] = getAssetsAndKeysWithinScope(keys, prevKeys, flattenAssetsData);

        const wellId = currentAssets.find((asset) => asset.type === EAssetTypes.well)?.id;
        const assetWell = flattenAssetsData.find((a) => `${a.id}` === `${wellId}` && a.type === EAssetTypes.well);
        const currentClusterId = assetWell?.clusterId ?? '';
        const currentDepositId = assetWell?.depositId ?? '';

        dispatch(setSelectedAssets(currentAssets));
        dispatch(setWellTreeCheckedIds(currentKeys));
        dispatch(setSelectedClusterId(`${currentClusterId}`));
        analyticsHandle(Analytics.objectListWell, {
          well_id: wellId,
          cluster_id: currentClusterId,
          field_id: currentDepositId,
        });
      } else {
        dispatch(setWellTreeCheckedIds([]));
        dispatch(setSelectedAssets([]));
        dispatch(setSelectedClusterId(''));
      }
    }
  };

  const onExpand: RcTreeProps['onExpand'] = useCallback(
    (keys: TKey[], info) => {
      setIsExpandParent(false);
      dispatch(setWellTreeExpandedIds(keys));
      const { id, ...restAnalytics } = getTreeAnalyticsParams(info.node) || {};
      analyticsHandle(id as string, restAnalytics);
    },
    [analyticsHandle],
  );

  const onSelect: RcTreeProps['onSelect'] = (keys: TKey[]) => {
    dispatch(setWellTreeSelectedIds(keys));
  };

  const treeProps = rcTreeAdapter({ size: 'm' });

  return (
    <div className={styles.wrapper}>
      <LocalSearchField setSearch={setSearchValue} containerClassName={styles.searchContainer} />
      <RcTree
        {...treeProps}
        titleRender={(data) => light(data as TTreeValues)}
        treeData={treeData}
        autoExpandParent={isExpandParent}
        defaultExpandParent={isExpandParent}
        disabled={isLoading}
        checkable
        onSelect={onSelect}
        onCheck={onCheck}
        onExpand={onExpand}
        className='RcTreeWell'
        selectedKeys={selectedIds}
        expandedKeys={expandedIds}
        checkedKeys={checkedIds}
      />
    </div>
  );
};

export default WellTree;
