interface CraftMarkProps {
  id: string;
}

export function CraftMark({ id }: CraftMarkProps) {
  return (
    <svg viewBox="0 0 32 32" className="lp-hex-mark" aria-hidden="true">
      {markFor(id)}
    </svg>
  );
}

function Mono({ children }: { children: string }) {
  return (
    <text
      x="16"
      y="21"
      textAnchor="middle"
      fontSize={children.length > 2 ? 9 : 13}
      fontFamily="Georgia, 'Times New Roman', serif"
      fill="currentColor"
      stroke="none"
    >
      {children}
    </text>
  );
}

function markFor(id: string) {
  switch (id) {
    case "react-native":
      return <Mono>RN</Mono>;
    case "react":
      return (
        <>
          <ellipse cx="16" cy="16" rx="12" ry="4.4" />
          <ellipse cx="16" cy="16" rx="12" ry="4.4" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="12" ry="4.4" transform="rotate(120 16 16)" />
          <circle cx="16" cy="16" r="2.1" fill="currentColor" stroke="none" />
        </>
      );
    case "tailwind":
      return (
        <>
          <path d="M4 12c2.4-3 4.6-3 7 0s4.6 3 7 0 4.6-3 7 0" />
          <path d="M4 19c2.4-3 4.6-3 7 0s4.6 3 7 0 4.6-3 7 0" />
        </>
      );
    case "html":
      return (
        <>
          <path d="M12 8 L6 16 L12 24" />
          <path d="M20 8 L26 16 L20 24" />
          <path d="M18 7 L14 25" />
        </>
      );
    case "css":
      return (
        <>
          <path d="M13 8c-4 1.6-5 3.6-5 8s1 6.4 5 8" />
          <path d="M19 8c4 1.6 5 3.6 5 8s-1 6.4-5 8" />
        </>
      );
    case "node":
      return (
        <>
          <polygon points="16,5 26,11 26,21 16,27 6,21 6,11" />
          <circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none" />
        </>
      );
    case "mysql":
      return (
        <>
          <ellipse cx="16" cy="9" rx="8" ry="3.2" />
          <path d="M8 9v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V9" />
          <path d="M8 14c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" />
        </>
      );
    case "firebase":
      return (
        <>
          <path d="M16 5 L27 25 H5 Z" />
          <path d="M13 25 L19 13 L23 25" />
        </>
      );
    case "tools":
      return (
        <>
          <circle cx="11" cy="12" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="21" cy="12" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="11" cy="21" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="21" cy="21" r="1.7" fill="currentColor" stroke="none" />
        </>
      );
    case "next":
      return <Mono>N</Mono>;
    case "typescript":
      return <Mono>TS</Mono>;
    case "javascript":
      return <Mono>JS</Mono>;
    case "jquery":
      return <Mono>jQ</Mono>;
    case "express":
      return <Mono>Ex</Mono>;
    case "php":
      return <Mono>php</Mono>;
    case "codeigniter":
      return <Mono>CI</Mono>;
    case "wordpress":
      return <Mono>W</Mono>;
    default:
      return <Mono>{id.slice(0, 2).toUpperCase()}</Mono>;
  }
}
