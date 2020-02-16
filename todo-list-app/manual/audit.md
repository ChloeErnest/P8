
|                                       | Notre application  | Le site concurrent   | Conseils pour le site concurrent |
|---------------------------------------|--------------------|--------------------- |----------------------------------|
||![auditperso](./manual/asset/auditperso.jpg)|![auditconcu](./manual/asset/auditconcu.jpg)||
| Nombre de requêtes :                  |11                  |95                    |Il y a trop de **requêtes** qui prennent du temps concernant **les pubs**.|
| Temps de chargement des ressources :  |136ms               |2.06s                 |Sur notre application il y a très peu de ressources à charger. Dans le site concurrent, il y a **énormément** de ressources à charger (images, scripts, documents...).|
| Temps de chargement total de la page :|137ms               |5.60s                 |Temps de chargement total de la page **extrêmement long** en raison du *nombre de requêtes* et de *nombreuses ressources lourdes*.|
| Nombre de scripts :                   |7                   |30                    |Il faudrait *réduire le nombre de scripts*. Factoriser des fonctions, retirer des boucles et fonctionnalités inutiles. Il faudrait **ajouter** des *fonctions asynchrones* pour que le rendu continue pendant le téléchargement du script ou l'attribut *defer* pour **charger** les scripts en parallèle. Nous pourrions aussi tout à fait **compiler** les scripts.|
| Nombre d'images :                     |0                   |40                    |La plupart des images sont **lourdes**. Dans un premier temps, les passer en format *.jpg* les rendrait bien moins conséquentes. Ensuite, la plupart *peuvent être remplacées* par du **CSS** ou des **icônes fournies par des bibliothèques** car ce ne sont que des textures de fond ou des icônes lourdes et qui *mettent beaucoup de temps à être téléchargées*.|
| Nombre d'erreurs dans la consoles :   |0                   |3                     |Certaines choses **ne chargent pas** dans le site concurrent. Il y a des *erreurs* dans la *console* sans doute dues à *des problèmes* **dans le code**. Un code d'erreur **404** apparaît concernant *une pub*. Peut-être faudrait-il *retirer* ce qui ralentit la page, surtout si cela ne vient pas d'elle.|
| Nombres de font :                     |0                   |2                     |Elles sont justement chargées *par les pubs*, qui en plus d'être **lourdes**, chargent des *choses supplémentaires* alors qu'il y a déjà **beaucoup** de ressources à télécharger comme cela.|
| Nombre de documents :                 |1                   |11                    |Presque **tous** concernent des *pubs* (encore une fois) ou des *widgets* ajoutés en bas de page. S'ils ne sont pas utiles, peut-être serait-il judicieux de les *supprimer*. Ici, le plus lourd = **19KB** et met **218ms** à charger et concerne encore une fois une *publicité*. L'un d'eux affiche d'ailleurs le status **404** (not found) et concerne *l'apis Google*.|
| Requête la plus longue :              |"view.js" = 46ms    |"texture.png" = 656ms |Ici, nous sommes face au **majeur problème** du *site concurrent*. Il y a **9 requêtes** qui prennent plus de **200ms** à s'exécuter et **35** de plus de **100ms**. La plupart sont **uniquement** des *images* ! La plupart peuvent être simplement *retirées*. La plupart des *requêtes* les plus *lourdes* sont quant à elles presque uniquement liées **aux pubs** ou **à jQuery**, qui pourrait être remplacées par des méthodes plus modernes utilisant pour autant la même technologie.|
| Temps de loading :                    |44ms                |4ms                   |Il faut réduire le nombre de **scripts** et de **ressources** à *télécharger*.|
| Temps de scripting :                  |1080ms              |24ms                  |Il faut mettre en oeuvre les conseils donnés *ci-dessus* pour **réduire** *l'impact* des fichiers *javascript* sur la *durée de chargement* de la page.|
| Temps de rendering :                  |78ms                |8ms                   |Utiliser les scripts asynchrones permettrait un rendu plus rapide durant le téléchargement même des scripts.|
| Sécurité :                            |Mauvaise            |Elevée                |Notre application tournant sur un *serveur local*, elle n'utilise *pas* HTTPS, ceci dit, c'est quelque chose qui, de nos jours, devrait être utilisé par **tous** les sites. Désormais, ce n'est plus forcément payant et il existe de nombreux moyens d'assurer une **sécurité suffisante** aux utilisateurs. De plus, *deux librairies javascript* qui sont utilisées ici sont connues pour posséder des *vulnérabilités*. (Ici, il s'agit surtout de jQuery).|
| Affichage :                           |                    |                      |Il faudrait penser à *retirer* le **code CSS** *non utilisé* dans le code (information fournie par un audit effectué avec les outils de développement de Google Chrome). Les *couleurs* pourraient être mieux choisies (plus contrastées), les *polices d'écriture* plus sobres pour être chargées plus rapidement. La page n'est d'ailleurs pas *interactive sur mobile* **avant 10sec**, sans doute à cause d'un style *trop complexe et lourd* qu'il serait tout à fait possible de *simplifier*.|
| Améliorations :                       |                    |                      |Il faudrait **remplir** les champs *"title"*, *"alt"* de certains champs qui ne sont *pas* renseignés. Il faudrait aussi faire attention aux **ids** qui ne sont *pas* uniques. Il n'y a pas de **labels** dans les *formulaires*. Il manque des **attributs** "lang" sur les *éléments* "html". Il n'y a pas de *name="viewport"* sur la *balise* "meta".|

## Nombre de requêtes sur notre application :

Il est aussi possible de voir le temps de téléchargement des ressources et le temps de chargement complet au bas de l'image.

![networkperso](./manual/asset/networkperso.jpg)

## Nombre de requêtes sur le site concurrent :

Il est aussi possible de voir le temps de téléchargement des ressources et le temps de chargement complet au bas de l'image.

![networkconcu](./manual/asset/networkconcu.jpg)

## Performances des deux sites :

À gauche notre site, à droite le site concurrent :

![perfperso](./manual/asset/perfperso.jpg)
![perfconcu](./manual/asset/perfconcu.jpg)