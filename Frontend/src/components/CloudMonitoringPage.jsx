import { filterByType } from '../utils/assetHelpers';
import AssetListView from './AssetListView';

export default function CloudMonitoringPage({ assets, onGoToAssets }) {
  const cloudAssets = filterByType(assets, 'CLOUD');
  return (
    <AssetListView
      assets={cloudAssets}
      emptyLabel="No cloud resources yet."
      onGoToAssets={onGoToAssets}
    />
  );
}