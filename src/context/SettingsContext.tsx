import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '@/services/settingsService';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

interface Settings {
  shopName: string;
  shopEmail: string;
  logo: string;
  favicon: string;
  maintenanceMode: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  [key: string]: any;
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    shopName: 'OJALA SHOP',
    shopEmail: '',
    logo: '',
    favicon: '',
    maintenanceMode: 'false',
    metaTitle: 'CHUTIRMART | Best Online Shopping in Bangladesh',
    metaDescription: 'Shop the latest products at CHUTIRMART. High quality, great prices, and fast delivery.',
    metaKeywords: 'ecommerce, shopping, bangladesh, garments, grocery',
    ogImage: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
        
        // Update Favicon
        if (data.favicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = `${data.favicon}?v=${Date.now()}`;
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // SEO Side Effect
  useEffect(() => {
    if (!isLoading) {
      // Update Title
      if (settings.metaTitle) {
        document.title = settings.metaTitle;
      }

      const ogImageUrl = settings.ogImage ? convertGoogleDriveLink(settings.ogImage) : '';

      // Update Meta Tags
      const metaUpdates = [
        { name: 'description', content: settings.metaDescription },
        { name: 'keywords', content: settings.metaKeywords },
        { property: 'og:title', content: settings.metaTitle },
        { property: 'og:description', content: settings.metaDescription },
        { property: 'og:image', content: ogImageUrl },
        { property: 'twitter:title', content: settings.metaTitle },
        { property: 'twitter:description', content: settings.metaDescription },
        { property: 'twitter:image', content: ogImageUrl },
      ];

      metaUpdates.forEach(({ name, property, content }) => {
        if (!content) return;
        
        let element = name 
          ? document.querySelector(`meta[name="${name}"]`)
          : document.querySelector(`meta[property="${property}"]`);

        if (!element) {
          element = document.createElement('meta');
          if (name) element.setAttribute('name', name);
          if (property) element.setAttribute('property', property);
          document.head.appendChild(element);
        }
        
        element.setAttribute('content', content);
      });
    }
  }, [settings.metaTitle, settings.metaDescription, settings.metaKeywords, settings.ogImage, isLoading]);

  useEffect(() => {
    fetchSettings();

    // Listen for manual updates from admin
    const handleUpdate = () => fetchSettings();
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
