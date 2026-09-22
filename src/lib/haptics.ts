export function haptic(style: "light" | "medium" | "success" | "warning" = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const pattern =
    style === "success"
      ? [12, 40, 18]
      : style === "warning"
        ? [30, 40, 30]
        : style === "medium"
          ? [18]
          : [8];
  navigator.vibrate(pattern);
}
