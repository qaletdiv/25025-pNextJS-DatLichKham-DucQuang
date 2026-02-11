export type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
