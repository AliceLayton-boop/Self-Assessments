import React, { useState } from 'react';
import { User, Heart, Trophy, Users, Compass, Vote, ExternalLink, Search } from 'lucide-react';
import './App.css';

const App = () => {
  // Sample data structure - in real app this would come from a database
  const [currentUser] = useState({
    id: 'user123',
    username: 'GamerPro42',
    email: 'gamer@example.com'
  });

  // Assessment definitions
  const assessments = [
    { 
      id: 1, 
      name: 'Identify your interests', 
      icon: Search, 
      color: 'bg-blue-500',
      url: 'https://www.mynextmove.org/explore/ip'
    },
    { 
      id: 2, 
      name: 'Cite your skills', 
      icon: Trophy, 
      color: 'bg-green-500',
      url: '#' // Placeholder for Github link
    },
    { 
      id: 3, 
      name: 'Put your values to work', 
      icon: Heart, 
      color: 'bg-red-500',
      url: 'https://alicelayton-boop.github.io/Self-Assessments/values-assessment.htm'
    },
    { 
      id: 4, 
      name: 'Share your style', 
      icon: Compass, 
      color: 'bg-purple-500',
      url: 'https://www.16personalities.com/free-personality-test'
    },
    { 
      id: 5, 
      name: 'The place of politics', 
      icon: Vote, 
      color: 'bg-yellow-500',
      url: 'https://www.pewresearch.org/politics/quiz/political-typology/'
    }
  ];

  // Sample responses data - would be loaded from database
  const [responses, setResponses] = useState([
    {
      assessmentId: 1,
      completedDate: '2024-07-20',
      responses: {
        'Primary Gaming Interests': 'Strategy games, Role-playing',
        'Secondary Interests': 'Creative building, Puzzle solving',
        'Favorite Game Types': 'Single-player with co-op options',
        'Interest Level in Competition': 'Moderate - enjoy friendly competition'
      },
      matchingScore: 85
    },
    {
      assessmentId: 2,
      completedDate: '2024-07-21',
      responses: {
        'Communication Skills': 'Good at explaining strategies',
        'Leadership Abilities': 'Comfortable leading small groups',
        'Problem Solving': 'Strong analytical thinking',
        'Teamwork Skills': 'Collaborative and supportive'
      },
      matchingScore: 92
    },
    {
      assessmentId: 3,
      completedDate: '2024-07-22',
      responses: {
        'Core Values in Gaming': 'Fair play, respect for others',
        'Approach to Conflict': 'Seek understanding and compromise',
        'Helping Others': 'Enjoy mentoring new players',
        'Community Building': 'Value inclusive, welcoming spaces'
      },
      matchingScore: 78
    }
  ]);

  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Admin view - simplified matching data
  const [allUsersData] = useState([
    { 
      id: 'user123', 
      username: 'GamerPro42', 
      completedAssessments: 3,
      avgScore: 85,
      lastActive: '2024-07-22',
      tags: ['Strategy', 'Collaborative', 'Fair-play']
    },
    { 
      id: 'user456', 
      username: 'StrategyMaster', 
      completedAssessments: 5,
      avgScore: 91,
      lastActive: '2024-07-23',
      tags: ['Strategy', 'Competitive', 'Leader']
    },
    { 
      id: 'user789', 
      username: 'CasualGamer99', 
      completedAssessments: 4,
      avgScore: 73,
      lastActive: '2024-07-24',
      tags: ['Casual', 'Social', 'Inclusive']
    }
  ]);

  const getAssessmentById = (id) => assessments.find(a => a.id === id);
  
  const getResponseById = (id) => responses.find(r => r.assessmentId === id);

  const getCompletionStatus = (assessmentId) => {
    return responses.some(r => r.assessmentId === assessmentId);
  };

  const getButtonColorClasses = (assessmentId) => {
    const assessment = getAssessmentById(assessmentId);
    const colorMap = {
      'bg-blue-500': 'bg-blue-500 hover:bg-blue-600',
      'bg-green-500': 'bg-green-500 hover:bg-green-600',
      'bg-red-500': 'bg-red-500 hover:bg-red-600',
      'bg-purple-500': 'bg-purple-500 hover:bg-purple-600',
      'bg-yellow-500': 'bg-yellow-500 hover:bg-yellow-600'
    };
    return colorMap[assessment.color] || 'bg-blue-500 hover:bg-blue-600';
  };

  const UserView = () => (
    <div className="space-y-6">
      <div className="user-info">
        <div className="user-header">
          <User className="user-icon" />
          <h3 className="username">{currentUser.username}</h3>
        </div>
        <p className="completion-text">
          Completed: {responses.length}/5 assessments
        </p>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(responses.length / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="table-container">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Status</th>
              <th>Completed Date</th>
              <th>Matching Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => {
              const response = getResponseById(assessment.id);
              const Icon = assessment.icon;
              const isCompleted = getCompletionStatus(assessment.id);
              
              return (
                <tr key={assessment.id} className="table-row">
                  <td>
                    <div className="assessment-info">
                      <div className={`icon-container ${assessment.color.replace('bg-', 'bg-')}`}>
                        <Icon className="assessment-icon" />
                      </div>
                      <a 
                        href={assessment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="assessment-link"
                      >
                        {assessment.name}
                        <ExternalLink className="external-icon" />
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${isCompleted ? 'completed' : 'pending'}`}>
                      {isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {response ? response.completedDate : '-'}
                  </td>
                  <td>
                    {response ? (
                      <div className="score-container">
                        <span className="score-text">{response.matchingScore}%</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill"
                            style={{ width: `${response.matchingScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {isCompleted ? (
                        <button 
                          onClick={() => setSelectedAssessment(assessment.id)}
                          className={`view-button ${assessment.color.replace('bg-', 'btn-')}`}
                        >
                          View
                        </button>
                      ) : (
                        <a
                          href={assessment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="take-button"
                        >
                          Take Assessment
                          <ExternalLink className="external-icon-small" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-6">
      <div className="admin-info">
        <h3 className="admin-title">Admin Dashboard - User Matching Data</h3>
        <p className="admin-subtitle">
          Overview of all users and their assessment completion for matching purposes
        </p>
      </div>

      <div className="table-container">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Assessments</th>
              <th>Avg Score</th>
              <th>Last Active</th>
              <th>Matching Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsersData.map((user) => (
              <tr key={user.id} className="table-row">
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      <User className="avatar-icon" />
                    </div>
                    <div>
                      <p className="user-name">{user.username}</p>
                      <p className="user-id">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress-cell">
                    <span className="progress-text">{user.completedAssessments}/5</span>
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-fill"
                        style={{ width: `${(user.completedAssessments / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="avg-score">{user.avgScore}%</span>
                </td>
                <td className="date-cell">
                  {user.lastActive}
                </td>
                <td>
                  <div className="tags-container">
                    {user.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="match-button">Find Matches</button>
                    <button className="profile-button">View Profile</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AssessmentDetail = ({ assessmentId }) => {
    const assessment = getAssessmentById(assessmentId);
    const response = getResponseById(assessmentId);
    const Icon = assessment.icon;

    if (!response) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title-section">
              <div className={`modal-icon ${assessment.color.replace('bg-', 'bg-')}`}>
                <Icon className="modal-icon-svg" />
              </div>
              <div>
                <h3 className="modal-title">{assessment.name}</h3>
                <p className="modal-subtitle">Completed: {response.completedDate}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedAssessment(null)}
              className="close-button"
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="score-section">
              <p className="score-label">Matching Score</p>
              <div className="score-display">
                <span className="large-score">{response.matchingScore}%</span>
                <div className="large-progress">
                  <div 
                    className="large-progress-fill"
                    style={{ width: `${response.matchingScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="responses-section">
              <h4 className="responses-title">Your Responses</h4>
              <div className="responses-list">
                {Object.entries(response.responses).map(([question, answer]) => (
                  <div key={question} className="response-item">
                    <p className="question">{question}</p>
                    <p className="answer">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <a
              href={assessment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="retake-button"
            >
              Retake Assessment
              <ExternalLink className="footer-icon" />
            </a>
            <button 
              onClick={() => setSelectedAssessment(null)}
              className="close-footer-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="main-title">Gamer Assessment Dashboard</h1>
        <p className="main-subtitle">Manage and view self-assessment responses for better gaming friendships</p>
      </div>

      <div className="view-toggle">
        <button
          onClick={() => setViewMode('user')}
          className={`toggle-button ${viewMode === 'user' ? 'active' : ''}`}
        >
          User View
        </button>
        <button
          onClick={() => setViewMode('admin')}
          className={`toggle-button ${viewMode === 'admin' ? 'active' : ''}`}
        >
          Admin View
        </button>
      </div>

      {viewMode === 'user' ? <UserView /> : <AdminView />}

      {selectedAssessment && (
        <AssessmentDetail assessmentId={selectedAssessment} />
      )}
    </div>
  );
};

export default App;