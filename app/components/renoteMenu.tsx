import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import styles from "~/components/renoteMenu.module.css";
import type { action } from "~/routes/api.renote";

interface RenoteMenuProps {
  noteID: string;
  initialRenoteCount?: number;
}

export const RenoteMenu = ({
  noteID,
  initialRenoteCount = 0,
}: RenoteMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenoted, setIsRenoted] = useState(false);
  const [renoteCount, setRenoteCount] = useState(initialRenoteCount);
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // エラーハンドリング
  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.state === "loading") {
      if ("error" in fetcher.data) {
        setIsRenoted(false);
        setRenoteCount((prev) => prev - 1);
      }
    }
  }, [fetcher.state]);

  const handleRenote = () => {
    setIsRenoted(true);
    setRenoteCount((prev) => prev + 1);
    setIsMenuOpen(false);
    fetcher.submit({ noteID }, { method: "post", action: "/api/renote" });
  };

  const handleQuoteRenote = () => {
    navigate(`/notes/${noteID}/renote`);
  };

  return (
    <div className={styles.renoteMenuContainer} ref={menuRef}>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        リノート {renoteCount} {isRenoted && <span>(renoted)</span>}
      </button>
      {isMenuOpen && (
        <div className={styles.menu}>
          <button onClick={handleRenote}>リノート</button>
          <button onClick={handleQuoteRenote}>引用リノート</button>
        </div>
      )}
    </div>
  );
};
