// Asset Manager - Central place to manage all game assets

// Ship Parts Assets
export const PART_ASSETS = {
  engines: {
    // Example: 'ion-thruster-v1': '/assets/parts/engines/ion-thruster-v1.png'
    // Add your engine assets here
  },
  weapons: {
    // Example: 'plasma-cannon': '/assets/parts/weapons/plasma-cannon.png'
    // Add your weapon assets here
  },
  shields: {
    // Example: 'energy-shield': '/assets/parts/shields/energy-shield.png'
    // Add your shield assets here
  },
  hulls: {
    // Example: 'titanium-plating': '/assets/parts/hulls/titanium-plating.png'
    // Add your hull assets here
  },
  hybrid: {
    // Example: 'multi-core': '/assets/parts/hybrid/multi-core.png'
    // Add your hybrid assets here
  }
};

// Rank Background Assets
export const RANK_BACKGROUNDS = {
  1: '/assets/backgrounds/ranks/recruit-space.jpg',      // Recruit
  2: '/assets/backgrounds/ranks/pilot-space.jpg',        // Pilot
  3: '/assets/backgrounds/ranks/commander-space.jpg',    // Commander
  4: '/assets/backgrounds/ranks/admiral-space.jpg',      // Admiral
  5: '/assets/backgrounds/ranks/fleet-admiral-space.jpg', // Fleet-Admiral
  6: '/assets/backgrounds/ranks/big-boss-space.jpg'      // Big-Boss
};

// Space Effect Assets
export const SPACE_EFFECTS = {
  particles: {
    stars: '/assets/effects/particles/stars.png',
    nebula: '/assets/effects/particles/nebula.png',
    dust: '/assets/effects/particles/space-dust.png',
    energy: '/assets/effects/particles/energy-particles.png'
  },
  animations: {
    warp: '/assets/effects/animations/warp-effect.gif',
    explosion: '/assets/effects/animations/explosion.gif',
    pulse: '/assets/effects/animations/energy-pulse.gif'
  }
};

// General Space Backgrounds
export const SPACE_BACKGROUNDS = {
  default: '/assets/backgrounds/space/default-space.jpg',
  nebula: '/assets/backgrounds/space/nebula-field.jpg',
  asteroid: '/assets/backgrounds/space/asteroid-field.jpg',
  galaxy: '/assets/backgrounds/space/galaxy-view.jpg'
};

// Helper function to get part asset
export const getPartAsset = (category, partName) => {
  const normalizedName = partName.toLowerCase().replace(/\s+/g, '-');
  return PART_ASSETS[category.toLowerCase()]?.[normalizedName] || null;
};

// Helper function to get rank background
export const getRankBackground = (rankId) => {
  return RANK_BACKGROUNDS[rankId] || RANK_BACKGROUNDS[1];
};

// Helper function to preload assets
export const preloadAssets = (assetUrls) => {
  return Promise.all(
    assetUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    })
  );
};

// Get all assets for a specific rank (for preloading)
export const getRankAssets = (rankId) => {
  const assets = [];
  
  // Add rank background
  assets.push(getRankBackground(rankId));
  
  // Add common space effects
  assets.push(...Object.values(SPACE_EFFECTS.particles));
  
  return assets;
};