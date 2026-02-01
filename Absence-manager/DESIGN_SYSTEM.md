# 🎨 Design System - Absence Manager

## Vue d'ensemble
Système de design professionnel avec un **thème bleu unifié** pour tous les rôles utilisateurs (Prof/Admin/Étudiant).

---

## 📊 Palette de Couleurs Unifiée

### 🔵 **Thème Principal : Bleu Professionnel**
- **Primaire** : `#2563eb` (Blue-600) - Actions principales, boutons
- **Primaire foncé** : `#1e40af` (Blue-800) - Headers, gradients
- **Primaire clair** : `#3b82f6` (Blue-500) - Focus, hover states
- **Background primaire** : `#eff6ff` (Blue-50) - Cartes actives
- **Border primaire** : `#3b82f6` (Blue-500) - Bordures accent

### 🎯 **Couleurs Sémantiques** (conservées pour leur signification)
- **Succès** : `#059669` (Green-600) - Validations, approbations, présences
- **Danger/Erreur** : `#dc2626` (Red-600) - Rejets, absences, suppressions
- **Avertissement** : `#d97706` (Amber-600) - Attention, en attente
- **Neutre** : `#64748b` (Slate-500) - Texte secondaire, borders

### 🖼️ **Backgrounds**
- **Page** : `#f8fafc` (Slate-50)
- **Cartes** : `#ffffff` (White)
- **Tableaux header** : `from-blue-700 to-blue-600` (Gradient)

---

## 🏗️ Composants Standards

### Buttons
```
Primaire : bg-blue-600 text-white hover:bg-blue-700 
Secondaire : bg-gray-200 text-gray-900 hover:bg-gray-300
Succès : bg-green-600 text-white hover:bg-green-700
Danger : bg-red-600 text-white hover:bg-red-700
```

### Cards
```
bg-white shadow-md rounded-lg border-l-4 border-blue-500 p-6
```

### Headers (toutes les pages)
```
bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8
```

### Table Headers
```
bg-gradient-to-r from-blue-700 to-blue-600 text-white
```

### Badges de Statut
```
En attente : bg-amber-100 text-amber-800
Approuvé/Présent : bg-green-100 text-green-800
Rejeté/Absent : bg-red-100 text-red-800
```

### Focus States
```
focus:ring-2 focus:ring-blue-500 focus:border-blue-500
```

---

## 📐 Espacement & Typographie
- **H1** : text-4xl font-bold text-white (dans headers)
- **H2** : text-2xl font-bold
- **H3** : text-lg font-semibold
- **Body** : text-base text-gray-700
- **Small** : text-sm text-gray-600

- **Padding** : p-4, p-6, p-8
- **Gap** : gap-2, gap-3, gap-4
- **Margin** : mb-4, mb-6, mb-8

---

## 🎯 Navigation

### Barre de Navigation
```
bg-gradient-to-r from-blue-800 to-blue-700
```

### Liens actifs
```
bg-blue-700 text-white
```

### Liens hover
```
hover:bg-blue-700/50 hover:text-white
```

---

## 📱 Cohérence Visuelle

Le thème bleu unifié assure :
- ✅ Une identité visuelle cohérente
- ✅ Aucun conflit de couleurs entre les pages
- ✅ Une expérience utilisateur harmonieuse
- ✅ Les couleurs sémantiques (vert=succès, rouge=erreur) sont préservées
- Actions positives en vert

---

## ✨ Principes de Design

1. **Hiérarchie Visuelle** : Tailles et couleurs progressives
2. **Cohérence** : Même couleur primaire pour chaque rôle
3. **Accessibilité** : Contraste suffisant (WCAG AA minimum)
4. **Affordance** : Les boutons sont clairement cliquables
5. **Feedback** : Changements visuels au hover/click

---

## 🔄 État des Composants

### Transitions
```
transition hover:shadow-lg duration-200 ease-in-out
```

### Focus States
```
focus:ring-2 focus:ring-[COLOR]-500 focus:ring-offset-2
```

### Disabled States
```
opacity-50 cursor-not-allowed
```

---

## 📋 À Implémenter

- [ ] Refonte Dashboard Professeur
- [ ] Refonte Dashboard Admin
- [ ] Refonte Dashboard Étudiant
- [ ] Refonte Pages de Justifications
- [ ] Refonte Pages de Sessions
- [ ] Refonte Navigation/Layout
- [ ] Tests d'accessibilité

