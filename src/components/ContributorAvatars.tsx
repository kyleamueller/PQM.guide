import Image from "next/image";
import Link from "next/link";
import { Contributor } from "@/lib/contributors";

interface ContributorAvatarsProps {
  contributors: Contributor[];
}

export default function ContributorAvatars({ contributors }: ContributorAvatarsProps) {
  if (contributors.length === 0) return null;

  return (
    <div className="contributors">
      <span className="contributors-label">Contributors</span>
      <div className="contributors-list">
        {contributors.map((c) => {
          const displayName = c.login ?? c.name;
          const inner = c.avatar ? (
            <Image
              src={c.avatar}
              alt={displayName}
              width={28}
              height={28}
              className="contributor-avatar"
              title={displayName}
            />
          ) : (
            <span className="contributor-avatar contributor-avatar--initials" title={displayName}>
              {displayName.slice(0, 2).toUpperCase()}
            </span>
          );

          return c.url ? (
            <Link
              key={displayName}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contributor-link"
              aria-label={`View ${displayName} on GitHub`}
            >
              {inner}
            </Link>
          ) : (
            <span key={displayName} className="contributor-link">
              {inner}
            </span>
          );
        })}
      </div>
    </div>
  );
}
