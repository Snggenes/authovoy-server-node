import trimOrigins from "./trim-origins";

export default function compareOrigins(
  firstOrigin: string,
  secondOrigin: string
) {
  const trimmedFirstOrigin = trimOrigins(firstOrigin);
  const trimmedSecondOrigin = trimOrigins(secondOrigin);

  if (trimmedFirstOrigin === trimmedSecondOrigin) {
    return true;
  }

  return false;
}
