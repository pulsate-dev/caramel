import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import styles from "~/components/renoteMenu.module.css";
import type { action } from "~/routes/api.renote";

interface RenoteMenuProps {
  noteID: string;
}

export const RenoteMenu = ({ noteID }: RenoteMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenoted, setIsRenoted] = useState(false);
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
    if (fetcher.state === "idle") {
      if ("error" in fetcher.data) {
        setIsRenoted(false);
      }
    }
  }, [fetcher.data, fetcher.state]);

  const handleRenote = () => {
    setIsRenoted(true);
    setIsMenuOpen(false);
    fetcher.submit({ noteID }, { method: "post", action: "/api/renote" });
  };

  const handleQuoteRenote = () => {
    navigate(`/notes/${noteID}/renote`);
  };

  return (
    <div className={styles.renoteMenuContainer} ref={menuRef}>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        Renote {isRenoted && <span>(renoted)</span>}
      </button>
      {isMenuOpen && (
        <div className={styles.menu}>
          <button onClick={handleRenote}>Renote</button>
          <button onClick={handleQuoteRenote}>Quote</button>
        </div>
      )}
    </div>
  );
};
