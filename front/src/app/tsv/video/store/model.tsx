import {Video} from "../../../../api/ta/v1/tam_pb";

export type VideoStore = {
    VideoEdit: Video;
    Videolist: Video[];
    VideoFilter: Video;
    VideotableUrl: string;
};
