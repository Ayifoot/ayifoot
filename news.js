// Vercel Serverless Function — relais pour SerpApi
// Contourne la limitation CORS qui empêche le navigateur d'appeler
// SerpApi directement. Ce fichier tourne sur le serveur de Vercel,
// pas dans le navigateur, donc CORS ne s'applique pas ici.
//
// Déploiement : placer ce fichier dans /api/news.js à la racine du repo
// (à côté de index.html, PAS dans un sous-dossier supplémentaire).
// Vercel le détecte automatiquement comme une fonction serverless,
// accessible ensuite à l'URL : https://ayifoot.com/api/news
//
// tbm configurable : "nws" (actualités, défaut) ou "vid" (vidéos —
// renvoie video_results avec title/link/thumbnail/duration/date,
// utilisé pour la section Vidéos & Highlights).

export default async function handler(req, res) {
  const SERP_KEY = process.env.SERP_API_KEY || "6cc95f9fa63348beb0c700408be056de";
  const query = req.query.q || "Haiti Grenadiers football Coupe Monde 2026";
  const tbm = req.query.tbm === "vid" ? "vid" : "nws";

  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=${tbm}&num=10&hl=fr&api_key=${SERP_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Autorise ton propre site à lire cette réponse
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate"); // cache 2min côté Vercel

    return res.status(200).json(data);
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Erreur serveur relais SerpApi", details: String(error) });
  }
}
