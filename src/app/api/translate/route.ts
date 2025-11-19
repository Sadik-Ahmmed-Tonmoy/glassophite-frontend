/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { texts, target } = await req.json();

    // const customGlossary: Record<string, string> = {
    //   Account: "অ্যাকাউন্ট",
    //   Settings: "সেটিংস",
    //   Logout: "লগ আউট",
    //   server: "লগ আউট",
    // };

    const glossary: Record<string, Record<string, string>> = {
      bn: {
        Account: "অ্যাকাউন্ট",
        Settings: "সেটিংস",
        Logout: "লগ আউট",
        server: "লগ আউট",
      },
      es: {
        // Spanish
        Profile: "Perfil",
        Settings: "Configuración",
        Logout: "Cerrar sesión",
      },
    };

    // Always use glossary translation if exists
    texts.map((text: string) => {
      if (glossary[target]?.[text]) return glossary[target][text]; // override
      return text; // fallback: send to API later
    });

    // Only send texts not in glossary to API
    const textsToTranslate = texts.filter(
      (t: string) => !glossary[target]?.[t]
    );

    let apiTranslations: string[] = [];
    if (textsToTranslate.length > 0) {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCfIDqsAcDMUKSaqjOfD0qfdao8ZfeeUcI`,
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
      apiTranslations = data.data.translations.map(
        (t: any) => t.translatedText
      );
    }

    // Merge API results with glossary
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

// without google api like i18translateon

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { texts, target } = await req.json();

//     // Your glossary for different languages
//     const customGlossary: Record<string, Record<string, string>> = {
//       bn: { // Bangla
//         Account: "অ্যাকাউন্ট",
//         Wishlist: "ইচ্ছা তালিকা",
//         Logout: "লগ আউট",
//         server: "সার্ভার",
//         Profile: "প্রোফাইল",
//       },
//       es: { // Spanish
//         Account: "Cuenta",
//         Wishlist: "Lista de deseos",
//         Logout: "Cerrar sesión",
//         server: "Servidor",
//         Profile: "Perfil",
//       },
//     };

//     // Translate using glossary; fallback to original text
//     const translations = texts.map((text: string) => {
//       return customGlossary[target]?.[text] || text;
//     });

//     return NextResponse.json({ translations });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Translation failed" }, { status: 500 });
//   }
// }
