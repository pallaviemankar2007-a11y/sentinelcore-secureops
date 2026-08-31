import { filterByType } from '../utils/assetHelpers';
import AssetListView from './AssetListView';

export default function NetworkMonitoringPage({ assets, onGoToAssets }) {
  const networkAssets = filterByType(assets, 'NETWORK');
  return (
    <AssetListView
      assets={networkAssets}
      emptyLabel="No network devices yet."
      onGoToAssets={onGoToAssets}
    />
  );
}