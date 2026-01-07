<?php

namespace App\Services;

use Mpdf\Mpdf;
use App\Models\RecommendationRequest;
use App\Models\RecommendationLetter;
use Illuminate\Support\Facades\Storage;

class RecommendationLetterService
{
    public function generateLetter(RecommendationRequest $request)
    {
        $student = $request->student;
        $professor = $request->professor;
        $user = $student->user;
        $profUser = $professor->user;
        
        // Récupérer la mention DE LA DEMANDE
        $mention = $request->mention ?? 'Bien';
        $academicYear = '2024-2025';
        $master = $student->modules()->first()?->schoolClass?->name ?? 'Master';
        
        // Obtenir le template de lettre
        $letterContent = $this->getLetterTemplate(
            $mention,
            $user->name,
            $master,
            $profUser->name
        );
        
        // Créer PDF avec mPDF
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 15,
            'margin_bottom' => 15,
        ]);
        
        $mpdf->WriteHTML($letterContent);
        
        // Créer dossier s'il n'existe pas
        if (!Storage::exists('letters')) {
            Storage::makeDirectory('letters');
        }
        
        // Sauvegarder le PDF
        $filename = 'letter_' . $student->id . '_' . $professor->id . '_' . time() . '.pdf';
        $filePath = 'letters/' . $filename;
        
        $pdfContent = $mpdf->Output('', 'S');
        Storage::put($filePath, $pdfContent);
        
        // Sauvegarder en BD
        RecommendationLetter::create([
        'recommendation_request_id' => $request->id,  // ← Utiliser le bon nom
        'file_path' => $filePath,
        'mention_used' => $mention,
        'generated_at' => now(),
]);
        
        return $filePath;
    }
    
    private function getLetterTemplate($mention, $studentName, $master, $professorName)
    {
        $academicYear = '2024-2025';
        
        $templates = [
            'Très Bien' => $this->templateTresBien($studentName, $master, $professorName, $academicYear),
            'Bien' => $this->templateBien($studentName, $master, $professorName, $academicYear),
            'Assez Bien' => $this->templateAssezBien($studentName, $master, $professorName, $academicYear),
            'Passable' => $this->templatePassable($studentName, $master, $professorName, $academicYear),
        ];
        
        return $templates[$mention] ?? $templates['Bien'];
    }
    
    private function templateTresBien($studentName, $master, $professorName, $year)
    {
        return <<<HTML
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { font-size: 16px; margin: 0; color: #1a1a1a; }
                .date { text-align: right; margin-bottom: 20px; color: #666; }
                .content { text-align: justify; }
                .signature { margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LETTRE DE RECOMMANDATION</h1>
            </div>
            
            <div class="date">
                Année Universitaire: $year
            </div>
            
            <div class="content">
                <p>À qui de droit,</p>
                
                <p>Je soussigné, <strong>$professorName</strong>, professeur, certifie par la présente que 
                <strong>$studentName</strong>, étudiant(e) en <strong>$master</strong>, a démontré d'excellentes 
                qualités académiques et personnelles au cours de mes enseignements.</p>
                
                <p>$studentName s'est distingué(e) par :</p>
                <ul>
                    <li><strong>Excellence académique</strong> : Résultats remarquables, compréhension approfondie des concepts</li>
                    <li><strong>Engagement et motivation</strong> : Participation active, travail rigoureux et constant</li>
                    <li><strong>Qualités interpersonnelles</strong> : Collaboration exceptionnelle, leadership naturel</li>
                    <li><strong>Rigueur intellectuelle</strong> : Capacité d'analyse et pensée critique développée</li>
                </ul>
                
                <p>Je recommande vivement $studentName pour tout programme, opportunité d'emploi ou projet auquel il/elle 
                souhaite participer. Ses compétences, son sérieux et son dévouement en feront un(e) excellent(e) candidat(e).</p>
                
                <p>N'hésitez pas à me contacter pour toute information supplémentaire.</p>
                
                <p>Cordialement,</p>
            </div>
            
            <div class="signature">
                <p>_________________________</p>
                <p><strong>$professorName</strong><br>Professeur</p>
            </div>
        </body>
        </html>
        HTML;
    }
    
    private function templateBien($studentName, $master, $professorName, $year)
    {
        return <<<HTML
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { font-size: 16px; margin: 0; color: #1a1a1a; }
                .date { text-align: right; margin-bottom: 20px; color: #666; }
                .content { text-align: justify; }
                .signature { margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LETTRE DE RECOMMANDATION</h1>
            </div>
            
            <div class="date">
                Année Universitaire: $year
            </div>
            
            <div class="content">
                <p>À qui de droit,</p>
                
                <p>Je soussigné, <strong>$professorName</strong>, professeur, certifie par la présente que 
                <strong>$studentName</strong>, étudiant(e) en <strong>$master</strong>, a démontré de bonnes 
                qualités académiques et personnelles au cours de mes enseignements.</p>
                
                <p>$studentName s'est montré(e) :</p>
                <ul>
                    <li><strong>Compétent(e) académiquement</strong> : Bons résultats et compréhension solide</li>
                    <li><strong>Impliqué(e)</strong> : Participation régulière et travail sérieux</li>
                    <li><strong>Collaboratif(ve)</strong> : Bonne intégration dans le groupe</li>
                    <li><strong>Responsable</strong> : Respect des délais et engagement envers les projets</li>
                </ul>
                
                <p>Je recommande $studentName pour des opportunités d'études ou professionnelles. 
                Ses capacités et son professionnalisme constituent de bons atouts.</p>
                
                <p>Je reste disponible pour vous fournir tout complément d'information.</p>
                
                <p>Cordialement,</p>
            </div>
            
            <div class="signature">
                <p>_________________________</p>
                <p><strong>$professorName</strong><br>Professeur</p>
            </div>
        </body>
        </html>
        HTML;
    }
    
    private function templateAssezBien($studentName, $master, $professorName, $year)
    {
        return <<<HTML
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { font-size: 16px; margin: 0; color: #1a1a1a; }
                .date { text-align: right; margin-bottom: 20px; color: #666; }
                .content { text-align: justify; }
                .signature { margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LETTRE DE RECOMMANDATION</h1>
            </div>
            
            <div class="date">
                Année Universitaire: $year
            </div>
            
            <div class="content">
                <p>À qui de droit,</p>
                
                <p>Je soussigné, <strong>$professorName</strong>, professeur, certifie par la présente que 
                <strong>$studentName</strong>, étudiant(e) en <strong>$master</strong>, a suivi mes cours 
                et a montré des capacités académiques convenables.</p>
                
                <p>$studentName présente :</p>
                <ul>
                    <li><strong>Niveau académique satisfaisant</strong> : Résultats corrects</li>
                    <li><strong>Participation</strong> : Présence régulière aux cours</li>
                    <li><strong>Travail</strong> : Efforts fournis dans les projets assignés</li>
                    <li><strong>Comportement</strong> : Conduite appropriée</li>
                </ul>
                
                <p>Je peux recommander $studentName pour des poursuites d'études ou des opportunités professionnelles. 
                Il/elle dispose des compétences de base requises.</p>
                
                <p>Veuillez me contacter si vous avez besoin de précisions.</p>
                
                <p>Cordialement,</p>
            </div>
            
            <div class="signature">
                <p>_________________________</p>
                <p><strong>$professorName</strong><br>Professeur</p>
            </div>
        </body>
        </html>
        HTML;
    }
    
    private function templatePassable($studentName, $master, $professorName, $year)
    {
        return <<<HTML
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { font-size: 16px; margin: 0; color: #1a1a1a; }
                .date { text-align: right; margin-bottom: 20px; color: #666; }
                .content { text-align: justify; }
                .signature { margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LETTRE DE RECOMMANDATION</h1>
            </div>
            
            <div class="date">
                Année Universitaire: $year
            </div>
            
            <div class="content">
                <p>À qui de droit,</p>
                
                <p>Je soussigné, <strong>$professorName</strong>, professeur, certifie par la présente que 
                <strong>$studentName</strong>, étudiant(e) en <strong>$master</strong>, a suivi mes cours.</p>
                
                <p>$studentName a :</p>
                <ul>
                    <li><strong>Niveau académique</strong> : Acquis les connaissances de base</li>
                    <li><strong>Assiduité</strong> : Attendu régulièrement les cours</li>
                    <li><strong>Engagement</strong> : Effectué les travaux demandés</li>
                </ul>
                
                <p>Je peux confirmer que $studentName a complété le cours avec les compétences minimales requises.</p>
                
                <p>Veuillez me contacter pour tout besoin d'information supplémentaire.</p>
                
                <p>Cordialement,</p>
            </div>
            
            <div class="signature">
                <p>_________________________</p>
                <p><strong>$professorName</strong><br>Professeur</p>
            </div>
        </body>
        </html>
        HTML;
    }
}