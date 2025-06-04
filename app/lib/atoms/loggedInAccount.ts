import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface LoggedInAccountDatum {
  id: string;
  name: string;
  nickname: string;
  avatarURL: string;
  headerURL: string;
}
export const loggedInAccountAtom = atomWithStorage<
  LoggedInAccountDatum | undefined
>("loggedInAccount", undefined, undefined, { getOnInit: true });

export const readonlyLoggedInAccountAtom = atom((get) =>
  get(loggedInAccountAtom)
);
