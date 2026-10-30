import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// - Keep shared controls in one translation catalog.
// - Use English as the fallback for strings that are not translated yet.
const resources = {
  en: { translation: { language: 'Language', darkMode: 'Dark mode', lightMode: 'Light mode', logoPreset: 'Logo preset', logoDescription: 'Choose a ready-made logo layout and customize it with your brand name and colors.', savePreset: 'Save logo preset', presets: { monogram: 'Monogram', orbit: 'Orbit', bloom: 'Bloom', frame: 'Frame' }, presetLayout: 'Preset layout', saved: 'Saved', loading: 'Loading', cancel: 'Cancel', createBrand: 'Create a brand', exportCss: 'Export CSS', exportJson: 'Export JSON', exportGuidelines: 'Brand guidelines' } },
  de: { translation: { language: 'Sprache', darkMode: 'Dunkelmodus', lightMode: 'Hellmodus', logoPreset: 'Logo-Vorlage', logoDescription: 'Wähle ein fertiges Logo-Layout und passe es mit deinem Markennamen und deinen Farben an.', savePreset: 'Logo-Vorlage speichern', presets: { monogram: 'Monogramm', orbit: 'Orbit', bloom: 'Blüte', frame: 'Rahmen' }, presetLayout: 'Vorlagenlayout', saved: 'Gespeichert', loading: 'Wird geladen', cancel: 'Abbrechen', createBrand: 'Marke erstellen', exportCss: 'CSS exportieren', exportJson: 'JSON exportieren', exportGuidelines: 'Markenleitfaden' } },
  fr: { translation: { language: 'Langue', darkMode: 'Mode sombre', lightMode: 'Mode clair', logoPreset: 'Modèle de logo', logoDescription: 'Choisissez une composition prédéfinie et personnalisez-la avec le nom et les couleurs de votre marque.', savePreset: 'Enregistrer le modèle', presets: { monogram: 'Monogramme', orbit: 'Orbite', bloom: 'Fleur', frame: 'Cadre' }, presetLayout: 'Modèle prédéfini', saved: 'Enregistré', loading: 'Chargement', cancel: 'Annuler', createBrand: 'Créer une marque', exportCss: 'Exporter CSS', exportJson: 'Exporter JSON', exportGuidelines: 'Guide de marque' } }
};

// - Initialize translations once and keep missing labels readable with English fallback.
i18n.use(initReactI18next).init({
  resources,
  lng: ['en', 'de', 'fr'].includes(localStorage.getItem('brandforge-language')) ? localStorage.getItem('brandforge-language') : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnEmptyString: false
});

export default i18n;
