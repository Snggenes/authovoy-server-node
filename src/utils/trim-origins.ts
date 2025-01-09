export default function trimOrigins(origin: string) {
  return origin.replace(/\/$/, "");
}
