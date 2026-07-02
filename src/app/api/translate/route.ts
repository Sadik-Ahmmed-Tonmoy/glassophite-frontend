/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { texts, target } = await req.json();

    const glossary: Record<string, Record<string, string>> = {
      bn: {
        Account: "অ্যাকাউন্ট",
        Settings: "সেটিংস",
        Logout: "লগ আউট",
        server: "লগ আউট",
      },
      es: {
        Profile: "Perfil",
        Settings: "Configuración",
        Logout: "Cerrar sesión",
      },
    };

    const textsToTranslate = texts.filter(
      (t: string) => !glossary[target]?.[t]
    );

    let apiTranslations: string[] = [];
    if (textsToTranslate.length > 0 && GOOGLE_TRANSLATE_API_KEY) {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: textsToTranslate,
            target,
            source: "en",
            format: "text",
          }),
        }
      );

      const data = await res.json();
      apiTranslations = data?.data?.translations?.map(
        (t: any) => t.translatedText
      );
    } else if (textsToTranslate.length > 0 && !GOOGLE_TRANSLATE_API_KEY) {
      apiTranslations = textsToTranslate.map(() => "");
    }

    let apiIndex = 0;
    const merged = texts.map((t: string) =>
      glossary[target]?.[t] ? glossary[target][t] : apiTranslations[apiIndex++]
    );

    return NextResponse.json({ translations: merged });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
