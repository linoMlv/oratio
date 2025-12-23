# 📘 **Oratio — Guide de création complet**

## 🧱 1. **Objectif de l’application**

Oratio est une webapp moderne permettant de :

* Coller ou saisir un texte dans une zone de texte enrichie.
* Lancer une correction intelligente via le modèle **Google Gemini 2.0 Flash**.
* Recevoir un **JSON normé** présentant chaque erreur détectée.
* Surligner dans le texte les zones incorrectes avec des codes couleur contrastés pour une meilleure lisibilité :
  * Orthographe (Rouge)
  * Grammaire (Bleu)
  * Syntaxe (Vert)
  * Répétition (Jaune)
  * Cohérence (Violet)
  * Ponctuation (Rose)
  * Style (Indigo)
* Afficher la correction au survol (avec délai de confort) et permettre à l'utilisateur d’appliquer, d'ignorer ou de **tout valider** en un clic.

Oratio vise une interface **simple, élégante, minimaliste**, inspirée des standards modernes type Notion, Grammarly, et Arc Browser.

---

# 🏗️ 2. **Stack complète**

* **Frontend :**
  * React 19 (Vite + SWC)
  * TypeScript
  * TailwindCSS (v3.4+)
  * Zustand (state management)
  * Lucide React (icônes)
  * **@google/genai** (SDK Google Gemini)

* **Backend :**
  * Aucun backend nécessaire (app 100% front client-side)
  * Appel direct API Google Gemini

* **Storage :**
  * localStorage (clé API + réglages utilisateur)

* **Déploiement :**
  * Vercel / Cloudflare Pages

---

# 🧩 3. **Architecture du projet**

```
/oratio
  /src
    /components
      Header.tsx
      ApiKeyModal.tsx
      Editor.tsx
    /hooks
      useApiKey.ts
    /lib
      api.ts (Client GoogleGenAI)
      types.ts (Interfaces JSON & State)
      prompt.ts (System Instruction)
    /store
      useStore.ts (Logique métier: calcul indices, application corrections)
    /styles
      globals.css
    App.tsx
    main.tsx
  index.html
  package.json
  tailwind.config.js
```

---

# 🎨 4. **Design & UX**

### **Interface Minimaliste**

#### 🌟 **Header**
* Logo "Oratio" (Serif moderne)
* Bouton “API Key” → Modal configuration (Google Gemini Key)

#### ✏️ **Éditeur Intelligent**
* **Mode Édition** : TextArea fluide pour la rédaction.
* **Mode Révision** : Affichage segmenté avec surlignage des erreurs.
* **Navigation** : Switch automatique vers le mode révision après analyse.

#### 🎯 **Actions**
* **Corriger** : Appel API avec loader.
* **Tout valider** : Bouton pour appliquer toutes les corrections en une fois.
* **Tooltips** : Apparaissent au survol, stables (délai de fermeture), au-dessus de l'interface (z-index élevé).

---

# 🧠 5. **Format JSON (API)**

Le modèle renvoie une structure stricte définie via `responseSchema` :

```json
{
  "corrections": [
    {
      "id": "uuid (optionnel)",
      "type": "grammar | spelling | syntax | repetition | coherence | punctuation | style",
      "original": "substring exacte",
      "suggestion": "correction proposée",
      "message": "Explication courte"
    }
  ]
}
```

ℹ️ **Note technique** : Les indices `start` et `end` ne sont **pas** demandés à l'IA. C'est le frontend (`useStore.ts`) qui scanne le texte original pour localiser les fragments (`original`) et calculer les positions précises.

---

# 🔥 6. **Prompt Système**

```text
You are Oratio, a professional linguistic correction engine.
Your job is to analyze French text and return ONLY a JSON structure.
You specialize in orthography, grammar, syntax, conjugation, punctuation, sentence structure, repetitions, clarity, and contextual coherence.

Your output must strictly follow the provided JSON schema.

Rules:
- NEVER add text outside the JSON.
- If the text contains no errors, return: { "corrections": [] }
- "original" MUST match the text in the user input EXACTLY.
- Return corrections IN THE ORDER they appear in the text.
- Combine multiple errors separately.
- Keep explanations short.
```

---

# ⚡ 7. **Intégration API (Google GenAI)**

Utilisation du SDK `@google/genai` avec **Structured Outputs** :

```ts
import { GoogleGenAI, Type } from "@google/genai";

const correctionSchema = {
  type: Type.OBJECT,
  properties: {
    corrections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: [...] },
          original: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          message: { type: Type.STRING },
        },
        required: ["type", "original", "suggestion", "message"]
      }
    }
  },
  required: ["corrections"]
};

// ... Appel
const response = await ai.models.generateContent({
  model: 'gemini-2.5-pro', 
  config: {
    responseMimeType: 'application/json',
    responseSchema: correctionSchema,
    systemInstruction: SYSTEM_PROMPT,
  },
  contents: [{ role: 'user', parts: [{ text }] }]
});
```

---

# 🧪 8. **Logique de Correction (Frontend)**

1.  **Réception** : L'API renvoie une liste de corrections avec `original` (substring).
2.  **Mapping** : `useStore` itère sur le texte pour trouver les indices (`start`/`end`) de chaque occurrence.
3.  **Affichage** : Le texte est découpé en segments (Text | Correction).
4.  **Application** :
    *   **Unitaire** : Remplace le segment et décale les indices des corrections suivantes.
    *   **Globale (Tout valider)** : Applique les corrections de la fin vers le début pour préserver les indices.

---

# 🚀 9. **Utilisation**

1.  Obtenir une clé API sur [Google AI Studio](https://aistudio.google.com/).
2.  Entrer la clé dans les paramètres (roue dentée).
3.  Saisir un texte et cliquer sur "Corriger".
4.  Valider les suggestions une par une ou en masse.

---