import { IconType } from "react-icons";
import { BiMessageSquare } from "react-icons/bi";
import { CiExport, CiImport } from "react-icons/ci";
import {
  IoFlashOutline,
  IoImageOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineAudiotrack } from "react-icons/md";
import { RxText } from "react-icons/rx";

export type SticherHeaderIdTypes =
  | "image"
  | "text"
  | "audio"
  | "rectangle"
  | "callout"
  | "spotlight"
  | "character"
  | "import"
  | "Export";

interface SticherHeaderOptions {
  title: string;
  icon: IconType;
  id: SticherHeaderIdTypes;
  iconSize?: number;
}

export const sticherHeaderOptions: SticherHeaderOptions[] = [
  {
    title: "Image",
    icon: IoImageOutline,
    id: "image",
  },
  {
    title: "Text",
    icon: RxText,
    id: "text",
    iconSize: 19,
  },
  {
    title: "Audio",
    icon: MdOutlineAudiotrack,
    id: "audio",
  },
  {
    title: "Rectangle",
    icon: LuRectangleHorizontal,
    id: "rectangle",
  },
  {
    title: "Callout",
    icon: BiMessageSquare,
    id: "callout",
  },
  {
    title: "Character",
    icon: IoPersonOutline,
    id: "character",
  },
  {
    title: "Spotlight",
    icon: IoFlashOutline,
    id: "spotlight",
  },
  {
    title: "Import",
    icon: CiImport,
    id: "import",
  },
  {
    title: "Export",
    icon: CiExport,
    id: "Export",
  },
];
