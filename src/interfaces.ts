export interface TwitterSearchParams extends URLSearchParams {
    oauth_token?: string;
}

export interface userResponseDTO {
    id: string,
    wallet: string,
    guild: string,
    discord: string,
    xp: number,
    level: number,
    xpToNextLevel: number,
    rank: number,
    missionsDone: number,
    email: string,
    arrivalStatus: string
    visaStatus: string,
    citizenStatus: string,
    badgeUrl: string,
    twitter_id: string,
    daily_claim_remaining: number,
    issued_at: string,
    created_at: Date,
    discord_name: string,
    admin: boolean
}


export interface PayloadHeaders {
    "Content-Type"?: "application/json",
    Authorization?: `Bearer ${string}`,
    Pubkey?: string,
    Login?: 'sso' | 'external' | 'transaction' | 'solana' | 'sui',
    auto_approve?: boolean,
    isLedger?: boolean,
    transaction?: string,
    signedMsg?: string,
    signature?: string,
    pubkey?: string,
}

export interface MainProps {
    handleDialogOpen: () => void;
    handleDialogClose: () => void;
    dialog_data: any | undefined;
    change_dialog_data: (data: any) => void;
    quests_data: questResponseDTO[] | undefined;
    change_quests_data: (data: questResponseDTO[]) => void;
    user_data: userResponseDTO | undefined;
    change_user_data: (data: userResponseDTO) => void;
    leaderboard_data: LeaderboardResponse | undefined;
    rewards_data: JourneyRewardResponseDTO[] | undefined;
    change_rewards_data: (data: JourneyRewardResponseDTO[]) => void;
    handleClaimAllQuestRewards: () => void;
    populate_data: () => void;
    getAuthHeaders: () => Promise<PayloadHeaders | undefined>;
    alertState: AlertState;
    setAlertState: (data: AlertState) => void;
    handleRewardsOpen: () => void;
    handleRewardsClose: () => void;
    loading_state: boolean
    change_loading_state: (state: boolean) => void
    handleNavigation: (where: string) => void
}

export enum RewardTypes {
    claim_caught_creature_reward = "claim_caught_creature_reward",
}

export interface AlertState {
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error" | undefined;
  }

export interface QuestRewardInterface {
    id: string,
    completion_id: string,
    owner_id: string,
    claimable_until: Date,
    claimed_at?: Date,
    xp: number,
}


export interface QuestDataObject {
    [key: string]: any
}

export interface AdminQuiz extends QuestDataObject {
    type: "regular";
    xp_penalty: 0;
    quiz: Array<{
      question: string;
      choices: string[];
      [key: string]: any;
    }>;
}

export interface AdminPoll extends QuestDataObject {
    type: "poll";
    xp_penalty: number;
    quiz: Array<{
      question: string;
      choices: string[];
      image: string;
      [key: string]: any;
    }>;
};

export interface TwitterMissionData extends QuestDataObject {
    tweet_url: string
}

export interface questResponseDTO {
    id: string,
    title: string,
    description: string,
    platform: string,
    type: QuestType,
    recurrence: QuestRecurrence,
    status: QuestStatus,
    data: AdminPoll | AdminQuiz | TwitterMissionData,
    xp: number,
    user_quest_status: QuestUserStatus,
    action: {
        url: string,
        buttonText: string,
        message: string
        type: "link" | "form" | "updateWallet" | "linkTwitter"
    },
    active_reward: QuestRewardInterface[]
}

export interface DialogData extends questResponseDTO {
    from: "log" | "mission"
}

export enum QuestRecurrence {
    prime = "prime",
    daily = "daily",
    weekly = "weekly",
    permanent = "permanent",
}

export enum QuestStatus {
    Active = "active",
    Disabled = "disabled"
}

export enum QuestPlatforms {
    twitter = "twitter",
    Discord = "Discord"
}
export enum QuestType {
    retweetCommentHashtag = "retweetCommentHashtag",
    websiteRefereeReachLevelTwo = "website_referee_reach_level_two",
    linkDiscord = "link_discord",
    linkEmail = "link_email",
    updateWallet = "update_wallet",
    linkTwitter = "link_twitter",
    retweet = "retweet", // retweet a specific @ProjectEluune tweet
    tweet = "tweet", // tweet a pre-defined tweet
    creature_quest = "creature_quest", // complete a Creature Quest (browser game)
    join_stargarden = "join_stargarden", // join a Stargarden
    claim_eye_reward = "claim_eye_reward",
    claim_stargarden_reward = "claim_stargarden_reward",
    claim_creature_reward = "claim_creature_reward",
    quiz = "quiz",
    event = "event",
    claim_caught_creature_reward = "claim_caught_creature_reward",
    creature_catch_attempt = "creature_catch_attempt",
    personalize_catch_attempt = "personalize_catch_attempt",
    personalize_catch_victory = "personalize_catch_victory",
    make_a_friend = "make_a_friend",
    survey_submit = "survey_submit",
}

export interface QuestValidation {
    quest_id: string,
    discord_names: string[]
}

export interface QuestCreationModel {
    id?: string
    xp: number,
    status: QuestStatus,
    type: QuestType,
    title: string,
    data: any,
    recurrence: QuestRecurrence,
    platform: string,
    description: string,
}


export interface AdminPayload extends Partial<QuestCreationModel>{}

export interface QuestResponse {
    active: questResponseDTO[],
    disabled: questResponseDTO[],
}

export enum JourneyRewardStatus {
    Active = "active",
    Disabled = "disabled"
}

export enum JourneyRewardTypes {
    Soulbound = "soulbound",
    CatchAbility = "catch_ability",
    Whitelist = "whitelist",
    Seniority = "seniority",
    VoiceOfEluune = "voice_of_eluune",
    Pack = "trait_pack",
}



export enum ClaimedStatus {
    Locked = "locked",
    Claimable = "claimable",
    Claimed = "claimed",
    Processing = "processing"
}

export interface JourneyRewardResponseDTO {
    id: string
    rewards: {type: JourneyRewardTypes, url: string}
    requiredLevel: number
    status: string
    name: string
    mint?: string
    description: string,
    claimed_status: ClaimedStatus
}

export interface MessageDialog {
    open: boolean,
    text?: string,
}

export interface RewardsDialogData { 
    xp: string,
    id: string,
    type: string,
    title: string,
    mint: string,
    type_reward: {
      type: JourneyRewardTypes,
      url: string,
    },
    description: string,
    status: ClaimedStatus
}

export interface userStats {
    user_id: string
    user_name: string
    user_points: number,
    badge_url: string,
}


export interface LeaderboardResponse {
    userStats: userStats[]
    claimStats: number
}


export enum QuestUserStatus {
    Complete = "Complete",
    Locked = "Locked",
    Available = "Available",
    Disabled = "Disabled"
}