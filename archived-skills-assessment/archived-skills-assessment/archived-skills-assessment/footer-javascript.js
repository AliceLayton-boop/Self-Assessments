**Step 3: Add the Footer JavaScript**

1. In your Self-Assessments repo, click "Add file" → "Create new file"
2. Type: `archived-skills-assessment/footer-javascript.js`
3. Copy and paste this JavaScript code:

<script>
// Auto-export to Google Sheets when 100% complete - DISABLED for Match Me button approach
(function() {
    console.log('Auto-export script loaded (disabled in favor of Match Me button)');
    
    // Keep the utility functions but disable auto-export
    function loadAssessmentData() {
        const savedData = localStorage.getItem('dashboardData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error('Error parsing saved data:', error);
                return {};
            }
        }
        return {};
    }
    
    function formatResultsForExport(assessmentId, assessmentData) {
        if (!assessmentData || !assessmentData.results) {
            return 'Not completed';
        }
        
        const results = assessmentData.results;
        
        switch (assessmentId) {
            case 'skills':
                if (results.topSkills && results.topSkills.length > 0) {
                    return results.topSkills.slice(0, 3).map(skill => 
                        typeof skill === 'string' ? skill : skill.skill || skill.name || 'Unknown'
                    ).join(', ');
                }
                return 'Skills completed';
                
            case 'values':
                if (results.topThreeValues && results.topThreeValues.length > 0) {
                    return results.topThreeValues.join(', ');
                }
                return 'Values completed';
                
            case 'interest':
                if (results.interests && results.interests.length > 0) {
                    return results.interests.join(', ');
                } else if (results.primaryInterest) {
                    return results.primaryInterest + (results.secondaryInterest ? ', ' + results.secondaryInterest : '');
                }
                return 'Interest completed';
                
            case 'personality':
                return results.type || results.personalityType || 'Personality completed';
                
            case 'gamingcharacter':
                if (results.playerType && results.personality && results.values) {
                    const personalityStr = results.personality.join(', ');
                    const valuesStr = results.values.join(', ');
                    return `${results.playerType} (${personalityStr} | ${valuesStr})`;
                } else if (results.playerType) {
                    return results.playerType;
                }
                return 'Gaming character completed';
                
            case 'political':
                return results.type || results.politicalOrientation || 'Political completed';
                
            case 'religious':
                let score = results.score || results.centralityScore;
                let level = results.level || results.centralityLevel;
                
                // If no score found but we have responses, calculate it
                if (!score && assessmentData.responses) {
                    const scoreQuestions = ['q1', 'q2', 'q3', 'q4', 'q6', 'q7', 'q8', 'q11', 'q12', 'q13', 'q14', 'q15'];
                    let totalScore = 0;
                    let validResponses = 0;
                    
                    scoreQuestions.forEach(questionId => {
                        const response = assessmentData.responses[questionId];
                        if (response && response !== '' && !isNaN(response)) {
                            totalScore += parseInt(response);
                            validResponses++;
                        }
                    });
                    
                    if (validResponses > 0) {
                        score = (totalScore / validResponses).toFixed(1);
                        const numScore = parseFloat(score);
                        if (numScore <= 1.5) level = 'Very Low Centrality';
                        else if (numScore <= 2.5) level = 'Low Centrality';
                        else if (numScore <= 3.5) level = 'Moderate Centrality';
                        else if (numScore <= 4.5) level = 'High Centrality';
                        else level = 'Very High Centrality';
                    }
                }
                
                if (score && level) {
                    return `${level} (${score}/5)`;
                } else if (score) {
                    return `Score: ${score}/5`;
                } else if (level) {
                    return level;
                } else {
                    return 'Religious completed';
                }
                
            default:
                return 'Assessment completed';
        }
    }
    
    // Make functions available for Match Me button
    window.loadAssessmentData = loadAssessmentData;
    window.formatResultsForExport = formatResultsForExport;
})();

