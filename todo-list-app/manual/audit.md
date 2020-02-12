# audit du site concurrent

Premier point à noter, l'application met du temps à s'afficher. La liste s'affiche après coup, les publicités s'affichent avant l'affichage des tâches elles-mêmes...

Beaucoup de fonctionnalités font des erreurs dans la console...

Je ne vois pas l'intérêt non plus de la différence entre "Projects" et "Today's Tasks" sachant qu'on ne peut pas mettre de todo dans les projets qui correspondraient d'une façon ou d'une autre.

Cela dit, le système de filtres dans les tâches est intéressant, notamment le tri par ordre alphabétique, la mise en highlight des trois premières tâches...

Pouvoir repousser une tâche au lendemain est aussi intéressant, mais je ne pense pas que ce soit indispensable. Ce n'est pas très intuitif non plus.

L'ajout de nouvelles listes ou de catégories est intéressant.
****
****
## outil network de Google Chrome
****
Le dernier script à être exécuté est celui qui va chercher favicon.ico (158ms).

Il y a beaucoup de scripts javascript, notamment du jquery.

Il y a beaucoup d'images, certaines très lourdes, les plus lentes mettant jusqu'à 510ms et 470ms à charger.

Il y a une "Doc" qui affiche un code d'erreur 404 dans l'outil network : "fastbutton".

Dans ce même onglet, il y a 2 pubs(googleads), dont une qui met beaucoup de temps à charger (444ms).
****
****
## outil audits
****
### notes
****
Performance : 35

Accessibility : 38

Best Practices : 57

SEO : 78
****
### performance
****
Deux problèmes de performance sont dûs au chargement des polices d'écritures et des images. Le DOM ne charge pas assez vite.

Ensuite, deux autres problèmes (rouges, 7.1 et 12.9sec) sont dûs aux scripts qui ne sont pas optimisés. Du coup c'est très lent et cela se répercute sur les performances de l'application. Le temps entre le moment où la page charge et le moment où l'utilisateur peut intéragir avec l'application est beaucoup trop long.

Pour finir, la tâche la plus longue de l'application met 1.100ms. C'est dû à tout ce qui se passe plus haut. 
****
### accessibilité
****
L'audit nous dit que les couleurs choisies ne sont pas suffisamment contrastées.

Il y aurait un problème d'id, sur la page, qui ne serait pas unique.

Il manque des noms et des labels que certaines balises.

Il n'y a pas de langue sur les balises html.
****
### Best practices
****
L'application n'utilise pas HTTPS, ce qui réduit la sécurité. De même pour les ressources de l'application.

Les scripts utilisent des formulations réputées pour être lentes.

Les scripts utilisent des librairies connues pour avoir des vulnérabilités en terme de sécurité.

Comme dit précédemment, il y a des erreurs dans la console.
****
### Autre
****
L'appli n'est pas suffisamment mobile friendly. 
Beaucoup d'éléments manquent de balises "alt".
****
### Progressive Web App
****
La page ne sera pas suffisamment rapide pour les mobiles (elle ne l'est déjà pas pour les laptops) (elle n'est intéractive qu'au bout de 13.8sec).

L'application n'est pas utilisable hors ligne, même si c'est plutôt normal pour ce genre d'appli.

****
****

## Dareboost
****
### Notes :
****
62% (encore nettement sous la norme)

12 problèmes.

11 améliorations.

68 succès.
****
### Sécurité :
****
0/100.

Il faudrait utiliser HTTPS pour collecter des données sensibles.
La langue n'est pas spécifiée.
Il manque une politique de sécurité sur la provenance des ressources.
****
### Requêtes :
****
L'une d'elle est inaccessible. Le problème peut venir du code, du serveur, ou des services utilisés qui ne répondent pas.

Il manque une politique de cache avec Apache dans les requêtes. (Cache-Control, ETag, Expires)

Il serait possible d'économiser des requêtes à l'aide de sprites CSS.

Il y a deux dépendances critiques qui risquent de rendre le site indisponible si l'un des fournisseurs rencontre un problème.
****
### Javascript :
****
La page doit charger des scripts trop longs et lourds. Il faudrait les séparer en plusieurs morceaux pour les faire charger en différé.
****
### jQuery :
****
Ce n'est pas la bonne version de jQuery et il faudrait envisager d'utiliser une autre version.
****
### Référencement :
****
Il n'y a pas d'attribut alt sur les images.
****
### Qualité : 
****
Certains éléments utilisent les mêmes identifiants.

