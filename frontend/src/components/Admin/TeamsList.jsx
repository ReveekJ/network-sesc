import React from 'react';
import './TeamsList.css';

const TeamsList = ({ teams, currentStage, surveyStatus }) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="teams-list">
        <h3>Зарегистрированные команды</h3>
        <p>Пока нет присоединившихся команд</p>
      </div>
    );
  }

  const isDraft = surveyStatus === 'draft';

  return (
    <div className="teams-list">
      <h3>Зарегистрированные команды ({teams.length})</h3>
      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <div className="team-name">{team.name}</div>
            <div className="team-info">
              {isDraft ? (
                <>
                  {team.joined_at && (
                    <div className="team-status">
                      <span className="status-label">Зарегистрирована:</span>
                      <span className="status-badge registered">
                        {new Date(team.joined_at).toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="team-status">
                    <span className="status-label">Вопрос:</span>
                    <span className={`status-badge ${team.question_status === 'answered' ? 'answered' : 'pending'}`}>
                      {team.question_status === 'answered' ? '✓ Отвечено' : '⏳ Ожидает'}
                    </span>
                  </div>
                  {currentStage === 'voting' && (
                    <div className="team-status">
                      <span className="status-label">Голосование:</span>
                      <span className={`status-badge ${team.voting_status === 'answered' ? 'answered' : 'pending'}`}>
                        {team.voting_status === 'answered' ? '✓ Проголосовано' : '⏳ Ожидает'}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsList;

