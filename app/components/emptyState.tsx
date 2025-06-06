import { ReactNode } from "react";
import styles from "~/components/emptyState.module.css";

export function EmptyState({
  children,
  emoji,
}: {
  children: ReactNode;
  emoji: string;
}): ReactNode {
  return (
    <div className={styles.emptyStateContainer}>
      <span>{emoji}</span>
      {children}
    </div>
  );
}
