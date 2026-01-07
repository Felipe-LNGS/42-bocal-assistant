import { Mistral } from '@mistralai/mistralai';

// --- INITIALISATION DU CLIENT ---
// On instancie le client Mistral avec la clé API stockée dans les variables d'environnement.
// Utilité : Sécurité. Ne jamais écrire la clé en dur dans le code pour éviter qu'elle soit volée sur GitHub.
const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req: Request) {
  // On récupère l'historique des messages envoyé par le frontend
  const { messages } = await req.json();

  /**
   * APPEL À L'API MISTRAL (MODE STREAM)
   * Utilité : On utilise 'mistral-tiny' pour sa rapidité et son coût réduit.
   * Le rôle "system" permet de définir la personnalité de l'IA dès le départ.
   */
  const response = await client.chat.stream({
    model: "mistral-tiny",
    messages: [
      { 
        role: "system", 
        content: "Tu es un assistant expert pour les étudiants de l'école 42. Ton ton est technique, concis et utile. Tu connais parfaitement la culture de l'école (le Bocal, les clusters, les projets C, etc.)." 
      },
      ...messages
    ],
  });

  /**
   * CRÉATION DU FLUX DE DONNÉES (ReadableStream)
   * Utilité : C'est ici que l'on transforme la réponse brute de Mistral en un flux compatible
   * avec le navigateur (fetch).
   * Pourquoi : Sans cela, le navigateur devrait attendre que TOUTE la réponse soit prête avant d'afficher quoi que ce soit.
   */
  const stream = new ReadableStream({
    async start(controller) {
      // On boucle sur chaque "chunk" (morceau de texte) envoyé par Mistral
      for await (const chunk of response) {
        const content = chunk.data.choices[0].delta.content;
        
        if (content) {
          // On encode le texte en binaire pour le transmettre via le réseau
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      // On ferme la connexion une fois que Mistral a fini de parler
      controller.close();
    },
  });

  // On renvoie le flux au frontend
  return new Response(stream);
}