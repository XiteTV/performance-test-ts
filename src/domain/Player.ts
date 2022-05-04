export interface StateUpdateResponse {
    currentProfile?: Profile;
    channelCategories?: Array<ChannelCategory>;
    filterCategories?: Array<FilterCategory>;
    account?: Account;
    currentVideo?: Music | Ad | Ident | Survey;
    currentlyActive?: Channel | Mixer | Search | Likes;
    limitations?: Limitations;
    likes?: Likes;
    search?: Search;
}

export interface SearchResponse {
    videoItems: Array<VideoInfo>
    total: number
}

export interface LikesResponse {
    videoItems: Array<VideoInfo>
    total: number
}

export interface Search {
    query: string
    total: number
    offset: number
    videoItems: Array<VideoInfo>
}

export interface Likes {
    total: number
    offset: number
    videoItems: Array<VideoInfo>
}

export interface VideoInfo {
    id: number
    title: string
    artist: string
    media?: VideoMedia
}

export interface Limitations {
    skip?: LimitationRule
    videoOnDemand?: LimitationRule
}

export interface LimitationRule {
    isAllowed: boolean
    nextAllowed?: string
}

export interface Player {
    playerType: PlayerType
    playlistSize: number
}

export interface Likes extends Player {
    videoIndex: number
}

export interface Channel extends Player {
    id: number
    name: string
    categoryName: string
    type: ChannelType
    subCategoryName?: string
}

export interface Mixer extends Player {}

export interface Search extends Player {
    name: string
    videoIndex?: number
}

export enum ChannelType {
    Curated = "Curated",
    Recommended = "Recommended"
}

export enum PlayerType {
    Channel = "Channel",
    Mixer = "Mixer",
    Search = "search",
    Likes = "Likes"
}

export interface Account {
    id: string
    email: string
    accountType: AccountType
    profiles: Array<Profile>
    trialStatus: TrialStatus
}

export enum TrialStatus {
    NoTrialYet = "NoTrialYet",
    InTrial = "InTrial",
    TrialFinished = "TrialFinished"
}

export enum AccountType {
    Free = "Free",
    Premium = "Premium",
    Guest = "Guest"
}

export interface Profile {
    id: string
    name: string
    isAdPersonalized: boolean
    isAdultContentAllowed: boolean
}

export interface FilterCategory {
    name: string;
    filters: Array<FilterInfo>;
}

export interface FilterInfo {
    id: number;
    name: string;
    description: string;
    media?: FilterMedia;
}

export interface FilterMedia {
    imageUrl: string;
    secondaryImageUrl?: string
}

export interface ChannelCategory {
    name: string;
    isEnabled: boolean;
    channels: Array<ChannelInfo>;
    subcategories: Array<ChannelSubcategory>;
}
export interface ChannelInfo {
    id: number;
    name: string;
    description: string;
    media?: ChannelMedia;
    type: Direction;
    isUpdated: boolean;
}

export interface ChannelSubcategory {
    name: string;
    channels: Array<ChannelInfo>
}

export interface ChannelMedia {
    imageUrl: string;
    secondaryImageUrl?: string;
    gifImageUrl?: string;
    videoPreviewUrl?: string;
    thumbnails: Map<string, string>
}

export interface Video {
    duration: number
    src: VideoSources
    url: string
    contentType: string
}

export interface Music extends Video {
    id: number
    title: string
    artist: string
    media: VideoMedia
    isLiked: boolean
}

export interface Ad extends Video {
    id: string
    title: string
    beacons: Map<string, Array<string>>
    currentPodIndex: number
    podSize: number
    adsCorrelationId: number
    numSurveysInPod: number
    adBreakId: number
}

export interface Ident extends Video {
    id: string
    title: string
    podSize: number
    adBreakId: number
}

export interface Survey extends Video {
    id: number
    title: string
    subtitle?: string
    surveyType: string
    options: Array<SurveyAnswer>
    feedbackUrl: string
    currentPodIndex: number
    podSize: number
    canSkip: false
    numSurveysInPod: number
}

export interface SurveyAnswer {
    id: number
    text: string
}

export interface VideoMedia {
    imageUrl: string
    secondaryImageUrl?: string
    videoPreviewUrl?: string
    gifImageUrl?: string
    thumbnails: Map<string, string>
}

export interface VideoSources {
    m3u8: string
    mp4: string
}

export enum Direction {
    Curated = "Curated",
    Recommended = "Recommended"
}