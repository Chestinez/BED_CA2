# 🚀 Game Assets Organization Guide

This folder contains all visual assets for your space game. Follow this structure to keep everything organized.

## 📁 Folder Structure

```
assets/
├── parts/              # Ship part images
│   ├── engines/        # Engine part assets
│   ├── weapons/        # Weapon part assets  
│   ├── shields/        # Shield part assets
│   ├── hulls/          # Hull part assets
│   └── hybrid/         # Hybrid part assets
├── backgrounds/        # Background images
│   ├── ranks/          # Rank-specific backgrounds
│   └── space/          # General space backgrounds
└── effects/            # Visual effects
    ├── particles/      # Particle textures
    └── animations/     # Animated effects (GIFs)
```

## 🎨 Asset Guidelines

### **Ship Parts** (`/parts/`)
- **Format**: PNG with transparency preferred
- **Size**: 64x64px to 128x128px recommended
- **Naming**: Use kebab-case (e.g., `ion-thruster-v1.png`)

#### Examples:
```
engines/
├── ion-thruster-v1.png
├── plasma-drive.png
└── warp-core.png

weapons/
├── plasma-cannon.png
├── laser-turret.png
└── missile-launcher.png

shields/
├── energy-shield.png
├── deflector-array.png
└── barrier-generator.png

hulls/
├── titanium-plating.png
├── reinforced-armor.png
└── stealth-coating.png

hybrid/
├── multi-core.png
├── adaptive-system.png
└── quantum-module.png
```

### **Rank Backgrounds** (`/backgrounds/ranks/`)
- **Format**: JPG or PNG
- **Size**: 1920x1080px (Full HD) recommended
- **Theme**: Space scenes that get more epic with higher ranks

#### Required Files:
```
ranks/
├── recruit-space.jpg      # Rank 1 - Simple space
├── pilot-space.jpg        # Rank 2 - Asteroid field
├── commander-space.jpg    # Rank 3 - Nebula
├── admiral-space.jpg      # Rank 4 - Battle scene
├── fleet-admiral-space.jpg # Rank 5 - Epic fleet
└── big-boss-space.jpg     # Rank 6 - Galactic command
```

### **Space Backgrounds** (`/backgrounds/space/`)
- **Format**: JPG or PNG
- **Size**: 1920x1080px recommended
- **Use**: General backgrounds for various pages

#### Suggested Files:
```
space/
├── default-space.jpg
├── nebula-field.jpg
├── asteroid-field.jpg
└── galaxy-view.jpg
```

### **Effects** (`/effects/`)

#### **Particles** (`/effects/particles/`)
- **Format**: PNG with transparency
- **Size**: 32x32px to 256x256px
- **Use**: Animated particle systems

```
particles/
├── stars.png
├── nebula.png
├── space-dust.png
└── energy-particles.png
```

#### **Animations** (`/effects/animations/`)
- **Format**: GIF or PNG sequences
- **Size**: Various sizes
- **Use**: Special effects and transitions

```
animations/
├── warp-effect.gif
├── explosion.gif
└── energy-pulse.gif
```

## 🔧 How Assets Are Used

### **Automatic Loading**
The game automatically loads assets based on:
- **Part names**: Converts "Ion Thruster v1" → `ion-thruster-v1.png`
- **Rank IDs**: Maps rank 1-6 to corresponding background files
- **Categories**: Organizes parts by type (engine, weapon, etc.)

### **Fallback System**
If an asset isn't found:
- **Parts**: Shows colored icon with emoji
- **Backgrounds**: Uses default space background
- **Effects**: Uses CSS animations instead

### **Performance Tips**
- Keep file sizes reasonable (< 500KB per image)
- Use WebP format for better compression (if supported)
- Optimize images before adding them

## 🎮 Integration

After adding assets, they'll automatically appear in:
- **Ship Customization**: Parts show as images instead of icons
- **Dashboard**: Background changes based on your rank
- **Profile**: Enhanced visual effects
- **All Pages**: Animated space elements

## 🚀 Quick Start

1. **Add your assets** to the appropriate folders
2. **Follow the naming convention** (kebab-case)
3. **Refresh the game** - assets load automatically!
4. **No code changes needed** - the system handles everything

## 📝 Notes

- Assets are loaded on-demand for better performance
- Higher rank backgrounds should be more visually impressive
- Part assets overlay on ship images at specific coordinates
- All animations are GPU-accelerated with GSAP

Happy asset hunting! 🌟