# 🤖 42_BOCAL_ASSISTANT

### Une interface de chat optimisée et immersive, propulsée par Mistral AI.

**42_BOCAL_ASSISTANT** est un outil conçu pour l'écosystème de **42 Paris**. Il fusionne l'esthétique "Terminal" emblématique de l'école avec la puissance des modèles de langage de **Mistral AI**. L'objectif est d'offrir un support technique et pédagogique fluide, tout en respectant les standards de performance et d'élégance algorithmique.

---

## ✨ Fonctionnalités clés

* ⚡ **Streaming Temps Réel** : Implémentation de `ReadableStreams` pour un affichage progressif des réponses, minimisant la latence perçue par l'utilisateur.
* 🎨 **Design "Bocal"** : Interface Dark Mode sur mesure utilisant les codes graphiques de 42 (accents Cyan `#00babc`, polices monospaces, conteneurs arrondis).
* 🧠 **Knowledge Base Interactive** : Système de templates pré-enregistrés permettant de simuler une base de connaissances métier avec un effet d'écriture réaliste.
* 🖱️ **Easter Egg "GO_TO_CAMPUS"** : Logo 42 interactif avec effets de halo lumineux et liens dynamiques vers les ressources de l'école.

---

## 🛠️ Stack Technique

| Technologie | Rôle |
| :--- | :--- |
| **Next.js 14** | Framework React & Architecture API Routes |
| **Mistral AI SDK** | Intégration du modèle `mistral-tiny` pour l'efficience |
| **Tailwind CSS** | Design system utilitaire et gestion du responsive |
| **Lucide React** | Set d'icônes minimalistes haute définition |
| **TypeScript** | Typage statique pour une maintenance et une robustesse accrues |

---

## ⚙️ Installation & Lancement

Suivez ces étapes pour déployer le projet localement :

### 1. Pré-requis
* **Node.js** : version 18.17.0 ou supérieure.
* **Gestionnaire de paquets** : npm (inclus avec Node) ou yarn.
* **Clé API Mistral** : Obtenez-en une sur la [Console Mistral AI](https://console.mistral.ai/).

### 2. Procédure d'installation

# 1. Clonage du projet
git clone https://github.com/votre-username/42-bocal-assistant.git
cd 42-bocal-assistant

# 2. Installation des dépendances (via npm)
npm install

# 3. Configuration de la clé API
### Créez le fichier .env.local et ajoutez votre clé Mistral
echo "MISTRAL_API_KEY=votre_cle_mistral_ici" > .env.local

# 4. Lancement de l'environnement de développement
npm run dev

## Une fois le serveur démarré, l'application est accessible sur :

🚀 http://localhost:3000

## 📜 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
