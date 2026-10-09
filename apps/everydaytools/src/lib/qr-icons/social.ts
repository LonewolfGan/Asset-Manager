import {
  Send,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitch,
} from 'lucide-react';
import type { LibraryIcon } from './types';
import { createLucideLibraryIcon } from './adapter';

export const SOCIAL_ICONS: LibraryIcon[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    category: 'social',
    path: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9.5 9c-.3.5-.2 1.4.3 2.4.6 1.1 1.6 2.1 2.8 2.8 1 .5 1.9.6 2.4.3.4-.3.7-.8.9-1.2.2-.4.1-.7-.2-.9l-1.3-.8c-.3-.2-.6-.2-.8.1l-.5.6c-.2.2-.5.2-.8 0-.8-.5-1.5-1.2-2-2-.2-.3-.2-.6 0-.8l.6-.5c.3-.2.3-.5.1-.8L10.2 7c-.2-.3-.5-.4-.9-.2-.4.2-.9.5-1.2.9-.4.5-.5 1-.6 1.3z"/>',
  },
  createLucideLibraryIcon('telegram', 'Telegram', 'social', Send),
  createLucideLibraryIcon('instagram', 'Instagram', 'social', Instagram),
  {
    id: 'x-twitter',
    label: 'X / Twitter',
    category: 'social',
    path: '<path d="M4 4l11.733 16h4.267l-11.733-16z"/><path d="M4 20l6.768-6.768m2.464-2.464L20 4"/>',
  },
  createLucideLibraryIcon('facebook', 'Facebook', 'social', Facebook),
  {
    id: 'messenger',
    label: 'Messenger',
    category: 'social',
    path: '<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><path d="m8 13 3-3 2 2 3-3-3 3-2-2z"/>',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    category: 'social',
    path: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
  },
  createLucideLibraryIcon('youtube', 'YouTube', 'social', Youtube),
  createLucideLibraryIcon('linkedin', 'LinkedIn', 'social', Linkedin),
  {
    id: 'discord',
    label: 'Discord',
    category: 'social',
    path: '<circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M7.5 4.5C9 3.5 10.5 3 12 3s3 .5 4.5 1.5c1.5 2.5 2 7 2 10 0 0-1.5 1.5-4 1.5l-.8-1.2c1.2-.4 1.8-1 1.8-1-.5.3-2 .9-3.5.9s-3-.6-3.5-.9c0 0 .6.6 1.8 1L9.5 16C7 16 5.5 14.5 5.5 14.5c0-3 .5-7.5 2-10z"/>',
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    category: 'social',
    path: '<path d="M12 2a6 6 0 0 0-6 6c0 2.5 1 4 1 5.5 0 .5-.5 1-1.5 1.5-.5.2-1 .6-1 1 0 .6.8.8 2 .7 1.2-.1 1.5.3 2.5 1.3 1 1 2 1 3 1s2 0 3-1c1-1 1.3-1.4 2.5-1.3 1.2.1 2-.1 2-.7 0-.4-.5-.8-1-1-1-.5-1.5-1-1.5-1.5 0-1.5 1-3 1-5.5a6 6 0 0 0-6-6z"/>',
  },
  {
    id: 'reddit',
    label: 'Reddit',
    category: 'social',
    path: '<circle cx="12" cy="13" r="7"/><circle cx="9" cy="12.5" r="1" fill="currentColor"/><circle cx="15" cy="12.5" r="1" fill="currentColor"/><path d="M10 16c.7.6 1.3.8 2 .8s1.3-.2 2-.8"/><path d="M12 6l1.5-3.5 3 1"/><circle cx="17" cy="3.5" r="1"/>',
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    category: 'social',
    path: '<circle cx="12" cy="12" r="10"/><path d="m8 20 2-8c-.5-.8-.3-2 .5-2 1 0 1.5 1 1.5 2 0 1.8-.7 3.5.3 4.5.8.8 2.2.5 2.7-.8.8-1.8.8-4.5-.5-6-1.5-1.8-4.3-1.8-6 0-1.5 1.5-1.5 4 0 5.2.3.2.4.6.3 1l-.3 1"/>',
  },
  {
    id: 'threads',
    label: 'Threads',
    category: 'social',
    path: '<circle cx="12" cy="12" r="10"/><path d="M16 11.5c0-2.5-1.8-4-4-4s-4 1.8-4 4.2c0 2.8 2.2 4.3 4.5 4.3 1.5 0 2.8-.6 3.5-1.5"/><circle cx="12" cy="11.5" r="1.5"/>',
  },
  createLucideLibraryIcon('twitch', 'Twitch', 'social', Twitch),
  {
    id: 'wechat',
    label: 'WeChat',
    category: 'social',
    path: '<path d="M9.5 3C5.4 3 2 5.9 2 9.5c0 2 1 3.8 2.7 5L4 18l3.6-1.8c.6.2 1.3.3 1.9.3 4.1 0 7.5-2.9 7.5-6.5S13.6 3 9.5 3z"/><path d="M15 11c-.3 0-.6 0-.8.1 1.7 1 2.8 2.5 2.8 4.4 0 .6-.1 1.2-.4 1.7L18 20l-2.2-1.1c-.6.2-1.3.3-2 .3-2.6 0-4.8-1.3-5.5-3.2 2.6.2 5.1-.8 6.7-2.6.6-.7 1-1.6 1-2.4z"/>',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    category: 'social',
    path: '<circle cx="12" cy="12" r="10"/><path d="M7 9.5c3-1 7-1 10 .5"/><path d="M7.5 12c2.5-.8 6-.8 8.5.5"/><path d="M8 14.5c2-.5 5-.5 7 .5"/>',
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    category: 'social',
    path: '<path d="M2 13h1v4H2zm3-2h1v6H5zm3-2h1v8H8zm3-3h1v11h-1zm3 2a4 4 0 0 1 4 4c1.1 0 2 .9 2 2s-.9 2-2 2h-4V8z"/>',
  },
];
