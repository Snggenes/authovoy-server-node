export default function compareOrigins(
  firstOrigin: string,
  secondOrigin: string
) {
  firstOrigin = firstOrigin.replace(/\/$/, "");
  secondOrigin = secondOrigin.replace(/\/$/, "");

  if (firstOrigin === secondOrigin) {
    return true;
  }

  return false;
}
