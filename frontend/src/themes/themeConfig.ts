/**
 * CyberMod Theme Configuration
 *
 * ARCHITECTURE:
 * - Layer A (Semantic Core): menu labels, actions buttons — NEVER change per theme
 * - Layer B (Theme Tokens): palette, borders, motion — defined in <theme>/style.css
 * - Layer C (Flavor Pack): header hints, diegetic text — defined here in menuHints / headerFlavor
 *
 * Themes are MODIFIERS on top of the core shell, not separate products.
 */

export type ThemeId = 'cyberpunk' | 'stalker' | 'doom' | 'portal' | 'deadspace';

export interface ThemeConfig {
    id: ThemeId;
    label: string;
    description: string;
    className: string;
    badge: string;
    accent?: string;
    isDark: boolean;

    /** Motion profile for Framer Motion (Layer B) */
    motion: {
        duration: number;
        ease: any;
    };

    /** Artwork & Background (Stage 8) */
    artwork: {
        backgroundUrl: string;
        coverUrl: string;
        characterUrl?: string;
        placement: 'right' | 'left' | 'center';
        opacity: number;
        scale: number;
    };

    /** Layer C: Secondary hints under each nav item */
    menuHints: {
        plugins: string;
        online: string;
        install: string;
        settings: string;
    };

    /** Layer C: Top header bar flavor text (Stage 3) */
    headerFlavor: {
        leftLabel: string;
        leftValue: string;
        rightLabel: string;
        rightValue: string;
        statusText: string;
    };

    /** Layer C: Diegetic sidebar status block */
    diegeticBlock: {
        line1: string;
        line2: string;
        line3: string;
    };

    /** Visual bullets for Settings Gallery (Stage 7) */
    bullets: string[];

    /** Layer C: ZipUpload bottom strip flavor */
    zipFlavor: {
        l1: string;
        l2: string;
        r1: string;
    };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    cyberpunk: {
        id: 'cyberpunk',
        label: 'Cyberpunk 2077',
        description: 'Неон, хаос, Night City',
        className: 'theme-cyberpunk',
        badge: 'NIGHT_CITY_LINK',
        isDark: true,
        accent: '#00ffcc',
        motion: { duration: 0.18, ease: 'easeOut' },
        artwork: {
            backgroundUrl: '/themes/cyberpunk/background.webp',
            coverUrl: '/themes/cyberpunk/cover.webp',
            characterUrl: '/themes/cyberpunk/character.png',
            placement: 'right',
            opacity: 0.15,
            scale: 1,
        },
        menuHints: {
            plugins: 'LOCAL',
            online: 'ONLINE',
            install: 'MANUAL',
            settings: 'CONFIG',
        },
        headerFlavor: {
            leftLabel: 'MOD_LAYER',
            leftValue: '15',
            rightLabel: 'DECK_REP',
            rightValue: '23',
            statusText: 'SYS_LINK: ACTIVE',
        },
        diegeticBlock: {
            line1: 'NETWORK: 24ms',
            line2: 'THREAT: MINIMAL',
            line3: 'NEURAL LINK ACTIVE',
        },
        bullets: ['Неоновый интерфейс Night City', 'Острые углы, холодный неон', 'Glitch-анимации'],
        zipFlavor: {
            l1: 'AES-256 ENCRYPTED',
            l2: 'MESH_NETWORK_SECURE',
            r1: 'PROTOCOL_STABLE',
        },
    },

    stalker: {
        id: 'stalker',
        label: 'S.T.A.L.K.E.R.',
        description: 'ПДА / Зона отчуждения',
        className: 'theme-stalker',
        badge: 'ZONE_NETWORK',
        isDark: true,
        accent: '#7fff00',
        motion: { duration: 0.15, ease: [0.2, 0.8, 0.6, 1] },
        artwork: {
            backgroundUrl: '/themes/stalker/background.webp',
            coverUrl: '/themes/stalker/cover.webp',
            characterUrl: '/themes/stalker/character.png',
            placement: 'right',
            opacity: 0.15,
            scale: 1.05,
        },
        menuHints: {
            plugins: 'LOCAL',
            online: 'SIGNAL',
            install: 'MANUAL',
            settings: 'PDA',
        },
        headerFlavor: {
            leftLabel: 'SECTOR',
            leftValue: 'K-14',
            rightLabel: 'RAD_LVL',
            rightValue: '0.04',
            statusText: 'СИГНАЛ: ЕСТЬ',
        },
        diegeticBlock: {
            line1: 'СВЯЗЬ: СТАБИЛЬНАЯ',
            line2: 'ЗАРЯД ПДА: 84%',
            line3: 'КАНАЛ: АКТИВЕН',
        },
        bullets: ['Военный ПДА Зоны отчуждения', 'Зернистость, помехи, износ', 'Мерцание сигнала'],
        zipFlavor: {
            l1: 'ENCRYPTED_SIGNAL',
            l2: 'ZONE_CHECKSUM_OK',
            r1: 'PDA_LINK_STABLE',
        },
    },

