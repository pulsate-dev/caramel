import { Link } from "react-router";

export interface TimelineButtonProps {
  link: string;
  linkText: string;
}

export const TimelineButton = ({ link, linkText }: TimelineButtonProps) => {
  return (
    <Link to={link}>
      <div>
        <p>{linkText}</p>
      </div>
    </Link>
  );
};
