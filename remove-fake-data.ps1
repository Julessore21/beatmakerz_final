# Script pour supprimer les fausses données du catalogue

$file = "src\app\web\catalogue\page.tsx"

Write-Host "Suppression des fausses données du catalogue..." -ForegroundColor Cyan

# Lire le contenu
$content = Get-Content $file -Raw

# Supprimer la fonction generateRandomBeats
$content = $content -replace '(?s)const generateRandomBeats = \(count: number\): Beat\[\] => \{.*?\};', ''

# Remplacer le fallback vers faux beats par un message d'erreur
$content = $content -replace 'setBeats\(generateRandomBeats\(96\)\);', 'setBeats([]); console.error("Catalogue vide - créez des beats via /admin/catalogue");'

# Écrire le nouveau contenu
$content | Set-Content $file -NoNewline

Write-Host "[SUCCESS] Fausses données supprimées!" -ForegroundColor Green
Write-Host ""
Write-Host "Le catalogue affichera maintenant UNIQUEMENT les vrais beats de MongoDB." -ForegroundColor White
Write-Host "Si le catalogue est vide, créez des beats via: http://localhost:3000/admin/catalogue" -ForegroundColor Yellow
