const Setting = require('../models/Setting');

const settingSections = new Set([
    'general',
    'storeInfo',
    'paymentMethods',
    'shipping',
    'notifications',
    'apiSettings',
    'integrations',
    'appearance'
]);
const arraySections = new Set(['paymentMethods', 'integrations']);

const getSettings = async (req, res) => {
    try {
        const settings = await Setting.findOne().sort({ createdAt: 1 });
        res.json(settings || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const parseCurrencyNumber = (value, fieldName) => {
    const numericValue = typeof value === 'string'
        ? Number(value.replace(/[^\d.-]/g, ''))
        : Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
        throw new Error(`${fieldName} must be a non-negative number`);
    }
    return numericValue;
};

const normalizeSection = (section, value, currentValue) => {
    if (arraySections.has(section)) {
        if (!Array.isArray(value)) throw new Error(`${section} must be an array`);
        return value;
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${section} must be an object`);
    }

    const normalized = { ...(currentValue?.toObject?.() || currentValue || {}), ...value };
    if (section === 'storeInfo' && value.address) {
        normalized.address = {
            ...(currentValue?.address?.toObject?.() || currentValue?.address || {}),
            ...value.address
        };
    }
    if (section === 'shipping') {
        if (value.freeShippingThreshold !== undefined) {
            normalized.freeShippingThreshold = parseCurrencyNumber(value.freeShippingThreshold, 'freeShippingThreshold');
        }
        if (Array.isArray(value.zones)) {
            normalized.zones = value.zones.map((zone) => ({
                ...zone,
                rate: parseCurrencyNumber(zone.rate, 'Shipping zone rate')
            }));
        }
    }
    return normalized;
};

const updateSettings = async (req, res) => {
    try {
        const sections = Object.entries(req.body || {});
        if (sections.length === 0) {
            return res.status(400).json({ message: 'Provide at least one settings section to update' });
        }

        const unknownSection = sections.find(([section]) => !settingSections.has(section));
        if (unknownSection) {
            return res.status(400).json({ message: `Unknown settings section: ${unknownSection[0]}` });
        }

        let settings = await Setting.findOne().sort({ createdAt: 1 });
        if (!settings) settings = new Setting();

        for (const [section, value] of sections) {
            settings.set(section, normalizeSection(section, value, settings.get(section)));
        }

        const savedSettings = await settings.save();
        res.json(savedSettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getSettings, updateSettings };