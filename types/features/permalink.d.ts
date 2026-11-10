export function addPermalink(): void;
export function addShortPermalink(): void;
export function removePermalink(): void;
export function loadPermalink(url: any): void;
export function loadShortPermalink(sid: any): Promise<any>;
export function setShortPermalinkData(data: Object): void;
export function createShortPermalinkUrl(uuid: string): string;
