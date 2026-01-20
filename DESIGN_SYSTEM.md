# 🎨 Design System - Absence Manager

## Vue d'ensemble
Système de design professionnel avec thématiques spécifiques par rôle utilisateur (Prof/Admin/Étudiant).

---

## 📊 Palettes de Couleurs

### 👨‍🏫 **Thématique PROFESSEUR**
**Thème : Bleu Professionnel + Gris Moderne**
- **Primaire** : `#1e40af` (Bleu Indigo 800) - Actions principales, headers
- **Secondaire** : `#0369a1` (Cyan 700) - Accents, hover states
- **Succès** : `#059669` (Vert Émeraude 600) - Validations, approbations
- **Alerte** : `#dc2626` (Rouge 600) - Actions destructrices, rejets
- **Avertissement** : `#d97706` (Ambre 500) - Attention, en attente
- **Neutre** : `#64748b` (Ardoise 500) - Texte secondaire, borders
- **Background** : `#f8fafc` (Ardoise 50) - Fonds

### 👨‍💼 **Thématique ADMINISTRATEUR**
**Thème : Violet + Gris Charbon**
- **Primaire** : `#7c3aed` (Violet 600) - Actions principales
- **Secondaire** : `#6d28d9` (Violet 700) - Focus states
- **Succès** : `#059669` (Vert)
- **Alerte** : `#dc2626` (Rouge)
- **Avertissement** : `#f59e0b` (Ambre 400)
- **Neutre** : `#4b5563` (Charbon)
- **Background** : `#faf5ff` (Violet 50)

### 👨‍🎓 **Thématique ÉTUDIANT**
**Thème : Vert Frais + Bleu Ciel**
- **Primaire** : `#16a34a` (Vert 600) - Actions, validations
- **Secondaire** : `#0ea5e9` (Cyan 500) - Accents, liens
- **Succès** : `#059669` (Vert Émeraude)
- **Alerte** : `#dc2626` (Rouge)
- **Avertissement** : `#fbbf24` (Ambre 300) - Attention plus douce
- **Neutre** : `#6b7280` (Gris 500)
- **Background** : `#f0fdf4` (Vert 50)

---

## 🏗️ Composants Standards

### Buttons
```
Primaire : bg-[COLOR]-600 text-white hover:bg-[COLOR]-700 
Secondaire : bg-gray-200 text-gray-900 hover:bg-gray-300
Succès : bg-green-600 text-white hover:bg-green-700
Danger : bg-red-600 text-white hover:bg-red-700
```

### Cards
```
bg-white shadow-md rounded-lg border border-gray-200
padding: p-6 ou p-4
```

### Headers
```
bg-gradient-to-r from-[COLOR]-600 to-[COLOR]-700 text-white py-4 px-6
```

### Badges
```
En attente : bg-[COLOR]-100 text-[COLOR]-800
Approuvé : bg-green-100 text-green-800
Rejeté : bg-red-100 text-red-800
```

---

## 📐 Espacement & Typographie
- **H1** : text-3xl font-bold
- **H2** : text-2xl font-bold
- **H3** : text-lg font-semibold
- **Body** : text-base text-gray-700
- **Small** : text-sm text-gray-600

- **Padding** : p-4, p-6, p-8
- **Gap** : gap-2, gap-3, gap-4
- **Margin** : mb-4, mb-6, mb-8

---

## 🎯 Zones de Focus

### Dashboard Professeur
- Header gradient bleu
- Cartes de stats avec couleurs distinctes
- Section alerte en jaune/ambre
- Actions claires : Vert (approuver), Bleu (voir), Rouge (rejeter)

### Dashboard Admin
- Header gradient violet
- Tables modernes avec hover effects
- Badges de statut clairs

### Dashboard Étudiant
- Header gradient vert
- Cartes de modules en cyan
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

