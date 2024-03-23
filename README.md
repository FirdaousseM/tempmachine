# Objectif

Le but de l'application est de lancer et gérer des machines virtuelles à l'a durée de vie temporaire.
Projet scolaire.

## Architecture

Le dossier contient 2 applications :

- un backend en nodejs (express) qui contient la logique des intéractions avec azure
- un frontend avec sveltekit qui représente les données face à l'utilisateur

## Prérequis

1. Avoir npm installé

2. Avoir un compte Azure avec la possibilité d'enregistrer une application

## Installation

1. Décompresser l'archive zip

2. Lancer npm install dans tempmachine_client/ et dans tempachine_api

3. Créer un fichier .env dans tempmachine_api/config/

4. Entrer les variables d'environnement dans tempmachine_api/config/.env (en suivant le format de .env.exemple)

## Configuration Azure (variable d'environnement)

1. Se connecter au portail azure

2. Enregistrer une application (App registrations)

3. Copier la valeur de "Application (client) ID" dans la variable d'environnement AZURE_CLIENT_ID

4. Copier la valeur de "Directory (tenant) ID" dans la variable d'environnement AZURE_TENANT_ID

5. Cliquer sur l'application enregistrée pour la gérer puis dans le menu "Manage" -> cliquer sur "Certificates and secrets"

_Attention : à l'étape suivant, un secret sera créé, il faut bien retenir sa valeur car il ne s'affiche qu'une fois !_

6. Créer une nouveau secret -> "New client secret"

7. Copier la valeur du secret dans la variable d'environnement AZURE_CLIENT_SECRET

8. Retour à l'accueil, aller dans "Subscriptions" pour récupérer la valeur du Subscription ID de l'abonnement utilisée. À copier dans la variable d'environnement AZURE_SUBSCRIPTION_ID

## Utilisation

Pour utiliser l'application, il est nécessaire de configurer azure

_Attention :_
_Les opérations azure mettent quelques secondes à se compléter._
_Veuillez patienter au moins 30 secondes lors de la création de groupe de ressources, et machine virtuelles._
_Il est normal qu'il ne s'affiche rien pendant ce temps._
_Il est recommendé d'ouvrir l'interface du portail azure en parallèle pour surveiller les actions lancées par l'application._
Tous les messages s'affichent tout de même en console (celle du backend expressJS)

1. Lancer avec un terminal
- le frontend : *dans tempmachine_client/* npm run dev  
- le backend : *dans tempmachine_api/* npm run dev 

2. Ouvrir le navigateur sur http://localhost://5173 (port par défaut, peut varier)

3. Connexion avec l'un des trois comptes :

- "Utilisateur All" qui possède tous les droits 
(
    email : userall@mail.com
    mot de passe : password
)
- "Utilisateur Linux" qui possède uniquement les droits de création de machine linux
(
    email : userlinux@mail.com
    mot de passe : password
)
- "Utilisateur None" qui ne possède aucun droit
(
    email : usernone@mail.com
    mot de passe : password
)

_Pour se reconnecter avec un autre compte, aller vers http://localhost://5173, il n'y a pas de déconnexion_

4. Sur la page dashboard, choisir le type et la durée de vie de la machine virtuelle

5. Cliquer sur le bouton pour la créer

6. La machine sera supprimée à la fin de sa durée de vie.

## Contact

firdaousse.moussa@supdevinci-edu.fr
