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
    /** Human-readable label shown in Settings gallery */
    label: string;
    /** Sub-label shown in Settings gallery */
    description: string;
    /** CSS class applied to the root element */
    className: string;
    /** Optional artwork URL for decorative background */
    artworkUrl: string;

    /**
     * Layer C: secondary hints under each nav item.
     * Primary labels for nav are ALWAYS fixed (see SideBar.tsx).
     */
    menuHints: {
        plugins: string;
        online: string;
        install: string;
        settings: string;
    };

    /**
     * Layer C: top header bar flavor text.
     * Structure is fixed; only the words change.
     */
    headerFlavor: {
        leftLabel: string;
        leftValue: string;
        rightLabel: string;
        rightValue: string;
        statusText: string;
    };

    /**
     * Layer C: diegetic sidebar status block.
     */
    diegeticBlock: {
        line1: string;
        line2: string;
        line3: string;
    };

    /** Theme name badge shown under CYBER_MOD logo */
    badge: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    cyberpunk: {
        id: 'cyberpunk',
        label: 'Cyberpunk 2077',
        description: 'Неон, хаос, Night City',
        className: 'theme-cyberpunk',
        artworkUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Cyberpunk-2077-Logo.png',
        badge: '[ CYBERPUNK 2077 ]',
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
            line1: 'NETWORK PING: 24ms',
            line2: 'THREAT INDEX: MINIMAL',
            line3: 'NEURAL LINK: ACTIVE',
        },
    },

    stalker: {
        id: 'stalker',
        label: 'S.T.A.L.K.E.R.',
        description: 'ПДА / Зона отчуждения',
        className: 'theme-stalker',
        artworkUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Stalker_Shadow_of_Chernobyl_logo.png',
        badge: '[ S.T.A.L.K.E.R. ]',
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
    },

    doom: {
        id: 'doom',
        label: 'DOOM',
        description: 'Боевой HUD',
        className: 'theme-doom',
        artworkUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Doom_game_logo.png/800px-Doom_game_logo.png',
        badge: '[ DOOM ]',
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
    },

    portal: {
        id: 'portal',
        label: 'Portal',
        description: 'Aperture Science',
        className: 'theme-portal',
        artworkUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Portal2-logo.png/800px-Portal2-logo.png',
        badge: '[ APERTURE SCIENCE ]',
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
            statusText: 'SUBJECT_STATUS: OPTIMAL',
        },
        diegeticBlock: {
            line1: 'ANALYSIS: COMPLETE',
            line2: 'TEST_STATUS: READY',
            line3: 'NEURAL: OPTIMAL',
        },
    },

    deadspace: {
        id: 'deadspace',
        label: 'Dead Space',
        description: 'RIG / Голограмма',
        className: 'theme-deadspace',
        artworkUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Dead_Space_logo.png',
        badge: '[ DEAD SPACE ]',
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
            line3: 'LINK_ESTABLISHED',
        },
    },
};

export const getTheme = (id: string): ThemeConfig =>
    THEMES[id as ThemeId] ?? THEMES.cyberpunk;
