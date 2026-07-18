export type ToastVariant = "success" | "error" | "info";

export const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "bg-card border-acent/40 text-foreground",
  error: "bg-card border-red-500/40 text-foreground",
  info: "bg-card border-border text-foreground",
};

export const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  success: "text-accent",
  error: "text-red-400",
  info: "text-muted",
};
