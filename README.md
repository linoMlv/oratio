<div align="center">
  <br />
  <img src="public/logo.svg" alt="Oratio Logo" width="120" />
  <br />
  <h1 align="center">Oratio</h1>
  <p align="center">
    <strong>L'excellence linguistique par l'intelligence artificielle.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-Lighting_Fast-yellow?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Gemini-3.0_Flash-magenta?style=for-the-badge&logo=google" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 📖 À propos

**Oratio** est une application web minimaliste et puissante dédiée à la correction et à l'amélioration de textes. Conçue pour offrir une expérience d'écriture sans distraction, elle s'appuie sur la puissance du modèle **Google Gemini 3.0 Flash** pour analyser vos écrits en profondeur.

Au-delà de la simple orthographe, Oratio comprend le contexte, le style et la cohérence de vos phrases pour vous proposer des suggestions pertinentes et nuancées.

### ✨ Pourquoi Oratio ?

*   **Intelligence Contextuelle** : Analyse grammaticale, syntaxique et stylistique avancée.
*   **Interface Épurée** : Un design "Notion-like" qui favorise la concentration.
*   **Retour Instantané** : Corrections en temps réel avec explications claires.
*   **Contrôle Total** : Validez, ignorez ou appliquez toutes les suggestions en un clic.

---

## 🛠️ Stack Technique

Construit avec des technologies modernes pour garantir performance et fluidité :

*   **Core** : [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build** : [Vite](https://vitejs.dev/) (SWC)
*   **Design** : [TailwindCSS v3.4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/)
*   **State** : [Zustand](https://github.com/pmndrs/zustand)
*   **AI Engine** : [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini 3.0 Flash Preview)

---

## 🚀 Installation & Utilisation

### Prérequis

*   Node.js (v18+)
*   Une clé API Google Gemini ([Obtenir une clé](https://aistudio.google.com/))

### Installation

1.  **Cloner le dépôt**
    ```bash
    git clone https://github.com/coodlab/oratio.git
    cd oratio
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configuration**
    Créez un fichier `.env` à la racine (optionnel, la clé peut être définie dans l'UI) :
    ```env
    VITE_GEMINI_API_KEY=votre_cle_api_ici
    ```

4.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:5173`.

---

## 📝 Licence

Ce projet est distribué sous la licence **Creative Commons Attribution - Pas d'Utilisation Commerciale - Partage dans les Mêmes Conditions 4.0 International (CC BY-NC-SA 4.0)**.

Vous êtes autorisé à :
*   **Partager** — copier, distribuer et communiquer le matériel par tous moyens et sous tous formats.
*   **Adapter** — remixer, transformer et créer à partir du matériel.

Selon les conditions suivantes :
*   **Attribution** — Vous devez créditer l'œuvre, intégrer un lien vers la licence et indiquer si des modifications ont été effectuées.
*   **Pas d'Utilisation Commerciale** — Vous n'êtes pas autorisé à faire un usage commercial de cette œuvre, tout ou partie du matériel la composant.
*   **Partage dans les Mêmes Conditions** — Dans le cas où vous effectuez un remix, que vous transformez, ou créez à partir du matériel composant l'œuvre originale, vous devez diffuser l'œuvre modifiée dans les même conditions, c'est à dire avec la même licence avec laquelle l'œuvre originale a été diffusée.

---

## ✍️ Auteurs & Crédits

Un projet imaginé et développé par **Coodlab**.

*   **Développement & Design** : [Mallevaey Lino](https://github.com/linoMlv) (@linoMlv)

---

<div align="center">
  <i>Fait avec ❤️ et de l'IA.</i>
</div>
