import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./config";

export default getRequestConfig(async () => {
  let locale = routing.defaultLocale;

  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
    if (localeCookie && routing.locales.includes(localeCookie as "fr" | "ru")) {
      locale = localeCookie as "fr" | "ru";
    }
  } catch {
  }

  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
