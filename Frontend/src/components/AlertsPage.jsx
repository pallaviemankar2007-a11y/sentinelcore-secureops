import { getAtRiskAssets } from '../utils/assetHelpers';
import AssetListView from './AssetListView';

export default function AlertsPage({ assets, onGoToAssets }) {
  const atRisk = getAtRiskAssets(assets);
  return (
    <AssetListView
      assets={atRisk}
      emptyLabel="Nothing needs attention right now."
      showTrigger
      onGoToAssets={onGoToAssets}
    />
  );
}