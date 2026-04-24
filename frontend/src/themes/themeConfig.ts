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
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    cyberpunk: {
        id: 'cyberpunk',
        label: 'Cyberpunk 2077',
        description: 'Неон, хаос, Night City',
        className: 'theme-cyberpunk',
        badge: 'NIGHT_CITY_LINK',
        isDark: true,
        motion: { duration: 0.18, ease: 'easeOut' },
        artwork: {
            backgroundUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Cyberpunk-2077-Logo.png',
            coverUrl: '',
            placement: 'right',
            opacity: 0.08,
            scale: 1,
        },
        menuHints: {
            plugins: 'LOCAL',
            online: 'REPO',
            install: 'IMPORT',
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
    },

    stalker: {
        id: 'stalker',
        label: 'S.T.A.L.K.E.R.',
        description: 'ПДА / Зона отчуждения',
        className: 'theme-stalker',
        badge: 'ZONE_NETWORK',
        isDark: true,
        motion: { duration: 0.15, ease: [0.2, 0.8, 0.6, 1] },
        artwork: {
            backgroundUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Stalker_Shadow_of_Chernobyl_logo.png',
            coverUrl: '',
            placement: 'right',
            opacity: 0.12,
            scale: 0.9,
        },
        menuHints: {
            plugins: 'ZONE_LOG',
            online: 'ZONE_NET',
            install: 'FIELD_OPS',
            settings: 'PDA_SYS',
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
    },

    doom: {
        id: 'doom',
        label: 'DOOM',
        description: 'Боевой HUD',
        className: 'theme-doom',
        badge: 'UAC_TACTICAL',
        isDark: true,
        motion: { duration: 0.06, ease: 'linear' },
        artwork: {
            backgroundUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Doom_game_logo.png/800px-Doom_game_logo.png',
            coverUrl: '',
            placement: 'center',
            opacity: 0.05,
            scale: 1.2,
        },
        menuHints: {
            plugins: 'ARMORY',
            online: 'UAC_NET',
            install: 'LOAD',
            settings: 'HUD_CFG',
        },
        headerFlavor: {
            leftLabel: 'THREAT',
            leftValue: '99',
            rightLabel: 'KILLS',
            rightValue: '666',
            statusText: 'STATUS: READY',
        },
        diegeticBlock: {
            line1: 'LOCATION: PHOBOS',
            line2: 'AMMO: CRITICAL',
            line3: 'WEAPON: READY',
        },
        bullets: ['Боевой HUD солдата', 'Высокий контраст, красный акцент', 'Snap-анимации'],
    },

    portal: {
        id: 'portal',
        label: 'Portal',
        description: 'Aperture Science',
        className: 'theme-portal',
        badge: 'TEST_SUBJECT_HUD',
        isDark: false,
        motion: { duration: 0.70, ease: [0.4, 0, 0.2, 1] },
        artwork: {
            backgroundUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Portal2-logo.png/800px-Portal2-logo.png',
            coverUrl: '',
            placement: 'right',
            opacity: 0.1,
            scale: 0.8,
        },
        menuHints: {
            plugins: 'CHAMBERS',
            online: 'AP_ACCESS',
            install: 'PROCESS',
            settings: 'PARAMS',
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
    },

    deadspace: {
        id: 'deadspace',
        label: 'Dead Space',
        description: 'RIG / Голограмма',
        className: 'theme-deadspace',
        badge: 'RIG_HOLO_LINK',
        isDark: true,
        motion: { duration: 0.40, ease: [0.2, 0.8, 0.2, 1] },
        artwork: {
            backgroundUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Dead_Space_logo.png',
            coverUrl: '',
            placement: 'right',
            opacity: 0.06,
            scale: 1,
        },
        menuHints: {
            plugins: 'KINETICS',
            online: 'NET_NODES',
            install: 'CHIP_SET',
            settings: 'RIG_CAL',
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
    },
};

export const getTheme = (id: string): ThemeConfig =>
    THEMES[id as ThemeId] ?? THEMES.cyberpunk;