    doom: {
        id: 'doom',
        label: 'DOOM',
        description: 'Боевой HUD',
        className: 'theme-doom',
        badge: 'UAC_TACTICAL',
        isDark: true,
        accent: '#ff0000',
        motion: { duration: 0.06, ease: 'linear' },
        artwork: {
            backgroundUrl: '/themes/doom/background.webp',
            coverUrl: '/themes/doom/cover.webp',
            characterUrl: '/themes/doom/character.png',
            placement: 'center',
            opacity: 0.15,
            scale: 1.2,
        },
        menuHints: {
            plugins: 'LOCAL',
            online: 'UAC',
            install: 'LOAD',
            settings: 'SYSTEM',
        },
        headerFlavor: {
            leftLabel: 'THREAT',
            leftValue: 'HIGH',
            rightLabel: 'SYSTEM',
            rightValue: 'ARMED',
            statusText: 'LOADOUT: READY',
        },
        diegeticBlock: {
            line1: 'UAC_MAIN_LINK // ENGAGED',
            line2: 'SECTOR: PHOBOS_BASE_7',
            line3: 'HEALTH: 100%',
        },
        bullets: ['Боевой HUD солдата', 'Высокий контраст, красный акцент', 'Snap-анимации'],
        zipFlavor: {
            l1: 'UAC_SECURE_PACK',
            l2: 'VERIFIED_BY_SARGENT',
            r1: 'WEAPON_LINK_STABLE',
        },
    },

    portal: {
        id: 'portal',
        label: 'Portal',
        description: 'Aperture Science',
        className: 'theme-portal',
        badge: 'TEST_SUBJECT_HUD',
        isDark: false,
        accent: '#00bfff',
        motion: { duration: 0.70, ease: [0.4, 0, 0.2, 1] },
        artwork: {
            backgroundUrl: '/themes/portal/background.webp',
            coverUrl: '/themes/portal/cover.webp',
            characterUrl: '/themes/portal/character.png',
            placement: 'right',
            opacity: 0.1,
            scale: 1,
        },
        menuHints: {
            plugins: 'LOCAL',
            online: 'APERTURE',
            install: 'IMPORT',
            settings: 'CONFIG',
        },
        headerFlavor: {
            leftLabel: 'CHAMBER',
            leftValue: '01',
            rightLabel: 'STABILITY',
            rightValue: '100%',
            statusText: 'SUBJECT: OPTIMAL',
        },
        diegeticBlock: {
            line1: 'ANALYSIS: COMPLETE',
            line2: 'TEST_STATUS: READY',
            line3: 'NEURAL: OPTIMAL',
        },
        bullets: ['Aperture Science лаборатория', 'Стерильная белая чистота', 'Плавные переходы'],
        zipFlavor: {
            l1: 'APERTURE_ENCRYPTED',
            l2: 'CAKE_NOT_FOUND',
            r1: 'CORE_STABLE',
        },
    },

    deadspace: {
        id: 'deadspace',
        label: 'Dead Space',
        description: 'RIG / Голограмма',
        className: 'theme-deadspace',
        badge: 'RIG_HOLO_LINK',
        isDark: true,
        accent: '#ffa500',
        motion: { duration: 0.40, ease: [0.2, 0.8, 0.2, 1] },
        artwork: {
            backgroundUrl: '/themes/deadspace/background.webp',
            coverUrl: '/themes/deadspace/cover.webp',
            characterUrl: '/themes/deadspace/character.png',
            placement: 'right',
            opacity: 0.12,
            scale: 1.1,
        },
        menuHints: {
            plugins: 'LOCAL',
            online: 'LINK',
            install: 'CHIP',
            settings: 'RIG',
        },
        headerFlavor: {
            leftLabel: 'HOLO_LINK',
            leftValue: '7B',
            rightLabel: 'NODE',
            rightValue: '!!',
            statusText: 'HEALTH: STABLE',
        },
        diegeticBlock: {
            line1: 'SYSTEM: READY',
            line2: 'BIOLINK: ACTIVE',
            line3: 'LINK ESTABLISHED',
        },
        bullets: ['Голограмма RIG костюма', 'Холодный синий, левитирующий UI', 'Fade-in hologram'],
        zipFlavor: {
            l1: 'RIG_SYNC_ENCHANTED',
            l2: 'ISHIMURA_VERIFIED',
            r1: 'OXYGEN_STABLE',
        },
    },
};

export const getTheme = (id: string): ThemeConfig =>
    THEMES[id as ThemeId] ?? THEMES.cyberpunk;
