export interface NoteAuthorData {
  avatar: string;
  name: string;
  nickname: string;
}

export interface NoteReaction {
  emoji: string;
  reactedBy: string;
}

export interface NoteRenoteInfo {
  renoteBy: NoteAuthorData;
  originalAuthor: NoteAuthorData;
  originalContent: string;
  originalCWComment: string;
}

export interface NoteProps {
  id: string;
  content: string;
  contentsWarningComment: string;
  author: NoteAuthorData;
  reactions: NoteReaction[];
  loggedInAccountID: string;
  renoteInfo?: NoteRenoteInfo;
}