// Match Me Button functionality
(function() {
    console.log('Match Me button script loaded');
    
    // Check for completion and show/hide Match Me button
    function updateMatchMeButton() {
        const data = loadAssessmentData();
        const requiredAssessments = ['skillsAssessment', 'valuesAssessment', 'interestAssessment', 'personalityAssessment', 'gamingCharacterAssessment'];
        
        const completedRequired = requiredAssessments.filter(key => 
            data[key] && data[key].results
        ).length;
        
        const percentage = Math.round((completedRequired / requiredAssessments.length) * 100);
        
        console.log(`Match Me check: ${completedRequired}/5 (${percentage}%)`);
        
        // Remove existing button if present
        const existingButton = document.getElementById('match-me-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        // If 100% complete, show Match Me button
        if (percentage === 100) {
            console.log('Showing Match Me button');
            showMatchMeButton();
        }
    }
    
    function showMatchMeButton() {
        // Create Match Me button
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'match-me-button';
        buttonContainer.style.cssText = `
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f0f8ff;
            border-radius: 15px;
            border: 2px solid #CB6335;
        `;
        
        buttonContainer.innerHTML = `
            <h3 style="color: #CB6335; margin-bottom: 15px;">🎉 All Required Assessments Complete!</h3>
            <p style="color: #5C697A; margin-bottom: 20px;">You're ready to be matched with other gamers!</p>
            <button onclick="transferToMatchForm()" style="
                background: #CB6335;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1.1em;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#A0522D'" onmouseout="this.style.background='#CB6335'">
                Match Me! 🚀
            </button>
        `;
        
        // Insert after the optional assessments section
        const optionalSection = document.querySelector('.assessment-section:last-child');
        if (optionalSection) {
            optionalSection.parentNode.insertBefore(buttonContainer, optionalSection.nextSibling);
        } else {
            // Fallback: append to container
            const container = document.querySelector('.container');
            if (container) {
                container.appendChild(buttonContainer);
            }
        }
        
        console.log('Match Me button added to page');
    }
    
    // Transfer data to match form
    window.transferToMatchForm = function() {
        console.log('Match Me button clicked - transferring data');
        const dashboardData = loadAssessmentData();
        
        // Store the dashboard data for the export form to read
        localStorage.setItem('transferredDashboardData', JSON.stringify(dashboardData));
        console.log('Dashboard data transferred:', dashboardData);
        
        // Navigate to the NEW match-me page
        window.location.href = '/match-me';
    };
    
    function loadAssessmentData() {
        const savedData = localStorage.getItem('dashboardData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error('Error parsing saved data:', error);
                return {};
            }
        }
        return {};
    }
    
    // Monitor for changes and update button visibility
    window.addEventListener('storage', updateMatchMeButton);
    
    // Check on page load
    setTimeout(updateMatchMeButton, 1000);
    
    // Also check when localStorage changes from current tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'dashboardData') {
            setTimeout(updateMatchMeButton, 500);
        }
    };
    
    console.log('Match Me button monitoring initialized');
})();

// FIXED MODAL FUNCTIONS - Updated for O*NET multiple interests
(function() {
    console.log('Fixed modal functions loaded');
    
    // FIXED: O*NET Interest Entry Modal - now asks for top three interests
    window.openInterestEntryModal = function() {
        const results = prompt('Enter your top three O*NET interest results separated by commas:\n\nExample: Realistic, Investigative, Artistic');
        if (results) {
            // Parse multiple interests from comma-separated input
            const interests = results.split(',').map(interest => interest.trim()).filter(interest => interest);
            
            if (interests.length > 0) {
                const interestData = {
                    primaryInterest: interests[0],
                    interests: interests,
                    allInterests: interests
                };
                
                saveManualResults('interest', interestData);
                console.log('O*NET interests saved:', interestData);
            } else {
                alert('Please enter at least one interest area.');
            }
        }
    };

    window.openPersonalityEntryModal = function() {
        const results = prompt('Enter your 16 Personalities type (e.g., ENFP-T):');
        if (results) {
            saveManualResults('personality', { type: results, personalityType: results });
        }
    };

    window.openPoliticalEntryModal = function() {
        const results = prompt('Enter your Pew Research political type:');
        if (results) {
            saveManualResults('political', { type: results, politicalOrientation: results });
        }
    };

    // Save manual results function
    function saveManualResults(assessmentType, results) {
        let dashboardData = loadAssessmentData();
        const key = assessmentType + 'Assessment';
        
        dashboardData[key] = {
            results: results,
            completedDate: new Date().toISOString(),
            assessmentType: assessmentType,
            source: 'manual_entry'
        };
        
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        
        // Trigger dashboard update
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        // Trigger Match Me button check
        setTimeout(function() {
            if (typeof updateMatchMeButton === 'function') {
                updateMatchMeButton();
            }
        }, 500);
        
        console.log(`${assessmentType} results saved successfully:`, results);
        alert(`${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} assessment results saved successfully!`);
    }

    function loadAssessmentData() {
        const savedData = localStorage.getItem('dashboardData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error('Error parsing saved data:', error);
                return {};
            }
        }
        return {};
    }
    
    console.log('Fixed modal functions initialized');
})();
</script>

Copy this entire JavaScript code and commit it. Once that's done, your skills assessment will be safely archived on GitHub and we can start removing it from your live system!
