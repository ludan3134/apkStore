import {Playback} from "../../../../api/ks/v1/km_pb";

export type PlaybackStore = {
    PlaybackEdit: Playback;
    Playbacklist: Playback[];
    PlaybackFilter: Playback;
    PlaybacktableUrl: string;
};
