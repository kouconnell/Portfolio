import { createStore } from 'zustand/vanilla';

const assetsToLoad = [
	{
		path: './static/models/ramenShop8.glb',
		id: 'environment',
		type: 'model'
	},
]

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;