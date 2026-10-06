export type Locale = 'es-MX' | 'es-ES' | 'en-US' | 'la';
export type MysterySet = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';
export type PrayerData = {
id: string,
kind: PrayerKind,
mysterySet: MysterySet,
locale: Locale,
prayedOn: string,
startedAt: string,
completedAt: string | null,
decades: number,
durationSeconds: number,
readings: Record<string, string> | null,
clientUpdatedAt: string,
deletedAt: string | null,
};
export type PrayerKind = 'rosary' | 'decade';
export type SyncResultData = {
prayers: PrayerData[],
cursor: string,
};
export type TokenData = {
token: string,
user: UserData,
};
export type UserData = {
id: number,
name: string | null,
email: string | null,
anonymous: boolean,
apple: boolean,
google: boolean,
locale: Locale,
preferences: Record<string, any>,
};
